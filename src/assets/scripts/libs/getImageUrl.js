//src/assets/scripts/libs/getOptimizedImage.js
export const getResponsiveImageUrl = (image, context, width) => {
    if (!image?.formats) return image?.url || null
  
    switch (context) {
      case 'card':
        if (width >= 1024) return image.formats.medium?.url || image.url
        if (width >= 768) return image.formats.medium?.url || image.url
        return image.formats.small?.url || image.url
      case 'medium':
        if (width >= 1024) return image.formats.medium?.url || image.url
        if (width >= 768) return image.formats.medium?.url || image.url
        return image.formats.large?.url || image.url
      case 'lightbox':
        if (width >= 1024) return image.formats.xlarge?.url || image.url
        if (width >= 768) return image.formats.large?.url || image.url
        return image.formats.large?.url || image.url
      case 'cover':
        if (width >= 1800) return image.formats.large?.url || image.url
        return image.formats.large?.url || image.url
      default:
        return image.url
    }
  }
  