import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, PencilLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Markdown from "markdown-it";
import { useEffect, useState } from "react";
import "./editor.css";

interface PreviewNoteProps {
  title: string;
  summary: string;
  tags: string[];
  content: string;
  onBackToEdit: () => void;
}

export function PreviewNote({
  title,
  summary,
  tags,
  content,
  onBackToEdit,
}: PreviewNoteProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [markdownContent, setMarkdownContent] = useState("");

  useEffect(() => {
    setIsMounted(true);
    // Initialize Markdown parser
    const md = new Markdown({
      html: true,
      linkify: true,
      typographer: true,
    });

    // Process the content
    if (content) {
      setMarkdownContent(md.render(content));
    }
  }, [content]);

  if (!isMounted) return null;

  return (
    <div className="flex flex-col h-full bg-background border rounded-lg overflow-hidden">
      <div className="border-b bg-muted/20 p-3 flex justify-between items-center">
        <div className="text-sm font-medium text-muted-foreground flex items-center">
          <FileText className="h-4 w-4 mr-2" />
          Preview
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onBackToEdit}
          className="gap-2"
        >
          <PencilLine className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </div>
      <ScrollArea className="flex-1 p-6">
        <article className="prose prose-slate dark:prose-invert prose-headings:font-bold prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl max-w-4xl mx-auto">
          <h1 className="mb-2">{title}</h1>

          {summary && (
            <p className="text-lg text-muted-foreground mb-6 border-l-4 border-primary/20 pl-4 py-1">
              {summary}
            </p>
          )}

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-sm font-normal"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          <div
            className="prose prose-slate dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: markdownContent }}
          />
        </article>
      </ScrollArea>
    </div>
  );
}
