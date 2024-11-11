"use client";

import { cn } from "@/lib/utils";
import { useDndMonitor, useDroppable } from "@dnd-kit/core";
import React, { useState } from "react";

export default function Droppable(props: {
  id: string;
  children: React.ReactNode;
  dropped: boolean;
}) {
  const [dragStarted, setDragStarted] = useState(false);
  useDndMonitor({
    onDragStart: (e) => {
      if (
        e.active.id != "draggable" &&
        !e.active.id.toString().startsWith("inv-")
      ) {
        setDragStarted(true);
      }
    },
    onDragEnd: (e) => {
      if (
        e.active.id != "draggable" &&
        !e.active.id.toString().startsWith("inv-")
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
        "droppable-inventory flex flex-1 flex-col h-full w-full shadow-inner bg-neutral-950 border border-transparent",
        !props.dropped && "items-start justify-start",
        props.dropped && "flex-col",
        dragStarted && "border-dashed border-secondary-foreground"
      )}
    >
      {props.children}
    </div>
  );
}
