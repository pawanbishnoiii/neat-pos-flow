import { motion } from 'framer-motion';
import { Store, ShoppingBag, Star, MapPin, Phone, Sparkles } from 'lucide-react';
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

const ModernTheme = ({ business, products, reviews, banners, offers, videos, onProductClick, getImageSrc }: ThemeProps) => {
  const theme = {
    footerBg: 'bg-slate-950', footerText: 'text-slate-400', emoji: '✨',
    tagline: business.tagline || 'Modern Shopping Experience',
  };
  const avgRating = reviews.length > 0 ? (reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length).toFixed(1) : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white" style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}>
      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {business.logo_url ? <img src={getImageSrc(business.logo_url)} alt="" className="w-9 h-9 rounded-xl object-cover ring-2 ring-violet-200" /> : <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-lg">✨</div>}
            <span className="text-sm font-bold text-slate-900 tracking-tight">{business.business_name}</span>
          </div>
          <div className="hidden md:flex gap-6 text-xs font-semibold text-slate-500">
            <a href="#products" className="hover:text-violet-600 transition-colors">Products</a>
            <a href="#reviews" className="hover:text-violet-600 transition-colors">Reviews</a>
            <a href="#contact" className="hover:text-violet-600 transition-colors">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero with gradient */}
      <section className="relative bg-gradient-to-br from-violet-600 via-fuchsia-500 to-pink-500 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-32 text-center space-y-5">
          {business.logo_url ? (
            <img src={getImageSrc(business.logo_url)} alt="" className="w-24 h-24 mx-auto rounded-3xl object-cover border-4 border-white/30 shadow-2xl" />
          ) : (
            <div className="w-24 h-24 mx-auto rounded-3xl bg-white/20 backdrop-blur flex items-center justify-center text-5xl">✨</div>
          )}
          <h1 className="text-4xl md:text-6xl font-black tracking-tight">{business.business_name}</h1>
          <p className="text-white/70 text-lg font-medium">{theme.tagline}</p>
          <a href="#products" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white text-violet-700 text-sm font-bold shadow-lg hover:shadow-xl transition-all">
            <ShoppingBag className="w-4 h-4" /> Browse Collection
          </a>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      {banners.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 -mt-8 relative z-10 pb-8">
          <BannerSlideshow banners={banners} />
        </div>
      )}

      <OffersSection offers={offers} theme={theme} />
      <VideoSection videos={videos} />

      {/* Products - glassmorphism cards */}
      <section id="products" className="max-w-6xl mx-auto px-4 py-12 md:py-16 space-y-6">
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 flex items-center gap-2"><Sparkles className="w-6 h-6 text-violet-500" /> Our Collection</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p, i) => {
            const img = getImageSrc(p.image_url || '');
            const hasDiscount = p.discount_price < p.price;
            return (
              <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.03 }} whileHover={{ y: -4 }}
                className="rounded-2xl bg-white/80 backdrop-blur border border-slate-200/60 overflow-hidden cursor-pointer hover:shadow-xl hover:shadow-violet-200/30 transition-all" onClick={() => onProductClick(p)}>
                <div className="aspect-square bg-gradient-to-br from-slate-100 to-violet-50 flex items-center justify-center relative overflow-hidden">
                  {img ? <img src={img} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" /> : <ShoppingBag className="w-8 h-8 text-slate-300" />}
                  {hasDiscount && <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white">{Math.round(((p.price - p.discount_price) / p.price) * 100)}% OFF</span>}
                </div>
                <div className="p-3 space-y-1">
                  <p className="text-sm font-semibold text-slate-900 truncate">{p.name}</p>
                  <div className="flex items-baseline gap-1.5">
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
      <section id="reviews" className="max-w-6xl mx-auto px-4 py-12 space-y-6">
        <h2 className="text-2xl font-black text-slate-900">Customer Love {avgRating && `⭐ ${avgRating}`}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reviews.slice(0, 6).map(r => (
            <div key={r.id} className="p-5 rounded-2xl bg-white/80 backdrop-blur border border-slate-200/60 space-y-2">
              <div className="flex gap-0.5">{[...Array(5)].map((_, j) => <Star key={j} className={`w-4 h-4 ${j < r.rating ? 'text-yellow-500 fill-yellow-500' : 'text-slate-300'}`} />)}</div>
              {r.review_text && <p className="text-sm text-slate-700 italic leading-relaxed">"{r.review_text}"</p>}
              <p className="text-xs text-slate-500 font-medium">{r.reviewer_name}</p>
            </div>
          ))}
        </div>
      </section>

      <StoreFooter business={business} theme={theme} />
    </div>
  );
};

export default ModernTheme;
