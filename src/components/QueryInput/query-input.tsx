"use client";
import { generateComponentFromGPT } from "@/app/actions";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";

interface TextareaWithSubmitProps {
  onSubmit?: (value: string) => void;
  onFinished: (str: string) => void;
}

const QueryInput: React.FC<TextareaWithSubmitProps> = ({ onFinished }) => {
  const [value, setValue] = useState("");
  return (
    <>
      <div className="query-input--container relative overflow-hidden rounded-full p-1 w-[680px]">
        <Textarea
          name="query"
          className="query-input relative border-2 pr-48 resize-none scroll-m-0 rounded-full p-5 text-xl"
          value={value}
          placeholder="A button with paddings and white text, with gradient background from top blue to bottom green, with 0.5rem border radius"
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={async (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              const { content } = await generateComponentFromGPT(
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

export default QueryInput;
