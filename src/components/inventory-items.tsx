"use client";
import { useAppStore } from "@/hooks/app-store";
import { useStore } from "@/hooks/use-store";
import JsxParser from "react-jsx-parser";
import DraggableInventory from "./ui/draggable-inventory";
import DroppableInventory from "./ui/droppable-inventory";

const InventoryItems = () => {
  const storedComponents = useStore(
    useAppStore,
    (state) => state.storedComponents
  );
  return (
    <DroppableInventory
      key="droppable-inventory"
      id="droppable-inventory"
      dropped={false}
    >
      {storedComponents?.length
        ? storedComponents.map((c, i) => {
            return (
              <div key={i} className="stored-component border-b border-primary-foreground border-dashed p-2 w-full">
                <DraggableInventory id={c.id as string}>
                  <JsxParser key={i} renderInWrapper={false} jsx={c.jsx} />
                </DraggableInventory>
              </div>
            );
          })
        : null}
    </DroppableInventory>
  );
};

export default InventoryItems;
