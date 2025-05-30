
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Bot, User, Code, Trash2, X, MessageSquare, Maximize2, Minimize2, Move, Zap, FileCode, Globe, Palette } from 'lucide-react';
import { useDeepSeekChat } from '../hooks/useDeepSeekChat';
import { Textarea } from './ui/textarea';

interface DraggableChatPanelProps {
  isVisible: boolean;
  isDarkMode: boolean;
  currentCode: string;
  onClose: () => void;
  onCodeGenerated: (code: string) => void;
}

const DraggableChatPanel: React.FC<DraggableChatPanelProps> = ({
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 420, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const panelRef = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLDivElement>(null);
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
    if (isVisible && inputRef.current && !window.matchMedia('(max-width: 768px)').matches) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isVisible]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!dragHandleRef.current?.contains(e.target as Node)) return;
    
    setIsDragging(true);
    const rect = panelRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    const newX = Math.max(0, Math.min(window.innerWidth - 420, e.clientX - dragOffset.x));
    const newY = Math.max(0, Math.min(window.innerHeight - 200, e.clientY - dragOffset.y));
    
    setPosition({ x: newX, y: newY });
  }, [isDragging, dragOffset]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

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

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!isVisible) return null;

  const panelStyle = isFullscreen 
    ? { position: 'fixed' as const, top: 0, left: 0, right: 0, bottom: 0, zIndex: 60 }
    : { 
        position: 'fixed' as const, 
        top: position.y, 
        left: position.x, 
        width: '420px', 
        height: '600px',
        zIndex: 50,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        borderRadius: '12px',
        overflow: 'hidden'
      };

  return (
    <div
      ref={panelRef}
      style={panelStyle}
      className={`flex flex-col transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gray-900 border-gray-700 text-white' 
          : 'bg-white border-gray-200 text-gray-900'
      } ${isFullscreen ? '' : 'border-2'}`}
      onMouseDown={handleMouseDown}
    >
      {/* Header with drag handle */}
      <div
        ref={dragHandleRef}
        className={`px-4 py-3 border-b flex items-center justify-between cursor-move select-none ${
          isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Bot className="w-5 h-5 text-blue-500" />
            <span className="font-semibold">AI Code Generator</span>
          </div>
          <Move className="w-4 h-4 opacity-50" />
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowCodeGenerator(!showCodeGenerator)}
            className="p-1.5 rounded hover:bg-opacity-20 hover:bg-gray-500 transition-colors"
            title="Quick Generate"
          >
            <Zap size={16} />
          </button>
          <button
            onClick={clearChat}
            className="p-1.5 rounded hover:bg-opacity-20 hover:bg-gray-500 transition-colors"
            title="Clear Chat"
          >
            <Trash2 size={16} />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded hover:bg-opacity-20 hover:bg-gray-500 transition-colors"
            title={isFullscreen ? "Minimize" : "Maximize"}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-opacity-20 hover:bg-gray-500 transition-colors"
            title="Close"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Quick Generator */}
      {showCodeGenerator && (
        <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Quick Generate</h3>
            
            {/* Template Grid */}
            <div className="grid grid-cols-2 gap-2">
              {quickTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleQuickGenerate(template.id)}
                  disabled={isLoading}
                  className={`p-2 rounded-lg border text-left transition-all hover:scale-105 disabled:opacity-50
                             ${isDarkMode 
                               ? 'bg-gray-700 border-gray-600 hover:bg-gray-600 text-white' 
                               : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-900'}`}
                >
                  <div className="flex items-center space-x-1 mb-1">
                    <template.icon size={12} className="text-blue-500" />
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
                  className={`px-3 py-1.5 rounded border text-sm ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="html">HTML</option>
                  <option value="css">CSS</option>
                  <option value="javascript">JavaScript</option>
                  <option value="xml">XML</option>
                </select>
                <span className="text-sm font-medium">Custom</span>
              </div>
              <div className="flex space-x-2">
                <Textarea
                  value={codePrompt}
                  onChange={(e) => setCodePrompt(e.target.value)}
                  placeholder="Describe what you want to build..."
                  className={`flex-1 text-sm ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 placeholder-gray-500'
                  }`}
                  rows={2}
                />
                <button
                  onClick={handleGenerateCode}
                  disabled={!codePrompt.trim() || isLoading}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 transition-colors"
                >
                  Generate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 min-h-0">
        {messages.length === 0 ? (
          <div className="text-center py-8 opacity-60">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <h3 className="font-medium mb-2">AI Code Generator</h3>
            <p className="text-sm mb-4">Build anything with AI assistance!</p>
            <div className="space-y-2 text-xs">
              <p>🚀 "Create a landing page"</p>
              <p>📊 "Build a dashboard"</p>
              <p>🎨 "Design a portfolio"</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user' ? 'bg-blue-500' : 'bg-green-500'
                }`}>
                  {message.role === 'user' ? <User size={14} className="text-white" /> : <Bot size={14} className="text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs opacity-60 mb-1">
                    {message.role === 'user' ? 'You' : 'AI Generator'} • {message.timestamp.toLocaleTimeString()}
                  </div>
                  <div className={`text-sm p-3 rounded-lg ${
                    message.role === 'user' 
                      ? (isDarkMode ? 'bg-blue-900 text-blue-100' : 'bg-blue-100 text-blue-900')
                      : (isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-gray-100 text-gray-900')
                  }`}>
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{message.content}</pre>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                  <Bot size={14} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-xs opacity-60 mb-1">AI Generator • Creating...</div>
                  <div className={`text-sm p-3 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full"></div>
                      <span>Generating your code...</span>
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
      <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex space-x-2">
          <Textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask AI to build or modify your code..."
            className={`flex-1 text-sm ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 placeholder-gray-500'
            }`}
            rows={2}
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 transition-colors flex items-center space-x-1"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-xs opacity-60 mt-2">Press Enter to send • AI-powered like bolt.new</p>
      </div>
    </div>
  );
};

export default DraggableChatPanel;
