//src/components/features/navigation/NavIndex.jsx
import { normalizeAnchor } from '../../../assets/scripts/utils/normalizeAnchor';

export default function NavIndex({ about, members, lang, selectedPractice, onPracticeSelect }) {
    const matchesSelectedPractice = (member) => {
        if (!selectedPractice) return true;
        return (member?.practices ?? []).some((practice) => practice?.Name === selectedPractice);
    };

    const filteredMembers = (members ?? []).filter(matchesSelectedPractice);
    const aboutAnchors = about?.Sections?.map((section) => section.Title) ?? [];
    const membersAnchors =
        filteredMembers
            ?.map((member) => `${member?.FirstName ?? ''} ${member?.LastName ?? ''}`.trim())
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


                <div className='flex-1  border-r' >

                    {/* About */}
                    <div>

                        {/* About Title */}
                        <a href={`#${normalizeAnchor(lang === "fr" ? "À propos" : "About")}`} className="block-title">
                            <h2>
                                {lang === "fr" ? "À propos" : "About"}
                            </h2>
                        </a>

                        {/* About ANCHORS */}
                        <ul className='py-[6px]'>
                            {aboutAnchors.map((anchor) => (
                                <li key={anchor} className='nav-li nav-li-off'>
                                    <a href={`#${normalizeAnchor(anchor)}`} className='block h-full w-full'>{anchor}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Practices */}
                    <div className='border-t'>

                        {/* Practices Title */}
                        <button
                            type="button"
                            onClick={() => onPracticeSelect('')}
                            className={`${selectedPractice === '' ? 'text-pink-500' : ''} block-title w-full cursor-pointer`}
                        >
                            <h2>{lang === "fr" ? "Pratiques" : "Practices"}</h2>
                        </button>

                        {/* Practices List */}
                        <ul className='py-[6px]'>
                            {practicesAnchors.map((practice) => (
                                <li key={practice} 
                                className={`${selectedPractice === practice ? 'nav-li-on' : 'nav-li-off'} nav-li`}>
                                    <button
                                        type="button"
                                        onClick={() => onPracticeSelect(selectedPractice === practice ? '' : practice)}
                                        className={`cursor-pointer w-full h-full`}
                                        aria-pressed={selectedPractice === practice}
                                    >
                                        {practice}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className='flex-1 lg:border-r'>

                    {/* Members */}
                    <a href={`#${normalizeAnchor(lang === "fr" ? "Membres" : "Members")}`} className="block-title">
                            <h2>
                                {lang === "fr" ? "Membres" : "Members"}
                            </h2>
                        </a>

                    {/* Members List */}
                    <ul className='py-[6px]'>
                        {membersAnchors.map((anchor) => (
                                 <li key={anchor} className='nav-li nav-li-off'>
                                 <a href={`#${normalizeAnchor(anchor)}`} className='block h-full w-full'>{anchor}</a>
                             </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}
