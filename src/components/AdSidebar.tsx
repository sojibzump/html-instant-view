
import React from 'react';

interface AdSidebarProps {
  isDarkMode: boolean;
}

const AdSidebar: React.FC<AdSidebarProps> = ({ isDarkMode }) => {
  return (
    <div className={`hidden xl:block w-[160px] ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border-r transition-colors duration-300 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className="p-4">
        <div className={`w-full h-[600px] border-2 border-dashed transition-colors duration-300 ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} flex items-center justify-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transform rotate-90`}>
          Sidebar Ad 160x600
        </div>
      </div>
    </div>
  );
};

export default AdSidebar;
