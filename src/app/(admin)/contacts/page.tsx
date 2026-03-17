import { getContacts } from "@/lib/data-store"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function ContactsPage() {
  const contacts = await getContacts()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading">Contact Submissions</h2>
        <p className="text-sm text-foreground/60">{contacts.length} total submissions</p>
      </div>

      <div className="border-2 border-border rounded-base overflow-hidden overflow-x-auto bg-secondary-background shadow-shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Received</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-foreground/60 py-8">
                  No contact submissions yet.
                </TableCell>
              </TableRow>
            ) : (
              contacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell className="font-base">{contact.name}</TableCell>
                  <TableCell className="text-sm">
                    <a
                      href={`mailto:${contact.email}`}
                      className="hover:underline text-main"
                    >
                      {contact.email}
                    </a>
                  </TableCell>
                  <TableCell>
                    {contact.subject ? (
                      <Badge variant="secondary">{contact.subject}</Badge>
                    ) : (
                      <span className="text-foreground/40">—</span>
                    )}
                  </TableCell>
                  <TableCell className="max-w-[300px]">
                    <p className="text-sm text-foreground/70 line-clamp-2">{contact.message}</p>
                  </TableCell>
                  <TableCell className="text-xs text-foreground/60 whitespace-nowrap">
                    {new Date(contact.receivedAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {contacts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Latest Message</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-base">{contacts[0].name}</span>
                <span className="text-foreground/50 text-sm">&lt;{contacts[0].email}&gt;</span>
              </div>
              <p className="text-sm text-foreground/70">{contacts[0].message}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
