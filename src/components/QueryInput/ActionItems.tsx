import { useAppStore } from "@/hooks/app-store";
import { useStore } from "@/hooks/use-store";
import { cn } from "@/lib/utils";
import { nanoid } from "nanoid";
import { Button } from "../ui/button";

const ActionButton = ({
  children,
  variant,
  onClick,
  active,
}: {
  children: React.ReactNode;
  variant?:
    | "teal"
    | "teal-active"
    | "blue"
    | "blue-active"
    | "purple"
    | "purple-active"
    | "yellow"
    | "yellow-active"
    | "green"
    | "green-active"
    | "pink"
    | "pink-active";
  onClick?: Function;
  active?: boolean;
}) => {
  return (
    <Button
      size="sm"
      variant={variant ? variant : "ghost"}
      className="transition-all rounded-full mx-1"
      onClick={() => (onClick ? onClick() : null)}
    >
      {children}
    </Button>
  );
};

const ActionItems = ({ className }: { className?: string }) => {
  const { magicInputState = "build", setMagicInputState = () => {} } =
    useStore(useAppStore, (state) => state) || {};
  return (
    <div className={cn("flex items-start justify-between", className)}>
      <ActionButton
        key={nanoid()}
        variant={magicInputState === "build" ? "teal-active" : "teal"}
        onClick={() => setMagicInputState("build")}
      >
        Build me...
      </ActionButton>
      <ActionButton
        key={nanoid()}
        variant={magicInputState === "page" ? "blue-active" : "blue"}
        onClick={() => setMagicInputState("page")}
      >
        Describe page
      </ActionButton>
      <ActionButton
        key={nanoid()}
        variant={magicInputState === "panel" ? "purple-active" : "purple"}
        onClick={() => setMagicInputState("panel")}
      >
        Describe panel
      </ActionButton>
      <ActionButton
        key={nanoid()}
        variant={magicInputState === "refine" ? "yellow-active" : "yellow"}
        onClick={() => setMagicInputState("refine")}
      >
        Refine component
      </ActionButton>
      <ActionButton
        key={nanoid()}
        variant={magicInputState === "surprise" ? "pink-active" : "pink"}
        onClick={() => setMagicInputState("surprise")}
      >
        Surprise me
      </ActionButton>
    </div>
  );
};

export default ActionItems;
