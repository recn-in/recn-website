import { readdirSync } from 'node:fs';
import { defineConfig, passthroughImageService } from 'astro/config';

// Each feature had a page of its own once; its address now opens its chapter.
const featureChapters = Object.fromEntries(
  readdirSync('src/content/features').map((file) => file.replace(/\.md$/, '')).map((slug) => [`/features/${slug}`, `/recn-website/features/#${slug}`]),
);

export default defineConfig({
  site: 'https://recn-in.github.io',
  base: '/recn-website/',
  output: 'static',
  redirects: {
    '/desktop': '/recn-website/download/',
    '/mobile': '/recn-website/download/',
    ...featureChapters,
  },
  image: {
    service: passthroughImageService(),
  },
});
