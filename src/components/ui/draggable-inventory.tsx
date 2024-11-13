"use client";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import React, { useEffect } from "react";

export default function Draggable(props: {
  id: string;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: props.id,
    });
  const style = {
    transform: CSS.Translate.toString(transform),
    zIndex: 9999,
  };
  useEffect(() => {
    const el = document.getElementById("main");
    if (el) {
      if (isDragging) {
        el.style.zIndex = "-1";
      } else {
        el.style.zIndex = "0";
      }
    }
  }, [isDragging]);
  return (
    <div ref={setNodeRef} style={style} className="relative group/item">
      <GripVertical
        size="16"
        className="absolute cursor-move -right-3 top-0 bg-transparent opacity-0 group-hover/item:opacity-100 transition-opacity outline-none"
        {...listeners}
        {...attributes}
      />
      {props.children}
    </div>
  );
}
