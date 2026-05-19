export const SITE_NAME = 'LES ÎLES MARDI';

export const LOCALES = ['fr', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'fr';

export const DEFAULT_OG_IMAGE = '/animation/iles-mardi.png';

type PageKey = 'home' | 'news';

type PageSeo = {
    title: string;
    description: string;
};

export const SEO_BY_PAGE: Record<Locale, Record<PageKey, PageSeo>> = {
    fr: {
        home: {
            title: SITE_NAME,
            description:
                'Gérées par et pour les artistes, Les Îles Mardi constituent un laboratoire de création fonctionnant sur un modèle coopératif : une plateforme dédiée à la collaboration, à l’horizontalité. Créées en 2021, Les Îles Mardi se sont développées jusqu’à accueillir aujourd’hui 40 créateur·ices et initiatives artistiques multidisciplinaires au sein d’un bâtiment réaffecté du quartier européen.',
        },
        news: {
            title: 'Actus',
            description:
                'Gérées par et pour les artistes, Les Îles Mardi constituent un laboratoire de création fonctionnant sur un modèle coopératif : une plateforme dédiée à la collaboration, à l’horizontalité. Créées en 2021, Les Îles Mardi se sont développées jusqu’à accueillir aujourd’hui 40 créateur·ices et initiatives artistiques multidisciplinaires au sein d’un bâtiment réaffecté du quartier européen.',
        },
    },
    en: {
        home: {
            title: SITE_NAME,
            description:
                'Run by and for artists, Les Îles Mardi is a creative hub operating on a cooperative model: a platform dedicated to collaboration and horizontal structures. Founded in 2021, Les Îles Mardi has grown to now host 40 creators and multidisciplinary artistic initiatives within a repurposed building in the European Quarter.',
        },
        news: {
            title: 'News',
            description:
                'Run by and for artists, Les Îles Mardi is a creative hub operating on a cooperative model: a platform dedicated to collaboration and horizontal structures. Founded in 2021, Les Îles Mardi has grown to now host 40 creators and multidisciplinary artistic initiatives within a repurposed building in the European Quarter.',
        },
    },
};

export function formatPageTitle(pageTitle: string): string {
    if (pageTitle === SITE_NAME) return SITE_NAME;
    return `${pageTitle} | ${SITE_NAME}`;
}

export function getPageSeo(lang: string, page: PageKey): PageSeo {
    const locale = (
        LOCALES.includes(lang as Locale) ? lang : DEFAULT_LOCALE
    ) as Locale;
    return SEO_BY_PAGE[locale][page];
}

/** Chemins alternatifs hreflang pour la page courante (/fr/, /en/news, …). */
export function getAlternatePaths(
    pathname: string
): { lang: Locale; path: string }[] {
    const segments = pathname.split('/').filter(Boolean);
    const hasLocalePrefix = LOCALES.includes(segments[0] as Locale);

    return LOCALES.map((locale) => {
        const altSegments = hasLocalePrefix
            ? [locale, ...segments.slice(1)]
            : [locale, ...segments];
        const path = `/${altSegments.join('/')}${pathname.endsWith('/') ? '/' : ''}`;
        return { lang: locale, path };
    });
}

export function toAbsoluteUrl(site: string | URL, path: string): string {
    return new URL(path, site).href;
}
