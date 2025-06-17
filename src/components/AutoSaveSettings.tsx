
import React, { useState, useEffect } from 'react';
import { Save, Clock, X, Settings, CheckCircle } from 'lucide-react';

interface AutoSaveSettingsProps {
  isDarkMode: boolean;
  isVisible: boolean;
  onClose: () => void;
}

const AutoSaveSettings: React.FC<AutoSaveSettingsProps> = ({
  isDarkMode,
  isVisible,
  onClose,
}) => {
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [saveInterval, setSaveInterval] = useState(30);
  const [lastSaved, setLastSaved] = useState<Date>(new Date());

  useEffect(() => {
    const saved = localStorage.getItem('autoSaveSettings');
    if (saved) {
      const settings = JSON.parse(saved);
      setAutoSaveEnabled(settings.enabled);
      setSaveInterval(settings.interval);
    }
  }, []);

  const saveSettings = () => {
    const settings = {
      enabled: autoSaveEnabled,
      interval: saveInterval
    };
    localStorage.setItem('autoSaveSettings', JSON.stringify(settings));
    console.log('⚙️ Auto-save settings updated');
  };

  useEffect(() => {
    saveSettings();
  }, [autoSaveEnabled, saveInterval]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`relative max-w-md w-full mx-4 rounded-lg ${
        isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      }`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Settings size={20} />
            <h3 className="font-semibold">Auto Save Settings</h3>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            <X size={16} />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          {/* Auto Save Toggle */}
          <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-3">
              <Save size={18} className="text-green-500" />
              <div>
                <div className="font-medium">Enable Auto Save</div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Automatically save your work
                </div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoSaveEnabled}
                onChange={(e) => setAutoSaveEnabled(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-11 h-6 rounded-full transition-colors ${
                autoSaveEnabled ? 'bg-blue-600' : 'bg-gray-300'
              }`}>
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  autoSaveEnabled ? 'translate-x-5' : 'translate-x-0'
                } mt-0.5 ml-0.5`}></div>
              </div>
            </label>
          </div>

          {/* Save Interval */}
          {autoSaveEnabled && (
            <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-600">
              <div className="flex items-center space-x-3 mb-3">
                <Clock size={18} className="text-blue-500" />
                <div>
                  <div className="font-medium">Save Interval</div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    How often to auto-save (seconds)
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <input
                  type="range"
                  min="10"
                  max="300"
                  step="10"
                  value={saveInterval}
                  onChange={(e) => setSaveInterval(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>10s</span>
                  <span className="font-medium">{saveInterval}s</span>
                  <span>5min</span>
                </div>
              </div>
            </div>
          )}

          {/* Last Saved Info */}
          <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700">
            <div className="flex items-center space-x-2">
              <CheckCircle size={16} className="text-green-600" />
              <span className="text-sm text-green-700 dark:text-green-400">
                Last saved: {lastSaved.toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoSaveSettings;
