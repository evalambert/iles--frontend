//src/assets/scripts/libs/strapi.js

// assets/scripts/libs/strapi.js

/**
 * Fetches data from the Strapi API
 * @param {Object} options - The options object
 * @param {string} options.endpoint - The endpoint to fetch from
 * @param {Object} [options.query] - The query parameters to add to the url
 * @param {string} [options.wrappedByKey] - The key to unwrap the response from
 * @param {boolean} [options.wrappedByList] - If the response is a list, unwrap it
 * @param {string} [options.locale] - The locale for the content
 * @returns {Promise}
 */
export default async function fetchApi({
    endpoint,
    query,
    wrappedByKey,
    wrappedByList,
    locale,
}) {
    if (endpoint.startsWith('/')) {
        endpoint = endpoint.slice(1);
    }

    const API_URL = 'https://railwayapp-strapi-production-fad3.up.railway.app';
    const url = new URL(`${API_URL}/api/${endpoint}`);

    if (query) {
        Object.entries(query).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });
    }

    if (locale) {
        url.searchParams.append('locale', locale);
    }

    try {
        const res = await fetch(url.toString());
        let data = await res.json();

        if (wrappedByKey) {
            data = data[wrappedByKey] ?? null; // sécurité si clé inexistante
        }

        if (wrappedByList && data) {
            data = data[wrappedByList] ?? data; // si clé inexistante, retourne tableau complet
        }

        return data ?? []; // retourne toujours un tableau au minimum
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        throw error;
    }
}

/**
 * Récupère toutes les entrées d'un endpoint paginé Strapi
 */
export async function fetchAllPaginated({
    endpoint,
    query = {},
    locale,
    pageSize = 100,
}) {
    let page = 1;
    let pageCount = 1;
    const allItems = [];

    while (page <= pageCount) {
        const response = await fetchApi({
            endpoint,
            query: {
                ...query,
                'pagination[page]': String(page),
                'pagination[pageSize]': String(pageSize),
            },
            locale,
        });

        const pageItems = response?.data ?? [];
        allItems.push(...pageItems);
        pageCount = response?.meta?.pagination?.pageCount ?? 1;
        page += 1;
    }

    return allItems;
}
