"use client";

import { useStore } from "@/hooks/store";
import JsxParser from "react-jsx-parser";
import Draggable from "./ui/draggable";
import Droppable from "./ui/droppable";

const InventoryItems = () => {
  const { storedComponents } = useStore((state) => state);
  return (
    <Droppable
      key="droppable-inventory"
      id="droppable-inventory"
      dropped={false}
    >
      {storedComponents?.length
        ? storedComponents.map((c, i) => {
            return (
              <div className="stored-component">
                <Draggable key={c.id} id={c.id as string}>
                  <JsxParser key={i} renderInWrapper={false} jsx={c.jsx} />
                </Draggable>
              </div>
            );
          })
        : null}
    </Droppable>
  );
};

export default InventoryItems;
