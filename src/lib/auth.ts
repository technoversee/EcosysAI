import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"
import { getDb } from "./db"

declare module "next-auth" {
  interface Session {
    user: { id: string; name?: string | null; email?: string | null; image?: string | null }
  }
}

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        name: { label: "Name", type: "text" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string
        const name = credentials?.name as string
        if (!email) return null

        const db = await getDb()
        let user = (await db.execute({ sql: "SELECT * FROM users WHERE email = ?", args: [email] })).rows[0] as any

        if (!user) {
          const id = crypto.randomUUID()
          await db.execute({ sql: "INSERT INTO users (id, name, email) VALUES (?, ?, ?)", args: [id, name || email.split("@")[0], email] })
          user = (await db.execute({ sql: "SELECT * FROM users WHERE id = ?", args: [id] })).rows[0] as any
        }

        return { id: user.id, name: user.name, email: user.email, image: user.image }
      },
    }),
    Google,
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) token.sub = user.id
      return token
    },
  },
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
