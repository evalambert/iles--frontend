import { buildSrcSet } from '../../assets/scripts/libs/getImageUrl';

export default function ImageSlider({
    image,
    alt,
    className = '',
    loading = 'lazy',
    sizes = '100vw', // fallback
    onClick,
    onLoad,
}) {
    if (!image) return null;

    const src = image.formats?.medium?.url || image.url;

    const srcSet = buildSrcSet(image);

    return (
        <img
            src={src}
            srcSet={srcSet}
            sizes={sizes}
            alt={alt ?? image?.alternativeText ?? image?.name ?? 'image'}
            loading={loading}
            decoding='async'
            className={`${className} ${onClick ? 'cursor-pointer' : ''}`}
            onClick={onClick}
            onLoad={onLoad}
        />
    );
}
