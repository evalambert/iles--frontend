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
        attrs.StartDate || attrs.startDate || attrs.EventDate || attrs.eventDate
    );
    const endDate = parseDate(attrs.EndDate || attrs.endDate);
    const today = getTodayStart();

    // Un event "en cours" reste visible tant que sa date de fin n'est pas depassee.
    if (endDate) return endDate >= today;
    if (startDate) return startDate >= today;
    return true;
}

export function getCurrentAndFutureNews(news) {
    const rawList = Array.isArray(news) ? news : (news?.data ?? []);
    return rawList
        .filter((item) => item && item.id != null)
        .filter(isCurrentOrFuture);
}
