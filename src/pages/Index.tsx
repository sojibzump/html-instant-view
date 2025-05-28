import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from '../components/Header';
import AdSidebar from '../components/AdSidebar';
import CodeEditor from '../components/CodeEditor';
import LivePreview from '../components/LivePreview';
import Footer from '../components/Footer';
import MobileAd from '../components/MobileAd';
import TemplateSelector from '../components/TemplateSelector';
import ErrorPanel from '../components/ErrorPanel';
import AISuggestionsPanel from '../components/AISuggestionsPanel';
import { BloggerTemplate } from '../data/bloggerTemplates';
import { ValidationResult } from '../utils/xmlValidator';
import { useAICodeAnalysis } from '../hooks/useAICodeAnalysis';

const Index = () => {
  const [htmlCode, setHtmlCode] = useState(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HTML Live Preview</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-align: center;
        }
        .container {
            background: rgba(255, 255, 255, 0.1);
            padding: 30px;
            border-radius: 15px;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        }
        h1 {
            margin-bottom: 20px;
            font-size: 2.5em;
        }
        p {
            font-size: 1.2em;
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to HTML Live Editor!</h1>
        <p>Start editing the code on the left to see real-time changes here.</p>
        <p>Now supports Blogger XML templates with error detection!</p>
    </div>
</body>
</html>`);
  
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [savedProjects, setSavedProjects] = useState<string[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult>({ isValid: true, errors: [] });
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  
  const editorRef = useRef<any>(null);
  const previewRef = useRef<HTMLIFrameElement>(null);

  const { analysis } = useAICodeAnalysis();

  useEffect(() => {
    // Load saved projects from localStorage
    const saved = localStorage.getItem('htmlEditorProjects');
    if (saved) {
      setSavedProjects(JSON.parse(saved));
    }
    
    // Load last saved code
    const lastCode = localStorage.getItem('htmlEditorLastCode');
    if (lastCode) {
      setHtmlCode(lastCode);
    }
  }, []);

  useEffect(() => {
    // Auto-save current code
    localStorage.setItem('htmlEditorLastCode', htmlCode);
    
    // Update preview
    if (previewRef.current) {
      const preview = previewRef.current;
      preview.srcdoc = htmlCode;
    }
  }, [htmlCode]);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    
    // Configure editor
    monaco.editor.defineTheme('custom-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#1a1a2e',
        'editor.foreground': '#e0e0e0',
        'editorLineNumber.foreground': '#6366f1',
        'editor.selectionBackground': '#3b82f640',
        'editor.lineHighlightBackground': '#16213e40',
      }
    });

    monaco.editor.defineTheme('custom-light', {
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#ffffff',
        'editor.foreground': '#1f2937',
        'editorLineNumber.foreground': '#6366f1',
        'editor.selectionBackground': '#3b82f620',
        'editor.lineHighlightBackground': '#f8fafc',
      }
    });

    monaco.editor.setTheme(isDarkMode ? 'custom-dark' : 'custom-light');
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const selectAllCode = () => {
    if (editorRef.current) {
      editorRef.current.setSelection(editorRef.current.getModel().getFullModelRange());
      editorRef.current.focus();
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(htmlCode);
      console.log('Code copied to clipboard');
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const clearCode = () => {
    if (confirm('Are you sure you want to clear all code? This action cannot be undone.')) {
      setHtmlCode('');
      if (editorRef.current) {
        editorRef.current.focus();
      }
    }
  };

  const saveProject = () => {
    const projectName = prompt('Enter project name:');
    if (projectName) {
      const projects = {
        ...JSON.parse(localStorage.getItem('htmlEditorProjects') || '{}'),
        [projectName]: htmlCode
      };
      localStorage.setItem('htmlEditorProjects', JSON.stringify(projects));
      setSavedProjects(Object.keys(projects));
    }
  };

  const loadProject = () => {
    const projects = JSON.parse(localStorage.getItem('htmlEditorProjects') || '{}');
    const projectNames = Object.keys(projects);
    
    if (projectNames.length === 0) {
      alert('No saved projects found.');
      return;
    }

    const projectName = prompt(`Select project to load:\n${projectNames.join('\n')}`);
    if (projectName && projects[projectName]) {
      setHtmlCode(projects[projectName]);
    }
  };

  const exportHTML = () => {
    const blob = new Blob([htmlCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleTemplateSelect = (template: BloggerTemplate) => {
    setHtmlCode(template.code);
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const handleValidationChange = useCallback((result: ValidationResult) => {
    setValidationResult(result);
    if (result.errors.length > 0) {
      setShowErrors(true);
    }
  }, []);

  const handleApplyCorrection = useCallback((correction: any) => {
    if (!editorRef.current) return;

    const model = editorRef.current.getModel();
    const lineContent = model.getLineContent(correction.line);
    const updatedLine = lineContent.replace(correction.original, correction.corrected);
    
    const range = {
      startLineNumber: correction.line,
      startColumn: 1,
      endLineNumber: correction.line,
      endColumn: lineContent.length + 1
    };

    editorRef.current.executeEdits('ai-correction', [{
      range,
      text: updatedLine
    }]);

    editorRef.current.focus();
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <Header
        isDarkMode={isDarkMode}
        isFullscreen={isFullscreen}
        onToggleTheme={toggleTheme}
        onToggleFullscreen={toggleFullscreen}
        onSelectAllCode={selectAllCode}
        onCopyToClipboard={copyToClipboard}
        onClearCode={clearCode}
        onSaveProject={saveProject}
        onLoadProject={loadProject}
        onExportHTML={exportHTML}
      />

      {/* Main Content */}
      <div className={`flex flex-1 ${isFullscreen ? 'h-[calc(100vh-73px)]' : 'h-[calc(100vh-73px)]'}`}>
        {/* Sidebar Ad Zone - Only on desktop and not in fullscreen */}
        {!isFullscreen && <AdSidebar isDarkMode={isDarkMode} />}

        {/* Editor and Preview */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex flex-col md:flex-row min-h-0">
            {/* Code Editor - Hidden in fullscreen mode */}
            {!isFullscreen && (
              <div className="flex-1 flex flex-col min-h-0">
                <CodeEditor
                  htmlCode={htmlCode}
                  isDarkMode={isDarkMode}
                  editorRef={editorRef}
                  onCodeChange={setHtmlCode}
                  onEditorDidMount={handleEditorDidMount}
                  onSelectAllCode={selectAllCode}
                  onShowTemplates={() => setShowTemplates(true)}
                  onValidationChange={handleValidationChange}
                  onShowAISuggestions={() => setShowAIAssistant(true)}
                  onApplyCorrection={handleApplyCorrection}
                />
                
                {/* Error Panel */}
                <ErrorPanel
                  errors={validationResult.errors}
                  isDarkMode={isDarkMode}
                  isVisible={showErrors}
                  onClose={() => setShowErrors(false)}
                />

                {/* AI Suggestions Panel */}
                <AISuggestionsPanel
                  analysis={analysis}
                  isAnalyzing={false}
                  isDarkMode={isDarkMode}
                  isVisible={showAIAssistant}
                  onClose={() => setShowAIAssistant(false)}
                  onApplyCorrection={handleApplyCorrection}
                />
              </div>
            )}

            {/* Live Preview */}
            <LivePreview
              htmlCode={htmlCode}
              isDarkMode={isDarkMode}
              isFullscreen={isFullscreen}
              previewRef={previewRef}
              onToggleFullscreen={toggleFullscreen}
            />
          </div>
        </div>
      </div>

      {/* Template Selector Modal */}
      <TemplateSelector
        isDarkMode={isDarkMode}
        onTemplateSelect={handleTemplateSelect}
        isVisible={showTemplates}
        onClose={() => setShowTemplates(false)}
      />

      {/* Footer with Ad Zone - Hidden in fullscreen mode */}
      {!isFullscreen && <Footer isDarkMode={isDarkMode} />}

      {/* Mobile Ad Zone - Sticky bottom, hidden in fullscreen */}
      {!isFullscreen && <MobileAd isDarkMode={isDarkMode} />}
    </div>
  );
};

export default Index;
