import { NextRequest, NextResponse } from "next/server"
import { getServiceClient } from "@/lib/supabase/service"
import { getInvitationByEmail, markInvitationUsed } from "@/lib/admin-invitations"

export async function POST(request: NextRequest) {
  const body = await request.json() as { email?: string; password?: string }
  const { email, password } = body

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 })
  }

  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 })
  }

  // Only invited emails may sign up
  const invitation = await getInvitationByEmail(email)
  if (!invitation) {
    return NextResponse.json(
      { error: "This email has not been invited by the Super Admin." },
      { status: 403 }
    )
  }

  // Create the user (email already confirmed — no verification email needed)
  const { error } = await getServiceClient().auth.admin.createUser({
    email: email.toLowerCase().trim(),
    password,
    email_confirm: true,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  // Mark invitation as used so it can't be reused
  await markInvitationUsed(email)

  return NextResponse.json({ success: true })
}
