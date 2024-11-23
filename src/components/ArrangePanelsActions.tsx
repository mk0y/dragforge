import { useAppStore } from "@/hooks/app-store";
import { useStore } from "@/hooks/use-store";
import { cn } from "@/lib/utils";
import {
  CornerLeftDown,
  CornerRightUp,
  ListX,
  MinusCircle,
  PlusCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

const ActionButton = ({
  onClick,
  children,
}: {
  onClick: Function;
  children: React.ReactNode;
}) => {
  return (
    <Button
      size="icon"
      variant="link"
      onClick={() => onClick()}
      className="action-arrange rounded-full w-6 h-6 bg-primary-foreground"
    >
      {children}
    </Button>
  );
};

const ArrangePanelsActions = ({ rowIndex }: { rowIndex: number }) => {
  const {
    addCanvasPanel = () => {},
    removeCanvasPanel = () => {},
    addCanvasRow = () => {},
    addCanvasRowAbove = () => {},
    removeRow = () => {},
  } = useStore(useAppStore, (state) => state) || {};
  const [isRevealed, setIsRevealed] = useState(false);
  useEffect(() => {
    setTimeout(() => setIsRevealed(true), 4);
  }, []);
  return (
    <div
      className={cn(
        `arrange-actions-wrap overflow-hidden w-0 flex absolute top-2 left-2 gap-2`,
        isRevealed && "w-[200px]"
      )}
    >
      <ActionButton onClick={() => addCanvasPanel && addCanvasPanel(rowIndex)}>
        <PlusCircle />
      </ActionButton>
      <ActionButton
        onClick={() => removeCanvasPanel && removeCanvasPanel(rowIndex)}
      >
        <MinusCircle />
      </ActionButton>
      <ActionButton onClick={() => addCanvasRow(rowIndex)}>
        <CornerLeftDown />
      </ActionButton>
      <ActionButton onClick={() => addCanvasRowAbove(rowIndex)}>
        <CornerRightUp />
      </ActionButton>
      <ActionButton onClick={() => removeRow(rowIndex)}>
        <ListX />
      </ActionButton>
    </div>
  );
};

export default ArrangePanelsActions;
