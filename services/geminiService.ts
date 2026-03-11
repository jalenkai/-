import { GoogleGenAI } from "@google/genai";
import { PromptInputs } from "../types";

const getSystemInstruction = () => `
You are an expert AI Prompt Engineer and Retail Consultant specializing in the Maternal & Child (Mom & Baby) industry. 
Your goal is to generate a highly effective, structured, and sophisticated "Meta-Prompt" for the user in Traditional Chinese (繁體中文).
The user will use YOUR output as a prompt for another LLM (like ChatGPT, Gemini, or Claude).

**Guidelines:**
1. **Language:** The generated meta-prompt explanations should be in Traditional Chinese. The prompt content itself (inside the code block) should be designed to produce results in Traditional Chinese unless specified otherwise.
2. **Structure:** The generated prompt should use techniques like "Persona Adoption" (e.g., "你是一位資深的母嬰專家..."), "Chain of Thought," and "Few-Shot Examples" if applicable.
3. **Industry Specificity:** Use terminology relevant to retail and parenting in Taiwan/Hong Kong (e.g., 坐月子, 發展里程碑, 安全標準, 親膚材質, 情感連結).
4. **Clarity:** The generated prompt must be clear, actionable, and robust against hallucinations.
5. **Format:** Output the prompt within a Markdown code block for easy copying.
6. **Tone:** The generated prompt should instruct the AI to be extremely helpful and aligned with the brand's voice.

**Output Format:**
Provide a brief analysis of the request (1 sentence in Traditional Chinese), followed immediately by the prompt inside a code block.
`;

export const generateMetaPrompt = async (inputs: PromptInputs): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please check your environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const userContent = `
    I need a robust prompt for the following scenario in the Baby Retail sector (Traditional Chinese Context):
    
    - **Role:** ${inputs.role.replace('_', ' ')}
    - **Task:** ${inputs.task}
    - **Product/Context:** ${inputs.productInfo}
    - **Target Audience:** ${inputs.targetAudience}
    - **Desired Tone:** ${inputs.tone}
    - **Constraints/Key Points:** ${inputs.constraints}
    
    Please write a comprehensive system prompt (in Traditional Chinese) that I can paste into an AI to get the best possible result for this task.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userContent,
      config: {
        systemInstruction: getSystemInstruction(),
        temperature: 0.7,
      }
    });

    return response.text || "無法生成提示詞，請重試。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};