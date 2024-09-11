"use client";

import { sendGPTQuery } from "@/app/actions";
import { Send } from "lucide-react";
import React, { Suspense, useEffect, useState } from "react";

interface TextareaWithSubmitProps {
  onSubmit: (value: string) => void;
}

const TextareaWithSubmit: React.FC<TextareaWithSubmitProps> = ({
  onSubmit,
}) => {
  const [value, setValue] = useState("");
  const [componentName, setComponentName] = useState<string | null>(null);
  const [LazyComponent, setComponent] = useState<React.ReactNode | null>(null);
  const handleLoadComponent = (name: string) => {
    setComponentName(name);
  };
  useEffect(() => {
    if (componentName) {
      console.log("Loading component:", componentName);
      const LazyComponent = React.lazy(
        () => import(`@/components/gen/${componentName}`)
      );
      setComponent(() => <LazyComponent />);
    }
  }, [componentName]);

  const handleSubmit = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    onSubmit(value);
    e.currentTarget.form?.requestSubmit();
    setValue("");
  };

  return (
    <>
      <div className="relative flex items-center w-full">
        <textarea
          name="query"
          className="flex-grow p-3 pr-10 min-h-[50px] resize-none border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Build me a..."
          onKeyDown={async (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              const { componentName } = await sendGPTQuery(
                e.currentTarget.value
              );
              if (componentName) {
                setComponentName(componentName);
                console.log("Component name:", componentName);
                setValue("");
              }
            }
          }}
          rows={1}
        />
        <button
          type="submit"
          className="absolute right-2 bottom-2 flex items-center justify-center w-8 h-8 text-white bg-blue-500 rounded-full hover:bg-blue-600 focus:outline-none focus:ring"
        >
          <Send size={18} />
        </button>
      </div>
      {LazyComponent && (
        <Suspense fallback={<div>Loading...</div>}>{LazyComponent}</Suspense>
      )}
    </>
  );
};

export default TextareaWithSubmit;
