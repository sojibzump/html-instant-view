
import { useState, useCallback } from 'react';
import { aiCodeService, ChatMessage } from '../services/aiCodeService';

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
      const response = await aiCodeService.chatWithDeepSeek([...messages, userMessage], currentCode);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again. The AI service might be temporarily unavailable.',
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
      const code = await aiCodeService.generateCodeWithDeepSeek(prompt, language);
      
      // Add success message to chat
      const successMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `✅ Generated ${language.toUpperCase()} code successfully! The code has been automatically pasted into your editor.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, successMessage]);
      
      return code;
    } catch (error) {
      console.error('Code generation error:', error);
      
      // Add error message to chat
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `❌ Failed to generate ${language.toUpperCase()} code. Please try again with a more specific prompt.`,
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
