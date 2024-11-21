"use client";
import { useAppStore } from "@/hooks/app-store";
import { useStore } from "@/hooks/use-store";
import { Sparkles } from "lucide-react";
import { Button } from "./button";

const ToggleMagicInput = () => {
  const appState = useStore(useAppStore, (state) => state);
  return (
    <Button
      onClick={() => {
        if (appState?.isMagicInputHidden) {
          appState?.setIsMagicInputHidden(false);
          appState?.setIsMagicInputToggled(false);
        } else {
          appState?.setIsMagicInputToggled(true);
        }
      }}
      size="icon"
      variant="secondary"
      className="rounded-full w-9 h-9"
    >
      <Sparkles size="14" />
    </Button>
  );
};

export default ToggleMagicInput;
