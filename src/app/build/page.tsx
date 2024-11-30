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
import { useAppStore } from "@/hooks/app-store";
import { useStore } from "@/hooks/use-store";
import { cn } from "@/lib/utils";
import { Puzzle } from "lucide-react";
import JsxParser from "react-jsx-parser";

export default function App() {
  const appState = useStore(useAppStore, (state) => state);
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
            <div className="flex flex-1 flex-col h-full w-full">
              <div className="canvas-top-bar flex flex-0 h-9 w-full justify-between items-center dark:bg-secondary">
                <UndoRedoActions />
                <PreviewCanvas />
              </div>
              <div
                id="droppable-canvas"
                className={cn(
                  "droppable-canvas flex flex-1 h-full w-full shadow-md border-0 border-transparent",
                  appState?.pageProps[appState.currentPage]?.pageCss &&
                    `${appState?.pageProps[appState.currentPage]?.pageCss}`
                )}
              >
                <ResizablePanels />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
