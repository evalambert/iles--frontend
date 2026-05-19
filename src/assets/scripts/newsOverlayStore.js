const STORE_KEY = '__ilesNewsOverlayStore__';
const CHANGE_EVENT = 'iles-news-overlay-change';

const initialState = {
    allNews: [],
    openIds: [],
    signature: '',
    initialized: false,
    reopenVersion: 0,
};

function buildSignature(newsList) {
    return newsList.map((item) => item.id).join('|');
}

function cloneState(state) {
    return {
        allNews: [...state.allNews],
        openIds: [...state.openIds],
        signature: state.signature,
        initialized: state.initialized,
        reopenVersion: state.reopenVersion,
    };
}

function createStore() {
    let state = cloneState(initialState);
    const listeners = new Set();

    function emit() {
        const snapshot = cloneState(state);
        listeners.forEach((listener) => listener(snapshot));
        window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: snapshot }));
    }

    return {
        getState() {
            return cloneState(state);
        },
        subscribe(listener) {
            listeners.add(listener);
            return () => listeners.delete(listener);
        },
        initialize(newsList = [], options = {}) {
            const { startWithAllClosed = false } = options;
            const sanitized = Array.isArray(newsList)
                ? newsList.filter((item) => item && item.id != null)
                : [];
            const signature = buildSignature(sanitized);

            if (state.initialized && state.signature === signature) return;

            state = {
                allNews: sanitized,
                openIds: startWithAllClosed
                    ? []
                    : sanitized.map((item) => item.id),
                signature,
                initialized: true,
                reopenVersion: 1,
            };
            emit();
        },
        closeOne(id) {
            if (id == null) return;
            if (!state.openIds.includes(id)) return;
            const nextOpenIds = state.openIds.filter((openId) => openId !== id);
            state = {
                ...state,
                openIds: nextOpenIds,
            };
            emit();
            return nextOpenIds.length === 0;
        },
        reopenAll() {
            if (!state.allNews.length) return;
            state = {
                ...state,
                openIds: state.allNews.map((item) => item.id),
                reopenVersion: state.reopenVersion + 1,
            };
            emit();
        },
    };
}

export function getNewsOverlayStore() {
    if (typeof window === 'undefined') return null;
    if (!window[STORE_KEY]) {
        window[STORE_KEY] = createStore();
    }
    return window[STORE_KEY];
}

export function getClosedNews(state) {
    if (!state) return [];
    const openSet = new Set(state.openIds);
    return state.allNews.filter((item) => !openSet.has(item.id));
}

export function getOpenNews(state) {
    if (!state) return [];
    const openSet = new Set(state.openIds);
    return state.allNews.filter((item) => openSet.has(item.id));
}
