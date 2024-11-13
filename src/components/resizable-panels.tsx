"use client";
import DraggableCanvas from "@/components/ui/draggable-canvas";
import { useAppStore } from "@/hooks/app-store";
import { useStore } from "@/hooks/use-store";
import { nanoid } from "nanoid";
import { Fragment } from "react";
import JsxParser from "react-jsx-parser";
import DroppableRow from "./ui/droppable-row";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";

const ResizablePanels = () => {
  const appState = useStore(useAppStore, (state) => state);
  return (
    <ResizablePanelGroup
      id="resizable-panel-canvas"
      direction="vertical"
      className="max-w-full"
    >
      {appState?.rows.home.rows.map((row, i) => {
        return (
          <Fragment key={`row-${i}`}>
            <ResizablePanel
              id={`panel-canvas-${i}`}
              order={i + 1}
              key={nanoid()}
              defaultSize={50}
            >
              <div className="observer flex flex-1 w-full h-full">
                <DroppableRow
                  key={`droppable-row-${i}`}
                  id={`droppable-row-${i}`}
                  row={row}
                  dropped={false}
                >
                  {appState?.droppedComponents?.length
                    ? appState?.droppedComponents.map((c, i) => {
                        return (
                          <DraggableCanvas key={c.id} id={c.id as string}>
                            <JsxParser
                              key={i}
                              renderInWrapper={false}
                              jsx={c.jsx}
                            />
                          </DraggableCanvas>
                        );
                      })
                    : null}
                </DroppableRow>
              </div>
            </ResizablePanel>
            {i < appState.rows.home.rows.length - 1 ? (
              <ResizableHandle
                className="canvas-resize-handle outline-none relative z-10"
                key={nanoid()}
              />
            ) : null}
          </Fragment>
        );
      })}
    </ResizablePanelGroup>
  );
};

export default ResizablePanels;
