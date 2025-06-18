
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
  Settings
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
  const tools = [
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
    },
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
    <div className={`px-4 py-2 border-b transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gray-900 border-gray-700 text-gray-300' 
        : 'bg-white border-gray-200 text-gray-700'
    }`}>
      <div className="flex items-center space-x-1 overflow-x-auto">
        <div className="flex items-center space-x-1 mr-2">
          <Zap size={16} className="text-yellow-500" />
          <span className="text-sm font-semibold whitespace-nowrap">Pro Tools:</span>
        </div>
        
        {tools.map((tool, index) => (
          <button
            key={index}
            onClick={tool.onClick}
            className={`relative flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-all duration-200 whitespace-nowrap text-sm ${
              isDarkMode 
                ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
            title={tool.description}
          >
            <tool.icon size={14} className={tool.color} />
            <span className="hidden sm:inline">{tool.label}</span>
            {tool.isNew && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EnhancedToolbar;
