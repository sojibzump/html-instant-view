
import React, { useState } from 'react';
import { Brain, Key, X, CheckCircle, AlertTriangle, Zap } from 'lucide-react';
import { aiService } from '../services/aiService';

interface AISettingsProps {
  isDarkMode: boolean;
  isVisible: boolean;
  onClose: () => void;
}

const AISettings: React.FC<AISettingsProps> = ({
  isDarkMode,
  isVisible,
  onClose,
}) => {
  const [apiKey, setApiKey] = useState(aiService.getApiKey());
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isVisible) return null;

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      aiService.setApiKey(apiKey.trim());
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Failed to save API key:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleGetApiKey = () => {
    window.open('https://openrouter.ai/keys', '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`relative max-w-lg w-full mx-4 rounded-lg ${
        isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      }`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Brain size={20} className="text-purple-500" />
            <h3 className="font-semibold">🤖 AI Assistant Settings</h3>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            <X size={16} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            <div className={`p-4 rounded-lg border ${
              isDarkMode ? 'border-blue-800 bg-blue-900/20' : 'border-blue-200 bg-blue-50'
            }`}>
              <div className="flex items-start space-x-3">
                <Zap size={20} className="text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-700 dark:text-blue-300">
                    OpenRouter API Integration
                  </h4>
                  <p className={`text-sm mt-1 ${isDarkMode ? 'text-blue-200' : 'text-blue-600'}`}>
                    Use AI to enhance, optimize, debug, and generate code automatically
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                OpenRouter API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-or-v1-..."
                className={`w-full px-3 py-2 border rounded-lg ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300'
                }`}
              />
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Your API key is stored locally and never shared
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleGetApiKey}
                className={`flex-1 p-3 rounded-lg border transition-all text-left ${
                  isDarkMode 
                    ? 'border-gray-600 hover:border-gray-500 hover:bg-gray-700' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Key size={16} className="text-green-500" />
                  <div>
                    <div className="font-medium text-sm">Get API Key</div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Free tier available
                    </div>
                  </div>
                </div>
              </button>

              <button
                onClick={handleSave}
                disabled={isSaving || !apiKey.trim()}
                className={`flex-1 p-3 rounded-lg transition-all ${
                  saveSuccess
                    ? 'bg-green-500 text-white'
                    : apiKey.trim()
                    ? 'bg-purple-500 hover:bg-purple-600 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center justify-center space-x-2">
                  {saveSuccess ? (
                    <>
                      <CheckCircle size={16} />
                      <span className="text-sm font-medium">Saved!</span>
                    </>
                  ) : isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm font-medium">Saving...</span>
                    </>
                  ) : (
                    <>
                      <Brain size={16} />
                      <span className="text-sm font-medium">Save & Activate</span>
                    </>
                  )}
                </div>
              </button>
            </div>

            {!apiKey.trim() && (
              <div className={`p-3 rounded-lg border ${
                isDarkMode 
                  ? 'border-yellow-800 bg-yellow-900/20 text-yellow-200' 
                  : 'border-yellow-200 bg-yellow-50 text-yellow-800'
              }`}>
                <div className="flex items-center space-x-2">
                  <AlertTriangle size={16} />
                  <span className="text-sm">
                    API key required to use AI features
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISettings;
