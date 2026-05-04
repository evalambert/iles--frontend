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

function toDisplayDateFullYear(value) {
    if (!value) return '';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return '';
    const day = String(parsed.getDate()).padStart(2, '0');
    const month = String(parsed.getMonth() + 1).padStart(2, '0');
    const year = String(parsed.getFullYear());
    return `${day}/${month}/${year}`;
}

function toDisplayDateRange(startDate, endDate, lang) {
    const isEn = lang === 'en';
    const range =
        isEn
            ? ([a, b]) => `from ${a} to ${b}`
            : ([a, b]) => `du ${a} au ${b}`;
    const single = isEn ? (d) => `on ${d}` : (d) => `le ${d}`;

    if (!startDate && !endDate) return '';

    const startParsed = startDate ? new Date(startDate) : null;
    const endParsed = endDate ? new Date(endDate) : null;
    const startValid = startParsed && !Number.isNaN(startParsed.getTime());
    const endValid = endParsed && !Number.isNaN(endParsed.getTime());

    if (startValid && endValid) {
        const sameYear = startParsed.getFullYear() === endParsed.getFullYear();
        const sameMonth = startParsed.getMonth() === endParsed.getMonth();
        const startDay = String(startParsed.getDate()).padStart(2, '0');
        const endDay = String(endParsed.getDate()).padStart(2, '0');
        const endMonth = String(endParsed.getMonth() + 1).padStart(2, '0');
        const endYear = String(endParsed.getFullYear());

        if (sameYear && sameMonth) {
            return range([startDay, `${endDay}/${endMonth}/${endYear}`]);
        }

        return range([
            toDisplayDateFullYear(startDate),
            toDisplayDateFullYear(endDate),
        ]);
    }

    const start = toDisplayDateFullYear(startDate);
    const end = toDisplayDateFullYear(endDate);
    if (start && end) return range([start, end]);
    if (start) return single(start);
    if (end) return single(end);
    return '';
}

function getAttrs(item) {
    return item?.attributes ?? item ?? {};
}

export default function NewsPreview({ news = [], lang = 'fr' }) {
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
    const totalNewsCount = closedNews.length;
    const displayIndex = totalNewsCount
        ? (activeIndex % totalNewsCount) + 1
        : 0;
    const previewStateClass = allOpen
        ? 'news-preview-trigger--inverted'
        : allClosed
          ? 'news-preview-trigger--hover-invert'
          : '';
    const handleReopenAll = () => {
        const store = getNewsOverlayStore();
        store?.reopenAll();
    };

    const renderNewsLine = (item) => {
        const attrs = getAttrs(item);
        const category =
            attrs.event_categories?.[0]?.Name ||
            attrs.event_categories?.[0]?.attributes?.Name ||
            '';
        const lineParts = [
            attrs.Title || '',
            category,
            toDisplayDateRange(attrs.StartDate, attrs.EndDate, lang),
            attrs.Place || attrs.Address || '',
        ].filter(Boolean);

        return (
            <div className='flex h-full items-center justify-between gap-3 px-2 lg:px-[20px]'>
                <div className='min-w-0 flex-1 text-left'>
                    <span className='block truncate'>
                        {lineParts.join(', ')}
                    </span>
                </div>
                <span className='hidden shrink-0 lg:inline'>{`${displayIndex}/${totalNewsCount}`}</span>
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
                className={`news-preview-trigger ${previewStateClass} h-full w-full min-w-0 text-center`}
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
            className={`news-preview-trigger ${previewStateClass} h-full w-full min-w-0 text-left cursor-pointer`}
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
                        onSlideChange={(swiper) =>
                            setActiveIndex(swiper.realIndex)
                        }
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
