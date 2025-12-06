import { create } from 'zustand';

interface Project {
  _id: string;
  title: string;
  description: string;
  image: string;
  link?: string;
  github?: string;
  tags: string[];
}

interface AppState {
  projects: Project[];
  hasProjects: boolean;
  setProjects: (projects: Project[]) => void;
}

export const useAppStore = create<AppState>((set) => ({
  projects: [],
  hasProjects: false,
  setProjects: (projects) => set({ projects, hasProjects: projects.length > 0 }),
}));
