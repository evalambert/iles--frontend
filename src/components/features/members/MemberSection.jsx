//src/components/features/members/MemberSection.jsx

import { useState } from 'react';
import { normalizeAnchor } from '../../../assets/scripts/utils/normalizeAnchor';
import ImageSlider from '../../common/ImageSlider';
import Lightbox from '../lightbox/Lightbox';
import Slider from '../slider/Slider';

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
    const [lightboxIndex, setLightboxIndex] = useState(null);
    const hasImages = Array.isArray(images) && images.length > 0;

    return (
        <section
            id={normalizeAnchor(`${fullName}`)}
            className='border border-yellow-200 text-yellow-200 p-4 scroll-mt-[calc(var(--spacing-header-height)+10px)]'
        >
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
                    Site :{' '}
                    <a href={`https://${website}`} target='_blank'>
                        {website}
                    </a>
                </p>
            ) : null}

            {email ? (
                <p>
                    Email : <a href={`mailto:${email}`}>{email}</a>
                </p>
            ) : null}

            {instagramUrl ? (
                <p>
                    Instagram :{' '}
                    <a href={instagramUrl} target='_blank'>
                        {instagramName ?? instagramUrl}
                    </a>
                </p>
            ) : null}

            <Slider
                items={images}
                className=''
                slideClassName='!w-fit'
                spaceBetween={0}
                renderSlide={(image, index) => (
                    <ImageSlider
                        image={image}
                        alt={fullName || 'member image'}
                        className='w-auto h-[371px] object-cover'
                        preferredFormat='medium'
                        onClick={() => setLightboxIndex(index)}
                    />
                )}
            />

            {lightboxIndex !== null && hasImages ? (
                <Lightbox
                    images={images}
                    currentIndex={lightboxIndex}
                    alt={fullName || 'member image'}
                    onClose={() => setLightboxIndex(null)}
                    onPrev={() =>
                        setLightboxIndex(
                            (prev) => (prev - 1 + images.length) % images.length
                        )
                    }
                    onNext={() =>
                        setLightboxIndex((prev) => (prev + 1) % images.length)
                    }
                />
            ) : null}
        </section>
    );
}
