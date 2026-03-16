import Link from "next/link"
import { Plus } from "lucide-react"
import { getWhitepapers } from "@/lib/data-store"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DeleteWhitepaperButton } from "./delete-button"

export default async function WhitepapersPage() {
  const whitepapers = await getWhitepapers()
  const sorted = [...whitepapers].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading">Whitepapers</h2>
          <p className="text-sm text-foreground/60">{whitepapers.length} papers</p>
        </div>
        <Button asChild>
          <Link href="/whitepapers/new">
            <Plus className="h-4 w-4" />
            New Whitepaper
          </Link>
        </Button>
      </div>

      <div className="border-2 border-border rounded-base overflow-hidden bg-secondary-background shadow-shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Published</TableHead>
              <TableHead>PDF</TableHead>
              <TableHead className="w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-foreground/60 py-8">
                  No whitepapers yet.
                </TableCell>
              </TableRow>
            ) : (
              sorted.map((wp) => (
                <TableRow key={wp.id}>
                  <TableCell className="text-sm text-foreground/60">{wp.id}</TableCell>
                  <TableCell className="font-base">{wp.title}</TableCell>
                  <TableCell className="text-sm text-foreground/60">
                    {wp.publishedAt
                      ? new Date(wp.publishedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "—"}
                  </TableCell>
                  <TableCell className="text-sm">
                    {wp.pdfUrl ? (
                      <span className="text-green-600 font-base">✓ Uploaded</span>
                    ) : (
                      <span className="text-foreground/40">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/whitepapers/${wp.id}/edit`}>Edit</Link>
                      </Button>
                      <DeleteWhitepaperButton id={wp.id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
