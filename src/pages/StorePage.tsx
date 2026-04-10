import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Store, Phone, MapPin, Package, Loader2, Star, ChevronLeft, ChevronRight, Send, X, ShoppingBag, Heart, MessageSquare, Mail, ArrowUp, Menu, Instagram, Facebook, Twitter, Clock, Zap, Award, Sparkles, Eye, Shield, Tag, MessageCircle } from 'lucide-react';
import StoreFooter from '@/components/store/StoreFooter';
import BannerSlideshow from '@/components/store/BannerSlideshow';
import OffersSection from '@/components/store/OffersSection';
import VideoSection from '@/components/store/VideoSection';
import ProductDetailPage from '@/components/store/ProductDetailPage';
import StarterTheme from '@/components/store/themes/StarterTheme';
import ModernTheme from '@/components/store/themes/ModernTheme';
import BoldTheme from '@/components/store/themes/BoldTheme';
import LuxuryTheme from '@/components/store/themes/LuxuryTheme';
import AutoServiceTheme from '@/components/store/themes/AutoServiceTheme';
import GroceryTheme from '@/components/store/themes/GroceryTheme';
import FashionTheme from '@/components/store/themes/FashionTheme';
import BookshopTheme from '@/components/store/themes/BookshopTheme';
import CarWashTheme from '@/components/store/themes/CarWashTheme';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import LottieAnimation from '@/components/common/LottieAnimation';

const STORE_THEMES_MAP: Record<string, any> = {
  starter: StarterTheme, modern: ModernTheme, bold: BoldTheme, luxury: LuxuryTheme,
  auto_service: AutoServiceTheme, grocery: GroceryTheme, fashion: FashionTheme, bookshop: BookshopTheme,
  car_wash: CarWashTheme,
};

const AnimSection = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className={className}>{children}</motion.div>;
};

// Loading skeleton
const StoreSkeleton = () => (
  <div className="min-h-screen bg-white animate-pulse">
    <div className="h-14 bg-gray-100" />
    <div className="h-80 bg-gray-100" />
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-4">
      <div className="h-8 bg-gray-100 rounded-xl w-48" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="rounded-2xl bg-gray-100 aspect-square" />
        ))}
      </div>
    </div>
  </div>
);

const StorePage = () => {
  const { slug } = useParams();
  const { toast } = useToast();
  const [business, setBusiness] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  useEffect(() => {
    if (!slug) return;
    const fetchStore = async () => {
      const { data, error } = await supabase.rpc('get_store_by_slug', { _slug: slug });
      if (data && !error) {
        const result = data as any;
        setBusiness(result.business);
        setProducts(result.products || []);
        setReviews(result.reviews || []);
        const businessId = result.business?.id;
        if (businessId) {
          const [mediaRes, offersRes] = await Promise.all([
            supabase.from('store_media').select('*').eq('business_id', businessId).eq('is_active', true).order('sort_order'),
            supabase.from('business_offers').select('*').eq('business_id', businessId).eq('is_active', true),
          ]);
          const media = mediaRes.data || [];
          setBanners(media.filter((m: any) => m.media_type === 'banner' || m.media_type === 'image'));
          setVideos(media.filter((m: any) => m.media_type === 'video'));
          setOffers(offersRes.data || []);
        }
      }
      setLoading(false);
    };
    fetchStore();
  }, [slug]);

  const getImageSrc = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return supabase.storage.from('product-images').getPublicUrl(url).data.publicUrl;
  };

  if (loading) return <StoreSkeleton />;
  
  if (!business) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-3">
      <LottieAnimation type="empty" size={100} loop />
      <p className="text-lg font-semibold text-gray-900">Store Not Found</p>
      <p className="text-sm text-gray-500">This store link may not exist or has been removed.</p>
    </div>
  );

  // If product is selected, show full product page
  if (selectedProduct) {
    return (
      <ProductDetailPage
        product={selectedProduct}
        reviews={reviews}
        business={business}
        getImageSrc={getImageSrc}
        onBack={() => setSelectedProduct(null)}
      />
    );
  }

  const storeTheme = business.store_theme;
  const ThemeComponent = STORE_THEMES_MAP[storeTheme];

  const themeProps = {
    business, products, reviews, banners, offers, videos,
    onProductClick: (p: any) => setSelectedProduct(p),
    getImageSrc,
  };

  if (ThemeComponent) {
    return <ThemeComponent {...themeProps} />;
  }

  // Default theme
  return (
    <DefaultStoreTheme
      business={business} products={products} reviews={reviews}
      banners={banners} offers={offers} videos={videos}
      setSelectedProduct={setSelectedProduct}
      getImageSrc={getImageSrc}
    />
  );
};

// Default theme
const DefaultStoreTheme = ({ business, products, reviews, banners, offers, videos, setSelectedProduct, getImageSrc }: any) => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [filterCat, setFilterCat] = useState('All');

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const avgRating = reviews.length > 0 ? (reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length).toFixed(1) : null;
  const productCategories: string[] = ['All', ...Array.from(new Set<string>(products.map((p: any) => String(p.category))))];
  const filteredProducts = filterCat === 'All' ? products : products.filter((p: any) => p.category === filterCat);
  const theme = { footerBg: 'bg-slate-900', footerText: 'text-slate-400', emoji: '⚡', tagline: 'Welcome to Our Store' };

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {business.logo_url ? <img src={getImageSrc(business.logo_url)} alt="" className="w-9 h-9 rounded-xl object-cover border border-white/20" />
              : <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-lg">⚡</div>}
            <span className="text-sm font-bold text-white tracking-tight">{business.business_name}</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            {['Home', 'Products', 'Reviews', 'Contact'].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} className="text-xs font-medium text-white/60 hover:text-white transition-colors">{l}</a>
            ))}
          </div>
          <button onClick={() => setMobileNav(!mobileNav)} className="md:hidden p-2 rounded-lg bg-white/10"><Menu className="w-4 h-4 text-white" /></button>
        </div>
        {/* Mobile nav dropdown */}
        <AnimatePresence>
          {mobileNav && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/10 bg-slate-900/95">
              <div className="px-4 py-3 flex flex-col gap-2">
                {['Home', 'Products', 'Reviews', 'Contact'].map(l => (
                  <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMobileNav(false)} className="text-sm font-medium text-white/80 hover:text-white py-2">{l}</a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero */}
      <section id="home" className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        {/* Animated bg shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-36 text-center space-y-6">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', delay: 0.1 }}>
            {business.logo_url ? <img src={getImageSrc(business.logo_url)} alt="" className="w-28 h-28 mx-auto rounded-3xl object-cover border-4 border-white/20 shadow-2xl" />
              : <div className="w-28 h-28 mx-auto rounded-3xl bg-white/10 backdrop-blur flex items-center justify-center text-5xl border-2 border-white/20">⚡</div>}
          </motion.div>
          <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold tracking-tight">{business.business_name}</motion.h1>
          <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
            className="text-lg text-white/60 max-w-md mx-auto">{theme.tagline}</motion.p>
          
          {avgRating && (
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }}
              className="flex items-center justify-center gap-2">
              <div className="flex gap-0.5">{[...Array(5)].map((_, j) => <Star key={j} className={`w-4 h-4 ${j < Math.round(Number(avgRating)) ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}`} />)}</div>
              <span className="text-sm text-white/70">{avgRating} ({reviews.length} reviews)</span>
            </motion.div>
          )}

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-4 flex-wrap text-sm text-white/70">
            {business.address && <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full"><MapPin className="w-3.5 h-3.5" />{business.address}</span>}
            {business.phone && <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full"><Phone className="w-3.5 h-3.5" />{business.phone}</span>}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-3 flex-wrap">
            <a href="#products" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white text-slate-900 text-sm font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105">
              <ShoppingBag className="w-4 h-4" /> Browse Products
            </a>
            {business.phone && (
              <a href={`tel:${business.phone}`} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 backdrop-blur text-white text-sm font-semibold hover:bg-white/20 transition-all">
                <Phone className="w-4 h-4" /> Call Now
              </a>
            )}
            {business.whatsapp_number && (
              <a href={`https://wa.me/${business.whatsapp_number}`} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-green-600/80 text-white text-sm font-semibold hover:bg-green-600 transition-all">
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
            )}
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Banner Slideshow */}
      {banners.length > 0 && (
        <AnimSection>
          <div className="max-w-6xl mx-auto px-4 py-8">
            <BannerSlideshow banners={banners} />
          </div>
        </AnimSection>
      )}

      {/* Offers */}
      <AnimSection>
        <OffersSection offers={offers} theme={theme} />
      </AnimSection>

      {/* Videos */}
      <AnimSection>
        <VideoSection videos={videos} />
      </AnimSection>

      {/* Products */}
      <AnimSection>
        <section id="products" className="max-w-6xl mx-auto px-4 py-12 md:py-16 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2"><ShoppingBag className="w-6 h-6 text-gray-600" /> Our Products</h2>
            <span className="text-xs text-gray-400 font-medium">{products.length} items</span>
          </div>
          {productCategories.length > 2 && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
              {productCategories.map((cat: string) => (
                <button key={cat} onClick={() => setFilterCat(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${filterCat === cat ? 'bg-gray-900 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {cat}
                </button>
              ))}
            </div>
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((p: any, i: number) => {
              const imgSrc = getImageSrc(p.image_url || '');
              const hasDiscount = p.discount_price < p.price;
              return (
                <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }} whileHover={{ y: -6 }}
                  className="rounded-2xl bg-white border border-gray-100 overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300"
                  onClick={() => setSelectedProduct(p)}>
                  <div className="aspect-square bg-gray-50 flex items-center justify-center relative overflow-hidden">
                    {imgSrc ? <img src={imgSrc} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /> : <Package className="w-10 h-10 text-gray-300" />}
                    {hasDiscount && <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500 text-white shadow-md">{Math.round(((p.price - p.discount_price) / p.price) * 100)}% OFF</span>}
                  </div>
                  <div className="p-3 space-y-1">
                    <p className="text-sm font-semibold truncate text-gray-900">{p.name}</p>
                    {p.brand_name && <p className="text-[10px] text-gray-400 font-medium">{p.brand_name}</p>}
                    <div className="flex items-baseline gap-1.5">
                      <p className="text-base font-bold text-gray-900">₹{p.discount_price || p.price}</p>
                      {hasDiscount && <p className="text-xs text-gray-400 line-through">₹{p.price}</p>}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          {filteredProducts.length === 0 && (
            <div className="text-center py-12 rounded-2xl bg-gray-50">
              <Package className="w-10 h-10 mx-auto text-gray-300 mb-3" />
              <p className="text-sm text-gray-500">No products in this category.</p>
            </div>
          )}
        </section>
      </AnimSection>

      {/* Reviews */}
      <AnimSection>
        <section id="reviews" className="max-w-6xl mx-auto px-4 py-12 space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2"><MessageSquare className="w-6 h-6 text-gray-600" /> Customer Reviews</h2>
          {reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reviews.slice(0, 9).map((r: any, i: number) => (
                <motion.div key={r.id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  className="rounded-2xl bg-gray-50 border border-gray-100 p-5 space-y-3 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                      {r.reviewer_name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-900">{r.reviewer_name}</p>
                      <div className="flex items-center gap-0.5">{[...Array(5)].map((_, j) => <Star key={j} className={`w-3 h-3 ${j < r.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />)}</div>
                    </div>
                  </div>
                  {r.review_text && <p className="text-sm text-gray-700 italic leading-relaxed">"{r.review_text}"</p>}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 rounded-2xl bg-gray-50 border border-gray-100">
              <MessageSquare className="w-8 h-8 mx-auto text-gray-300 mb-3" />
              <p className="text-sm text-gray-500">No reviews yet.</p>
            </div>
          )}
        </section>
      </AnimSection>

      {/* Contact */}
      <AnimSection>
        <section id="contact" className="max-w-6xl mx-auto px-4 py-12 space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center">Get in Touch</h2>
          <div className="max-w-md mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
            {business.phone && (
              <a href={`tel:${business.phone}`} className="rounded-2xl bg-gray-50 border border-gray-100 p-6 text-center space-y-3 hover:shadow-lg transition-all hover:-translate-y-1">
                <Phone className="w-7 h-7 mx-auto text-gray-600" /><p className="text-sm font-bold text-gray-900">Call Us</p><p className="text-xs text-gray-500">{business.phone}</p>
              </a>
            )}
            {business.address && (
              <div className="rounded-2xl bg-gray-50 border border-gray-100 p-6 text-center space-y-3">
                <MapPin className="w-7 h-7 mx-auto text-gray-600" /><p className="text-sm font-bold text-gray-900">Visit Us</p><p className="text-xs text-gray-500">{business.address}</p>
              </div>
            )}
          </div>
        </section>
      </AnimSection>

      <StoreFooter business={business} theme={theme} />

      {/* Back to top */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StorePage;
