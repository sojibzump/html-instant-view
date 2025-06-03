
import React, { useEffect, useState } from 'react';
import { adRevenueSystem, AdZone } from '../utils/adRevenueSystem';

interface AdSidebarProps {
  isDarkMode: boolean;
}

const AdSidebar: React.FC<AdSidebarProps> = ({ isDarkMode }) => {
  const [adZone, setAdZone] = useState<AdZone | undefined>();

  useEffect(() => {
    // Track impression when component mounts
    adRevenueSystem.trackImpression('sidebar-ad');
    setAdZone(adRevenueSystem.getAdZone('sidebar-ad'));

    // Set up interval to update metrics display
    const interval = setInterval(() => {
      setAdZone(adRevenueSystem.getAdZone('sidebar-ad'));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleAdClick = () => {
    adRevenueSystem.trackClick('sidebar-ad');
    setAdZone(adRevenueSystem.getAdZone('sidebar-ad'));
  };

  return (
    <div className={`hidden 2xl:block w-[160px] ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border-r transition-colors duration-300 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex-shrink-0`}>
      <div className="p-2 lg:p-4 h-full">
        <div 
          className={`w-full h-[400px] lg:h-[600px] border-2 border-dashed transition-colors duration-300 cursor-pointer hover:opacity-80 ${
            adZone?.isHighRevenue 
              ? isDarkMode ? 'border-green-400 bg-green-900/20' : 'border-green-500 bg-green-50'
              : isDarkMode ? 'border-gray-600' : 'border-gray-300'
          } flex items-center justify-center text-xs lg:text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          } transform rotate-90 relative`}
          onClick={handleAdClick}
        >
          {adZone?.isHighRevenue && (
            <div className="absolute top-2 right-2 text-xs font-bold text-green-500 -rotate-90">
              💰
            </div>
          )}
          <div className="text-center">
            <div className="whitespace-nowrap">Sidebar Ad 160x600</div>
            {adZone && (
              <div className="text-xs opacity-60 mt-1 whitespace-nowrap">
                ${adZone.metrics.revenue.toFixed(2)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdSidebar;
