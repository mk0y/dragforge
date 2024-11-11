"use client";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import React from "react";

export default function Draggable(props: {
  id: string;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.id,
  });
  const style = {
    transform: CSS.Translate.toString(transform),
  };
  return (
    <div ref={setNodeRef} style={style} className="relative z-20 group/item">
      <GripVertical
        size="16"
        className="absolute cursor-move -right-3 top-0 bg-transparent opacity-20 group-hover/item:opacity-100 transition-opacity outline-none"
        {...listeners}
        {...attributes}
      />
      {props.children}
    </div>
  );
}
