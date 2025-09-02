"use client";
import "./editor.css";
import { useEffect, useState, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { useEditorStore } from "@/store/useEditorStore";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Heading from "@tiptap/extension-heading";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Code from "@tiptap/extension-code";
import Strike from "@tiptap/extension-strike";
import ListItem from "@tiptap/extension-list-item";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import Toolbar from "./Toolbar";
import Placeholder from "@tiptap/extension-placeholder";
import { Markdown } from "tiptap-markdown";
import markdownit from "markdown-it";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { ArrowLeft, Save, Eye, X } from "lucide-react";
import { TitleSummaryTags } from "./TitleSummaryTags";
import { useRouter } from "next/navigation";
import { PreviewNote } from "./PreviewNote";

const Editor = () => {
  const router = useRouter();
  const {
    editor: storeEditor,
    editorContent,
    setEditorInstance,
  } = useEditorStore();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [noteLogData, setNoteLogData] = useState<{
    title: string;
    summary: string;
    tags: string[];
  }>({
    title: "",
    summary: "",
    tags: [],
  });

  const [tagInput, setTagInput] = useState("");

  const editorInstance = useEditor({
    // Set immediatelyRender to false to avoid hydration mismatches
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Underline,
      Image,
      Code,
      Strike,
      ListItem,
      BulletList,
      OrderedList,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Markdown.configure({
        html: true,
        tightLists: true,
        tightListClass: "tight",
        bulletListMarker: "-",
        linkify: true,
        breaks: true,
        transformPastedText: true,
        transformCopiedText: true,
      }),
      Placeholder.configure({
        placeholder: "Write something amazing...",
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
        protocols: ["http", "https"],
        isAllowedUri: (url, ctx) => {
          try {
            const parsedUrl = url.includes(":")
              ? new URL(url)
              : new URL(`${ctx.defaultProtocol}://${url}`);

            if (!ctx.defaultValidate(parsedUrl.href)) {
              return false;
            }

            const disallowedProtocols = ["ftp", "file", "mailto"];
            const protocol = parsedUrl.protocol.replace(":", "");

            if (disallowedProtocols.includes(protocol)) {
              return false;
            }

            const allowedProtocols = ctx.protocols.map((p) =>
              typeof p === "string" ? p : p.scheme
            );

            if (!allowedProtocols.includes(protocol)) {
              return false;
            }

            // disallowed domains
            const disallowedDomains = [
              "example-phishing.com",
              "malicious-site.net",
            ];
            const domain = parsedUrl.hostname;

            if (disallowedDomains.includes(domain)) {
              return false;
            }

            return true;
          } catch {
            return false;
          }
        },
        shouldAutoLink: (url) => {
          try {
            const parsedUrl = url.includes(":")
              ? new URL(url)
              : new URL(`https://${url}`);

            const disallowedDomains = [
              "example-no-autolink.com",
              "another-no-autolink.com",
            ];
            const domain = parsedUrl.hostname;

            return !disallowedDomains.includes(domain);
          } catch {
            return false;
          }
        },
      }),
    ],

    content: editorContent || "",
    onUpdate: ({ editor }) => {
      setEditorInstance(editor);
    },
  });

  useEffect(() => {
    if (editorInstance) {
      setEditorInstance(editorInstance);
      // Focus the editor when it's ready
      setTimeout(() => {
        if (editorInstance.view.dom) {
          editorInstance.commands.focus();
        }
      }, 100);
    }

    return () => {
      if (editorInstance) {
        editorInstance.destroy();
        setEditorInstance(null);
      }
    };
  }, [editorInstance, setEditorInstance]);

  const handleAddTag = useCallback(() => {
    if (noteLogData.tags.length >= 4) {
      return;
    }
    if (tagInput.trim() && !noteLogData.tags.includes(tagInput.trim())) {
      setNoteLogData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  }, [tagInput, noteLogData.tags]);

  const handleRemoveTag = useCallback((tagToRemove: string) => {
    setNoteLogData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      handleAddTag();
    }
  };

  const togglePreview = useCallback(() => {
    setIsPreviewMode((prev) => !prev);
  }, []);

  if (!storeEditor) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-muted-foreground">
          Loading editor...
        </div>
      </div>
    );
  }

  const handleSave = async (publish = false) => {
    if (!noteLogData.title.trim()) return;

    setIsSaving(true);
    try {
      console.log("Saving note...", {
        title: noteLogData.title,
        summary: noteLogData.summary,
        tags: noteLogData.tags,
        content: editorInstance?.getHTML(),
        published: publish,
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log(publish ? "Note published successfully!" : "Draft saved!");

      if (publish) {
        console.log("publishing note......");
      }
    } catch (error) {
      console.error("Error saving note:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const renderEditor = () => (
    <div className="flex-1 flex flex-col border rounded-lg overflow-hidden bg-background">
      <div className="border-b bg-muted/20 flex justify-between items-center">
        <Toolbar />
        <Button
          variant="ghost"
          size="sm"
          onClick={togglePreview}
          className="mr-2 text-muted-foreground hover:text-foreground"
        >
          <Eye className="h-4 w-4 mr-2" />
          Preview
        </Button>
      </div>
      <div className="flex-1 overflow-hidden">
        <EditorContent
          editor={editorInstance}
          className={cn(
            "h-full min-h-[400px] p-6 focus-visible:outline-none",
            "prose dark:prose-invert max-w-none w-full h-full",
            "prose-headings:font-semibold prose-p:leading-relaxed",
            "prose-a:text-primary hover:prose-a:underline",
            "prose-ul:list-disc prose-ol:list-decimal prose-li:my-0",
            "prose-code:bg-muted/50 prose-code:px-1.5 prose-code:py-1 prose-code:rounded prose-code:text-sm",
            "prose-blockquote:border-l-2 prose-blockquote:border-muted-foreground/20 prose-blockquote:pl-4",
            "prose-hr:border-t-2 prose-hr:border-muted-foreground/10"
          )}
        />
      </div>
    </div>
  );

  const renderPreview = () => (
    <PreviewNote
      title={noteLogData.title || "Untitled Note"}
      summary={noteLogData.summary}
      tags={noteLogData.tags}
      content={editorInstance?.getHTML() || ""}
      onBackToEdit={togglePreview}
    />
  );

  return (
    <div className="w-full max-w-4xl mx-auto h-full flex flex-col gap-4 p-4 md:p-6">
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => router.push("/notelogs")}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Notes
        </button>
      </div>

      <main className="flex-1 flex flex-col gap-4">
        {isPreviewMode ? (
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {noteLogData.title || "Untitled Note"}
            </h1>
            {noteLogData.summary && (
              <p className="text-muted-foreground">{noteLogData.summary}</p>
            )}
          </div>
        ) : (
          <TitleSummaryTags
            title={noteLogData.title}
            onTitleChange={(title) =>
              setNoteLogData((prev) => ({ ...prev, title }))
            }
            summary={noteLogData.summary}
            onSummaryChange={(summary) =>
              setNoteLogData((prev) => ({ ...prev, summary }))
            }
            tags={noteLogData.tags}
            onAddTag={(tag) => {
              if (
                noteLogData.tags.length < 4 &&
                tag.trim() &&
                !noteLogData.tags.includes(tag.trim())
              ) {
                setNoteLogData((prev) => ({
                  ...prev,
                  tags: [...prev.tags, tag.trim()],
                }));
                setTagInput("");
              }
            }}
            onRemoveTag={handleRemoveTag}
            tagInput={tagInput}
            onTagInputChange={setTagInput}
          />
        )}

        {isPreviewMode ? renderPreview() : renderEditor()}

        <div className="bg-background/80 backdrop-blur-sm border rounded-lg p-3 -mx-1 -mb-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {!isPreviewMode && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (
                      confirm("Are you sure you want to clear all content?")
                    ) {
                      editorInstance?.commands.clearContent();
                      setNoteLogData({ title: "", summary: "", tags: [] });
                    }
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4 mr-1.5" />
                  Clear All
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {!isPreviewMode && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSave(false)}
                  disabled={!noteLogData.title.trim() || isSaving}
                  className="gap-1.5"
                >
                  <Save className="h-4 w-4" />
                  {isSaving ? "Saving..." : "Save Draft"}
                </Button>
              )}
              <Button
                onClick={() => handleSave(true)}
                size="sm"
                disabled={!noteLogData.title.trim() || isSaving}
                className="gap-1.5 bg-primary/90 hover:bg-primary text-primary-foreground"
              >
                <Save className="h-4 w-4" />
                {isPreviewMode
                  ? "Publish"
                  : isSaving
                  ? "Publishing..."
                  : "Publish Now"}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Editor;
