//src/components/features/about/AboutSection.jsx
import { useEffect, useRef, useState, Fragment } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { normalizeAnchor } from '../../../assets/scripts/utils/normalizeAnchor';
import ImageSlider from '../../common/ImageSlider';
import Lightbox from '../lightbox/Lightbox';
import Slider from '../slider/Slider';

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection({
    title,
    chapo,
    paragraphs,
    images,
    onActiveAboutChange,
}) {
    const [lightboxIndex, setLightboxIndex] = useState(null);
    const hasImages = Array.isArray(images) && images.length > 0;
    const sectionRef = useRef(null);
    const aboutAnchor = normalizeAnchor(title);

    useEffect(() => {
        if (!sectionRef.current) return;

        const trigger = ScrollTrigger.create({
            trigger: sectionRef.current,
            start: 'top 100px',
            end: 'bottom 100px',
            onEnter: () => onActiveAboutChange?.(aboutAnchor),
            onEnterBack: () => onActiveAboutChange?.(aboutAnchor),
        });

        return () => {
            trigger.kill();
        };
    }, [aboutAnchor, onActiveAboutChange]);

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

    // *** Rendu RICHTEXT Chao ***
    const renderChapo = (chapoBlocks) => {
        if (!chapoBlocks) return null;
        if (typeof chapoBlocks === 'string') return <p>{chapoBlocks}</p>;
        if (!Array.isArray(chapoBlocks) || chapoBlocks.length === 0) return null;

        const renderRichTextChildren = (children = []) =>
            (Array.isArray(children) ? children : []).map((child, idx) => {
                if (!child) return null;
                if (child.type === 'text') {
                    return <Fragment key={idx}>{child.text ?? ''}</Fragment>;
                }

                if (child.type === 'link') {
                    const href = child.url;
                    const target = child.target;
                    const rel = target === '_blank' ? 'noopener noreferrer' : undefined;

                    return (
                        <a
                            key={idx}
                            href={href}
                            target={target}
                            rel={rel}
                        >
                            {(Array.isArray(child.children) ? child.children : []).map(
                                (linkChild, linkChildIdx) => {
                                    if (!linkChild) return null;
                                    if (linkChild.type === 'text') {
                                        return (
                                            <Fragment key={linkChildIdx}>
                                                {linkChild.text ?? ''}
                                            </Fragment>
                                        );
                                    }
                                    return null;
                                }
                            )}
                        </a>
                    );
                }

                return null;
            });

        return chapoBlocks.map((block, idx) => {
            if (!block || block.type !== 'paragraph') return null;
            return (
                <p key={idx}>
                    {renderRichTextChildren(block.children)}
                </p>
            );
        });
    };
    // *** END — RICHTEXT CHAPO ***

    return (
        <section
            ref={sectionRef}
            id={aboutAnchor}
            className='border scroll-mt-[calc(var(--spacing-header-height)+10px)] mb-[10px] p-[10px] bg-linear-to-t from-primary to-light to-40%'
        >
            <div className='md:grid md:grid-cols-6 md:gap-[10px]'>
                <div className='md:col-span-4 flex flex-col gap-[23px]'>



                    <h2 className='text-title '>{title}</h2>




                    <div className='flex flex-col gap-[60px]'>
                        {chapo ? (
                            <div className='flex flex-col gap-[23px]'>
                                {renderChapo(chapo)}
                            </div>
                        ) : null}
                        {paragraphs.map((paragraph) => {
                            const paragraphText = getRichTextAsString(
                                paragraph?.Text ?? []
                            );

                            return (
                                <article key={paragraph.id} className='flex flex-col gap-[10px]'>
                                    {paragraph?.Subtitle ? (
                                        <h3 className=''>{paragraph.Subtitle}</h3>
                                    ) : null}
                                    {paragraphText ? <p>{paragraphText}</p> : null}
                                </article>
                            );
                        })}
                    </div>


                </div>

            </div>


            <div className='mt-[23px]'>
                <Slider
                    items={images}
                    className=''
                    slideClassName='!w-fit'
                    spaceBetween={0}
                    renderSlide={(image, index) => (
                        <ImageSlider
                            image={image}
                            alt={title || 'about image'}
                            /*  sizes='(max-width: 768px) 92vw, (max-width: 1280px) 60vw, 742px' */
                            className='w-auto h-[70vh] md:h-[742px] object-cover'
                            onClick={() => setLightboxIndex(index)}
                        />
                    )}
                />
            </div>

            {lightboxIndex !== null && hasImages ? (
                <Lightbox
                    images={images}
                    currentIndex={lightboxIndex}
                    alt={title || 'about image'}
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
