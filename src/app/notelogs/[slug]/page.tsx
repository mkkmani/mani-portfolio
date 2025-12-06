import NoteLogSlug from "@/components/pages/Notelogs/NoteLogSlug";

export default function NotelogSlug({ params }: { params: Promise<{ slug: string }> }) {
  return <NoteLogSlug params={params} />
}