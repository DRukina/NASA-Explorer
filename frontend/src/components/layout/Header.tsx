import React from 'react';
import { Link } from 'react-router-dom';
import { Telescope } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <nav className="p-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Telescope className="h-8 w-8 text-cosmic-blue" />
          <h1 className="text-2xl font-bold text-white">NASA Explorer</h1>
        </div>

        <div className="hidden md:flex space-x-6">
          <Link
            to="/"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Home
          </Link>
          <Link
            to="/apod"
            className="text-gray-300 hover:text-white transition-colors"
          >
            APOD
          </Link>
          <Link
            to="/neo"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Near Earth Objects
          </Link>
        </div>
      </div>
    </nav>
  );
};
