
import React from 'react';

interface MobileAdProps {
  isDarkMode: boolean;
}

const MobileAd: React.FC<MobileAdProps> = ({ isDarkMode }) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
      <div className={`w-full h-[50px] border-t-2 border-dashed transition-colors duration-300 ${isDarkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-white'} flex items-center justify-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        Mobile Ad Zone 320x50
      </div>
    </div>
  );
};

export default MobileAd;
