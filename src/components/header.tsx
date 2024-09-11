import React from 'react';
import { Search } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="flex w-full items-center justify-between h-12 bg-gray-800 p-4">
      <div className="text-white font-bold text-lg">
        Logo
      </div>
      <nav className="flex space-x-6">
        <a href="#" className="text-white hover:text-gray-400">Home</a>
        <a href="#" className="text-white hover:text-gray-400">About</a>
        <a href="#" className="text-white hover:text-gray-400">Services</a>
        <a href="#" className="text-white hover:text-gray-400">Contact</a>
        <button className="text-white hover:text-gray-400">
          <Search size={20} />
        </button>
      </nav>
    </header>
  );
};

export default Header;
