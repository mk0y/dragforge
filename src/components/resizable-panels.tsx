"use client";
import DraggableCanvas from "@/components/ui/draggable-canvas";
import { useAppStore } from "@/hooks/app-store";
import { useStore } from "@/hooks/use-store";
import { nanoid } from "nanoid";
import { Fragment } from "react";
import JsxParser from "react-jsx-parser";
import DroppablePanel from "./ui/droppable-panel";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";

const ResizablePanels = () => {
  const appState = useStore(useAppStore, (state) => state);
  const panels = appState?.panels["home"];
  return (
    <ResizablePanelGroup
      id="resizable-panel-canvas"
      direction="vertical"
      className="max-w-full overflow-visible"
    >
      {appState?.rows.home.rows.map((row, i) => {
        const droppablePanelId = `droppable-panel-${i}`;
        return (
          <Fragment key={`row-${i}`}>
            <ResizablePanel
              id={`panel-canvas-${i}`}
              order={i + 1}
              key={nanoid()}
              defaultSize={50}
              className="overflow-visible"
            >
              <DroppablePanel
                key={droppablePanelId}
                id={droppablePanelId}
                row={row}
                dropped={false}
              >
                {panels &&
                panels[droppablePanelId] &&
                panels[droppablePanelId].length
                  ? panels[droppablePanelId].map((c, i) => {
                      return (
                        <DraggableCanvas
                          key={c.id}
                          id={`draggable-from-${droppablePanelId}--${c.id}`}
                        >
                          <JsxParser
                            key={i}
                            renderInWrapper={false}
                            className="dragged-component"
                            jsx={c.jsx}
                          />
                        </DraggableCanvas>
                      );
                    })
                  : null}
              </DroppablePanel>
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
