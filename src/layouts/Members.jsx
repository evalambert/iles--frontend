//src/layouts/Members.jsx
import MemberSection from '../components/features/members/MemberSection';
import { normalizeAnchor } from '../assets/scripts/utils/normalizeAnchor';

export default function Members({ data, lang, selectedPractice }) {
    const members = Array.isArray(data) ? data : (data?.data ?? []);
    const filteredMembers = members.filter((member) => {
        if (!selectedPractice) return true;
        return (member?.practices ?? []).some((practice) => practice?.Name === selectedPractice);
    });
    
    return (

        <div id={normalizeAnchor(`${lang === "fr" ? "Membres" : "Members"}`)} className='mt-header-height scroll-mt-[calc(var(--spacing-header-height)+10px)] p-[10px] bg-linear-to-t from-primary to-light to-40%'>

            {filteredMembers.map((member) => (
                <MemberSection
                    key={member.id}
                    firstName={member?.FirstName}
                    lastName={member?.LastName}
                    bio={member?.Bio}
                    website={member?.Website}
                    email={member?.Email}
                    instagramUrl={member?.InstagramUrl}
                    instagramName={member?.InstagramName}
                    practices={member?.practices ?? []}
                    images={member?.Images ?? []}
                    lang={lang}
                />
            ))}
        </div>
    );
}
