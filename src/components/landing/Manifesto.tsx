import { memo, useCallback } from "react";
import { VideoLazy } from "@/components/ui/video-lazy";
import { logger } from "@/utils/logger";

interface ManifestoProps {
  id?: string;
}

const Manifesto = memo(({ id }: ManifestoProps) => {
  const handleVideoError = useCallback(() => {
    logger.warn('Erro ao carregar vídeo do manifesto', { section: 'Manifesto' });
  }, []);

  return (
    <section id={id} className="section-standard px-4 md:px-8 lg:px-12 bg-brand-black">
      <div className="max-w-6xl mx-auto">
        <div className="space-y-10 md:space-y-14 lg:space-y-18">
          {/* Citação em Destaque - Centralizada */}
          <div className="text-center max-w-4xl lg:max-w-5xl mx-auto space-y-6 lg:space-y-8">
            <div className="space-y-6 lg:space-y-8">
              {/* Elemento decorativo centralizado */}
              <div className="w-16 lg:w-20 h-0.5 lg:h-1 bg-gradient-accent rounded-full mx-auto"></div>
              
              {/* Citação principal - Dividida em dois blocos */}
              <blockquote className="relative space-y-4 lg:space-y-6">
                <p className="text-2xl md:text-3xl lg:text-4xl font-montserrat italic text-brand-latte leading-relaxed tracking-wide">
                  "Acreditamos que profissionais extraordinários merecem ferramentas à altura de sua expertise.
                </p>
                <p className="text-2xl md:text-3xl lg:text-4xl font-montserrat italic text-brand-latte/90 leading-relaxed tracking-wide">
                  NIVELA® representa uma nova era em retexturização capilar."
                </p>
              </blockquote>
            </div>
          </div>

          {/* Vídeo Institucional - Otimizado para performance */}
          <div className="relative group max-w-3xl lg:max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-lg">
              <VideoLazy
                src="https://fsntuympgysgfgqdvzsp.supabase.co/storage/v1/object/public/videos//video-manifesto-oficial-compactado.mp4"
                className="aspect-video"
                autoPlay={false}
                muted={true}
                loop={true}
                controls={true}
                preload="none"
                threshold={0.5}
                rootMargin="100px"
                aria-label="Vídeo institucional NIVELA - Manifesto da marca"
                onError={handleVideoError}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black/20 to-transparent pointer-events-none"></div>
            </div>
            {/* Sombra decorativa otimizada */}
            <div className="absolute inset-0 bg-gradient-radial/20 rounded-lg blur-lg -z-10 scale-110"></div>
          </div>
        </div>
      </div>
    </section>
  );
});

Manifesto.displayName = 'Manifesto';

export default Manifesto;