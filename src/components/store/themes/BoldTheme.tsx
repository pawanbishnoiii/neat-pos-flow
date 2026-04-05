import { motion } from 'framer-motion';
import { ShoppingBag, Star, MapPin, Phone, Zap } from 'lucide-react';
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

const BoldTheme = ({ business, products, reviews, banners, offers, videos, onProductClick, getImageSrc }: ThemeProps) => {
  const theme = {
    footerBg: 'bg-orange-950', footerText: 'text-orange-400', emoji: '🔥',
    tagline: business.tagline || 'Bold & Beautiful',
  };
  const avgRating = reviews.length > 0 ? (reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length).toFixed(1) : null;

  return (
    <div className="min-h-screen bg-orange-50" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <span className="text-base font-black tracking-tight uppercase">{business.business_name}</span>
          <div className="hidden md:flex gap-6 text-xs font-bold uppercase tracking-wider">
            <a href="#products" className="hover:text-orange-200">Shop</a>
            <a href="#reviews" className="hover:text-orange-200">Reviews</a>
          </div>
        </div>
      </nav>

      {/* Full-width hero */}
      <section className="relative bg-gradient-to-br from-orange-600 via-red-500 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-24 md:py-40 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 space-y-6">
            <motion.h1 initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="text-5xl md:text-7xl font-black leading-none tracking-tight">
              {business.business_name}
            </motion.h1>
            <p className="text-xl text-white/80 font-medium">{theme.tagline}</p>
            <a href="#products" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-orange-600 text-sm font-black uppercase tracking-wider shadow-xl hover:shadow-2xl transition-all">
              <Zap className="w-5 h-5" /> Shop Now
            </a>
          </div>
          {business.logo_url && (
            <motion.img initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} src={getImageSrc(business.logo_url)} alt="" className="w-40 h-40 rounded-3xl object-cover border-4 border-white/30 shadow-2xl" />
          )}
        </div>
      </section>

      {banners.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <BannerSlideshow banners={banners} />
        </div>
      )}

      <OffersSection offers={offers} theme={theme} />
      <VideoSection videos={videos} />

      {/* Products - bold cards */}
      <section id="products" className="max-w-7xl mx-auto px-4 py-16 space-y-8">
        <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tight">Our Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((p, i) => {
            const img = getImageSrc(p.image_url || '');
            const hasDiscount = p.discount_price < p.price;
            return (
              <motion.div key={p.id} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                transition={{ delay: i * 0.02 }} whileHover={{ scale: 1.03 }}
                className="rounded-2xl bg-white overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all border-2 border-transparent hover:border-orange-400" onClick={() => onProductClick(p)}>
                <div className="aspect-square bg-orange-50 flex items-center justify-center relative overflow-hidden">
                  {img ? <img src={img} alt={p.name} className="w-full h-full object-cover" /> : <ShoppingBag className="w-10 h-10 text-orange-300" />}
                  {hasDiscount && <span className="absolute top-2 right-2 text-xs font-black px-2.5 py-1 rounded-full bg-red-500 text-white">{Math.round(((p.price - p.discount_price) / p.price) * 100)}%</span>}
                </div>
                <div className="p-4">
                  <p className="text-sm font-bold text-gray-900 truncate">{p.name}</p>
                  <p className="text-lg font-black text-orange-600 mt-1">₹{p.discount_price || p.price}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 space-y-6">
          <h2 className="text-3xl font-black text-gray-900 uppercase">What People Say {avgRating && `• ${avgRating}★`}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reviews.slice(0, 6).map(r => (
              <div key={r.id} className="p-5 rounded-2xl bg-orange-50 border-2 border-orange-100 space-y-2">
                <div className="flex gap-0.5">{[...Array(5)].map((_, j) => <Star key={j} className={`w-4 h-4 ${j < r.rating ? 'text-orange-500 fill-orange-500' : 'text-gray-300'}`} />)}</div>
                {r.review_text && <p className="text-sm text-gray-800 font-medium">"{r.review_text}"</p>}
                <p className="text-xs text-gray-500 font-bold uppercase">{r.reviewer_name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <StoreFooter business={business} theme={theme} />
    </div>
  );
};

export default BoldTheme;
