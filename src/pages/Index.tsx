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
import DraggableChatPanel from '../components/DraggableChatPanel';
import { BloggerTemplate } from '../data/bloggerTemplates';
import { ValidationResult } from '../utils/xmlValidator';
import { useAICodeAnalysis } from '../hooks/useAICodeAnalysis';
import { MessageSquare, Code, Zap, Bot } from 'lucide-react';

const Index = () => {
  const [htmlCode, setHtmlCode] = useState(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Copilot - Advanced Code Assistant</title>
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
        .ai-badge {
            display: inline-block;
            background: linear-gradient(45deg, #4CAF50, #45a049);
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.9em;
            margin: 10px 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🤖 AI Copilot</h1>
        <p>Advanced AI-powered coding assistant with multi-model support</p>
        
        <div class="feature">
            <h3>🚀 Smart Code Generation</h3>
            <p>Generate clean, production-ready code with auto-closing tags and intelligent suggestions.</p>
        </div>
        
        <div class="feature">
            <h3>💬 Interactive AI Chat</h3>
            <p>Draggable chat interface powered by multiple AI models for superior assistance.</p>
        </div>
        
        <div class="feature">
            <h3>🎯 Multi-Model Support</h3>
            <p>
                <span class="ai-badge">DeepSeek V3</span>
                <span class="ai-badge">OlympicCoder</span>
                <span class="ai-badge">Qwen2.5</span>
            </p>
        </div>
        
        <p style="margin-top: 40px; font-size: 1.1em;">
            Start coding with AI assistance! Open the chat panel and ask for help with HTML, CSS, JavaScript, and more.
        </p>
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
  const [showAIChat, setShowAIChat] = useState(false);
  
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

  const handleCodeGenerated = useCallback((generatedCode: string) => {
    setHtmlCode(generatedCode);
    if (editorRef.current) {
      editorRef.current.focus();
    }
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} flex flex-col`}>
      {/* Header - Fixed height for consistency */}
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

      {/* AI Code Generation CTA Section - Only show on homepage with default content */}
      {htmlCode.includes('AI Copilot') && htmlCode.includes('Advanced AI-powered coding assistant') && (
        <div className={`px-4 py-6 border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-blue-50 border-blue-200'}`}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-6">
              <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                🚀 Start Building with AI
              </h2>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Generate production-ready code instantly with our advanced AI models
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <button
                onClick={() => setShowAIChat(true)}
                className={`p-4 rounded-xl border-2 border-dashed transition-all hover:scale-105 ${
                  isDarkMode 
                    ? 'border-blue-600 bg-blue-900/20 hover:bg-blue-900/30 text-blue-400' 
                    : 'border-blue-400 bg-blue-50 hover:bg-blue-100 text-blue-600'
                }`}
              >
                <div className="flex items-center justify-center mb-3">
                  <MessageSquare size={32} />
                </div>
                <h3 className="font-semibold mb-2">💬 AI Chat Assistant</h3>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Chat with AI to build, debug, and improve your code
                </p>
              </button>

              <button
                onClick={() => setShowTemplates(true)}
                className={`p-4 rounded-xl border-2 border-dashed transition-all hover:scale-105 ${
                  isDarkMode 
                    ? 'border-green-600 bg-green-900/20 hover:bg-green-900/30 text-green-400' 
                    : 'border-green-400 bg-green-50 hover:bg-green-100 text-green-600'
                }`}
              >
                <div className="flex items-center justify-center mb-3">
                  <Code size={32} />
                </div>
                <h3 className="font-semibold mb-2">⚡ Quick Templates</h3>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Start with pre-built templates for common projects
                </p>
              </button>

              <button
                onClick={() => {
                  setShowAIChat(true);
                  // Auto-open quick generator
                  setTimeout(() => {
                    const quickGenButton = document.querySelector('[title="Quick Generate"]') as HTMLButtonElement;
                    quickGenButton?.click();
                  }, 500);
                }}
                className={`p-4 rounded-xl border-2 border-dashed transition-all hover:scale-105 ${
                  isDarkMode 
                    ? 'border-purple-600 bg-purple-900/20 hover:bg-purple-900/30 text-purple-400' 
                    : 'border-purple-400 bg-purple-50 hover:bg-purple-100 text-purple-600'
                }`}
              >
                <div className="flex items-center justify-center mb-3">
                  <Zap size={32} />
                </div>
                <h3 className="font-semibold mb-2">🎯 Instant Generation</h3>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Generate landing pages, dashboards, and more instantly
                </p>
              </button>
            </div>

            <div className="flex justify-center space-x-4">
              <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs ${
                isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
              }`}>
                <Bot size={14} />
                <span>DeepSeek V3</span>
              </div>
              <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs ${
                isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
              }`}>
                <Bot size={14} />
                <span>OlympicCoder</span>
              </div>
              <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs ${
                isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
              }`}>
                <Bot size={14} />
                <span>Qwen2.5</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Flexible layout */}
      <div className={`flex-1 flex min-h-0 ${isFullscreen ? '' : 'pb-12 sm:pb-16 lg:pb-0'}`}>
        {/* Sidebar Ad Zone - Only on large desktop and not in fullscreen */}
        {!isFullscreen && <AdSidebar isDarkMode={isDarkMode} />}

        {/* Editor and Preview Container */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 flex flex-col lg:flex-row min-h-0">
            {/* Code Editor - Responsive behavior */}
            {!isFullscreen && (
              <div className={`flex-1 flex flex-col min-h-0 ${isFullscreen ? '' : 'lg:w-1/2'}`}>
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
                  onShowDeepSeekChat={() => setShowAIChat(true)}
                  onApplyCorrection={handleApplyCorrection}
                />
                
                {/* Error Panel - Responsive positioning */}
                <ErrorPanel
                  errors={validationResult.errors}
                  isDarkMode={isDarkMode}
                  isVisible={showErrors}
                  onClose={() => setShowErrors(false)}
                />

                {/* AI Suggestions Panel - Responsive positioning */}
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

            {/* Live Preview - Responsive sizing */}
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

      {/* Draggable AI Chat Panel - Responsive behavior */}
      <DraggableChatPanel
        isVisible={showAIChat}
        isDarkMode={isDarkMode}
        currentCode={htmlCode}
        onClose={() => setShowAIChat(false)}
        onCodeGenerated={handleCodeGenerated}
      />

      {/* Template Selector Modal - Full responsive support */}
      <TemplateSelector
        isDarkMode={isDarkMode}
        onTemplateSelect={handleTemplateSelect}
        isVisible={showTemplates}
        onClose={() => setShowTemplates(false)}
      />

      {/* Footer - Hidden in fullscreen, responsive spacing */}
      {!isFullscreen && <Footer isDarkMode={isDarkMode} />}

      {/* Mobile Ad Zone - Responsive bottom positioning */}
      {!isFullscreen && <MobileAd isDarkMode={isDarkMode} />}
    </div>
  );
};

export default Index;
