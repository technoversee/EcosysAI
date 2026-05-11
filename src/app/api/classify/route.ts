import { NextRequest, NextResponse } from "next/server"
import { classifyWasteImage } from "@/lib/groq"
import { getDb } from "@/lib/db"
import { auth } from "@/lib/auth"

const POINTS = { Plastic: 10, Metal: 5, Glass: 5, Paper: 3, "Food Waste": 2 } as Record<string, number>

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("image") as File | null
    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString("base64")
    const dataUri = `data:${file.type};base64,${base64}`

    const result = await classifyWasteImage(base64)

    const db = getDb()
    const scanId = crypto.randomUUID()
    const pts = POINTS[result.material] || 0

    // Save scan WITHOUT awarding points yet — user must confirm disposal first
    db.prepare(
      "INSERT INTO scans (id, user_id, material, confidence, points_awarded, image_data, confirmed) VALUES (?, ?, ?, ?, ?, ?, 0)"
    ).run(scanId, session.user.id, result.material, result.confidence, pts, base64.slice(0, 2000))

    return NextResponse.json({
      scanId,
      material: result.material,
      confidence: result.confidence,
      explanation: result.explanation,
      category: result.category,
      bin: result.bin,
      tips: result.tips,
      pointsAwarded: pts,
      image: dataUri,
    })
  } catch (err) {
    console.error("Classify error:", err)
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: "Classification failed", detail: msg }, { status: 500 })
  }
}
