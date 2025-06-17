
import React, { useEffect, useState } from 'react';
import { X, Zap, TrendingUp } from 'lucide-react';
import { adRevenueSystem } from '../utils/adRevenueSystem';

interface FullscreenAdProps {
  isDarkMode: boolean;
  onClose: () => void;
  onProceed: () => void;
}

const FullscreenAd: React.FC<FullscreenAdProps> = ({ isDarkMode, onClose, onProceed }) => {
  const [countdown, setCountdown] = useState(5);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    adRevenueSystem.trackImpression('fullscreen-ad');
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setCanSkip(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSkip = () => {
    adRevenueSystem.trackClick('fullscreen-ad');
    onProceed();
  };

  const handleAdClick = () => {
    adRevenueSystem.trackClick('fullscreen-ad');
    // Simulate ad click revenue
    console.log('💰 Premium ad clicked - High revenue generated!');
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-90">
      <div className={`relative max-w-4xl w-full mx-4 rounded-2xl overflow-hidden ${
        isDarkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'
      }`}>
        {/* Close button - only if can skip */}
        {canSkip && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-all"
          >
            <X size={20} />
          </button>
        )}

        {/* Premium Ad Content */}
        <div 
          className="relative h-96 flex items-center justify-center cursor-pointer group"
          onClick={handleAdClick}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800"></div>
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          
          {/* Premium Ad Content */}
          <div className="relative z-10 text-center text-white p-8">
            <div className="flex items-center justify-center mb-4">
              <Zap className="text-yellow-400 mr-2" size={32} />
              <h2 className="text-3xl font-bold">Premium Web Development Tools</h2>
            </div>
            <p className="text-xl mb-6 opacity-90">
              Unlock professional features and boost your productivity
            </p>
            <div className="flex items-center justify-center space-x-6 mb-6">
              <div className="text-center">
                <TrendingUp size={24} className="mx-auto mb-2 text-green-400" />
                <div className="text-sm">Advanced Analytics</div>
              </div>
              <div className="text-center">
                <Zap size={24} className="mx-auto mb-2 text-yellow-400" />
                <div className="text-sm">AI-Powered</div>
              </div>
              <div className="text-center">
                <div className="w-6 h-6 mx-auto mb-2 bg-blue-400 rounded-full flex items-center justify-center text-xs font-bold">∞</div>
                <div className="text-sm">Unlimited Projects</div>
              </div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm border border-white border-opacity-30 group-hover:bg-opacity-30 transition-all">
              <div className="text-lg font-semibold">Click to Learn More</div>
              <div className="text-sm opacity-80">Special offer for HTML Editor users</div>
            </div>
          </div>

          {/* Countdown overlay */}
          {!canSkip && (
            <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white px-3 py-2 rounded-full text-sm">
              Skip in {countdown}s
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className={`p-6 border-t ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
          <div className="flex justify-between items-center">
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Premium advertising supports free access to HTML Editor
            </div>
            <div className="flex space-x-3">
              {canSkip && (
                <button
                  onClick={onClose}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    isDarkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Maybe Later
                </button>
              )}
              <button
                onClick={handleSkip}
                disabled={!canSkip}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  canSkip
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                }`}
              >
                {canSkip ? 'Continue to Editor' : `Wait ${countdown}s`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullscreenAd;
