
import React, { useEffect, useState } from 'react';
import { adRevenueSystem, AdZone } from '../utils/adRevenueSystem';

interface FooterProps {
  isDarkMode: boolean;
}

const Footer: React.FC<FooterProps> = ({ isDarkMode }) => {
  const [adZone, setAdZone] = useState<AdZone | undefined>();

  useEffect(() => {
    // Track impression when component mounts
    adRevenueSystem.trackImpression('footer-ad');
    setAdZone(adRevenueSystem.getAdZone('footer-ad'));

    // Set up interval to update metrics display
    const interval = setInterval(() => {
      setAdZone(adRevenueSystem.getAdZone('footer-ad'));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleAdClick = () => {
    adRevenueSystem.trackClick('footer-ad');
    setAdZone(adRevenueSystem.getAdZone('footer-ad'));
  };

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
          <div 
            className={`w-full sm:w-auto lg:w-[728px] h-[60px] sm:h-[90px] border-2 border-dashed transition-colors duration-300 cursor-pointer hover:opacity-80 ${
              adZone?.isHighRevenue 
                ? isDarkMode ? 'border-green-400 bg-green-900/20' : 'border-green-500 bg-green-50'
                : isDarkMode ? 'border-gray-600' : 'border-gray-300'
            } flex items-center justify-center text-xs sm:text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            } order-1 lg:order-2 flex-shrink-0 relative`}
            onClick={handleAdClick}
          >
            {adZone?.isHighRevenue && (
              <div className="absolute top-2 right-2 text-xs font-bold text-green-500">
                💰 HIGH REVENUE
              </div>
            )}
            <div className="text-center">
              <div className="hidden sm:inline">Footer Ad Zone 728x90</div>
              <div className="sm:hidden">Footer Ad Zone</div>
              {adZone && (
                <div className="text-xs opacity-60 mt-1">
                  Impressions: {adZone.metrics.impressions} | Revenue: ${adZone.metrics.revenue.toFixed(2)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
