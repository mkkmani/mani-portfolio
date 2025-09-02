import { create } from "zustand";
import { Editor } from '@tiptap/core';

interface EditorState {
  editor: Editor | null;
  editorContent: string;
  setEditorContent: (content: string) => void;
  setEditorInstance: (editor: Editor | null) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  editor: null,
  editorContent: "",
  setEditorContent: (content) => set({ editorContent: content }),
  setEditorInstance: (editor) => set({ editor }),
}));

export type { Editor };
