//src/components/features/news/NewsPreview.jsx
import { useEffect, useMemo, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import {
    getClosedNews,
    getNewsOverlayStore,
} from '../../../assets/scripts/newsOverlayStore';
import { normalizeNewsList } from './newsUtils';

export default function NewsPreview({ news = [] }) {
    const normalizedNews = useMemo(() => normalizeNewsList(news), [news]);
    const [storeState, setStoreState] = useState({
        allNews: normalizedNews,
        openIds: normalizedNews.map((item) => item.id),
    });

    useEffect(() => {
        const store = getNewsOverlayStore();
        if (!store) return undefined;

        store.initialize(normalizedNews);
        setStoreState(store.getState());
        const unsubscribe = store.subscribe(setStoreState);
        return unsubscribe;
    }, [normalizedNews]);

    const closedNews = useMemo(() => getClosedNews(storeState), [storeState]);

    const handleReopenAll = () => {
        const store = getNewsOverlayStore();
        store?.reopenAll();
    };

    if (!closedNews.length) {
        return (
            <div
                role='button'
                tabIndex={0}
                onClick={handleReopenAll}
                onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        handleReopenAll();
                    }
                }}
                className='h-full w-full text-center'
                aria-label='Reouvrir les actualites'
            >
                <span className='font-semibold'>News preview</span>
            </div>
        );
    }

    return (
        <div
            role='button'
            tabIndex={0}
            onClick={handleReopenAll}
            onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    handleReopenAll();
                }
            }}
            className='h-full w-full text-left'
            aria-label='Reouvrir tous les post-it'
        >
            {closedNews.length > 1 ? (
                <Swiper
                    modules={[A11y, Autoplay, EffectFade]}
                    slidesPerView={1}
                    loop
                    effect='fade'
                    fadeEffect={{ crossFade: true }}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: false,
                    }}
                    allowTouchMove={false}
                    className='h-full'
                >
                    {closedNews.map((item) => (
                        <SwiperSlide key={item.id} className='h-full'>
                            <div className='flex h-full flex-col justify-center px-14'>
                                <p className='truncate text-xs'>{item.date || ' '}</p>
                                <p className='truncate text-sm'>{item.title}</p>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            ) : (
                <div className='flex h-full flex-col justify-center px-14'>
                    <p className='truncate text-xs'>{closedNews[0]?.date || ' '}</p>
                    <p className='truncate text-sm'>{closedNews[0]?.title || ''}</p>
                </div>
            )}
        </div>
    );
}
