
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
export type { AICodeResponse };
