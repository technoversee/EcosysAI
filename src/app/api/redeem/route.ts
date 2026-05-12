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

  const db = await getDb()
  const user = (await db.execute({ sql: "SELECT points FROM users WHERE id = ?", args: [session.user.id] })).rows[0] as any
  if (!user || user.points < reward.cost) {
    return NextResponse.json({ error: "Not enough points" }, { status: 400 })
  }

  await db.execute({ sql: "UPDATE users SET points = points - ? WHERE id = ?", args: [reward.cost, session.user.id] })

  const id = crypto.randomUUID()
  await db.execute({
    sql: "INSERT INTO redemptions (id, user_id, reward_id, reward_name, cost) VALUES (?, ?, ?, ?, ?)",
    args: [id, session.user.id, reward.id, reward.name, reward.cost],
  })

  const updated = (await db.execute({ sql: "SELECT points FROM users WHERE id = ?", args: [session.user.id] })).rows[0] as any

  return NextResponse.json({
    success: true,
    redemptionId: id,
    reward: reward.name,
    cost: reward.cost,
    pointsRemaining: updated.points,
  })
}
