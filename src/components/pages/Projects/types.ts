export interface Project {
  _id: string;
  title: string;
  description: string;
  image: string;
  link?: string;
  github?: string;
  tags: string[];
  published: boolean;
  favourite: boolean;
  createdAt: string;
}

export type FilterType = 'all' | 'published' | 'draft';
