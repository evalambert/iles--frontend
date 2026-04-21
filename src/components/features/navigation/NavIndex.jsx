//src/components/features/navigation/NavIndex.jsx

export default function NavIndex({ about, members }) {
    const aboutAnchors = about?.Sections?.map((section) => section.Title);
    const membersAnchors = members
        ?.map((member) => `${member?.FirstName ?? ''} ${member?.LastName ?? ''}`.trim())
        .filter(Boolean);

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
        <div className='border-1 border-amber-900'>
            <h2 className='text-amber-900'>NavIndex</h2>
            <div className='border-1 border-blue-200'>
                <h2 className='text-blue-200'>About anchors</h2>
                <ul>
                    {aboutAnchors.map((anchor) => (
                        <li key={anchor}>
                            <a href={`#${normalizeAnchor(anchor)}`}>{anchor}</a>
                        </li>
                    ))}
                </ul>
            </div>
            <div className='border-1 border-yellow-200'>
                <h2 className='text-yellow-200'>Members anchors</h2>
                <ul>
                    {membersAnchors.map((anchor) => (
                        <li key={anchor}>
                            <a href={`#${normalizeAnchor(anchor)}`}>{anchor}</a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
