
import React, { useState, useRef, useEffect } from 'react';
import { 
  Brain, 
  Wand2, 
  X, 
  MessageCircle, 
  Code2, 
  Bug, 
  Sparkles, 
  Copy, 
  ArrowRight, 
  RefreshCw,
  Lightbulb,
  Download,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
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
  const [responseHistory, setResponseHistory] = useState<Array<{id: string, prompt: string, response: string, timestamp: number}>>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [codeComparison, setCodeComparison] = useState(false);
  const [originalCode, setOriginalCode] = useState('');
  const [aiSuggestionMode, setAiSuggestionMode] = useState<'replace' | 'append' | 'merge'>('replace');
  const [extractedCode, setExtractedCode] = useState('');
  const responseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (responseRef.current) {
      responseRef.current.scrollTop = responseRef.current.scrollHeight;
    }
  }, [aiResponse]);

  if (!isVisible) return null;

  const handleAITask = async (task: 'optimize' | 'explain' | 'debug' | 'enhance' | 'convert') => {
    if (!aiService.hasApiKey()) {
      setAiResponse('⚠️ Please set your OpenRouter API key first in AI Settings');
      return;
    }

    if (!htmlCode.trim()) {
      setAiResponse('⚠️ Please enter some HTML code in the editor first');
      return;
    }

    setIsLoading(true);
    setActiveTask(task);
    setAiResponse('');
    setOriginalCode(htmlCode);
    setExtractedCode('');

    try {
      console.log('AI Task started:', task);
      const response = await aiService.enhanceCode({
        code: htmlCode,
        task,
        language: 'HTML'
      });
      
      console.log('AI Response received:', response.substring(0, 100) + '...');
      setAiResponse(response);
      
      // Extract code immediately
      const code = extractCodeFromResponse(response);
      setExtractedCode(code);
      console.log('Extracted code:', code.substring(0, 100) + '...');
      
      // Add to history
      const historyItem = {
        id: Date.now().toString(),
        prompt: `${task.charAt(0).toUpperCase() + task.slice(1)} Code`,
        response,
        timestamp: Date.now()
      };
      setResponseHistory(prev => [historyItem, ...prev.slice(0, 9)]);
      
    } catch (error) {
      console.error('AI Task Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'AI request failed';
      setAiResponse(`❌ Error: ${errorMessage}\n\nPlease check your API key and try again.`);
    } finally {
      setIsLoading(false);
      setActiveTask('');
    }
  };

  const handleCustomPrompt = async () => {
    if (!customPrompt.trim()) return;
    if (!aiService.hasApiKey()) {
      setAiResponse('⚠️ Please set your OpenRouter API key first in AI Settings');
      return;
    }

    setIsLoading(true);
    setActiveTask('custom');
    setAiResponse('');
    setExtractedCode('');

    try {
      const fullPrompt = htmlCode.trim() 
        ? `${customPrompt}\n\nCurrent code:\n${htmlCode}`
        : customPrompt;
      
      console.log('Custom prompt started');
      const response = await aiService.generateCode(fullPrompt);
      console.log('Custom prompt response received');
      setAiResponse(response);
      
      // Extract code immediately
      const code = extractCodeFromResponse(response);
      setExtractedCode(code);
      
      // Add to history
      const historyItem = {
        id: Date.now().toString(),
        prompt: customPrompt,
        response,
        timestamp: Date.now()
      };
      setResponseHistory(prev => [historyItem, ...prev.slice(0, 9)]);
      
      setCustomPrompt('');
    } catch (error) {
      console.error('Custom Prompt Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'AI request failed';
      setAiResponse(`❌ Error: ${errorMessage}\n\nPlease check your API key and try again.`);
    } finally {
      setIsLoading(false);
      setActiveTask('');
    }
  };

  const extractCodeFromResponse = (response: string): string => {
    console.log('Extracting code from response...');
    
    // First try to find code blocks with ```
    const codeBlockRegex = /```(?:html|xml|[a-z]*)\n?([\s\S]*?)```/gi;
    const matches = [...response.matchAll(codeBlockRegex)];
    
    if (matches.length > 0) {
      const cleanCode = matches[0][1].trim();
      console.log('Found code block, extracted:', cleanCode.substring(0, 100) + '...');
      return cleanCode;
    }
    
    // Try to find HTML structures
    const htmlRegex = /<!DOCTYPE[^>]*>[\s\S]*?<\/html>/i;
    const htmlMatch = response.match(htmlRegex);
    if (htmlMatch) {
      console.log('Found HTML structure');
      return htmlMatch[0];
    }
    
    // Try to find any HTML tags
    const tagRegex = /<[^>]+>[\s\S]*?<\/[^>]+>/;
    const tagMatch = response.match(tagRegex);
    if (tagMatch) {
      console.log('Found HTML tags');
      return tagMatch[0];
    }
    
    // If no specific code found, look for lines that look like code
    const lines = response.split('\n');
    const codeLines = lines.filter(line => 
      line.trim().startsWith('<') || 
      line.trim().includes('class=') || 
      line.trim().includes('style=') ||
      line.trim().includes('<!DOCTYPE')
    );
    
    if (codeLines.length > 0) {
      const extracted = codeLines.join('\n').trim();
      console.log('Found code-like lines');
      return extracted;
    }
    
    // Last resort - return the whole response if it looks like code
    if (response.includes('<') && response.includes('>')) {
      console.log('Using whole response as code');
      return response.trim();
    }
    
    console.log('No code found, returning empty');
    return '';
  };

  const applyAICode = () => {
    const codeToApply = extractedCode || extractCodeFromResponse(aiResponse);
    
    if (!codeToApply) {
      console.log('No code to apply');
      return;
    }
    
    console.log('Applying AI code...');
    
    if (aiSuggestionMode === 'append') {
      onCodeChange(htmlCode + '\n\n' + codeToApply);
    } else if (aiSuggestionMode === 'merge') {
      onCodeChange(codeToApply);
    } else {
      onCodeChange(codeToApply);
    }
    
    console.log('AI code applied successfully');
  };

  const copyResponse = async () => {
    try {
      const textToCopy = extractedCode || aiResponse;
      await navigator.clipboard.writeText(textToCopy);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy response:', err);
    }
  };

  const downloadResponse = () => {
    const content = extractedCode || aiResponse;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-response-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const quickActions = [
    {
      id: 'optimize',
      icon: Wand2,
      label: 'Optimize',
      description: 'Improve performance & structure',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500'
    },
    {
      id: 'enhance',
      icon: Sparkles,
      label: 'Enhance',
      description: 'Add modern features',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500'
    },
    {
      id: 'debug',
      icon: Bug,
      label: 'Debug',
      description: 'Find & fix issues',
      color: 'text-red-500',
      bgColor: 'bg-red-500'
    },
    {
      id: 'explain',
      icon: MessageCircle,
      label: 'Explain',
      description: 'Get detailed explanation',
      color: 'text-green-500',
      bgColor: 'bg-green-500'
    },
    {
      id: 'convert',
      icon: Code2,
      label: 'Convert',
      description: 'Modernize code',
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-500'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2 sm:p-4">
      <div className={`relative w-full max-w-6xl h-[90vh] sm:h-[85vh] rounded-lg flex flex-col sm:flex-row ${
        isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      }`}>
        {/* Header - Mobile */}
        <div className={`sm:hidden flex items-center justify-between p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center space-x-2">
            <Brain size={20} className="text-purple-500" />
            <h3 className="font-semibold">AI Assistant Pro</h3>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            <X size={16} />
          </button>
        </div>

        {/* Left Panel - Controls */}
        <div className={`w-full sm:w-1/3 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} sm:border-r flex flex-col`}>
          {/* Desktop Header */}
          <div className={`hidden sm:flex items-center justify-between p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center space-x-2">
              <Brain size={20} className="text-purple-500" />
              <h3 className="font-semibold">AI Assistant Pro</h3>
            </div>
            <button
              onClick={onClose}
              className={`p-1 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <X size={16} />
            </button>
          </div>
          
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            {/* Status */}
            {!aiService.hasApiKey() && (
              <div className={`p-3 rounded-lg border ${
                isDarkMode 
                  ? 'border-yellow-800 bg-yellow-900/20 text-yellow-200' 
                  : 'border-yellow-200 bg-yellow-50 text-yellow-800'
              }`}>
                <div className="flex items-center space-x-2">
                  <AlertCircle size={16} />
                  <span className="text-sm">
                    Please configure your API key in AI Settings first
                  </span>
                </div>
              </div>
            )}

            {/* AI Mode Selector */}
            <div>
              <h4 className="font-medium mb-2">Apply Mode</h4>
              <div className="grid grid-cols-3 gap-1">
                {['replace', 'append', 'merge'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setAiSuggestionMode(mode as any)}
                    className={`p-2 text-xs rounded-lg border transition-all ${
                      aiSuggestionMode === mode
                        ? 'bg-purple-500 text-white border-purple-500'
                        : isDarkMode 
                          ? 'border-gray-600 hover:border-gray-500' 
                          : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3 flex items-center space-x-2">
                <Lightbulb size={16} className="text-yellow-500" />
                <span>AI Actions</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-1 gap-2">
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => handleAITask(action.id as any)}
                    disabled={isLoading || !aiService.hasApiKey()}
                    className={`p-3 rounded-lg border transition-all text-left ${
                      isDarkMode 
                        ? 'border-gray-600 hover:border-gray-500 hover:bg-gray-700' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    } ${(isLoading || !aiService.hasApiKey()) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center space-x-3">
                      {activeTask === action.id ? (
                        <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <action.icon size={18} className={action.color} />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{action.label}</div>
                        <div className={`text-xs truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
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
                placeholder="Describe what you want to do..."
                className={`w-full px-3 py-2 border rounded-lg resize-none ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 placeholder-gray-500'
                }`}
                rows={3}
              />
              <button
                onClick={handleCustomPrompt}
                disabled={isLoading || !customPrompt.trim() || !aiService.hasApiKey()}
                className={`w-full mt-2 p-2 rounded-lg transition-all ${
                  customPrompt.trim() && !isLoading && aiService.hasApiKey()
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

            {/* Code Comparison Toggle */}
            {originalCode && aiResponse && (
              <div>
                <button
                  onClick={() => setCodeComparison(!codeComparison)}
                  className={`w-full p-2 rounded-lg border text-sm font-medium transition-all ${
                    codeComparison
                      ? 'bg-blue-500 text-white border-blue-500'
                      : isDarkMode 
                        ? 'border-gray-600 hover:border-gray-500' 
                        : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {codeComparison ? 'Hide' : 'Show'} Code Comparison
                </button>
              </div>
            )}

            {/* Response History */}
            {responseHistory.length > 0 && (
              <div>
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="w-full flex items-center justify-between p-2 text-sm font-medium"
                >
                  <span>Recent Responses ({responseHistory.length})</span>
                  <RefreshCw size={14} className={showHistory ? 'rotate-180' : ''} />
                </button>
                {showHistory && (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {responseHistory.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setAiResponse(item.response);
                          setExtractedCode(extractCodeFromResponse(item.response));
                        }}
                        className={`w-full p-2 text-left text-sm rounded border ${
                          isDarkMode 
                            ? 'border-gray-600 hover:bg-gray-700' 
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="font-medium truncate">{item.prompt}</div>
                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {new Date(item.timestamp).toLocaleTimeString()}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Response */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <h4 className="font-medium">AI Response</h4>
              {(aiResponse || extractedCode) && (
                <div className="flex space-x-2">
                  <button
                    onClick={copyResponse}
                    className={`p-2 rounded-lg transition-colors ${
                      isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                    title="Copy Code"
                  >
                    {copySuccess ? <CheckCircle size={16} className="text-green-500" /> : <Copy size={16} />}
                  </button>
                  <button
                    onClick={downloadResponse}
                    className={`p-2 rounded-lg transition-colors ${
                      isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                    title="Download Code"
                  >
                    <Download size={16} />
                  </button>
                  {extractedCode && (
                    <button
                      onClick={applyAICode}
                      className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium"
                      title="Apply to Editor"
                    >
                      Apply Code
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex-1 overflow-hidden">
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
              <div ref={responseRef} className="h-full overflow-y-auto p-4">
                {/* Show extracted code if available */}
                {extractedCode ? (
                  <div className="space-y-4">
                    <div className={`p-4 rounded-lg border-l-4 border-green-500 ${
                      isDarkMode ? 'bg-gray-700' : 'bg-green-50'
                    }`}>
                      <h5 className="font-medium text-green-600 mb-2">✅ Extracted Code:</h5>
                      <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono overflow-x-auto bg-gray-900 text-green-400 p-3 rounded">
                        {extractedCode}
                      </pre>
                    </div>
                    
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <h5 className="font-medium mb-2">Full Response:</h5>
                      <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono overflow-x-auto">
                        {aiResponse}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono overflow-x-auto">
                      {aiResponse}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center max-w-md px-4">
                  <Brain size={48} className="mx-auto mb-4 text-purple-500 opacity-50" />
                  <p className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Select an action or enter a custom request to get AI assistance with your HTML code
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISuggestionsPanel;
