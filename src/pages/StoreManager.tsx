import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Palette, Image, FileText, Star, Search as SearchIcon, Globe, Upload, Trash2, Eye, EyeOff, Save, Loader2, ExternalLink, Video, Plus, GripVertical, MessageSquare, Check, X, Tag, ShoppingBag } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import { useBusiness } from '@/hooks/useBusiness';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { getCategoryConfig } from '@/lib/categoryConfig';
import { QRCodeSVG } from 'qrcode.react';
import { useLanguage } from '@/hooks/useLanguage';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const STORE_THEMES = [
  { id: 'suspended', label: 'Default', emoji: '⚡', desc: 'Category-based auto theme' },
  { id: 'starter', label: 'Starter', emoji: '🌱', desc: 'Clean, minimal single-column' },
  { id: 'modern', label: 'Modern', emoji: '✨', desc: 'Gradient hero, glassmorphism cards' },
  { id: 'bold', label: 'Bold', emoji: '🔥', desc: 'Vibrant, large typography' },
  { id: 'luxury', label: 'Luxury', emoji: '👑', desc: 'Dark, gold accents, serif fonts' },
  { id: 'auto_service', label: 'Auto Service', emoji: '🚗', desc: 'Premium automotive & car wash' },
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

  const [stats, setStats] = useState({ products: 0, reviews: 0, media: 0, offers: 0 });
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [contents, setContents] = useState<Record<string, { title: string; content: string; is_visible: boolean }>>({});
  const [pendingReviews, setPendingReviews] = useState<any[]>([]);
  const [storeTheme, setStoreTheme] = useState('suspended');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDesc, setSeoDesc] = useState('');
  const [allOffers, setAllOffers] = useState<any[]>([]);

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
    };
    fetchData();
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

  return (
    <div className="px-4 pt-4 lg:pl-24 max-w-5xl mx-auto space-y-5 pb-24">
      <PageHeader title="Store Manager" backTo="/settings" actions={
        storeUrl ? (
          <button onClick={() => window.open(storeUrl, '_blank')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary text-secondary-foreground text-xs font-semibold">
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
            { id: 'media', label: 'Media', icon: Image },
            { id: 'content', label: 'Pages', icon: FileText },
            { id: 'offers', label: 'Offers', icon: Tag },
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

        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Products', value: stats.products, color: 'text-primary' },
              { label: 'Pending Reviews', value: stats.reviews, color: 'text-warning' },
              { label: 'Media Files', value: stats.media, color: 'text-accent' },
              { label: 'Offers', value: stats.offers, color: 'text-success' },
            ].map(s => (
              <div key={s.label} className="rounded-2xl glass-card shadow-soft p-4 text-center">
                <p className={`text-2xl font-bold font-display ${s.color}`}>{s.value}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
          {!business?.store_slug && (
            <div className="rounded-2xl bg-warning/10 border border-warning/20 p-4">
              <p className="text-sm font-semibold text-warning">⚠️ Store link not set</p>
              <p className="text-xs text-muted-foreground mt-1">Go to Settings → Business Profile to set your store slug.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4 mt-4">
          <div className="rounded-2xl glass-card shadow-soft p-4">
            <p className="text-sm font-semibold text-foreground mb-1">Choose Store Theme</p>
            <p className="text-xs text-muted-foreground">Category: <strong>{config?.name}</strong></p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {STORE_THEMES.map(t => (
              <button key={t.id} onClick={() => setStoreTheme(t.id)}
                className={`p-4 rounded-xl border-2 text-left flex items-center gap-3 transition-colors ${storeTheme === t.id ? 'border-primary bg-primary/5' : 'border-border bg-card hover:bg-muted'}`}>
                <span className="text-3xl">{t.emoji}</span>
                <div className="flex-1"><p className="text-sm font-semibold text-foreground">{t.label}</p><p className="text-xs text-muted-foreground">{t.desc}</p></div>
                {storeTheme === t.id && <Check className="w-5 h-5 text-primary" />}
              </button>
            ))}
          </div>
          <motion.button whileTap={{ scale: 0.97 }} onClick={handleSaveTheme} disabled={saving}
            className="w-full py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Theme
          </motion.button>
        </TabsContent>

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
                <div key={m.id} className={`rounded-2xl overflow-hidden glass-card shadow-soft ${!m.is_active ? 'opacity-50' : ''}`}>
                  {m.media_type === 'video' ? <video src={m.url} className="w-full aspect-video object-cover" muted /> : <img src={m.url} alt={m.title} className="w-full aspect-video object-cover" />}
                  <div className="p-2 flex items-center gap-1.5">
                    <span className="text-[10px] text-muted-foreground flex-1 truncate">{m.title || m.media_type}</span>
                    <button onClick={() => handleToggleMedia(m.id, m.is_active)} className="p-1 rounded hover:bg-muted">
                      {m.is_active ? <Eye className="w-3.5 h-3.5 text-success" /> : <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />}
                    </button>
                    <button onClick={() => handleDeleteMedia(m.id)} className="p-1 rounded hover:bg-destructive/10"><Trash2 className="w-3.5 h-3.5 text-destructive" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="content" className="space-y-4 mt-4">
          {Object.entries(contents).map(([key, c]) => (
            <div key={key} className="rounded-2xl glass-card shadow-soft p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground capitalize">{key.replace('_', ' ')} Section</h3>
                <button onClick={() => setContents(prev => ({ ...prev, [key]: { ...prev[key], is_visible: !prev[key].is_visible } }))}
                  className={`text-xs px-2 py-1 rounded-full ${c.is_visible ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                  {c.is_visible ? 'Visible' : 'Hidden'}
                </button>
              </div>
              <input type="text" value={c.title} onChange={e => setContents(prev => ({ ...prev, [key]: { ...prev[key], title: e.target.value } }))}
                placeholder="Section Title" className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <textarea value={c.content} onChange={e => setContents(prev => ({ ...prev, [key]: { ...prev[key], content: e.target.value } }))}
                placeholder="Content..." rows={4} className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => handleSaveContent(key)} disabled={saving}
                className="px-4 py-2 rounded-xl gradient-primary text-primary-foreground text-xs font-semibold inline-flex items-center gap-1.5 disabled:opacity-50">
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Save
              </motion.button>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="offers" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">{allOffers.length} Offers</p>
            <button onClick={() => window.location.href = '/offers'} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl gradient-primary text-primary-foreground text-xs font-semibold">
              <Plus className="w-3.5 h-3.5" /> Manage Offers
            </button>
          </div>
          {allOffers.length === 0 ? (
            <div className="text-center py-8 rounded-2xl glass-card"><Tag className="w-8 h-8 mx-auto text-muted-foreground/30 mb-2" /><p className="text-sm text-muted-foreground">No offers yet. Create one from Offers page.</p></div>
          ) : allOffers.map(o => (
            <div key={o.id} className="rounded-xl border border-border p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">{o.discount_percent}%</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{o.title}</p>
                <p className="text-xs text-muted-foreground">{o.coupon_code || 'No code'} • {o.is_active ? '🟢 Active' : '🔴 Inactive'}</p>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="reviews" className="space-y-3 mt-4">
          <p className="text-xs text-muted-foreground">{pendingReviews.length} pending reviews</p>
          {pendingReviews.length === 0 ? (
            <div className="text-center py-8 rounded-2xl glass-card"><MessageSquare className="w-8 h-8 mx-auto text-muted-foreground/30 mb-2" /><p className="text-sm text-muted-foreground">No pending reviews</p></div>
          ) : pendingReviews.map(r => (
            <div key={r.id} className="rounded-xl border border-border p-3 space-y-2">
              <div className="flex items-center gap-1">{[...Array(5)].map((_, j) => <Star key={j} className={`w-3 h-3 ${j < r.rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground/20'}`} />)}</div>
              {r.review_text && <p className="text-sm text-foreground italic">"{r.review_text}"</p>}
              <p className="text-xs text-muted-foreground">{r.reviewer_name} • {new Date(r.created_at).toLocaleDateString()}</p>
              <div className="flex gap-2">
                <button onClick={() => handleApproveReview(r.id)} className="flex-1 py-1.5 rounded-lg bg-success/10 text-success text-xs font-semibold flex items-center justify-center gap-1"><Check className="w-3 h-3" /> Approve</button>
                <button onClick={() => handleDeleteReview(r.id)} className="flex-1 py-1.5 rounded-lg bg-destructive/10 text-destructive text-xs font-semibold flex items-center justify-center gap-1"><X className="w-3 h-3" /> Delete</button>
              </div>
            </div>
          ))}
        </TabsContent>

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
              placeholder="Page Title" className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <textarea value={seoDesc} onChange={e => setSeoDesc(e.target.value)} rows={3} placeholder="Meta description..."
              className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StoreManager;
