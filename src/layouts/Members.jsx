//src/layouts/Members.jsx
import MemberSection from '../components/features/members/MemberSection';
import { normalizeAnchor } from '../assets/scripts/utils/normalizeAnchor';

export default function Members({ data, lang }) {
    const members = Array.isArray(data) ? data : (data?.data ?? []);
    
    return (

        <div id={normalizeAnchor(`${lang === "fr" ? "Membres" : "Members"}`)} className='scroll-mt-header-height'>

            {members.map((member) => (
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
                />
            ))}
        </div>
    );
}
