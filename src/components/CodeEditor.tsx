
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Editor from '@monaco-editor/react';
import { MousePointer, FileCode2, AlertTriangle, Brain, MessageSquare, Smartphone, Tablet } from 'lucide-react';
import { validateXML, detectLanguage, ValidationResult } from '../utils/xmlValidator';
import { useAICodeAnalysis } from '../hooks/useAICodeAnalysis';

interface CodeEditorProps {
  htmlCode: string;
  isDarkMode: boolean;
  editorRef: React.MutableRefObject<any>;
  onCodeChange: (value: string) => void;
  onEditorDidMount: (editor: any, monaco: any) => void;
  onSelectAllCode: () => void;
  onShowTemplates: () => void;
  onValidationChange: (result: ValidationResult) => void;
  onShowAISuggestions: () => void;
  onShowDeepSeekChat: () => void;
  onApplyCorrection: (correction: any) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  htmlCode,
  isDarkMode,
  editorRef,
  onCodeChange,
  onEditorDidMount,
  onSelectAllCode,
  onShowTemplates,
  onValidationChange,
  onShowAISuggestions,
  onShowDeepSeekChat,
  onApplyCorrection,
}) => {
  const [language, setLanguage] = useState<'html' | 'xml'>('html');
  const [validationResult, setValidationResult] = useState<ValidationResult>({ isValid: true, errors: [] });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);
  
  const { isAnalyzing, analysis, analyzeCode } = useAICodeAnalysis();

  const detectedLanguage = useMemo(() => detectLanguage(htmlCode), [htmlCode]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setLanguage(detectedLanguage);
    
    if (detectedLanguage === 'xml') {
      const result = validateXML(htmlCode);
      setValidationResult(result);
      onValidationChange(result);
    } else {
      const result = { isValid: true, errors: [] };
      setValidationResult(result);
      onValidationChange(result);
    }

    // Trigger AI analysis
    analyzeCode(htmlCode, detectedLanguage);
  }, [htmlCode, detectedLanguage, onValidationChange, analyzeCode]);

  const errorCount = validationResult.errors.filter(e => e.type === 'error').length;
  const warningCount = validationResult.errors.filter(e => e.type === 'warning').length;
  const aiIssuesCount = analysis?.errors.length || 0;
  const aiSuggestionsCount = analysis?.suggestions.length || 0;

  const getDeviceIcon = () => {
    if (isMobile) return <Smartphone size={12} className="text-green-500" />;
    if (isTablet) return <Tablet size={12} className="text-blue-500" />;
    return null;
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className={`px-2 sm:px-4 py-2 border-b transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-700'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium truncate">
                {language === 'xml' ? 'Blogger XML Editor' : 'HTML Editor'}
              </span>
              {getDeviceIcon()}
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto">
              {/* XML Validation Results */}
              {language === 'xml' && (
                <>
                  {errorCount > 0 && (
                    <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded flex items-center space-x-1 flex-shrink-0">
                      <AlertTriangle size={10} />
                      <span>{errorCount} error{errorCount !== 1 ? 's' : ''}</span>
                    </span>
                  )}
                  {warningCount > 0 && (
                    <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded flex-shrink-0">
                      {warningCount} warning{warningCount !== 1 ? 's' : ''}
                    </span>
                  )}
                  {validationResult.isValid && (
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded flex-shrink-0">
                      Valid XML
                    </span>
                  )}
                </>
              )}
              
              {/* AI Analysis Results */}
              {(aiIssuesCount > 0 || aiSuggestionsCount > 0) && (
                <button
                  onClick={onShowAISuggestions}
                  className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded flex items-center space-x-1 hover:bg-blue-200 transition-colors flex-shrink-0"
                >
                  <Brain size={10} />
                  <span>{aiIssuesCount + aiSuggestionsCount} insights</span>
                </button>
              )}
              
              {isAnalyzing && (
                <div className="flex items-center space-x-1 flex-shrink-0">
                  <div className="animate-spin w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                  <span className="text-xs text-blue-500 hidden sm:inline">AI analyzing...</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            <button
              onClick={onShowDeepSeekChat}
              className={`text-xs px-2 py-1 rounded transition-colors duration-200 flex items-center space-x-1 ${isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-600'}`}
              title="DeepSeek AI Chat"
            >
              <MessageSquare size={10} />
              <span className="hidden md:inline">AI Chat</span>
            </button>
            <button
              onClick={onShowAISuggestions}
              className={`text-xs px-2 py-1 rounded transition-colors duration-200 flex items-center space-x-1 ${isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-600'}`}
              title="AI Assistant"
            >
              <Brain size={10} />
              <span className="hidden lg:inline">AI Assistant</span>
            </button>
            <button
              onClick={onShowTemplates}
              className={`text-xs px-2 py-1 rounded transition-colors duration-200 flex items-center space-x-1 ${isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-600'}`}
              title="Blogger Templates"
            >
              <FileCode2 size={10} />
              <span className="hidden lg:inline">Templates</span>
            </button>
            <button
              onClick={onSelectAllCode}
              className={`text-xs px-2 py-1 rounded transition-colors duration-200 ${isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-600'}`}
              title="Select All"
            >
              <span className="hidden sm:inline">Select All</span>
              <span className="sm:hidden">All</span>
            </button>
            <span className="text-xs opacity-75 hidden lg:inline">Auto-save</span>
          </div>
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          language={language}
          value={htmlCode}
          onChange={(value) => onCodeChange(value || '')}
          onMount={onEditorDidMount}
          theme={isDarkMode ? 'custom-dark' : 'custom-light'}
          options={{
            minimap: { enabled: !isMobile },
            fontSize: isMobile ? 12 : 14,
            lineNumbers: 'on',
            wordWrap: 'on',
            automaticLayout: true,
            scrollBeyondLastLine: false,
            tabSize: 2,
            insertSpaces: true,
            renderWhitespace: 'boundary',
            fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace',
            lineHeight: 1.6,
            letterSpacing: 0.5,
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
            // Mobile-specific optimizations
            folding: !isMobile,
            glyphMargin: !isMobile,
            lineDecorationsWidth: isMobile ? 5 : 10,
            lineNumbersMinChars: isMobile ? 2 : 3,
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
