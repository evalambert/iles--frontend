//src/components/features/navigation/NavArchive.jsx
import { normalizeAnchor } from '../../../assets/scripts/utils/normalizeAnchor';
import { useEffect, useState } from 'react';

export default function NavArchive({
    news,
    lang,
    selectedPeriod,
    selectedCategory,
    activeNewsAnchor,
    onPeriodSelect,
    onCategorySelect,
}) {
    const newsItems = Array.isArray(news) ? news : [];
    const archiveAnchorId = normalizeAnchor(lang === 'fr' ? 'Actus' : 'News');
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

    useEffect(() => {
        const handleScrollHide = () => {
            if (isDesktopViewport()) return;
            setIsMobileNavHidden(true);
        };

        window.addEventListener('scroll', handleScrollHide, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScrollHide);
        };
    }, []);

    const handleAnchorClick = () => {
        if (isDesktopViewport()) return;
        setIsMobileNavHidden(true);
    };

    // **** Menu Mobile ONLY ****
    const isEventsPage =
        typeof window !== 'undefined' &&
        (window.location.pathname.endsWith('/news') ||
            window.location.pathname.endsWith('/events') ||
            window.location.pathname.endsWith('/evenements') ||
            window.location.pathname.endsWith('/event') ||
            window.location.pathname.endsWith('/evenement') ||
            window.location.pathname.endsWith('/archive'));
    const eventPath = `/${lang ?? 'fr'}/news`;
    const navHref = isEventsPage ? `/${lang ?? 'fr'}` : eventPath;
    const navLabel = isEventsPage ? (lang === 'en' ? 'Home' : 'Accueil') : lang === "en" ? "News" : "Actualités";
    const otherLang = (lang ?? 'fr') === 'fr' ? 'en' : 'fr';
    const switchLangPath = (() => {
        if (typeof window === 'undefined') return `/${otherLang}`;

        const rawPathname = window.location.pathname;
        const normalizedPathname =
            rawPathname === '/' ? '/' : rawPathname.replace(/\/+$/, '');

        const [_, currentLang, ...rest] = normalizedPathname.split('/');
        if (currentLang === 'fr' || currentLang === 'en') {
            const mappedRest = [...rest];
            if (mappedRest.length > 0) {
                const lastIndex = mappedRest.length - 1;
                if (mappedRest[lastIndex] === 'evenements') mappedRest[lastIndex] = 'news';
                if (mappedRest[lastIndex] === 'events') mappedRest[lastIndex] = 'news';
                if (mappedRest[lastIndex] === 'evenement') mappedRest[lastIndex] = 'news';
                if (mappedRest[lastIndex] === 'event') mappedRest[lastIndex] = 'news';
                if (mappedRest[lastIndex] === 'archive') {
                    mappedRest[lastIndex] = 'news';
                }
            }
            return `/${otherLang}${mappedRest.length ? `/${mappedRest.join('/')}` : ''}`;
        }

        return `/${otherLang}${
            normalizedPathname.startsWith('/') ? normalizedPathname : `/${normalizedPathname}`
        }`;
    })();
    // **** END — Menu Mobile ONLY ****


    const categories = Array.from(
        new Set(
            newsItems
                .flatMap((item) => item?.event_categories ?? [])
                .map((category) => category?.Name)
                .filter(Boolean)
        )
    ).sort((a, b) => a.localeCompare(b, lang ?? 'fr'));

    const matchesSelectedPeriod = (item) => {
        if (!selectedPeriod) return true;
        const endTimestamp = getTimestamp(item?.EndDate);
        const nowTimestamp = Date.now();

        if (selectedPeriod === 'upcoming') {
            return endTimestamp > nowTimestamp;
        }

        if (selectedPeriod === 'past') {
            return endTimestamp <= nowTimestamp;
        }

        return true;
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

    const filteredNews = newsItems
        .filter(
            (item) =>
                matchesSelectedPeriod(item) &&
                matchesSelectedCategory(item)
        )
        .sort((a, b) => {
            const relevantDiff = getRelevantDateTimestamp(b) - getRelevantDateTimestamp(a);
            if (relevantDiff !== 0) return relevantDiff;
            return getTimestamp(b?.StartDate) - getTimestamp(a?.StartDate);
        });

    const handlePeriodClick = (event, period) => {
        event.preventDefault();
        const nextSelectedPeriod = selectedPeriod === period ? '' : period;
        onPeriodSelect?.(nextSelectedPeriod);
    };

    const handleCategoryClick = (event, category) => {
        event.preventDefault();
        const nextSelectedCategory = selectedCategory === category ? '' : category;
        onCategorySelect?.(nextSelectedCategory);
    };

    const clearPeriodFilter = () => onPeriodSelect?.('');
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
                        onClick={clearPeriodFilter}
                        className='block-title w-full cursor-pointer'
                    >
                        <h2>
                            {lang === "fr" ? 'Période' : 'Period'}
                        </h2>
                    </button>


                    <ul className='py-[10px] flex-1 bg-linear-to-t from-primary to-light to-40%'>
                        {[
                            { value: 'upcoming', label: lang === 'fr' ? 'À venir' : 'Upcoming' },
                            { value: 'past', label: lang === 'fr' ? 'Passé' : 'Past' },
                        ].map((period) => {
                            return (
                                <li
                                    key={period.value}
                                    className={`nav-li ${selectedPeriod === period.value ? 'nav-li-on' : 'nav-li-off'}`}
                                >
                                    <a
                                        href={`#${archiveAnchorId}`}
                                        className='block h-full w-full'
                                        onClick={(event) => handlePeriodClick(event, period.value)}
                                        aria-current={selectedPeriod === period.value ? 'true' : undefined}
                                    >
                                        {period.label}
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* ————————————————————————————————————————————— */}
                {/* Categories Filters */}
                <div className='flex-1 flex flex-col border-t'>

                    {/* Categories Title */}
                    <button
                        type='button'
                        onClick={clearCategoryFilter}
                        className='block-title w-full cursor-pointer'
                    >
                        <h2>
                            {lang === 'fr' ? 'Catégories' : 'Categories'}
                        </h2>
                    </button>

                    <ul className='py-[10px] flex-1 bg-linear-to-t from-primary to-light to-40%'>
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
                <ul className="lg:hidden border-t hover max-md:flex">
                    <li className='relative overflow-hidden block border-b bg-linear-to-t from-primary to-light to-40% py-[15px] px-[10px] min-h-header-height max-md:flex-1 max-md:border-r'>
                        <a
                            href={navHref}
                            className='h-full w-full flex items-center justify-center text-title'
                        >
                            {navLabel}
                        </a>
                    </li>
                    <li className='relative overflow-hidden block border-b bg-linear-to-t from-primary to-light to-40% py-[15px] px-[10px] min-h-header-height max-md:flex-1'>
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
                {/* News */}
                <a href={`#${normalizeAnchor(lang === "fr" ? "Actualités" : "News")}`} className="block-title">
                    <h2>
                        {lang === "fr" ? "Actualités" : "News"}
                    </h2>
                </a>

                {/* Events List */}
                <ul className='py-[10px] flex-1 bg-linear-to-t from-primary to-light to-50%'>
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
