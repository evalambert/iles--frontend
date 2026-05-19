// Entrée homepage : post-its flottants uniquement depuis l'extérieur du site
export const NEWS_STICKY_SKIP_SESSION_KEY = 'iles-news-sticky-skipped';

export function isHomeIndexPath(pathname = '') {
    if (pathname === '/' || pathname === '') return true;
    return /^\/(fr|en)\/?$/.test(pathname);
}

export function isSameOriginReferrer(referrer = '') {
    if (!referrer || typeof window === 'undefined') return false;
    try {
        return new URL(referrer).origin === window.location.origin;
    } catch {
        return false;
    }
}

export function hasSkippedStickyEntryThisSession() {
    if (typeof window === 'undefined') return false;
    try {
        return (
            window.sessionStorage.getItem(NEWS_STICKY_SKIP_SESSION_KEY) === '1'
        );
    } catch {
        return false;
    }
}

export function markStickyEntrySkippedForSession() {
    if (typeof window === 'undefined') return;
    try {
        window.sessionStorage.setItem(NEWS_STICKY_SKIP_SESSION_KEY, '1');
    } catch {
        /* mode privé, quota, etc. */
    }
    window.__newsStickySkipEntry = true;
}

/** true = afficher les post-its (arrivée externe sur l'index) */
export function shouldPlayStickyNotesEntry() {
    if (typeof window === 'undefined') return true;
    if (window.__newsStickySkipEntry === true) return false;
    if (!isHomeIndexPath(window.location.pathname)) return false;
    if (hasSkippedStickyEntryThisSession()) return false;
    if (isSameOriginReferrer(document.referrer)) return false;
    return true;
}

/** Safe SSR : false côté serveur, évalué au montage client */
export function shouldStartWithAllClosed() {
    if (typeof window === 'undefined') return false;
    return (
        isHomeIndexPath(window.location.pathname) &&
        !shouldPlayStickyNotesEntry()
    );
}
