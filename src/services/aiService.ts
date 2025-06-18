
interface OpenRouterResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
  error?: {
    message: string;
    code: string;
  };
}

interface AIEnhancementRequest {
  code: string;
  task: 'optimize' | 'explain' | 'debug' | 'enhance' | 'convert';
  language?: string;
}

export class AIService {
  private static instance: AIService;
  private apiKey: string = '';
  private requestCache: Map<string, { response: string; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private constructor() {
    // Load API key from localStorage
    this.loadApiKey();
  }

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  private loadApiKey(): void {
    try {
      this.apiKey = localStorage.getItem('openrouter-api-key') || '';
    } catch (error) {
      console.warn('Failed to load API key from localStorage:', error);
      this.apiKey = '';
    }
  }

  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
    try {
      localStorage.setItem('openrouter-api-key', apiKey);
    } catch (error) {
      console.warn('Failed to save API key to localStorage:', error);
    }
  }

  getApiKey(): string {
    return this.apiKey;
  }

  hasApiKey(): boolean {
    return this.apiKey.length > 0 && this.apiKey.startsWith('sk-or-v1-');
  }

  private getCacheKey(content: string, task?: string): string {
    return `${task || 'generate'}-${content.slice(0, 100)}`;
  }

  private getCachedResponse(cacheKey: string): string | null {
    const cached = this.requestCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.response;
    }
    if (cached) {
      this.requestCache.delete(cacheKey);
    }
    return null;
  }

  private setCachedResponse(cacheKey: string, response: string): void {
    this.requestCache.set(cacheKey, {
      response,
      timestamp: Date.now()
    });

    // Clean up old cache entries
    if (this.requestCache.size > 50) {
      const oldestKey = Array.from(this.requestCache.keys())[0];
      this.requestCache.delete(oldestKey);
    }
  }

  private async makeRequest(messages: any[], maxTokens: number = 2000): Promise<string> {
    if (!this.hasApiKey()) {
      throw new Error('Valid OpenRouter API key is required. Please check your API key format.');
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'HTML Editor AI Assistant'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.1-8b-instruct:free',
        messages,
        temperature: 0.7,
        max_tokens: maxTokens,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1
      })
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your OpenRouter API key.');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      } else if (response.status === 402) {
        throw new Error('Insufficient credits. Please add credits to your OpenRouter account.');
      } else {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
    }

    const data: OpenRouterResponse = await response.json();
    
    if (data.error) {
      throw new Error(`OpenRouter Error: ${data.error.message}`);
    }

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('No response received from AI service');
    }

    return content;
  }

  async enhanceCode(request: AIEnhancementRequest): Promise<string> {
    const cacheKey = this.getCacheKey(request.code, request.task);
    const cachedResponse = this.getCachedResponse(cacheKey);
    
    if (cachedResponse) {
      return cachedResponse;
    }

    const prompts = {
      optimize: `Optimize this ${request.language || 'HTML'} code for better performance, accessibility, and SEO. Return ONLY the optimized code without any explanations or comments.\n\nCode:\n${request.code}`,
      
      explain: `Explain this ${request.language || 'HTML'} code in a clear, beginner-friendly way. Include:\n- What the code does\n- Key features and functionality\n- How different parts work together\n- Any notable techniques used\n\nCode:\n${request.code}`,
      
      debug: `Analyze this ${request.language || 'HTML'} code and return the fixed version. Return ONLY the corrected code without explanations.\n\nCode:\n${request.code}`,
      
      enhance: `Enhance this ${request.language || 'HTML'} code with modern features. Return ONLY the enhanced code without explanations.\n\nCode:\n${request.code}`,
      
      convert: `Convert and modernize this ${request.language || 'HTML'} code. Return ONLY the converted code without explanations.\n\nCode:\n${request.code}`
    };

    try {
      const messages = [
        {
          role: 'system',
          content: request.task === 'explain' 
            ? 'You are an expert web developer. Provide clear explanations of code functionality.' 
            : 'You are an expert web developer. Return ONLY clean, optimized code without any explanations, comments, or additional text. No markdown formatting.'
        },
        {
          role: 'user',
          content: prompts[request.task]
        }
      ];

      const response = await this.makeRequest(messages, 3000);
      this.setCachedResponse(cacheKey, response);
      return response;
    } catch (error) {
      console.error('AI Enhancement Error:', error);
      throw error;
    }
  }

  async generateCode(prompt: string): Promise<string> {
    const cacheKey = this.getCacheKey(prompt);
    const cachedResponse = this.getCachedResponse(cacheKey);
    
    if (cachedResponse) {
      return cachedResponse;
    }

    try {
      const messages = [
        {
          role: 'system',
          content: 'You are a skilled web developer. Generate clean, modern, and responsive HTML/CSS/JavaScript code. Return ONLY the code without any explanations, comments, or markdown formatting.'
        },
        {
          role: 'user',
          content: prompt
        }
      ];

      const response = await this.makeRequest(messages, 4000);
      this.setCachedResponse(cacheKey, response);
      return response;
    } catch (error) {
      console.error('AI Generation Error:', error);
      throw error;
    }
  }

  async quickSuggestion(code: string): Promise<string> {
    const cacheKey = this.getCacheKey(code, 'quick');
    const cachedResponse = this.getCachedResponse(cacheKey);
    
    if (cachedResponse) {
      return cachedResponse;
    }

    try {
      const messages = [
        {
          role: 'system',
          content: 'Provide a quick suggestion to improve this code. Be concise but helpful.'
        },
        {
          role: 'user',
          content: `Suggest one quick improvement for this code:\n${code.slice(0, 1000)}`
        }
      ];

      const response = await this.makeRequest(messages, 500);
      this.setCachedResponse(cacheKey, response);
      return response;
    } catch (error) {
      console.error('AI Quick Suggestion Error:', error);
      throw error;
    }
  }

  clearCache(): void {
    this.requestCache.clear();
  }
}

export const aiService = AIService.getInstance();
