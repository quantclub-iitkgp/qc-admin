"use client"

import { useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { MarkdownPreview } from "@/components/ui/markdown-preview"

interface MarkdownEditorProps {
  /** Form field name — submitted to the server action. */
  name: string
  id?: string
  defaultValue?: string
  rows?: number
  placeholder?: string
}

/**
 * Markdown textarea with a Write / Preview tab toggle. The Preview renders with
 * the same pipeline as the public frontend (see MarkdownPreview).
 *
 * The textarea stays mounted (hidden via CSS) when previewing, so the form
 * always submits the `body` value regardless of the active tab.
 */
export function MarkdownEditor({ name, id, defaultValue = "", rows = 20, placeholder }: MarkdownEditorProps) {
  const [value, setValue] = useState(defaultValue)
  const [tab, setTab] = useState<"write" | "preview">("write")

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <TabButton active={tab === "write"} onClick={() => setTab("write")}>
          Write
        </TabButton>
        <TabButton active={tab === "preview"} onClick={() => setTab("preview")}>
          Preview
        </TabButton>
      </div>

      <Textarea
        id={id}
        name={name}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className={cn("font-mono text-sm resize-y", tab !== "write" && "hidden")}
      />

      {tab === "preview" &&
        (value.trim() ? (
          <div className="rounded-base border-2 border-border p-4">
            <MarkdownPreview body={value} />
          </div>
        ) : (
          <p className="rounded-base border-2 border-dashed border-border p-4 text-sm text-foreground/50">
            Nothing to preview yet — write some Markdown in the Write tab.
          </p>
        ))}
    </div>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-base border-2 border-border px-3 py-1 text-sm font-base transition-all",
        active
          ? "bg-main text-main-foreground shadow-shadow"
          : "bg-secondary-background hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none",
      )}
    >
      {children}
    </button>
  )
}
