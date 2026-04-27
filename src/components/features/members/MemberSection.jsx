//src/components/features/members/MemberSection.jsx

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { normalizeAnchor } from '../../../assets/scripts/utils/normalizeAnchor';
import ImageSlider from '../../common/ImageSlider';
import Lightbox from '../lightbox/Lightbox';
import Slider from '../slider/Slider';

gsap.registerPlugin(ScrollTrigger);

export default function MemberSection({
    lang,
    firstName,
    lastName,
    bio,
    website,
    email,
    instagramUrl,
    instagramName,
    practices,
    images,
    onActiveMemberChange,
}) {
    const fullName = [firstName, lastName].filter(Boolean).join(' ');
    const memberAnchor = normalizeAnchor(fullName);
    const [lightboxIndex, setLightboxIndex] = useState(null);
    const hasImages = Array.isArray(images) && images.length > 0;
    const sectionRef = useRef(null);

    useEffect(() => {
        if (!sectionRef.current) return;

        const trigger = ScrollTrigger.create({
            trigger: sectionRef.current,
            start: 'top 100px',
            end: 'bottom 100px',
            onEnter: () => onActiveMemberChange?.(memberAnchor),
            onEnterBack: () => onActiveMemberChange?.(memberAnchor),
        });

        return () => {
            trigger.kill();
        };
    }, [memberAnchor, onActiveMemberChange]);

    return (
        <section
            ref={sectionRef}
            id={memberAnchor}
            className='border scroll-mt-[calc(var(--spacing-header-height)+10px)] mt-[10px]'
        >
            <a href={`#${memberAnchor}`} className="block-title border-b border-transparent">
                <h2 className='text-title text-center'>{fullName}</h2>
            </a>

            <div>

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
                <div className='bg-linear-to-t from-primary to-light to-80% p-[10px]'>
                    <div className='md:grid md:grid-cols-6 md:gap-[10px]'>
                        <div className='md:col-span-4'>
                            <div className='max-w-[90%]'>
                                {bio ? <p>{bio}</p> : null}
                            </div>
                        </div>
                        <div className='md:col-span-1 '>
                            <h3 className='mb-h3-margin'>
                                {lang === "fr" ? "Pratique(s) :" : "Practice(s) :"}
                            </h3>

                            {practices.length ? (
                                <ul>
                                    {practices.map((practice) => (
                                        <li key={practice.id}>{practice?.Name}</li>
                                    ))}
                                </ul>
                            ) : null}
                        </div>
                        <div className='md:col-span-1 '>
                            {website || email || instagramUrl ? (
                                <h3 className='mb-h3-margin'>
                                    Contact :
                                </h3>
                            ) : null}

                            {website ? (
                                <>

                                    <a href={`https://${website}`} target='_blank' className='block'>
                                        {website}
                                    </a>
                                </>
                            ) : null}

                            {email ? (
                                <a href={`mailto:${email}`} className='block'>{email}</a>
                            ) : null}

                            {instagramUrl ? (
                                <a href={instagramUrl} target='_blank' className='block'>
                                    {instagramName ?? instagramUrl}
                                </a>
                            ) : null}
                        </div>

                    </div>





                </div>




            </div>

        </section>
    );
}
