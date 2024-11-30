import { useAppStore } from "@/hooks/app-store";
import { useStore } from "@/hooks/use-store";
import { Percent } from "lucide-react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const PercentUnits = () => {
  const {
    dragUnit = "pixels",
    setDragUnit = () => {},
  } = useStore(useAppStore, (state) => state) || {};
  return (
    <TooltipProvider>
      <Tooltip delayDuration={250}>
        <TooltipTrigger asChild>
          <div>
            <Button
              size="icon"
              variant="ghost"
              className="dark:hover:bg-black rounded-none"
              onClick={() => {
                dragUnit === "percentages" ? setDragUnit("pixels") : null;
                dragUnit === "pixels" ? setDragUnit("percentages") : null;
              }}
            >
              {dragUnit !== "percentages" || !dragUnit ? (
                <Percent />
              ) : (
                <span>px</span>
              )}
            </Button>
          </div>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>{`Use ${
            dragUnit === "pixels" ? "percentages" : "pixels"
          } unit`}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default PercentUnits;
