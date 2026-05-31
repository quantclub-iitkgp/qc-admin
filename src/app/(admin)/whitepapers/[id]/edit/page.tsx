import { notFound } from "next/navigation"
import { getWhitepapers } from "@/lib/data-store"
import { WhitepaperForm } from "../../whitepaper-form"

export default async function EditWhitepaperPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const wps = await getWhitepapers()
  const wp = wps.find((w) => w.id === Number(id))

  if (!wp) notFound()

  return (
    <WhitepaperForm
      mode="edit"
      whitepaper={{
        id: wp.id,
        title: wp.title,
        description: wp.description,
        publishedAt: wp.publishedAt,
        imageUrl: wp.imageUrl,
        pdfUrl: wp.pdfUrl,
      }}
    />
  )
}
