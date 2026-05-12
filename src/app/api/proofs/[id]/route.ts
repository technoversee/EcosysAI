import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { action } = (await req.json()) as { action: "approved" | "rejected" }

  const db = await getDb()
  const proof = (await db.execute({ sql: "SELECT * FROM proofs WHERE id = ?", args: [id] })).rows[0] as any
  if (!proof) {
    return NextResponse.json({ error: "Proof not found" }, { status: 404 })
  }

  if (proof.status !== "pending") {
    return NextResponse.json({ error: "Proof already reviewed" }, { status: 400 })
  }

  await db.execute({ sql: "UPDATE proofs SET status = ? WHERE id = ?", args: [action, id] })

  if (action === "approved") {
    const today = new Date().toISOString().split("T")[0]
    const alreadyBonus = (await db.execute({
      sql: "SELECT id FROM proofs WHERE user_id = ? AND status = 'approved' AND id != ? AND date(created_at) = ?",
      args: [proof.user_id, id, today],
    })).rows[0] as any

    if (!alreadyBonus) {
      await db.execute({ sql: "UPDATE users SET points = points + 5 WHERE id = ?", args: [proof.user_id] })
    }
  }

  return NextResponse.json({ id, status: action })
}
