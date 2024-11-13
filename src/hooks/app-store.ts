"use client";
import { nanoid } from "nanoid";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface DraggableStateComponent {
  id?: string;
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
  setCurrentComponent: (c: DraggableStateComponent) => void;
  addDroppedComponent: (activeId?: string) => void;
  removeByIdDroppedComponent: (id: string) => void;
  addStoredComponent: (id: string) => void;
  clearInventory: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentComponent: {},
      droppedComponents: undefined,
      storedComponents: undefined,
      rows: {
        home: { page: "Home", rows: [{ height: 120 }, { height: 120 }] },
      },
      setCurrentComponent: (c: DraggableStateComponent) =>
        set((state) => {
          return { ...state, currentComponent: { jsx: c.jsx, id: c.id } };
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
          const c = state.droppedComponents?.find((c) => c.id == activeId);
          if (c) {
            return {
              ...state,
              storedComponents: [
                ...(state.storedComponents || []),
                { jsx: c.jsx, id: `inv-${nanoid()}` },
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
      partialize: (state) => ({
        storedComponents: state.storedComponents || [],
      }),
    }
  )
);
