
import React from 'react';
import { AlertTriangle, Eye } from 'lucide-react';
import { detectLanguage } from '../utils/xmlValidator';

interface LivePreviewProps {
  htmlCode: string;
  isDarkMode: boolean;
  isFullscreen: boolean;
  previewRef: React.RefObject<HTMLIFrameElement>;
  onToggleFullscreen: () => void;
}

const LivePreview: React.FC<LivePreviewProps> = ({
  htmlCode,
  isDarkMode,
  isFullscreen,
  previewRef,
  onToggleFullscreen,
}) => {
  const language = detectLanguage(htmlCode);
  const isXMLTemplate = language === 'xml';

  const renderXMLPreview = () => (
    <div className={`flex-1 flex items-center justify-center p-8 ${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-50 text-gray-600'}`}>
      <div className="text-center max-w-md">
        <AlertTriangle className={`mx-auto mb-4 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} size={48} />
        <h3 className="text-lg font-semibold mb-2">Blogger XML Template Preview</h3>
        <p className="text-sm mb-4">
          Blogger XML templates cannot be previewed directly as they require Blogger's server-side processing.
        </p>
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
          <p className="text-xs font-medium mb-2">To test your template:</p>
          <ol className="text-xs text-left space-y-1">
            <li>1. Copy the XML code</li>
            <li>2. Go to Blogger.com</li>
            <li>3. Navigate to Theme → Edit HTML</li>
            <li>4. Paste and save your template</li>
            <li>5. Preview your blog</li>
          </ol>
        </div>
      </div>
    </div>
  );

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-white">
        <div className={`w-full h-12 px-4 py-2 border-b transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-700'} flex items-center justify-between`}>
          <span className="text-sm font-medium">
            {isXMLTemplate ? 'XML Template Preview' : 'Full Preview Mode'}
          </span>
          <button
            onClick={onToggleFullscreen}
            className={`text-xs px-3 py-1 rounded transition-colors duration-200 ${isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-600'}`}
          >
            Exit Full Mode
          </button>
        </div>
        <div className="w-full h-[calc(100vh-48px)]">
          {isXMLTemplate ? (
            renderXMLPreview()
          ) : (
            <iframe
              ref={previewRef}
              srcDoc={htmlCode}
              className="w-full h-full border-0"
              title="HTML Preview"
              sandbox="allow-scripts allow-same-origin"
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className={`px-2 sm:px-4 py-2 border-b transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-700'} md:border-l`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Eye size={14} />
            <span className="text-sm font-medium">
              {isXMLTemplate ? 'XML Template Info' : 'Live Preview'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs opacity-75 hidden sm:inline">
              {isXMLTemplate ? 'Use Blogger for testing' : 'Real-time rendering'}
            </span>
          </div>
        </div>
      </div>
      <div className="flex-1 relative min-h-0">
        {isXMLTemplate ? (
          renderXMLPreview()
        ) : (
          <iframe
            ref={previewRef}
            srcDoc={htmlCode}
            className="w-full h-full border-0"
            title="HTML Preview"
            sandbox="allow-scripts allow-same-origin"
          />
        )}
      </div>
    </div>
  );
};

export default LivePreview;
