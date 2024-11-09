"use client";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import React from "react";

const CustomComponent = React.forwardRef(
  (
    {
      children,
      listeners,
      attributes,
      style,
    }: {
      children: React.ReactNode;
      listeners: any;
      attributes: any;
      style: any;
    },
    ref
  ) => {
    let Tag = "div";
    if (React.isValidElement(children)) {
      const childType = children.type;
      if (typeof childType === "string") {
        Tag = childType;
      } else if (typeof childType === "function") {
        Tag = (childType as any).displayName || childType.name;
      }
    }
    const props = {
      ref,
      style,
      ...listeners,
      ...attributes,
      className: "pick-up flex self-start flex-0 bg-transparent",
    };
    return React.createElement("div", props, children);
  }
);
CustomComponent.displayName = "CustomComponent";

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
    <CustomComponent
      ref={setNodeRef}
      listeners={listeners}
      attributes={attributes}
      style={style}
    >
      {props.children}
    </CustomComponent>
  );
}
