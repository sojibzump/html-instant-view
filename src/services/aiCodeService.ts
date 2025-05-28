interface AICodeResponse {
  suggestions: string[];
  errors: Array<{
    line: number;
    column: number;
    message: string;
    severity: 'error' | 'warning' | 'info';
  }>;
  corrections: Array<{
    line: number;
    original: string;
    corrected: string;
    reason: string;
  }>;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

class AICodeService {
  private olympicCoderKey = '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';
  private qwenKey = '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';
  private deepSeekKey = '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';
  private baseUrl = 'https://openrouter.ai/api/v1/chat/completions';

  private async makeAPICall(apiKey: string, model: string, prompt: string): Promise<string> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content: 'You are an expert code analyzer. Provide concise, actionable feedback in JSON format.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
      }

      const data: OpenRouterResponse = await response.json();
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('API call error:', error);
      return '';
    }
  }

  private async makeChatAPICall(apiKey: string, model: string, messages: any[]): Promise<string> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
      }

      const data: OpenRouterResponse = await response.json();
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('API call error:', error);
      return '';
    }
  }

  async analyzeCode(code: string, language: 'html' | 'xml'): Promise<AICodeResponse> {
    const prompt = `Analyze this ${language} code for errors, improvements, and provide suggestions:

\`\`\`${language}
${code}
\`\`\`

Respond with a JSON object containing:
- suggestions: array of improvement suggestions
- errors: array of {line, column, message, severity} objects
- corrections: array of {line, original, corrected, reason} objects

Keep responses concise and focus on critical issues.`;

    try {
      // Use OlympicCoder for primary analysis
      const olympicResponse = await this.makeAPICall(
        this.olympicCoderKey,
        'open-r1/olympiccoder-32b:free',
        prompt
      );

      // Use Qwen for additional analysis
      const qwenResponse = await this.makeAPICall(
        this.qwenKey,
        'qwen/qwen-2.5-coder-32b-instruct:free',
        prompt
      );

      // Parse and combine responses
      const olympicData = this.parseResponse(olympicResponse);
      const qwenData = this.parseResponse(qwenResponse);

      return this.combineAnalysis(olympicData, qwenData);
    } catch (error) {
      console.error('Code analysis error:', error);
      return {
        suggestions: [],
        errors: [],
        corrections: []
      };
    }
  }

  async chatWithDeepSeek(messages: ChatMessage[], currentCode?: string): Promise<string> {
    const systemPrompt = `You are DeepSeek V3, an advanced AI coding assistant similar to bolt.new. You can:
1. Analyze and improve existing code
2. Generate new code from scratch
3. Debug and fix issues
4. Provide coding suggestions and best practices
5. Help with HTML, CSS, JavaScript, and other web technologies

${currentCode ? `Current code context:\n\`\`\`\n${currentCode}\n\`\`\`` : ''}

Be helpful, concise, and provide practical solutions. If generating code, make it production-ready and well-commented.`;

    const chatMessages = [
      {
        role: 'system',
        content: systemPrompt
      },
      ...messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    try {
      const response = await this.makeChatAPICall(
        this.deepSeekKey,
        'deepseek/deepseek-chat-v3-0324:free',
        chatMessages
      );

      return response;
    } catch (error) {
      console.error('DeepSeek chat error:', error);
      return 'Sorry, I encountered an error. Please try again.';
    }
  }

  async generateCodeWithDeepSeek(prompt: string, language: 'html' | 'css' | 'javascript' | 'xml'): Promise<string> {
    const systemPrompt = `You are a code generation expert. Generate clean, production-ready ${language} code based on the user's requirements. 
    
Provide only the code without explanations unless specifically asked. Make sure the code is:
- Well-structured and readable
- Follows best practices
- Includes necessary comments
- Is ready to use immediately`;

    try {
      const response = await this.makeChatAPICall(
        this.deepSeekKey,
        'deepseek/deepseek-chat-v3-0324:free',
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ]
      );

      return response;
    } catch (error) {
      console.error('DeepSeek code generation error:', error);
      return '';
    }
  }

  private parseResponse(response: string): Partial<AICodeResponse> {
    try {
      // Try to extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return {};
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      return {};
    }
  }

  private combineAnalysis(olympic: Partial<AICodeResponse>, qwen: Partial<AICodeResponse>): AICodeResponse {
    return {
      suggestions: [
        ...(olympic.suggestions || []),
        ...(qwen.suggestions || [])
      ].slice(0, 10), // Limit to top 10 suggestions
      errors: [
        ...(olympic.errors || []),
        ...(qwen.errors || [])
      ].filter((error, index, arr) => 
        arr.findIndex(e => e.line === error.line && e.message === error.message) === index
      ), // Remove duplicates
      corrections: [
        ...(olympic.corrections || []),
        ...(qwen.corrections || [])
      ].slice(0, 5) // Limit to top 5 corrections
    };
  }

  async getSuggestions(code: string, cursorPosition: { line: number; column: number }, language: 'html' | 'xml'): Promise<string[]> {
    const prompt = `Provide code completion suggestions for this ${language} code at line ${cursorPosition.line}, column ${cursorPosition.column}:

\`\`\`${language}
${code}
\`\`\`

Return only an array of completion suggestions as JSON, focusing on the current context.`;

    try {
      const response = await this.makeAPICall(
        this.olympicCoderKey,
        'open-r1/olympiccoder-32b:free',
        prompt
      );

      const parsed = this.parseResponse(response);
      return Array.isArray(parsed) ? parsed : parsed.suggestions || [];
    } catch (error) {
      console.error('Suggestions error:', error);
      return [];
    }
  }
}

export const aiCodeService = new AICodeService();
export type { AICodeResponse, ChatMessage };
