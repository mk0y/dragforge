"use client";
import QueryInput from "@/components/QueryInput/query-input";
import Draggable from "@/components/ui/draggable";
import Droppable from "@/components/ui/droppable";
import { DndContext } from "@dnd-kit/core";
import { omit, pick } from "ramda";
import { lazy, useEffect, useState } from "react";
import { readGenFiles } from "../actions";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function App() {
  const [dropped, setDropped] = useState(false);
  const [componentFinished, incComponentFinished] = useState(0);
  const [draggableComponents, setDraggableComponents] = useState<
    Record<string, React.ReactElement>
  >({});
  const [droppedComponents, setDroppedComponents] = useState<
    Record<string, React.ReactElement>
  >({});
  const draggableComponentsLength = Object.keys(draggableComponents).length;
  const droppedComponentsLength = Object.keys(droppedComponents).length;
  useEffect(() => {
    if (draggableComponentsLength < 1 && droppedComponentsLength < 1) {
      setDropped(false);
    }
  }, [draggableComponentsLength, droppedComponentsLength]);
  useEffect(() => {
    const loadFiles = async () => {
      const files = await readGenFiles();
      for (let file of files) {
        if (file === ".keep") continue;
        console.log({ file }, `@/components/gen/${file}`);
        const Component = lazy(() => import(`../../components/gen/${file}`));
        const key = `draggable-${file}`;
        console.log({ Component });
        // await sleep(400);
        const draggableMarkup = (
          <Draggable key={key} id={key}>
            <Component />
          </Draggable>
        );
        setDraggableComponents((draggableComponents) =>
          Object.assign({}, draggableComponents, { [key]: draggableMarkup })
        );
      }
    };
    loadFiles();
  }, [componentFinished]);
  // console.log(Object.values(droppedComponents), { droppedComponents });
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-12">
      <QueryInput
        onSubmit={(query) => console.log(query)}
        onFinished={() => {
          incComponentFinished((v) => v + 1);
        }}
      />
      <div className="flex flex-col flex-1 z-10 w-full text-sm">
        <DndContext onDragEnd={handleDragEnd}>
          <div className="h-auto min-h-20 flex items-center justify-center p-6 *:w-full my-6 w-[800px] bg-lines-45 m-auto">
            <div key={1987}>123</div>
            {draggableComponentsLength > 0
              ? [Object.values(draggableComponents)]
              : null}
          </div>
          <Droppable key="draggable" id="draggable" dropped={dropped}>
            {!dropped ? (
              <span>Drop here</span>
            ) : (
              <>{[Object.values(droppedComponents)]}</>
            )}
          </Droppable>
        </DndContext>
      </div>
    </main>
  );

  function handleDragEnd(event: { over: any; active: any }) {
    console.log(event);
    const overId = event.over?.id;
    const activeId = event.active?.id;
    console.log({ overId });
    if (overId === "draggable") {
      setDropped(true);
    }
    if (activeId) {
      const dropped = Object.assign(
        {},
        droppedComponents,
        pick([activeId], draggableComponents)
      );
      setDroppedComponents(dropped);
      setDraggableComponents(omit([activeId], draggableComponents));
    }
    //   if (event.active?.id && event.active.id.startsWith("draggable-")) {
    //     const id = nanoid();
    //     setDraggableComponents([
    //       ...draggableComponents,
    //       <Draggable key={id} id={id}>
    //         Drag me
    //       </Draggable>,
    //     ]);
    //   }
    //   if (parent && !over && event?.active?.id) {
    //     setDraggableComponents(
    //       draggableComponents.filter((c) => c.key !== event.active.id)
    //     );
    //   } else if (!parent && over) {
    //     setParent(over?.id ? over.id : null);
    //   }
    // }
  }
}
