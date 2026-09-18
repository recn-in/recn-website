import { defineConfig, passthroughImageService } from 'astro/config';

export default defineConfig({
  site: 'https://recn-in.github.io',
  base: '/recn-website/',
  output: 'static',
  redirects: {
    '/desktop': '/recn-website/download/',
    '/mobile': '/recn-website/download/',
  },
  image: {
    service: passthroughImageService(),
  },
});
