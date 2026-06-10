// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';

import react from '@astrojs/react';

export default defineConfig({
  output: 'server',

  adapter: cloudflare({
    imageService: 'compile',
    platformProxy: {
      enabled: true,
    },
  }),

  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ['@prisma/client', '.prisma/client'],
    },
  },

  integrations: [react()],

  image: {
    domains: ['lh3.googleusercontent.com', 'zockrnewltaiqzrnsbem.supabase.co'],
  },
});