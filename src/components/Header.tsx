
import React from 'react';
import { Moon, Sun, Download, Save, FolderOpen, Maximize2, Minimize2, Copy, RotateCcw, Trash2, MousePointer, Zap } from 'lucide-react';
import { adRevenueSystem } from '../utils/adRevenueSystem';

interface HeaderProps {
  isDarkMode: boolean;
  isFullscreen: boolean;
  onToggleTheme: () => void;
  onToggleFullscreen: () => void;
  onSelectAllCode: () => void;
  onCopyToClipboard: () => void;
  onClearCode: () => void;
  onSaveProject: () => void;
  onLoadProject: () => void;
  onExportHTML: () => void;
}

const Header: React.FC<HeaderProps> = ({
  isDarkMode,
  isFullscreen,
  onToggleTheme,
  onToggleFullscreen,
  onSelectAllCode,
  onCopyToClipboard,
  onClearCode,
  onSaveProject,
  onLoadProject,
  onExportHTML,
}) => {
  const headerAdZone = adRevenueSystem.getAdZone('header-ad');

  return (
    <header className={`border-b transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} sticky top-0 z-40`}>
      <div className="w-full px-2 sm:px-4 lg:px-6 py-2 sm:py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Title - Enhanced responsive design */}
          <div className="flex items-center space-x-1 sm:space-x-3 min-w-0 flex-shrink-0">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-gradient-to-br from-indigo-600 to-purple-600' : 'bg-gradient-to-br from-indigo-500 to-purple-500'}`}>
                <span className="text-white font-bold text-sm sm:text-base">H</span>
              </div>
              <div className="flex flex-col">
                <h1 className={`text-sm sm:text-lg lg:text-xl font-bold transition-colors duration-300 truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  <span className="hidden sm:inline">HTML Live Editor</span>
                  <span className="sm:hidden">HTML Editor</span>
                </h1>
                <span className={`text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded transition-colors duration-300 w-fit ${isDarkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-800'}`}>
                  <span className="hidden md:inline">Professional Blogger Support</span>
                  <span className="md:hidden hidden sm:inline">Pro + Blogger</span>
                  <span className="sm:hidden">Pro</span>
                </span>
              </div>
            </div>
          </div>
          
          {/* Header Ad Zone - Enhanced with revenue tracking */}
          <div 
            className={`hidden xl:flex w-[728px] h-[90px] border-2 border-dashed transition-colors duration-300 cursor-pointer hover:opacity-80 ${
              headerAdZone?.isHighRevenue 
                ? isDarkMode ? 'border-green-400 bg-green-900/20' : 'border-green-500 bg-green-50'
                : isDarkMode ? 'border-gray-600' : 'border-gray-300'
            } items-center justify-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} relative`}
            onClick={() => {
              adRevenueSystem.trackClick('header-ad');
            }}
          >
            {headerAdZone?.isHighRevenue && (
              <div className="absolute top-2 right-2 text-xs font-bold text-green-500 flex items-center space-x-1">
                <Zap size={12} />
                <span>HIGH REVENUE</span>
              </div>
            )}
            <div className="text-center">
              <div>Premium Header Ad Zone 728x90</div>
              {headerAdZone && (
                <div className="text-xs opacity-60 mt-1">
                  CTR: {headerAdZone.metrics.ctr.toFixed(1)}% | Revenue: ${headerAdZone.metrics.revenue.toFixed(2)}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons - Enhanced responsive layout */}
          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            {/* Essential actions - always visible with better touch targets */}
            <div className="flex items-center space-x-1">
              <button
                onClick={onCopyToClipboard}
                className={`p-2 sm:p-3 rounded-lg transition-all duration-200 min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center ${isDarkMode ? 'hover:bg-gray-700 text-gray-300 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'}`}
                title="Copy All Code"
              >
                <Copy size={16} className="sm:w-5 sm:h-5" />
              </button>
              
              <button
                onClick={onExportHTML}
                className={`p-2 sm:p-3 rounded-lg transition-all duration-200 min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center ${isDarkMode ? 'hover:bg-gray-700 text-gray-300 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'}`}
                title="Download HTML"
              >
                <Download size={16} className="sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Secondary actions - progressive disclosure */}
            <div className="hidden xs:flex items-center space-x-1">
              <button
                onClick={onSelectAllCode}
                className={`p-2 sm:p-3 rounded-lg transition-all duration-200 min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center ${isDarkMode ? 'hover:bg-gray-700 text-gray-300 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'}`}
                title="Select All Code"
              >
                <MousePointer size={16} className="sm:w-5 sm:h-5" />
              </button>

              <button
                onClick={onClearCode}
                className={`p-2 sm:p-3 rounded-lg transition-all duration-200 min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center text-red-500 ${isDarkMode ? 'hover:bg-red-900/20' : 'hover:bg-red-50'}`}
                title="Clear All Code"
              >
                <Trash2 size={16} className="sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Project actions - hidden on smaller screens */}
            <div className="hidden md:flex items-center space-x-1">
              <button
                onClick={onSaveProject}
                className={`p-2 sm:p-3 rounded-lg transition-all duration-200 min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center ${isDarkMode ? 'hover:bg-gray-700 text-gray-300 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'}`}
                title="Save Project"
              >
                <Save size={16} className="sm:w-5 sm:h-5" />
              </button>
              
              <button
                onClick={onLoadProject}
                className={`p-2 sm:p-3 rounded-lg transition-all duration-200 min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center ${isDarkMode ? 'hover:bg-gray-700 text-gray-300 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'}`}
                title="Load Project"
              >
                <FolderOpen size={16} className="sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Essential controls - always visible */}
            <div className="flex items-center space-x-1 border-l pl-1 sm:pl-2 ml-1 sm:ml-2 border-gray-300 dark:border-gray-600">
              <button
                onClick={onToggleFullscreen}
                className={`p-2 sm:p-3 rounded-lg transition-all duration-200 min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center ${isDarkMode ? 'hover:bg-gray-700 text-gray-300 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'}`}
                title={isFullscreen ? "Exit Full Preview" : "Full Preview Mode"}
              >
                {isFullscreen ? <Minimize2 size={16} className="sm:w-5 sm:h-5" /> : <Maximize2 size={16} className="sm:w-5 sm:h-5" />}
              </button>
              
              <button
                onClick={onToggleTheme}
                className={`p-2 sm:p-3 rounded-lg transition-all duration-200 min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center ${isDarkMode ? 'hover:bg-gray-700 text-yellow-400' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'}`}
                title="Toggle Light/Dark Mode"
              >
                {isDarkMode ? <Sun size={16} className="sm:w-5 sm:h-5" /> : <Moon size={16} className="sm:w-5 sm:h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
