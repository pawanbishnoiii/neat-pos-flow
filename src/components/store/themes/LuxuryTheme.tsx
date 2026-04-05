import { motion } from 'framer-motion';
import { ShoppingBag, Star, Crown, Gem } from 'lucide-react';
import BannerSlideshow from '../BannerSlideshow';
import OffersSection from '../OffersSection';
import VideoSection from '../VideoSection';
import StoreFooter from '../StoreFooter';

interface ThemeProps {
  business: any;
  products: any[];
  reviews: any[];
  banners: any[];
  offers: any[];
  videos: any[];
  onProductClick: (p: any) => void;
  getImageSrc: (url: string) => string;
}

const LuxuryTheme = ({ business, products, reviews, banners, offers, videos, onProductClick, getImageSrc }: ThemeProps) => {
  const theme = {
    footerBg: 'bg-zinc-950', footerText: 'text-zinc-500', emoji: '👑',
    tagline: business.tagline || 'Luxury & Elegance',
  };
  const avgRating = reviews.length > 0 ? (reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length).toFixed(1) : null;

  return (
    <div className="min-h-screen bg-zinc-950 text-white" style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}>
      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-xl border-b border-amber-900/20">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Crown className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-bold tracking-widest uppercase text-amber-100">{business.business_name}</span>
          </div>
          <div className="hidden md:flex gap-8 text-xs font-medium tracking-widest uppercase text-zinc-500">
            <a href="#products" className="hover:text-amber-400 transition-colors">Collection</a>
            <a href="#reviews" className="hover:text-amber-400 transition-colors">Reviews</a>
          </div>
        </div>
      </nav>

      {/* Hero - dark luxury */}
      <section className="relative bg-zinc-950 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(45deg, transparent 45%, rgba(217,168,83,0.1) 45%, rgba(217,168,83,0.1) 55%, transparent 55%)', backgroundSize: '30px 30px' }} />
        <div className="relative max-w-6xl mx-auto px-4 py-24 md:py-40 text-center space-y-6">
          {business.logo_url ? (
            <img src={getImageSrc(business.logo_url)} alt="" className="w-28 h-28 mx-auto rounded-full object-cover border-4 border-amber-400/30 shadow-2xl shadow-amber-500/10" />
          ) : (
            <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-5xl shadow-2xl shadow-amber-500/20">👑</div>
          )}
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-7xl font-bold tracking-tight text-amber-50" style={{ fontFamily: "'Playfair Display', serif" }}>
            {business.business_name}
          </motion.h1>
          <p className="text-amber-400/60 text-lg font-medium tracking-wider uppercase">{theme.tagline}</p>
          <div className="flex items-center justify-center gap-3">
            <div className="w-16 h-px bg-amber-600/30" />
            <Gem className="w-4 h-4 text-amber-500" />
            <div className="w-16 h-px bg-amber-600/30" />
          </div>
          <a href="#products" className="inline-flex items-center gap-2 px-10 py-4 rounded-none border-2 border-amber-400 text-amber-400 text-xs font-bold uppercase tracking-widest hover:bg-amber-400 hover:text-zinc-950 transition-all">
            View Collection
          </a>
        </div>
      </section>

      {banners.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 py-8">
          <BannerSlideshow banners={banners} />
        </div>
      )}

      <div className="bg-zinc-900">
        <OffersSection offers={offers} theme={theme} />
      </div>
      <div className="bg-zinc-950">
        <VideoSection videos={videos} />
      </div>

      {/* Products - elegant grid */}
      <section id="products" className="bg-zinc-900 py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 space-y-8">
          <div className="text-center space-y-2">
            <p className="text-xs text-amber-500 font-bold uppercase tracking-[0.3em]">Curated Selection</p>
            <h2 className="text-3xl md:text-4xl font-bold text-amber-50" style={{ fontFamily: "'Playfair Display', serif" }}>Our Collection</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p, i) => {
              const img = getImageSrc(p.image_url || '');
              const hasDiscount = p.discount_price < p.price;
              return (
                <motion.div key={p.id} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }} whileHover={{ y: -4 }}
                  className="rounded-xl bg-zinc-800 border border-zinc-700/50 overflow-hidden cursor-pointer hover:border-amber-500/30 transition-all group" onClick={() => onProductClick(p)}>
                  <div className="aspect-square bg-zinc-800 flex items-center justify-center relative overflow-hidden">
                    {img ? <img src={img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <ShoppingBag className="w-10 h-10 text-zinc-600" />}
                    {hasDiscount && <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500 text-zinc-950">{Math.round(((p.price - p.discount_price) / p.price) * 100)}% OFF</span>}
                  </div>
                  <div className="p-3 space-y-1">
                    <p className="text-sm font-medium text-zinc-200 truncate">{p.name}</p>
                    <div className="flex items-baseline gap-1.5">
                      <p className="text-base font-bold text-amber-400">₹{p.discount_price || p.price}</p>
                      {hasDiscount && <p className="text-xs text-zinc-500 line-through">₹{p.price}</p>}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="bg-zinc-950 py-16">
        <div className="max-w-6xl mx-auto px-4 space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-amber-50" style={{ fontFamily: "'Playfair Display', serif" }}>Client Testimonials {avgRating && `• ${avgRating}★`}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reviews.slice(0, 6).map(r => (
              <div key={r.id} className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                <div className="flex gap-0.5">{[...Array(5)].map((_, j) => <Star key={j} className={`w-4 h-4 ${j < r.rating ? 'text-amber-400 fill-amber-400' : 'text-zinc-700'}`} />)}</div>
                {r.review_text && <p className="text-sm text-zinc-300 italic leading-relaxed">"{r.review_text}"</p>}
                <p className="text-xs text-zinc-500 font-medium tracking-wider uppercase">{r.reviewer_name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <StoreFooter business={business} theme={theme} />
    </div>
  );
};

export default LuxuryTheme;
