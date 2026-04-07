import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight, Star, MessageSquare, Send, Loader2, Phone, ShoppingBag, Heart, Share2, Package, X } from 'lucide-react';

interface ProductDetailPageProps {
  product: any;
  reviews: any[];
  business: any;
  getImageSrc: (url: string) => string;
  onBack: () => void;
}

const ProductDetailPage = ({ product, reviews, business, getImageSrc, onBack }: ProductDetailPageProps) => {
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ name: '', email: '', rating: 5, text: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [liked, setLiked] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');

  const allImages = [product.image_url, ...((product.images || []).map((img: any) => img.image_url))].filter(Boolean);
  const currentImg = getImageSrc(allImages[activeImgIdx] || '');
  const productReviews = reviews.filter((r: any) => r.product_id === product.id);
  const hasDiscount = product.discount_price < product.price;
  const discountPercent = hasDiscount ? Math.round(((product.price - product.discount_price) / product.price) * 100) : 0;
  const avgRating = productReviews.length > 0 ? (productReviews.reduce((s: number, r: any) => s + r.rating, 0) / productReviews.length).toFixed(1) : null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: product.name, text: `Check out ${product.name}`, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-white">
      {/* Sticky header */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-2">
            <button onClick={() => setLiked(!liked)} className={`p-2 rounded-xl transition-colors ${liked ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
              <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
            </button>
            <button onClick={handleShare} className="p-2 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8">
          {/* Image Gallery */}
          <div className="relative">
            <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="wait">
                {currentImg ? (
                  <motion.img key={activeImgIdx} src={currentImg} alt={product.name}
                    initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full object-cover" />
                ) : (
                  <Package className="w-20 h-20 text-gray-200" />
                )}
              </AnimatePresence>
              {hasDiscount && (
                <span className="absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-full bg-red-500 text-white shadow-lg">
                  {discountPercent}% OFF
                </span>
              )}
              {allImages.length > 1 && (
                <>
                  <button onClick={() => setActiveImgIdx((activeImgIdx - 1 + allImages.length) % allImages.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition-colors">
                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                  </button>
                  <button onClick={() => setActiveImgIdx((activeImgIdx + 1) % allImages.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition-colors">
                    <ChevronRight className="w-5 h-5 text-gray-700" />
                  </button>
                </>
              )}
            </div>
            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-2 p-4 overflow-x-auto no-scrollbar">
                {allImages.map((img: string, i: number) => (
                  <button key={i} onClick={() => setActiveImgIdx(i)}
                    className={`w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${i === activeImgIdx ? 'border-gray-900 scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                    <img src={getImageSrc(img)} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-4 md:py-8 space-y-5">
            {product.brand_name && (
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{product.brand_name}</span>
            )}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">{product.name}</h1>

            {/* Rating */}
            {avgRating && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className={`w-4 h-4 ${j < Math.round(Number(avgRating)) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-700">{avgRating}</span>
                <span className="text-xs text-gray-400">({productReviews.length} reviews)</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">₹{product.discount_price || product.price}</span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-gray-400 line-through">₹{product.price}</span>
                  <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Save ₹{product.price - product.discount_price}</span>
                </>
              )}
            </div>

            {/* Category badge */}
            <div className="flex items-center gap-2">
              <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">{product.category}</span>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-3 pt-2">
              {business.whatsapp_number && (
                <a href={`https://wa.me/${business.whatsapp_number}?text=Hi! I'm interested in ${product.name} (₹${product.discount_price || product.price})`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex-1 py-3.5 rounded-2xl bg-green-600 text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20">
                  <ShoppingBag className="w-4 h-4" /> Order Now
                </a>
              )}
              {business.phone && (
                <a href={`tel:${business.phone}`}
                  className="py-3.5 px-5 rounded-2xl bg-gray-100 text-gray-700 text-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors">
                  <Phone className="w-4 h-4" /> Call
                </a>
              )}
            </div>

            {/* Tabs */}
            <div className="border-t border-gray-100 pt-4">
              <div className="flex gap-1 mb-4">
                {(['description', 'reviews'] as const).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${activeTab === tab ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    {tab === 'description' ? 'Description' : `Reviews (${productReviews.length})`}
                  </button>
                ))}
              </div>

              {activeTab === 'description' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                  {product.description ? (
                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{product.description}</p>
                  ) : (
                    <p className="text-sm text-gray-400 italic">No description available.</p>
                  )}
                </motion.div>
              )}

              {activeTab === 'reviews' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                  {productReviews.length > 0 ? productReviews.map((r: any) => (
                    <div key={r.id} className="p-4 rounded-2xl bg-gray-50 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                          {r.reviewer_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{r.reviewer_name}</p>
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, j) => <Star key={j} className={`w-3 h-3 ${j < r.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />)}
                          </div>
                        </div>
                      </div>
                      {r.review_text && <p className="text-sm text-gray-600 italic">"{r.review_text}"</p>}
                    </div>
                  )) : (
                    <p className="text-sm text-gray-400 text-center py-6">No reviews yet. Be the first!</p>
                  )}

                  {!showReviewForm ? (
                    <button onClick={() => setShowReviewForm(true)}
                      className="w-full py-3 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors">
                      <MessageSquare className="w-4 h-4" /> Write a Review
                    </button>
                  ) : (
                    <div className="space-y-3 p-4 rounded-2xl bg-gray-50 border border-gray-200">
                      <input type="text" placeholder="Your Name *" value={reviewForm.name}
                        onChange={e => setReviewForm(f => ({ ...f, name: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm" />
                      <input type="email" placeholder="Email (optional)" value={reviewForm.email}
                        onChange={e => setReviewForm(f => ({ ...f, email: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm" />
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(n => (
                          <button key={n} onClick={() => setReviewForm(f => ({ ...f, rating: n }))} className="p-1">
                            <Star className={`w-6 h-6 ${n <= reviewForm.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                          </button>
                        ))}
                      </div>
                      <textarea placeholder="Your review..." value={reviewForm.text}
                        onChange={e => setReviewForm(f => ({ ...f, text: e.target.value }))}
                        rows={3} className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm resize-none" />
                      <div className="flex gap-2">
                        <button onClick={() => setShowReviewForm(false)} className="flex-1 py-2.5 rounded-xl bg-gray-200 text-gray-700 text-sm font-semibold">Cancel</button>
                        <button disabled={submittingReview || !reviewForm.name.trim()}
                          className="flex-1 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold flex items-center justify-center gap-1.5 disabled:opacity-50">
                          {submittingReview ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Submit
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetailPage;
