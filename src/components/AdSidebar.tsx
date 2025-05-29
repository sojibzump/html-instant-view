
import React from 'react';

interface AdSidebarProps {
  isDarkMode: boolean;
}

const AdSidebar: React.FC<AdSidebarProps> = ({ isDarkMode }) => {
  return (
    <div className={`hidden 2xl:block w-[160px] ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border-r transition-colors duration-300 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex-shrink-0`}>
      <div className="p-2 lg:p-4 h-full">
        <div className={`w-full h-[400px] lg:h-[600px] border-2 border-dashed transition-colors duration-300 ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} flex items-center justify-center text-xs lg:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transform rotate-90`}>
          <span className="whitespace-nowrap">Sidebar Ad 160x600</span>
        </div>
      </div>
    </div>
  );
};

export default AdSidebar;
