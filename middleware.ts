import { NextRequest, NextResponse } from "next/server"
import { getIronSession } from "iron-session"
import type { SessionData } from "@/lib/session"

const sessionOptions = {
  password: process.env.SESSION_SECRET ?? "complex-password-at-least-32-characters-long-for-dev",
  cookieName: "qc-admin-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
  },
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith("/login") || pathname.startsWith("/api/auth")) {
    return NextResponse.next()
  }

  const response = NextResponse.next()
  const session = await getIronSession<SessionData>(request, response, sessionOptions)

  if (!session.isLoggedIn) {
    const loginUrl = new URL("/login", request.url)
    return NextResponse.redirect(loginUrl)
  }

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
