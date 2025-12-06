import AllNoteLogs from "@/components/pages/Notelogs";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function AllNoteLogsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  return <AllNoteLogs searchParams={params} />
}