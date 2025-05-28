
import React from 'react';
import { FileCode2, Download } from 'lucide-react';
import { bloggerTemplates, BloggerTemplate } from '../data/bloggerTemplates';

interface TemplateSelectorProps {
  isDarkMode: boolean;
  onTemplateSelect: (template: BloggerTemplate) => void;
  isVisible: boolean;
  onClose: () => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  isDarkMode,
  onTemplateSelect,
  isVisible,
  onClose,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className={`max-w-4xl w-full max-h-[80vh] overflow-y-auto rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Blogger XML Templates
            </h2>
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
            >
              Close
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
            {bloggerTemplates.map((template) => (
              <div
                key={template.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:scale-105 ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-700 hover:bg-gray-600' 
                    : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => {
                  onTemplateSelect(template);
                  onClose();
                }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <FileCode2 className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {template.name}
                  </h3>
                </div>
                <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {template.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800'}`}>
                    Blogger XML
                  </span>
                  <Download className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;
