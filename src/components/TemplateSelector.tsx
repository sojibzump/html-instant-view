
import React, { useState } from 'react';
import { FileCode2, Download, Search, Filter, X } from 'lucide-react';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  if (!isVisible) return null;

  const categories = ['All', ...Array.from(new Set(bloggerTemplates.map(t => t.category)))];
  
  const filteredTemplates = bloggerTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className={`max-w-6xl w-full max-h-[90vh] overflow-hidden rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-2xl`}>
        {/* Header */}
        <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-600' : 'bg-blue-100'}`}>
                <FileCode2 className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-blue-600'}`} />
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Blogger XML Templates
                </h2>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Professional templates ready for Blogger
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-600'}`}
            >
              <X size={24} />
            </button>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`px-3 py-2 rounded-lg border transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Templates Grid */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <FileCode2 className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
              <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                No templates found
              </h3>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className={`group p-6 rounded-xl border cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gray-700 hover:bg-gray-600 hover:border-blue-500' 
                      : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-blue-500 hover:shadow-lg'
                  }`}
                  onClick={() => {
                    onTemplateSelect(template);
                    onClose();
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-2 rounded-lg ${
                      template.category === 'Modern' ? 'bg-blue-100 text-blue-600' :
                      template.category === 'Professional' ? 'bg-purple-100 text-purple-600' :
                      template.category === 'Dark' ? 'bg-gray-800 text-gray-300' :
                      'bg-green-100 text-green-600'
                    }`}>
                      <FileCode2 size={20} />
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      template.category === 'Modern' ? 'bg-blue-100 text-blue-700' :
                      template.category === 'Professional' ? 'bg-purple-100 text-purple-700' :
                      template.category === 'Dark' ? 'bg-gray-700 text-gray-300' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {template.category}
                    </span>
                  </div>
                  
                  <h3 className={`font-bold text-lg mb-2 group-hover:text-blue-500 transition-colors ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {template.name}
                  </h3>
                  
                  <p className={`text-sm mb-4 line-clamp-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {template.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800'}`}>
                        Blogger XML
                      </span>
                      <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Ready to use
                      </span>
                    </div>
                    <Download className={`w-4 h-4 ${isDarkMode ? 'text-gray-400 group-hover:text-blue-400' : 'text-gray-500 group-hover:text-blue-500'} transition-colors`} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;
