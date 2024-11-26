"use client";
import { fromActiveId } from "@/lib/utils";
import throttle from "just-throttle";
import { nanoid } from "nanoid";
import { append, assocPath, equals, filter, find } from "ramda";
import { temporal } from "zundo";
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

export type MagicInputStates =
  | "build"
  | "page"
  | "panel"
  | "refine"
  | "surprise";

export interface AppState {
  currentComponent: DraggableStateComponent;
  droppedComponents?: DraggableStateComponent[];
  storedComponents?: DraggableStateComponent[];
  panels: Record<string, Record<string, DraggableStateComponent[]>>;
  panelProps: Record<string, Record<string, { height?: number }>>;
  canvasRows: { order: number }[][];
  isEditCanvas: boolean;
  isMagicInputHidden: boolean;
  isMagicInputToggled: boolean;
  dragHandlesColor: string | null;
  magicInputState: MagicInputStates;
  pageProps: Record<string, Record<string, {}>>;
  setPageProps: (props: Record<string, Record<string, {}>>) => void;
  setMagicInputState: (state: MagicInputStates) => void;
  setDragHandlesColor: (color: string) => void;
  setIsMagicInputToggled: (isToggled: boolean) => void;
  setIsMagicInputHidden: (isHidden: boolean) => void;
  toggleIsEditCanvas: () => void;
  addCanvasPanel: (rowIndex: number) => void;
  removeCanvasPanel: (rowIndex: number) => void;
  addCanvasRow: (rowIndex?: number) => void;
  addCanvasRowAbove: (rowIndex: number) => void;
  removeRow: (rowIndex: number) => void;
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
    temporal(
      (set) => ({
        currentComponent: {},
        droppedComponents: undefined,
        storedComponents: undefined,
        isEditCanvas: false,
        isMagicInputHidden: false,
        isMagicInputToggled: false,
        dragHandlesColor: null,
        magicInputState: "build",
        pageProps: { home: {} },
        setPageProps: (props: Record<string, {}>) =>
          set((state) => {
            return {
              ...state,
              pageProps: Object.assign({}, state.pageProps, props),
            };
          }),
        setDragHandlesColor: (color: string) =>
          set((state) => {
            return {
              ...state,
              dragHandlesColor: color,
            };
          }),
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
        canvasRows: [
          [{ order: 1 }, { order: 2 }],
          [{ order: 1 }, { order: 2 }],
        ],
        setMagicInputState: (s: MagicInputStates) =>
          set((state) => {
            return {
              ...state,
              magicInputState: s,
            };
          }),
        addCanvasPanel: (rowIndex: number) =>
          set((state) => {
            const newRows = state.canvasRows.map((row, i) => {
              return i === rowIndex
                ? [
                    ...row,
                    {
                      order: row.length + 1,
                    },
                  ]
                : row;
            });
            return {
              ...state,
              canvasRows: newRows,
            };
          }),
        removeCanvasPanel: (rowIndex: number) =>
          set((state) => {
            const newRows = state.canvasRows.map((row, i) => {
              return i === rowIndex && row.length > 1 ? row.slice(0, -1) : row;
            });
            return {
              ...state,
              canvasRows: newRows,
            };
          }),
        addCanvasRow: (rowIndex?: number) =>
          set((state) => {
            const newRow = [{ order: 1 }];
            const updatedRows = [...state.canvasRows];
            if (rowIndex !== undefined) {
              updatedRows.splice(rowIndex + 1, 0, newRow);
            } else {
              updatedRows.push(newRow);
            }
            return {
              ...state,
              canvasRows: updatedRows,
            };
          }),
        addCanvasRowAbove: (rowIndex: number) =>
          set((state) => {
            const newRow = [{ order: 1 }];
            const updatedRows = [...state.canvasRows];
            if (rowIndex !== undefined) {
              updatedRows.splice(rowIndex, 0, newRow);
            } else {
              updatedRows.unshift(newRow);
            }
            return {
              ...state,
              canvasRows: updatedRows,
            };
          }),
        removeRow: (rowIndex: number) =>
          set((state) => {
            if (state.canvasRows.length <= 1) {
              return state;
            }
            if (
              rowIndex === undefined ||
              rowIndex < 0 ||
              rowIndex >= state.canvasRows.length
            ) {
              return state;
            }
            const updatedRows = state.canvasRows.filter(
              (_, index) => index !== rowIndex
            );
            return {
              ...state,
              canvasRows: updatedRows,
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
        switchToCanvasPanel: (
          panelId,
          panelFromId,
          componentId,
          page = "home"
        ) =>
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
        partialize: ({ canvasRows, dragHandlesColor, pageProps }) => ({
          canvasRows,
          dragHandlesColor,
          pageProps,
        }),
        equality: (pastState, currentState) =>
          equals(pastState.canvasRows, currentState.canvasRows) &&
          pastState.dragHandlesColor == currentState.dragHandlesColor &&
          equals(pastState.pageProps, currentState.pageProps),
        handleSet: (handleSet) =>
          throttle((state) => handleSet(state), 1000, { trailing: true }),
      }
    ),
    {
      name: "inventory-items",
      partialize: (state) => {
        return {
          storedComponents: state.storedComponents || [],
          canvasRows: state.canvasRows || [],
          isMagicInputHidden: state.isMagicInputHidden,
          isMagicInputToggled: state.isMagicInputToggled,
          // pageProps: { home: {} },
        };
      },
    }
  )
);
