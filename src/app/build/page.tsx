"use client";
import AddNewRow from "@/components/canvas-actions/AddNewRow";
import PaintResizableHandle from "@/components/canvas-actions/PaintResizableHandle";
import PercentUnits from "@/components/canvas-actions/PercentUnits";
import PreviewCanvas from "@/components/canvas-actions/PreviewCanvas";
import SplitCanvasMode from "@/components/canvas-actions/SplitCanvasMode";
import UndoRedoActions from "@/components/canvas-actions/UndoRedoActions";
import MagicInputArea from "@/components/MagicInputArea";
import * as Palette from "@/components/palette/all-components";
import ResizablePanels from "@/components/resizable-panels";
import Draggable from "@/components/ui/draggable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppStore } from "@/hooks/app-store";
import { useStore } from "@/hooks/use-store";
import { cn } from "@/lib/utils";
import { Puzzle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import JsxParser from "react-jsx-parser";

export default function App() {
  const appState = useStore(useAppStore, (state) => state);
  const scrollWrap = useRef<HTMLDivElement>(null);
  const [wrapHeight, setWrapHeight] = useState<number | null>(null);
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      const height = scrollWrap.current?.offsetHeight;
      if (height) setWrapHeight(height);
    });
    if (scrollWrap.current) {
      observer.observe(scrollWrap.current);
    }
    return () => observer.disconnect();
  }, []);
  return (
    <div className="flex flex-col flex-1 items-center justify-between bg-primary-foreground">
      <div className="flex min-w-full h-full">
        <div className="flex flex-col flex-1 w-full h-full text-sm px-6">
          {!appState?.isMagicInputHidden ? (
            <div className="query-input flex flex-col fixed bottom-0 left-0 w-full justify-center z-20 items-center">
              <div className="w-7xl p-12">
                <MagicInputArea />
              </div>
            </div>
          ) : null}
          <div
            className={cn(
              `h-auto min-h-20 flex flex-0 items-center justify-start p-6 my-6 min-w-full bg-lines-45 shadow-sm`,
              appState?.currentComponent?.jsx
                ? "justify-start"
                : "justify-center"
            )}
          >
            {appState?.currentComponent?.jsx ? (
              <Draggable key="draggable" id="draggable">
                <JsxParser
                  components={{ ...Palette }}
                  blacklistedAttrs={[]}
                  showWarnings={true}
                  allowUnknownElements={true}
                  onError={console.log}
                  renderInWrapper={false}
                  jsx={appState?.currentComponent.jsx}
                />
              </Draggable>
            ) : (
              <Puzzle
                size={36}
                color="text-slate-100"
                className="fill-sidebar-border"
              />
            )}
          </div>
          <div className="flex flex-1 h-full w-full">
            <div className="w-9 h-full pt-9 dark:bg-secondary flex flex-col flex-0">
              <SplitCanvasMode />
              <AddNewRow />
              <PercentUnits />
              <PaintResizableHandle />
            </div>
            <div className="scroll-wrap flex flex-1 flex-col h-full w-full">
              <div className="canvas-top-bar flex flex-grow-0 flex-0 h-9 w-full justify-between items-center dark:bg-secondary">
                <UndoRedoActions />
                <PreviewCanvas />
              </div>
              <div
                ref={scrollWrap}
                className="flex flex-grow flex-1 h-full w-full"
              >
                <ScrollArea
                  className={cn(
                    "scrollz w-full",
                    wrapHeight && `h-[${wrapHeight}px]`
                  )}
                >
                  <div
                    id="droppable-canvas"
                    className={cn(
                      "droppable-canvas w-full h-full shadow-md border-0 border-transparent",
                      appState?.pageProps[appState.currentPage]?.pageCss &&
                        `${appState?.pageProps[appState.currentPage]?.pageCss}`
                    )}
                  >
                    <ResizablePanels height={2000} />
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
