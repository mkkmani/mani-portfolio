/**
 * Predefined quick-prompts shown as chips when the chat is empty, and filtered
 * live as the visitor types (matched against `label` + `keywords`). Shared by
 * the widget for both purposes. Pure data - safe on client and server.
 */
export interface Suggestion {
  /** Short label shown on the chip. */
  label: string;
  /** The actual message sent to the assistant when picked. */
  prompt: string;
  /** Extra terms used for type-ahead matching. */
  keywords: string[];
}

export const SUGGESTIONS: Suggestion[] = [
  {
    label: "Who is Mani?",
    prompt: "Who is Mani and what does he do?",
    keywords: ["about", "who", "bio", "intro", "manikanta", "background"],
  },
  {
    label: "Latest notelogs",
    prompt: "What are the latest notelogs (blog posts)?",
    keywords: ["blog", "blogs", "notelogs", "articles", "writing", "posts"],
  },
  {
    label: "Show me projects",
    prompt: "What projects has Mani built?",
    keywords: ["projects", "work", "portfolio", "apps", "built"],
  },
  {
    label: "Interview prep topics",
    prompt: "What interview-prep topics are available?",
    keywords: ["interview", "prep", "practice", "questions", "topics", "dsa"],
  },
  {
    label: "His tech stack",
    prompt: "What technologies and skills does Mani specialize in?",
    keywords: ["skills", "stack", "tech", "technologies", "mern", "nextjs"],
  },
  {
    label: "Work experience",
    prompt: "Tell me about Mani's work experience and career.",
    keywords: ["experience", "career", "job", "work history", "purecode"],
  },
  {
    label: "How to get in touch",
    prompt: "How can I contact or hire Mani?",
    keywords: ["contact", "hire", "email", "reach", "collaborate", "freelance"],
  },
];

/** Suggestions whose label/keywords match the current input (type-ahead). */
export function filterSuggestions(query: string, limit = 4): Suggestion[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return SUGGESTIONS.filter((s) => {
    const hay = `${s.label} ${s.keywords.join(" ")}`.toLowerCase();
    return hay.includes(q);
  }).slice(0, limit);
}
