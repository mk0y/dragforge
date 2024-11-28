"use client";
import * as ResizablePrimitive from "react-resizable-panels";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

const ResizablePanelGroup = ({
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) => (
  <ResizablePrimitive.PanelGroup
    className={cn(
      "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
      className
    )}
    {...props}
  />
);

const ResizablePanel = ResizablePrimitive.Panel;

const ResizableHandle = ({
  num,
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
  num?: string;
}) => {
  const handleRef = useRef<HTMLSpanElement>(null);
  const [numm, setNum] = useState("");
  const [hoverState, setHoverState] = useState("");
  useEffect(() => {
    const droppableCanvas = document.getElementById("droppable-canvas");
    const handleParent = handleRef.current?.parentElement;
    let observer: MutationObserver | null = null;
    if (handleParent) {
      observer = new MutationObserver((mutationList) => {
        let newHoverState = "";
        let newNum = "";
        for (const mutation of mutationList) {
          if (mutation.type === "attributes" && droppableCanvas) {
            const previousSibling = handleParent?.previousElementSibling;
            const hoverParent = handleParent?.getAttribute(
              "data-resize-handle-state"
            );
            const direction = handleParent?.getAttribute(
              "data-panel-group-direction"
            );
            if (previousSibling instanceof HTMLElement) {
              const siblingHeightOrWidth =
                direction === "vertical"
                  ? previousSibling.offsetHeight
                  : previousSibling.offsetWidth;
              newHoverState =
                hoverParent === "hover" || hoverParent === "drag"
                  ? hoverParent
                  : "";
              newNum = `${siblingHeightOrWidth}`;
            }
          }
        }
        if (newHoverState !== hoverState) setHoverState(newHoverState);
        if (newNum !== numm) setNum(newNum);
      });
      observer.observe(handleParent, { attributes: true });
    }
    return () => {
      if (observer) observer.disconnect();
    };
  }, [hoverState, numm]);
  return (
    <ResizablePrimitive.PanelResizeHandle
      className={cn(
        "relative flex w-px items-center group justify-center after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "resize-handle-span w-8 h-8 items-center justify-center text-center flex delay-75 text-muted-foreground bg-muted rounded-full p-1 transition-all z-30",
          hoverState == "hover" || hoverState == "drag"
            ? "opacity-100"
            : "opacity-0"
        )}
        ref={handleRef}
      >
        {numm || "50"}
      </span>
    </ResizablePrimitive.PanelResizeHandle>
  );
};

export { ResizableHandle, ResizablePanel, ResizablePanelGroup };
