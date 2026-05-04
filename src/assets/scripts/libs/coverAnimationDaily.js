// Clé locale : « déjà vue aujourd’hui » selon le fuseau du navigateur
export const COVER_ANIMATION_DAY_KEY = 'iles-mardi-cover-animation-day';

export function localCalendarDayKey(date = new Date()) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

export function hasPlayedCoverAnimationToday() {
    if (typeof window === 'undefined') return false;
    try {
        return window.localStorage.getItem(COVER_ANIMATION_DAY_KEY) === localCalendarDayKey();
    } catch {
        return false;
    }
}

export function recordCoverAnimationPlayedToday() {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.setItem(COVER_ANIMATION_DAY_KEY, localCalendarDayKey());
    } catch {
        /* mode privé, quota, etc. */
    }
}
