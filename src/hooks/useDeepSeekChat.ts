
import { useState, useCallback } from 'react';
import { enhancedAIService } from '../services/enhancedAIService';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export const useDeepSeekChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (content: string, currentCode?: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await enhancedAIService.chatWithEnhancedAI([...messages, userMessage], currentCode);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Enhanced chat error:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '🚨 Sorry, I encountered an error. Please try again. The AI Copilot service might be temporarily unavailable.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const generateCode = useCallback(async (prompt: string, language: 'html' | 'css' | 'javascript' | 'xml') => {
    setIsLoading(true);
    try {
      const suggestions = await enhancedAIService.generateCodeWithMultipleModels(prompt, language);
      
      if (suggestions.length > 0) {
        const bestSuggestion = suggestions[0];
        
        // Add success message to chat
        const successMessage: ChatMessage = {
          id: Date.now().toString(),
          role: 'assistant',
          content: `✅ Generated ${language.toUpperCase()} code successfully!\n\n**Model:** ${bestSuggestion.model}\n**Confidence:** ${Math.round(bestSuggestion.confidence * 100)}%\n**Features:** Auto-closing tags ${bestSuggestion.autoCloseTags ? '✅' : '❌'}\n\nThe code has been automatically pasted into your editor.`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, successMessage]);
        
        return bestSuggestion.code;
      }
      
      return '';
    } catch (error) {
      console.error('Enhanced code generation error:', error);
      
      // Add error message to chat
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `❌ Failed to generate ${language.toUpperCase()} code. Please try again with a more specific prompt.\n\n**Tip:** Try describing exactly what you want, including styling and functionality details.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      
      return '';
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    generateCode,
    clearChat
  };
};
