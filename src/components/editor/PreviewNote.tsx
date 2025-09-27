import { useEditor } from "@tiptap/react";

import React from "react";
import { baseExtensions } from "./extensions";
import { Badge, Button } from "@/components/ui";
import EditorComponent from "./EditorComponent";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

export const PreviewNote = ({
  content,
  title,
  summary,
  tags,
  coverImage,
  onBackToEdit,
}: {
  content: string;
  title: string;
  summary: string;
  tags: string[];
  coverImage: string;
  onBackToEdit: () => void;
}) => {
  const editorInstance = useEditor({
    immediatelyRender: false,
    editable: false,
    extensions: baseExtensions,
    content,
  });
  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full space-y-6 pt-10">
      <div>
        <Button variant="ghost" onClick={onBackToEdit}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Edit
        </Button>
      </div>
      <div>
        {coverImage && (
          <div className="relative w-full aspect-video h-auto max-h-[50vh] mb-6 rounded-lg overflow-hidden">
            <Image
              src={coverImage}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 50vw"
              priority
            />
          </div>
        )}
        <h1>{title}</h1>
        <p>{summary}</p>
        <div>
          {tags.map((tag) => (
            <Badge key={tag} className="mr-2">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      <EditorComponent editor={editorInstance} />
    </div>
  );
};
