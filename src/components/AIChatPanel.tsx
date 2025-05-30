
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Code, Trash2, X, MessageSquare, Smartphone, Tablet, Zap, FileCode, Globe, Palette } from 'lucide-react';
import { useDeepSeekChat } from '../hooks/useDeepSeekChat';
import { Textarea } from './ui/textarea';

interface AIChatPanelProps {
  isVisible: boolean;
  isDarkMode: boolean;
  currentCode: string;
  onClose: () => void;
  onCodeGenerated: (code: string) => void;
}

const AIChatPanel: React.FC<AIChatPanelProps> = ({
  isVisible,
  isDarkMode,
  currentCode,
  onClose,
  onCodeGenerated,
}) => {
  const [input, setInput] = useState('');
  const [codePrompt, setCodePrompt] = useState('');
  const [showCodeGenerator, setShowCodeGenerator] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'html' | 'css' | 'javascript' | 'xml'>('html');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { messages, isLoading, sendMessage, generateCode, clearChat } = useDeepSeekChat();

  // Quick generation templates
  const quickTemplates = [
    { id: 'landing', name: 'Landing Page', icon: Globe, description: 'Modern responsive landing page' },
    { id: 'dashboard', name: 'Dashboard', icon: FileCode, description: 'Admin dashboard with charts' },
    { id: 'portfolio', name: 'Portfolio', icon: User, description: 'Personal portfolio website' },
    { id: 'ecommerce', name: 'E-commerce', icon: Palette, description: 'Product showcase page' },
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isVisible && inputRef.current) {
      const isMobile = window.innerWidth < 768;
      if (!isMobile) {
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    }
  }, [isVisible]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    await sendMessage(input.trim(), currentCode);
    setInput('');
    
    if (window.innerWidth >= 768) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleGenerateCode = async () => {
    if (!codePrompt.trim() || isLoading) return;
    
    const generatedCode = await generateCode(codePrompt.trim(), selectedLanguage);
    if (generatedCode) {
      onCodeGenerated(generatedCode);
      setCodePrompt('');
      setShowCodeGenerator(false);
    }
  };

  const handleQuickGenerate = async (template: string) => {
    const prompts = {
      landing: 'Create a modern responsive landing page with hero section, features, and call-to-action',
      dashboard: 'Create a dashboard layout with sidebar navigation, charts, and data cards',
      portfolio: 'Create a personal portfolio website with about section, projects grid, and contact form',
      ecommerce: 'Create an e-commerce product page with gallery, description, and purchase options'
    };
    
    const prompt = prompts[template as keyof typeof prompts];
    if (prompt) {
      const generatedCode = await generateCode(prompt, 'html');
      if (generatedCode) {
        onCodeGenerated(generatedCode);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCodeKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleGenerateCode();
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`border-t transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} 
                    fixed md:relative bottom-0 left-0 right-0 z-50 md:z-auto
                    h-[85vh] md:h-auto max-h-[500px] md:max-h-none
                    flex flex-col`}>
      
      {/* Header */}
      <div className={`px-3 md:px-4 py-2 border-b flex items-center justify-between flex-shrink-0
                      ${isDarkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
        <div className="flex items-center space-x-2 md:space-x-3 min-w-0">
          <Bot className={`w-4 h-4 flex-shrink-0 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          <span className={`text-sm font-medium truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <span className="hidden sm:inline">AI Code Generator</span>
            <span className="sm:hidden">AI Gen</span>
          </span>
          <div className="flex items-center space-x-1 md:space-x-2">
            <button
              onClick={() => setShowCodeGenerator(!showCodeGenerator)}
              className={`text-xs px-2 py-1 rounded transition-colors flex items-center space-x-1
                         ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
            >
              <Zap size={10} />
              <span className="hidden sm:inline">Quick Gen</span>
            </button>
            <button
              onClick={clearChat}
              className={`text-xs px-2 py-1 rounded transition-colors ${isDarkMode ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-200 text-gray-600'}`}
              title="Clear chat"
            >
              <Trash2 size={10} />
            </button>
          </div>
        </div>
        <button
          onClick={onClose}
          className={`p-1 rounded hover:bg-opacity-20 flex-shrink-0 ${isDarkMode ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-200 text-gray-600'}`}
        >
          <X size={16} />
        </button>
      </div>

      {/* Quick Templates Section */}
      {showCodeGenerator && (
        <div className={`p-3 md:p-4 border-b flex-shrink-0 ${isDarkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Quick Generate
              </h3>
              <div className="flex items-center space-x-1">
                <Smartphone className="w-3 h-3 md:hidden text-green-500" />
                <Tablet className="w-3 h-3 hidden md:block lg:hidden text-blue-500" />
              </div>
            </div>
            
            {/* Template Grid */}
            <div className="grid grid-cols-2 gap-2">
              {quickTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleQuickGenerate(template.id)}
                  disabled={isLoading}
                  className={`p-3 rounded-lg border text-left transition-all hover:scale-105 disabled:opacity-50
                             ${isDarkMode 
                               ? 'bg-gray-700 border-gray-600 hover:bg-gray-600 text-white' 
                               : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-900'}`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <template.icon size={14} className="text-blue-500" />
                    <span className="text-xs font-medium">{template.name}</span>
                  </div>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {template.description}
                  </p>
                </button>
              ))}
            </div>

            {/* Custom Generation */}
            <div className="pt-3 border-t border-gray-300 dark:border-gray-600">
              <div className="flex items-center space-x-2 mb-2">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value as any)}
                  className={`text-xs px-2 py-1 rounded border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                >
                  <option value="html">HTML</option>
                  <option value="css">CSS</option>
                  <option value="javascript">JS</option>
                  <option value="xml">XML</option>
                </select>
                <span className={`text-xs hidden sm:inline ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Custom Generator
                </span>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <Textarea
                  value={codePrompt}
                  onChange={(e) => setCodePrompt(e.target.value)}
                  onKeyPress={handleCodeKeyPress}
                  placeholder="Describe what you want to build..."
                  className={`flex-1 text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 placeholder-gray-500'}`}
                  rows={2}
                />
                <button
                  onClick={handleGenerateCode}
                  disabled={!codePrompt.trim() || isLoading}
                  className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed
                            flex-shrink-0 flex items-center justify-center space-x-1"
                >
                  <Code size={14} />
                  <span>Generate</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-3 md:p-4 min-h-0">
        {messages.length === 0 ? (
          <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Start building with AI assistance!</p>
            <p className="text-xs mt-1">Generate code instantly or chat for custom help.</p>
            <div className="mt-4 space-y-1">
              <p className="text-xs opacity-75">💡 Try quick templates or ask:</p>
              <p className="text-xs opacity-60">"Create a responsive navigation bar"</p>
              <p className="text-xs opacity-60">"Add animations to my page"</p>
              <p className="text-xs opacity-60">"Fix accessibility issues"</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="flex items-start space-x-2 md:space-x-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${message.role === 'user' ? 'bg-blue-500' : 'bg-green-500'}`}>
                  {message.role === 'user' ? <User size={12} className="text-white" /> : <Bot size={12} className="text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {message.role === 'user' ? 'You' : 'AI Assistant'} • {message.timestamp.toLocaleTimeString()}
                  </div>
                  <div className={`text-sm p-3 rounded-lg break-words ${message.role === 'user' 
                    ? (isDarkMode ? 'bg-blue-900 text-blue-100' : 'bg-blue-100 text-blue-900')
                    : (isDarkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-100 text-gray-900')
                  }`}>
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{message.content}</pre>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start space-x-2 md:space-x-3">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                  <Bot size={12} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    AI Assistant • Generating...
                  </div>
                  <div className={`text-sm p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin w-3 h-3 border-2 border-green-500 border-t-transparent rounded-full"></div>
                      <span>Creating your code...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className={`p-3 md:p-4 border-t flex-shrink-0 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <Textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask AI to build, modify, or explain code..."
            className={`flex-1 text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 placeholder-gray-500'}`}
            rows={2}
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed
                      flex items-center justify-center space-x-1 flex-shrink-0"
          >
            <Send size={14} />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
        <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          <span className="hidden sm:inline">Press Enter to send • </span>
          AI-powered code generation like bolt.new
        </p>
      </div>
    </div>
  );
};

export default AIChatPanel;
