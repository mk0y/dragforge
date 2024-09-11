"use client";

import { Send } from "lucide-react";
import React, { useState } from "react";

interface TextareaWithSubmitProps {
  onSubmit: (value: string) => void;
}

const TextareaWithSubmit: React.FC<TextareaWithSubmitProps> = ({
  onSubmit,
}) => {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(value);
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center w-full">
      <textarea
        className="flex-grow p-3 pr-10 min-h-[50px] resize-none border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={1}
      />
      <button
        type="submit"
        className="absolute right-2 bottom-2 flex items-center justify-center w-8 h-8 text-white bg-blue-500 rounded-full hover:bg-blue-600 focus:outline-none focus:ring"
      >
        <Send size={18} />
      </button>
    </form>
  );
};

export default TextareaWithSubmit;
