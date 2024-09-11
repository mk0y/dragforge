"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

const InputWithSubmit: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>("");

  const handleSubmit = () => {
    console.log(inputValue);
    setInputValue("");
  };

  return (
    <div className="relative flex">
      <Textarea
        className="resize-none pr-12"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Type your message..."
        rows={3}
      />
      <Button
        className="absolute right-2 top-1/2 transform -translate-y-1/2"
        onClick={handleSubmit}
        variant="primary"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default InputWithSubmit;
