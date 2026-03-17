import { getServiceClient } from "@/lib/supabase/service"

export type AdminInvitation = {
  id: string
  email: string
  invitedAt: string
  usedAt: string | null
}

export async function getInvitations(): Promise<AdminInvitation[]> {
  const { data, error } = await getServiceClient()
    .from("admin_invitations")
    .select("*")
    .order("invited_at", { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []).map((r) => ({
    id: r.id as string,
    email: r.email as string,
    invitedAt: r.invited_at as string,
    usedAt: (r.used_at as string | null) ?? null,
  }))
}

export async function addInvitation(email: string): Promise<void> {
  const { error } = await getServiceClient()
    .from("admin_invitations")
    .insert({ email: email.toLowerCase().trim() })
  if (error) throw new Error(error.message)
}

export async function deleteInvitation(id: string): Promise<void> {
  const { error } = await getServiceClient()
    .from("admin_invitations")
    .delete()
    .eq("id", id)
  if (error) throw new Error(error.message)
}

export async function getInvitationByEmail(email: string): Promise<AdminInvitation | null> {
  const { data, error } = await getServiceClient()
    .from("admin_invitations")
    .select("*")
    .eq("email", email.toLowerCase().trim())
    .is("used_at", null)
    .maybeSingle()
  if (error) throw new Error(error.message)
  if (!data) return null
  return {
    id: data.id as string,
    email: data.email as string,
    invitedAt: data.invited_at as string,
    usedAt: null,
  }
}

export async function markInvitationUsed(email: string): Promise<void> {
  const { error } = await getServiceClient()
    .from("admin_invitations")
    .update({ used_at: new Date().toISOString() })
    .eq("email", email.toLowerCase().trim())
  if (error) throw new Error(error.message)
}
