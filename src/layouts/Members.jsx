//src/layouts/Members.jsx
import MemberSection from '../components/features/members/MemberSection';

export default function Members({ data }) {
    const members = Array.isArray(data) ? data : (data?.data ?? []);
    
    return (
        <div className='border border-yellow-200 text-yellow-200'>
            <h2 className="text-2xl font-bold mb-4">SECTION MEMBERS</h2>

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
