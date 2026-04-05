import { motion } from 'framer-motion';
import { ShoppingBag, Star, BookOpen, BookMarked, GraduationCap, Library, Quote, MessageCircle } from 'lucide-react';
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

const BookshopTheme = ({ business, products, reviews, banners, offers, videos, onProductClick, getImageSrc }: ThemeProps) => {
  const theme = {
    footerBg: 'bg-amber-950', footerText: 'text-amber-400', emoji: '📚',
    tagline: business.tagline || 'Books, Stationery & Knowledge',
  };
  const avgRating = reviews.length > 0 ? (reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length).toFixed(1) : null;
  const categories = [...new Set(products.map(p => p.category))];

  return (
    <div className="min-h-screen bg-amber-50/20" style={{ fontFamily: "'Merriweather', 'Georgia', serif" }}>
      {/* Promo Strip */}
      <div className="bg-gradient-to-r from-amber-700 to-orange-600 text-white text-center py-2 text-xs font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
        📖 Back to School Sale! <span className="hidden md:inline">| 🎁 Buy 3 Get 1 Free on Select Books</span>
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-amber-50/95 backdrop-blur-xl border-b border-amber-200/50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {business.logo_url ? (
              <img src={getImageSrc(business.logo_url)} alt="" className="w-10 h-10 rounded-xl object-cover ring-2 ring-amber-300" />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-orange-700 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
            )}
            <div>
              <span className="text-sm font-bold text-slate-900">{business.business_name}</span>
              <p className="text-[10px] text-amber-700 font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>Since you love reading</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600" style={{ fontFamily: 'Inter, sans-serif' }}>
            <a href="#products" className="hover:text-amber-700 transition-colors">Books</a>
            <a href="#categories" className="hover:text-amber-700 transition-colors">Categories</a>
            <a href="#reviews" className="hover:text-amber-700 transition-colors">Reviews</a>
          </div>
          {business.whatsapp_number && (
            <a href={`https://wa.me/${business.whatsapp_number}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-500 text-white text-xs font-bold" style={{ fontFamily: 'Inter, sans-serif' }}>
              <MessageCircle className="w-3.5 h-3.5" /> Chat
            </a>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-amber-800 via-amber-700 to-orange-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.184 20c.357-.13.72-.264 1.088-.402l1.768-.661C33.64 15.347 39.647 14 50 14c10.271 0 15.362 1.222 24.629 4.928.955.383 1.869.74 2.75 1.072h6.225c-2.51-.73-5.139-1.691-8.233-2.928C65.888 13.278 60.562 12 50 12c-10.626 0-16.855 1.397-26.66 5.063l-1.767.662c-2.475.923-4.66 1.674-6.724 2.275h6.335zm0-20C13.258 2.892 8.077 4 0 4V2c5.744 0 9.951-.574 14.85-2h6.334zM77.38 0C85.239 2.966 90.502 4 100 4V2c-6.842 0-11.386-.542-16.396-2h-6.225zM0 14c8.44 0 13.718-1.21 22.272-4.402l1.768-.661C33.64 5.347 39.647 4 50 4c10.271 0 15.362 1.222 24.629 4.928C84.112 12.722 89.438 14 100 14v-2c-10.271 0-15.362-1.222-24.629-4.928C65.888 3.278 60.562 2 50 2 39.374 2 33.145 3.397 23.34 7.063l-1.767.662C13.223 10.84 8.163 12 0 12v2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        }} />
        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-32 text-center space-y-6">
          {business.logo_url ? (
            <img src={getImageSrc(business.logo_url)} alt="" className="w-24 h-24 mx-auto rounded-2xl object-cover border-4 border-white/20 shadow-2xl" />
          ) : (
            <div className="w-24 h-24 mx-auto rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center text-5xl">📚</div>
          )}
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold leading-tight">
            {business.business_name}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            className="text-lg text-white/60 max-w-lg mx-auto italic">
            "{theme.tagline}"
          </motion.p>
          <motion.a initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            href="#products" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white text-amber-800 text-sm font-bold shadow-lg hover:shadow-xl transition-all" style={{ fontFamily: 'Inter, sans-serif' }}>
            <BookOpen className="w-4 h-4" /> Browse Collection
          </motion.a>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-amber-50/20 to-transparent" />
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 -mt-6 relative z-10 mb-8">
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: BookMarked, label: 'All Genres', desc: 'Wide Selection' },
            { icon: GraduationCap, label: 'School Supplies', desc: 'Stationery & More' },
            { icon: Library, label: 'Bestsellers', desc: 'Curated Picks' },
          ].map((f, i) => (
            <motion.div key={f.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="rounded-2xl bg-white shadow-md border border-amber-100 p-4 text-center">
              <f.icon className="w-6 h-6 mx-auto text-amber-700 mb-2" />
              <p className="text-xs font-bold text-slate-900" style={{ fontFamily: 'Inter, sans-serif' }}>{f.label}</p>
              <p className="text-[10px] text-slate-500" style={{ fontFamily: 'Inter, sans-serif' }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {banners.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 pb-8">
          <BannerSlideshow banners={banners} />
        </div>
      )}

      <OffersSection offers={offers} theme={theme} />
      <VideoSection videos={videos} />

      {/* Categories */}
      {categories.length > 1 && (
        <section id="categories" className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {categories.map(cat => (
              <span key={cat} className="px-4 py-2 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold whitespace-nowrap" style={{ fontFamily: 'Inter, sans-serif' }}>
                {cat}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Products */}
      <section id="products" className="max-w-6xl mx-auto px-4 py-12 space-y-6">
        <h2 className="text-3xl font-bold text-slate-900">📖 Browse Books & Supplies</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p, i) => {
            const img = getImageSrc(p.image_url || '');
            const hasDiscount = p.discount_price < p.price;
            return (
              <motion.div key={p.id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.03 }} whileHover={{ y: -4 }}
                className="rounded-2xl bg-white overflow-hidden cursor-pointer shadow-sm hover:shadow-lg transition-all border border-amber-100 group" onClick={() => onProductClick(p)}>
                <div className="aspect-[3/4] bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center relative overflow-hidden">
                  {img ? <img src={img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <BookOpen className="w-10 h-10 text-amber-300" />}
                  {hasDiscount && <span className="absolute top-2 left-2 text-[10px] font-bold px-2.5 py-1 rounded-full bg-red-500 text-white">{Math.round(((p.price - p.discount_price) / p.price) * 100)}% OFF</span>}
                </div>
                <div className="p-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <p className="text-[10px] text-amber-600 font-medium uppercase">{p.category}</p>
                  <p className="text-sm font-semibold text-slate-900 truncate">{p.name}</p>
                  {p.brand_name && <p className="text-[10px] text-slate-500">by {p.brand_name}</p>}
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <p className="text-base font-black text-amber-800">₹{p.discount_price || p.price}</p>
                    {hasDiscount && <p className="text-xs text-slate-400 line-through">₹{p.price}</p>}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="bg-amber-50 py-16">
        <div className="max-w-6xl mx-auto px-4 space-y-8">
          <div className="text-center">
            <Quote className="w-8 h-8 mx-auto text-amber-600 mb-3" />
            <h2 className="text-3xl font-bold text-slate-900">Reader Reviews {avgRating && `• ${avgRating}★`}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reviews.slice(0, 6).map(r => (
              <div key={r.id} className="p-5 rounded-2xl bg-white border border-amber-200 space-y-3">
                <div className="flex gap-0.5">{[...Array(5)].map((_, j) => <Star key={j} className={`w-4 h-4 ${j < r.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`} />)}</div>
                {r.review_text && <p className="text-sm text-slate-700 italic leading-relaxed">"{r.review_text}"</p>}
                <p className="text-xs text-amber-600 font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>{r.reviewer_name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <StoreFooter business={business} theme={theme} />
    </div>
  );
};

export default BookshopTheme;
