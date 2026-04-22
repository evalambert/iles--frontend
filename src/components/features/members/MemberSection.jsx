//src/components/features/members/MemberSection.jsx
import { normalizeAnchor } from '../../../assets/scripts/utils/normalizeAnchor';

export default function MemberSection({
    firstName,
    lastName,
    bio,
    website,
    email,
    instagramUrl,
    instagramName,
    practices,
    images,
}) {

    const fullName = [firstName, lastName].filter(Boolean).join(' ');

    return (
        <section id={normalizeAnchor(`${fullName}`)} className="border border-yellow-200 text-yellow-200 p-4 scroll-mt-header-height">
            
            <h2>{fullName}</h2>

            {bio ? <p>{bio}</p> : null}
            

            {practices.length ? (
                <ul>
                    {practices.map((practice) => (
                        <li key={practice.id}>{practice?.Name}</li>
                    ))}
                </ul>
            ) : null}

            {website ? (
                <p>
                    Site : <a href={`https://${website}`} target="_blank">{website}</a>
                </p>
            ) : null}

            {email ? (
                <p>
                    Email : <a href={`mailto:${email}`}>{email}</a>
                </p>
            ) : null}

            {instagramUrl ? (
                <p>
                    Instagram : <a href={instagramUrl} target="_blank">{instagramName ?? instagramUrl}</a>
                </p>
            ) : null}

            {images.map((image) => {
                const src =
                    image?.formats?.medium?.url ??
                    image?.formats?.large?.url ??
                    image?.formats?.small?.url ??
                    image?.url ??
                    '';

                if (!src) return null;

                return (
                    <img
                        key={image.id}
                        src={src}
                        alt={image?.alternativeText ?? image?.name ?? fullName ?? 'member image'}
                        loading="lazy"
                    />
                );
            })}
        </section>
    );
}
