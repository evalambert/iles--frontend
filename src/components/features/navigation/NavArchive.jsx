//src/components/features/navigation/NavArchive.jsx
import { normalizeAnchor } from '../../../assets/scripts/utils/normalizeAnchor';
import { useEffect, useState } from 'react';

export default function NavArchive({
    news,
    lang,
    selectedYear,
    selectedCategory,
    activeNewsAnchor,
    onYearSelect,
    onCategorySelect,
}) {
    const newsItems = Array.isArray(news) ? news : [];
    const nowTimestamp = Date.now();
    const archiveAnchorId = normalizeAnchor(lang === 'fr' ? 'Archive' : 'Archive');
    const [isMobileNavHidden, setIsMobileNavHidden] = useState(false);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
    const isDesktopViewport = () => window.matchMedia('(min-width: 1024px)').matches;

    const getTimestamp = (dateValue) => {
        if (!dateValue) return Number.NEGATIVE_INFINITY;
        const timestamp = new Date(dateValue).getTime();
        return Number.isNaN(timestamp) ? Number.NEGATIVE_INFINITY : timestamp;
    };

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

        updatePreference();
        mediaQuery.addEventListener('change', updatePreference);

        return () => {
            mediaQuery.removeEventListener('change', updatePreference);
        };
    }, []);

    useEffect(() => {
        const handleMobileNavToggle = () => {
            setIsMobileNavHidden((prev) => {
                const next = !prev;
                console.log('[NavIndex] mobile-nav:toggle received -> isMobileNavHidden:', next);
                return next;
            });
        };

        window.addEventListener('mobile-nav:toggle', handleMobileNavToggle);

        return () => {
            window.removeEventListener('mobile-nav:toggle', handleMobileNavToggle);
        };
    }, []);

    const handleAnchorClick = () => {
        if (isDesktopViewport()) return;
        setIsMobileNavHidden(true);
    };

    // **** Menu Mobile ONLY ****
    const isArchivePage = typeof window !== 'undefined' && window.location.pathname.endsWith('/archive');
    const navHref = isArchivePage ? `/${lang ?? 'fr'}` : `/${lang ?? 'fr'}/archive`;
    const navLabel = isArchivePage ? (lang === 'en' ? 'Home' : 'Accueil') : 'Archives';
    const otherLang = (lang ?? 'fr') === 'fr' ? 'en' : 'fr';
    const switchLangPath = (() => {
        if (typeof window === 'undefined') return `/${otherLang}`;

        const [_, currentLang, ...rest] = window.location.pathname.split('/');
        if (currentLang === 'fr' || currentLang === 'en') {
            return `/${otherLang}${rest.length ? `/${rest.join('/')}` : ''}`;
        }

        return `/${otherLang}${window.location.pathname.startsWith('/') ? window.location.pathname : `/${window.location.pathname}`}`;
    })();
    // **** END — Menu Mobile ONLY ****


    const years = Array.from(
        new Set(
            newsItems
                .map((item) => item?.StartDate?.slice?.(0, 4))
                .filter(Boolean)
        )
    ).sort((a, b) => Number(b) - Number(a));

    const categories = Array.from(
        new Set(
            newsItems
                .flatMap((item) => item?.event_categories ?? [])
                .map((category) => category?.Name)
                .filter(Boolean)
        )
    ).sort((a, b) => a.localeCompare(b, lang ?? 'fr'));

    const matchesSelectedYear = (item) => {
        if (!selectedYear) return true;
        return item?.StartDate?.startsWith(selectedYear);
    };

    const matchesSelectedCategory = (item) => {
        if (!selectedCategory) return true;
        return (item?.event_categories ?? []).some(
            (category) => category?.Name === selectedCategory
        );
    };

    const getRelevantDateTimestamp = (item) => {
        const endTimestamp = getTimestamp(item?.EndDate);
        if (endTimestamp !== Number.NEGATIVE_INFINITY) return endTimestamp;
        return getTimestamp(item?.StartDate);
    };

    const hasPastEventDate = (item) => {
        const relevantTimestamp = getRelevantDateTimestamp(item);
        return relevantTimestamp !== Number.NEGATIVE_INFINITY && relevantTimestamp < nowTimestamp;
    };

    const filteredNews = newsItems
        .filter(
            (item) =>
                hasPastEventDate(item) &&
                matchesSelectedYear(item) &&
                matchesSelectedCategory(item)
        )
        .sort((a, b) => {
            const relevantDiff = getRelevantDateTimestamp(b) - getRelevantDateTimestamp(a);
            if (relevantDiff !== 0) return relevantDiff;
            return getTimestamp(b?.StartDate) - getTimestamp(a?.StartDate);
        });

    const handleYearClick = (event, year) => {
        event.preventDefault();
        const nextSelectedYear = selectedYear === year ? '' : year;
        onYearSelect?.(nextSelectedYear);
    };

    const handleCategoryClick = (event, category) => {
        event.preventDefault();
        const nextSelectedCategory = selectedCategory === category ? '' : category;
        onCategorySelect?.(nextSelectedCategory);
    };

    const clearYearFilter = () => onYearSelect?.('');
    const clearCategoryFilter = () => onCategorySelect?.('');

    return <>
        <div className='h-header-height hidden lg:flex'>
            <div className='flex-1 border-r'></div>
            <div className='flex-1 lg:border-r'></div>
        </div>
        <div
            id='mobile-nav-panel'
            className='flex h-[calc(100dvh-var(--spacing-header-height))] lg:h-full max-lg:overflow-y-scroll max-lg:fixed max-lg:left-0 max-lg:w-full max-lg:z-20 max-lg:transition-[top] max-lg:duration-500 max-lg:ease-in-out motion-reduce:max-lg:transition-none'
            style={{
                top: isMobileNavHidden ? '-100vh' : 'var(--spacing-header-height)',
                transitionDuration: prefersReducedMotion ? '0ms' : undefined,
            }}
            aria-hidden={isMobileNavHidden}
        >


            <div className='flex-1 border-r flex flex-col' >

                {/* ————————————————————————————————————————————— */}
                {/* Dates */}
                <div className='flex flex-col'>

                    {/* Dates Title */}
                    <button
                        type='button'
                        onClick={clearYearFilter}
                        className='block-title w-full cursor-pointer'
                    >
                        <h2>
                            {lang === "fr" ? 'Dates' : 'Dates'}
                        </h2>
                    </button>


                    <ul className='py-[6px] flex-1 bg-linear-to-t from-primary to-light to-40%'>
                        {years.map((year) => {
                            return (
                                <li
                                    key={year}
                                    className={`nav-li ${selectedYear === year ? 'nav-li-on' : 'nav-li-off'}`}
                                >
                                    <a
                                        href={`#${archiveAnchorId}`}
                                        className='block h-full w-full'
                                        onClick={(event) => handleYearClick(event, year)}
                                        aria-current={selectedYear === year ? 'true' : undefined}
                                    >
                                        {year}
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* ————————————————————————————————————————————— */}
                {/* Natures Filters */}
                <div className='flex-1 flex flex-col border-t'>

                    {/* Natures Title */}
                    <button
                        type='button'
                        onClick={clearCategoryFilter}
                        className='block-title w-full cursor-pointer'
                    >
                        <h2>
                            {lang === 'fr' ? 'Natures' : 'Natures'}
                        </h2>
                    </button>

                    <ul className='py-[6px] flex-1 bg-linear-to-t from-primary to-light to-40%'>
                        {categories.map((category) => {
                            return (
                                <li
                                    key={category}
                                    className={`${selectedCategory === category ? 'nav-li-on' : 'nav-li-off'} nav-li`}
                                >
                                    <a
                                        href={`#${archiveAnchorId}`}
                                        onClick={(event) => handleCategoryClick(event, category)}
                                        className='cursor-pointer w-full h-full block'
                                        aria-current={selectedCategory === category ? 'true' : undefined}
                                    >
                                        {category}
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                {/* Mobile Nav Link */}
                <ul className="lg:hidden border-t hover">
                    <li className='relative overflow-hidden block border-b bg-linear-to-t from-primary to-light to-40% py-[15px] px-[10px] min-h-header-height;'>
                        <a
                            href={navHref}
                            className='h-full w-full flex items-center justify-center text-title'
                        >
                            {navLabel}
                        </a>
                    </li>
                    <li className='relative overflow-hidden block border-b bg-linear-to-t from-primary to-light to-40% py-[15px] px-[10px] min-h-header-height;'>
                        <a
                            href={switchLangPath}
                            className='text-title block min-w-[2ch] text-center'
                            aria-label={`Switch language to ${otherLang.toUpperCase()}`}
                        >
                            {otherLang.toUpperCase()}
                        </a>
                    </li>

                </ul>
            </div>

            <div className='flex-1 lg:border-r flex flex-col' >

                {/* ————————————————————————————————————————————— */}
                {/* Events */}
                <a href={`#${normalizeAnchor(lang === "fr" ? "Événements" : "Events")}`} className="block-title">
                    <h2>
                        {lang === "fr" ? "Événements" : "Events"}
                    </h2>
                </a>

                {/* Events List */}
                <ul className='py-[6px] flex-1 bg-linear-to-t from-primary to-light to-50%'>
                    {filteredNews.map((item) => {
                        const newsAnchor = normalizeAnchor(item.Title);
                        const isActive = activeNewsAnchor === newsAnchor;

                        return (
                            <li key={item.id} className={`nav-li ${isActive ? 'nav-li-on' : 'nav-li-off'}`}>
                                <a
                                    href={`#${newsAnchor}`}
                                    onClick={handleAnchorClick}
                                >
                                    {item.Title}
                                </a>
                            </li>
                        );
                    })}
                </ul>


            </div>
        </div>
    </>;
}
