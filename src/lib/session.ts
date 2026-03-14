import { getIronSession, IronSession } from "iron-session"
import { cookies } from "next/headers"

export interface SessionData {
  isLoggedIn: boolean
}

const sessionOptions = {
  password: process.env.SESSION_SECRET ?? "complex-password-at-least-32-characters-long-for-dev",
  cookieName: "qc-admin-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
  },
}

export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies()
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions)
  return session
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession()
  return session.isLoggedIn === true
}
