
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
      <div className="w-full px-2 sm:px-4 lg:px-6 py-2 sm:py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Title - Responsive sizing */}
          <div className="flex items-center space-x-1 sm:space-x-3 min-w-0">
            <h1 className={`text-sm sm:text-lg lg:text-xl font-bold transition-colors duration-300 truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <span className="hidden sm:inline">HTML Live Editor</span>
              <span className="sm:hidden">HTML Editor</span>
            </h1>
            <span className={`text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded transition-colors duration-300 ${isDarkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-800'}`}>
              <span className="hidden md:inline">Professional</span>
              <span className="md:hidden">Pro</span>
            </span>
          </div>
          
          {/* Header Ad Zone - Progressive hiding on smaller screens */}
          <div className={`hidden 2xl:flex w-[728px] h-[90px] border-2 border-dashed transition-colors duration-300 ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} items-center justify-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Header Ad Zone 728x90
          </div>

          {/* Action Buttons - Responsive layout */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Primary actions - always visible */}
            <button
              onClick={onCopyToClipboard}
              className={`p-1 sm:p-1.5 lg:p-2 rounded-lg transition-all duration-200 ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
              title="Copy Code"
            >
              <Copy size={14} className="sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
            </button>
            
            <button
              onClick={onExportHTML}
              className={`p-1 sm:p-1.5 lg:p-2 rounded-lg transition-all duration-200 ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
              title="Download HTML"
            >
              <Download size={14} className="sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
            </button>

            {/* Secondary actions - hidden on smallest screens */}
            <button
              onClick={onSelectAllCode}
              className={`hidden xs:flex p-1 sm:p-1.5 lg:p-2 rounded-lg transition-all duration-200 ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
              title="Select All Code"
            >
              <MousePointer size={14} className="sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
            </button>

            <button
              onClick={onClearCode}
              className={`hidden sm:flex p-1 sm:p-1.5 lg:p-2 rounded-lg transition-all duration-200 ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
              title="Clear Code"
            >
              <Trash2 size={14} className="sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
            </button>

            {/* Project actions - hidden on mobile */}
            <button
              onClick={onSaveProject}
              className={`hidden md:flex p-1 sm:p-1.5 lg:p-2 rounded-lg transition-all duration-200 ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
              title="Save Project"
            >
              <Save size={14} className="sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
            </button>
            
            <button
              onClick={onLoadProject}
              className={`hidden md:flex p-1 sm:p-1.5 lg:p-2 rounded-lg transition-all duration-200 ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
              title="Load Project"
            >
              <FolderOpen size={14} className="sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
            </button>

            {/* Essential controls - always visible */}
            <button
              onClick={onToggleFullscreen}
              className={`p-1 sm:p-1.5 lg:p-2 rounded-lg transition-all duration-200 ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
              title={isFullscreen ? "Exit Full Preview" : "Full Preview Mode"}
            >
              {isFullscreen ? <Minimize2 size={14} className="sm:w-4 sm:h-4 lg:w-5 lg:h-5" /> : <Maximize2 size={14} className="sm:w-4 sm:h-4 lg:w-5 lg:h-5" />}
            </button>
            
            <button
              onClick={onToggleTheme}
              className={`p-1 sm:p-1.5 lg:p-2 rounded-lg transition-all duration-200 ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun size={14} className="sm:w-4 sm:h-4 lg:w-5 lg:h-5" /> : <Moon size={14} className="sm:w-4 sm:h-4 lg:w-5 lg:h-5" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
