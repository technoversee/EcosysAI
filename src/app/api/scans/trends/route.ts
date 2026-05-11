import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const range = searchParams.get("range") || "week"

  const db = getDb()
  const userId = session.user.id

  let sql: string
  let params: any[]

  if (range === "week") {
    sql = `SELECT COUNT(*) as count, strftime('%w', created_at) as day
           FROM scans
           WHERE user_id = ? AND created_at >= datetime('now', '-7 days')
           GROUP BY day ORDER BY day`
    params = [userId]
  } else if (range === "month") {
    sql = `SELECT COUNT(*) as count, strftime('%d', created_at) as day
           FROM scans
           WHERE user_id = ? AND created_at >= datetime('now', '-30 days')
           GROUP BY day ORDER BY day`
    params = [userId]
  } else {
    sql = `SELECT COUNT(*) as count, strftime('%m', created_at) as month
           FROM scans
           WHERE user_id = ? AND created_at >= datetime('now', '-12 months')
           GROUP BY month ORDER BY month`
    params = [userId]
  }

  const rows = db.prepare(sql).all(...params) as { count: number; day?: string; month?: string }[]

  return NextResponse.json({ data: rows, range })
}
