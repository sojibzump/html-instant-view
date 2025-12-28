import React from 'react';
import { 
  Moon, 
  Sun, 
  Download, 
  Save, 
  FolderOpen, 
  Maximize2, 
  Minimize2, 
  Copy, 
  Trash2, 
  MousePointer, 
  Keyboard, 
  Github,
  Sparkles,
  Menu
} from 'lucide-react';

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
  onShowKeyboardShortcuts?: () => void;
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
  onShowKeyboardShortcuts,
}) => {
  const ActionButton = ({ 
    onClick, 
    icon: Icon, 
    title, 
    className = '' 
  }: { 
    onClick: () => void; 
    icon: React.ElementType; 
    title: string; 
    className?: string;
  }) => (
    <button
      onClick={onClick}
      className={`p-2.5 rounded-lg transition-all duration-200 min-w-[40px] min-h-[40px] flex items-center justify-center hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/50 ${
        isDarkMode 
          ? 'hover:bg-secondary text-muted-foreground hover:text-foreground' 
          : 'hover:bg-secondary text-muted-foreground hover:text-foreground'
      } ${className}`}
      title={title}
    >
      <Icon size={18} />
    </button>
  );

  return (
    <header className={`border-b transition-colors duration-300 sticky top-0 z-40 ${
      isDarkMode ? 'bg-card border-border' : 'bg-card border-border'
    }`}>
      <div className="w-full px-3 sm:px-4 lg:px-6 py-2.5">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3 min-w-0 flex-shrink-0">
            <div className="flex items-center space-x-3">
              {/* Logo */}
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg glow-primary">
                  <span className="text-white font-bold text-lg">H</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-card animate-pulse"></div>
              </div>
              
              {/* Title */}
              <div className="flex flex-col">
                <h1 className="text-base sm:text-lg lg:text-xl font-bold text-foreground tracking-tight">
                  <span className="hidden sm:inline">HTML Live Editor</span>
                  <span className="sm:hidden">HTML Editor</span>
                </h1>
                <div className="flex items-center space-x-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gradient-primary text-white font-medium flex items-center space-x-1">
                    <Sparkles size={10} />
                    <span>Pro</span>
                  </span>
                  <span className="hidden md:inline text-xs text-muted-foreground">
                    Real-time Preview & AI Powered
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-1 flex-shrink-0">
            {/* Essential actions */}
            <div className="flex items-center space-x-0.5">
              <ActionButton onClick={onCopyToClipboard} icon={Copy} title="Copy All Code (Ctrl+C)" />
              <ActionButton onClick={onExportHTML} icon={Download} title="Export Options" />
            </div>

            {/* Help and shortcuts */}
            <div className="hidden sm:flex items-center space-x-0.5">
              {onShowKeyboardShortcuts && (
                <ActionButton onClick={onShowKeyboardShortcuts} icon={Keyboard} title="Keyboard Shortcuts (Ctrl+/)" />
              )}
              <ActionButton onClick={onSelectAllCode} icon={MousePointer} title="Select All Code (Ctrl+A)" />
              <ActionButton 
                onClick={onClearCode} 
                icon={Trash2} 
                title="Clear All Code"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              />
            </div>

            {/* Project actions - hidden on smaller screens */}
            <div className="hidden md:flex items-center space-x-0.5 border-l border-border pl-2 ml-2">
              <ActionButton onClick={onSaveProject} icon={Save} title="Save Project (Ctrl+S)" />
              <ActionButton onClick={onLoadProject} icon={FolderOpen} title="Load Project" />
            </div>

            {/* Essential controls */}
            <div className="flex items-center space-x-0.5 border-l border-border pl-2 ml-2">
              <ActionButton 
                onClick={onToggleFullscreen} 
                icon={isFullscreen ? Minimize2 : Maximize2} 
                title={isFullscreen ? "Exit Full Preview" : "Full Preview Mode (F11)"}
              />
              
              <button
                onClick={onToggleTheme}
                className={`p-2.5 rounded-lg transition-all duration-300 min-w-[40px] min-h-[40px] flex items-center justify-center hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  isDarkMode 
                    ? 'bg-secondary text-yellow-400 hover:bg-secondary/80' 
                    : 'bg-secondary text-primary hover:bg-secondary/80'
                }`}
                title="Toggle Light/Dark Mode"
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
