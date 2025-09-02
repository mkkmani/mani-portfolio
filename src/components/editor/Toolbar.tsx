"use client";

import { Button } from "@/components/ui/button";
import { useEditorStore, Editor } from "@/store/useEditorStore";
import { Editor as EditorType } from "@tiptap/core";
import { useState, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Image,
  Link,
  Quote,
  Code,
  Minus,
  Pilcrow,
} from "lucide-react";

interface ToolbarOption {
  toolName: string;
  toolIcon: React.ReactNode;
  action: (editor: EditorType) => void;
}

const TOOLBAR_OPTIONS: ToolbarOption[] = [
  {
    toolName: "Paragraph",
    toolIcon: <Pilcrow />,
    action: (editor: EditorType) => 
      editor.chain().focus().setParagraph().run(),
  },
  {
    toolName: "Bold",
    toolIcon: <Bold />,
    action: (editor: EditorType) => editor.chain().focus().toggleBold().run(),
  },
  {
    toolName: "Italic",
    toolIcon: <Italic />,
    action: (editor: EditorType) => editor.chain().focus().toggleItalic().run(),
  },
  {
    toolName: "Underline",
    toolIcon: <Underline />,
    action: (editor: EditorType) =>
      editor.chain().focus().toggleUnderline().run(),
  },
  {
    toolName: "Strikethrough",
    toolIcon: <Strikethrough />,
    action: (editor: EditorType) => editor.chain().focus().toggleStrike().run(),
  },
  {
    toolName: "Heading1",
    toolIcon: <Heading1 />,
    action: (editor: EditorType) =>
      editor.chain().focus().toggleHeading({ level: 1 }).run(),
  },
  {
    toolName: "Heading2",
    toolIcon: <Heading2 />,
    action: (editor: EditorType) =>
      editor.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    toolName: "Heading3",
    toolIcon: <Heading3 />,
    action: (editor: EditorType) =>
      editor.chain().focus().toggleHeading({ level: 3 }).run(),
  },
  {
    toolName: "Link",
    toolIcon: <Link />,
    action: (editor: EditorType) => editor.chain().focus().toggleLink().run(),
  },
  {
    toolName: "BulletList",
    toolIcon: <List />,
    action: (editor: EditorType) =>
      editor.chain().focus().toggleBulletList().run(),
  },
  {
    toolName: "OrderedList",
    toolIcon: <ListOrdered />,
    action: (editor: EditorType) =>
      editor.chain().focus().toggleOrderedList().run(),
  },
  {
    toolName: "Quote",
    toolIcon: <Quote />,
    action: (editor: EditorType) =>
      editor.chain().focus().toggleBlockquote().run(),
  },
  {
    toolName: "Code",
    toolIcon: <Code />,
    action: (editor: EditorType) =>
      editor.chain().focus().toggleCodeBlock().run(),
  },
  {
    toolName: "HorizontalRule",
    toolIcon: <Minus />,
    action: (editor: EditorType) =>
      editor.chain().focus().setHorizontalRule().run(),
  },
];

const Toolbar = () => {
  const { editor } = useEditorStore();
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  if (!editor) {
    return null;
  }

  // Handle button clicks and maintain editor focus
  const handleButtonClick = (action: (editor: EditorType) => void) => {
    action(editor);
    editor.commands.focus();
  };

  const handleLinkAction = () => {
    if (!editor) return;

    if (!linkUrl) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ 
          href: linkUrl,
          target: "_blank",
          rel: "noopener noreferrer nofollow" 
        })
        .run();
    }
    setLinkUrl("");
    setIsLinkModalOpen(false);
  };

  // Add markdown shortcuts
  useEffect(() => {
    if (!editor) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't handle if pressing a modifier key
      if (event.ctrlKey || event.altKey || event.metaKey) return;

      // Handle markdown shortcuts
      if (event.key === ' ' && event.shiftKey) {
        const { from, to } = editor.state.selection;
        const text = editor.state.doc.textBetween(from - 2, to, ' ');
        
        // Handle markdown headers
        if (text.match(/^#\s$/)) {
          event.preventDefault();
          editor.chain().focus().setHeading({ level: 1 }).run();
        } else if (text.match(/^##\s$/)) {
          event.preventDefault();
          editor.chain().focus().setHeading({ level: 2 }).run();
        } else if (text.match(/^###\s$/)) {
          event.preventDefault();
          editor.chain().focus().setHeading({ level: 3 }).run();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [editor]);

  return (
    <div className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex max-w-4xl items-center justify-between p-1 overflow-x-auto">
        <div className="flex items-center gap-1 flex-wrap py-1">
          {TOOLBAR_OPTIONS.map((option, index) => (
            <Button
              key={index}
              variant="ghost"
              size="icon"
              type="button"
              onClick={() => handleButtonClick(option.action)}
              className={`h-8 w-8 rounded-md p-1 hover:bg-accent hover:text-accent-foreground ${(() => {
                const isActive = (() => {
                  switch (option.toolName) {
                    case "Paragraph":
                      return editor.isActive('paragraph');
                    case "Bold":
                      return editor.isActive("bold");
                    case "Italic":
                      return editor.isActive("italic");
                    case "Underline":
                      return editor.isActive("underline");
                    case "Strikethrough":
                      return editor.isActive("strike");
                    case "Heading1":
                      return editor.isActive("heading", { level: 1 });
                    case "Heading2":
                      return editor.isActive("heading", { level: 2 });
                    case "Heading3":
                      return editor.isActive("heading", { level: 3 });
                    case "BulletList":
                      return editor.isActive("bulletList");
                    case "OrderedList":
                      return editor.isActive("orderedList");
                    case "Quote":
                      return editor.isActive("blockquote");
                    case "Code":
                      return editor.isActive("codeBlock");
                    default:
                      return false;
                  }
                })();
                return isActive ? "bg-accent text-accent-foreground" : "";
              })()}`}
              aria-label={option.toolName}
            >
              <span className="h-4 w-4">{option.toolIcon}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
