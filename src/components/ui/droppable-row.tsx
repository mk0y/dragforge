"use client";
import { CanvasRow } from "@/hooks/app-store";
import { cn } from "@/lib/utils";
import { useDndMonitor, useDroppable } from "@dnd-kit/core";
import React, { useState } from "react";

export default function DroppableRow(props: {
  id: string;
  children: React.ReactNode;
  dropped: boolean;
  row: CanvasRow;
}) {
  // const rows = useStore(useAppStore, (state) => state.rows);
  const [dragStarted, setDragStarted] = useState(false);
  useDndMonitor({
    onDragStart: (e) => {
      if (
        e.active.id == "draggable" ||
        e.active.id.toString().startsWith("inv-")
      ) {
        setDragStarted(true);
      }
    },
    onDragEnd: (e) => {
      if (
        e.active.id == "draggable" ||
        e.active.id.toString().startsWith("inv-")
      ) {
        setDragStarted(false);
      }
    },
  });
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
  });
  return (
    <div
      ref={setNodeRef}
      className={cn(
        "droppable-row h-full w-full",
        !props.dropped && "items-start justify-start",
        props.dropped && "flex-col",
        dragStarted &&
          "opacity-55 transition-opacity border border-dashed border-secondary-foreground"
      )}
    >
      {props.children}
    </div>
  );
}
