import OpenAI from "openai"

const groq = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
})

export interface ClassificationResult {
  material: string
  confidence: number
  explanation: string
  category: string
  bin: string
  tips: string[]
}

export async function classifyWasteImage(imageBase64: string): Promise<ClassificationResult> {
  const response = await groq.chat.completions.create({
    model: "llama-3.2-90b-vision-preview",
    messages: [
      {
        role: "system",
        content: `You are a waste classification assistant. Given an image, identify the waste material and provide disposal guidance. Respond ONLY with a JSON object:
{
  "material": "Plastic" | "Metal" | "Glass" | "Paper" | "Food Waste",
  "confidence": 0.0-1.0,
  "explanation": "brief reason for classification",
  "category": "Recyclable" | "Compostable" | "Landfill",
  "bin": "Blue Bin" | "Green Bin" | "Black Bin",
  "tips": ["tip 1", "tip 2", "tip 3"]
}

For Plastic, Metal, Glass, Paper use category "Recyclable" and bin "Blue Bin".
For Food Waste use category "Compostable" and bin "Green Bin".
Provide 3-4 practical disposal tips specific to that material.`,
      },
      {
        role: "user",
        content: [
          { type: "text", text: "Identify this waste item and tell me how to dispose of it properly." },
          { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } },
        ],
      },
    ],
    max_tokens: 400,
    temperature: 0.1,
  })

  const text = response.choices[0]?.message?.content || "{}"
  const cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim()

  try {
    const parsed = JSON.parse(cleaned) as ClassificationResult
    return {
      ...parsed,
      tips: parsed.tips || [],
    }
  } catch {
    return {
      material: "Unknown",
      confidence: 0,
      explanation: "Failed to parse AI response",
      category: "Unknown",
      bin: "General Waste",
      tips: ["Please try again with a clearer image"],
    }
  }
}
