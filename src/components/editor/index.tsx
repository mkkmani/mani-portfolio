"use client";
import "./editor.css";
import { useEffect, useState, useCallback, useRef } from "react";
import { useEditor } from "@tiptap/react";
import { useEditorStore } from "@/store/useEditorStore";
import Toolbar from "./Toolbar";
import { Button, Input } from "@/components/ui";
import { ArrowLeft, Save, Eye, X, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { PreviewNote } from "@/components/editor/PreviewNote";
import { toast } from "sonner";
import { baseExtensions } from "./extensions";
import Image from "next/image";
import EditorComponent from "@/components/editor/EditorComponent";

const Editor = () => {
  const router = useRouter();
  const inputFileRef = useRef<HTMLInputElement>(null);
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
    coverImage: string;
  }>({
    title: "",
    summary: "",
    tags: [],
    coverImage: "",
  });

  const [tagInput, setTagInput] = useState("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setNoteLogData((prev) => ({
        ...prev,
        coverImage: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);

    // Reset the input value to allow selecting the same file again
    if (inputFileRef.current) {
      inputFileRef.current.value = "";
    }
  };

  const removeImage = () => {
    setNoteLogData((prev) => ({
      ...prev,
      coverImage: "",
    }));
  };

  const editorInstance = useEditor({
    immediatelyRender: false,
    extensions: baseExtensions,
    content: editorContent,
    editable: true,
    onUpdate: ({ editor }) => {
      setEditorInstance(editor);
    },
  });

  useEffect(() => {
    if (editorInstance) {
      setEditorInstance(editorInstance);
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

  const handleAddTag = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement> | null = null) => {
      if (e && e.key !== "Enter" && e.key !== ",") return;

      const newTag = tagInput.trim().replace(/,/g, "");

      if (noteLogData.tags.length >= 4) {
        toast.error("Maximum 4 tags allowed");
        return;
      }

      if (newTag && !noteLogData.tags.includes(newTag)) {
        setNoteLogData((prev) => ({
          ...prev,
          tags: [...prev.tags, newTag],
        }));
        setTagInput("");
      }
    },
    [tagInput, noteLogData.tags]
  );

  const handleRemoveTag = useCallback((tagToRemove: string) => {
    setNoteLogData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  }, []);

  const togglePreview = useCallback(() => {
    setIsPreviewMode((prev) => !prev);
  }, []);

  const createSlug = (title: string): string => {
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .substring(0, 50);
    const shortId =
      Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    return `${baseSlug}-${shortId}`;
  };

  const handleSave = async (publish = false) => {
    if (!noteLogData.title.trim()) return;

    setIsSaving(true);
    try {
      const res = await fetch("/api/notelogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title: noteLogData.title,
          summary: noteLogData.summary,
          tags: noteLogData.tags,
          content: JSON.stringify(editorInstance?.getJSON() || {}),
          published: publish,
          slug: createSlug(noteLogData.title),
          coverImage: noteLogData.coverImage,
        }),
      });

      const data = await res.json();
      console.log(data);

      if (!res.ok) {
        throw new Error(data.message || "Failed to save note");
      }

      toast.success("Note saved successfully");
      setNoteLogData({
        title: "",
        summary: "",
        tags: [],
        coverImage: "",
      });
      editorInstance?.commands.setContent("");

      router.push(`/notelogs/${data?.data?.slug}`);
    } catch (error) {
      console.error("Error saving note:", error);
      throw error;
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
        <EditorComponent editor={editorInstance} />
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
      coverImage={noteLogData.coverImage}
    />
  );

  if (!storeEditor) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-muted-foreground">
          Loading editor...
        </div>
      </div>
    );
  }

  if (isPreviewMode) {
    return renderPreview();
  }

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full p-4 space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSave(false)}
            disabled={isSaving || !noteLogData.title.trim()}
            className="flex items-center"
          >
            {isSaving ? (
              <>
                <Loader className="h-4 w-4 mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </>
            )}
          </Button>
          <Button
            size="sm"
            onClick={() => handleSave(true)}
            disabled={isSaving || !noteLogData.title.trim()}
          >
            Publish
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Title"
            value={noteLogData.title}
            onChange={(e) => {
              let newTitle = e.target.value;
              newTitle = newTitle.replace(/^#+/, '');
              setNoteLogData((prev) => ({ ...prev, title: newTitle }));
            }}
            className="w-full text-3xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 p-0 placeholder:text-muted-foreground/50"
          />
          <textarea
            placeholder="Summary (optional)"
            value={noteLogData.summary}
            onChange={(e) =>
              setNoteLogData((prev) => ({ ...prev, summary: e.target.value }))
            }
            className="w-full text-muted-foreground bg-transparent border-none focus:outline-none focus:ring-0 p-0 resize-none min-h-[60px] max-h-32 placeholder:text-muted-foreground/50"
            rows={2}
          />
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {noteLogData.tags.map((tag) => (
              <div
                key={tag}
                className="flex items-center bg-muted/50 rounded-full px-3 py-1 text-sm"
              >
                <span>#{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
            {noteLogData.tags.length < 4 && (
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => handleAddTag(e)}
                placeholder="Add a tag..."
                className="bg-transparent border-none focus:outline-none text-sm min-w-[100px] flex-1 placeholder:text-muted-foreground/50"
              />
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {noteLogData.tags.length}/4 tags (press Enter or comma to add)
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Cover Image</label>
            {noteLogData.coverImage && (
              <Button
                variant="ghost"
                onClick={removeImage}
                className="text-xs text-destructive/70 hover:text-destructive"
              >
                Remove
              </Button>
            )}
          </div>
          {noteLogData.coverImage ? (
            <div className="relative w-full h-80 rounded-lg overflow-hidden border border-border">
              <Image
                src={noteLogData.coverImage}
                alt="Cover"
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div
              className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => inputFileRef.current?.click()}
            >
              <Input
                type="file"
                ref={inputFileRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <p className="text-sm text-muted-foreground">
                Click to upload a cover image (optional)
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Recommended size: 1200x630px
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">{renderEditor()}</div>
    </div>
  );
};

export default Editor;
