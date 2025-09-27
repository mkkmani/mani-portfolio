export type Notelog = {
  _id: string;
  title: string;
  slug: string;
  content: string;
  author: string;
  tags: string[];
  status: string;
  published: boolean;
  coverImage: string | null;
  views: number;
  comments: Array<Record<string, unknown>>;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
