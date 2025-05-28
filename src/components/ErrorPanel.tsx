
import React from 'react';
import { AlertTriangle, AlertCircle, X } from 'lucide-react';
import { ValidationError } from '../utils/xmlValidator';

interface ErrorPanelProps {
  errors: ValidationError[];
  isDarkMode: boolean;
  isVisible: boolean;
  onClose: () => void;
}

const ErrorPanel: React.FC<ErrorPanelProps> = ({
  errors,
  isDarkMode,
  isVisible,
  onClose,
}) => {
  if (!isVisible || errors.length === 0) return null;

  const errorCount = errors.filter(e => e.type === 'error').length;
  const warningCount = errors.filter(e => e.type === 'warning').length;

  return (
    <div className={`border-t transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className={`px-4 py-2 border-b flex items-center justify-between ${isDarkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
        <div className="flex items-center space-x-4">
          <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Validation Results
          </span>
          {errorCount > 0 && (
            <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded">
              {errorCount} error{errorCount !== 1 ? 's' : ''}
            </span>
          )}
          {warningCount > 0 && (
            <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
              {warningCount} warning{warningCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className={`p-1 rounded hover:bg-opacity-20 ${isDarkMode ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-200 text-gray-600'}`}
        >
          <X size={16} />
        </button>
      </div>
      
      <div className="max-h-48 overflow-y-auto">
        {errors.map((error, index) => (
          <div
            key={index}
            className={`p-3 border-b last:border-b-0 flex items-start space-x-3 ${
              isDarkMode ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-100 hover:bg-gray-50'
            }`}
          >
            {error.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span className={`text-xs px-1.5 py-0.5 rounded ${
                  error.type === 'error' 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  Line {error.line}:{error.column}
                </span>
                <span className={`text-xs uppercase font-medium ${
                  error.type === 'error' ? 'text-red-600' : 'text-yellow-600'
                }`}>
                  {error.type}
                </span>
              </div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {error.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ErrorPanel;
