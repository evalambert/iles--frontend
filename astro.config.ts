import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';


import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: process.env.SITE_URL ?? 'https://lesilesmardi.be',

  output: 'server',

  adapter: vercel({
      imageService: true,
      webAnalytics: {
          enabled: true,
      },
  }),

  i18n: {
      locales: ['fr', 'en'],
      defaultLocale: 'fr',
      routing: {
          prefixDefaultLocale: true,
      },
  },

  integrations: [react()],

  vite: {
    plugins: [tailwindcss()],
  },
});