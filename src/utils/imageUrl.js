/**
 * Format property image URL to support both local proxy and production Vercel -> Render backend deployment
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  const baseUrl = import.meta.env.VITE_API_URL || '';
  return `${baseUrl}${imagePath}`;
};
