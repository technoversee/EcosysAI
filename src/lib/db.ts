import { createClient } from "@libsql/client"
import type { Client } from "@libsql/client"

const DB_PATH = "data/ecosysai.db"

let db: Client
let initPromise: Promise<void> | null = null

export async function getDb(): Promise<Client> {
  if (!db) {
    const useTurso = !!process.env.TURSO_DB_URL
    let url: string
    if (useTurso) {
      url = process.env.TURSO_DB_URL!
    } else if (process.env.VERCEL === "1") {
      url = "file:/tmp/ecosysai.db"
    } else {
      url = `file:${DB_PATH}`
    }
    db = createClient({
      url,
      ...(useTurso ? { authToken: process.env.TURSO_DB_AUTH_TOKEN } : {}),
    })
    initPromise = runSchema()
  }
  if (initPromise) {
    await initPromise
    initPromise = null
  }
  return db
}

async function runSchema() {
  const c = db
  try { await c.execute("PRAGMA journal_mode = WAL") } catch {}
  // Only enforce FK constraints with Turso (shared DB across all function instances).
  // In fallback mode (/tmp), each Vercel instance has its own DB file, so FK
  // checks fail because users created on one instance don't exist on another.
  if (process.env.TURSO_DB_URL) {
    try { await c.execute("PRAGMA foreign_keys = ON") } catch {}
  }

  await c.batch([
    `CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT,
      email TEXT UNIQUE,
      image TEXT,
      points INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS accounts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      provider TEXT NOT NULL,
      provider_account_id TEXT NOT NULL,
      refresh_token TEXT,
      access_token TEXT,
      expires_at INTEGER,
      token_type TEXT,
      scope TEXT,
      id_token TEXT,
      session_state TEXT,
      UNIQUE(provider, provider_account_id)
    )`,
    `CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      session_token TEXT NOT NULL UNIQUE,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS verification_tokens (
      identifier TEXT NOT NULL,
      token TEXT NOT NULL UNIQUE,
      expires TEXT NOT NULL,
      UNIQUE(identifier, token)
    )`,
    `CREATE TABLE IF NOT EXISTS scans (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      material TEXT NOT NULL,
      confidence REAL,
      points_awarded INTEGER DEFAULT 0,
      image_data TEXT,
      confirmed INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS proofs (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      scan_id TEXT REFERENCES scans(id) ON DELETE SET NULL,
      image_data TEXT,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected')),
      created_at TEXT DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS redemptions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      reward_id INTEGER NOT NULL,
      reward_name TEXT NOT NULL,
      cost INTEGER NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS waste_facts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fact TEXT NOT NULL
    )`,
  ])

  // Migration: add confirmed column if missing
  try { await c.execute("ALTER TABLE scans ADD COLUMN confirmed INTEGER DEFAULT 0") } catch {}
}
