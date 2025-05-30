
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Editor from '@monaco-editor/react';
import { MousePointer, FileCode2, AlertTriangle, Smartphone, Tablet } from 'lucide-react';
import { validateXML, detectLanguage, ValidationResult } from '../utils/xmlValidator';

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
  }, [htmlCode, detectedLanguage, onValidationChange]);

  const errorCount = validationResult.errors.filter(e => e.type === 'error').length;
  const warningCount = validationResult.errors.filter(e => e.type === 'warning').length;

  const getDeviceIcon = () => {
    if (isMobile) return <Smartphone size={16} className="text-green-500" />;
    if (isTablet) return <Tablet size={16} className="text-blue-500" />;
    return null;
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className={`px-2 sm:px-4 py-2 sm:py-3 border-b transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gray-900 border-gray-700 text-gray-300' 
          : 'bg-white border-gray-200 text-gray-700'
      }`}>
        <div className="flex flex-col space-y-2">
          {/* Top Row - Title and Device Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <span className="text-xs sm:text-sm font-semibold">
                  {language === 'xml' ? '🔧 Blogger XML' : '💻 HTML Editor'}
                </span>
                {getDeviceIcon()}
              </div>
            </div>
          </div>

          {/* Status Row - Validation Results Only */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Validation Results */}
            {language === 'xml' && (
              <>
                {errorCount > 0 && (
                  <span className="text-xs px-2 py-1 bg-red-500 bg-opacity-10 text-red-600 rounded-full border border-red-500 border-opacity-20 flex items-center space-x-1">
                    <AlertTriangle size={12} />
                    <span>{errorCount} error{errorCount !== 1 ? 's' : ''}</span>
                  </span>
                )}
                {warningCount > 0 && (
                  <span className="text-xs px-2 py-1 bg-yellow-500 bg-opacity-10 text-yellow-600 rounded-full border border-yellow-500 border-opacity-20">
                    {warningCount} warning{warningCount !== 1 ? 's' : ''}
                  </span>
                )}
                {validationResult.isValid && (
                  <span className="text-xs px-2 py-1 bg-green-500 bg-opacity-10 text-green-600 rounded-full border border-green-500 border-opacity-20">
                    ✓ Valid XML
                  </span>
                )}
              </>
            )}
          </div>

          {/* Action Buttons Row - Responsive layout */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <button
                onClick={onShowTemplates}
                className={`text-xs px-2 sm:px-3 py-1.5 rounded-full transition-all duration-200 flex items-center space-x-1 border ${
                  isDarkMode 
                    ? 'hover:bg-gray-700 text-gray-400 border-gray-600 hover:border-gray-500' 
                    : 'hover:bg-gray-100 text-gray-600 border-gray-300 hover:border-gray-400'
                }`}
              >
                <FileCode2 size={16} />
                <span className="hidden sm:inline">Templates</span>
              </button>
              <button
                onClick={onSelectAllCode}
                className={`text-xs px-2 sm:px-3 py-1.5 rounded-full transition-all duration-200 border ${
                  isDarkMode 
                    ? 'hover:bg-gray-700 text-gray-400 border-gray-600 hover:border-gray-500' 
                    : 'hover:bg-gray-100 text-gray-600 border-gray-300 hover:border-gray-400'
                }`}
              >
                <MousePointer size={16} className="sm:hidden" />
                <span className="hidden sm:inline">Select All</span>
              </button>
            </div>
            
            {/* Auto-save indicator */}
            <div className="text-xs opacity-60 hidden lg:flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Auto-save</span>
            </div>
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
            folding: !isMobile,
            glyphMargin: !isMobile,
            lineDecorationsWidth: isMobile ? 5 : 10,
            lineNumbersMinChars: isMobile ? 2 : 3,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            smoothScrolling: true,
            mouseWheelScrollSensitivity: 0.5,
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
