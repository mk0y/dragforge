import { cn } from "@/lib/utils";
import { nanoid } from "nanoid";
import { Button } from "../ui/button";

const ActionButton = ({
  children,
  variant,
  onClick,
}: {
  children: React.ReactNode;
  variant?: "teal" | "blue" | "purple" | "yellow" | "green" | "pink";
  onClick?: Function;
}) => {
  return (
    <Button
      size="sm"
      variant={variant ? variant : "ghost"}
      className="rounded-full mx-1"
      onClick={() => (onClick ? onClick() : null)}
    >
      {children}
    </Button>
  );
};

const ActionItems = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex items-start justify-between", className)}>
      <ActionButton key={nanoid()} variant="teal">
        Build me...
      </ActionButton>
      <ActionButton key={nanoid()} variant="blue">
        Page background
      </ActionButton>
      <ActionButton key={nanoid()} variant="yellow">
        Panel background
      </ActionButton>
      <ActionButton key={nanoid()} variant="purple">
        Refine component
      </ActionButton>
      <ActionButton key={nanoid()} variant="pink">
        Surprise me
      </ActionButton>
    </div>
  );
};

export default ActionItems;
