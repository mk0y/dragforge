"use client";
import { useAppStore } from "@/hooks/app-store";
import { useStore } from "@/hooks/use-store";
import { fromActiveId } from "@/lib/utils";
import { DndContext } from "@dnd-kit/core";
import { useCallback } from "react";

const AppDnd = ({ children }: { children: React.ReactNode }) => {
  const appState = useStore(useAppStore, (state) => state);
  const dragEnd = useCallback(
    (event: { over: any; active: any }) => {
      const overId = event.over?.id as string;
      const activeId = event.active?.id as string;
      if (
        appState &&
        overId &&
        overId.startsWith("droppable-panel-") &&
        activeId === "draggable"
      ) {
        appState.addToCanvasPanel(overId, "home");
        appState.setCurrentComponent({});
      } else if (
        appState &&
        overId &&
        activeId &&
        activeId.startsWith("draggable-from-droppable-panel-") &&
        overId.startsWith("droppable-panel-")
      ) {
        const [overIdFrom, componentId] = fromActiveId(activeId);
        if (overId != overIdFrom) {
          appState.switchToCanvasPanel(overId, overIdFrom, componentId, "home");
        }
      } else if (
        appState &&
        overId === "droppable-inventory" &&
        !activeId.startsWith("inv-") &&
        activeId != "draggable"
      ) {
        appState.addStoredComponent(activeId);
      } else if (
        appState &&
        overId &&
        overId.startsWith("droppable-panel-") &&
        activeId &&
        activeId.startsWith("inv-")
      ) {
        // {overId: 'droppable-panel-1', activeId: 'inv-HpXdbikNzGs3CuTCqJ8hx'}
        appState.addToCanvasPanelFromInventory(overId, activeId);
      }
    },
    [appState]
  );
  return <DndContext onDragEnd={dragEnd}>{children}</DndContext>;
};

export default AppDnd;
