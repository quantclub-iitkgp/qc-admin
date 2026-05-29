"use client"

import { useRef, useState, useTransition } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import { bulkEnrollAction } from "../actions"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Result {
  enrolled: number
  skipped: number
  errors: string[]
}

export function BulkEnrollForm() {
  const [emails, setEmails] = useState<string[]>([])
  const [result, setResult] = useState<Result | null>(null)
  const [isPending, startTransition] = useTransition()
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      const parsed = text
        .split(/\r?\n/)
        .map((line) => line.split(",")[0].trim().toLowerCase())
        .filter((v) => v && v.includes("@"))
      setEmails(parsed)
      setResult(null)
    }
    reader.readAsText(file)
  }

  function handleSubmit() {
    if (emails.length === 0) return
    startTransition(async () => {
      const r = await bulkEnrollAction(emails)
      setResult(r)
      setEmails([])
      if (fileRef.current) fileRef.current.value = ""
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="h-4 w-4 mr-2" />
          Bulk Enroll (CSV)
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bulk Enroll via CSV</DialogTitle>
          <DialogDescription>
            Upload a CSV file to enroll multiple users at once. Ensure your file matches the format below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2 text-sm text-muted-foreground">
            <p><strong>Required columns:</strong> <code>email</code></p>
            <p className="mt-2 text-xs opacity-80">
              Note: The file can contain multiple columns, but the first column must be the email address. Each row must have one email.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => fileRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Select CSV File
              </Button>
              <input
                id="csv-upload"
                ref={fileRef}
                type="file"
                accept=".csv,text/csv"
                className="sr-only"
                onChange={handleFile}
              />
            </div>
            {emails.length > 0 && (
              <span className="text-sm text-foreground/60 block mt-2">{emails.length} email(s) parsed</span>
            )}
          </div>

          {emails.length > 0 && (
            <div className="rounded-base border-2 border-border bg-secondary-background p-3 max-h-40 overflow-y-auto">
              <p className="text-xs font-heading text-foreground/50 mb-2 uppercase tracking-wide">Preview</p>
              <ul className="space-y-0.5">
                {emails.map((email) => (
                  <li key={email} className="text-sm font-mono text-foreground/80">{email}</li>
                ))}
              </ul>
            </div>
          )}

          {result && (
            <div className={`rounded-base border-2 p-3 text-sm ${result.errors.length > 0 ? "border-orange-400 bg-orange-50 dark:bg-orange-950/20" : "border-border bg-main/5"}`}>
              <p className="font-heading font-bold mb-1">
                Enrolled {result.enrolled}, Skipped {result.skipped}
              </p>
              {result.errors.length > 0 && (
                <ul className="space-y-0.5 text-foreground/60 text-xs">
                  {result.errors.map((err, i) => <li key={i}>• {err}</li>)}
                </ul>
              )}
            </div>
          )}

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={emails.length === 0 || isPending}
            variant="default"
            className="w-full bg-main text-main-foreground border-2 border-border shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all"
          >
            {isPending ? "Enrolling…" : `Confirm Enrollment`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
