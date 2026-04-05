import { motion } from 'framer-motion';
import { ShoppingBag, Star, MapPin, Phone, Wrench, Car, Shield, Zap, Clock, Award, ChevronRight, MessageCircle } from 'lucide-react';
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

const AutoServiceTheme = ({ business, products, reviews, banners, offers, videos, onProductClick, getImageSrc }: ThemeProps) => {
  const theme = {
    footerBg: 'bg-slate-900', footerText: 'text-slate-400', emoji: '🚗',
    tagline: business.tagline || 'Premium Auto Care & Service',
  };
  const avgRating = reviews.length > 0 ? (reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length).toFixed(1) : null;

  const trustBadges = [
    { icon: Shield, label: 'Trusted Service', value: '100%' },
    { icon: Award, label: 'Happy Customers', value: `${reviews.length * 10}+` },
    { icon: Clock, label: 'Quick Service', value: '30 min' },
    { icon: Wrench, label: 'Expert Team', value: 'Certified' },
  ];

  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Promo Strip */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-center py-2 text-xs font-semibold tracking-wide">
        🔧 Free Vehicle Health Checkup on Every Visit! <span className="hidden md:inline">| ⭐ Rated {avgRating || '5.0'} by our customers</span>
      </div>

      {/* Sticky Nav */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {business.logo_url ? (
              <img src={getImageSrc(business.logo_url)} alt="" className="w-10 h-10 rounded-xl object-cover ring-2 ring-blue-200" />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
            )}
            <div>
              <span className="text-sm font-bold text-slate-900 tracking-tight">{business.business_name}</span>
              <p className="text-[10px] text-slate-500">{theme.tagline}</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <a href="#services" className="hover:text-blue-600 transition-colors">Services</a>
            <a href="#products" className="hover:text-blue-600 transition-colors">Parts</a>
            <a href="#reviews" className="hover:text-blue-600 transition-colors">Reviews</a>
          </div>
          <div className="flex items-center gap-2">
            {business.phone && (
              <a href={`tel:${business.phone}`} className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors">
                <Phone className="w-3.5 h-3.5" /> Call Now
              </a>
            )}
            {business.whatsapp_number && (
              <a href={`https://wa.me/${business.whatsapp_number}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-500 text-white text-xs font-bold hover:bg-green-600 transition-colors">
                <MessageCircle className="w-3.5 h-3.5" /> <span className="hidden md:inline">WhatsApp</span>
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }} />
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 space-y-6 text-center md:text-left">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-xs font-semibold text-blue-300">
              <Zap className="w-3.5 h-3.5" /> Premium Auto Care Center
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black leading-tight tracking-tight">
              {business.business_name}
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-lg text-white/60 max-w-md">
              {theme.tagline}
            </motion.p>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex flex-wrap gap-3 justify-center md:justify-start">
              <a href="#products" className="px-8 py-3.5 rounded-2xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" /> View Services
              </a>
              {business.phone && (
                <a href={`tel:${business.phone}`} className="px-6 py-3.5 rounded-2xl border-2 border-white/20 text-white text-sm font-bold hover:bg-white/10 transition-all flex items-center gap-2">
                  <Phone className="w-4 h-4" /> Book Now
                </a>
              )}
            </motion.div>
          </div>
          {business.logo_url && (
            <motion.img initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
              src={getImageSrc(business.logo_url)} alt="" className="w-48 h-48 rounded-3xl object-cover border-4 border-white/20 shadow-2xl" />
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      {/* Trust Badges */}
      <section className="max-w-7xl mx-auto px-4 -mt-8 relative z-10 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {trustBadges.map((badge, i) => (
            <motion.div key={badge.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
              className="rounded-2xl bg-white shadow-lg shadow-slate-200/50 p-4 text-center border border-slate-100">
              <badge.icon className="w-6 h-6 mx-auto text-blue-600 mb-2" />
              <p className="text-xl font-black text-slate-900">{badge.value}</p>
              <p className="text-[10px] text-slate-500 font-medium">{badge.label}</p>
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

      {/* Products/Services */}
      <section id="products" className="max-w-7xl mx-auto px-4 py-16 space-y-8">
        <div className="text-center space-y-2">
          <p className="text-xs text-blue-600 font-bold uppercase tracking-widest">Our Services & Parts</p>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900">What We Offer</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p, i) => {
            const img = getImageSrc(p.image_url || '');
            const hasDiscount = p.discount_price < p.price;
            return (
              <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.03 }} whileHover={{ y: -4 }}
                className="rounded-2xl bg-white overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all border border-slate-100 group" onClick={() => onProductClick(p)}>
                <div className="aspect-square bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center relative overflow-hidden">
                  {img ? <img src={img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <Wrench className="w-10 h-10 text-blue-300" />}
                  {hasDiscount && <span className="absolute top-2 right-2 text-[10px] font-black px-2.5 py-1 rounded-full bg-red-500 text-white shadow-md">{Math.round(((p.price - p.discount_price) / p.price) * 100)}% OFF</span>}
                </div>
                <div className="p-3">
                  <p className="text-sm font-bold text-slate-900 truncate">{p.name}</p>
                  {p.description && <p className="text-[10px] text-slate-500 truncate mt-0.5">{p.description}</p>}
                  <div className="flex items-baseline gap-1.5 mt-1.5">
                    <p className="text-lg font-black text-blue-600">₹{p.discount_price || p.price}</p>
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
          <div className="text-center space-y-2">
            <p className="text-xs text-blue-600 font-bold uppercase tracking-widest">Testimonials</p>
            <h2 className="text-3xl font-black text-slate-900">What Our Customers Say {avgRating && `⭐ ${avgRating}`}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reviews.slice(0, 6).map((r, i) => (
              <motion.div key={r.id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                <div className="flex gap-0.5">{[...Array(5)].map((_, j) => <Star key={j} className={`w-4 h-4 ${j < r.rating ? 'text-yellow-500 fill-yellow-500' : 'text-slate-300'}`} />)}</div>
                {r.review_text && <p className="text-sm text-slate-700 italic leading-relaxed">"{r.review_text}"</p>}
                <p className="text-xs text-slate-500 font-semibold">{r.reviewer_name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <StoreFooter business={business} theme={theme} />
    </div>
  );
};

export default AutoServiceTheme;
