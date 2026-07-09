// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node';

import react from '@astrojs/react';

import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'server',

  adapter: vercel(),

  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },

  vite: {
    plugins: [tailwindcss()],
    ssr: {
      external: ['@prisma/client', '@prisma/adapter-pg', 'pg'],
    },
  },

  integrations: [react()],

  image: {
    domains: ['lh3.googleusercontent.com', 'zockrnewltaiqzrnsbem.supabase.co'],
  },
});