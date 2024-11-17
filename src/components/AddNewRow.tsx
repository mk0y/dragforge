import { useAppStore } from "@/hooks/app-store";
import { useStore } from "@/hooks/use-store";
import { Rows2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

const AddNewRow = () => {
  const { addCanvasRow = () => {} } =
    useStore(useAppStore, (state) => state) || {};
  return (
    <TooltipProvider>
      <Tooltip delayDuration={250}>
        <TooltipTrigger asChild>
          <div>
            <Button
              size="icon"
              variant="ghost"
              className="dark:hover:bg-black rounded-none"
              onClick={addCanvasRow}
            >
              <Rows2 />
            </Button>
          </div>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Add a row</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AddNewRow;
