
import React from 'react';
import { Download, FileCode, Archive, Share2, X } from 'lucide-react';

interface ExportOptionsProps {
  isDarkMode: boolean;
  isVisible: boolean;
  onClose: () => void;
  htmlCode: string;
}

const ExportOptions: React.FC<ExportOptionsProps> = ({ isDarkMode, isVisible, onClose, htmlCode }) => {
  if (!isVisible) return null;

  const exportAsHTML = () => {
    const blob = new Blob([htmlCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAsZip = async () => {
    // Create a simple CSS file to accompany the HTML
    const cssContent = `/* Auto-generated styles */
body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
.container { max-width: 1200px; margin: 0 auto; padding: 20px; }`;

    // For demo purposes, we'll create multiple files
    const files = [
      { name: 'index.html', content: htmlCode },
      { name: 'styles.css', content: cssContent },
      { name: 'README.txt', content: 'HTML project exported from HTML Live Editor\nOpen index.html in your browser to view.' }
    ];

    // Create individual downloads (simplified zip simulation)
    files.forEach(file => {
      const blob = new Blob([file.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(url);
    });
    
    console.log('📦 Project exported as multiple files');
  };

  const shareCode = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'HTML Code from HTML Live Editor',
          text: 'Check out this HTML code I created!',
          url: window.location.href
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy link to clipboard
      await navigator.clipboard.writeText(window.location.href);
      console.log('🔗 Link copied to clipboard');
    }
  };

  const exportOptions = [
    {
      icon: FileCode,
      title: 'Export as HTML',
      description: 'Download your code as an HTML file',
      action: exportAsHTML
    },
    {
      icon: Archive,
      title: 'Export as Project',
      description: 'Download as complete project with CSS',
      action: exportAsZip
    },
    {
      icon: Share2,
      title: 'Share Project',
      description: 'Share your project with others',
      action: shareCode
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`relative max-w-md w-full mx-4 rounded-lg ${
        isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      }`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Download size={20} />
            <h3 className="font-semibold">Export Options</h3>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            {exportOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => {
                  option.action();
                  onClose();
                }}
                className={`w-full p-4 rounded-lg border transition-all text-left ${
                  isDarkMode 
                    ? 'border-gray-600 hover:border-gray-500 hover:bg-gray-700' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <option.icon size={20} className="mt-1 text-blue-500" />
                  <div>
                    <div className="font-medium">{option.title}</div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {option.description}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportOptions;
