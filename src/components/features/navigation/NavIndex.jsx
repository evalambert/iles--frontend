//src/components/features/navigation/NavIndex.jsx
import { normalizeAnchor } from '../../../assets/scripts/utils/normalizeAnchor';

export default function NavIndex({ about, members, lang, selectedPractice, activeAboutAnchor, activeMemberAnchor, onPracticeSelect }) {
    const matchesSelectedPractice = (member) => {
        if (!selectedPractice) return true;
        return (member?.practices ?? []).some((practice) => practice?.Name === selectedPractice);
    };

    const getMemberFullName = (member) => `${member?.FirstName ?? ''} ${member?.LastName ?? ''}`.trim();

    const membersAnchorId = normalizeAnchor(lang === "fr" ? "Membres" : "Members");
    const isDesktopViewport = () => window.matchMedia('(min-width: 1024px)').matches;

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
            <div className='h-header-height flex'>
                <div className='flex-1 border-r'></div>
                <div className='flex-1 lg:border-r'></div>
            </div>
            <div className='flex h-full'>


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
                    <div className='flex-1 border-t'>

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
                        <ul className='py-[6px] h-full bg-linear-to-t from-primary to-light to-40%'>
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
