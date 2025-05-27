
import React from 'react';

interface FooterProps {
  isDarkMode: boolean;
}

const Footer: React.FC<FooterProps> = ({ isDarkMode }) => {
  return (
    <footer className={`border-t transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="container mx-auto px-2 sm:px-4 py-4">
        <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
          <div className={`text-xs sm:text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-center lg:text-left`}>
            © 2024 HTML Live Editor. Professional code editing experience.
          </div>
          
          {/* Footer Ad Zone */}
          <div className={`w-full lg:w-[728px] h-[90px] border-2 border-dashed transition-colors duration-300 ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} flex items-center justify-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Footer Ad Zone 728x90
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
