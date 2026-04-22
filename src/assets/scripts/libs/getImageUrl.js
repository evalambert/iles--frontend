//src/assets/scripts/libs/getOptimizedImage.js
export const buildSrcSet = (image) => {
    if (!image?.formats) return '';

    const f = image.formats;

    return [
        f.thumbnail && `${f.thumbnail.url} ${f.thumbnail.width}w`,
        f.small && `${f.small.url} ${f.small.width}w`,
        f.medium && `${f.medium.url} ${f.medium.width}w`,
        f.large && `${f.large.url} ${f.large.width}w`,
        f.xlarge && `${f.xlarge.url} ${f.xlarge.width}w`,
    ]
        .filter(Boolean)
        .join(', ');
};
