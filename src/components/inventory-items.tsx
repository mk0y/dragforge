"use client";
import { useStore } from "@/hooks/store";
import JsxParser from "react-jsx-parser";
import Draggable from "./ui/draggable";
import DroppableInventory from "./ui/droppable-inventory";

const InventoryItems = () => {
  const { storedComponents } = useStore((state) => state);
  return (
    <DroppableInventory
      key="droppable-inventory"
      id="droppable-inventory"
      dropped={false}
    >
      {storedComponents?.length
        ? storedComponents.map((c, i) => {
            return (
              <div key={i} className="stored-component">
                <Draggable id={c.id as string}>
                  <JsxParser key={i} renderInWrapper={false} jsx={c.jsx} />
                </Draggable>
              </div>
            );
          })
        : null}
    </DroppableInventory>
  );
};

export default InventoryItems;
