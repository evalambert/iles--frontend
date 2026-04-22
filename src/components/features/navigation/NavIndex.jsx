//src/components/features/navigation/NavIndex.jsx
import TitleBlock from '../../common/TitleBlock';

export default function NavIndex({ about, members, lang }) {
    const aboutAnchors = about?.Sections?.map((section) => section.Title) ?? [];
    const membersAnchors =
        members
            ?.map((member) => `${member?.FirstName ?? ''} ${member?.LastName ?? ''}`.trim())
            .filter(Boolean) ?? [];

    // Fonction pour normaliser une chaîne de texte en une chaîne de caractères valide pour un anc
    const normalizeAnchor = (value) =>
        value
            ?.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-zA-Z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-')
            .toLowerCase();

    return (
        <>
            <div className='h-header-height flex'>
                <div className='flex-1 border-r'></div>
                <div className='flex-1 lg:border-r'></div>
            </div>
            <div className='flex h-full'>

                <div className='flex-1  border-r' >

                    <TitleBlock title={lang === "fr" ? "À propos" : "About"} />

                    <ul>
                        {aboutAnchors.map((anchor) => (
                            <li key={anchor}>
                                <a href={`#${normalizeAnchor(anchor)}`}>{anchor}</a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className='flex-1 lg:border-r'>
                    <TitleBlock title={lang === "fr" ? "Membres" : "Members"} />
                    <ul>
                        {membersAnchors.map((anchor) => (
                            <li key={anchor}>
                                <a href={`#${normalizeAnchor(anchor)}`}>{anchor}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}
