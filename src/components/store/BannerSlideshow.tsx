import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BannerSlideshowProps {
  banners: { id: string; url: string; title?: string }[];
}

const BannerSlideshow = ({ banners }: BannerSlideshowProps) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => setCurrent(i => (i + 1) % banners.length), 4000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) return null;

  return (
    <div className="relative w-full aspect-[21/9] md:aspect-[3/1] overflow-hidden rounded-2xl">
      <AnimatePresence mode="wait">
        <motion.img
          key={banners[current]?.id}
          src={banners[current]?.url}
          alt={banners[current]?.title || 'Banner'}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>
      {banners.length > 1 && (
        <>
          <button onClick={() => setCurrent(i => (i - 1 + banners.length) % banners.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 backdrop-blur flex items-center justify-center text-white hover:bg-black/50 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={() => setCurrent(i => (i + 1) % banners.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 backdrop-blur flex items-center justify-center text-white hover:bg-black/50 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="absolute bottom-3 inset-x-0 flex justify-center gap-2">
            {banners.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${i === current ? 'bg-white scale-110' : 'bg-white/40'}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default BannerSlideshow;
