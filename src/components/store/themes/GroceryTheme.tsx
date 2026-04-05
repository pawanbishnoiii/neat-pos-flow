import { motion } from 'framer-motion';
import { ShoppingBag, Star, MapPin, Phone, ShoppingCart, Truck, Leaf, Tag, Gift, Clock, MessageCircle } from 'lucide-react';
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

const GroceryTheme = ({ business, products, reviews, banners, offers, videos, onProductClick, getImageSrc }: ThemeProps) => {
  const theme = {
    footerBg: 'bg-green-950', footerText: 'text-green-400', emoji: '🛒',
    tagline: business.tagline || 'Fresh Groceries & Daily Essentials',
  };
  const avgRating = reviews.length > 0 ? (reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length).toFixed(1) : null;

  // Group products by category
  const categories = [...new Set(products.map(p => p.category))];

  return (
    <div className="min-h-screen bg-green-50/30" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Promo Strip */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white text-center py-2 text-xs font-semibold">
        🚚 Free Delivery on Orders Above ₹500! <span className="hidden md:inline">| 🎁 Daily Fresh Deals</span>
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-green-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {business.logo_url ? (
              <img src={getImageSrc(business.logo_url)} alt="" className="w-10 h-10 rounded-xl object-cover ring-2 ring-green-200" />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
            )}
            <div>
              <span className="text-sm font-bold text-slate-900">{business.business_name}</span>
              <p className="text-[10px] text-green-600 font-medium">Fresh & Quality Products</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <a href="#products" className="hover:text-green-600 transition-colors">Products</a>
            <a href="#categories" className="hover:text-green-600 transition-colors">Categories</a>
            <a href="#reviews" className="hover:text-green-600 transition-colors">Reviews</a>
          </div>
          <div className="flex items-center gap-2">
            {business.whatsapp_number && (
              <a href={`https://wa.me/${business.whatsapp_number}?text=Hi, I'd like to order from ${business.business_name}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-500 text-white text-xs font-bold hover:bg-green-600 transition-colors">
                <MessageCircle className="w-3.5 h-3.5" /> Order
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-green-600 via-emerald-500 to-teal-500 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, white 2px, transparent 2px)', backgroundSize: '50px 50px' }} />
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-28 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 space-y-5 text-center md:text-left">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 text-xs font-bold">
              <Leaf className="w-3.5 h-3.5" /> 100% Fresh & Quality
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black leading-tight">
              {business.business_name}
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-lg text-white/70">
              {theme.tagline}
            </motion.p>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex gap-3 justify-center md:justify-start">
              <a href="#products" className="px-8 py-3.5 rounded-2xl bg-white text-green-700 text-sm font-black shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" /> Shop Now
              </a>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex gap-4 justify-center md:justify-start text-sm text-white/70">
              {business.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {business.phone}</span>}
              {business.address && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {business.address}</span>}
            </motion.div>
          </div>
          {business.logo_url && (
            <motion.img initial={{ opacity: 0, scale: 0.8, rotate: -5 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ delay: 0.2 }}
              src={getImageSrc(business.logo_url)} alt="" className="w-40 h-40 rounded-3xl object-cover border-4 border-white/30 shadow-2xl" />
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-green-50/30 to-transparent" />
      </section>

      {/* Quick badges */}
      <section className="max-w-7xl mx-auto px-4 -mt-6 relative z-10 mb-8">
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Leaf, label: 'Fresh Quality', color: 'text-green-600 bg-green-100' },
            { icon: Truck, label: 'Fast Delivery', color: 'text-blue-600 bg-blue-100' },
            { icon: Gift, label: 'Best Prices', color: 'text-orange-600 bg-orange-100' },
          ].map((b, i) => (
            <motion.div key={b.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="rounded-2xl bg-white shadow-md p-4 text-center border border-slate-100">
              <div className={`w-10 h-10 mx-auto rounded-xl ${b.color} flex items-center justify-center mb-2`}>
                <b.icon className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-800">{b.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {banners.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 pb-8">
          <BannerSlideshow banners={banners} />
        </div>
      )}

      <OffersSection offers={offers} theme={theme} />
      <VideoSection videos={videos} />

      {/* Categories */}
      {categories.length > 1 && (
        <section id="categories" className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-xl font-black text-slate-900 mb-4">Shop by Category</h2>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {categories.map(cat => (
              <a key={cat} href="#products" className="px-5 py-2.5 rounded-full bg-white border border-green-200 text-sm font-semibold text-green-700 whitespace-nowrap hover:bg-green-50 transition-colors shadow-sm">
                {cat}
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Products */}
      <section id="products" className="max-w-7xl mx-auto px-4 py-12 space-y-6">
        <h2 className="text-3xl font-black text-slate-900">🛒 All Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {products.map((p, i) => {
            const img = getImageSrc(p.image_url || '');
            const hasDiscount = p.discount_price < p.price;
            const savings = hasDiscount ? p.price - p.discount_price : 0;
            return (
              <motion.div key={p.id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.02 }} whileHover={{ scale: 1.02 }}
                className="rounded-2xl bg-white overflow-hidden cursor-pointer shadow-sm hover:shadow-lg transition-all border border-slate-100" onClick={() => onProductClick(p)}>
                <div className="aspect-square bg-green-50 flex items-center justify-center relative overflow-hidden">
                  {img ? <img src={img} alt={p.name} className="w-full h-full object-cover" /> : <ShoppingBag className="w-8 h-8 text-green-300" />}
                  {hasDiscount && (
                    <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500 text-white">
                      Save ₹{savings}
                    </span>
                  )}
                </div>
                <div className="p-2.5">
                  <p className="text-xs font-semibold text-slate-900 truncate">{p.name}</p>
                  <p className="text-[10px] text-slate-500 truncate">{p.category}</p>
                  <div className="flex items-baseline gap-1 mt-1">
                    <p className="text-sm font-black text-green-700">₹{p.discount_price || p.price}</p>
                    {hasDiscount && <p className="text-[10px] text-slate-400 line-through">₹{p.price}</p>}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 space-y-6">
          <h2 className="text-2xl font-black text-slate-900">Happy Customers {avgRating && `⭐ ${avgRating}`}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reviews.slice(0, 6).map(r => (
              <div key={r.id} className="p-4 rounded-2xl bg-green-50 border border-green-100 space-y-2">
                <div className="flex gap-0.5">{[...Array(5)].map((_, j) => <Star key={j} className={`w-3.5 h-3.5 ${j < r.rating ? 'text-yellow-500 fill-yellow-500' : 'text-slate-300'}`} />)}</div>
                {r.review_text && <p className="text-sm text-slate-700 italic">"{r.review_text}"</p>}
                <p className="text-xs text-slate-500 font-semibold">{r.reviewer_name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <StoreFooter business={business} theme={theme} />
    </div>
  );
};

export default GroceryTheme;
