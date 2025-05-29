
import React from 'react';

interface FooterProps {
  isDarkMode: boolean;
}

const Footer: React.FC<FooterProps> = ({ isDarkMode }) => {
  return (
    <footer className={`border-t transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="w-full px-2 sm:px-4 lg:px-6 py-3 sm:py-4">
        <div className="flex flex-col lg:flex-row items-center justify-between space-y-3 lg:space-y-0 lg:space-x-4">
          {/* Copyright - Responsive text */}
          <div className={`text-xs sm:text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-center lg:text-left order-2 lg:order-1`}>
            <span className="hidden sm:inline">© 2024 HTML Live Editor. Professional code editing experience.</span>
            <span className="sm:hidden">© 2024 HTML Live Editor</span>
          </div>
          
          {/* Footer Ad Zone - Responsive sizing */}
          <div className={`w-full sm:w-auto lg:w-[728px] h-[60px] sm:h-[90px] border-2 border-dashed transition-colors duration-300 ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} flex items-center justify-center text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} order-1 lg:order-2 flex-shrink-0`}>
            <span className="hidden sm:inline">Footer Ad Zone 728x90</span>
            <span className="sm:hidden">Footer Ad Zone</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
