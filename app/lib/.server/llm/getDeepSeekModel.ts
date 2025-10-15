import OpenAI from "openai";

/**
 * מחזיר אינסטנס של מודל DeepSeek דרך OpenRouter
 */
export function getDeepSeekModel(apiKey: string) {
  const client = new OpenAI({
    apiKey,
    baseURL: "https://openrouter.ai/api/v1",
  });

  /**
   * פונקציה שמריצה את המודל בפועל (Chat Completion)
   */
  return async function runDeepSeek(prompt: string) {
    const response = await client.chat.completions.create({
      model: "deepseek/deepseek-chat-v3.1:free",
      messages: [
        { role: "system", content: "You are an AI website builder assistant." },
        { role: "user", content: prompt },
      ],
    });

    // נחזיר את התשובה של המודל
    return response.choices[0]?.message?.content || "";
  };
}
