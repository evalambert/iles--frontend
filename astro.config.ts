import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

export default defineConfig({
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

    vite: {
        plugins: [tailwindcss()],
    },

    integrations: [react()],
});


