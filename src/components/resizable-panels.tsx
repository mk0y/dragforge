"use client";
import DraggableCanvas from "@/components/ui/draggable-canvas";
import { useAppStore } from "@/hooks/app-store";
import { useStore } from "@/hooks/use-store";
import { Fragment, useCallback, useEffect, useRef } from "react";
import DroppablePanel from "./ui/droppable-panel";

import { addOpacityToHex, areAllItemsEqual, cn } from "@/lib/utils";
import debounce from "just-debounce-it";
import { nanoid } from "nanoid";
import { path } from "ramda";
import JsxParser from "react-jsx-parser";
import {
  ImperativePanelGroupHandle,
  ImperativePanelHandle,
} from "react-resizable-panels";
import ArrangePanelsActions from "./ArrangePanelsActions";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";
const ResizablePanels = () => {
  const {
    isEditCanvas = false,
    panels = {},
    canvasRows = [],
    dragHandlesColor = null,
    panelProps = {},
    panelSizes = {},
    currentPage = "home",
    setPanelSizes = () => {},
  } = useStore(useAppStore, (state) => state) || {};
  const gridRefs = useRef<(ImperativePanelHandle | null)[][]>([]);
  const groupRef = useRef<ImperativePanelGroupHandle>(null);
  const debouncedSetPanelSizes = useCallback(
    debounce((rowIndex: number, sizes: number[]) => {
      setPanelSizes(rowIndex, [...sizes]);
    }, 200),
    [setPanelSizes]
  );
  useEffect(() => {
    const sizes = path([currentPage], panelSizes);
    if (Array.isArray(gridRefs.current[0]) && Array.isArray(sizes[0])) {
      gridRefs.current.forEach((refRow, rowIndex) => {
        if (!sizes[rowIndex]) {
          return;
        }
        refRow.forEach((ref, panelIndex) => {
          const panelSize = sizes[rowIndex][panelIndex];
          ref?.resize(panelSize);
        });
      });
    }
  }, [path([currentPage, "length"], panelSizes), gridRefs, panelSizes]);
  useEffect(() => {
    console.log({ canvasRows });
    if (canvasRows.length) {
      // groupRef.current?.setLayout([10, 90]);
    }
  }, [canvasRows]);
  return (
    <ResizablePanelGroup
      id="resizable-panel-canvas"
      direction="vertical"
      className="resizable-rows w-full overflow-visible"
      ref={groupRef}
      onLayout={(layout) => {
        // console.log(layout);
        if (!areAllItemsEqual(layout)) {
          // debouncedSetPanelSizes("home", rowIndex, sizes);
        }
      }}
    >
      {canvasRows?.map((row, rowIndex) => (
        <Fragment key={`row-${rowIndex}`}>
          <ResizablePanel
            id={`row-${rowIndex}`}
            order={rowIndex + 1}
            className="overflow-visible"
          >
            <div className="relative w-full h-full">
              <ResizablePanelGroup
                direction="horizontal"
                className="h-full w-full overflow-visible"
                onLayout={(sizes: number[]) => {
                  if (!areAllItemsEqual(sizes)) {
                    debouncedSetPanelSizes(rowIndex, sizes);
                  }
                }}
              >
                {row.map((panel, panelIndex) => {
                  const droppablePanelId = `droppable-panel-${rowIndex}-${panelIndex}`;
                  const panelId = `row-${rowIndex}-${panelIndex}`;
                  return (
                    <Fragment key={panelIndex}>
                      <ResizablePanel
                        id={panelId}
                        order={panel.order}
                        className="overflow-visible"
                        ref={(el) => {
                          if (!gridRefs.current[rowIndex]) {
                            if (el) {
                              gridRefs.current[rowIndex] = [];
                              gridRefs.current[rowIndex].push(el);
                            }
                          }
                        }}
                      >
                        <DroppablePanel
                          key={droppablePanelId}
                          id={droppablePanelId}
                          dropped={false}
                        >
                          {panels && // list panel components
                          panels[currentPage] &&
                          panels[currentPage][droppablePanelId] &&
                          panels[currentPage][droppablePanelId].length
                            ? panels[currentPage][droppablePanelId].map((c, i) => {
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
                          className={cn(
                            "canvas-resize-handle canvas-resize-handle--hor outline-none relative z-10",
                            dragHandlesColor &&
                              `dark:!border-[${addOpacityToHex(
                                dragHandlesColor,
                                0.25
                              )}]`,
                            dragHandlesColor &&
                              `dark:hover:!border-[${addOpacityToHex(
                                dragHandlesColor,
                                0.75
                              )}]`
                          )}
                          key={`handle-between-panels-${rowIndex}-${panelIndex}`}
                        />
                      )}
                    </Fragment>
                  );
                })}
              </ResizablePanelGroup>
              {isEditCanvas ? (
                <ArrangePanelsActions rowIndex={rowIndex} />
              ) : null}
            </div>
          </ResizablePanel>
          {rowIndex < canvasRows.length - 1 && (
            <ResizableHandle
              className={cn(
                "canvas-resize-handle outline-none relative",
                dragHandlesColor &&
                  `dark:!border-[${addOpacityToHex(dragHandlesColor, 0.25)}]`,
                dragHandlesColor &&
                  `dark:hover:!border-[${addOpacityToHex(
                    dragHandlesColor,
                    0.75
                  )}]`
              )}
              key={nanoid()}
            />
          )}
        </Fragment>
      ))}
    </ResizablePanelGroup>
  );
};

export default ResizablePanels;
