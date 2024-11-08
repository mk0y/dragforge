"use client";

import { cn } from "@/lib/utils";
import { useDroppable } from "@dnd-kit/core";
import React from "react";

export default function Droppable(props: {
  id: string;
  children: React.ReactNode;
  dropped: boolean;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
  });
  const style = {
    color: isOver ? "green" : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "droppable flex flex-1 h-full w-full shadow-md bg-red-950",
        !props.dropped && "items-start justify-start",
        props.dropped && "flex-col"
      )}
    >
      {props.children}
    </div>
  );
}
