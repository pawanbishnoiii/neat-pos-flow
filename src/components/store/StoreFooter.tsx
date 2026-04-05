import { MapPin, Phone, Mail, Instagram, Youtube, MessageCircle, Zap, Clock, ExternalLink } from 'lucide-react';

interface StoreFooterProps {
  business: any;
  theme: any;
}

const StoreFooter = ({ business, theme }: StoreFooterProps) => {
  const hasMap = business.google_map_url;
  const hasSocial = business.instagram_handle || business.youtube_handle || business.whatsapp_number;

  return (
    <footer className={`${theme.footerBg} text-white py-16`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {business.logo_url ? (
                <img src={business.logo_url?.startsWith('http') ? business.logo_url : ''} alt="" className="w-12 h-12 rounded-xl object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl">{theme.emoji}</div>
              )}
              <div>
                <p className="text-lg font-bold">{business.business_name}</p>
                <p className={`text-xs ${theme.footerText}`}>{theme.tagline}</p>
              </div>
            </div>
            {business.address && (
              <p className={`flex items-start gap-2 text-sm ${theme.footerText}`}>
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" /> {business.address}
              </p>
            )}
            {business.pincode && (
              <p className={`text-xs ${theme.footerText} ml-6`}>PIN: {business.pincode}</p>
            )}
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-wider opacity-60">Contact</p>
            {business.phone && (
              <a href={`tel:${business.phone}`} className={`flex items-center gap-2 text-sm ${theme.footerText} hover:text-white transition-colors`}>
                <Phone className="w-4 h-4" /> {business.phone}
              </a>
            )}
            {business.contact_email && (
              <a href={`mailto:${business.contact_email}`} className={`flex items-center gap-2 text-sm ${theme.footerText} hover:text-white transition-colors`}>
                <Mail className="w-4 h-4" /> {business.contact_email}
              </a>
            )}
            {business.whatsapp_number && (
              <a href={`https://wa.me/${business.whatsapp_number}`} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600/20 text-green-400 hover:bg-green-600/30 transition-colors text-sm font-medium">
                <MessageCircle className="w-4 h-4" /> WhatsApp Us
              </a>
            )}
          </div>

          {/* Social & Quick Links */}
          <div className="space-y-4">
            {hasSocial && (
              <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-wider opacity-60">Follow Us</p>
                <div className="flex items-center gap-3">
                  {business.instagram_handle && (
                    <a href={`https://instagram.com/${business.instagram_handle}`} target="_blank" rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center hover:scale-110 transition-transform">
                      <Instagram className="w-5 h-5" />
                    </a>
                  )}
                  {business.youtube_handle && (
                    <a href={business.youtube_handle.startsWith('http') ? business.youtube_handle : `https://youtube.com/@${business.youtube_handle}`} target="_blank" rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-red-600/80 flex items-center justify-center hover:scale-110 transition-transform">
                      <Youtube className="w-5 h-5" />
                    </a>
                  )}
                  {business.whatsapp_number && (
                    <a href={`https://wa.me/${business.whatsapp_number}`} target="_blank" rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-green-600/80 flex items-center justify-center hover:scale-110 transition-transform">
                      <MessageCircle className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            )}
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-wider opacity-60">Quick Links</p>
              <div className="flex flex-col gap-1">
                <a href="#products" className={`text-sm ${theme.footerText} hover:text-white transition-colors flex items-center gap-1`}>
                  <ExternalLink className="w-3 h-3" /> Products
                </a>
                <a href="#reviews" className={`text-sm ${theme.footerText} hover:text-white transition-colors flex items-center gap-1`}>
                  <ExternalLink className="w-3 h-3" /> Reviews
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Google Map */}
        {hasMap && (
          <div className="mb-8 rounded-2xl overflow-hidden border border-white/10">
            <iframe
              src={business.google_map_url}
              width="100%" height="220" style={{ border: 0 }} allowFullScreen loading="lazy"
              referrerPolicy="no-referrer-when-downgrade" title="Store Location"
            />
          </div>
        )}

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className={`text-xs ${theme.footerText}`}>© {new Date().getFullYear()} {business.business_name}. All rights reserved.</p>
          <p className={`text-[10px] ${theme.footerText} flex items-center gap-1`}>Powered by <Zap className="w-3 h-3" /> Ezo</p>
        </div>
      </div>
    </footer>
  );
};

export default StoreFooter;
