import { useEffect, useMemo, useState } from 'react';
import { useRef } from 'react';
import NewsStickyNote from './NewsStickyNote';
import {
    getNewsOverlayStore,
    getOpenNews,
} from '../../../assets/scripts/newsOverlayStore';
import { getCurrentAndFutureNews } from './newsUtils';

const BASE_Z_INDEX = 70;
const NOTE_SIZE = 556;
const HEADER_SAFE_OFFSET = 90;
const VIEWPORT_PADDING = 16;
const MIN_GAP = 120;

function getEffectiveNoteSize() {
    if (typeof window === 'undefined') return NOTE_SIZE;
    return Math.floor(
        Math.min(
            NOTE_SIZE,
            window.innerWidth - VIEWPORT_PADDING * 2,
            window.innerHeight - VIEWPORT_PADDING * 2
        )
    );
}
function getEffectiveGap(noteSize) {
    return Math.max(MIN_GAP, Math.floor(noteSize * 0.55));
}

function getBounds() {
    if (typeof window === 'undefined') {
        return {
            minX: 16,
            maxX: 480,
            minY: 120,
            maxY: 420,
        };
    }

    const noteSize = getEffectiveNoteSize();
    const maxX = Math.max(
        VIEWPORT_PADDING,
        window.innerWidth - noteSize - VIEWPORT_PADDING
    );
    const maxY = Math.max(
        HEADER_SAFE_OFFSET,
        window.innerHeight - noteSize - VIEWPORT_PADDING
    );

    return {
        minX: VIEWPORT_PADDING,
        maxX,
        minY: HEADER_SAFE_OFFSET,
        maxY,
    };
}

function getRandomInt(min, max) {
    if (max <= min) return min;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isTooClose(candidate, placed, minGap) {
    return placed.some((position) => {
        const dx = Math.abs(position.x - candidate.x);
        const dy = Math.abs(position.y - candidate.y);
        return dx < minGap && dy < minGap;
    });
}

function generateRandomPositions(items) {
    const bounds = getBounds();
    const noteSize = getEffectiveNoteSize();
    const minGap = getEffectiveGap(noteSize);
    const placed = [];
    const result = {};

    items.forEach((item, index) => {
        let position = null;

        for (let attempt = 0; attempt < 60; attempt += 1) {
            const candidate = {
                x: getRandomInt(bounds.minX, bounds.maxX),
                y: getRandomInt(bounds.minY, bounds.maxY),
                rotation: getRandomInt(-5, 5),
            };

            if (!isTooClose(candidate, placed, minGap)) {
                position = candidate;
                break;
            }
        }

        if (!position) {
            // Fallback quand l'ecran est trop petit pour eviter les collisions.
            position = {
                x: getRandomInt(bounds.minX, bounds.maxX),
                y: getRandomInt(bounds.minY, bounds.maxY),
                rotation: getRandomInt(-5, 5),
            };
            const fallbackStep = Math.max(18, Math.floor(minGap * 0.2));
            position.x = Math.min(
                bounds.maxX,
                position.x + (index % 3) * fallbackStep
            );
            position.y = Math.min(
                bounds.maxY,
                position.y + (index % 4) * fallbackStep
            );
        }

        placed.push(position);
        result[item.id] = position;
    });

    return result;
}

export default function NewsStickyOverlay({ news = [] }) {
    const filteredNews = useMemo(() => getCurrentAndFutureNews(news), [news]);
    const [storeState, setStoreState] = useState({
        allNews: filteredNews,
        openIds: filteredNews.map((item) => item.id),
    });
    const [isHydrated, setIsHydrated] = useState(false);
    const [zOrder, setZOrder] = useState([]);
    const [positions, setPositions] = useState({});
    const previousOpenCountRef = useRef(0);
    const previousReopenVersionRef = useRef(0);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        const store = getNewsOverlayStore();
        if (!store) return undefined;

        store.initialize(filteredNews);
        setStoreState(store.getState());
        const unsubscribe = store.subscribe(setStoreState);
        return unsubscribe;
    }, [filteredNews]);

    const openNews = useMemo(() => getOpenNews(storeState), [storeState]);
    const allPositionsReady = useMemo(
        () => openNews.every((note) => Boolean(positions[note.id])),
        [openNews, positions]
    );

    useEffect(() => {
        const ids = openNews.map((item) => item.id);
        setZOrder((current) => {
            const kept = current.filter((id) => ids.includes(id));
            const missing = ids.filter((id) => !kept.includes(id));
            return [...kept, ...missing];
        });
    }, [openNews]);

    useEffect(() => {
        if (!openNews.length) {
            previousOpenCountRef.current = 0;
            return;
        }

        if (storeState.reopenVersion !== previousReopenVersionRef.current) {
            const randomPositions = generateRandomPositions(openNews);
            setPositions(randomPositions);
            previousOpenCountRef.current = openNews.length;
            previousReopenVersionRef.current = storeState.reopenVersion;
            return;
        }

        if (previousOpenCountRef.current === 0) {
            // Nouveau cycle d'ouverture : positions aleatoires (reload/reouvrir tous)
            const randomPositions = generateRandomPositions(openNews);
            setPositions(randomPositions);
            previousOpenCountRef.current = openNews.length;
            previousReopenVersionRef.current = storeState.reopenVersion;
            return;
        }

        setPositions((current) => {
            const next = {};
            const missingItems = openNews.filter((item) => !current[item.id]);
            const missingPositions = generateRandomPositions(missingItems);
            openNews.forEach((item) => {
                next[item.id] = current[item.id] ?? missingPositions[item.id];
            });
            return next;
        });
        previousOpenCountRef.current = openNews.length;
        previousReopenVersionRef.current = storeState.reopenVersion;
    }, [openNews, storeState.reopenVersion]);

    const handleClose = (id) => {
        const store = getNewsOverlayStore();
        store?.closeOne(id);
    };

    const handleBringToFront = (id) => {
        setZOrder((current) => [...current.filter((item) => item !== id), id]);
    };

    if (!isHydrated || !openNews.length || !allPositionsReady) return null;

    return (
        <div className='pointer-events-none fixed inset-0 z-[60]'>
            {openNews.map((note) => {
                const orderIndex = zOrder.indexOf(note.id);
                const zIndex =
                    BASE_Z_INDEX +
                    (orderIndex === -1 ? openNews.length : orderIndex);

                return (
                    <div
                        key={`${note.id}-${storeState.reopenVersion}`}
                        className='pointer-events-auto'
                    >
                        <NewsStickyNote
                            note={note}
                            initialPosition={positions[note.id]}
                            zIndex={zIndex}
                            onClose={handleClose}
                            onBringToFront={handleBringToFront}
                        />
                    </div>
                );
            })}
        </div>
    );
}
