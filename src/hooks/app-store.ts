"use client";
import { fromActiveId } from "@/lib/utils";
import { nanoid } from "nanoid";
import { append, assocPath, filter, find } from "ramda";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface DraggableStateComponent {
  id?: string;
  cid?: string;
  jsx?: string;
}

export interface CanvasRow {
  height: number;
  panels: string[];
}

export interface AppState {
  currentComponent: DraggableStateComponent;
  droppedComponents?: DraggableStateComponent[];
  storedComponents?: DraggableStateComponent[];
  rows: Record<string, { page: string; rows: CanvasRow[] }>;
  panels: Record<string, Record<string, DraggableStateComponent[]>>;
  panelProps: Record<string, Record<string, { height?: number }>>;
  canvasRows: { order: number; defaultSize: number }[][];
  isEditCanvas: boolean;
  isMagicInputHidden: boolean;
  isMagicInputToggled: boolean;
  setIsMagicInputToggled: (isToggled: boolean) => void;
  setIsMagicInputHidden: (isHidden: boolean) => void;
  toggleIsEditCanvas: () => void;
  addCanvasPanel: (rowIndex: number) => void;
  addCanvasRow: () => void;
  setCurrentComponent: (c: DraggableStateComponent) => void;
  addDroppedComponent: (activeId?: string) => void;
  addToCanvasPanel: (panelId: string, page: string) => void;
  addToCanvasPanelFromInventory: (
    panelId: string,
    componentId: string,
    page?: string
  ) => void;
  switchToCanvasPanel: (
    panelId: string,
    panelFromId: string,
    componentId: string,
    page: string
  ) => void;
  updateCanvasPanel: ({
    page,
    panelId,
    props,
  }: {
    page: string;
    panelId: string;
    props: Record<string, unknown>;
  }) => void;
  removeByIdDroppedComponent: (id: string) => void;
  addStoredComponent: (id: string, page?: string) => void;
  clearInventory: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentComponent: {},
      droppedComponents: undefined,
      storedComponents: undefined,
      isEditCanvas: false,
      isMagicInputHidden: false,
      isMagicInputToggled: false,
      setIsMagicInputToggled: (isToggled: boolean) =>
        set((state) => {
          return {
            ...state,
            isMagicInputToggled: isToggled,
          };
        }),
      setIsMagicInputHidden: (isHidden: boolean) =>
        set((state) => {
          return {
            ...state,
            isMagicInputHidden: isHidden,
          };
        }),
      toggleIsEditCanvas: () =>
        set((state) => ({ ...state, isEditCanvas: !state.isEditCanvas })),
      panels: { home: {} }, // panel components
      panelProps: { home: {} }, // panel props (width, height...)
      rows: {
        home: {
          page: "Home",
          rows: [
            { height: 120, panels: ["panel-canvas-0"] }, // what panels are in which row
            { height: 120, panels: ["panel-canvas-1"] },
          ],
        },
      },
      canvasRows: [
        [
          { order: 1, defaultSize: 50 },
          { order: 2, defaultSize: 50 },
        ],
        [
          { order: 1, defaultSize: 50 },
          { order: 2, defaultSize: 50 },
        ],
      ],
      addCanvasPanel: (rowIndex: number) =>
        set((state) => {
          const newRows = state.canvasRows.map((row, i) => {
            return i === rowIndex
              ? [
                  ...row,
                  {
                    order: row.length + 1,
                    defaultSize: 50,
                  },
                ]
              : row;
          });
          return {
            ...state,
            canvasRows: newRows,
          };
        }),
      addCanvasRow: () =>
        set((state) => {
          const newRow = [
            { order: 1, defaultSize: 50 },
            { order: 2, defaultSize: 50 },
          ];
          return {
            ...state,
            canvasRows: [...state.canvasRows, newRow],
          };
        }),
      setCurrentComponent: (c: DraggableStateComponent) =>
        set((state) => {
          return { ...state, currentComponent: { jsx: c.jsx, id: c.id } };
        }),
      addToCanvasPanel: (panelId, page = "home") =>
        // panels: { "home": { "panel-1": [ { jsx, id }, { jsx, id }]} }
        set((state) => {
          const newState = {
            ...state,
            panels: assocPath(
              [page, panelId],
              append(
                { ...state.currentComponent },
                state.panels[page][panelId]
              ),
              state.panels
            ),
          };
          return newState;
        }),
      addToCanvasPanelFromInventory: (panelId, componentId, page = "home") =>
        set((state) => {
          const c = state.storedComponents?.find((c) => c.id == componentId);
          if (c) {
            return {
              ...state,
              panels: assocPath(
                [page, panelId],
                append(
                  { jsx: c.jsx, id: nanoid() },
                  state.panels[page][panelId]
                ),
                state.panels
              ),
            };
          } else {
            return state;
          }
        }),
      switchToCanvasPanel: (panelId, panelFromId, componentId, page = "home") =>
        set((state) => {
          const componentToMove = find<DraggableStateComponent>(
            (val: DraggableStateComponent) => val.id === componentId,
            state.panels[page][panelFromId]
          );
          const updatedPanelFrom = filter(
            (c: DraggableStateComponent) => c.id != componentId,
            state.panels[page][panelFromId]
          );
          const currentPanelTo = state.panels[page][panelId] || [];
          const updatedPanelTo = append(componentToMove, currentPanelTo);
          const newState = assocPath(
            ["panels", "home"],
            {
              ...state.panels.home,
              [panelId]: updatedPanelTo,
              [panelFromId]: updatedPanelFrom,
            },
            state
          );
          return newState;
        }),
      updateCanvasPanel: ({ page = "home", panelId, props }) =>
        set((state) => {
          const newPanelProps = assocPath(
            [page, panelId, "height"],
            props.height,
            state.panelProps
          );
          return { ...state, panelProps: newPanelProps };
        }),
      addDroppedComponent: (activeId?: string) =>
        set((state) => {
          if (activeId) {
            // from inventory
            const c = state.storedComponents?.find((c) => c.id == activeId);
            if (c) {
              return {
                ...state,
                droppedComponents: [
                  ...(state.droppedComponents || []),
                  {
                    jsx: c.jsx,
                    id: nanoid(),
                  },
                ],
              };
            } else {
              return state;
            }
          } else {
            // from placeholder
            return {
              ...state,
              droppedComponents: [
                ...(state.droppedComponents || []),
                {
                  jsx: state.currentComponent?.jsx,
                  id: nanoid(),
                },
              ],
            };
          }
        }),
      removeByIdDroppedComponent: (activeId) =>
        set((state) => {
          if (state.droppedComponents) {
            return {
              ...state,
              droppedComponents: state.droppedComponents.filter(
                (c) => c.id != activeId
              ),
            };
          } else {
            return state;
          }
        }),
      addStoredComponent: (activeId: string, page = "home") =>
        set((state) => {
          const [panelId, componentId] = fromActiveId(activeId);
          const c = state.panels[page][panelId].find(
            (c) => c.id == componentId
          );
          if (c) {
            return {
              ...state,
              storedComponents: [
                ...(state.storedComponents || []),
                { jsx: c.jsx, id: `inv-${nanoid()}`, cid: nanoid() },
              ],
            };
          } else {
            return state;
          }
        }),
      clearInventory: () =>
        set((state) => {
          return { ...state, storedComponents: [] };
        }),
    }),
    {
      name: "inventory-items",
      partialize: (state) => {
        return { storedComponents: state.storedComponents || [] };
      },
    }
  )
);
