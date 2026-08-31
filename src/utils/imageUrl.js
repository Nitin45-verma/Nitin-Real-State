/**
 * Format property image URL to support both local proxy and production Render backend deployment
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  const baseUrl = import.meta.env.VITE_API_URL || 'https://real-state-backend-g6nt.onrender.com';
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${baseUrl}${cleanPath}`;
};
