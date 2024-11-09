"use client";
import { useStore } from "@/hooks/store";
import { DndContext } from "@dnd-kit/core";
import { useCallback } from "react";

const AppDnd = ({ children }: { children: React.ReactNode }) => {
  const {
    droppedComponents,
    storedComponents,
    addDroppedComponent,
    setCurrentComponent,
    removeByIdDroppedComponent,
    addStoredComponent,
  } = useStore((state) => state);
  const dragEnd = useCallback((event: { over: any; active: any }) => {
    const overId = event.over?.id;
    const activeId = event.active?.id;
    console.log({
      overId,
      activeId,
      previousComponents: droppedComponents?.map((c) => c.id),
    });
    if (overId === "droppable") {
      addDroppedComponent();
      setCurrentComponent({});
    } else if (overId === "droppable-inventory") {
      addStoredComponent(activeId);
    } else if (!overId) {
      removeByIdDroppedComponent(activeId);
    }
  }, []);
  return <DndContext onDragEnd={dragEnd}>{children}</DndContext>;
};

export default AppDnd;
