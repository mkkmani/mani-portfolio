import { SOCIAL_LINKS } from "@/lib/config";

export const OWNER = {
  name: "Manikanta Ketha",
  shortName: "Mani",
  title: "Software Engineer · Full-Stack | AI Assistant Developer ",
  location: "India",
  email: SOCIAL_LINKS.email,
  resume: "/Manikanta-Ketha-Resume.pdf",
} as const;

export const SITE_ROUTES = {
  home: "/",
  about: "/about",
  work: "/work",
  projects: "/projects",
  notelogs: "/notelogs",
  interviewPrep: "/interview-prep",
  contact: "/contact",
} as const;

const WORK_HISTORY = `
- Software Engineer @ PureCode Software (Jan 2025 – Present): Architecting AI developer tools; building the PureCode VS Code extension with Copilot-like AI integration.
- Frontend Developer @ PureCode Software (Oct 2024 – Dec 2024): Engineered an AI component-generation flow (text-to-UI).
- QA Engineer @ PureCode Software (May 2024 – Sep 2024): Tested accuracy of AI-generated React & Tailwind components.
- Frontend Intern @ PureCode Software (Jan 2024 – Apr 2024): Contributed to dashboard UI and the component library.
`.trim();

const SKILLS = [
  "MERN stack (MongoDB, Express, React, Node.js)",
  "Next.js 15+ / App Router",
  "TypeScript",
  "AI integration (LLMs, OpenRouter, RAG-style context)",
  "UI/UX design",
  "Cloud architecture",
].join(", ");

const SOCIALS = [
  SOCIAL_LINKS.github && `GitHub: ${SOCIAL_LINKS.github}`,
  SOCIAL_LINKS.linkedin && `LinkedIn: ${SOCIAL_LINKS.linkedin}`,
  SOCIAL_LINKS.twitter && `Twitter/X: ${SOCIAL_LINKS.twitter}`,
  SOCIAL_LINKS.email && `Email: ${SOCIAL_LINKS.email}`,
]
  .filter(Boolean)
  .join("\n");

export const OWNER_PROFILE = `
# About ${OWNER.name} ("${OWNER.shortName}")

- Role: ${OWNER.title}
- Based in: ${OWNER.location}
- Currently: Engineering AI-driven developer tools at PureCode Software.
- Philosophy: Code is structural architecture - every pixel must serve a purpose. He cares equally about technical depth and refined visual precision.

## Skills
${SKILLS}

## Work history
${WORK_HISTORY}

## How to reach him (these external links are explicitly allowed)
${SOCIALS || "Use the contact page at /contact."}
Resume (internal): ${OWNER.resume}

## Site sections you can point people to (internal links only)
- About → ${SITE_ROUTES.about}
- Work history → ${SITE_ROUTES.work}
- Projects → ${SITE_ROUTES.projects}
- Notelogs (technical blog) → ${SITE_ROUTES.notelogs}
- Interview Prep (AI practice) → ${SITE_ROUTES.interviewPrep}
- Contact → ${SITE_ROUTES.contact}
`.trim();
