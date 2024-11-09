import { create } from "zustand";

interface State {
  dndId: string;
  updateDnd: (str: string) => void;
}

export const useStore = create<State>()((set) => ({
  dndId: "",
  updateDnd: (dndId: string) => set({ dndId }),
}));
