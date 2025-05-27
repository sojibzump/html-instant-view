
import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Moon, Sun, Download, Save, FolderOpen, Maximize2, Minimize2, Copy, RotateCcw, Trash2, MousePointer } from 'lucide-react';

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
        <p>This is a professional HTML editor with live preview capabilities.</p>
    </div>
</body>
</html>`);
  
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [savedProjects, setSavedProjects] = useState<string[]>([]);
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

  const resetCode = () => {
    if (confirm('Are you sure you want to reset the code?')) {
      setHtmlCode(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HTML Live Preview</title>
</head>
<body>
    <h1>Hello World!</h1>
    <p>Start coding here...</p>
</body>
</html>`);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`border-b transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="container mx-auto px-2 sm:px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <h1 className={`text-lg sm:text-xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                HTML Live Editor
              </h1>
              <span className={`text-xs sm:text-sm px-2 py-1 rounded transition-colors duration-300 ${isDarkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-800'}`}>
                Professional
              </span>
            </div>
            
            {/* Header Ad Zone - Hidden on mobile and small screens */}
            <div className={`hidden xl:block w-[728px] h-[90px] border-2 border-dashed transition-colors duration-300 ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} flex items-center justify-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Header Ad Zone 728x90
            </div>

            <div className="flex items-center space-x-1 sm:space-x-3">
              <button
                onClick={selectAllCode}
                className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
                title="Select All Code"
              >
                <MousePointer size={16} className="sm:w-[18px] sm:h-[18px]" />
              </button>
              <button
                onClick={copyToClipboard}
                className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
                title="Copy Code"
              >
                <Copy size={16} className="sm:w-[18px] sm:h-[18px]" />
              </button>
              <button
                onClick={clearCode}
                className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
                title="Clear Code"
              >
                <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
              </button>
              <button
                onClick={saveProject}
                className={`hidden sm:flex p-1.5 sm:p-2 rounded-lg transition-all duration-200 ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
                title="Save Project"
              >
                <Save size={16} className="sm:w-[18px] sm:h-[18px]" />
              </button>
              <button
                onClick={loadProject}
                className={`hidden sm:flex p-1.5 sm:p-2 rounded-lg transition-all duration-200 ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
                title="Load Project"
              >
                <FolderOpen size={16} className="sm:w-[18px] sm:h-[18px]" />
              </button>
              <button
                onClick={exportHTML}
                className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
                title="Download HTML"
              >
                <Download size={16} className="sm:w-[18px] sm:h-[18px]" />
              </button>
              <button
                onClick={toggleFullscreen}
                className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
                title={isFullscreen ? "Exit Full Preview" : "Full Preview Mode"}
              >
                {isFullscreen ? <Minimize2 size={16} className="sm:w-[18px] sm:h-[18px]" /> : <Maximize2 size={16} className="sm:w-[18px] sm:h-[18px]" />}
              </button>
              <button
                onClick={toggleTheme}
                className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
                title="Toggle Theme"
              >
                {isDarkMode ? <Sun size={16} className="sm:w-[18px] sm:h-[18px]" /> : <Moon size={16} className="sm:w-[18px] sm:h-[18px]" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className={`flex flex-1 ${isFullscreen ? 'h-[calc(100vh-73px)]' : 'h-[calc(100vh-73px)]'}`}>
        {/* Sidebar Ad Zone - Only on desktop and not in fullscreen */}
        {!isFullscreen && (
          <div className={`hidden xl:block w-[160px] ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border-r transition-colors duration-300 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="p-4">
              <div className={`w-full h-[600px] border-2 border-dashed transition-colors duration-300 ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} flex items-center justify-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transform rotate-90`}>
                Sidebar Ad 160x600
              </div>
            </div>
          </div>
        )}

        {/* Editor and Preview */}
        <div className="flex-1 flex flex-col md:flex-row">
          {/* Code Editor - Hidden in fullscreen mode */}
          {!isFullscreen && (
            <div className="flex-1 flex flex-col min-h-0">
              <div className={`px-2 sm:px-4 py-2 border-b transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-700'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">HTML Editor</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={selectAllCode}
                      className={`text-xs px-2 py-1 rounded transition-colors duration-200 ${isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-600'}`}
                      title="Select All"
                    >
                      Select All
                    </button>
                    <span className="text-xs opacity-75 hidden sm:inline">Auto-save enabled</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 min-h-0">
                <Editor
                  height="100%"
                  defaultLanguage="html"
                  value={htmlCode}
                  onChange={(value) => setHtmlCode(value || '')}
                  onMount={handleEditorDidMount}
                  theme={isDarkMode ? 'custom-dark' : 'custom-light'}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
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
                  }}
                />
              </div>
            </div>
          )}

          {/* Live Preview */}
          <div className={`${isFullscreen ? 'w-full' : 'flex-1'} flex flex-col min-h-0`}>
            <div className={`px-2 sm:px-4 py-2 border-b transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-700'} ${!isFullscreen ? 'md:border-l' : ''}`}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {isFullscreen ? 'Full Preview Mode' : 'Live Preview'}
                </span>
                <div className="flex items-center space-x-2">
                  {isFullscreen && (
                    <button
                      onClick={toggleFullscreen}
                      className={`text-xs px-2 py-1 rounded transition-colors duration-200 ${isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-600'}`}
                    >
                      Exit Full Mode
                    </button>
                  )}
                  <span className="text-xs opacity-75 hidden sm:inline">Real-time rendering</span>
                </div>
              </div>
            </div>
            <div className="flex-1 relative min-h-0">
              <iframe
                ref={previewRef}
                srcDoc={htmlCode}
                className="w-full h-full border-0"
                title="HTML Preview"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer with Ad Zone - Hidden in fullscreen mode */}
      {!isFullscreen && (
        <footer className={`border-t transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="container mx-auto px-2 sm:px-4 py-4">
            <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
              <div className={`text-xs sm:text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-center lg:text-left`}>
                © 2024 HTML Live Editor. Professional code editing experience.
              </div>
              
              {/* Footer Ad Zone */}
              <div className={`w-full lg:w-[728px] h-[90px] border-2 border-dashed transition-colors duration-300 ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} flex items-center justify-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Footer Ad Zone 728x90
              </div>
            </div>
          </div>
        </footer>
      )}

      {/* Mobile Ad Zone - Sticky bottom, hidden in fullscreen */}
      {!isFullscreen && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
          <div className={`w-full h-[50px] border-t-2 border-dashed transition-colors duration-300 ${isDarkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-white'} flex items-center justify-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Mobile Ad Zone 320x50
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
