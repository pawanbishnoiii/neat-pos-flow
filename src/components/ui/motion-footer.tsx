import * as React from "react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Heart, ArrowUp, ExternalLink, MapPin, Phone, Mail, Instagram, Youtube, MessageCircle, Facebook } from "lucide-react";

interface MotionFooterProps {
  business?: any;
  theme?: any;
  className?: string;
}

const MagneticButton = React.forwardRef<HTMLElement, any>(
  ({ className, children, as: Component = "button", ...props }, forwardedRef) => {
    const localRef = useRef<HTMLElement>(null);

    useEffect(() => {
      const element = localRef.current;
      if (!element) return;

      const handleMouseMove = (e: MouseEvent) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        element.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.05)`;
      };

      const handleMouseLeave = () => {
        element.style.transform = 'translate(0, 0) scale(1)';
        element.style.transition = 'transform 0.5s cubic-bezier(0.33, 1, 0.68, 1)';
      };

      const handleMouseEnter = () => {
        element.style.transition = 'transform 0.15s ease-out';
      };

      element.addEventListener("mousemove", handleMouseMove);
      element.addEventListener("mouseleave", handleMouseLeave);
      element.addEventListener("mouseenter", handleMouseEnter);

      return () => {
        element.removeEventListener("mousemove", handleMouseMove);
        element.removeEventListener("mouseleave", handleMouseLeave);
        element.removeEventListener("mouseenter", handleMouseEnter);
      };
    }, []);

    return (
      <Component
        ref={(node: HTMLElement | null) => {
          (localRef as any).current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) (forwardedRef as any).current = node;
        }}
        className={cn("cursor-pointer transition-transform", className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
MagneticButton.displayName = "MagneticButton";

const MarqueeStrip = ({ text }: { text: string }) => (
  <div className="overflow-hidden py-4 border-t border-b border-white/5">
    <div className="flex animate-[marquee_30s_linear_infinite] whitespace-nowrap">
      {[...Array(4)].map((_, i) => (
        <span key={i} className="text-sm font-medium text-white/20 mx-8 tracking-widest uppercase">
          {text} ✦ {text} ✦ {text} ✦
        </span>
      ))}
    </div>
  </div>
);

export function MotionFooter({ business, theme, className }: MotionFooterProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const hasSocial = business?.instagram_handle || business?.youtube_handle || business?.whatsapp_number;

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer ref={wrapperRef} className={cn("relative overflow-hidden bg-slate-950 text-white", className)}>
      {/* Aurora background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-radial from-blue-500/10 via-purple-500/5 to-transparent animate-pulse" />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundSize: '60px 60px',
        backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
        maskImage: 'linear-gradient(to bottom, transparent, black 30%, black 70%, transparent)',
      }} />

      {/* Giant background text */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none">
        <span className="text-[20vw] font-black text-white/[0.02] leading-none tracking-tighter">
          {business?.business_name || 'STORE'}
        </span>
      </div>

      {/* Marquee strip */}
      <MarqueeStrip text={business?.business_name || 'Premium Store'} />

      <div className="relative max-w-7xl mx-auto px-6 py-20">
        {/* CTA Section */}
        <div className="text-center mb-20">
          <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-4">Get In Touch</p>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6">
            <span className="bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
              Let's Work Together
            </span>
          </h2>
          <p className="text-white/40 text-sm max-w-md mx-auto mb-8">
            {theme?.tagline || 'Experience premium service that exceeds expectations'}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {business?.phone && (
              <MagneticButton as="a" href={`tel:${business.phone}`}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm text-sm font-semibold hover:bg-white/[0.08] hover:border-white/20 transition-all">
                <Phone className="w-4 h-4" /> Call Now
              </MagneticButton>
            )}
            {business?.whatsapp_number && (
              <MagneticButton as="a" href={`https://wa.me/${business.whatsapp_number}`} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-semibold hover:bg-green-500/20 transition-all">
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </MagneticButton>
            )}
            {business?.contact_email && (
              <MagneticButton as="a" href={`mailto:${business.contact_email}`}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm text-sm font-semibold hover:bg-white/[0.08] transition-all">
                <Mail className="w-4 h-4" /> Email Us
              </MagneticButton>
            )}
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {business?.logo_url ? (
                <img src={business.logo_url?.startsWith('http') ? business.logo_url : ''} alt="" className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white/10" />
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-xl">{theme?.emoji || '⚡'}</div>
              )}
              <div>
                <p className="font-bold text-lg">{business?.business_name}</p>
                <p className="text-xs text-white/40">{theme?.tagline || 'Premium Service'}</p>
              </div>
            </div>
            {business?.address && (
              <p className="flex items-start gap-2 text-sm text-white/40">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" /> {business.address}
              </p>
            )}
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-white/30 font-semibold">Navigate</p>
            {['Products', 'Reviews', 'Contact'].map(link => (
              <a key={link} href={`#${link.toLowerCase()}`}
                className="group flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">
                <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" /> {link}
              </a>
            ))}
          </div>

          {/* Social */}
          {hasSocial && (
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/30 font-semibold">Follow Us</p>
              <div className="flex items-center gap-3">
                {business?.instagram_handle && (
                  <MagneticButton as="a" href={`https://instagram.com/${business.instagram_handle}`} target="_blank" rel="noopener noreferrer"
                    className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-600/20 border border-pink-500/20 flex items-center justify-center hover:scale-110 transition-transform">
                    <Instagram className="w-5 h-5 text-pink-400" />
                  </MagneticButton>
                )}
                {business?.youtube_handle && (
                  <MagneticButton as="a" href={business.youtube_handle.startsWith('http') ? business.youtube_handle : `https://youtube.com/@${business.youtube_handle}`} target="_blank" rel="noopener noreferrer"
                    className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/20 flex items-center justify-center hover:scale-110 transition-transform">
                    <Youtube className="w-5 h-5 text-red-400" />
                  </MagneticButton>
                )}
                {business?.whatsapp_number && (
                  <MagneticButton as="a" href={`https://wa.me/${business.whatsapp_number}`} target="_blank" rel="noopener noreferrer"
                    className="w-12 h-12 rounded-2xl bg-green-600/20 border border-green-500/20 flex items-center justify-center hover:scale-110 transition-transform">
                    <MessageCircle className="w-5 h-5 text-green-400" />
                  </MagneticButton>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Map */}
        {business?.google_map_url && (
          <div className="mb-12 rounded-3xl overflow-hidden border border-white/5">
            <iframe src={business.google_map_url} width="100%" height="200" style={{ border: 0 }}
              allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Location" />
          </div>
        )}

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} {business?.business_name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <p className="text-[10px] text-white/20 flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-red-400 animate-pulse" /> Ezo
            </p>
            <MagneticButton onClick={scrollToTop}
              className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
              <ArrowUp className="w-4 h-4" />
            </MagneticButton>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </footer>
  );
}

export default MotionFooter;
