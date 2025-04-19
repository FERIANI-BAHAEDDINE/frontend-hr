import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

// System prompt for HR assistant
const HR_SYSTEM_PROMPT = `
You are an expert HR assistant specializing in providing guidance on HR-related matters.
Your expertise includes:
1. Recruitment and hiring best practices
2. Employee onboarding and retention strategies
3. Performance management and evaluation
4. Workplace policies and compliance
5. Employee benefits and compensation
6. Training and development
7. Conflict resolution and employee relations

When responding to queries:
- Provide comprehensive, well-structured answers
- Include relevant examples when appropriate
- Cite best practices in the HR field
- Consider legal and ethical implications
- Tailor your advice to different company sizes and industries when relevant

Always maintain a professional, helpful tone while being conversational and approachable.
`

export async function generateChatResponse(userMessage: string) {
  try {
    // Generate response using Groq
    const response = await generateText({
      model: groq("llama3-70b-8192"),
      prompt: userMessage,
      system: HR_SYSTEM_PROMPT,
      temperature: 0.7,
      maxTokens: 1000,
    })

    return {
      role: "assistant",
      content: response.text,
    }
  } catch (error) {
    console.error("Error generating chat response:", error)
    throw new Error("Failed to generate response")
  }
}
