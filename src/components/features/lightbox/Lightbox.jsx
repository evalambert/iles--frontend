//src/components/features/lightbox/Lightbox.jsx
import { useEffect, useMemo } from 'react';
import { buildSrcSet } from '../../../assets/scripts/libs/getImageUrl';

export default function Lightbox({
    images = [],
    currentIndex = 0,
    onClose,
    onPrev,
    onNext,
    alt = 'image',
    prevIconSrc = '/svg/fleche-guauche.svg',
    nextIconSrc = '/svg/fleche-droite.svg',
    arrowClassName = '',
}) {
    const hasImages = Array.isArray(images) && images.length > 0;
    const safeIndex = hasImages
        ? ((currentIndex % images.length) + images.length) % images.length
        : 0;

    const currentImage = hasImages ? images[safeIndex] : null;

    const imageData = useMemo(() => {
        if (!currentImage) return null;

        return {
            src: currentImage.formats?.large?.url || currentImage.url,
            srcSet: buildSrcSet(currentImage),
            alt:
                currentImage?.alternativeText ??
                currentImage?.name ??
                alt ??
                'image',
        };
    }, [currentImage, alt]);

    useEffect(() => {
        if (!hasImages) return undefined;

        const handleKeydown = (event) => {
            if (event.key === 'Escape') {
                onClose?.();
            }
        };

        window.addEventListener('keydown', handleKeydown);
        return () => window.removeEventListener('keydown', handleKeydown);
    }, [hasImages, onClose]);

    if (!hasImages || !imageData) return null;

    return (
        <div
            className='fixed inset-0 z-50 flex items-center justify-center'
            onClick={onClose}
            role='presentation'
        >
            <div
                className='relative flex max-h-full max-w-full items-center justify-center'
                onClick={(event) => event.stopPropagation()}
                role='presentation'
            >
                <button
                    type='button'
                    onClick={onClose}
                    className='absolute -top-[-10px] -right-[-10px] z-20 flex h-9 w-9 items-center justify-center'
                    aria-label='Fermer la lightbox'
                >
                    <img src='/svg/croix.svg' alt='' aria-hidden='true' />
                </button>

                <button
                    type='button'
                    className={`absolute left-[20px] top-1/2 z-10 -translate-y-1/2 ${arrowClassName}`}
                    aria-label='Image precedente'
                    onClick={onPrev}
                >
                    <img src={prevIconSrc} alt='' aria-hidden='true' />
                </button>

                <img
                    src={imageData.src}
                    srcSet={imageData.srcSet}
                    sizes='100vw'
                    alt={imageData.alt}
                    className='max-h-[90vh] max-w-[90vw] object-contain border border-black'
                    onClick={onNext}
                />

                <button
                    type='button'
                    className={`absolute right-[20px] top-1/2 z-10 -translate-y-1/2 ${arrowClassName}`}
                    aria-label='Image suivante'
                    onClick={onNext}
                >
                    <img src={nextIconSrc} alt='' aria-hidden='true' />
                </button>
            </div>
        </div>
    );
}
