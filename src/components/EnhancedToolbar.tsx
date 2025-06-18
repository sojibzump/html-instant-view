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
  FileText,
  Brain,
  Settings,
  ChevronDown
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
      label: 'Code Formatter',
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
      color: 'text-blue-500'
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
      color: 'text-indigo-500'
    },
    {
      icon: Search,
      label: 'Search',
      description: 'Find & replace',
      onClick: onShowSearchReplace,
      color: 'text-yellow-500'
    }
  ];

  return (
    <div className={`px-2 sm:px-4 py-2 border-b transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gray-900 border-gray-700 text-gray-300' 
        : 'bg-white border-gray-200 text-gray-700'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1 overflow-x-auto scrollbar-hide">
          <div className="flex items-center space-x-1 mr-2 flex-shrink-0">
            <Zap size={16} className="text-yellow-500" />
            <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">Pro Tools</span>
          </div>
          
          {/* AI Tools - Priority on mobile */}
          <div className="flex items-center space-x-1">
            {aiTools.map((tool, index) => (
              <button
                key={index}
                onClick={tool.onClick}
                className={`relative flex items-center space-x-1 px-2 sm:px-3 py-1.5 rounded-lg transition-all duration-200 whitespace-nowrap text-xs sm:text-sm ${
                  isDarkMode 
                    ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                }`}
                title={tool.description}
              >
                <tool.icon size={14} className={tool.color} />
                <span className="hidden xs:inline">{tool.label}</span>
                {tool.isNew && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </button>
            ))}
          </div>

          {/* Separator */}
          <div className={`w-px h-6 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>

          {/* Other Tools */}
          <div className="hidden md:flex items-center space-x-1">
            {tools.map((tool, index) => (
              <button
                key={index}
                onClick={tool.onClick}
                className={`flex items-center space-x-1 px-2 sm:px-3 py-1.5 rounded-lg transition-all duration-200 whitespace-nowrap text-xs sm:text-sm ${
                  isDarkMode 
                    ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                }`}
                title={tool.description}
              >
                <tool.icon size={14} className={tool.color} />
                <span className="hidden lg:inline">{tool.label}</span>
              </button>
            ))}
          </div>

          {/* Mobile dropdown for other tools */}
          <div className="md:hidden">
            <details className="relative">
              <summary className={`flex items-center space-x-1 px-2 py-1.5 rounded-lg cursor-pointer transition-all duration-200 ${
                isDarkMode 
                  ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                  : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              }`}>
                <Layers size={14} className="text-gray-500" />
                <ChevronDown size={12} />
              </summary>
              <div className={`absolute top-full left-0 mt-1 w-48 rounded-lg border shadow-lg z-50 ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}>
                {tools.map((tool, index) => (
                  <button
                    key={index}
                    onClick={tool.onClick}
                    className={`w-full flex items-center space-x-2 px-3 py-2 text-left hover:${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                    } first:rounded-t-lg last:rounded-b-lg transition-colors`}
                  >
                    <tool.icon size={14} className={tool.color} />
                    <div>
                      <div className="text-sm font-medium">{tool.label}</div>
                      <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {tool.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedToolbar;
