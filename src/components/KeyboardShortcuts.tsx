
import React, { useEffect, useState } from 'react';
import { Keyboard, X } from 'lucide-react';

interface KeyboardShortcutsProps {
  isDarkMode: boolean;
  isVisible: boolean;
  onClose: () => void;
}

const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({ isDarkMode, isVisible, onClose }) => {
  if (!isVisible) return null;

  const shortcuts = [
    { key: 'Ctrl + S', description: 'Save project' },
    { key: 'Ctrl + A', description: 'Select all code' },
    { key: 'Ctrl + C', description: 'Copy code' },
    { key: 'Ctrl + V', description: 'Paste code' },
    { key: 'Ctrl + Z', description: 'Undo' },
    { key: 'Ctrl + /', description: 'Toggle comment' },
    { key: 'F11', description: 'Toggle fullscreen' },
    { key: 'Ctrl + Enter', description: 'Quick save' },
    { key: 'Alt + T', description: 'Show templates' },
    { key: 'Ctrl + Shift + D', description: 'Download HTML' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`relative max-w-md w-full mx-4 rounded-lg ${
        isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      }`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Keyboard size={20} />
            <h3 className="font-semibold">Keyboard Shortcuts</h3>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-4 max-h-96 overflow-y-auto">
          <div className="space-y-2">
            {shortcuts.map((shortcut, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {shortcut.description}
                </span>
                <kbd className={`px-2 py-1 text-xs rounded border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-gray-300' 
                    : 'bg-gray-100 border-gray-300 text-gray-700'
                }`}>
                  {shortcut.key}
                </kbd>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcuts;
