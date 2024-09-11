"use client";

import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between bg-white border-b border-gray-300 shadow-md p-4">
      <div className="text-lg font-bold text-black">Logo</div>
      <nav className="flex space-x-6">
        <a href="#dashboard" className="text-black hover:text-gray-700">Dashboard</a>
        <a href="#docs" className="text-black hover:text-gray-700">Docs</a>
        <a href="#pricing" className="text-black hover:text-gray-700">Pricing</a>
        <a href="#blog" className="text-black hover:text-gray-700">Blog</a>
      </nav>
    </header>
  );
};

export default Header;