import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"

export async function GET() {
  const db = await getDb()
  const { rows: users } = await db.execute(
    `SELECT u.id, u.name, u.email, u.image, u.points,
            (SELECT COUNT(*) FROM scans s WHERE s.user_id = u.id) AS scans
     FROM users u
     ORDER BY u.points DESC
     LIMIT 50`
  )

  const { rows: userScans } = await db.execute(
    `SELECT user_id, material, COUNT(*) as count
     FROM scans
     GROUP BY user_id, material`
  )

  return NextResponse.json({ users, breakdown: userScans })
}
