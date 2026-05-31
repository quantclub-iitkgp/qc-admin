import { describe, it, expect, vi, beforeEach } from "vitest"
import { NextRequest } from "next/server"

// Auth runs through Supabase Auth (createClient from @/lib/supabase/server),
// not iron-session. Mock the server client before importing the route.
const mockSignInWithPassword = vi.fn()
const mockSignOut = vi.fn()

vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({
    auth: {
      signInWithPassword: (...args: unknown[]) => mockSignInWithPassword(...args),
      signOut: (...args: unknown[]) => mockSignOut(...args),
    },
  }),
}))

import { POST, DELETE } from "@/app/api/auth/route"

beforeEach(() => {
  vi.clearAllMocks()
  mockSignOut.mockResolvedValue({ error: null })
})

function makeRequest(body: unknown) {
  return new NextRequest("http://localhost/api/auth", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  })
}

describe("POST /api/auth (login)", () => {
  it("returns 200 and success for valid credentials", async () => {
    mockSignInWithPassword.mockResolvedValue({ error: null })
    const res = await POST(makeRequest({ email: "admin@qc.com", password: "secret123" }))

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ success: true })
  })

  it("forwards email and password to Supabase", async () => {
    mockSignInWithPassword.mockResolvedValue({ error: null })
    await POST(makeRequest({ email: "admin@qc.com", password: "secret123" }))

    expect(mockSignInWithPassword).toHaveBeenCalledWith({
      email: "admin@qc.com",
      password: "secret123",
    })
  })

  it("returns 401 with the error message for invalid credentials", async () => {
    mockSignInWithPassword.mockResolvedValue({ error: { message: "Invalid login credentials" } })
    const res = await POST(makeRequest({ email: "admin@qc.com", password: "wrong" }))

    expect(res.status).toBe(401)
    expect(await res.json()).toEqual({ error: "Invalid login credentials" })
  })
})

describe("DELETE /api/auth (logout)", () => {
  it("returns 200, success, and signs the user out", async () => {
    const res = await DELETE()

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ success: true })
    expect(mockSignOut).toHaveBeenCalledOnce()
  })
})
