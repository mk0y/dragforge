"use client";
import {
  askGPTWhichComponentsToUse,
  generateRandomComponentQuery,
} from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
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
  // useEffect(() => {
  //   if (componentName) {
  //     try {
  //       console.log("Loading component:", componentName);
  //       const LazyComponent = React.lazy(
  //         () => import(`@/components/gen/${componentName}`)
  //       );
  //       setComponent(() => <LazyComponent />);
  //     } catch (e) {
  //       console.log("///// ERROR /////");
  //       console.log("///// ERROR /////");
  //       console.log("///// ERROR /////");
  //       console.log("///// ERROR /////");
  //       console.log("///// ERROR /////");
  //       console.log("///// ERROR /////");
  //       console.log("///// ERROR /////");
  //       console.log("///// ERROR /////");
  //       console.log("///// ERROR /////");
  //       console.log("///// ERROR /////");
  //       console.log("///// ERROR /////");
  //       console.error(e);
  //     }
  //   }
  // }, [componentName]);
  const handleSubmit = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    onSubmit(value);
    e.currentTarget.form?.requestSubmit();
    setValue("");
  };
  return (
    <>
      <div className="relative flex items-center w-full">
        <Textarea
          name="query"
          className="pr-48"
          value={value}
          placeholder="Build me a... and press Enter"
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={async (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              const { content } = await askGPTWhichComponentsToUse(
                e.currentTarget.value
              );
              if (content) {
                onFinished(content);
                // console.log(content);
              }
              // if (componentName) {
              //   setComponentName(componentName);
              //   console.log("Component name:", componentName);
              //   setValue("");
              //   onFinished();
              // }
            }
          }}
        />
        {/* <textarea
          name="query"
          className="flex-grow p-3 pr-10 min-h-[50px] resize-none border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Build me a... and press Enter"
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
        /> */}
        <div className="absolute right-2">
          <Button
            onClick={async () => {
              const { content } = await generateRandomComponentQuery();
              console.log({ content });
              setValue(content);
            }}
            className="text-white bg-blue-500 rounded-full hover:bg-blue-600 focus:outline-none focus:ring"
          >
            <Send size={18} className="mr-1" />
            Generate random
          </Button>
        </div>
      </div>
      {/* {LazyComponent && (
        <Suspense fallback={<div>Loading...</div>}>{LazyComponent}</Suspense>
      )} */}
    </>
  );
};

export default TextareaWithSubmit;
