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

    const db = getDb()
    const scan = db.prepare("SELECT * FROM scans WHERE id = ? AND user_id = ?").get(scanId, session.user.id) as any
    if (!scan) {
      return NextResponse.json({ error: "Scan not found" }, { status: 404 })
    }
    if (scan.confirmed) {
      return NextResponse.json({ error: "Already confirmed" }, { status: 400 })
    }

    // Award the points
    db.prepare("UPDATE scans SET confirmed = 1 WHERE id = ?").run(scanId)
    db.prepare("UPDATE users SET points = points + ? WHERE id = ?").run(scan.points_awarded, session.user.id)

    const user = db.prepare("SELECT points FROM users WHERE id = ?").get(session.user.id) as any

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
