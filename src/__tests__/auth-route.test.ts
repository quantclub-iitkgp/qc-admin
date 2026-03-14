import { describe, it, expect, vi, beforeEach } from "vitest"
import { NextRequest } from "next/server"

// Mock session before importing the route
const mockSave = vi.fn()
const mockDestroy = vi.fn()
const mockSession = { isLoggedIn: false, save: mockSave, destroy: mockDestroy }

vi.mock("@/lib/session", () => ({
  getSession: vi.fn(() => Promise.resolve(mockSession)),
}))

import { POST, DELETE } from "@/app/api/auth/route"

beforeEach(() => {
  vi.clearAllMocks()
  mockSession.isLoggedIn = false
  process.env.ADMIN_PASSWORD = "secret123"
})

function makeRequest(body: unknown, method = "POST") {
  return new NextRequest("http://localhost/api/auth", {
    method,
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  })
}

describe("POST /api/auth (login)", () => {
  it("returns 200 and saves session for correct password", async () => {
    const req = makeRequest({ password: "secret123" })
    const res = await POST(req)

    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(mockSession.isLoggedIn).toBe(true)
    expect(mockSave).toHaveBeenCalledOnce()
  })

  it("returns 401 for wrong password", async () => {
    const req = makeRequest({ password: "wrongpassword" })
    const res = await POST(req)

    expect(res.status).toBe(401)
    const json = await res.json()
    expect(json.error).toBeDefined()
    expect(mockSave).not.toHaveBeenCalled()
  })

  it("returns 401 when ADMIN_PASSWORD is not set", async () => {
    delete process.env.ADMIN_PASSWORD
    const req = makeRequest({ password: "anything" })
    const res = await POST(req)

    expect(res.status).toBe(401)
    expect(mockSave).not.toHaveBeenCalled()
  })

  it("does not set isLoggedIn on wrong password", async () => {
    const req = makeRequest({ password: "bad" })
    await POST(req)
    expect(mockSession.isLoggedIn).toBe(false)
  })
})

describe("DELETE /api/auth (logout)", () => {
  it("returns 200 and destroys session", async () => {
    const req = new NextRequest("http://localhost/api/auth", { method: "DELETE" })
    const res = await DELETE()

    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(mockDestroy).toHaveBeenCalledOnce()
  })
})
