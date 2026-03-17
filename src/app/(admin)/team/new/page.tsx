import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createTeamMemberAction } from "../actions"

export default function NewTeamMemberPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" asChild>
          <Link href="/team">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-2xl font-heading">Add Team Member</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Member Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createTeamMemberAction} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input id="name" name="name" placeholder="e.g. Arjun Sharma" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Input id="role" name="role" placeholder="e.g. Research Lead" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" name="bio" placeholder="Short biography..." rows={3} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Profile Image Path</Label>
              <Input id="image" name="image" placeholder="/team/person.jpg" />
            </div>
            <div className="space-y-2">
              <Label>Social Links (optional)</Label>
              <div className="space-y-2">
                <Input name="github" placeholder="GitHub URL" />
                <Input name="linkedin" placeholder="LinkedIn URL" />
                <Input name="twitter" placeholder="Twitter/X URL" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit">Add Member</Button>
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
