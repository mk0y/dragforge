"use client";
import { nanoid } from "nanoid";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface DraggableStateComponent {
  id?: string;
  jsx?: string;
}

export interface AppState {
  dndId: string;
  currentComponent?: DraggableStateComponent;
  droppedComponents?: DraggableStateComponent[];
  storedComponents?: DraggableStateComponent[];
  updateDnd: (str: string) => void;
  setCurrentComponent: (c: DraggableStateComponent) => void;
  addDroppedComponent: () => void;
  removeByIdDroppedComponent: (id: string) => void;
  addStoredComponent: (id: string) => void;
  clearInventory: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      dndId: "",
      currentComponent: undefined,
      droppedComponents: undefined,
      storedComponents: undefined,
      updateDnd: (dndId: string) => set({ dndId }),
      setCurrentComponent: (c: DraggableStateComponent) =>
        set((state) => {
          return { ...state, currentComponent: { jsx: c.jsx, id: c.id } };
        }),
      addDroppedComponent: () =>
        set((state) => {
          return {
            ...state,
            droppedComponents: [
              ...(state.droppedComponents || []),
              {
                jsx: state.currentComponent?.jsx,
                id: state.currentComponent?.id,
              },
            ],
          };
        }),
      removeByIdDroppedComponent: (activeId) =>
        set((state) => {
          return {
            ...state,
            droppedComponents: state.droppedComponents?.filter(
              (c) => c.id != activeId
            ),
          };
        }),
      addStoredComponent: (activeId: string) =>
        set((state) => {
          const c = state.droppedComponents?.find((c) => c.id == activeId);
          return {
            ...state,
            storedComponents: [
              ...(state.storedComponents || []),
              { jsx: c?.jsx, id: nanoid() },
            ],
          };
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
