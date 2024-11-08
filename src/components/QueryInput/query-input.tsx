"use client";
import { askGPTWhichComponentsToUse } from "@/app/actions";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";

interface TextareaWithSubmitProps {
  onSubmit: (value: string) => void;
  onFinished: (str: string) => void;
}

const TextareaWithSubmit: React.FC<TextareaWithSubmitProps> = ({
  onSubmit,
  onFinished,
}) => {
  const [value, setValue] = useState("");
  const [componentName, setComponentName] = useState<string | null>(null);
  const [LazyComponent, setComponent] = useState<React.ReactNode | null>(null);
  const handleLoadComponent = (name: string) => {
    setComponentName(name);
  };
  const handleSubmit = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    onSubmit(value);
    e.currentTarget.form?.requestSubmit();
    setValue("");
  };
  return (
    <>
      <div className="relative flex items-center w-[680px]">
        <Textarea
          name="query"
          className="pr-48 resize-none scroll-m-0 rounded-full p-5 text-xl"
          value={value}
          placeholder="A button with paddings and white text, with gradient background from top blue to bottom green, with 0.5rem border radius"
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={async (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              const { content } = await askGPTWhichComponentsToUse(
                e.currentTarget.value
              );
              if (content) {
                onFinished(content);
              }
            }
          }}
        />
      </div>
    </>
  );
};

export default TextareaWithSubmit;
