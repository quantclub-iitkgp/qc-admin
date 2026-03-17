import Link from "next/link"
import { Plus, Github, Linkedin, Twitter } from "lucide-react"
import { getTeam } from "@/lib/data-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DeleteTeamMemberButton } from "./delete-button"

export default async function TeamPage() {
  const team = await getTeam()

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-heading">Team</h2>
          <p className="text-sm text-foreground/60">{team.length} members</p>
        </div>
        <Button asChild>
          <Link href="/team/new">
            <Plus className="h-4 w-4" />
            Add Member
          </Link>
        </Button>
      </div>

      {team.length === 0 ? (
        <p className="text-center text-foreground/60 py-12">No team members yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member) => (
            <Card key={member.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{member.name}</CardTitle>
                <CardDescription>{member.role}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/70 line-clamp-2">{member.bio}</p>
              </CardContent>
              <CardFooter className="gap-2">
                {member.github && (
                  <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-foreground/60 hover:text-foreground">
                    <Github className="h-4 w-4" />
                  </a>
                )}
                {member.linkedin && (
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-foreground/60 hover:text-foreground">
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
                {member.twitter && (
                  <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="text-foreground/60 hover:text-foreground">
                    <Twitter className="h-4 w-4" />
                  </a>
                )}
                <div className="ml-auto flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/team/${member.id}/edit`}>Edit</Link>
                  </Button>
                  <DeleteTeamMemberButton id={member.id} />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
