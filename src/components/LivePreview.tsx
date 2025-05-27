
import React from 'react';

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
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-white">
        <div className={`w-full h-12 px-4 py-2 border-b transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-700'} flex items-center justify-between`}>
          <span className="text-sm font-medium">Full Preview Mode</span>
          <button
            onClick={onToggleFullscreen}
            className={`text-xs px-3 py-1 rounded transition-colors duration-200 ${isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-600'}`}
          >
            Exit Full Mode
          </button>
        </div>
        <div className="w-full h-[calc(100vh-48px)]">
          <iframe
            ref={previewRef}
            srcDoc={htmlCode}
            className="w-full h-full border-0"
            title="HTML Preview"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className={`px-2 sm:px-4 py-2 border-b transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-700'} md:border-l`}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Live Preview</span>
          <div className="flex items-center space-x-2">
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
  );
};

export default LivePreview;
