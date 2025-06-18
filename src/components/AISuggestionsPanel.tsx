
import React, { useState } from 'react';
import { Brain, Wand2, X, MessageCircle, Code2, Bug, Sparkles, Copy, ArrowRight } from 'lucide-react';
import { aiService } from '../services/aiService';

interface AISuggestionsPanelProps {
  isDarkMode: boolean;
  isVisible: boolean;
  onClose: () => void;
  htmlCode: string;
  onCodeChange: (code: string) => void;
}

const AISuggestionsPanel: React.FC<AISuggestionsPanelProps> = ({
  isDarkMode,
  isVisible,
  onClose,
  htmlCode,
  onCodeChange,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [activeTask, setActiveTask] = useState<string>('');

  if (!isVisible) return null;

  const handleAITask = async (task: 'optimize' | 'explain' | 'debug' | 'enhance' | 'convert') => {
    if (!aiService.hasApiKey()) {
      alert('Please set your OpenRouter API key first in AI Settings');
      return;
    }

    setIsLoading(true);
    setActiveTask(task);
    setAiResponse('');

    try {
      const response = await aiService.enhanceCode({
        code: htmlCode,
        task,
        language: 'HTML'
      });
      setAiResponse(response);
    } catch (error) {
      console.error('AI Task Error:', error);
      setAiResponse(`Error: ${error instanceof Error ? error.message : 'AI request failed'}`);
    } finally {
      setIsLoading(false);
      setActiveTask('');
    }
  };

  const handleCustomPrompt = async () => {
    if (!customPrompt.trim()) return;
    if (!aiService.hasApiKey()) {
      alert('Please set your OpenRouter API key first in AI Settings');
      return;
    }

    setIsLoading(true);
    setActiveTask('custom');
    setAiResponse('');

    try {
      const fullPrompt = `${customPrompt}\n\nCurrent code:\n${htmlCode}`;
      const response = await aiService.generateCode(fullPrompt);
      setAiResponse(response);
    } catch (error) {
      console.error('Custom Prompt Error:', error);
      setAiResponse(`Error: ${error instanceof Error ? error.message : 'AI request failed'}`);
    } finally {
      setIsLoading(false);
      setActiveTask('');
    }
  };

  const applyAICode = () => {
    // Extract code from AI response (look for code blocks)
    const codeMatch = aiResponse.match(/```(?:html|css|javascript)?\n?([\s\S]*?)\n?```/);
    if (codeMatch) {
      onCodeChange(codeMatch[1].trim());
    } else {
      // If no code blocks found, use the whole response
      onCodeChange(aiResponse);
    }
  };

  const copyResponse = async () => {
    try {
      await navigator.clipboard.writeText(aiResponse);
      console.log('AI response copied to clipboard');
    } catch (err) {
      console.error('Failed to copy response:', err);
    }
  };

  const quickActions = [
    {
      id: 'optimize',
      icon: Wand2,
      label: 'Optimize Code',
      description: 'Improve performance & structure',
      color: 'text-blue-500'
    },
    {
      id: 'enhance',
      icon: Sparkles,
      label: 'Enhance Features',
      description: 'Add modern features & styling',
      color: 'text-purple-500'
    },
    {
      id: 'debug',
      icon: Bug,
      label: 'Debug Issues',
      description: 'Find and fix problems',
      color: 'text-red-500'
    },
    {
      id: 'explain',
      icon: MessageCircle,
      label: 'Explain Code',
      description: 'Get detailed explanation',
      color: 'text-green-500'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`relative max-w-4xl w-full h-[80vh] mx-4 rounded-lg flex ${
        isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      }`}>
        {/* Left Panel - Controls */}
        <div className={`w-1/3 border-r ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <Brain size={20} className="text-purple-500" />
              <h3 className="font-semibold">🤖 AI Assistant</h3>
            </div>
            <button
              onClick={onClose}
              className={`p-1 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <X size={16} />
            </button>
          </div>
          
          <div className="p-4 space-y-4">
            <div>
              <h4 className="font-medium mb-3">Quick Actions</h4>
              <div className="space-y-2">
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => handleAITask(action.id as any)}
                    disabled={isLoading}
                    className={`w-full p-3 rounded-lg border transition-all text-left ${
                      isDarkMode 
                        ? 'border-gray-600 hover:border-gray-500 hover:bg-gray-700' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center space-x-3">
                      {activeTask === action.id ? (
                        <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <action.icon size={18} className={action.color} />
                      )}
                      <div>
                        <div className="font-medium text-sm">{action.label}</div>
                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {action.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Custom Request</h4>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Describe what you want to do with your code..."
                className={`w-full px-3 py-2 border rounded-lg resize-none ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300'
                }`}
                rows={3}
              />
              <button
                onClick={handleCustomPrompt}
                disabled={isLoading || !customPrompt.trim()}
                className={`w-full mt-2 p-2 rounded-lg transition-all ${
                  customPrompt.trim() && !isLoading
                    ? 'bg-purple-500 hover:bg-purple-600 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  {activeTask === 'custom' ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <ArrowRight size={16} />
                  )}
                  <span className="text-sm font-medium">Send Request</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel - Response */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">AI Response</h4>
              {aiResponse && (
                <div className="flex space-x-2">
                  <button
                    onClick={copyResponse}
                    className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    title="Copy Response"
                  >
                    <Copy size={16} />
                  </button>
                  <button
                    onClick={applyAICode}
                    className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium"
                    title="Apply to Editor"
                  >
                    Apply Code
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex-1 p-4 overflow-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    AI is processing your request...
                  </p>
                </div>
              </div>
            ) : aiResponse ? (
              <div className={`p-4 rounded-lg ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                  {aiResponse}
                </pre>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Select an action or enter a custom request to get AI assistance
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISuggestionsPanel;
