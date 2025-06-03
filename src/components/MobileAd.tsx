
import React, { useEffect, useState } from 'react';
import { adRevenueSystem, AdZone } from '../utils/adRevenueSystem';

interface MobileAdProps {
  isDarkMode: boolean;
}

const MobileAd: React.FC<MobileAdProps> = ({ isDarkMode }) => {
  const [adZone, setAdZone] = useState<AdZone | undefined>();

  useEffect(() => {
    // Track impression when component mounts
    adRevenueSystem.trackImpression('mobile-ad');
    setAdZone(adRevenueSystem.getAdZone('mobile-ad'));

    // Set up interval to update metrics display
    const interval = setInterval(() => {
      setAdZone(adRevenueSystem.getAdZone('mobile-ad'));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleAdClick = () => {
    adRevenueSystem.trackClick('mobile-ad');
    setAdZone(adRevenueSystem.getAdZone('mobile-ad'));
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
      <div 
        className={`w-full h-[50px] sm:h-[60px] border-t-2 border-dashed transition-colors duration-300 cursor-pointer hover:opacity-80 ${
          adZone?.isHighRevenue 
            ? isDarkMode ? 'border-green-400 bg-green-900/20' : 'border-green-500 bg-green-50'
            : isDarkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-white'
        } flex items-center justify-center text-xs sm:text-sm ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        } relative`}
        onClick={handleAdClick}
      >
        {adZone?.isHighRevenue && (
          <div className="absolute top-1 right-2 text-xs font-bold text-green-500">
            💰 HIGH REV
          </div>
        )}
        <div className="text-center">
          <div className="hidden sm:inline">Mobile Ad Zone 320x50</div>
          <div className="sm:hidden">Mobile Ad</div>
          {adZone && (
            <div className="text-xs opacity-60 mt-1">
              CTR: {adZone.metrics.ctr.toFixed(1)}% | RPM: ${adZone.metrics.rpm.toFixed(2)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileAd;
