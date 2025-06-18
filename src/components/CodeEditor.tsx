import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Editor from '@monaco-editor/react';
import { MousePointer, FileCode2, AlertTriangle, Smartphone, Tablet, Copy, Clipboard, Trash2, RotateCcw, Save, Download, Upload } from 'lucide-react';
import { validateXML, detectLanguage, ValidationResult } from '../utils/xmlValidator';
import { ClipboardUtils } from '../utils/clipboardUtils';

interface CodeEditorProps {
  htmlCode: string;
  isDarkMode: boolean;
  editorRef: React.MutableRefObject<any>;
  onCodeChange: (value: string) => void;
  onEditorDidMount: (editor: any, monaco: any) => void;
  onSelectAllCode: () => void;
  onShowTemplates: () => void;
  onValidationChange: (result: ValidationResult) => void;
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
}) => {
  const [language, setLanguage] = useState<'html' | 'xml'>('html');
  const [validationResult, setValidationResult] = useState<ValidationResult>({ isValid: true, errors: [] });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);
  const [canPaste, setCanPaste] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date>(new Date());
  const [showToast, setShowToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

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
    ClipboardUtils.hasClipboardPermission().then(setCanPaste);
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

    setLastSaved(new Date());
  }, [htmlCode, detectedLanguage, onValidationChange]);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const showMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setShowToast({ message, type });
  };

  const handleCopyCode = async () => {
    const success = await ClipboardUtils.copyToClipboard(htmlCode);
    if (success) {
      showMessage('কোড কপি হয়েছে!');
    } else {
      showMessage('কপি করতে সমস্যা হয়েছে', 'error');
    }
  };

  const handlePasteCode = async () => {
    try {
      const clipboardText = await ClipboardUtils.pasteFromClipboard();
      if (clipboardText) {
        onCodeChange(clipboardText);
        showMessage('কোড পেস্ট হয়েছে!');
      }
    } catch (err) {
      showMessage('পেস্ট করতে সমস্যা হয়েছে', 'error');
    }
  };

  const handleClearCode = () => {
    const confirmed = window.confirm('আপনি কি নিশ্চিত যে সব কোড ডিলিট করতে চান? এই কাজটি আর ফিরিয়ে আনা যাবে না।');
    if (confirmed) {
      console.log('Clearing code - before:', htmlCode.length);
      onCodeChange('');
      console.log('Code cleared successfully');
      
      // Focus editor after clearing
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.focus();
        }
      }, 100);
      
      showMessage('সব কোড ডিলিট হয়েছে!');
    }
  };

  const handleUndoCode = () => {
    if (editorRef.current) {
      editorRef.current.trigger('keyboard', 'undo', null);
      showMessage('আন্ডো করা হয়েছে!');
    }
  };

  const handleQuickSave = () => {
    localStorage.setItem('htmlEditorQuickSave', htmlCode);
    localStorage.setItem('htmlEditorLastSave', new Date().toISOString());
    setLastSaved(new Date());
    showMessage('কোড সেভ হয়েছে!');
  };

  const handleExportCode = () => {
    const blob = new Blob([htmlCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showMessage('ফাইল ডাউনলোড হয়েছে!');
  };

  const handleImportCode = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.html,.htm,.xml,.txt';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          onCodeChange(content);
          showMessage('ফাইল আপলোড হয়েছে!');
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const errorCount = validationResult.errors.filter(e => e.type === 'error').length;
  const warningCount = validationResult.errors.filter(e => e.type === 'warning').length;

  const getDeviceIcon = () => {
    if (isMobile) return <Smartphone size={16} className="text-green-500" />;
    if (isTablet) return <Tablet size={16} className="text-blue-500" />;
    return null;
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Toast Notification */}
      {showToast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg transition-all duration-300 ${
          showToast.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          {showToast.message}
        </div>
      )}

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
            <div className="text-xs opacity-60 hidden lg:flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>সেভ হয়েছে {lastSaved.toLocaleTimeString()}</span>
            </div>
          </div>

          {/* Status Row - Validation Results */}
          <div className="flex flex-wrap items-center gap-2">
            {language === 'xml' && (
              <>
                {errorCount > 0 && (
                  <span className="text-xs px-2 py-1 bg-red-500 bg-opacity-10 text-red-600 rounded-full border border-red-500 border-opacity-20 flex items-center space-x-1">
                    <AlertTriangle size={12} />
                    <span>{errorCount} ত্রুটি</span>
                  </span>
                )}
                {warningCount > 0 && (
                  <span className="text-xs px-2 py-1 bg-yellow-500 bg-opacity-10 text-yellow-600 rounded-full border border-yellow-500 border-opacity-20">
                    {warningCount} সতর্কতা
                  </span>
                )}
                {validationResult.isValid && (
                  <span className="text-xs px-2 py-1 bg-green-500 bg-opacity-10 text-green-600 rounded-full border border-green-500 border-opacity-20">
                    ✓ সঠিক Blogger XML
                  </span>
                )}
              </>
            )}
            <span className="text-xs px-2 py-1 bg-blue-500 bg-opacity-10 text-blue-600 rounded-full border border-blue-500 border-opacity-20">
              {htmlCode.length} অক্ষর
            </span>
          </div>

          {/* Enhanced Action Buttons Row */}
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
                <FileCode2 size={14} />
                <span className="hidden sm:inline">Blogger Templates</span>
                <span className="sm:hidden">Templates</span>
              </button>
            </div>
            
            {/* Quick Action Buttons */}
            <div className="flex items-center space-x-1">
              <button
                onClick={handleCopyCode}
                className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                  isDarkMode 
                    ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'
                }`}
                title="সব কোড কপি করুন"
              >
                <Copy size={16} />
              </button>
              
              {canPaste && (
                <button
                  onClick={handlePasteCode}
                  className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                    isDarkMode 
                      ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                      : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'
                  }`}
                  title="কোড পেস্ট করুন"
                >
                  <Clipboard size={16} />
                </button>
              )}
              
              <button
                onClick={handleUndoCode}
                className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                  isDarkMode 
                    ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'
                }`}
                title="আন্ডো করুন"
              >
                <RotateCcw size={16} />
              </button>
              
              <button
                onClick={handleQuickSave}
                className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                  isDarkMode 
                    ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'
                }`}
                title="দ্রুত সেভ"
              >
                <Save size={16} />
              </button>

              <button
                onClick={handleExportCode}
                className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                  isDarkMode 
                    ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'
                }`}
                title="ফাইল ডাউনলোড করুন"
              >
                <Download size={16} />
              </button>

              <button
                onClick={handleImportCode}
                className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                  isDarkMode 
                    ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'
                }`}
                title="ফাইল আপলোড করুন"
              >
                <Upload size={16} />
              </button>
              
              <button
                onClick={handleClearCode}
                className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 text-red-500 ${
                  isDarkMode 
                    ? 'hover:bg-red-900/20 hover:text-red-400' 
                    : 'hover:bg-red-50 hover:text-red-600'
                }`}
                title="সব কোড ডিলিট করুন"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          language={language}
          value={htmlCode}
          onChange={(value) => {
            console.log('Editor onChange triggered, new value length:', value?.length || 0);
            onCodeChange(value || '');
          }}
          onMount={onEditorDidMount}
          theme={isDarkMode ? 'custom-dark' : 'custom-light'}
          options={{
            minimap: { enabled: !isMobile },
            fontSize: isMobile ? 14 : 16,
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
            contextmenu: true,
            selectOnLineNumbers: true,
            roundedSelection: false,
            readOnly: false,
            cursorStyle: 'line',
            accessibilitySupport: 'auto',
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
