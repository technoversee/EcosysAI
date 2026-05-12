import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { scanId } = await req.json()
    if (!scanId) {
      return NextResponse.json({ error: "Missing scanId" }, { status: 400 })
    }

    const db = await getDb()
    const scan = (await db.execute({ sql: "SELECT * FROM scans WHERE id = ? AND user_id = ?", args: [scanId, session.user.id] })).rows[0] as any
    if (!scan) {
      return NextResponse.json({ error: "Scan not found" }, { status: 404 })
    }
    if (scan.confirmed) {
      return NextResponse.json({ error: "Already confirmed" }, { status: 400 })
    }

    // Award the points
    await db.execute({ sql: "UPDATE scans SET confirmed = 1 WHERE id = ?", args: [scanId] })
    await db.execute({ sql: "UPDATE users SET points = points + ? WHERE id = ?", args: [scan.points_awarded, session.user.id] })

    const user = (await db.execute({ sql: "SELECT points FROM users WHERE id = ?", args: [session.user.id] })).rows[0] as any

    return NextResponse.json({
      success: true,
      pointsAwarded: scan.points_awarded,
      totalPoints: user?.points || 0,
      material: scan.material,
    })
  } catch (err) {
    console.error("Confirm error:", err)
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: "Confirmation failed", detail: msg }, { status: 500 })
  }
}
