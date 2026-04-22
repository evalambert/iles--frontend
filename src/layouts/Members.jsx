//src/layouts/Members.jsx
import MemberSection from '../components/features/members/MemberSection';

export default function Members({ data }) {
    const members = Array.isArray(data) ? data : (data?.data ?? []);
    
    return (
        <div className=''>

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
