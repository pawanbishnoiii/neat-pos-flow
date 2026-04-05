import { motion } from 'framer-motion';
import { ShoppingBag, Star, Heart, Sparkles, ArrowRight, MessageCircle } from 'lucide-react';
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

const FashionTheme = ({ business, products, reviews, banners, offers, videos, onProductClick, getImageSrc }: ThemeProps) => {
  const theme = {
    footerBg: 'bg-rose-950', footerText: 'text-rose-400', emoji: '👗',
    tagline: business.tagline || 'Style That Speaks',
  };
  const avgRating = reviews.length > 0 ? (reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length).toFixed(1) : null;

  return (
    <div className="min-h-screen bg-rose-50/20" style={{ fontFamily: "'Playfair Display', 'Inter', serif" }}>
      {/* Promo Strip */}
      <div className="bg-gradient-to-r from-rose-600 via-pink-500 to-fuchsia-500 text-white text-center py-2 text-xs font-semibold tracking-wide" style={{ fontFamily: 'Inter, sans-serif' }}>
        ✨ New Collection Dropped! <span className="hidden md:inline">| 💝 Up to 50% Off on Select Styles</span>
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-rose-100">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {business.logo_url ? (
              <img src={getImageSrc(business.logo_url)} alt="" className="w-10 h-10 rounded-full object-cover ring-2 ring-rose-300" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-fuchsia-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            )}
            <span className="text-base font-bold tracking-tight text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>{business.business_name}</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600 tracking-wider uppercase" style={{ fontFamily: 'Inter, sans-serif' }}>
            <a href="#products" className="hover:text-rose-600 transition-colors">Collections</a>
            <a href="#reviews" className="hover:text-rose-600 transition-colors">Reviews</a>
          </div>
          <div className="flex items-center gap-2">
            {business.whatsapp_number && (
              <a href={`https://wa.me/${business.whatsapp_number}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-green-500 text-white text-xs font-bold">
                <MessageCircle className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-rose-600 via-pink-500 to-fuchsia-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.3) 0%, transparent 50%)',
        }} />
        <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-40 text-center space-y-6">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-bold uppercase tracking-[0.3em] text-white/60" style={{ fontFamily: 'Inter, sans-serif' }}>
            New Season Collection
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-bold leading-none" style={{ fontFamily: "'Playfair Display', serif" }}>
            {business.business_name}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-lg text-white/60 max-w-md mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
            {theme.tagline}
          </motion.p>
          <motion.a initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            href="#products" className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-white text-rose-700 text-sm font-bold uppercase tracking-wider shadow-xl hover:shadow-2xl transition-all" style={{ fontFamily: 'Inter, sans-serif' }}>
            Shop Now <ArrowRight className="w-4 h-4" />
          </motion.a>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-rose-50/20 to-transparent" />
      </section>

      {banners.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <BannerSlideshow banners={banners} />
        </div>
      )}

      <OffersSection offers={offers} theme={theme} />
      <VideoSection videos={videos} />

      {/* Products - Fashion Layout */}
      <section id="products" className="max-w-7xl mx-auto px-4 py-16 space-y-8">
        <div className="text-center space-y-2">
          <p className="text-xs text-rose-500 font-bold uppercase tracking-[0.3em]" style={{ fontFamily: 'Inter, sans-serif' }}>Curated For You</p>
          <h2 className="text-4xl font-bold text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>Our Collection</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p, i) => {
            const img = getImageSrc(p.image_url || '');
            const hasDiscount = p.discount_price < p.price;
            return (
              <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.03 }} whileHover={{ y: -6 }}
                className="rounded-3xl bg-white overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all border border-rose-100 group" onClick={() => onProductClick(p)}>
                <div className="aspect-[3/4] bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center relative overflow-hidden">
                  {img ? <img src={img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /> : <ShoppingBag className="w-10 h-10 text-rose-200" />}
                  {hasDiscount && (
                    <span className="absolute top-3 left-3 text-[10px] font-bold px-3 py-1 rounded-full bg-rose-500 text-white shadow-md">
                      {Math.round(((p.price - p.discount_price) / p.price) * 100)}% OFF
                    </span>
                  )}
                  <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Heart className="w-4 h-4 text-rose-500" />
                  </button>
                </div>
                <div className="p-3 text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <p className="text-xs text-rose-400 font-medium uppercase tracking-wider">{p.category}</p>
                  <p className="text-sm font-semibold text-slate-900 truncate mt-0.5">{p.name}</p>
                  <div className="flex items-baseline gap-1.5 justify-center mt-1">
                    <p className="text-base font-black text-slate-900">₹{p.discount_price || p.price}</p>
                    {hasDiscount && <p className="text-xs text-slate-400 line-through">₹{p.price}</p>}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>
              Loved by Our Customers {avgRating && `• ${avgRating}★`}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reviews.slice(0, 6).map(r => (
              <div key={r.id} className="p-5 rounded-3xl bg-rose-50/50 border border-rose-100 space-y-3">
                <div className="flex gap-0.5">{[...Array(5)].map((_, j) => <Star key={j} className={`w-4 h-4 ${j < r.rating ? 'text-rose-500 fill-rose-500' : 'text-slate-300'}`} />)}</div>
                {r.review_text && <p className="text-sm text-slate-700 italic leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>"{r.review_text}"</p>}
                <p className="text-xs text-rose-400 font-semibold uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif' }}>{r.reviewer_name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <StoreFooter business={business} theme={theme} />
    </div>
  );
};

export default FashionTheme;
