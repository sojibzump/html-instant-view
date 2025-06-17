
import React, { useState } from 'react';
import { Code2, Copy, X, Star, Search } from 'lucide-react';

interface CodeSnippetsProps {
  isDarkMode: boolean;
  isVisible: boolean;
  onClose: () => void;
  onInsertCode: (code: string) => void;
}

const CodeSnippets: React.FC<CodeSnippetsProps> = ({
  isDarkMode,
  isVisible,
  onClose,
  onInsertCode,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');

  const snippets = [
    {
      id: 1,
      title: 'Responsive Navigation',
      category: 'navigation',
      description: 'Mobile-first responsive navbar',
      code: `<nav class="bg-blue-600 p-4">
  <div class="container mx-auto flex justify-between items-center">
    <h1 class="text-white text-xl font-bold">Logo</h1>
    <ul class="hidden md:flex space-x-4">
      <li><a href="#" class="text-white hover:text-blue-200">Home</a></li>
      <li><a href="#" class="text-white hover:text-blue-200">About</a></li>
      <li><a href="#" class="text-white hover:text-blue-200">Contact</a></li>
    </ul>
  </div>
</nav>`
    },
    {
      id: 2,
      title: 'Hero Section',
      category: 'sections',
      description: 'Eye-catching hero section with CTA',
      code: `<section class="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
  <div class="container mx-auto text-center">
    <h1 class="text-5xl font-bold mb-4">Welcome to Our Site</h1>
    <p class="text-xl mb-8">Create amazing experiences with our platform</p>
    <button class="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">
      Get Started
    </button>
  </div>
</section>`
    },
    {
      id: 3,
      title: 'Card Component',
      category: 'components',
      description: 'Modern card with hover effects',
      code: `<div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6">
  <img src="https://via.placeholder.com/300x200" alt="Card Image" class="w-full h-48 object-cover rounded-lg mb-4">
  <h3 class="text-xl font-bold mb-2">Card Title</h3>
  <p class="text-gray-600 mb-4">This is a beautiful card component with hover effects.</p>
  <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
    Learn More
  </button>
</div>`
    },
    {
      id: 4,
      title: 'Contact Form',
      category: 'forms',
      description: 'Professional contact form',
      code: `<form class="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
  <h2 class="text-2xl font-bold mb-6 text-center">Contact Us</h2>
  <div class="mb-4">
    <label class="block text-gray-700 text-sm font-bold mb-2">Name</label>
    <input type="text" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500">
  </div>
  <div class="mb-4">
    <label class="block text-gray-700 text-sm font-bold mb-2">Email</label>
    <input type="email" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500">
  </div>
  <div class="mb-6">
    <label class="block text-gray-700 text-sm font-bold mb-2">Message</label>
    <textarea rows="4" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"></textarea>
  </div>
  <button type="submit" class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
    Send Message
  </button>
</form>`
    },
    {
      id: 5,
      title: 'Footer Section',
      category: 'sections',
      description: 'Complete footer with links',
      code: `<footer class="bg-gray-800 text-white py-12">
  <div class="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
    <div>
      <h3 class="text-xl font-bold mb-4">Company</h3>
      <ul class="space-y-2">
        <li><a href="#" class="hover:text-gray-300">About Us</a></li>
        <li><a href="#" class="hover:text-gray-300">Services</a></li>
        <li><a href="#" class="hover:text-gray-300">Contact</a></li>
      </ul>
    </div>
    <div>
      <h3 class="text-xl font-bold mb-4">Resources</h3>
      <ul class="space-y-2">
        <li><a href="#" class="hover:text-gray-300">Blog</a></li>
        <li><a href="#" class="hover:text-gray-300">Documentation</a></li>
        <li><a href="#" class="hover:text-gray-300">Help Center</a></li>
      </ul>
    </div>
  </div>
  <div class="border-t border-gray-700 mt-8 pt-8 text-center">
    <p>&copy; 2024 Your Company. All rights reserved.</p>
  </div>
</footer>`
    }
  ];

  const categories = [
    { id: 'all', name: 'All Snippets' },
    { id: 'navigation', name: 'Navigation' },
    { id: 'sections', name: 'Sections' },
    { id: 'components', name: 'Components' },
    { id: 'forms', name: 'Forms' }
  ];

  const filteredSnippets = snippets.filter(snippet => {
    const matchesSearch = snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         snippet.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'all' || snippet.category === category;
    return matchesSearch && matchesCategory;
  });

  const handleInsert = (code: string) => {
    onInsertCode(code);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`relative max-w-4xl w-full mx-4 h-[80vh] rounded-lg ${
        isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      } flex flex-col`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Code2 size={20} />
            <h3 className="font-semibold">Code Snippets Library</h3>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            <X size={16} />
          </button>
        </div>
        
        {/* Search and Filter */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search snippets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                }`}
              />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`px-4 py-2 rounded-lg border ${
                isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              }`}
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Snippets List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid gap-4">
            {filteredSnippets.map(snippet => (
              <div
                key={snippet.id}
                className={`border rounded-lg p-4 hover:shadow-lg transition-all ${
                  isDarkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold flex items-center space-x-2">
                      <span>{snippet.title}</span>
                      <Star size={14} className="text-yellow-500" />
                    </h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {snippet.description}
                    </p>
                  </div>
                  <button
                    onClick={() => handleInsert(snippet.code)}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex items-center space-x-1"
                  >
                    <Copy size={14} />
                    <span>Insert</span>
                  </button>
                </div>
                <pre className={`text-xs overflow-x-auto p-3 rounded ${
                  isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-800'
                }`}>
                  {snippet.code.substring(0, 200)}...
                </pre>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeSnippets;
