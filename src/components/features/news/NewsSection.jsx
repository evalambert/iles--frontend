//src/components/features/news/NewsSection.jsx  

import Slider from '../slider/Slider';
import ImageSlider from '../../common/ImageSlider';
import Lightbox from '../lightbox/Lightbox';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { normalizeAnchor } from '../../../assets/scripts/utils/normalizeAnchor';

gsap.registerPlugin(ScrollTrigger);

export default function NewsSection({ news, lang, paragraphs, images, onActiveNewsChange }) {
    const [lightboxIndex, setLightboxIndex] = useState(null);
    const hasImages = Array.isArray(images) && images.length > 0;
    const newsAnchor = normalizeAnchor(news.Title);
    const sectionRef = useRef(null);

    useEffect(() => {
        if (!sectionRef.current) return;

        const trigger = ScrollTrigger.create({
            trigger: sectionRef.current,
            start: 'top 100px',
            end: 'bottom 100px',
            onEnter: () => onActiveNewsChange?.(newsAnchor),
            onEnterBack: () => onActiveNewsChange?.(newsAnchor),
        });

        return () => {
            trigger.kill();
        };
    }, [newsAnchor, onActiveNewsChange]);

    // Fonction pour extraire le texte d'un noeud Rich Text
    const getNodeText = (node) => {
        if (!node) return '';
        if (node.type === 'text') return node.text ?? '';
        if (!Array.isArray(node.children)) return '';
        return node.children.map(getNodeText).join('');
    };

    // Fonction pour convertir un tableau de noeuds Rich Text en une chaîne de texte
    const getRichTextAsString = (richTextBlocks = []) => {
        return richTextBlocks.map(getNodeText).join(' ');
    };

    return (
        <section
            ref={sectionRef}
            id={newsAnchor}
            className='border scroll-mt-[calc(var(--spacing-header-height)+10px)] mb-[10px]'
        >
            <a href={`#${newsAnchor}`} className="block-title border-b border-transparent">
                <h2 className='text-title text-center'>{news.Title}</h2>
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
                            alt={news.Title || 'news image'}
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
                        alt={news.Title || 'news image'}
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


                                {paragraphs.map((paragraph) => {
                                    const paragraphText = getRichTextAsString(
                                        paragraph?.Text ?? []
                                    );

                                    return (
                                        <article key={paragraph.id} className='mt-4'>
                                            {paragraph?.Subtitle ? (
                                                <h3 className='mb-h3-margin'>{paragraph.Subtitle}</h3>
                                            ) : null}
                                            {paragraphText ? <p>{paragraphText}</p> : null}
                                        </article>
                                    );
                                })}
                            </div>
                        </div>
                        <div className='md:col-span-1 '>
                            {/* <h3 className='mb-h3-margin'>
                                {lang === "fr" ? "Pratique(s) :" : "Practice(s) :"}
                            </h3>

                            {practices.length ? (
                                <ul>
                                    {practices.map((practice) => (
                                        <li key={practice.id}>{practice?.Name}</li>
                                    ))}
                                </ul>
                            ) : null} */}
                        </div>
                        <div className='md:col-span-1 '>
                            {/* {website || email || instagramUrl ? (
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
                            ) : null} */}
                        </div>

                    </div>





                </div>




            </div>

        </section>
    );
}