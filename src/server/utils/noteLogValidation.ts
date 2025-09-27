import { z } from "zod";

export const notelogCreateSchema = z.object({
  title: z.string().min(1, "Title is required").max(150, "Title is too long"),
  slug: z.string().min(1, "Slug is required"),
  content: z.string().min(1, "Content is required"),
  author: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid author ID"),
  tags: z.array(z.string()).optional(),
  status: z
    .enum(["pending", "approved", "rejected"])
    .optional()
    .default("pending"),
  published: z.boolean().optional().default(false),
  coverImage: z.union([z.url(), z.string()]).nullable().optional(),
  views: z.number().optional().default(0),
  comments: z
    .array(z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid comment ID"))
    .optional()
    .default([]),
  approved: z.boolean().optional().default(false),
  approvedBy: z.string().optional(),
  isDiscarded: z.boolean().optional().default(false),
});

export const notelogUpdateSchema = z.object({
  title: z.string().max(150).optional(),
  slug: z.string().optional(),
  content: z.string().optional(),
  status: z.enum(["pending", "approved", "rejected"]).optional(),
  published: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  coverImage: z.url().optional(),
  isDiscarded: z.boolean().optional().default(false),
});

export const commentCreateSchema = z.object({
  content: z.string().min(1, "Comment content is required"),
  notelog: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid notelog ID"),
  author: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid author ID"),
  parent: z.string().optional(),
});
