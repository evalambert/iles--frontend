function extractText(value) {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (Array.isArray(value)) {
        return value.map((item) => extractText(item)).filter(Boolean).join(' ');
    }
    if (typeof value === 'object') {
        if (typeof value.text === 'string') return value.text;
        if (Array.isArray(value.children)) {
            return value.children
                .map((child) => extractText(child))
                .filter(Boolean)
                .join(' ');
        }
    }
    return '';
}

function pickFirst(...values) {
    for (const value of values) {
        if (typeof value === 'string' && value.trim()) return value.trim();
        if (typeof value === 'number') return String(value);
    }
    return '';
}

function toDisplayDate(value) {
    if (!value) return '';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return '';
    return parsed.toLocaleDateString('fr-FR');
}

export function normalizeNewsItem(rawItem, index = 0) {
    if (!rawItem) return null;

    const attrs = rawItem.attributes ?? rawItem;
    const id = rawItem.id ?? attrs.id ?? `news-${index}`;
    const title = pickFirst(attrs.Title, attrs.title, attrs.Name, attrs.name);
    const dateRaw = pickFirst(
        attrs.Date,
        attrs.date,
        attrs.publishedAt,
        attrs.createdAt
    );
    const excerpt = pickFirst(
        attrs.Excerpt,
        attrs.excerpt,
        extractText(attrs.Chapo),
        extractText(attrs.Content),
        extractText(attrs.content)
    );
    const author = pickFirst(attrs.Author, attrs.author, attrs.Source, attrs.source);

    if (!title && !excerpt) return null;

    return {
        id,
        title: title || 'Actualite',
        date: toDisplayDate(dateRaw),
        author,
        excerpt,
    };
}

export function normalizeNewsList(news) {
    const rawList = Array.isArray(news) ? news : news?.data ?? [];
    return rawList
        .map((item, index) => normalizeNewsItem(item, index))
        .filter(Boolean);
}
