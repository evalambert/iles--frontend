function extractText(value) {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (Array.isArray(value)) {
        return value
            .map((item) => extractText(item))
            .filter(Boolean)
            .join(' ');
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

function parseDate(value) {
    if (!value) return null;
    const raw = String(value).trim();
    if (!raw) return null;

    const isoDateOnly = /^\d{4}-\d{2}-\d{2}$/;
    const parsed = isoDateOnly.test(raw)
        ? new Date(`${raw}T00:00:00`)
        : new Date(raw);

    if (Number.isNaN(parsed.getTime())) return null;
    return parsed;
}

function getTodayStart() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function isCurrentOrFuture(rawItem) {
    const attrs = rawItem?.attributes ?? rawItem ?? {};
    const startDate = parseDate(
        pickFirst(
            attrs.StartDate,
            attrs.startDate,
            attrs.EventDate,
            attrs.eventDate
        )
    );
    const endDate = parseDate(pickFirst(attrs.EndDate, attrs.endDate));
    const today = getTodayStart();

    // Un event "en cours" reste visible tant que sa date de fin n'est pas depassee.
    if (endDate) return endDate >= today;
    if (startDate) return startDate >= today;
    return true;
}

function normalizeParagraphs(paragraphs = []) {
    if (!Array.isArray(paragraphs)) return [];
    return paragraphs.map((paragraph) => ({
        id: paragraph?.id,
        Subtitle: paragraph?.Subtitle || '',
        Text: extractText(paragraph?.Text),
    }));
}

function normalizeLinks(links = []) {
    if (!Array.isArray(links)) return [];
    return links.map((link) => ({
        id: link?.id,
        Url: link?.Url || '',
        LinkTitle: link?.LinkTitle || '',
    }));
}

function normalizeRendezVous(items = []) {
    if (!Array.isArray(items)) return [];
    return items.map((item) => ({
        id: item?.id,
        EventDate: item?.EventDate || '',
        StartHour: item?.StartHour || '',
        EndHour: item?.EndHour || '',
        Place: item?.Place || '',
        Address: item?.Address || '',
        Title: item?.Title || '',
        Text: extractText(item?.Text),
    }));
}

function normalizeEventCategories(categories = []) {
    if (!Array.isArray(categories)) return [];
    return categories.map((category) => ({
        id: category?.id,
        Name: category?.Name || '',
    }));
}

export function normalizeNewsItem(rawItem, index = 0) {
    if (!rawItem) return null;

    const attrs = rawItem.attributes ?? rawItem;
    const id = rawItem.id ?? attrs.id ?? `news-${index}`;
    const title = pickFirst(attrs.Title, attrs.title, attrs.Name, attrs.name);
    const startDate = pickFirst(
        attrs.StartDate,
        attrs.startDate,
        attrs.EventDate,
        attrs.eventDate,
        attrs.Date,
        attrs.date,
        attrs.publishedAt,
        attrs.createdAt
    );
    const text = pickFirst(
        attrs.Excerpt,
        attrs.excerpt,
        extractText(attrs.Text),
        extractText(attrs.text),
        extractText(attrs.Chapo),
        extractText(attrs.Content),
        extractText(attrs.content)
    );
    const place = pickFirst(attrs.Place, attrs.place, attrs.City, attrs.city);
    const address = pickFirst(attrs.Address, attrs.address);
    const endDate = pickFirst(attrs.EndDate, attrs.endDate);
    const country = pickFirst(attrs.Country, attrs.country);
    const city = pickFirst(attrs.City, attrs.city);

    if (!title && !text) return null;

    return {
        id,
        Title: title || 'Actualite',
        StartDate: startDate,
        EndDate: endDate,
        Country: country,
        City: city,
        Place: place,
        Address: address,
        Text: text,
        ExternalEvent: attrs.ExternalEvent ?? null,
        Paragraphs: normalizeParagraphs(attrs.Paragraphs),
        Links: normalizeLinks(attrs.Links),
        RendezVous: normalizeRendezVous(attrs.RendezVous),
        event_categories: normalizeEventCategories(attrs.event_categories),
        Images: Array.isArray(attrs.Images) ? attrs.Images : [],
        locale: attrs.locale || '',
    };
}

export function normalizeNewsList(news) {
    const rawList = Array.isArray(news) ? news : (news?.data ?? []);
    return rawList
        .filter(isCurrentOrFuture)
        .map((item, index) => normalizeNewsItem(item, index))
        .filter(Boolean);
}
