import { useAppStore } from "@/hooks/app-store";
import { Minus, Redo2, Undo2 } from "lucide-react";
import { nanoid } from "nanoid";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const UndoRedoActions = () => {
  const { pastStates, futureStates, undo, redo, clear } =
    useAppStore.temporal.getState();
  const [, pleaseUpdate] = useState(0); // clear() doesn't re-render
  const canUndo = !!pastStates.length;
  const canRedo = !!futureStates.length;
  return (
    <div className="flex justify-center items-center">
      <Button key={nanoid()} variant="ghost" size="sm" onClick={() => undo()}>
        <Undo2 color={canUndo ? "white" : "gray"} />
      </Button>
      <Button key={nanoid()} variant="ghost" size="sm" onClick={() => redo()}>
        <Redo2 color={canRedo ? "white" : "gray"} />
      </Button>
      <TooltipProvider>
        <Tooltip delayDuration={400}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                clear();
                pleaseUpdate((u) => u + 1);
              }}
            >
              <Minus color={canUndo ? "white" : "gray"} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Clear history</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default UndoRedoActions;
