import OpenAI from "openai"

const groq = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
})

export interface ClassificationResult {
  material: string
  confidence: number
  explanation: string
}

export async function classifyWasteImage(imageBase64: string): Promise<ClassificationResult> {
  const response = await groq.chat.completions.create({
    model: "llama-3.2-90b-vision-preview",
    messages: [
      {
        role: "system",
        content: `You are a waste classification assistant. Given an image, identify the waste material. Respond ONLY with a JSON object:
{
  "material": "Plastic" | "Metal" | "Glass" | "Paper" | "Food Waste",
  "confidence": 0.0-1.0,
  "explanation": "brief reason for classification"
}`,
      },
      {
        role: "user",
        content: [
          { type: "text", text: "What material is this waste item?" },
          { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } },
        ],
      },
    ],
    max_tokens: 200,
    temperature: 0.1,
  })

  const text = response.choices[0]?.message?.content || "{}"
  const cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim()

  try {
    return JSON.parse(cleaned) as ClassificationResult
  } catch {
    return { material: "Unknown", confidence: 0, explanation: "Failed to parse AI response" }
  }
}
