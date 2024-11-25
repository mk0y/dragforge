import { useAppStore } from "@/hooks/app-store";
import { useStore } from "@/hooks/use-store";
import { useClickOutside } from "@/hooks/utility-hooks";
import { cn } from "@/lib/utils";
import { Brush } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const PaintResizableHandle = () => {
  const { setDragHandlesColor = () => {}, dragHandlesColor } =
    useStore(useAppStore, (state) => state) || {};
  const [toggled, setToggled] = useState(true);
  const ref = useRef(null);
  const close = useCallback(() => setToggled(true), []);
  useClickOutside(ref, close);
  return (
    <TooltipProvider>
      <Tooltip delayDuration={250}>
        <TooltipTrigger asChild>
          <div ref={ref} className="relative">
            <Button
              size="icon"
              variant="ghost"
              className="dark:hover:bg-black rounded-none"
              onClick={() => setToggled((t) => !t)}
            >
              <Brush />
            </Button>
            <div className={cn("absolute z-20", toggled && "hidden")}>
              <HexColorPicker
                color={dragHandlesColor || "#262626"}
                onChange={(color) => setDragHandlesColor(color)}
              />
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Paint resizable handles</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default PaintResizableHandle;
