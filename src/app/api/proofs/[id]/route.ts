import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { action } = (await req.json()) as { action: "approved" | "rejected" }

  const db = getDb()
  const proof = db.prepare("SELECT * FROM proofs WHERE id = ?").get(id) as any
  if (!proof) {
    return NextResponse.json({ error: "Proof not found" }, { status: 404 })
  }

  if (proof.status !== "pending") {
    return NextResponse.json({ error: "Proof already reviewed" }, { status: 400 })
  }

  db.prepare("UPDATE proofs SET status = ? WHERE id = ?").run(action, id)

  if (action === "approved") {
    const today = new Date().toISOString().split("T")[0]
    const alreadyBonus = db
      .prepare(
        "SELECT id FROM proofs WHERE user_id = ? AND status = 'approved' AND id != ? AND date(created_at) = ?"
      )
      .get(proof.user_id, id, today) as any

    if (!alreadyBonus) {
      db.prepare("UPDATE users SET points = points + 5 WHERE id = ?").run(proof.user_id)
    }
  }

  return NextResponse.json({ id, status: action })
}
