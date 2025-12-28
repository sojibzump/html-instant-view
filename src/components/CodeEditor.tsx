import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Editor from '@monaco-editor/react';
import { 
  FileCode2, 
  AlertTriangle, 
  Smartphone, 
  Tablet, 
  Monitor,
  Copy, 
  Clipboard, 
  Trash2, 
  RotateCcw, 
  Save, 
  Download, 
  Upload,
  Check,
  Undo2,
  Redo2,
  Search
} from 'lucide-react';
import { validateXML, detectLanguage, ValidationResult } from '../utils/xmlValidator';
import { ClipboardUtils } from '../utils/clipboardUtils';
import StatusBar from './StatusBar';

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
  const [isAutoSaveEnabled] = useState(true);

  const detectedLanguage = useMemo(() => detectLanguage(htmlCode), [htmlCode]);
  const lineCount = useMemo(() => htmlCode.split('\n').length, [htmlCode]);

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
  }, [htmlCode, detectedLanguage, onValidationChange]);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const showMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setShowToast({ message, type });
  };

  const handleCopyCode = async () => {
    const success = await ClipboardUtils.copyToClipboard(htmlCode);
    if (success) {
      showMessage('Code copied to clipboard!');
    } else {
      showMessage('Failed to copy code', 'error');
    }
  };

  const handlePasteCode = async () => {
    try {
      const clipboardText = await ClipboardUtils.pasteFromClipboard();
      if (clipboardText) {
        onCodeChange(clipboardText);
        showMessage('Code pasted successfully!');
      }
    } catch (err) {
      showMessage('Failed to paste code', 'error');
    }
  };

  const handleClearCode = () => {
    const confirmed = window.confirm('Are you sure you want to delete all code? This action cannot be undone.');
    if (confirmed) {
      onCodeChange('');
      showMessage('All code deleted!');
      
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.focus();
        }
      }, 100);
    }
  };

  const handleUndo = () => {
    if (editorRef.current) {
      editorRef.current.trigger('keyboard', 'undo', null);
      showMessage('Undo successful!');
    }
  };

  const handleRedo = () => {
    if (editorRef.current) {
      editorRef.current.trigger('keyboard', 'redo', null);
      showMessage('Redo successful!');
    }
  };

  const handleQuickSave = () => {
    localStorage.setItem('htmlEditorQuickSave', htmlCode);
    localStorage.setItem('htmlEditorLastSave', new Date().toISOString());
    setLastSaved(new Date());
    showMessage('Code saved!');
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
    showMessage('File downloaded!');
  };

  const handleImportCode = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.html,.htm,.xml,.txt,.css,.js';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          onCodeChange(content);
          showMessage(`${file.name} imported successfully!`);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleFindReplace = () => {
    if (editorRef.current) {
      editorRef.current.trigger('keyboard', 'actions.find', null);
    }
  };

  const handleEditorChange = useCallback((value: string | undefined) => {
    const newCode = value || '';
    onCodeChange(newCode);
  }, [onCodeChange]);

  const errorCount = validationResult.errors.filter(e => e.type === 'error').length;
  const warningCount = validationResult.errors.filter(e => e.type === 'warning').length;

  const getDeviceIcon = () => {
    if (isMobile) return <Smartphone size={14} className="text-primary" />;
    if (isTablet) return <Tablet size={14} className="text-primary" />;
    return <Monitor size={14} className="text-primary" />;
  };

  const ActionButton = ({ 
    onClick, 
    icon: Icon, 
    title, 
    variant = 'default' 
  }: { 
    onClick: () => void; 
    icon: React.ElementType; 
    title: string; 
    variant?: 'default' | 'danger' | 'success';
  }) => {
    const baseClasses = "p-2 rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/50";
    const variantClasses = {
      default: isDarkMode 
        ? 'hover:bg-secondary text-muted-foreground hover:text-foreground' 
        : 'hover:bg-secondary text-muted-foreground hover:text-foreground',
      danger: isDarkMode 
        ? 'text-destructive hover:bg-destructive/10 hover:text-destructive' 
        : 'text-destructive hover:bg-destructive/10 hover:text-destructive',
      success: isDarkMode 
        ? 'text-success hover:bg-success/10 hover:text-success' 
        : 'text-success hover:bg-success/10 hover:text-success',
    };

    return (
      <button
        onClick={onClick}
        className={`${baseClasses} ${variantClasses[variant]}`}
        title={title}
      >
        <Icon size={16} />
      </button>
    );
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Toast Notification */}
      {showToast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 animate-slide-down flex items-center space-x-2 ${
          showToast.type === 'success' 
            ? 'bg-success text-success-foreground' 
            : 'bg-destructive text-destructive-foreground'
        }`}>
          {showToast.type === 'success' ? <Check size={16} /> : <AlertTriangle size={16} />}
          <span className="font-medium">{showToast.message}</span>
        </div>
      )}

      {/* Toolbar */}
      <div className={`px-3 py-2 border-b transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-card border-border' 
          : 'bg-card border-border'
      }`}>
        <div className="flex flex-col space-y-2">
          {/* Top Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className={`p-1.5 rounded-md ${isDarkMode ? 'bg-primary/20' : 'bg-primary/10'}`}>
                  <FileCode2 size={16} className="text-primary" />
                </div>
                <span className="text-sm font-semibold">
                  {language === 'xml' ? 'Blogger XML Editor' : 'HTML Editor'}
                </span>
                {getDeviceIcon()}
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-2 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse-subtle"></div>
                <span>Auto-save enabled</span>
              </div>
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex flex-wrap items-center gap-2">
            {language === 'xml' && (
              <>
                {errorCount > 0 && (
                  <span className="text-xs px-2 py-1 bg-destructive/10 text-destructive rounded-full border border-destructive/20 flex items-center space-x-1">
                    <AlertTriangle size={10} />
                    <span>{errorCount} {errorCount === 1 ? 'error' : 'errors'}</span>
                  </span>
                )}
                {warningCount > 0 && (
                  <span className="text-xs px-2 py-1 bg-warning/10 text-warning rounded-full border border-warning/20 flex items-center space-x-1">
                    <AlertTriangle size={10} />
                    <span>{warningCount} {warningCount === 1 ? 'warning' : 'warnings'}</span>
                  </span>
                )}
                {validationResult.isValid && errorCount === 0 && (
                  <span className="text-xs px-2 py-1 bg-success/10 text-success rounded-full border border-success/20 flex items-center space-x-1">
                    <Check size={10} />
                    <span>Valid Blogger XML</span>
                  </span>
                )}
              </>
            )}
            <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full border border-primary/20">
              {htmlCode.length.toLocaleString()} characters
            </span>
            <span className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded-full">
              {lineCount} lines
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={onShowTemplates}
              className={`text-xs px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center space-x-1.5 border font-medium ${
                isDarkMode 
                  ? 'hover:bg-secondary border-border hover:border-primary/50 text-muted-foreground hover:text-foreground' 
                  : 'hover:bg-secondary border-border hover:border-primary/50 text-muted-foreground hover:text-foreground'
              }`}
            >
              <FileCode2 size={14} />
              <span>Templates</span>
            </button>
            
            <div className="flex items-center space-x-0.5">
              <ActionButton onClick={handleCopyCode} icon={Copy} title="Copy all code (Ctrl+C)" />
              {canPaste && (
                <ActionButton onClick={handlePasteCode} icon={Clipboard} title="Paste code (Ctrl+V)" />
              )}
              
              <div className={`w-px h-6 mx-1 ${isDarkMode ? 'bg-border' : 'bg-border'}`} />
              
              <ActionButton onClick={handleUndo} icon={Undo2} title="Undo (Ctrl+Z)" />
              <ActionButton onClick={handleRedo} icon={Redo2} title="Redo (Ctrl+Y)" />
              <ActionButton onClick={handleFindReplace} icon={Search} title="Find & Replace (Ctrl+F)" />
              
              <div className={`w-px h-6 mx-1 ${isDarkMode ? 'bg-border' : 'bg-border'}`} />
              
              <ActionButton onClick={handleQuickSave} icon={Save} title="Quick save (Ctrl+S)" variant="success" />
              <ActionButton onClick={handleExportCode} icon={Download} title="Download file" />
              <ActionButton onClick={handleImportCode} icon={Upload} title="Import file" />
              
              <div className={`w-px h-6 mx-1 ${isDarkMode ? 'bg-border' : 'bg-border'}`} />
              
              <ActionButton onClick={handleClearCode} icon={Trash2} title="Clear all code" variant="danger" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Monaco Editor */}
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          language={language}
          value={htmlCode}
          onChange={handleEditorChange}
          onMount={onEditorDidMount}
          theme={isDarkMode ? 'custom-dark' : 'custom-light'}
          options={{
            minimap: { enabled: !isMobile },
            fontSize: isMobile ? 14 : 15,
            lineNumbers: 'on',
            wordWrap: 'on',
            automaticLayout: true,
            scrollBeyondLastLine: false,
            tabSize: 2,
            insertSpaces: true,
            renderWhitespace: 'selection',
            fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, Monaco, monospace",
            fontLigatures: true,
            lineHeight: 1.6,
            letterSpacing: 0.3,
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
            roundedSelection: true,
            readOnly: false,
            cursorStyle: 'line',
            cursorWidth: 2,
            accessibilitySupport: 'auto',
            padding: { top: 16, bottom: 16 },
            bracketPairColorization: { enabled: true },
            guides: {
              bracketPairs: true,
              indentation: true,
            },
          }}
        />
      </div>

      {/* Status Bar */}
      <StatusBar
        isDarkMode={isDarkMode}
        charCount={htmlCode.length}
        lineCount={lineCount}
        language={language}
        errorCount={errorCount}
        warningCount={warningCount}
        lastSaved={lastSaved}
        isAutoSaveEnabled={isAutoSaveEnabled}
      />
    </div>
  );
};

export default CodeEditor;
