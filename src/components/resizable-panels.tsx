"use client";
import DraggableCanvas from "@/components/ui/draggable-canvas";
import { useAppStore } from "@/hooks/app-store";
import { useStore } from "@/hooks/use-store";
import { Fragment } from "react";
import DroppablePanel from "./ui/droppable-panel";

import { PlusCircle } from "lucide-react";
import JsxParser from "react-jsx-parser";
import { Button } from "./ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";
const ResizablePanels = () => {
  const {
    isEditCanvas = false,
    panels = {},
    addCanvasPanel = () => {},
    addCanvasRow = () => {},
    canvasRows = [],
  } = useStore(useAppStore, (state) => state) || {};
  return (
    <ResizablePanelGroup
      id="resizable-panel-canvas"
      direction="vertical"
      className="min-h-[400px] w-full overflow-visible"
    >
      {canvasRows?.map((row, rowIndex) => (
        <Fragment key={`row-${rowIndex}`}>
          <ResizablePanel
            id={`row-${rowIndex}`}
            order={rowIndex + 1}
            className="overflow-visible"
            defaultSize={100 / canvasRows.length} // Distribute height equally at start
          >
            <div className="relative w-full h-full">
              <ResizablePanelGroup
                direction="horizontal"
                className="h-full w-full overflow-visible"
              >
                {row.map((panel, panelIndex) => {
                  const droppablePanelId = `droppable-panel-${rowIndex}-${panelIndex}`;
                  return (
                    <Fragment key={panelIndex}>
                      <ResizablePanel
                        id={`row-${rowIndex}-${panelIndex}`}
                        order={panel.order}
                        defaultSize={panel.defaultSize}
                        className="overflow-visible"
                      >
                        <DroppablePanel
                          key={droppablePanelId}
                          id={droppablePanelId}
                          dropped={false}
                        >
                          {panels && // list panel components
                          panels["home"] &&
                          panels["home"][droppablePanelId] &&
                          panels["home"][droppablePanelId].length
                            ? panels["home"][droppablePanelId].map((c, i) => {
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
                      {panelIndex < row.length - 1 && (
                        <ResizableHandle
                          className="canvas-resize-handle canvas-resize-handle--hor outline-none relative z-10"
                          key={`handle-between-panels-${rowIndex}-${panelIndex}`}
                        />
                      )}
                    </Fragment>
                  );
                })}
              </ResizablePanelGroup>
              {isEditCanvas ? (
                <Button
                  onClick={() => addCanvasPanel && addCanvasPanel(rowIndex)}
                  className="absolute top-2 left-2 rounded px-2 py-1"
                >
                  <PlusCircle />
                </Button>
              ) : null}
            </div>
          </ResizablePanel>
          {rowIndex < canvasRows.length - 1 && (
            <ResizableHandle
              className="canvas-resize-handle outline-none relative"
              key={`handle-between-rows-${rowIndex}`}
            />
          )}
        </Fragment>
      ))}
    </ResizablePanelGroup>
  );
};

export default ResizablePanels;
