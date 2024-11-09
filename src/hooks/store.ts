import { create } from "zustand";

interface DraggableStateComponent {
  id?: string;
  jsx?: string;
}

interface State {
  dndId: string;
  currentComponent?: DraggableStateComponent;
  droppedComponents?: DraggableStateComponent[];
  storedComponents?: DraggableStateComponent[];
  updateDnd: (str: string) => void;
  setCurrentComponent: (c: DraggableStateComponent) => void;
  addDroppedComponent: () => void;
  removeByIdDroppedComponent: (id: string) => void;
  addStoredComponent: (id: string) => void;
}

export const useStore = create<State>()((set) => ({
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
          { jsx: state.currentComponent?.jsx, id: state.currentComponent?.id },
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
          { jsx: c?.jsx, id: c?.id },
        ],
      };
    }),
}));
