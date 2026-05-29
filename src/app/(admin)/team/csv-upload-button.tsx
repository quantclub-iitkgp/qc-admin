"use client"

import { useRef, useState } from "react"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { uploadTeamCsvAction } from "./actions"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function CsvUploadButton() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      await uploadTeamCsvAction(formData)
      toast.success("CSV uploaded successfully")
      setIsOpen(false)
    } catch (error) {
      toast.error("Failed to upload CSV: " + (error as Error).message)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="h-4 w-4 mr-2" />
          Upload CSV
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bulk Upload Team Members</DialogTitle>
          <DialogDescription>
            Upload a CSV file to add multiple members at once. Ensure your file matches the format below.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2 text-sm text-muted-foreground">
            <p><strong>Required columns:</strong> <code>name</code>, <code>role</code></p>
            <p><strong>Optional columns:</strong> <code>bio</code>, <code>image</code>, <code>github</code>, <code>linkedin</code>, <code>twitter</code></p>
            <p className="mt-2 text-xs opacity-80">
              Note: Empty optional fields will be set to default values or left blank.
            </p>
          </div>
          
          <input
            type="file"
            accept=".csv"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <Button
            className="w-full"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? "Uploading..." : "Select CSV File"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
