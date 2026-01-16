export interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image?: string;
  tags: string[];
  published: boolean;
  favourite: boolean;
  customDate?: string | Date;
  createdAt: string;
}

export type FilterType = 'all' | 'published' | 'draft';
