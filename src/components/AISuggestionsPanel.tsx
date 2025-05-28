
import React from 'react';
import { Brain, Lightbulb, AlertCircle, Wand2, X } from 'lucide-react';
import { AICodeResponse } from '../services/aiCodeService';

interface AISuggestionsPanelProps {
  analysis: AICodeResponse | null;
  isAnalyzing: boolean;
  isDarkMode: boolean;
  isVisible: boolean;
  onClose: () => void;
  onApplyCorrection: (correction: any) => void;
}

const AISuggestionsPanel: React.FC<AISuggestionsPanelProps> = ({
  analysis,
  isAnalyzing,
  isDarkMode,
  isVisible,
  onClose,
  onApplyCorrection,
}) => {
  if (!isVisible) return null;

  return (
    <div className={`border-t transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className={`px-4 py-2 border-b flex items-center justify-between ${isDarkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
        <div className="flex items-center space-x-3">
          <Brain className={`w-4 h-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            AI Code Assistant
          </span>
          {isAnalyzing && (
            <div className="flex items-center space-x-2">
              <div className="animate-spin w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              <span className="text-xs text-blue-500">Analyzing...</span>
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          className={`p-1 rounded hover:bg-opacity-20 ${isDarkMode ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-200 text-gray-600'}`}
        >
          <X size={16} />
        </button>
      </div>
      
      <div className="max-h-64 overflow-y-auto">
        {analysis && (
          <div className="space-y-4 p-4">
            {/* Suggestions */}
            {analysis.suggestions.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-yellow-500" />
                  <h4 className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Suggestions
                  </h4>
                </div>
                <div className="space-y-2">
                  {analysis.suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded text-sm ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Detected Errors */}
            {analysis.errors.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <h4 className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    AI Detected Issues
                  </h4>
                </div>
                <div className="space-y-2">
                  {analysis.errors.map((error, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded text-sm border-l-4 ${
                        error.severity === 'error' 
                          ? 'border-red-500 bg-red-50 text-red-800' 
                          : error.severity === 'warning'
                          ? 'border-yellow-500 bg-yellow-50 text-yellow-800'
                          : 'border-blue-500 bg-blue-50 text-blue-800'
                      } ${isDarkMode ? 'bg-opacity-20' : ''}`}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs px-1.5 py-0.5 rounded bg-black bg-opacity-10">
                          Line {error.line}:{error.column}
                        </span>
                        <span className="text-xs uppercase font-medium">
                          {error.severity}
                        </span>
                      </div>
                      <p>{error.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Auto-corrections */}
            {analysis.corrections.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Wand2 className="w-4 h-4 text-green-500" />
                  <h4 className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Suggested Corrections
                  </h4>
                </div>
                <div className="space-y-2">
                  {analysis.corrections.map((correction, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs px-1.5 py-0.5 rounded bg-green-100 text-green-700">
                          Line {correction.line}
                        </span>
                        <button
                          onClick={() => onApplyCorrection(correction)}
                          className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                        >
                          Apply
                        </button>
                      </div>
                      <div className="text-xs space-y-1">
                        <div>
                          <span className="font-medium text-red-600">- </span>
                          <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>{correction.original}</span>
                        </div>
                        <div>
                          <span className="font-medium text-green-600">+ </span>
                          <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>{correction.corrected}</span>
                        </div>
                        <p className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {correction.reason}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No issues found */}
            {!isAnalyzing && analysis.suggestions.length === 0 && analysis.errors.length === 0 && analysis.corrections.length === 0 && (
              <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No suggestions or issues found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AISuggestionsPanel;
