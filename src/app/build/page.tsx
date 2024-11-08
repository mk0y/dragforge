"use client";
import QueryInput from "@/components/QueryInput/query-input";
import Draggable from "@/components/ui/draggable";
import Droppable from "@/components/ui/droppable";
import { DndContext } from "@dnd-kit/core";
import { Puzzle } from "lucide-react";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import JsxParser from "react-jsx-parser";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface DraggableStateComponent {
  id?: string;
  jsx?: string;
}

export default function App() {
  const [dropped, setDropped] = useState(false);
  const [currentComponent, setCurrentComponent] =
    useState<DraggableStateComponent>({});
  const [previousComponents, setPreviousComponents] = useState<
    DraggableStateComponent[]
  >([]);
  const [savedComponents, setSavedComponents] = useState<
    DraggableStateComponent[]
  >([]);
  const [componentFinished, incComponentFinished] = useState(0);
  const [jsxStr, setJsxStr] = useState("");
  const [droppedComponents, setDroppedComponents] = useState<
    Record<string, React.ReactElement>
  >({});
  const droppedComponentsLength = Object.keys(droppedComponents).length;
  useEffect(() => {
    if (droppedComponentsLength < 1) {
      setDropped(false);
    }
  }, [droppedComponentsLength]);
  return (
    <div className="flex flex-col items-center justify-between bg-primary-foreground">
      <div className="flex min-w-full">
        {/* <div className="inventory flex min-h-screen bg-slate-400 min-w-[320px]">
          <div className="p-2 font-semibold">Inventory</div>
          <div id="inventory-items"></div>
        </div> */}
        <div className="flex flex-col flex-1 z-10 w-full text-sm px-6">
          <div className="flex flex-col fixed bottom-0 left-0 w-full justify-center items-center">
            <div className="w-7xl flex items-center p-12">
              <p className="w-16 mr-4">Build me:</p>
              <QueryInput
                onSubmit={(query) => console.log(query)}
                onFinished={(jsx: string) => {
                  setJsxStr(jsx);
                  setCurrentComponent({ jsx, id: nanoid() });
                }}
              />
            </div>
          </div>
          <DndContext onDragEnd={handleDragEnd}>
            <div className="h-auto min-h-20 flex items-center justify-start p-6 my-6 min-w-full bg-lines-45 shadow-sm">
              {currentComponent.jsx ? (
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
                  color="text-slate-100"
                  className="fill-sidebar-border"
                />
              )}
            </div>
            <Droppable key="droppable" id="droppable" dropped={dropped}>
              {previousComponents.length
                ? previousComponents.map((previousComponent, i) => {
                    return (
                      <Draggable
                        key={previousComponent.id}
                        id={previousComponent.id as string}
                      >
                        <JsxParser
                          key={i}
                          renderInWrapper={false}
                          jsx={previousComponent.jsx}
                        />
                      </Draggable>
                    );
                  })
                : null}
            </Droppable>
          </DndContext>
        </div>
      </div>
    </div>
  );

  function handleDragEnd(event: { over: any; active: any }) {
    const overId = event.over?.id;
    const activeId = event.active?.id;
    console.log({
      overId,
      activeId,
      previousComponents: previousComponents.map((c) => c.id),
    });
    if (overId === "droppable") {
      setPreviousComponents((previousComponents) => [
        ...previousComponents,
        { jsx: currentComponent.jsx, id: currentComponent.id },
      ]);
      setCurrentComponent({});
    } else if (!overId) {
      setPreviousComponents(
        previousComponents.filter((comp) => comp.id != activeId)
      );
    }
  }
}
