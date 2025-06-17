
import React, { useState } from 'react';
import { Code, Wand2, X, CheckCircle } from 'lucide-react';

interface CodeFormatterProps {
  isDarkMode: boolean;
  isVisible: boolean;
  onClose: () => void;
  htmlCode: string;
  onCodeChange: (code: string) => void;
}

const CodeFormatter: React.FC<CodeFormatterProps> = ({
  isDarkMode,
  isVisible,
  onClose,
  htmlCode,
  onCodeChange,
}) => {
  const [isFormatting, setIsFormatting] = useState(false);
  const [formatSuccess, setFormatSuccess] = useState(false);

  if (!isVisible) return null;

  const formatHTML = () => {
    setIsFormatting(true);
    
    // Simple HTML formatter
    let formatted = htmlCode
      .replace(/></g, '>\n<')
      .replace(/\s+/g, ' ')
      .trim();
    
    // Add proper indentation
    let indentLevel = 0;
    const lines = formatted.split('\n');
    const formattedLines = lines.map(line => {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('</')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      const indentedLine = '  '.repeat(indentLevel) + trimmedLine;
      
      if (trimmedLine.startsWith('<') && !trimmedLine.startsWith('</') && !trimmedLine.endsWith('/>')) {
        indentLevel++;
      }
      
      return indentedLine;
    });
    
    setTimeout(() => {
      onCodeChange(formattedLines.join('\n'));
      setIsFormatting(false);
      setFormatSuccess(true);
      setTimeout(() => setFormatSuccess(false), 2000);
    }, 1000);
  };

  const minifyHTML = () => {
    setIsFormatting(true);
    
    const minified = htmlCode
      .replace(/\s+/g, ' ')
      .replace(/>\s+</g, '><')
      .trim();
    
    setTimeout(() => {
      onCodeChange(minified);
      setIsFormatting(false);
      setFormatSuccess(true);
      setTimeout(() => setFormatSuccess(false), 2000);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`relative max-w-md w-full mx-4 rounded-lg ${
        isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      }`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Code size={20} />
            <h3 className="font-semibold">Code Formatter</h3>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            <X size={16} />
          </button>
        </div>
        
        <div className="p-4">
          <div className="space-y-4">
            <button
              onClick={formatHTML}
              disabled={isFormatting}
              className={`w-full p-4 rounded-lg border transition-all text-left ${
                isDarkMode 
                  ? 'border-gray-600 hover:border-gray-500 hover:bg-gray-700' 
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              } ${isFormatting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center space-x-3">
                {formatSuccess ? (
                  <CheckCircle size={20} className="text-green-500" />
                ) : (
                  <Wand2 size={20} className={`text-blue-500 ${isFormatting ? 'animate-spin' : ''}`} />
                )}
                <div>
                  <div className="font-medium">🎨 Format & Beautify</div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Add proper indentation and formatting
                  </div>
                </div>
              </div>
            </button>

            <button
              onClick={minifyHTML}
              disabled={isFormatting}
              className={`w-full p-4 rounded-lg border transition-all text-left ${
                isDarkMode 
                  ? 'border-gray-600 hover:border-gray-500 hover:bg-gray-700' 
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              } ${isFormatting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center space-x-3">
                <Code size={20} className="text-purple-500" />
                <div>
                  <div className="font-medium">⚡ Minify Code</div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Remove extra spaces for faster loading
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeFormatter;
