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
import { getCurrentAndFutureNews } from './newsUtils';

function toDisplayDate(value) {
    if (!value) return '';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return '';
    const day = String(parsed.getDate()).padStart(2, '0');
    const month = String(parsed.getMonth() + 1).padStart(2, '0');
    const year = String(parsed.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
}

function toDisplayDateRange(startDate, endDate) {
    if (!startDate && !endDate) return '';

    const startParsed = startDate ? new Date(startDate) : null;
    const endParsed = endDate ? new Date(endDate) : null;
    const startValid = startParsed && !Number.isNaN(startParsed.getTime());
    const endValid = endParsed && !Number.isNaN(endParsed.getTime());

    if (startValid && endValid) {
        const sameYear =
            startParsed.getFullYear() === endParsed.getFullYear();

        if (sameYear) {
            const startDay = String(startParsed.getDate()).padStart(2, '0');
            const startMonth = String(startParsed.getMonth() + 1).padStart(2, '0');
            const endDay = String(endParsed.getDate()).padStart(2, '0');
            const endMonth = String(endParsed.getMonth() + 1).padStart(2, '0');
            const year = String(startParsed.getFullYear()).slice(-2);
            return `${startDay}/${startMonth}-${endDay}/${endMonth}/${year}`;
        }
    }

    const start = toDisplayDate(startDate);
    const end = toDisplayDate(endDate);
    if (start && end) return `${start}-${end}`;
    return start || end || '';
}

function getAttrs(item) {
    return item?.attributes ?? item ?? {};
}

export default function NewsPreview({ news = [] }) {
    const filteredNews = useMemo(() => getCurrentAndFutureNews(news), [news]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [storeState, setStoreState] = useState({
        allNews: filteredNews,
        openIds: filteredNews.map((item) => item.id),
    });

    useEffect(() => {
        const store = getNewsOverlayStore();
        if (!store) return undefined;

        store.initialize(filteredNews);
        setStoreState(store.getState());
        const unsubscribe = store.subscribe(setStoreState);
        return unsubscribe;
    }, [filteredNews]);

    const closedNews = useMemo(() => getClosedNews(storeState), [storeState]);
    const totalCount = storeState.allNews.length;
    const openCount = storeState.openIds.length;
    const allOpen = totalCount > 0 && openCount === totalCount;
    const allClosed = totalCount > 0 && openCount === 0;
    const previewStateClass = allOpen
        ? 'news-preview-trigger--inverted'
        : allClosed
            ? 'news-preview-trigger--hover-invert'
            : '';
    const totalNewsCount = closedNews.length;
    const displayIndex = totalNewsCount
        ? (activeIndex % totalNewsCount) + 1
        : 0;

    const handleReopenAll = () => {
        const store = getNewsOverlayStore();
        store?.reopenAll();
    };

    const renderNewsLine = (item) => {
        const attrs = getAttrs(item);
        return (
            <div className='grid h-full grid-cols-4 text-center'>
                <div className='flex items-center justify-center px-2 font-medium'>
                    {`Actu ${displayIndex}/${totalNewsCount}`}
                </div>
                <div className='flex items-center justify-center px-2'>
                    <span className='truncate'>{attrs.Title || ''}</span>
                </div>
                <div className='flex items-center justify-center px-2'>
                    <span className='truncate'>
                        {toDisplayDateRange(attrs.StartDate, attrs.EndDate)}
                    </span>
                </div>
                <div className='flex items-center justify-center px-2'>
                    <span className='truncate'>
                        {attrs.Place || attrs.Address || ''}
                    </span>
                </div>
            </div>
        );
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
                className={`news-preview-trigger ${previewStateClass} text-center`}
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
            className={`news-preview-trigger ${previewStateClass} text-left cursor-pointer`}
            aria-label='Reouvrir tous les post-it'
        >
            <div className='relative z-10 h-full'>
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
        </div>
    );
}
