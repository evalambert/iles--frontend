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

function toDisplayDate(value) {
    if (!value) return '';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return '';
    const month = String(parsed.getMonth() + 1).padStart(2, '0');
    const day = String(parsed.getDate()).padStart(2, '0');
    const year = String(parsed.getFullYear()).slice(-2);
    return `${month}/${day}/${year}`;
}

function toDisplayDateRange(startDate, endDate) {
    const start = toDisplayDate(startDate);
    const end = toDisplayDate(endDate);
    if (start && end) return `${start} - ${end}`;
    return start || end || '';
}

export default function NewsPreview({ news = [] }) {
    const normalizedNews = useMemo(() => normalizeNewsList(news), [news]);
    const [activeIndex, setActiveIndex] = useState(0);
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
    const totalNewsCount = closedNews.length;
    const displayIndex = totalNewsCount
        ? (activeIndex % totalNewsCount) + 1
        : 0;

    const handleReopenAll = () => {
        const store = getNewsOverlayStore();
        store?.reopenAll();
    };

    const renderNewsLine = (item) => (
        <div className='grid h-full grid-cols-4 text-center'>
            <div className='flex items-center justify-center px-2 font-medium'>
                {`Actu ${displayIndex}/${totalNewsCount}`}
            </div>
            <div className='flex items-center justify-center px-2'>
                <span className='truncate'>{item?.Title || ''}</span>
            </div>
            <div className='flex items-center justify-center px-2'>
                <span className='truncate'>
                    {toDisplayDateRange(item?.StartDate, item?.EndDate)}
                </span>
            </div>
            <div className='flex items-center justify-center px-2'>
                <span className='truncate'>
                    {item?.Place || item?.Address || ''}
                </span>
            </div>
        </div>
    );

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
            />
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
            className='h-full w-full text-left cursor-pointer'
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
                        delay: 2500,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: false,
                    }}
                    allowTouchMove={false}
                    className='h-full'
                    onSwiper={(swiper) => setActiveIndex(swiper.realIndex)}
                    onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                >
                    {closedNews.map((item) => (
                        <SwiperSlide key={item.id} className='h-full'>
                            {renderNewsLine(item)}
                        </SwiperSlide>
                    ))}
                </Swiper>
            ) : (
                renderNewsLine(closedNews[0])
            )}
        </div>
    );
}
