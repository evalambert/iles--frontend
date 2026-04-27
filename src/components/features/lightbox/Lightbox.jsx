//src/components/features/lightbox/Lightbox.jsx
import { useEffect, useMemo } from 'react';
import { buildSrcSet } from '../../../assets/scripts/libs/getImageUrl';

function MaskIcon({ src, className = '' }) {
    return (
        <span
            aria-hidden='true'
            className={`pointer-events-none block shrink-0 bg-current ${className}`}
            style={{
                maskImage: `url(${src})`,
                WebkitMaskImage: `url(${src})`,
                maskRepeat: 'no-repeat',
                WebkitMaskRepeat: 'no-repeat',
                maskPosition: 'center',
                WebkitMaskPosition: 'center',
                maskSize: 'contain',
                WebkitMaskSize: 'contain',
            }}
        />
    );
}

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
                    className='absolute top-2.5 right-2.5 z-20 flex h-9 w-9 items-center justify-center cursor-pointer text-black transition-colors duration-200 hover:text-primary'
                    aria-label='Fermer la lightbox'
                >
                    <MaskIcon src='/svg/croix.svg' className='h-x-body w-6.5' />
                </button>

                <button
                    type='button'
                    className={`absolute left-0 top-1/2 z-10 -translate-y-1/2 cursor-pointer p-[20px] text-black transition-colors duration-200 hover:text-primary ${arrowClassName}`}
                    aria-label='Image precedente'
                    onClick={onPrev}
                >
                    <MaskIcon src={prevIconSrc} className='h-19.5 w-y-body' />
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
                    className={`absolute right-0 top-1/2 z-10 -translate-y-1/2 cursor-pointer p-[20px] text-black transition-colors duration-200 hover:text-primary ${arrowClassName}`}
                    aria-label='Image suivante'
                    onClick={onNext}
                >
                    <MaskIcon src={nextIconSrc} className='h-19.5 w-y-body' />
                </button>
            </div>
        </div>
    );
}
