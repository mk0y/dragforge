"use client";

import React, { useState } from 'react';
import { Send } from 'lucide-react';

const TextAreaWithSubmit: React.FC = () => {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    console.log(text);
    setText('');
  };

  return (
    <div className="relative">
      <textarea
        className="resize-none border-2 border-light-red-500 bg-white text-black rounded-lg py-2 px-4 pr-20 focus:outline-none focus:ring focus:ring-light-red-300"
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your message here..."
      />
      <button
        onClick={handleSubmit}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-light-red-500 text-white rounded-lg p-2 shadow-md hover:bg-light-red-600 focus:outline-none"
      >
        <Send size={20} />
      </button>
    </div>
  );
};

export default TextAreaWithSubmit;
