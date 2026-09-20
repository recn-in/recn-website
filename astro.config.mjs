import { readdirSync } from 'node:fs';
import { defineConfig, passthroughImageService } from 'astro/config';

// Each feature had a page of its own once; its address now opens its chapter.
const featureChapters = Object.fromEntries(
  readdirSync('src/content/features').map((file) => file.replace(/\.md$/, '')).map((slug) => [`/features/${slug}`, `/features/#${slug}`]),
);

export default defineConfig({
  site: 'https://recn.in',
  output: 'static',
  redirects: {
    '/desktop': '/download/',
    '/mobile': '/download/',
    ...featureChapters,
  },
  image: {
    service: passthroughImageService(),
  },
});
