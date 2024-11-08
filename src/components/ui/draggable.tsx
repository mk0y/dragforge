"use client";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import React from "react";
import JsxParser from "react-jsx-parser";

const addListenersToString = (elementString: string, listeners: string) => {
  // Convert listeners object to a string
  const listenersString = `{...${listeners}}`; // Or use another method to convert to a suitable format

  // Use regex to find the opening tag and insert listeners
  const modifiedString = elementString.replace(
    /<(\w+)([^>]*)>/,
    (match, tagName, attrs) => {
      return `<${tagName}${attrs} ${listenersString}>`;
    }
  );
  return modifiedString;
};

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
    let Tag = "div"; // Default to 'div' if no valid child
    if (React.isValidElement(children)) {
      const childType = children.type;
      if (typeof childType === "string") {
        Tag = childType; // Use the tag name directly
      } else if (typeof childType === "function") {
        Tag = (childType as any).displayName || childType.name; // Use the display name of the function
      }
    }
    // Create the props object, including listeners and attributes
    const props = {
      ref,
      style,
      ...listeners,
      ...attributes,
      className: "pick-up flex self-start flex-0 bg-transparent",
    };

    // Create the element using React.createElement
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
  const jsxStr = props.children as string;
  const parser = new DOMParser();
  const doc = parser.parseFromString(jsxStr, "text/html");
  const buttonElement = doc.body.firstChild;
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
  // return (
  //   <div
  //     ref={setNodeRef}
  //     style={style}
  //     {...listeners}
  //     {...attributes}
  //     className="pick-up"
  //   >
  //     {props.children}
  //   </div>
  // );
  // if (React.isValidElement(props.children)) {
  //   return React.cloneElement(props.children as React.ReactElement<any>, {
  //     className: "pick-up",
  //     ref: setNodeRef,
  //     ...listeners,
  //     ...attributes,
  //   });
  // }
  //     {...listeners}
  //     className="pick-up"
  //     style={style}
  //   >
  //     {props.children}
  //   </div>
  // );
  // const retEl = (
  //   <JsxParser
  //     bindings={{
  //       ref: setNodeRef,
  //       style,
  //       ...listeners,
  //       ...attributes,
  //       className: "pick-up",
  //     }}
  //     renderInWrapper={false}
  //     jsx={`<Button ref={ref} style={style} className="bg-gradient-to-b from-blue-500 to-green-500 text-white rounded-[0.5rem] px-6 py-3 shadow-lg hover:shadow-xl transition-shadow duration-300">Click me</Button>`}
  //   />
  // );
  // console.log({ retEl });
  // return retEl;
}

// <Tag
//   ref={setNodeRef}
//   style={style}
//   {...listeners}
//   {...attributes}
//   className="pick-up"
// >
//   {props.children}
// </Tag>
