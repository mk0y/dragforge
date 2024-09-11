"use client";

import { useDraggable } from "@dnd-kit/core";
import React from "react";

export default function Draggable(props: {
  id: string;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.id,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <div className="pick-up">{props.children}</div>
    </div>
  );
}
