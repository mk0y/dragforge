"use client";
import { fromActiveId } from "@/lib/utils";
import throttle from "just-throttle";
import { nanoid } from "nanoid";
import {
  append,
  assocPath,
  equals,
  filter,
  find,
  mergeDeepRight,
  update,
} from "ramda";
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

export type SinglePanelProps = { height?: number; width?: number };

export type PanelProps = Record<string, Record<string, SinglePanelProps>>;

export type DragUnit = "percentages" | "pixels";

const DEFAULT_ROW_HEIGHT = 100;

export interface AppState {
  currentComponent: DraggableStateComponent;
  droppedComponents?: DraggableStateComponent[];
  storedComponents?: DraggableStateComponent[];
  panels: Record<string, Record<string, DraggableStateComponent[]>>;
  panelProps: PanelProps;
  canvasRows: { order?: number; size?: number }[][];
  isEditCanvas: boolean;
  isMagicInputHidden: boolean;
  isMagicInputToggled: boolean;
  dragHandlesColor: string | null;
  magicInputState: MagicInputStates;
  pageProps: Record<string, Record<string, {}>>;
  panelSizes: Record<string, number[][]>;
  rowSizes: Record<string, number[]>;
  currentPage: string;
  dragUnit: DragUnit;
  setDragUnit: (dragUnit: DragUnit) => void;
  setPanelSizes: (rowIndex: number, panelSizes: number[]) => void;
  setRowSizes: (rows: number[]) => void;
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
  addToCanvasPanel: (panelId: string) => void;
  addToCanvasPanelFromInventory: (panelId: string, componentId: string) => void;
  switchToCanvasPanel: (
    panelId: string,
    panelFromId: string,
    componentId: string
  ) => void;
  updateCanvasPanel: ({
    panelId,
    props,
  }: {
    panelId: string;
    props: SinglePanelProps;
  }) => void;
  removeByIdDroppedComponent: (id: string) => void;
  addStoredComponent: (id: string) => void;
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
        panels: { home: {} }, // panel components
        panelProps: { home: {} }, // panel props (width, height...)
        panelSizes: { home: [] },
        rowSizes: { home: [DEFAULT_ROW_HEIGHT, 0] },
        canvasRows: [[{}], [{}]],
        currentPage: "home",
        dragUnit: "pixels",
        setDragUnit: (dragUnit: DragUnit) =>
          set((state) => {
            return {
              ...state,
              dragUnit,
            };
          }),
        setPanelSizes: (rowIndex: number, panelSizesOnRow: number[]) =>
          set((state) => {
            const currentPageRows = state.panelSizes[state.currentPage] || [];
            const newPanelSizes =
              currentPageRows.length > rowIndex
                ? update(rowIndex, panelSizesOnRow, currentPageRows)
                : append(panelSizesOnRow, currentPageRows);
            const newState = {
              ...state,
              panelSizes: {
                ...state.panelSizes,
                [state.currentPage]: newPanelSizes,
              },
            };
            return newState;
          }),
        setRowSizes: (rowSizes: number[]) =>
          set((state) => {
            return {
              ...state,
              rowSizes: { [state.currentPage]: rowSizes },
            };
          }),
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
              return i === rowIndex ? [...row, {}] : row;
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
            const newRow = [{}];
            const updatedRows = [...state.canvasRows];
            const rowSizes = [...state.rowSizes[state.currentPage]];
            if (rowIndex !== undefined) {
              updatedRows.splice(rowIndex + 1, 0, newRow);
              rowSizes.splice(rowIndex + 1, 0, DEFAULT_ROW_HEIGHT);
            } else {
              updatedRows.push(newRow);
              rowSizes.push(DEFAULT_ROW_HEIGHT);
            }
            return {
              ...state,
              canvasRows: updatedRows,
              rowSizes: { [state.currentPage]: rowSizes },
            };
          }),
        addCanvasRowAbove: (rowIndex: number) =>
          set((state) => {
            const newRow = [{}];
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
        addToCanvasPanel: (panelId) =>
          // panels: { "home": { "panel-1": [ { jsx, id }, { jsx, id }]} }
          set((state) => {
            const newState = {
              ...state,
              panels: assocPath(
                [state.currentPage, panelId],
                append(
                  { ...state.currentComponent },
                  state.panels[state.currentPage][panelId]
                ),
                state.panels
              ),
            };
            return newState;
          }),
        addToCanvasPanelFromInventory: (panelId, componentId) =>
          set((state) => {
            const c = state.storedComponents?.find((c) => c.id == componentId);
            if (c) {
              return {
                ...state,
                panels: assocPath(
                  [state.currentPage, panelId],
                  append(
                    { jsx: c.jsx, id: nanoid() },
                    state.panels[state.currentPage][panelId]
                  ),
                  state.panels
                ),
              };
            } else {
              return state;
            }
          }),
        switchToCanvasPanel: (panelId, panelFromId, componentId) =>
          set((state) => {
            const componentToMove = find<DraggableStateComponent>(
              (val: DraggableStateComponent) => val.id === componentId,
              state.panels[state.currentPage][panelFromId]
            );
            const updatedPanelFrom = filter(
              (c: DraggableStateComponent) => c.id != componentId,
              state.panels[state.currentPage][panelFromId]
            );
            const currentPanelTo =
              state.panels[state.currentPage][panelId] || [];
            const updatedPanelTo = append(componentToMove, currentPanelTo);
            const newState = assocPath(
              ["panels", state.currentPage],
              {
                ...state.panels[state.currentPage],
                [panelId]: updatedPanelTo,
                [panelFromId]: updatedPanelFrom,
              },
              state
            );
            return newState;
          }),
        updateCanvasPanel: ({ panelId, props }) =>
          set((state) => {
            const updatedPanelProps = mergeDeepRight(state.panelProps, {
              [state.currentPage]: {
                [panelId]: props,
              },
            });
            return { ...state, panelProps: updatedPanelProps };
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
        addStoredComponent: (activeId: string) =>
          set((state) => {
            const [panelId, componentId] = fromActiveId(activeId);
            const c = state.panels[state.currentPage][panelId].find(
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
        partialize: ({
          canvasRows,
          dragHandlesColor,
          pageProps,
          panelSizes,
          rowSizes,
        }) => ({
          canvasRows,
          dragHandlesColor,
          pageProps,
          panelSizes,
          rowSizes,
        }),
        equality: (pastState, currentState) =>
          equals(pastState.canvasRows, currentState.canvasRows) &&
          pastState.dragHandlesColor == currentState.dragHandlesColor &&
          equals(pastState.pageProps, currentState.pageProps) &&
          equals(pastState.panelSizes, currentState.panelSizes) &&
          equals(pastState.rowSizes, currentState.rowSizes),
        handleSet: (handleSet) =>
          throttle((state) => handleSet(state), 1000, { trailing: true }),
      }
    ),
    {
      name: "app",
      partialize: (state) => {
        return {
          storedComponents: state.storedComponents || [],
          canvasRows: state.canvasRows || [],
          isMagicInputHidden: state.isMagicInputHidden,
          isMagicInputToggled: state.isMagicInputToggled,
          panelProps: state.panelProps,
          panelSizes: state.panelSizes,
          rowSizes: state.rowSizes,
          // pageProps: { home: {} },
        };
      },
    }
  )
);
