import { SquareArrowOutUpRight } from "lucide-react";
import { Button } from "../ui/button";

const PreviewCanvas = () => {
  return (
    <div>
      <Button size="sm" variant="ghost" onClick={() => {}}>
        <SquareArrowOutUpRight />
        <span className="hover:underline">Preview</span>
      </Button>
    </div>
  );
};

export default PreviewCanvas;
