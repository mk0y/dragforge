"use client";

import { Send } from "lucide-react";
import React, { useState } from "react";

const TextInputWithSubmit: React.FC = () => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle submit logic here
    console.log(inputValue);
    setInputValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-xl mx-auto">
      <textarea
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        rows={4}
        className="flex-1 border-2 border-darkred rounded-l-md px-4 py-2 text-black bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-darkred"
        placeholder="Type your message..."
      />
      <button
        type="submit"
        className="bg-darkred text-white rounded-r-md px-4 flex items-center justify-center focus:outline-none hover:bg-red-600 shadow-md"
      >
        <Send className="w-4 h-4" />
      </button>
    </form>
  );
};

export default TextInputWithSubmit;
