import { useEffect } from 'react';

interface CriticalImage {
  src: string;
  priority?: boolean;
  sizes?: string;
}

const criticalImages: CriticalImage[] = [
  {
    src: "/lovable-uploads/f576ae9a-1852-4645-bbb2-d9b8594bef91.png",
    priority: true,
    sizes: "160px"
  },
  {
    src: "https://fsntuympgysgfgqdvzsp.supabase.co/storage/v1/object/public/imagens//frasco-nivela-hero%20(1).webp",
    priority: true,
    sizes: "(max-width: 768px) 320px, (max-width: 1024px) 480px, 640px"
  }
];

export const useCriticalImages = () => {
  useEffect(() => {
    // Preload critical images to improve LCP
    const preloadImages = () => {
      criticalImages.forEach(({ src, priority, sizes }) => {
        if (priority) {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.href = src;
          if (sizes) {
            link.setAttribute('imagesizes', sizes);
          }
          document.head.appendChild(link);
        }
      });
    };

    // Run immediately for better performance
    preloadImages();
  }, []);
};