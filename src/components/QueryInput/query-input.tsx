"use client";
import { delegateGPTAction } from "@/app/actions";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/hooks/app-store";
import { useStore } from "@/hooks/use-store";
import { cn } from "@/lib/utils";
import React, { useState } from "react";

interface TextareaWithSubmitProps {
  onSubmit?: (value: string) => void;
  onFinished?: (str: string) => void;
  onSetPageProps?: (gptAnswer: string) => void;
}

const QueryInput: React.FC<TextareaWithSubmitProps> = ({
  onFinished,
  onSetPageProps,
}) => {
  const [value, setValue] = useState("");
  const { magicInputState = "build", setPageProps = () => {} } =
    useStore(useAppStore, (state) => state) || {};
  return (
    <>
      <div
        className={cn(
          "query-input--container relative overflow-hidden rounded-full p-1 w-[680px]",
          magicInputState === "page" ? "page" : "",
          magicInputState === "panel" ? "panel" : "",
          magicInputState === "refine" ? "refine" : "",
          magicInputState === "surprise" ? "surprise" : ""
        )}
      >
        <Textarea
          name="query"
          className="query-input relative border-2 pr-48 resize-none scroll-m-0 rounded-full p-5 text-xl"
          value={value}
          placeholder="A button with paddings and white text, with gradient background from top blue to bottom green, with 0.5rem border radius"
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={async (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              const { content } = await delegateGPTAction(
                e.currentTarget.value,
                magicInputState
              );
              if (content && magicInputState == "build" && onFinished) {
                onFinished(content);
              } else if (
                content &&
                magicInputState == "page" &&
                onSetPageProps
              ) {
                // const trimmedStr = `${content} bg-[size:100%]`.replace(
                //   /^"|"$/g,
                //   ""
                // );
                const trimmedStr = `${content} bg-[size:100%]`
                  .split(" ")
                  .map((s) => `dark:!${s}`)
                  .join(" ");
                setPageProps({ home: { pageCss: `${trimmedStr}` } });
                onSetPageProps(trimmedStr);
              }
            }
          }}
        />
      </div>
    </>
  );
};

export default QueryInput;
