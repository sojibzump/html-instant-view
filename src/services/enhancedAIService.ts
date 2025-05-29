
import { aiCodeService, ChatMessage } from './aiCodeService';

export interface AIModel {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  isAvailable: boolean;
}

export interface EnhancedCodeSuggestion {
  code: string;
  explanation: string;
  confidence: number;
  model: string;
  autoCloseTags: boolean;
  syntaxHighlight: boolean;
}

export class EnhancedAIService {
  private models: AIModel[] = [
    {
      id: 'deepseek',
      name: 'DeepSeek V3',
      description: 'Advanced coding assistant with superior code generation',
      capabilities: ['code_generation', 'debugging', 'optimization', 'explanation'],
      isAvailable: true
    },
    {
      id: 'olympic-coder',
      name: 'OlympicCoder',
      description: 'Specialized in competitive programming and algorithms',
      capabilities: ['algorithms', 'optimization', 'problem_solving'],
      isAvailable: true
    },
    {
      id: 'qwen2.5',
      name: 'Qwen2.5-Coder',
      description: 'Multi-language coding support with high accuracy',
      capabilities: ['multi_language', 'code_review', 'refactoring'],
      isAvailable: true
    }
  ];

  async generateCodeWithMultipleModels(
    prompt: string, 
    language: 'html' | 'css' | 'javascript' | 'xml'
  ): Promise<EnhancedCodeSuggestion[]> {
    const suggestions: EnhancedCodeSuggestion[] = [];
    
    try {
      // Primary model (DeepSeek V3)
      const primaryCode = await aiCodeService.generateCodeWithDeepSeek(prompt, language);
      if (primaryCode) {
        suggestions.push({
          code: this.addAutoClosingTags(primaryCode, language),
          explanation: 'Generated with DeepSeek V3 - optimized for clean, production-ready code',
          confidence: 0.95,
          model: 'DeepSeek V3',
          autoCloseTags: true,
          syntaxHighlight: true
        });
      }

      // Alternative suggestions from other models could be added here
      // For now, we'll enhance the primary suggestion
      
    } catch (error) {
      console.error('Enhanced AI code generation failed:', error);
    }

    return suggestions;
  }

  async chatWithEnhancedAI(
    messages: ChatMessage[], 
    currentCode?: string,
    preferredModel?: string
  ): Promise<string> {
    try {
      // Use the preferred model or default to DeepSeek
      const modelId = preferredModel || 'deepseek';
      
      // Add context about available models and capabilities
      const enhancedMessages = [
        {
          id: 'system',
          role: 'system' as const,
          content: `You are an advanced AI coding assistant similar to Microsoft Copilot. You have access to multiple AI models and should provide the most accurate, helpful responses possible. Focus on clean, production-ready code with proper error handling and best practices.`,
          timestamp: new Date()
        },
        ...messages
      ];

      return await aiCodeService.chatWithDeepSeek(enhancedMessages, currentCode);
    } catch (error) {
      console.error('Enhanced AI chat failed:', error);
      return 'I apologize, but I encountered an error. Please try again. The AI service may be temporarily unavailable.';
    }
  }

  private addAutoClosingTags(code: string, language: string): string {
    if (language === 'html' || language === 'xml') {
      // Simple auto-closing tag logic
      const openTags = code.match(/<(\w+)(?:\s+[^>]*)?>/g) || [];
      const closeTags = code.match(/<\/(\w+)>/g) || [];
      
      const openTagNames = openTags.map(tag => {
        const match = tag.match(/<(\w+)/);
        return match ? match[1] : '';
      }).filter(Boolean);
      
      const closeTagNames = closeTags.map(tag => {
        const match = tag.match(/<\/(\w+)>/);
        return match ? match[1] : '';
      }).filter(Boolean);

      // Add missing closing tags
      const missingTags = openTagNames.filter(tag => 
        !closeTagNames.includes(tag) && 
        !['img', 'br', 'hr', 'input', 'meta', 'link'].includes(tag.toLowerCase())
      );

      if (missingTags.length > 0) {
        const closingTags = missingTags.reverse().map(tag => `</${tag}>`).join('\n');
        return code + '\n' + closingTags;
      }
    }
    
    return code;
  }

  getAvailableModels(): AIModel[] {
    return this.models.filter(model => model.isAvailable);
  }

  async analyzeCodeQuality(code: string, language: string): Promise<{
    score: number;
    suggestions: string[];
    issues: string[];
  }> {
    try {
      const analysis = await aiCodeService.analyzeCode(code, language as 'html' | 'xml');
      
      return {
        score: analysis ? Math.max(0, 100 - (analysis.errors.length * 10)) : 50,
        suggestions: analysis?.suggestions || [],
        issues: analysis?.errors.map(error => error.message) || []
      };
    } catch (error) {
      console.error('Code quality analysis failed:', error);
      return {
        score: 50,
        suggestions: [],
        issues: ['Unable to analyze code quality']
      };
    }
  }
}

export const enhancedAIService = new EnhancedAIService();
