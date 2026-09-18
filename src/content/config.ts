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

// One file per feature, one chapter of the Features story each: the frontmatter
// says what it does, the body (one paragraph) says what happens behind the
// scenes, and src/story/features-story.ts draws that under the same slug.
// `shipped` is the merge date of the change that delivered it;
// the site marks a feature New for its first 30 days.
const features = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    group: z.enum(['Capture', 'Sessions', 'Notes', 'Find', 'Sync', 'Everywhere', 'Private']),
    order: z.number(),
    platforms: z.array(z.enum(['macOS', 'Windows', 'iPhone', 'iPad', 'Android'])).min(1),
    shipped: z.date(),
  }),
});

export const collections = { blog, features };
