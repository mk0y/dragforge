"use client";
import QueryInput from "@/components/QueryInput/query-input";
import Draggable from "@/components/ui/draggable";
import Droppable from "@/components/ui/droppable";
import { useStore } from "@/hooks/store";
import { cn } from "@/lib/utils";
import { Puzzle } from "lucide-react";
import { nanoid } from "nanoid";
import JsxParser from "react-jsx-parser";

export default function App() {
  const { currentComponent, droppedComponents, setCurrentComponent } = useStore(
    (state) => state
  );
  return (
    <div className="flex flex-col flex-1 items-center justify-between bg-primary-foreground">
      <div className="flex min-w-full h-full">
        <div className="flex flex-col flex-1 z-10 w-full h-full text-sm px-6">
          <div className="flex flex-col fixed bottom-0 left-0 w-full justify-center items-center">
            <div className="w-7xl flex items-center p-12">
              <p className="w-16 mr-4">Build me:</p>
              <QueryInput
                onSubmit={(query) => console.log(query)}
                onFinished={(jsx: string) => {
                  setCurrentComponent({ jsx, id: nanoid() });
                }}
              />
            </div>
          </div>
          <div
            className={cn(
              `h-auto min-h-20 flex flex-0 items-center justify-start p-6 my-6 min-w-full bg-lines-45 shadow-sm`,
              currentComponent?.jsx ? "justify-start" : "justify-center"
            )}
          >
            {currentComponent?.jsx ? (
              <Draggable key="draggable" id="draggable">
                <JsxParser
                  allowUnknownElements={true}
                  onError={console.log}
                  renderInWrapper={false}
                  jsx={currentComponent.jsx}
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
            {droppedComponents?.length
              ? droppedComponents.map((c, i) => {
                  return (
                    <Draggable key={c.id} id={c.id as string}>
                      <JsxParser key={i} renderInWrapper={false} jsx={c.jsx} />
                    </Draggable>
                  );
                })
              : null}
          </Droppable>
        </div>
      </div>
    </div>
  );
}
