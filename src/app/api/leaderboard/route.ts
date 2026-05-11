import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"

export async function GET() {
  const db = getDb()
  const users = db
    .prepare(
      `SELECT u.id, u.name, u.email, u.image, u.points,
              (SELECT COUNT(*) FROM scans s WHERE s.user_id = u.id) AS scans
       FROM users u
       ORDER BY u.points DESC
       LIMIT 50`
    )
    .all() as { id: string; name: string; email: string; image: string; points: number; scans: number }[]

  const userScans = db
    .prepare(
      `SELECT user_id, material, COUNT(*) as count
       FROM scans
       GROUP BY user_id, material`
    )
    .all() as { user_id: string; material: string; count: number }[]

  return NextResponse.json({ users, breakdown: userScans })
}
