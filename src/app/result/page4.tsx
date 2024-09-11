"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const InputFieldWithSubmit: React.FC<{ onSubmit: (value: string) => void }> = ({ onSubmit }) => {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit(value);
      setValue("");
    }
  };

  return (
    <div className="relative">
      <Textarea
        className="resize-none pr-24"
        rows={4}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type your message here..."
      />
      <Button
        className="absolute right-2 top-2"
        onClick={handleSubmit}
        variant="primary"
      >
        Submit
      </Button>
    </div>
  );
};

export default InputFieldWithSubmit;
