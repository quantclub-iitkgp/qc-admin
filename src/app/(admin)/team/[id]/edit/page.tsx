import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { getTeam } from "@/lib/data-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { updateTeamMemberAction } from "../../actions"

export default async function EditTeamMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const team = await getTeam()
  const member = team.find((m) => m.id === Number(id))

  if (!member) notFound()

  const action = updateTeamMemberAction.bind(null, member.id)

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" asChild>
          <Link href="/team">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-2xl font-heading">Edit Team Member</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Member Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={action} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input id="name" name="name" defaultValue={member.name} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Input id="role" name="role" defaultValue={member.role} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" name="bio" defaultValue={member.bio} rows={3} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Profile Image Path</Label>
              <Input id="image" name="image" defaultValue={member.image} />
            </div>
            <div className="space-y-2">
              <Label>Social Links (optional)</Label>
              <div className="space-y-2">
                <Input name="github" defaultValue={member.github ?? ""} placeholder="GitHub URL" />
                <Input name="linkedin" defaultValue={member.linkedin ?? ""} placeholder="LinkedIn URL" />
                <Input name="twitter" defaultValue={member.twitter ?? ""} placeholder="Twitter/X URL" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit">Save Changes</Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/team">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
