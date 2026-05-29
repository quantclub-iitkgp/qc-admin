"use client"

import { type ReactNode } from "react"
import { useFormStatus } from "react-dom"
import { Loader2 } from "lucide-react"
import { Button, type ButtonProps } from "@/components/ui/button"

interface SubmitButtonProps extends ButtonProps {
  /** Label shown while the form action is pending. Defaults to children. */
  pendingText?: ReactNode
}

/**
 * Submit button that disables itself and shows a spinner while the enclosing
 * `<form action={...}>` is pending, preventing duplicate submissions from
 * double-clicks.
 *
 * Must be rendered inside a form that uses a server/client `action` —
 * `useFormStatus` does not track plain `onSubmit` handlers. For those, drive a
 * spinner from your own loading state instead.
 */
export function SubmitButton({ children, pendingText, disabled, ...props }: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending || disabled} aria-busy={pending} {...props}>
      {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {pending ? (pendingText ?? children) : children}
    </Button>
  )
}
