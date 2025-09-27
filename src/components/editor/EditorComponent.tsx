import React, { useEffect } from "react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import { baseExtensions } from "./extensions";
import { cn } from "@/lib/utils";
import "@/components/editor/editor.css";

type EditorComponentProps = {
  editor?: Editor | null;
  content?: string;
  editable?: boolean;
  onUpdate?: (editor: Editor) => void;
};

const EditorComponent = ({
  editor: externalEditor, 
  content,
  editable = true,
  onUpdate,
}: EditorComponentProps) => {
  const internalEditor = useEditor({
    immediatelyRender: false,
    extensions: baseExtensions,
    content: content,
    editable,
    onUpdate: onUpdate ? ({ editor }) => onUpdate(editor) : undefined,
  });

  const editor = externalEditor ?? internalEditor;

  useEffect(() => {
    if (!editor) return;
    if (editor.isEditable !== editable) {
      editor.setEditable(editable);
    }
  }, [editable, editor]);

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className="w-full h-full">
      <EditorContent
        editor={editor}
        className={cn(
          "min-h-[400px] p-6 focus-visible:outline-none w-full h-full",
          "prose dark:prose-invert max-w-none",
          "prose-headings:font-semibold prose-p:leading-relaxed",
          "prose-a:text-primary hover:prose-a:underline",
          "prose-ul:list-disc prose-ol:list-decimal prose-li:my-0",
          "prose-code:bg-muted/50 prose-code:px-1.5 prose-code:py-1 prose-code:rounded prose-code:text-sm",
          "prose-blockquote:border-l-2 prose-blockquote:border-muted-foreground/20 prose-blockquote:pl-4",
          "prose-hr:border-t-2 prose-hr:border-muted-foreground/10"
        )}
      />
    </div>
  );
};

export default EditorComponent;
