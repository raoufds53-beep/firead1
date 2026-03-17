interface ChatCompletionRequest {
  model: string;
  messages: Array<{
    role: "system" | "user" | "assistant";
    content: string;
  }>;
  temperature: number;
  max_tokens: number;
}

interface ChatCompletionResponse {
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
  }>;
}

export class AIChatbotService {
  private openaiApiKey: string | undefined;
  private geminiApiKey: string | undefined;
  private provider: "openai" | "gemini";

  constructor(
    provider: "openai" | "gemini" = "openai",
    openaiKey?: string,
    geminiKey?: string
  ) {
    this.provider = provider;
    this.openaiApiKey = openaiKey || process.env.OPENAI_API_KEY;
    this.geminiApiKey = geminiKey || process.env.GEMINI_API_KEY;
  }

  /**
   * System prompt for the financial resilience chatbot
   */
  private getSystemPrompt(): string {
    return `You are a helpful financial resilience advisor for an AI-powered climate finance system. Your role is to:
1. Provide financial guidance during weather-related emergencies
2. Explain risk alerts and recommended actions
3. Help users understand insurance options and EMI pause options
4. Guide users on wallet management and emergency savings
5. Provide clear, easy-to-understand explanations about climate risks

Always be empathetic, supportive, and practical. When discussing financial actions, explain both the benefits and considerations.
Provide localized advice based on the user's region when relevant.`;
  }

  /**
   * Get AI response using OpenAI API
   */
  private async getOpenAIResponse(userMessage: string, conversationHistory: string): Promise<string> {
    if (!this.openaiApiKey) {
      return this.getFallbackResponse(userMessage);
    }

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.openaiApiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: this.getSystemPrompt(),
            },
            {
              role: "user",
              content: userMessage,
            },
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        console.error("OpenAI API error:", response.statusText);
        return this.getFallbackResponse(userMessage);
      }

      const data: ChatCompletionResponse = await response.json();
      return data.choices[0]?.message?.content || this.getFallbackResponse(userMessage);
    } catch (error) {
      console.error("OpenAI API error:", error);
      return this.getFallbackResponse(userMessage);
    }
  }

  /**
   * Get AI response using Google Gemini API
   */
  private async getGeminiResponse(userMessage: string): Promise<string> {
    if (!this.geminiApiKey) {
      return this.getFallbackResponse(userMessage);
    }

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.geminiApiKey}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${this.getSystemPrompt()}\n\nUser: ${userMessage}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          },
        }),
      });

      if (!response.ok) {
        console.error("Gemini API error:", response.statusText);
        return this.getFallbackResponse(userMessage);
      }

      const data = await response.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
      return content || this.getFallbackResponse(userMessage);
    } catch (error) {
      console.error("Gemini API error:", error);
      return this.getFallbackResponse(userMessage);
    }
  }

  /**
   * Fallback responses when API is not available
   */
  private getFallbackResponse(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes("wallet") || lowerMessage.includes("balance")) {
      return "I can help you manage your wallet! You have two accounts:\n1. **Wallet Account**: For daily spending\n2. **Emergency Savings**: Protected account for emergencies\n\nYou can add funds to your wallet anytime. During high-risk situations, funds are automatically transferred to your emergency savings for protection.";
    }

    if (lowerMessage.includes("risk") || lowerMessage.includes("alert")) {
      return "Risk alerts are generated based on weather conditions in your area. When risk is detected:\n- **High Risk**: We automatically transfer funds and activate insurance\n- **Medium Risk**: We recommend reviewing your insurance coverage\n- **Low Risk**: Continue normal activities with monitoring\n\nEach alert explains the specific weather factors affecting you.";
    }

    if (lowerMessage.includes("insurance")) {
      return "We offer parametric insurance that automatically activates when risk conditions are met:\n- **Micro Insurance**: Small protection for everyday risks\n- **Crop Protection**: For agricultural risks\n- **Property Insurance**: For property damage risks\n- **Personal Insurance**: For health and wellbeing during emergencies\n\nInsurance is triggered automatically based on risk levels.";
    }

    if (lowerMessage.includes("emi") || lowerMessage.includes("loan")) {
      return "EMI (Equated Monthly Installment) pause feature allows you to temporarily pause loan payments during emergencies:\n- During **High Risk** situations, you can pause EMI for up to 3-6 months\n- This manual or automatic, based on risk level\n- Your loan tenure adjusts accordingly\n- No penalties are applied for EMI pause during verified emergencies";
    }

    if (lowerMessage.includes("transfer")) {
      return "Smart Fund Transfer System:\n- During **High Risk**, funds automatically transfer from Wallet to Emergency Savings\n- This protects your savings while keeping spending money available\n- Transfers are instant and recorded in your transaction history\n- You can manually transfer funds anytime";
    }

    return "I'm here to help with your financial resilience! I can answer questions about:\n- Managing your wallet and savings accounts\n- Understanding risk alerts and weather impacts\n- Insurance options and activation\n- EMI pause features\n- Fund transfers during emergencies\n- Financial planning for climate risks\n\nWhat would you like to know?";
  }

  /**
   * Get chat response from AI
   */
  async getChatResponse(userMessage: string, conversationHistory: string = ""): Promise<string> {
    if (this.provider === "openai") {
      return this.getOpenAIResponse(userMessage, conversationHistory);
    } else {
      return this.getGeminiResponse(userMessage);
    }
  }

  /**
   * Analyze user message for intent and provide quick response if needed
   */
  analyzeMessageIntent(message: string): "financial" | "risk" | "insurance" | "emi" | "general" {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes("wallet") || lowerMessage.includes("balance") || lowerMessage.includes("money")) {
      return "financial";
    }
    if (lowerMessage.includes("risk") || lowerMessage.includes("alert") || lowerMessage.includes("weather")) {
      return "risk";
    }
    if (lowerMessage.includes("insurance") || lowerMessage.includes("coverage")) {
      return "insurance";
    }
    if (lowerMessage.includes("emi") || lowerMessage.includes("loan") || lowerMessage.includes("payment")) {
      return "emi";
    }
    return "general";
  }
}

// Initialize with environment variables
export const aiChatbotService = new AIChatbotService(
  (process.env.AI_PROVIDER as "openai" | "gemini") || "openai"
);
