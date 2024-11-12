"use client";
import * as Palette from "@/components/palette/all-components";
import QueryInput from "@/components/QueryInput/query-input";
import Draggable from "@/components/ui/draggable";
import DraggableCanvas from "@/components/ui/draggable-canvas";
import Droppable from "@/components/ui/droppable";
import { useAppStore } from "@/hooks/app-store";
import { useStore } from "@/hooks/use-store";
import { cn } from "@/lib/utils";
import { Puzzle } from "lucide-react";
import { nanoid } from "nanoid";
import JsxParser from "react-jsx-parser";

export default function App() {
  const appState = useStore(useAppStore, (state) => state);
  return (
    <div className="flex flex-col flex-1 items-center justify-between bg-primary-foreground">
      <div className="flex min-w-full h-full">
        <div className="flex flex-col flex-1 w-full h-full text-sm px-6">
          <div className="query-input flex flex-col fixed bottom-0 left-0 w-full justify-center z-10 items-center">
            <div className="w-7xl flex items-center p-12">
              <p className="w-16 mr-4">Build me:</p>
              <QueryInput
                onFinished={(jsx: string) => {
                  appState?.setCurrentComponent({ jsx, id: nanoid() });
                }}
              />
            </div>
          </div>
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
                  renderInWrapper={true}
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
          <Droppable key="droppable" id="droppable" dropped={false}>
            {appState?.droppedComponents?.length
              ? appState?.droppedComponents.map((c, i) => {
                  return (
                    <DraggableCanvas key={c.id} id={c.id as string}>
                      <JsxParser key={i} renderInWrapper={false} jsx={c.jsx} />
                    </DraggableCanvas>
                  );
                })
              : null}
          </Droppable>
        </div>
      </div>
    </div>
  );
}
