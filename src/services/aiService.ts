
interface OpenRouterResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

interface AIEnhancementRequest {
  code: string;
  task: 'optimize' | 'explain' | 'debug' | 'enhance' | 'convert';
  language?: string;
}

export class AIService {
  private static instance: AIService;
  private apiKey: string = '';

  private constructor() {
    // Load API key from localStorage
    this.apiKey = localStorage.getItem('openrouter-api-key') || '';
  }

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
    localStorage.setItem('openrouter-api-key', apiKey);
  }

  getApiKey(): string {
    return this.apiKey;
  }

  hasApiKey(): boolean {
    return this.apiKey.length > 0;
  }

  async enhanceCode(request: AIEnhancementRequest): Promise<string> {
    if (!this.hasApiKey()) {
      throw new Error('OpenRouter API key is required');
    }

    const prompts = {
      optimize: `Optimize this ${request.language || 'HTML'} code for better performance and readability:\n\n${request.code}`,
      explain: `Explain what this ${request.language || 'HTML'} code does in simple terms:\n\n${request.code}`,
      debug: `Find and fix any issues in this ${request.language || 'HTML'} code:\n\n${request.code}`,
      enhance: `Enhance this ${request.language || 'HTML'} code with modern best practices and features:\n\n${request.code}`,
      convert: `Convert this code to modern ${request.language || 'HTML'} with better structure:\n\n${request.code}`
    };

    try {
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
          messages: [
            {
              role: 'system',
              content: 'You are a helpful web development assistant. Provide clean, optimized code and clear explanations.'
            },
            {
              role: 'user',
              content: prompts[request.task]
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data: OpenRouterResponse = await response.json();
      return data.choices[0]?.message?.content || 'No response from AI';
    } catch (error) {
      console.error('AI Service Error:', error);
      throw error;
    }
  }

  async generateCode(prompt: string): Promise<string> {
    if (!this.hasApiKey()) {
      throw new Error('OpenRouter API key is required');
    }

    try {
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
          messages: [
            {
              role: 'system',
              content: 'You are a web development assistant. Generate clean, modern HTML/CSS/JavaScript code based on user requests. Only return the code, no explanations unless asked.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.8,
          max_tokens: 3000
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data: OpenRouterResponse = await response.json();
      return data.choices[0]?.message?.content || 'No response from AI';
    } catch (error) {
      console.error('AI Service Error:', error);
      throw error;
    }
  }
}

export const aiService = AIService.getInstance();
