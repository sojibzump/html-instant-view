
import { useState, useCallback, useRef } from 'react';
import { aiCodeService, AICodeResponse } from '../services/aiCodeService';

export const useAICodeAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AICodeResponse | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const analysisTimeoutRef = useRef<NodeJS.Timeout>();

  const analyzeCode = useCallback(async (code: string, language: 'html' | 'xml') => {
    if (!code.trim()) {
      setAnalysis(null);
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const result = await aiCodeService.analyzeCode(code, language);
      setAnalysis(result);
    } catch (error) {
      console.error('AI analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const debouncedAnalyze = useCallback((code: string, language: 'html' | 'xml') => {
    if (analysisTimeoutRef.current) {
      clearTimeout(analysisTimeoutRef.current);
    }

    analysisTimeoutRef.current = setTimeout(() => {
      analyzeCode(code, language);
    }, 2000); // Analyze after 2 seconds of inactivity
  }, [analyzeCode]);

  const getSuggestions = useCallback(async (
    code: string, 
    cursorPosition: { line: number; column: number }, 
    language: 'html' | 'xml'
  ) => {
    try {
      const result = await aiCodeService.getSuggestions(code, cursorPosition, language);
      setSuggestions(result);
      return result;
    } catch (error) {
      console.error('AI suggestions failed:', error);
      return [];
    }
  }, []);

  const clearAnalysis = useCallback(() => {
    setAnalysis(null);
    setSuggestions([]);
    if (analysisTimeoutRef.current) {
      clearTimeout(analysisTimeoutRef.current);
    }
  }, []);

  return {
    isAnalyzing,
    analysis,
    suggestions,
    analyzeCode: debouncedAnalyze,
    getSuggestions,
    clearAnalysis
  };
};
