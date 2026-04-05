import { motion } from 'framer-motion';
import { Store, ShoppingBag, Star, MapPin, Phone, MessageSquare } from 'lucide-react';
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

const StarterTheme = ({ business, products, reviews, banners, offers, videos, onProductClick, getImageSrc }: ThemeProps) => {
  const theme = {
    footerBg: 'bg-gray-900', footerText: 'text-gray-400', emoji: '⚡',
    tagline: business.tagline || 'Welcome to Our Store',
  };
  const avgRating = reviews.length > 0 ? (reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length).toFixed(1) : null;

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {business.logo_url ? <img src={getImageSrc(business.logo_url)} alt="" className="w-8 h-8 rounded-lg object-cover" /> : <Store className="w-5 h-5 text-gray-700" />}
            <span className="text-sm font-semibold text-gray-900">{business.business_name}</span>
          </div>
          <div className="hidden md:flex gap-6 text-xs font-medium text-gray-500">
            <a href="#products" className="hover:text-gray-900">Products</a>
            <a href="#reviews" className="hover:text-gray-900">Reviews</a>
            <a href="#contact" className="hover:text-gray-900">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 py-16 text-center space-y-4">
        {business.logo_url ? (
          <img src={getImageSrc(business.logo_url)} alt="" className="w-20 h-20 mx-auto rounded-2xl object-cover shadow-md" />
        ) : (
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gray-100 flex items-center justify-center text-3xl">⚡</div>
        )}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{business.business_name}</h1>
        <p className="text-gray-500 text-sm">{theme.tagline}</p>
        <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
          {business.address && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{business.address}</span>}
          {business.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{business.phone}</span>}
        </div>
      </section>

      {banners.length > 0 && (
        <div className="max-w-5xl mx-auto px-4 pb-8">
          <BannerSlideshow banners={banners} />
        </div>
      )}

      <OffersSection offers={offers} theme={theme} />
      <VideoSection videos={videos} />

      {/* Products */}
      <section id="products" className="max-w-5xl mx-auto px-4 py-12 space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p, i) => {
            const img = getImageSrc(p.image_url || '');
            return (
              <motion.div key={p.id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.03 }} className="rounded-xl border border-gray-100 bg-white overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onProductClick(p)}>
                <div className="aspect-square bg-gray-50 flex items-center justify-center">
                  {img ? <img src={img} alt={p.name} className="w-full h-full object-cover" /> : <ShoppingBag className="w-8 h-8 text-gray-300" />}
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                  <p className="text-sm font-bold text-gray-700 mt-1">₹{p.discount_price || p.price}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="max-w-5xl mx-auto px-4 py-12 space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Reviews {avgRating && `(${avgRating} ★)`}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.slice(0, 6).map(r => (
            <div key={r.id} className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-2">
              <div className="flex gap-0.5">{[...Array(5)].map((_, j) => <Star key={j} className={`w-3.5 h-3.5 ${j < r.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />)}</div>
              {r.review_text && <p className="text-sm text-gray-700 italic">"{r.review_text}"</p>}
              <p className="text-xs text-gray-500">{r.reviewer_name}</p>
            </div>
          ))}
        </div>
      </section>

      <StoreFooter business={business} theme={theme} />
    </div>
  );
};

export default StarterTheme;
