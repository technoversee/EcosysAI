import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function GET() {
  const proofs = getDb()
    .prepare(
      `SELECT p.id, p.user_id, u.name AS user_name, p.status, p.created_at
       FROM proofs p
       JOIN users u ON u.id = p.user_id
       ORDER BY p.created_at DESC
       LIMIT 50`
    )
    .all() as { id: string; user_id: string; user_name: string; status: string; created_at: string }[]

  return NextResponse.json({ proofs })
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const today = new Date().toISOString().split("T")[0]
  const db = getDb()
  const existing = db
    .prepare("SELECT id FROM proofs WHERE user_id = ? AND date(created_at) = ?")
    .get(session.user.id, today) as any

  if (existing) {
    return NextResponse.json({ error: "Already submitted a proof today" }, { status: 400 })
  }

  const formData = await req.formData()
  const scanId = formData.get("scanId") as string
  const file = formData.get("image") as File | null

  const id = crypto.randomUUID()
  db.prepare(
    "INSERT INTO proofs (id, user_id, scan_id, image_data, status) VALUES (?, ?, ?, ?, 'pending')"
  ).run(id, session.user.id, scanId || null, file ? `photo_${id}` : null)

  return NextResponse.json({ id, status: "pending" })
}
