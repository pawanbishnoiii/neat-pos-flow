import { motion } from 'framer-motion';
import { Tag, Clock, Copy, Sparkles } from 'lucide-react';
import dayjs from 'dayjs';

interface OffersSectionProps {
  offers: any[];
  theme: any;
}

const OffersSection = ({ offers, theme }: OffersSectionProps) => {
  if (offers.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 py-12 space-y-6">
      <div className="flex items-center gap-2">
        <Sparkles className="w-6 h-6 text-yellow-500" />
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Special Offers</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {offers.map((offer, i) => {
          const isExpired = offer.ends_at && dayjs(offer.ends_at).isBefore(dayjs());
          const maxed = offer.max_claims && offer.claimed_count >= offer.max_claims;
          return (
            <motion.div key={offer.id}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-2xl border-2 p-5 space-y-3 transition-all hover:shadow-lg ${isExpired || maxed ? 'border-gray-200 opacity-60' : 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50'}`}>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-black text-orange-600">{offer.discount_percent}% OFF</span>
                {isExpired ? (
                  <span className="text-[10px] px-2 py-1 rounded-full bg-gray-200 text-gray-600 font-bold">Expired</span>
                ) : maxed ? (
                  <span className="text-[10px] px-2 py-1 rounded-full bg-red-100 text-red-600 font-bold">Sold Out</span>
                ) : (
                  <span className="text-[10px] px-2 py-1 rounded-full bg-green-100 text-green-700 font-bold animate-pulse">Active</span>
                )}
              </div>
              <p className="text-sm font-bold text-gray-900">{offer.title}</p>
              {offer.description && <p className="text-xs text-gray-600">{offer.description}</p>}
              {offer.coupon_code && (
                <button onClick={() => navigator.clipboard.writeText(offer.coupon_code)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border-2 border-dashed border-orange-300 text-sm font-mono font-bold text-orange-700 hover:bg-orange-50 transition-colors w-full justify-center">
                  <Copy className="w-3.5 h-3.5" /> {offer.coupon_code}
                </button>
              )}
              <div className="flex items-center gap-4 text-[10px] text-gray-500">
                {offer.ends_at && (
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Expires {dayjs(offer.ends_at).format('DD MMM YYYY')}</span>
                )}
                {offer.max_claims > 0 && (
                  <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> {offer.claimed_count || 0}/{offer.max_claims} claimed</span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default OffersSection;
