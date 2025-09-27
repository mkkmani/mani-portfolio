"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useEditor } from "@tiptap/react";
import { baseExtensions } from "@/components/editor/extensions";
import Image from "next/image";
import EditorComponent from "@/components/editor/EditorComponent";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

interface NoteLog {
  title: string;
  summary: string;
  tags: string[];
  content: string;
  coverImage: string;
}

export default function NoteLogPost() {
  const [note, setNote] = useState<NoteLog | null>(null);
  const { slug } = useParams();

  const editorInstance = useEditor({
    immediatelyRender: false,
    editable: false,
    extensions: baseExtensions,
    content: "",
  });

  const getNoteLog = async () => {
    try {
      const res = await fetch(`/api/notelogs/${slug}`);
      const data = await res.json();
      setNote(data);
    } catch (error) {
      console.error("Error fetching note:", error);
    }
  };

  useEffect(() => {
    if (note?.content) {
      editorInstance?.commands.setContent(JSON.parse(note.content));
    }
  }, [note?.content, editorInstance]);

  useEffect(() => {
    if (slug) {
      getNoteLog();
    }
  }, [slug]);

  if (!note) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full space-y-6 pt-10">
      <div>
        <Link href="/notelogs" className="flex items-center gap-2">
          <ArrowLeftIcon className="w-4 h-4" />
          <span>Back to Notelogs</span>
        </Link>
      </div>
      <article>
        <div className="flex flex-col gap-6 p-4">
          {note.coverImage && (
            <div className="relative w-full aspect-video h-auto max-h-[50vh] mb-6 rounded-lg overflow-hidden">
              <Image
                src={note.coverImage}
                alt={note.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 50vw"
                priority
              />
            </div>
          )}

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
            {note.title}
          </h1>

          {note.summary && <p>{note.summary}</p>}

          {note.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
              {note.tags.map((tag: string, index: number) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs sm:text-sm font-normal py-1 px-2"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <EditorComponent editor={editorInstance} />
      </article>
    </div>
  );
}
