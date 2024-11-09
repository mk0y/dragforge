"use client";
import { useStore } from "@/hooks/store";
import { DndContext } from "@dnd-kit/core";

const AppDnd = ({ children }: { children: React.ReactNode }) => {
  const updateDnd = useStore((state) => state.updateDnd);
  function end(event: { over: any; active: any }) {
    const overId2 = event.over?.id;
    const activeId2 = event.active?.id;
    console.log({
      overId2,
      activeId2,
    });
    updateDnd(overId2);
  }
  return <DndContext onDragEnd={end}>{children}</DndContext>;
};

export default AppDnd;
