"use client";
import { useAppStore } from "@/hooks/app-store";
import { useStore } from "@/hooks/use-store";
import { DndContext } from "@dnd-kit/core";
import { useCallback } from "react";

const AppDnd = ({ children }: { children: React.ReactNode }) => {
  const appState = useStore(useAppStore, (state) => state);
  const dragEnd = useCallback(
    (event: { over: any; active: any }) => {
      const overId = event.over?.id;
      const activeId = event.active?.id;
      if (appState && overId === "droppable") {
        appState.addDroppedComponent();
        appState.setCurrentComponent({});
      } else if (appState && overId === "droppable-inventory") {
        appState.addStoredComponent(activeId);
      } else if (appState && !overId) {
        appState.removeByIdDroppedComponent(activeId);
      }
    },
    [appState]
  );
  return <DndContext onDragEnd={dragEnd}>{children}</DndContext>;
};

export default AppDnd;
