import { useEffect, useMemo, useState } from 'react';
import NewsStickyNote from './NewsStickyNote';
import {
    getNewsOverlayStore,
    getOpenNews,
} from '../../../assets/scripts/newsOverlayStore';
import { normalizeNewsList } from './newsUtils';

const BASE_Z_INDEX = 70;

function createInitialPosition(index) {
    return {
        x: 80 + (index % 3) * 140,
        y: 110 + index * 36,
    };
}

export default function NewsStickyOverlay({ news = [] }) {
    const normalizedNews = useMemo(() => normalizeNewsList(news), [news]);
    const [storeState, setStoreState] = useState({
        allNews: normalizedNews,
        openIds: normalizedNews.map((item) => item.id),
    });
    const [zOrder, setZOrder] = useState([]);

    useEffect(() => {
        const store = getNewsOverlayStore();
        if (!store) return undefined;

        store.initialize(normalizedNews);
        setStoreState(store.getState());
        const unsubscribe = store.subscribe(setStoreState);
        return unsubscribe;
    }, [normalizedNews]);

    const openNews = useMemo(() => getOpenNews(storeState), [storeState]);

    useEffect(() => {
        const ids = openNews.map((item) => item.id);
        setZOrder((current) => {
            const kept = current.filter((id) => ids.includes(id));
            const missing = ids.filter((id) => !kept.includes(id));
            return [...kept, ...missing];
        });
    }, [openNews]);

    const positions = useMemo(() => {
        return openNews.reduce((acc, item, index) => {
            acc[item.id] = createInitialPosition(index);
            return acc;
        }, {});
    }, [openNews]);

    const handleClose = (id) => {
        const store = getNewsOverlayStore();
        store?.closeOne(id);
    };

    const handleBringToFront = (id) => {
        setZOrder((current) => [...current.filter((item) => item !== id), id]);
    };

    if (!openNews.length) return null;

    return (
        <div className='pointer-events-none fixed inset-0 z-[60]'>
            {openNews.map((note) => {
                const orderIndex = zOrder.indexOf(note.id);
                const zIndex =
                    BASE_Z_INDEX +
                    (orderIndex === -1 ? openNews.length : orderIndex);

                return (
                    <div key={note.id} className='pointer-events-auto'>
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
