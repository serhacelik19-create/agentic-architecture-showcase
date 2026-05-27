import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || "";

// Instantiate the SDK client
let genAI: GoogleGenerativeAI | null = null;
if (apiKey && !apiKey.startsWith("YOUR_")) {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
  } catch (error) {
    console.error("Failed to initialize GoogleGenerativeAI client:", error);
  }
}

/**
 * Tone-specific temperature mapping.
 * Lower = more focused/professional, Higher = more creative/warm.
 */
const TONE_TEMPERATURE: Record<string, number> = {
  professional: 0.4,
  empathetic: 0.65,
  friendly: 0.7,
  persuasive: 0.75,
};

/**
 * Generates an automated customer service reply draft based on conversation context.
 * Automatically detects the customer's language and responds accordingly.
 *
 * @param history Array of previous messages in the conversation
 * @param customerName Name of the customer for personalized drafts
 * @param tone Tone modifier ("professional", "empathetic", "friendly", "persuasive")
 */
export async function generateDraftReply(
  history: { sender: string; content: string }[],
  customerName: string,
  tone: string = "friendly"
): Promise<string> {
  if (!genAI) {
    return `[AI Offline] Could not generate draft reply for customer ${customerName}. Please check your GEMINI_API_KEY setting.`;
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-3.5-flash",
      systemInstruction: `You are a professional AI Customer Support Assistant helping a human support agent.
Your task is to generate a high-quality, natural DRAFT REPLY that the agent can review and send.

## CRITICAL RULES
1. **LANGUAGE**: Detect the language of the customer's LAST message and write the draft reply absolutely in the SAME language. If the customer wrote in Turkish, reply in Turkish. If they wrote in English, reply in English. Language matching is extremely critical.
2. **FORMAT**: Write only plain text. Do NOT use markdown bold, lists, headings, or any other formatting. Do NOT output any structural labels, bullet points, meta-headers, or section headers (e.g., do NOT write "Greeting:", "Draft Reply:", or "Refining constraints"). Write only a single natural, continuous conversational paragraph.
3. **LENGTH**: 1-2 complete sentences. Keep it extremely concise, brief, and directly focused.
4. **CONTENT**: Directly address the customer's last question/request. Do NOT make up any false information. For complex issues, state that you are looking into it.
5. **PERSONALIZATION**: Address the customer by their name: ${customerName}
6. **COMPLETENESS**: The response MUST be grammatically complete and end with proper punctuation (such as a period, exclamation mark, or question mark). Never end abruptly or cut off in the middle.`,
    });

    // Build conversation context with clear role labels
    const conversationContext = history
      .map((msg) =>
        msg.sender === "customer"
          ? `[Customer - ${customerName}]: ${msg.content}`
          : `[Support Agent]: ${msg.content}`
      )
      .join("\n");

    // Detect the last customer message language for explicit instruction
    const lastCustomerMsg = [...history].reverse().find((m) => m.sender === "customer");
    const lastMsgContent = lastCustomerMsg?.content ?? "";

    const userPrompt = `You are replying to the customer named: ${customerName}
Write the reply in a "${tone}" tone.

## CONVERSATION HISTORY
${conversationContext}

## CUSTOMER'S LAST MESSAGE
"${lastMsgContent}"

Generate the draft reply now (start writing the response directly, with no intro or labels):`;

    const temperature = TONE_TEMPERATURE[tone] ?? 0.7;

    const apiCallPromise = model.generateContent({
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      generationConfig: {
        temperature,
        maxOutputTokens: 1024,
      },
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Gemini API call timed out (8s)")), 8000)
    );

    const result = await Promise.race([apiCallPromise, timeoutPromise]);

    const reply = result.response.text()?.trim() || "";
    console.log(`[GeminiService] Tone: ${tone} | Temp: ${temperature} | Output: "${reply}"`);

    // Clean up any stray quotes or markdown formatting
    return reply.replace(/^"|"$/g, "").replace(/\*\*/g, "").replace(/^#+\s*/gm, "").trim();
  } catch (error) {
    console.error("Error generating draft from Gemini API:", error);
    // Language-aware fallback: detect if last message was Turkish-like
    const lastMsg = [...history].reverse().find((m) => m.sender === "customer")?.content ?? "";
    const isTurkish = /[çğıöşüÇĞİÖŞÜ]/.test(lastMsg) || /\b(merhaba|selam|teşekkür|lütfen|yardım|sipariş|iade|iptal|hesap)\b/i.test(lastMsg);

    if (isTurkish) {
      return `Merhaba ${customerName}, destek ekibimize ulaştığınız için teşekkür ederiz. Talebinizi aldık ve en kısa sürede size geri dönüş yapacağız. Başka bir konuda yardımcı olabilir miyiz?`;
    }
    return `Hi ${customerName}, thank you for contacting support. I have received your request and am looking into this right away. How else can I assist you in the meantime?`;
  }
}
