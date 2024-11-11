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
      if (e.active.id == "draggable") {
        setDragStarted(true);
      }
    },
    onDragEnd: (e) => {
      if (e.active.id == "draggable") {
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
        "droppable flex flex-1 h-full w-full shadow-md border border-transparent",
        !props.dropped && "items-start justify-start",
        props.dropped && "flex-col",
        dragStarted && "opacity-55 transition-opacity border border-dashed border-secondary-foreground"
      )}
    >
      {props.children}
    </div>
  );
}
