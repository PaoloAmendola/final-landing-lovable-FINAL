interface ImageFormat {
  format: 'webp' | 'avif' | 'original';
  quality?: number;
}

const getImageType = (src: string): string => {
  const extension = src.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'webp':
      return 'image/webp';
    case 'avif':
      return 'image/avif';
    case 'png':
      return 'image/png';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'svg':
      return 'image/svg+xml';
    default:
      return 'image/jpeg';
  }
};

const generateImageSources = (src: string) => {
  const sources = [
    { src: src.replace(/\.(jpg|jpeg|png)$/i, '.avif'), type: 'image/avif' },
    { src: src.replace(/\.(jpg|jpeg|png)$/i, '.webp'), type: 'image/webp' },
    { src, type: getImageType(src) }
  ];

  return sources;
};

const ImageOptimizer = {
  supportsWebP: (): Promise<boolean> => {
    return new Promise((resolve) => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        resolve(webP.height === 2);
      };
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  },

  getBestFormat: async (): Promise<'avif' | 'webp' | 'original'> => {
    try {
      const supportsWebP = await ImageOptimizer.supportsWebP();
      return supportsWebP ? 'webp' : 'original';
    } catch {
      return 'original';
    }
  }
};

export { ImageOptimizer, generateImageSources, getImageType };
export type { ImageFormat };