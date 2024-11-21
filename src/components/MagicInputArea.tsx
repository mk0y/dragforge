import { useAppStore } from "@/hooks/app-store";
import { cn } from "@/lib/utils";
import { nanoid } from "nanoid";
import { useRef } from "react";
import { useStore } from "zustand";
import ActionItems from "./QueryInput/ActionItems";
import QueryInput from "./QueryInput/query-input";

const MagicInputArea = () => {
  const appState = useStore(useAppStore, (state) => state);
  const divRef = useRef<HTMLDivElement>(null);
  divRef.current?.addEventListener("animationend", () =>
    appState.setIsMagicInputHidden(true)
  );
  return (
    <div
      ref={divRef}
      className={cn(
        "flex flex-col w-full items-center",
        appState.isMagicInputToggled
          ? "hidden-animation--to-top"
          : "hidden-animation--back"
      )}
    >
      <QueryInput
        onFinished={(jsx: string) => {
          appState?.setCurrentComponent({ jsx, id: nanoid() });
        }}
      />
      <ActionItems className="p-1" />
    </div>
  );
};

export default MagicInputArea;
