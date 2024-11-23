import { useAppStore } from "@/hooks/app-store";
import { useStore } from "@/hooks/use-store";
import { cn } from "@/lib/utils";
import { TableCellsSplit } from "lucide-react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const AddNewRow = () => {
  const { isEditCanvas = false, toggleIsEditCanvas = () => {} } =
    useStore(useAppStore, (state) => state) || {};
  return (
    <TooltipProvider>
      <Tooltip delayDuration={250}>
        <TooltipTrigger asChild>
          <div>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                toggleIsEditCanvas();
              }}
              className={cn(
                "dark:hover:bg-black rounded-none",
                isEditCanvas ? "bg-black" : ""
              )}
            >
              <TableCellsSplit />
            </Button>
          </div>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Arrange panels</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AddNewRow;
