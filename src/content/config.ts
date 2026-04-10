import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    category: z.enum(['research', 'update']),
    excerpt: z.string(),
  }),
});

export const collections = { blog };
