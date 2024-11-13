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
}

export interface AppState {
  currentComponent: DraggableStateComponent;
  droppedComponents?: DraggableStateComponent[];
  storedComponents?: DraggableStateComponent[];
  rows: Record<string, { page: string; rows: CanvasRow[] }>;
  panels: Record<string, Record<string, DraggableStateComponent[]>>;
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
      panels: { home: {} },
      rows: {
        home: { page: "Home", rows: [{ height: 120 }, { height: 120 }] },
      },
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
