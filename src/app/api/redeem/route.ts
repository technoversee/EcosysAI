import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { auth } from "@/lib/auth"
import { REWARDS } from "@/lib/constants"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { rewardId } = await req.json()
  const reward = REWARDS.find((r) => r.id === rewardId)
  if (!reward) {
    return NextResponse.json({ error: "Reward not found" }, { status: 404 })
  }

  const db = getDb()
  const user = db.prepare("SELECT points FROM users WHERE id = ?").get(session.user.id) as any
  if (!user || user.points < reward.cost) {
    return NextResponse.json({ error: "Not enough points" }, { status: 400 })
  }

  db.prepare("UPDATE users SET points = points - ? WHERE id = ?").run(reward.cost, session.user.id)

  const id = crypto.randomUUID()
  db.prepare(
    "INSERT INTO redemptions (id, user_id, reward_id, reward_name, cost) VALUES (?, ?, ?, ?, ?)"
  ).run(id, session.user.id, reward.id, reward.name, reward.cost)

  const updated = db.prepare("SELECT points FROM users WHERE id = ?").get(session.user.id) as any

  return NextResponse.json({
    success: true,
    redemptionId: id,
    reward: reward.name,
    cost: reward.cost,
    pointsRemaining: updated.points,
  })
}
