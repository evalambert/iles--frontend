//src/components/features/navigation/NavIndex.jsx
import { useEffect, useState } from 'react';
import { normalizeAnchor } from '../../../assets/scripts/utils/normalizeAnchor';

export default function NavIndex({ about, members, lang, selectedPractice, activeAboutAnchor, activeMemberAnchor, onPracticeSelect }) {
    const [isMobileNavHidden, setIsMobileNavHidden] = useState(false);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    // **** Menu Mobile ONLY ****
    const isEventsPage =
        typeof window !== 'undefined' &&
        (window.location.pathname.endsWith('/events') ||
            window.location.pathname.endsWith('/evenements') ||
            window.location.pathname.endsWith('/event') ||
            window.location.pathname.endsWith('/evenement') ||
            window.location.pathname.endsWith('/archive'));
    const eventPath = (lang ?? 'fr') === 'en' ? `/${lang ?? 'fr'}/events` : `/${lang ?? 'fr'}/evenements`;
    const navHref = isEventsPage ? `/${lang ?? 'fr'}` : eventPath;
    const navLabel = isEventsPage ? (lang === 'en' ? 'Home' : 'Accueil') : lang === "en" ? "Events" : "Événements";
    const otherLang = (lang ?? 'fr') === 'fr' ? 'en' : 'fr';
    const switchLangPath = (() => {
        if (typeof window === 'undefined') return `/${otherLang}`;

        const [_, currentLang, ...rest] = window.location.pathname.split('/');
        if (currentLang === 'fr' || currentLang === 'en') {
            const mappedRest = [...rest];
            if (mappedRest.length > 0) {
                const lastIndex = mappedRest.length - 1;
                if (mappedRest[lastIndex] === 'evenements') mappedRest[lastIndex] = 'events';
                if (mappedRest[lastIndex] === 'events') mappedRest[lastIndex] = 'evenements';
                if (mappedRest[lastIndex] === 'evenement') mappedRest[lastIndex] = 'events';
                if (mappedRest[lastIndex] === 'event') mappedRest[lastIndex] = 'evenements';
                if (mappedRest[lastIndex] === 'archive') {
                    mappedRest[lastIndex] = otherLang === 'fr' ? 'evenements' : 'events';
                }
            }
            return `/${otherLang}${mappedRest.length ? `/${mappedRest.join('/')}` : ''}`;
        }

        return `/${otherLang}${window.location.pathname.startsWith('/') ? window.location.pathname : `/${window.location.pathname}`}`;
    })();
    // **** END — Menu Mobile ONLY ****


    const matchesSelectedPractice = (member) => {
        if (!selectedPractice) return true;
        return (member?.practices ?? []).some((practice) => practice?.Name === selectedPractice);
    };

    const getMemberFullName = (member) => `${member?.FirstName ?? ''} ${member?.LastName ?? ''}`.trim();

    const membersAnchorId = normalizeAnchor(lang === "fr" ? "Membres" : "Members");
    const isDesktopViewport = () => window.matchMedia('(min-width: 1024px)').matches;

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

    const handlePracticeClick = (event, practice) => {
        event.preventDefault();

        const nextSelectedPractice = selectedPractice === practice ? '' : practice;

        onPracticeSelect(nextSelectedPractice);

        if (isDesktopViewport()) {
            scrollToMembersAnchor();
        }
    };

    const scrollToMembersAnchor = () => {
        const targetHash = `#${membersAnchorId}`;

        if (window.location.hash !== targetHash) {
            window.history.replaceState(null, '', targetHash);
        }
    };

    const handlePracticesTitleClick = () => {
        onPracticeSelect('');
        if (isDesktopViewport()) {
            scrollToMembersAnchor();
        }
    };

    const filteredMembers = (members ?? []).filter(matchesSelectedPractice);
    const aboutAnchors = about?.Sections?.map((section) => section.Title) ?? [];
    const membersAnchors =
        filteredMembers
            ?.map((member) => getMemberFullName(member))
            .filter(Boolean) ?? [];
    const practicesAnchors = Array.from(
        new Set(
            members
                ?.flatMap((member) => member?.practices ?? [])
                .map((practice) => practice?.Name)
                .filter(Boolean) ?? []
        )
    );

    return (
        <>
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
                    {/* About */}
                    <div className='flex flex-col'>

                        {/* About Title */}
                        <a href={`#${normalizeAnchor(lang === "fr" ? "À propos" : "About")}`} className="block-title">
                            <h2>
                                {lang === "fr" ? "À propos" : "About"}
                            </h2>
                        </a>

                        {/* About ANCHORS */}
                        <ul className='py-[6px] flex-1 bg-linear-to-t from-primary to-light to-40%'>
                            {aboutAnchors.map((anchor) => {
                                const anchorId = normalizeAnchor(anchor);
                                const isActive = activeAboutAnchor === anchorId;

                                return (
                                    <li key={anchor} className={`nav-li ${isActive ? 'nav-li-on' : 'nav-li-off'}`}>
                                        <a
                                            href={`#${anchorId}`}
                                            className='block h-full w-full'
                                            onClick={handleAnchorClick}
                                            aria-current={isActive ? 'true' : undefined}
                                        >
                                            {anchor}
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    {/* ————————————————————————————————————————————— */}
                    {/* Practices */}
                    <div className='flex-1 border-t flex flex-col'>

                        {/* Practices Title */}
                        <button
                            type="button"
                            onClick={handlePracticesTitleClick}
                            // className={`${selectedPractice === '' ? 'block-title--on' : ''} block-title w-full cursor-pointer`}
                            className={`block-title w-full cursor-pointer`}
                        >
                            <h2>{lang === "fr" ? "Pratiques" : "Practices"}</h2>
                        </button>

                        {/* Practices List */}
                        <ul className='py-[6px] flex-1 bg-linear-to-t from-primary to-light to-40%'>
                            {practicesAnchors.map((practice) => {
                                return (
                                    <li key={practice}
                                        className={`${selectedPractice === practice ? 'nav-li-on' : 'nav-li-off'} nav-li`}>
                                        <a
                                            href={`#${membersAnchorId}`}
                                            onClick={(event) => handlePracticeClick(event, practice)}
                                            className='cursor-pointer w-full h-full block'
                                            aria-current={selectedPractice === practice ? 'true' : undefined}
                                        >
                                            {practice}
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>

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
                </div>

                <div className='flex-1 lg:border-r flex flex-col' >

                    {/* ————————————————————————————————————————————— */}
                    {/* Members */}
                    <a href={`#${normalizeAnchor(lang === "fr" ? "Membres" : "Members")}`} className="block-title">
                        <h2>
                            {lang === "fr" ? "Membres" : "Members"}
                        </h2>
                    </a>

                    {/* Members List */}
                    <ul className='py-[6px] flex-1 bg-linear-to-t from-primary to-light to-50%'>
                        {membersAnchors.map((anchor) => {
                            const anchorId = normalizeAnchor(anchor);
                            const isActive = activeMemberAnchor === anchorId;

                            return (
                                <li key={anchor} className={`nav-li ${isActive ? 'nav-li-on' : 'nav-li-off'}`}>
                                    <a
                                        href={`#${anchorId}`}
                                        className='block h-full w-full'
                                        onClick={handleAnchorClick}
                                        aria-current={isActive ? 'true' : undefined}
                                    >
                                        {anchor}
                                    </a>
                                </li>
                            );
                        })}
                    </ul>


                </div>
            </div>
        </>
    );
}
