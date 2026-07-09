/**
 * Cloudinary URL helper for zero-budget image hosting
 * @param publicId - The public ID of the image in Cloudinary
 * @param transformations - Optional transformation parameters
 * @returns Full Cloudinary URL
 */
export function getCloudinaryUrl(
  publicId: string,
  transformations?: {
    width?: number;
    height?: number;
    quality?: 'auto' | 'low' | 'good' | 'best';
    crop?: 'fill' | 'fit' | 'crop' | 'scale';
  }
): string {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo';
  const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload/`;
  
  if (!transformations) {
    return `${baseUrl}${publicId}`;
  }
  
  const transforms: string[] = [];
  
  if (transformations.width) transforms.push(`w_${transformations.width}`);
  if (transformations.height) transforms.push(`h_${transformations.height}`);
  if (transformations.quality) transforms.push(`q_${transformations.quality}`);
  if (transformations.crop) transforms.push(`c_${transformations.crop}`);
  
  const transformationString = transforms.join(',');
  
  return `${baseUrl}${transformationString}/${publicId}`;
}

/**
 * Generate responsive image sources for different screen sizes
 */
export function getResponsiveCloudinaryUrls(publicId: string): {
  thumbnail: string;
  medium: string;
  large: string;
} {
  return {
    thumbnail: getCloudinaryUrl(publicId, { width: 400, height: 300, crop: 'fill', quality: 'auto' }),
    medium: getCloudinaryUrl(publicId, { width: 800, height: 600, crop: 'fill', quality: 'auto' }),
    large: getCloudinaryUrl(publicId, { width: 1200, height: 900, crop: 'fill', quality: 'auto' }),
  };
}
