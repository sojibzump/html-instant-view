import React from 'react';
import { 
  Wand2, 
  Clock, 
  Code2, 
  Palette, 
  Eye, 
  Share2, 
  Search,
  Layers,
  Zap,
  Brain,
  Settings,
  ChevronDown,
  Sparkles
} from 'lucide-react';

interface EnhancedToolbarProps {
  isDarkMode: boolean;
  onShowFormatter: () => void;
  onShowAutoSave: () => void;
  onShowSnippets: () => void;
  onShowThemeCustomizer: () => void;
  onShowPreviewSettings: () => void;
  onShowShareOptions: () => void;
  onShowSearchReplace: () => void;
  onShowAISettings: () => void;
  onShowAISuggestions: () => void;
}

const EnhancedToolbar: React.FC<EnhancedToolbarProps> = ({
  isDarkMode,
  onShowFormatter,
  onShowAutoSave,
  onShowSnippets,
  onShowThemeCustomizer,
  onShowPreviewSettings,
  onShowShareOptions,
  onShowSearchReplace,
  onShowAISettings,
  onShowAISuggestions,
}) => {
  const aiTools = [
    {
      icon: Brain,
      label: 'AI Assistant',
      description: 'AI-powered code enhancement',
      onClick: onShowAISuggestions,
      color: 'text-purple-500',
      isNew: true
    },
    {
      icon: Settings,
      label: 'AI Settings',
      description: 'Configure AI API key',
      onClick: onShowAISettings,
      color: 'text-indigo-500',
      isNew: true
    }
  ];

  const tools = [
    {
      icon: Wand2,
      label: 'Format',
      description: 'Format & beautify code',
      onClick: onShowFormatter,
      color: 'text-blue-500'
    },
    {
      icon: Clock,
      label: 'Auto Save',
      description: 'Auto save settings',
      onClick: onShowAutoSave,
      color: 'text-green-500'
    },
    {
      icon: Code2,
      label: 'Snippets',
      description: 'Code snippets library',
      onClick: onShowSnippets,
      color: 'text-cyan-500'
    },
    {
      icon: Palette,
      label: 'Themes',
      description: 'Customize themes',
      onClick: onShowThemeCustomizer,
      color: 'text-pink-500'
    },
    {
      icon: Eye,
      label: 'Preview',
      description: 'Preview settings',
      onClick: onShowPreviewSettings,
      color: 'text-orange-500'
    },
    {
      icon: Share2,
      label: 'Share',
      description: 'Share & collaborate',
      onClick: onShowShareOptions,
      color: 'text-violet-500'
    },
    {
      icon: Search,
      label: 'Find',
      description: 'Find & replace',
      onClick: onShowSearchReplace,
      color: 'text-amber-500'
    }
  ];

  const ToolButton = ({ 
    icon: Icon, 
    label, 
    description, 
    onClick, 
    color, 
    isNew = false 
  }: {
    icon: React.ElementType;
    label: string;
    description: string;
    onClick: () => void;
    color: string;
    isNew?: boolean;
  }) => (
    <button
      onClick={onClick}
      className={`relative flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg transition-all duration-200 whitespace-nowrap text-xs sm:text-sm group ${
        isDarkMode 
          ? 'hover:bg-secondary text-muted-foreground hover:text-foreground' 
          : 'hover:bg-secondary text-muted-foreground hover:text-foreground'
      }`}
      title={description}
    >
      <Icon size={14} className={`${color} transition-transform group-hover:scale-110`} />
      <span className="hidden sm:inline font-medium">{label}</span>
      {isNew && (
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
        </span>
      )}
    </button>
  );

  return (
    <div className={`px-3 py-2 border-b transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-card border-border' 
        : 'bg-card border-border'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1 overflow-x-auto scrollbar-hide">
          {/* Pro Tools Label */}
          <div className="flex items-center space-x-1.5 mr-3 flex-shrink-0 px-2 py-1 rounded-lg bg-gradient-primary">
            <Sparkles size={14} className="text-white" />
            <span className="text-xs font-bold text-white">Pro Tools</span>
          </div>
          
          {/* AI Tools - Priority */}
          <div className="flex items-center space-x-0.5">
            {aiTools.map((tool, index) => (
              <ToolButton key={index} {...tool} />
            ))}
          </div>

          {/* Separator */}
          <div className={`w-px h-6 mx-2 ${isDarkMode ? 'bg-border' : 'bg-border'}`}></div>

          {/* Other Tools - Desktop */}
          <div className="hidden md:flex items-center space-x-0.5">
            {tools.map((tool, index) => (
              <ToolButton key={index} {...tool} />
            ))}
          </div>

          {/* Mobile dropdown for other tools */}
          <div className="md:hidden relative group">
            <button 
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg transition-all duration-200 ${
                isDarkMode 
                  ? 'hover:bg-secondary text-muted-foreground hover:text-foreground' 
                  : 'hover:bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              <Layers size={14} />
              <span className="text-xs font-medium">More</span>
              <ChevronDown size={12} />
            </button>
            
            {/* Dropdown Menu */}
            <div className={`absolute top-full left-0 mt-1 w-52 rounded-xl border shadow-xl z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ${
              isDarkMode 
                ? 'bg-card border-border' 
                : 'bg-card border-border'
            }`}>
              <div className="p-1">
                {tools.map((tool, index) => (
                  <button
                    key={index}
                    onClick={tool.onClick}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 text-left rounded-lg transition-colors ${
                      isDarkMode ? 'hover:bg-secondary' : 'hover:bg-secondary'
                    }`}
                  >
                    <tool.icon size={16} className={tool.color} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground">{tool.label}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {tool.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedToolbar;
