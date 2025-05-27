
import React from 'react';
import Editor from '@monaco-editor/react';
import { MousePointer } from 'lucide-react';

interface CodeEditorProps {
  htmlCode: string;
  isDarkMode: boolean;
  editorRef: React.MutableRefObject<any>;
  onCodeChange: (value: string) => void;
  onEditorDidMount: (editor: any, monaco: any) => void;
  onSelectAllCode: () => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  htmlCode,
  isDarkMode,
  editorRef,
  onCodeChange,
  onEditorDidMount,
  onSelectAllCode,
}) => {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className={`px-2 sm:px-4 py-2 border-b transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-700'}`}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">HTML Editor</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={onSelectAllCode}
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
          onChange={(value) => onCodeChange(value || '')}
          onMount={onEditorDidMount}
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
  );
};

export default CodeEditor;
