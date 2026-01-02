export interface Preparation {
  _id: string;
  topic: string;
  slug: string;
  description?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export type FilterType = 'all' | 'published' | 'draft';
