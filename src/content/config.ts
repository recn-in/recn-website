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

// One file per feature: the index line comes from the frontmatter, the page
// from the body. `shipped` is the merge date of the change that delivered it;
// the site marks a feature New for its first 30 days.
const features = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    group: z.enum(['Record', 'Sessions', 'Notes', 'Find', 'Sync', 'Everywhere', 'Private']),
    order: z.number(),
    platforms: z.array(z.enum(['macOS', 'Windows', 'iPhone', 'iPad', 'Android'])).min(1),
    shipped: z.date(),
  }),
});

export const collections = { blog, features };
