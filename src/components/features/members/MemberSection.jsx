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
    instagram,
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
    const isProbablyUrl = (value) => typeof value === 'string' && /^https?:\/\//i.test(value);
    const instagramItems = Array.isArray(instagram) ? instagram : [];
    const normalizedInstagramLinks = instagramItems.length
        ? instagramItems
              .map((item) => {
                  const rawUrl = item?.InstagramUrl;
                  const rawName = item?.InstagramName;

                  // Certaines données inversent les champs (handle vs URL). On rend robuste :
                  // - si `InstagramUrl` ne ressemble pas à une URL mais `InstagramName` oui, on inverse.
                  let href = rawUrl;
                  let label = rawName;

                  const urlLooksLikeUrl = isProbablyUrl(rawUrl);
                  const nameLooksLikeUrl = isProbablyUrl(rawName);

                  if (!urlLooksLikeUrl && nameLooksLikeUrl) {
                      href = rawName;
                      label = rawUrl;
                  }

                  if (!href && nameLooksLikeUrl) href = rawName;
                  if (!label) label = href;

                  if (!href) return null;

                  return {
                      href,
                      label,
                  };
              })
              .filter(Boolean)
        : instagramUrl
          ? [
                {
                    href: instagramUrl,
                    label: instagramName ?? instagramUrl,
                },
            ]
          : [];
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
                            <div className='md:max-w-[90%]'>
                                {bio ? <p>{bio}</p> : null}
                            </div>
                        </div>

                        <div className='md:col-span-2 grid grid-cols-2 md:gap-[10px] max-md:mt-[20px] max-md:mx-[-10px] max-md:bg-primary'>

                            <div className='col-span-1 max-md:bg-linear-to-t max-md:from-primary max-md:to-light max-md:to-80% max-md:p-[10px] max-md:h-fit'>
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
                            <div className='col-span-1 max-md:bg-linear-to-t max-md:from-primary max-md:to-light max-md:to-80% max-md:p-[10px] max-md:h-fit'>
                                {website || email || normalizedInstagramLinks.length ? (
                                    <h3 className='mb-h3-margin'>
                                        Contact :
                                    </h3>
                                ) : null}

                                {website ? (
                                    <>

                                        <a href={`https://${website}`} target='_blank' className='block truncate' title={website}>
                                            {website}
                                        </a>
                                    </>
                                ) : null}

                                {normalizedInstagramLinks.map((link, idx) => (
                                    <a
                                        // `href` est souvent stable, sinon on fallback sur l'index.
                                        key={link.href ?? idx}
                                        href={link.href}
                                        target='_blank'
                                        className='block truncate'
                                        title={link.label ?? link.href}
                                    >
                                        {link.label ?? link.href}
                                    </a>
                                ))}

                                {email ? (
                                    <a href={`mailto:${email}`} className='block truncate' title={email}>{email}</a>
                                ) : null}

                            </div>
                        </div>

                    </div>





                </div>




            </div>

        </section>
    );
}
