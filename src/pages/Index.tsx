import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from '../components/Header';
import AdSidebar from '../components/AdSidebar';
import CodeEditor from '../components/CodeEditor';
import LivePreview from '../components/LivePreview';
import Footer from '../components/Footer';
import MobileAd from '../components/MobileAd';
import TemplateSelector from '../components/TemplateSelector';
import ErrorPanel from '../components/ErrorPanel';
import FullscreenAd from '../components/FullscreenAd';
import KeyboardShortcuts from '../components/KeyboardShortcuts';
import ExportOptions from '../components/ExportOptions';
import CodeFormatter from '../components/CodeFormatter';
import AutoSaveSettings from '../components/AutoSaveSettings';
import CodeSnippets from '../components/CodeSnippets';
import EnhancedToolbar from '../components/EnhancedToolbar';
import { BloggerTemplate } from '../data/bloggerTemplates';
import { ValidationResult } from '../utils/xmlValidator';
import { adRevenueSystem } from '../utils/adRevenueSystem';
import AISuggestionsPanel from '../components/AISuggestionsPanel';
import AISettings from '../components/AISettings';

const Index = () => {
  const [htmlCode, setHtmlCode] = useState(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HTML Editor - Create and Preview HTML Code</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-align: center;
            min-height: 100vh;
        }
        .container {
            background: rgba(255, 255, 255, 0.1);
            padding: 40px;
            border-radius: 20px;
            backdrop-filter: blur(15px);
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
            max-width: 800px;
            margin: 0 auto;
        }
        h1 {
            margin-bottom: 20px;
            font-size: 3em;
            font-weight: 300;
            background: linear-gradient(45deg, #fff, #f0f0f0);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        p {
            font-size: 1.3em;
            line-height: 1.8;
            opacity: 0.9;
        }
        .feature {
            background: rgba(255, 255, 255, 0.05);
            padding: 20px;
            margin: 20px 0;
            border-radius: 15px;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📝 HTML Editor</h1>
        <p>Create, edit and preview HTML code in real-time</p>
        
        <div class="feature">
            <h3>🚀 Live Preview</h3>
            <p>See your changes instantly as you type with our real-time preview.</p>
        </div>
        
        <div class="feature">
            <h3>💾 Save Projects</h3>
            <p>Save and load your HTML projects for easy access later.</p>
        </div>
        
        <div class="feature">
            <h3>📱 Responsive Design</h3>
            <p>Test your HTML on different screen sizes with our responsive preview.</p>
        </div>
        
        <p style="margin-top: 40px; font-size: 1.1em;">
            Start coding! Use the editor to create amazing HTML pages.
        </p>
    </div>
</body>
</html>`);
  
  const [isDarkMode, setIsDarkMode] = useState(false); // Changed to false for light default
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [savedProjects, setSavedProjects] = useState<string[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult>({ isValid: true, errors: [] });
  
  // New modern features state
  const [showFullscreenAd, setShowFullscreenAd] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);
  
  // New additional features state
  const [showCodeFormatter, setShowCodeFormatter] = useState(false);
  const [showAutoSaveSettings, setShowAutoSaveSettings] = useState(false);
  const [showCodeSnippets, setShowCodeSnippets] = useState(false);
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false);
  const [showPreviewSettings, setShowPreviewSettings] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [showSearchReplace, setShowSearchReplace] = useState(false);
  const [showAISettings, setShowAISettings] = useState(false);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  
  const editorRef = useRef<any>(null);
  const previewRef = useRef<HTMLIFrameElement>(null);

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

    // Track initial ad impressions for revenue system
    setTimeout(() => {
      if (!isFullscreen) {
        adRevenueSystem.trackImpression('header-ad');
      }
    }, 1000);

    // Add keyboard shortcuts
    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            saveProject();
            break;
          case 'a':
            if (!e.shiftKey) {
              e.preventDefault();
              selectAllCode();
            }
            break;
          case '/':
            e.preventDefault();
            setShowKeyboardShortcuts(true);
            break;
          case 'Enter':
            e.preventDefault();
            localStorage.setItem('htmlEditorQuickSave', htmlCode);
            console.log('⚡ Quick saved!');
            break;
        }
      }
      
      if (e.altKey && e.key === 't') {
        e.preventDefault();
        setShowTemplates(true);
      }
      
      if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [isFullscreen, htmlCode]);

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
    if (!isFullscreen) {
      // Show ad before entering fullscreen
      setShowFullscreenAd(true);
    } else {
      setIsFullscreen(false);
    }
  };

  const proceedToFullscreen = () => {
    setShowFullscreenAd(false);
    setIsFullscreen(true);
  };

  const closeFullscreenAd = () => {
    setShowFullscreenAd(false);
    // Don't enter fullscreen if user closes the ad
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
    setShowExportOptions(true);
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

  // New handler for inserting code from snippets
  const handleInsertCode = (code: string) => {
    if (editorRef.current) {
      const selection = editorRef.current.getSelection();
      const range = selection || editorRef.current.getModel().getFullModelRange();
      editorRef.current.executeEdits('insert-snippet', [
        {
          range: range,
          text: code,
          forceMoveMarkers: true,
        },
      ]);
      editorRef.current.focus();
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} flex flex-col overflow-hidden`}>
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
        onShowKeyboardShortcuts={() => setShowKeyboardShortcuts(true)}
      />

      {/* Enhanced Toolbar */}
      {!isFullscreen && (
        <EnhancedToolbar
          isDarkMode={isDarkMode}
          onShowFormatter={() => setShowCodeFormatter(true)}
          onShowAutoSave={() => setShowAutoSaveSettings(true)}
          onShowSnippets={() => setShowCodeSnippets(true)}
          onShowThemeCustomizer={() => setShowThemeCustomizer(true)}
          onShowPreviewSettings={() => setShowPreviewSettings(true)}
          onShowShareOptions={() => setShowShareOptions(true)}
          onShowSearchReplace={() => setShowSearchReplace(true)}
          onShowAISettings={() => setShowAISettings(true)}
          onShowAISuggestions={() => setShowAISuggestions(true)}
        />
      )}

      {/* Main Content */}
      <div className={`flex-1 flex min-h-0 ${isFullscreen ? '' : 'pb-12 sm:pb-16 lg:pb-0'}`}>
        {/* Sidebar Ad Zone */}
        {!isFullscreen && <AdSidebar isDarkMode={isDarkMode} />}

        {/* Editor and Preview Container */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 flex flex-col lg:flex-row min-h-0">
            {/* Code Editor */}
            {!isFullscreen && (
              <div className={`flex-1 flex flex-col min-h-0 ${isFullscreen ? '' : 'lg:w-1/2'} border-r ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <CodeEditor
                  htmlCode={htmlCode}
                  isDarkMode={isDarkMode}
                  editorRef={editorRef}
                  onCodeChange={setHtmlCode}
                  onEditorDidMount={handleEditorDidMount}
                  onSelectAllCode={selectAllCode}
                  onShowTemplates={() => setShowTemplates(true)}
                  onValidationChange={handleValidationChange}
                />
                
                {/* Error Panel */}
                <ErrorPanel
                  errors={validationResult.errors}
                  isDarkMode={isDarkMode}
                  isVisible={showErrors}
                  onClose={() => setShowErrors(false)}
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

      {/* Modern Feature Modals */}
      {showFullscreenAd && (
        <FullscreenAd
          isDarkMode={isDarkMode}
          onClose={closeFullscreenAd}
          onProceed={proceedToFullscreen}
        />
      )}
      
      <KeyboardShortcuts
        isDarkMode={isDarkMode}
        isVisible={showKeyboardShortcuts}
        onClose={() => setShowKeyboardShortcuts(false)}
      />
      
      <ExportOptions
        isDarkMode={isDarkMode}
        isVisible={showExportOptions}
        onClose={() => setShowExportOptions(false)}
        htmlCode={htmlCode}
      />

      {/* New Feature Modals */}
      <CodeFormatter
        isDarkMode={isDarkMode}
        isVisible={showCodeFormatter}
        onClose={() => setShowCodeFormatter(false)}
        htmlCode={htmlCode}
        onCodeChange={setHtmlCode}
      />

      <AutoSaveSettings
        isDarkMode={isDarkMode}
        isVisible={showAutoSaveSettings}
        onClose={() => setShowAutoSaveSettings(false)}
      />

      <CodeSnippets
        isDarkMode={isDarkMode}
        isVisible={showCodeSnippets}
        onClose={() => setShowCodeSnippets(false)}
        onInsertCode={handleInsertCode}
      />

      {/* AI Feature Modals */}
      <AISettings
        isDarkMode={isDarkMode}
        isVisible={showAISettings}
        onClose={() => setShowAISettings(false)}
      />

      <AISuggestionsPanel
        isDarkMode={isDarkMode}
        isVisible={showAISuggestions}
        onClose={() => setShowAISuggestions(false)}
        htmlCode={htmlCode}
        onCodeChange={setHtmlCode}
      />

      {/* Footer */}
      {!isFullscreen && <Footer isDarkMode={isDarkMode} />}

      {/* Mobile Ad Zone */}
      {!isFullscreen && <MobileAd isDarkMode={isDarkMode} />}
    </div>
  );
};

export default Index;
