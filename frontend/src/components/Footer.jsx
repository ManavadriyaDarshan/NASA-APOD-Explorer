import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full py-6 mt-auto border-t border-white/10 bg-black/20 backdrop-blur-md">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center gap-2 text-gray-400">
        <p className="flex items-center gap-2 text-sm">
          Designed and developed by 
          <span className="font-semibold text-white">Darshan Manavadariya</span>
        </p>
        <p className="text-xs flex items-center gap-1 opacity-60">
          Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for the cosmos
        </p>
      </div>
    </footer>
  );
};

export default Footer;

