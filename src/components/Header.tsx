
import React from 'react';
import { Moon, Sun, Download, Save, FolderOpen, Maximize2, Minimize2, Copy, RotateCcw, Trash2, MousePointer } from 'lucide-react';

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
  return (
    <header className={`border-b transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="container mx-auto px-2 sm:px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <h1 className={`text-lg sm:text-xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              HTML Live Editor
            </h1>
            <span className={`text-xs sm:text-sm px-2 py-1 rounded transition-colors duration-300 ${isDarkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-800'}`}>
              Professional
            </span>
          </div>
          
          {/* Header Ad Zone - Hidden on mobile and small screens */}
          <div className={`hidden xl:block w-[728px] h-[90px] border-2 border-dashed transition-colors duration-300 ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} flex items-center justify-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Header Ad Zone 728x90
          </div>

          <div className="flex items-center space-x-1 sm:space-x-3">
            <button
              onClick={onSelectAllCode}
              className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
              title="Select All Code"
            >
              <MousePointer size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
            <button
              onClick={onCopyToClipboard}
              className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
              title="Copy Code"
            >
              <Copy size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
            <button
              onClick={onClearCode}
              className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
              title="Clear Code"
            >
              <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
            <button
              onClick={onSaveProject}
              className={`hidden sm:flex p-1.5 sm:p-2 rounded-lg transition-all duration-200 ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
              title="Save Project"
            >
              <Save size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
            <button
              onClick={onLoadProject}
              className={`hidden sm:flex p-1.5 sm:p-2 rounded-lg transition-all duration-200 ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
              title="Load Project"
            >
              <FolderOpen size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
            <button
              onClick={onExportHTML}
              className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
              title="Download HTML"
            >
              <Download size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
            <button
              onClick={onToggleFullscreen}
              className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
              title={isFullscreen ? "Exit Full Preview" : "Full Preview Mode"}
            >
              {isFullscreen ? <Minimize2 size={16} className="sm:w-[18px] sm:h-[18px]" /> : <Maximize2 size={16} className="sm:w-[18px] sm:h-[18px]" />}
            </button>
            <button
              onClick={onToggleTheme}
              className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun size={16} className="sm:w-[18px] sm:h-[18px]" /> : <Moon size={16} className="sm:w-[18px] sm:h-[18px]" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
