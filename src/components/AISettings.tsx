
import React, { useState, useEffect } from 'react';
import { Brain, Key, X, CheckCircle, AlertTriangle, Zap, ExternalLink, Info } from 'lucide-react';
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
  const [apiKey, setApiKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isVisible) {
      setApiKey(aiService.getApiKey());
      setConnectionStatus('idle');
      setErrorMessage('');
      setSaveSuccess(false);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const testConnection = async () => {
    if (!apiKey.trim()) {
      setErrorMessage('Please enter an API key first');
      return;
    }

    setIsTestingConnection(true);
    setConnectionStatus('idle');
    setErrorMessage('');

    try {
      // Temporarily set the API key for testing
      const originalKey = aiService.getApiKey();
      aiService.setApiKey(apiKey.trim());

      await aiService.generateCode('Hello world in HTML');
      setConnectionStatus('success');
      
      // Restore original key if test was successful
      aiService.setApiKey(originalKey);
    } catch (error) {
      setConnectionStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Connection failed');
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSave = async () => {
    if (!apiKey.trim()) {
      setErrorMessage('Please enter a valid API key');
      return;
    }

    setIsSaving(true);
    setErrorMessage('');
    
    try {
      aiService.setApiKey(apiKey.trim());
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 1500);
    } catch (error) {
      setErrorMessage('Failed to save API key');
      console.error('Failed to save API key:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleGetApiKey = () => {
    window.open('https://openrouter.ai/keys', '_blank');
  };

  const isValidKey = apiKey.trim().startsWith('sk-or-v1-');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className={`relative max-w-lg w-full rounded-lg ${
        isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      }`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Brain size={20} className="text-purple-500" />
            <h3 className="font-semibold">🤖 AI Assistant Settings</h3>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            <X size={16} />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className={`p-4 rounded-lg border ${
            isDarkMode ? 'border-blue-800 bg-blue-900/20' : 'border-blue-200 bg-blue-50'
          }`}>
            <div className="flex items-start space-x-3">
              <Zap size={20} className="text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-700 dark:text-blue-300">
                  OpenRouter AI Integration
                </h4>
                <p className={`text-sm mt-1 ${isDarkMode ? 'text-blue-200' : 'text-blue-600'}`}>
                  Enhance, optimize, debug, and generate code with AI assistance
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                OpenRouter API Key
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => {
                    setApiKey(e.target.value);
                    setConnectionStatus('idle');
                    setErrorMessage('');
                  }}
                  placeholder="sk-or-v1-..."
                  className={`w-full px-3 py-2 pr-10 border rounded-lg transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  } ${
                    isValidKey 
                      ? 'border-green-500 focus:border-green-500' 
                      : apiKey.trim() 
                      ? 'border-red-500 focus:border-red-500'
                      : ''
                  }`}
                />
                {isValidKey && (
                  <CheckCircle size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" />
                )}
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Your API key is stored locally and never shared
                </p>
                {apiKey.trim() && (
                  <button
                    onClick={testConnection}
                    disabled={isTestingConnection || !isValidKey}
                    className={`text-xs px-2 py-1 rounded transition-colors ${
                      connectionStatus === 'success'
                        ? 'text-green-600 bg-green-100'
                        : connectionStatus === 'error'
                        ? 'text-red-600 bg-red-100'
                        : 'text-blue-600 hover:bg-blue-100'
                    } ${!isValidKey ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isTestingConnection ? 'Testing...' : 
                     connectionStatus === 'success' ? '✓ Connected' : 
                     connectionStatus === 'error' ? '✗ Failed' : 'Test Connection'}
                  </button>
                )}
              </div>
            </div>

            {errorMessage && (
              <div className={`p-3 rounded-lg border ${
                isDarkMode 
                  ? 'border-red-800 bg-red-900/20 text-red-200' 
                  : 'border-red-200 bg-red-50 text-red-800'
              }`}>
                <div className="flex items-center space-x-2">
                  <AlertTriangle size={16} />
                  <span className="text-sm">{errorMessage}</span>
                </div>
              </div>
            )}

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
                  <div className="flex-1">
                    <div className="font-medium text-sm">Get API Key</div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Free tier available
                    </div>
                  </div>
                  <ExternalLink size={14} className="opacity-50" />
                </div>
              </button>

              <button
                onClick={handleSave}
                disabled={isSaving || !isValidKey}
                className={`flex-1 p-3 rounded-lg transition-all ${
                  saveSuccess
                    ? 'bg-green-500 text-white'
                    : isValidKey
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

            <div className={`p-3 rounded-lg ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <div className="flex items-start space-x-2">
                <Info size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm space-y-1">
                  <p className="font-medium">How to get started:</p>
                  <ol className={`list-decimal list-inside space-y-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li>Click "Get API Key" to create your free OpenRouter account</li>
                    <li>Copy your API key and paste it above</li>
                    <li>Test the connection to verify it works</li>
                    <li>Save and start using AI features!</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISettings;
