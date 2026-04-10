import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Palette, Image, FileText, Star, Search as SearchIcon, Globe, Upload, Trash2, Eye, EyeOff, Save, Loader2, ExternalLink, Video, Plus, GripVertical, MessageSquare, Check, X, Tag, ShoppingBag, Layout, Navigation, Receipt, Users, MapPin, Phone, Instagram, Youtube, Facebook, LinkIcon, Type, PaintBucket, Smartphone, Monitor, ChevronDown } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import { useBusiness } from '@/hooks/useBusiness';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { getCategoryConfig } from '@/lib/categoryConfig';
import { QRCodeSVG } from 'qrcode.react';
import { useLanguage } from '@/hooks/useLanguage';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';

const STORE_THEMES = [
  { id: 'suspended', label: 'Default', emoji: '⚡', desc: 'Category-based auto theme' },
  { id: 'starter', label: 'Starter', emoji: '🌱', desc: 'Clean, minimal single-column' },
  { id: 'modern', label: 'Modern', emoji: '✨', desc: 'Gradient hero, glassmorphism cards' },
  { id: 'bold', label: 'Bold', emoji: '🔥', desc: 'Vibrant, large typography' },
  { id: 'luxury', label: 'Luxury', emoji: '👑', desc: 'Dark, gold accents, serif fonts' },
  { id: 'auto_service', label: 'Auto Service', emoji: '🚗', desc: 'Premium automotive & car wash' },
  { id: 'car_wash', label: 'Car Wash', emoji: '💧', desc: 'Immersive wash center theme' },
  { id: 'grocery', label: 'Grocery', emoji: '🛒', desc: 'Fresh grocery & general store' },
  { id: 'fashion', label: 'Fashion', emoji: '👗', desc: 'Elegant fashion & beauty' },
  { id: 'bookshop', label: 'Bookshop', emoji: '📚', desc: 'Warm bookshop & education' },
];

const StoreManager = () => {
  const { business, refetch } = useBusiness();
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const logoRef = useRef<HTMLInputElement>(null);

  const [stats, setStats] = useState({ products: 0, reviews: 0, media: 0, offers: 0 });
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [contents, setContents] = useState<Record<string, { title: string; content: string; is_visible: boolean }>>({});
  const [pendingReviews, setPendingReviews] = useState<any[]>([]);
  const [storeTheme, setStoreTheme] = useState('suspended');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDesc, setSeoDesc] = useState('');
  const [allOffers, setAllOffers] = useState<any[]>([]);

  // Footer editor state
  const [footerFullName, setFooterFullName] = useState('');
  const [footerAddress, setFooterAddress] = useState('');
  const [footerPincode, setFooterPincode] = useState('');
  const [footerWhatsapp, setFooterWhatsapp] = useState('');
  const [footerGoogleMap, setFooterGoogleMap] = useState('');
  const [footerInstagram, setFooterInstagram] = useState('');
  const [footerYoutube, setFooterYoutube] = useState('');
  const [footerFacebook, setFooterFacebook] = useState('');
  const [footerCtaText, setFooterCtaText] = useState('');
  const [footerCtaUrl, setFooterCtaUrl] = useState('');
  const [footerBgColor, setFooterBgColor] = useState('#1a1a2e');
  const [savingFooter, setSavingFooter] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);

  // Hero section editor state
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [heroCtaText, setHeroCtaText] = useState('');
  const [heroBgType, setHeroBgType] = useState('gradient');
  const [savingHero, setSavingHero] = useState(false);

  // Billing settings state
  const [invoiceLogo, setInvoiceLogo] = useState(true);
  const [invoiceShopName, setInvoiceShopName] = useState('');
  const [invoiceFooter, setInvoiceFooter] = useState('Thank You! Visit Again');
  const [invoiceStyle, setInvoiceStyle] = useState('classic');
  const [savingBilling, setSavingBilling] = useState(false);

  const config = business ? getCategoryConfig(business.category) : null;
  const storeUrl = business?.store_slug ? `${window.location.origin}/store/${business.store_slug}` : '';

  useEffect(() => {
    if (!business) return;
    setStoreTheme((business as any).store_theme || 'suspended');
    const fetchData = async () => {
      const [prods, revs, media, content, offersRes] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }).eq('business_id', business.id),
        supabase.from('product_reviews').select('*').eq('business_id', business.id).eq('is_approved', false).order('created_at', { ascending: false }),
        supabase.from('store_media').select('*').eq('business_id', business.id).order('sort_order'),
        supabase.from('store_content').select('*').eq('business_id', business.id),
        supabase.from('business_offers').select('*').eq('business_id', business.id).order('created_at', { ascending: false }),
      ]);
      setStats({ products: prods.count || 0, reviews: (revs.data || []).length, media: (media.data || []).length, offers: (offersRes.data || []).length });
      setPendingReviews(revs.data || []);
      setMediaItems(media.data || []);
      setAllOffers(offersRes.data || []);
      const contentMap: Record<string, any> = {};
      (content.data || []).forEach((c: any) => { contentMap[c.section_key] = { title: c.title, content: c.content, is_visible: c.is_visible }; });
      if (!contentMap.about) contentMap.about = { title: 'About Us', content: '', is_visible: true };
      if (!contentMap.services) contentMap.services = { title: 'Our Services', content: '', is_visible: true };
      setContents(contentMap);

      // Load footer content
      const footer = contentMap.footer;
      if (footer?.content) {
        try {
          const fd = JSON.parse(footer.content);
          setFooterFullName(fd.fullName || '');
          setFooterAddress(fd.address || '');
          setFooterPincode(fd.pincode || '');
          setFooterWhatsapp(fd.whatsapp || '');
          setFooterGoogleMap(fd.googleMap || '');
          setFooterInstagram(fd.instagram || '');
          setFooterYoutube(fd.youtube || '');
          setFooterFacebook(fd.facebook || '');
          setFooterCtaText(fd.ctaText || '');
          setFooterCtaUrl(fd.ctaUrl || '');
          setFooterBgColor(fd.bgColor || '#1a1a2e');
        } catch { /* not json yet */ }
      }

      // Load hero content
      const hero = contentMap.hero;
      if (hero?.content) {
        try {
          const hd = JSON.parse(hero.content);
          setHeroTitle(hd.title || '');
          setHeroSubtitle(hd.subtitle || '');
          setHeroCtaText(hd.ctaText || '');
          setHeroBgType(hd.bgType || 'gradient');
        } catch { /* not json yet */ }
      }

      // Load billing/printer settings
      const { data: ps } = await supabase.from('printer_settings').select('*').eq('business_id', business.id).maybeSingle();
      if (ps) {
        setInvoiceLogo(ps.show_logo ?? true);
        setInvoiceFooter(ps.footer_text || 'Thank You! Visit Again');
        setInvoiceStyle(ps.paper_size || 'classic');
      }
      setInvoiceShopName(business.business_name || '');
    };
    fetchData();

    // Load footer fields from business table
    setFooterWhatsapp((business as any).whatsapp_number || '');
    setFooterInstagram((business as any).instagram_handle || '');
    setFooterYoutube((business as any).youtube_handle || '');
    setFooterGoogleMap((business as any).google_map_url || '');
    setFooterPincode((business as any).pincode || '');
    setFooterAddress(business.address || '');
    setFooterFullName(business.business_name || '');
  }, [business?.id]);

  const handleUploadMedia = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !business || !user) return;
    if (file.size > 10 * 1024 * 1024) { toast({ title: 'File too large (max 10MB)', variant: 'destructive' }); return; }
    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `${user.id}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('store-media').upload(path, file, { cacheControl: '3600' });
    if (error) { toast({ title: 'Upload failed', description: error.message, variant: 'destructive' }); setUploading(false); return; }
    const url = supabase.storage.from('store-media').getPublicUrl(path).data.publicUrl;
    const mediaType = file.type.startsWith('video') ? 'video' : 'banner';
    await supabase.from('store_media').insert({ business_id: business.id, media_type: mediaType, url, title: file.name, sort_order: mediaItems.length });
    toast({ title: 'Uploaded!' });
    const { data } = await supabase.from('store_media').select('*').eq('business_id', business.id).order('sort_order');
    setMediaItems(data || []);
    setStats(s => ({ ...s, media: (data || []).length }));
    setUploading(false);
  };

  const handleDeleteMedia = async (id: string) => {
    await supabase.from('store_media').delete().eq('id', id);
    setMediaItems(prev => prev.filter(m => m.id !== id));
    toast({ title: 'Removed' });
  };

  const handleToggleMedia = async (id: string, active: boolean) => {
    await supabase.from('store_media').update({ is_active: !active }).eq('id', id);
    setMediaItems(prev => prev.map(m => m.id === id ? { ...m, is_active: !active } : m));
  };

  const handleSaveTheme = async () => {
    if (!business) return;
    setSaving(true);
    await supabase.from('businesses').update({ store_theme: storeTheme }).eq('id', business.id);
    toast({ title: 'Theme saved!' });
    refetch();
    setSaving(false);
  };

  const handleSaveContent = async (key: string) => {
    if (!business) return;
    setSaving(true);
    const c = contents[key];
    const { error } = await supabase.from('store_content').upsert({
      business_id: business.id, section_key: key, title: c.title, content: c.content, is_visible: c.is_visible,
    }, { onConflict: 'business_id,section_key' });
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else toast({ title: 'Content saved!' });
    setSaving(false);
  };

  const handleApproveReview = async (id: string) => {
    await supabase.from('product_reviews').update({ is_approved: true }).eq('id', id);
    setPendingReviews(prev => prev.filter(r => r.id !== id));
    toast({ title: 'Approved!' });
  };

  const handleDeleteReview = async (id: string) => {
    await supabase.from('product_reviews').delete().eq('id', id);
    setPendingReviews(prev => prev.filter(r => r.id !== id));
    toast({ title: 'Deleted' });
  };

  const handleUploadLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !business || !user) return;
    setLogoUploading(true);
    const ext = file.name.split('.').pop();
    const path = `${user.id}/logo-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('store-media').upload(path, file, { cacheControl: '3600' });
    if (error) { toast({ title: 'Upload failed', variant: 'destructive' }); setLogoUploading(false); return; }
    const url = supabase.storage.from('store-media').getPublicUrl(path).data.publicUrl;
    await supabase.from('businesses').update({ logo_url: url } as any).eq('id', business.id);
    toast({ title: 'Logo uploaded!' });
    refetch();
    setLogoUploading(false);
  };

  const handleSaveFooter = async () => {
    if (!business) return;
    setSavingFooter(true);
    // Save to business table
    await supabase.from('businesses').update({
      address: footerAddress.trim() || null,
      whatsapp_number: footerWhatsapp.trim() || null,
      instagram_handle: footerInstagram.trim() || null,
      youtube_handle: footerYoutube.trim() || null,
      google_map_url: footerGoogleMap.trim() || null,
      pincode: footerPincode.trim() || null,
    } as any).eq('id', business.id);
    // Save footer JSON to store_content
    const footerData = JSON.stringify({
      fullName: footerFullName, address: footerAddress, pincode: footerPincode,
      whatsapp: footerWhatsapp, googleMap: footerGoogleMap, instagram: footerInstagram,
      youtube: footerYoutube, facebook: footerFacebook, ctaText: footerCtaText,
      ctaUrl: footerCtaUrl, bgColor: footerBgColor,
    });
    await supabase.from('store_content').upsert({
      business_id: business.id, section_key: 'footer', title: 'Footer', content: footerData, is_visible: true,
    }, { onConflict: 'business_id,section_key' });
    toast({ title: 'Footer saved!' });
    refetch();
    setSavingFooter(false);
  };

  const handleSaveHero = async () => {
    if (!business) return;
    setSavingHero(true);
    const heroData = JSON.stringify({ title: heroTitle, subtitle: heroSubtitle, ctaText: heroCtaText, bgType: heroBgType });
    await supabase.from('store_content').upsert({
      business_id: business.id, section_key: 'hero', title: 'Hero Section', content: heroData, is_visible: true,
    }, { onConflict: 'business_id,section_key' });
    toast({ title: 'Hero section saved!' });
    setSavingHero(false);
  };

  const handleSaveBilling = async () => {
    if (!business) return;
    setSavingBilling(true);
    // Update business name if changed
    if (invoiceShopName !== business.business_name) {
      await supabase.from('businesses').update({ business_name: invoiceShopName }).eq('id', business.id);
    }
    // Upsert printer settings
    await supabase.from('printer_settings').upsert({
      business_id: business.id, show_logo: invoiceLogo, footer_text: invoiceFooter, paper_size: invoiceStyle,
    }, { onConflict: 'business_id' });
    toast({ title: 'Billing settings saved!' });
    refetch();
    setSavingBilling(false);
  };

  const inputClass = "w-full px-3 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all";
  const labelClass = "text-xs font-medium text-muted-foreground mb-1.5 block";

  return (
    <div className="px-4 pt-4 lg:pl-24 max-w-5xl mx-auto space-y-5 pb-24">
      <PageHeader title="Store Manager" backTo="/settings" actions={
        storeUrl ? (
          <button onClick={() => window.open(storeUrl, '_blank')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary text-secondary-foreground text-xs font-semibold hover:bg-muted transition-colors">
            <ExternalLink className="w-3.5 h-3.5" /> Preview
          </button>
        ) : null
      } />

      {config && (
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
            <config.icon className="w-3.5 h-3.5" /> {config.name}
          </span>
          {storeUrl && <span className="text-xs text-muted-foreground truncate">{storeUrl}</span>}
        </div>
      )}

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full flex overflow-x-auto no-scrollbar gap-1 bg-transparent p-0 h-auto">
          {[
            { id: 'overview', label: 'Overview', icon: Globe },
            { id: 'appearance', label: 'Theme', icon: Palette },
            { id: 'hero', label: 'Hero', icon: Layout },
            { id: 'media', label: 'Banners', icon: Image },
            { id: 'footer', label: 'Footer', icon: MapPin },
            { id: 'content', label: 'Pages', icon: FileText },
            { id: 'offers', label: 'Offers', icon: Tag },
            { id: 'billing', label: 'Billing', icon: Receipt },
            { id: 'reviews', label: 'Reviews', icon: MessageSquare },
            { id: 'seo', label: 'SEO & QR', icon: SearchIcon },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground bg-secondary text-secondary-foreground">
                <Icon className="w-3.5 h-3.5" /> {tab.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* OVERVIEW */}
        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Products', value: stats.products, color: 'text-primary', icon: ShoppingBag },
              { label: 'Pending Reviews', value: stats.reviews, color: 'text-amber-500', icon: MessageSquare },
              { label: 'Media Files', value: stats.media, color: 'text-blue-500', icon: Image },
              { label: 'Offers', value: stats.offers, color: 'text-emerald-500', icon: Tag },
            ].map(s => {
              const Icon = s.icon;
              return (
                <motion.div key={s.label} whileHover={{ scale: 1.02 }} className="rounded-2xl glass-card shadow-soft p-4 text-center space-y-1">
                  <Icon className={`w-5 h-5 mx-auto ${s.color} opacity-60`} />
                  <p className={`text-2xl font-bold font-display ${s.color}`}>{s.value}</p>
                  <p className="text-[10px] text-muted-foreground">{s.label}</p>
                </motion.div>
              );
            })}
          </div>
          {!business?.store_slug && (
            <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4">
              <p className="text-sm font-semibold text-amber-500">⚠️ Store link not set</p>
              <p className="text-xs text-muted-foreground mt-1">Go to Settings → Business Profile to set your store slug.</p>
            </div>
          )}
          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <motion.button whileTap={{ scale: 0.97 }} onClick={() => window.location.href = '/workspace'}
              className="p-4 rounded-2xl glass-card shadow-soft flex items-center gap-3 hover:bg-muted/50 transition-colors">
              <Plus className="w-5 h-5 text-primary" />
              <div className="text-left"><p className="text-sm font-semibold text-foreground">Add Product</p><p className="text-[10px] text-muted-foreground">Workspace</p></div>
            </motion.button>
            <motion.button whileTap={{ scale: 0.97 }} onClick={() => window.location.href = '/offers'}
              className="p-4 rounded-2xl glass-card shadow-soft flex items-center gap-3 hover:bg-muted/50 transition-colors">
              <Tag className="w-5 h-5 text-emerald-500" />
              <div className="text-left"><p className="text-sm font-semibold text-foreground">Create Offer</p><p className="text-[10px] text-muted-foreground">Discounts</p></div>
            </motion.button>
          </div>
        </TabsContent>

        {/* THEME */}
        <TabsContent value="appearance" className="space-y-4 mt-4">
          <div className="rounded-2xl glass-card shadow-soft p-4">
            <p className="text-sm font-semibold text-foreground mb-1">Choose Store Theme</p>
            <p className="text-xs text-muted-foreground">Category: <strong>{config?.name}</strong></p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {STORE_THEMES.map(t => (
              <motion.button key={t.id} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={() => setStoreTheme(t.id)}
                className={`p-4 rounded-xl border-2 text-left flex items-center gap-3 transition-all ${storeTheme === t.id ? 'border-primary bg-primary/5 shadow-md' : 'border-border bg-card hover:bg-muted'}`}>
                <span className="text-3xl">{t.emoji}</span>
                <div className="flex-1"><p className="text-sm font-semibold text-foreground">{t.label}</p><p className="text-xs text-muted-foreground">{t.desc}</p></div>
                {storeTheme === t.id && <Check className="w-5 h-5 text-primary" />}
              </motion.button>
            ))}
          </div>
          <motion.button whileTap={{ scale: 0.97 }} onClick={handleSaveTheme} disabled={saving}
            className="w-full py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Theme
          </motion.button>
        </TabsContent>

        {/* HERO SECTION EDITOR */}
        <TabsContent value="hero" className="space-y-4 mt-4">
          <div className="rounded-2xl glass-card shadow-soft p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Layout className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-bold text-foreground">Hero Section Editor</h3>
            </div>
            <div>
              <label className={labelClass}>Title</label>
              <input type="text" value={heroTitle} onChange={e => setHeroTitle(e.target.value)} placeholder="Welcome to our store" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Subtitle</label>
              <input type="text" value={heroSubtitle} onChange={e => setHeroSubtitle(e.target.value)} placeholder="Best quality products at great prices" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>CTA Button Text</label>
              <input type="text" value={heroCtaText} onChange={e => setHeroCtaText(e.target.value)} placeholder="Shop Now" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Background Style</label>
              <div className="grid grid-cols-3 gap-2">
                {['gradient', 'image', 'video'].map(bg => (
                  <button key={bg} onClick={() => setHeroBgType(bg)}
                    className={`py-2 rounded-xl text-xs font-semibold capitalize transition-all ${heroBgType === bg ? 'gradient-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                    {bg}
                  </button>
                ))}
              </div>
            </div>
            <motion.button whileTap={{ scale: 0.97 }} onClick={handleSaveHero} disabled={savingHero}
              className="w-full py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
              {savingHero ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Hero
            </motion.button>
          </div>
        </TabsContent>

        {/* BANNERS / MEDIA */}
        <TabsContent value="media" className="space-y-4 mt-4">
          <div className="rounded-2xl glass-card shadow-soft p-6 text-center space-y-3">
            <Upload className="w-10 h-10 mx-auto text-muted-foreground/30" />
            <p className="text-sm font-semibold text-foreground">Upload Banners & Videos</p>
            <p className="text-xs text-muted-foreground">Max 10MB. JPG, PNG, MP4, WebM.</p>
            <input ref={fileRef} type="file" accept="image/*,video/*" onChange={handleUploadMedia} className="hidden" />
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => fileRef.current?.click()} disabled={uploading}
              className="px-6 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold inline-flex items-center gap-2 disabled:opacity-50">
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Upload
            </motion.button>
          </div>
          {mediaItems.length === 0 ? (
            <div className="text-center py-8 rounded-2xl glass-card"><Image className="w-8 h-8 mx-auto text-muted-foreground/30 mb-2" /><p className="text-sm text-muted-foreground">No media uploaded yet</p></div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {mediaItems.map(m => (
                <motion.div key={m.id} whileHover={{ scale: 1.02 }} className={`rounded-2xl overflow-hidden glass-card shadow-soft ${!m.is_active ? 'opacity-50' : ''}`}>
                  {m.media_type === 'video' ? <video src={m.url} className="w-full aspect-video object-cover" muted /> : <img src={m.url} alt={m.title} className="w-full aspect-video object-cover" />}
                  <div className="p-2 flex items-center gap-1.5">
                    <span className="text-[10px] text-muted-foreground flex-1 truncate">{m.title || m.media_type}</span>
                    <button onClick={() => handleToggleMedia(m.id, m.is_active)} className="p-1 rounded hover:bg-muted">
                      {m.is_active ? <Eye className="w-3.5 h-3.5 text-emerald-500" /> : <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />}
                    </button>
                    <button onClick={() => handleDeleteMedia(m.id)} className="p-1 rounded hover:bg-destructive/10"><Trash2 className="w-3.5 h-3.5 text-destructive" /></button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* FOOTER EDITOR */}
        <TabsContent value="footer" className="space-y-4 mt-4">
          <div className="rounded-2xl glass-card shadow-soft p-5 space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-bold text-foreground">Footer Editor</h3>
            </div>

            {/* Logo Upload */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center overflow-hidden border border-border">
                {(business as any)?.logo_url ? (
                  <img src={(business as any).logo_url} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <Upload className="w-6 h-6 text-muted-foreground/30" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Store Logo</p>
                <input ref={logoRef} type="file" accept="image/*" onChange={handleUploadLogo} className="hidden" />
                <button onClick={() => logoRef.current?.click()} disabled={logoUploading}
                  className="mt-1 text-xs text-primary font-semibold hover:underline flex items-center gap-1">
                  {logoUploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />} Upload Logo
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Full Name / Store Name</label>
                <input type="text" value={footerFullName} onChange={e => setFooterFullName(e.target.value)} placeholder="Store name" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>WhatsApp Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <input type="tel" value={footerWhatsapp} onChange={e => setFooterWhatsapp(e.target.value)} placeholder="+91..." className={`${inputClass} pl-9`} />
                </div>
              </div>
            </div>

            <div>
              <label className={labelClass}>Address</label>
              <textarea value={footerAddress} onChange={e => setFooterAddress(e.target.value)} rows={2} placeholder="Full address..." className={`${inputClass} resize-none`} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Pincode</label>
                <input type="text" value={footerPincode} onChange={e => setFooterPincode(e.target.value)} placeholder="110001" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Google Maps URL</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <input type="url" value={footerGoogleMap} onChange={e => setFooterGoogleMap(e.target.value)} placeholder="https://maps.google.com/..." className={`${inputClass} pl-9`} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Social Media</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="relative">
                  <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-pink-500" />
                  <input type="text" value={footerInstagram} onChange={e => setFooterInstagram(e.target.value)} placeholder="Instagram handle" className={`${inputClass} pl-9`} />
                </div>
                <div className="relative">
                  <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-red-500" />
                  <input type="text" value={footerYoutube} onChange={e => setFooterYoutube(e.target.value)} placeholder="YouTube handle" className={`${inputClass} pl-9`} />
                </div>
                <div className="relative">
                  <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-blue-500" />
                  <input type="text" value={footerFacebook} onChange={e => setFooterFacebook(e.target.value)} placeholder="Facebook page" className={`${inputClass} pl-9`} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>CTA Button Text</label>
                <input type="text" value={footerCtaText} onChange={e => setFooterCtaText(e.target.value)} placeholder="Contact Us" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>CTA Button URL</label>
                <input type="url" value={footerCtaUrl} onChange={e => setFooterCtaUrl(e.target.value)} placeholder="https://..." className={inputClass} />
              </div>
            </div>

            <div>
              <label className={labelClass}>Footer Background Color</label>
              <div className="flex items-center gap-3">
                <input type="color" value={footerBgColor} onChange={e => setFooterBgColor(e.target.value)} className="w-10 h-10 rounded-xl border border-border cursor-pointer" />
                <input type="text" value={footerBgColor} onChange={e => setFooterBgColor(e.target.value)} className={`${inputClass} flex-1`} />
              </div>
            </div>

            {/* Footer Preview */}
            <div className="rounded-xl overflow-hidden" style={{ backgroundColor: footerBgColor }}>
              <div className="p-4 text-white/90 text-center space-y-2">
                {(business as any)?.logo_url && <img src={(business as any).logo_url} alt="" className="w-10 h-10 rounded-lg mx-auto object-cover" />}
                <p className="text-sm font-bold">{footerFullName || 'Store Name'}</p>
                {footerAddress && <p className="text-[10px] opacity-70">{footerAddress} {footerPincode && `- ${footerPincode}`}</p>}
                <div className="flex items-center justify-center gap-3">
                  {footerWhatsapp && <Phone className="w-4 h-4 opacity-60" />}
                  {footerInstagram && <Instagram className="w-4 h-4 opacity-60" />}
                  {footerYoutube && <Youtube className="w-4 h-4 opacity-60" />}
                  {footerFacebook && <Facebook className="w-4 h-4 opacity-60" />}
                </div>
                {footerCtaText && <button className="px-4 py-1.5 rounded-full bg-white/20 text-xs font-semibold">{footerCtaText}</button>}
              </div>
            </div>

            <motion.button whileTap={{ scale: 0.97 }} onClick={handleSaveFooter} disabled={savingFooter}
              className="w-full py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
              {savingFooter ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Footer
            </motion.button>
          </div>
        </TabsContent>

        {/* PAGES/CONTENT */}
        <TabsContent value="content" className="space-y-4 mt-4">
          {Object.entries(contents).filter(([key]) => !['footer', 'hero'].includes(key)).map(([key, c]) => (
            <div key={key} className="rounded-2xl glass-card shadow-soft p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground capitalize">{key.replace('_', ' ')} Section</h3>
                <button onClick={() => setContents(prev => ({ ...prev, [key]: { ...prev[key], is_visible: !prev[key].is_visible } }))}
                  className={`text-xs px-2 py-1 rounded-full ${c.is_visible ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground'}`}>
                  {c.is_visible ? 'Visible' : 'Hidden'}
                </button>
              </div>
              <input type="text" value={c.title} onChange={e => setContents(prev => ({ ...prev, [key]: { ...prev[key], title: e.target.value } }))}
                placeholder="Section Title" className={inputClass} />
              <textarea value={c.content} onChange={e => setContents(prev => ({ ...prev, [key]: { ...prev[key], content: e.target.value } }))}
                placeholder="Content..." rows={4} className={`${inputClass} resize-none`} />
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => handleSaveContent(key)} disabled={saving}
                className="px-4 py-2 rounded-xl gradient-primary text-primary-foreground text-xs font-semibold inline-flex items-center gap-1.5 disabled:opacity-50">
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Save
              </motion.button>
            </div>
          ))}
        </TabsContent>

        {/* OFFERS */}
        <TabsContent value="offers" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">{allOffers.length} Offers</p>
            <button onClick={() => window.location.href = '/offers'} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl gradient-primary text-primary-foreground text-xs font-semibold">
              <Plus className="w-3.5 h-3.5" /> Manage Offers
            </button>
          </div>
          {allOffers.length === 0 ? (
            <div className="text-center py-8 rounded-2xl glass-card"><Tag className="w-8 h-8 mx-auto text-muted-foreground/30 mb-2" /><p className="text-sm text-muted-foreground">No offers yet.</p></div>
          ) : allOffers.map(o => (
            <motion.div key={o.id} whileHover={{ scale: 1.01 }} className="rounded-xl border border-border p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">{o.discount_percent}%</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{o.title}</p>
                <p className="text-xs text-muted-foreground">{o.coupon_code || 'No code'} • {o.is_active ? '🟢 Active' : '🔴 Inactive'}</p>
              </div>
            </motion.div>
          ))}
        </TabsContent>

        {/* BILLING SETTINGS */}
        <TabsContent value="billing" className="space-y-4 mt-4">
          <div className="rounded-2xl glass-card shadow-soft p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-bold text-foreground">Invoice Customization</h3>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
              <div>
                <p className="text-sm font-semibold text-foreground">Show Logo on Invoice</p>
                <p className="text-[10px] text-muted-foreground">Display your store logo on printed bills</p>
              </div>
              <Switch checked={invoiceLogo} onCheckedChange={setInvoiceLogo} />
            </div>

            <div>
              <label className={labelClass}>Shop Name on Invoice</label>
              <input type="text" value={invoiceShopName} onChange={e => setInvoiceShopName(e.target.value)} placeholder="Your Shop Name" className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Invoice Footer Text</label>
              <input type="text" value={invoiceFooter} onChange={e => setInvoiceFooter(e.target.value)} placeholder="Thank You! Visit Again" className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Invoice Style</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'classic', label: 'Classic', desc: '58mm thermal' },
                  { id: '80mm', label: 'Wide', desc: '80mm thermal' },
                  { id: 'a4', label: 'A4', desc: 'Full page' },
                ].map(style => (
                  <button key={style.id} onClick={() => setInvoiceStyle(style.id)}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${invoiceStyle === style.id ? 'border-primary bg-primary/5' : 'border-border bg-card hover:bg-muted'}`}>
                    <p className="text-xs font-semibold text-foreground">{style.label}</p>
                    <p className="text-[10px] text-muted-foreground">{style.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Invoice Preview Mini */}
            <div className="rounded-xl bg-white text-black p-4 text-center space-y-1 border border-border">
              {invoiceLogo && (business as any)?.logo_url && <img src={(business as any).logo_url} alt="" className="w-8 h-8 mx-auto rounded" />}
              <p className="text-sm font-bold">{invoiceShopName || 'Shop Name'}</p>
              <p className="text-[10px] text-gray-400">--- Invoice Preview ---</p>
              <p className="text-[10px] text-gray-500">{invoiceFooter}</p>
            </div>

            <motion.button whileTap={{ scale: 0.97 }} onClick={handleSaveBilling} disabled={savingBilling}
              className="w-full py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
              {savingBilling ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Billing Settings
            </motion.button>
          </div>
        </TabsContent>

        {/* REVIEWS */}
        <TabsContent value="reviews" className="space-y-3 mt-4">
          <p className="text-xs text-muted-foreground">{pendingReviews.length} pending reviews</p>
          {pendingReviews.length === 0 ? (
            <div className="text-center py-8 rounded-2xl glass-card"><MessageSquare className="w-8 h-8 mx-auto text-muted-foreground/30 mb-2" /><p className="text-sm text-muted-foreground">No pending reviews</p></div>
          ) : pendingReviews.map(r => (
            <div key={r.id} className="rounded-xl border border-border p-3 space-y-2">
              <div className="flex items-center gap-1">{[...Array(5)].map((_, j) => <Star key={j} className={`w-3 h-3 ${j < r.rating ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground/20'}`} />)}</div>
              {r.review_text && <p className="text-sm text-foreground italic">"{r.review_text}"</p>}
              <p className="text-xs text-muted-foreground">{r.reviewer_name} • {new Date(r.created_at).toLocaleDateString()}</p>
              <div className="flex gap-2">
                <button onClick={() => handleApproveReview(r.id)} className="flex-1 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 text-xs font-semibold flex items-center justify-center gap-1"><Check className="w-3 h-3" /> Approve</button>
                <button onClick={() => handleDeleteReview(r.id)} className="flex-1 py-1.5 rounded-lg bg-destructive/10 text-destructive text-xs font-semibold flex items-center justify-center gap-1"><X className="w-3 h-3" /> Delete</button>
              </div>
            </div>
          ))}
        </TabsContent>

        {/* SEO & QR */}
        <TabsContent value="seo" className="space-y-4 mt-4">
          {storeUrl && (
            <div className="rounded-2xl glass-card shadow-soft p-6 text-center space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Store QR Code</h3>
              <div className="inline-block p-4 bg-white rounded-2xl shadow-lg"><QRCodeSVG value={storeUrl} size={180} level="H" /></div>
              <p className="text-xs text-primary font-medium">{storeUrl}</p>
            </div>
          )}
          <div className="rounded-2xl glass-card shadow-soft p-4 space-y-3">
            <h3 className="text-sm font-semibold text-foreground">SEO Settings</h3>
            <input type="text" value={seoTitle || business?.business_name || ''} onChange={e => setSeoTitle(e.target.value)}
              placeholder="Page Title" className={inputClass} />
            <textarea value={seoDesc} onChange={e => setSeoDesc(e.target.value)} rows={3} placeholder="Meta description..."
              className={`${inputClass} resize-none`} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StoreManager;
