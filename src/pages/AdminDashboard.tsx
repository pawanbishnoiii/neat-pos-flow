import { motion } from 'framer-motion';
import { Users, Store, Package, Receipt, Shield, Plus, Loader2, Trash2, ImagePlus, Pencil, Tag, BarChart3, Settings, Globe, Database, Eye, EyeOff, Search, Mail, Bell, Server, Send, Activity, CheckCircle, XCircle, Save, Clock, CreditCard, Palette } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { BUSINESS_CATEGORIES } from '@/lib/categories';
import { CATEGORY_CONFIGS, getCategoryConfig } from '@/lib/categoryConfig';

const generateSKU = () => `GAL-${Date.now().toString(36).toUpperCase()}`;

const STORE_THEMES_INFO: Record<string, { label: string; emoji: string; desc: string }> = {
  suspended: { label: 'Default', emoji: '⚡', desc: 'Category-based auto theme' },
  starter: { label: 'Starter', emoji: '🌱', desc: 'Clean, minimal single-column' },
  modern: { label: 'Modern', emoji: '✨', desc: 'Gradient hero, glassmorphism' },
  bold: { label: 'Bold', emoji: '🔥', desc: 'Vibrant, large typography' },
  luxury: { label: 'Luxury', emoji: '👑', desc: 'Dark, gold accents, serif' },
  auto_service: { label: 'Auto Service', emoji: '🚗', desc: 'Premium automotive' },
  car_wash: { label: 'Car Wash', emoji: '💧', desc: 'Immersive wash center' },
  grocery: { label: 'Grocery', emoji: '🛒', desc: 'Fresh grocery store' },
  fashion: { label: 'Fashion', emoji: '👗', desc: 'Elegant fashion' },
  bookshop: { label: 'Bookshop', emoji: '📚', desc: 'Warm bookshop' },
};

type AdminTab = 'overview' | 'gallery' | 'users' | 'businesses' | 'features' | 'smtp' | 'notifications' | 'analytics' | 'subscriptions' | 'themes' | 'backup';

const AdminDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [stats, setStats] = useState({ users: 0, businesses: 0, products: 0, invoices: 0, customers: 0, offers: 0, reviews: 0, gallery: 0 });
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [allBusinesses, setAllBusinesses] = useState<any[]>([]);
  const [allProfiles, setAllProfiles] = useState<any[]>([]);
  const [showGalleryForm, setShowGalleryForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [galleryCategory, setGalleryCategory] = useState('All');
  const [galleryStoreCategory, setGalleryStoreCategory] = useState('All');
  const [form, setForm] = useState({ name: '', description: '', category: 'General', brand_name: '', price: '', discount_price: '', tax_percent: '18', sku: generateSKU(), store_category: 'general' });
  const [searchUsers, setSearchUsers] = useState('');
  const [searchBiz, setSearchBiz] = useState('');
  const [selectedBizCategory, setSelectedBizCategory] = useState('All');
  const [smtpConfig, setSmtpConfig] = useState({ host: '', port: '587', username: '', password: '', encryption: 'tls', from_email: '', from_name: 'Ezo POS', is_active: false });
  const [savingSmtp, setSavingSmtp] = useState(false);
  const [smtpId, setSmtpId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  // Theme management
  const [themeSettings, setThemeSettings] = useState<any[]>([]);
  const [savingThemes, setSavingThemes] = useState(false);
  // Subscription plans
  const [plans, setPlans] = useState<any[]>([]);

  const getTabFromPath = (path: string): AdminTab => {
    if (path.includes('/admin/gallery')) return 'gallery';
    if (path.includes('/admin/stores') || path.includes('/admin/businesses')) return 'businesses';
    if (path.includes('/admin/users')) return 'users';
    if (path.includes('/admin/smtp')) return 'smtp';
    if (path.includes('/admin/alerts')) return 'notifications';
    if (path.includes('/admin/features')) return 'features';
    if (path.includes('/admin/analytics')) return 'analytics';
    if (path.includes('/admin/subscriptions')) return 'subscriptions';
    if (path.includes('/admin/themes')) return 'themes';
    if (path.includes('/admin/backup')) return 'backup';
    return 'overview';
  };

  const activeTab = getTabFromPath(location.pathname);

  const handleTabClick = (tabId: AdminTab) => {
    const pathMap: Record<AdminTab, string> = {
      overview: '/admin', gallery: '/admin/gallery', businesses: '/admin/stores',
      users: '/admin/users', smtp: '/admin/smtp', notifications: '/admin/alerts',
      features: '/admin/features', analytics: '/admin/analytics', subscriptions: '/admin/subscriptions',
      themes: '/admin/themes', backup: '/admin/backup',
    };
    navigate(pathMap[tabId] || '/admin');
  };

  useEffect(() => {
    const fetchAll = async () => {
      const [users, businesses, products, invoices, customers, offers, reviews, gallery] = await Promise.all([
        supabase.from('profiles').select('id, name, phone, created_at, language, last_sign_in_at, avatar_url').order('created_at', { ascending: false }),
        supabase.from('businesses').select('id, business_name, category, owner_id, created_at, store_slug, phone, store_theme').order('created_at', { ascending: false }),
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('invoices').select('id', { count: 'exact', head: true }),
        supabase.from('customers').select('id', { count: 'exact', head: true }),
        supabase.from('business_offers').select('id', { count: 'exact', head: true }),
        supabase.from('product_reviews').select('id', { count: 'exact', head: true }),
        supabase.from('gallery_products').select('id', { count: 'exact', head: true }),
      ]);
      setStats({
        users: users.data?.length || 0, businesses: businesses.data?.length || 0,
        products: products.count || 0, invoices: invoices.count || 0,
        customers: customers.count || 0, offers: offers.count || 0,
        reviews: reviews.count || 0, gallery: gallery.count || 0,
      });
      setAllProfiles(users.data || []);
      setAllBusinesses(businesses.data || []);
    };
    fetchAll();
    fetchGallery();
    fetchSmtp();
    fetchNotifications();
    fetchThemeSettings();
    fetchPlans();
  }, []);

  const fetchGallery = async () => {
    const { data } = await supabase.from('gallery_products').select('*').order('created_at', { ascending: false });
    setGalleryItems(data || []);
  };

  const fetchSmtp = async () => {
    const { data } = await supabase.from('smtp_settings').select('*').limit(1).maybeSingle();
    if (data) {
      setSmtpConfig({ host: data.host, port: String(data.port), username: data.username, password: data.password, encryption: data.encryption, from_email: data.from_email, from_name: data.from_name, is_active: data.is_active });
      setSmtpId(data.id);
    }
  };

  const fetchNotifications = async () => {
    const { data } = await supabase.from('email_notifications').select('*').order('created_at', { ascending: false }).limit(50);
    setNotifications(data || []);
  };

  const fetchThemeSettings = async () => {
    const { data } = await supabase.from('store_theme_settings').select('*').order('sort_order');
    setThemeSettings(data || []);
  };

  const fetchPlans = async () => {
    const { data } = await supabase.from('subscription_plans').select('*').order('sort_order');
    setPlans(data || []);
  };

  const handleSaveSmtp = async () => {
    setSavingSmtp(true);
    const payload = { host: smtpConfig.host, port: parseInt(smtpConfig.port) || 587, username: smtpConfig.username, password: smtpConfig.password, encryption: smtpConfig.encryption, from_email: smtpConfig.from_email, from_name: smtpConfig.from_name, is_active: smtpConfig.is_active };
    let error;
    if (smtpId) {
      ({ error } = await supabase.from('smtp_settings').update(payload).eq('id', smtpId));
    } else {
      const res = await supabase.from('smtp_settings').insert(payload).select().single();
      error = res.error;
      if (res.data) setSmtpId(res.data.id);
    }
    if (error) toast({ title: 'Error saving SMTP', description: error.message, variant: 'destructive' });
    else toast({ title: 'SMTP settings saved!' });
    setSavingSmtp(false);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast({ title: 'Too large', description: 'Max 5MB', variant: 'destructive' }); return; }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const uploadImage = async (): Promise<string> => {
    if (!imageFile) return '';
    const ext = imageFile.name.split('.').pop();
    const path = `gallery/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('product-images').upload(path, imageFile, { cacheControl: '3600', upsert: false });
    if (error) { toast({ title: 'Upload failed', description: error.message, variant: 'destructive' }); return ''; }
    return supabase.storage.from('product-images').getPublicUrl(path).data.publicUrl;
  };

  const handleSaveGallery = async () => {
    setSaving(true);
    let imageUrl = editingItem?.image_url || '';
    if (imageFile) imageUrl = await uploadImage();
    const payload = {
      name: form.name, description: form.description, category: form.category, brand_name: form.brand_name,
      price: parseFloat(form.price) || 0, discount_price: parseFloat(form.discount_price) || parseFloat(form.price) || 0,
      tax_percent: parseFloat(form.tax_percent) || 0, sku: form.sku, image_url: imageUrl, store_category: form.store_category,
    };
    let error;
    if (editingItem) ({ error } = await supabase.from('gallery_products').update(payload).eq('id', editingItem.id));
    else ({ error } = await supabase.from('gallery_products').insert(payload));
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else { toast({ title: editingItem ? 'Updated!' : 'Added!' }); closeForm(); fetchGallery(); }
    setSaving(false);
  };

  const closeForm = () => {
    setShowGalleryForm(false); setEditingItem(null);
    setForm({ name: '', description: '', category: 'General', brand_name: '', price: '', discount_price: '', tax_percent: '18', sku: generateSKU(), store_category: 'general' });
    setImageFile(null); setImagePreview(null);
  };

  const openEdit = (item: any) => {
    setEditingItem(item);
    setForm({ name: item.name, description: item.description || '', category: item.category, brand_name: item.brand_name || '', price: String(item.price), discount_price: String(item.discount_price), tax_percent: String(item.tax_percent), sku: item.sku, store_category: item.store_category || 'general' });
    setImagePreview(item.image_url || null); setImageFile(null); setShowGalleryForm(true);
  };

  const deleteGalleryItem = async (id: string) => {
    await supabase.from('gallery_products').delete().eq('id', id);
    toast({ title: 'Removed' }); fetchGallery();
  };

  const getImageSrc = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return supabase.storage.from('product-images').getPublicUrl(url).data.publicUrl;
  };

  // Theme management handlers
  const handleToggleTheme = async (id: string, field: 'is_active' | 'is_pro_only', current: boolean) => {
    await supabase.from('store_theme_settings').update({ [field]: !current }).eq('id', id);
    setThemeSettings(prev => prev.map(t => t.id === id ? { ...t, [field]: !current } : t));
    toast({ title: 'Theme updated!' });
  };

  const galleryCats = ['All', ...new Set(galleryItems.map(g => g.category))];
  const galleryStoreCats = ['All', ...new Set(galleryItems.map(g => g.store_category || 'general'))];
  const filteredGallery = galleryItems.filter(g => {
    const matchCat = galleryCategory === 'All' || g.category === galleryCategory;
    const matchStore = galleryStoreCategory === 'All' || (g.store_category || 'general') === galleryStoreCategory;
    return matchCat && matchStore;
  });

  const uniqueGalleryCats = ['General', ...new Set(BUSINESS_CATEGORIES.flatMap(c => c.defaultCategories))];

  const storeCategoryOptions = [
    { id: 'general', name: 'General (All)' },
    ...Object.values(CATEGORY_CONFIGS).map(c => ({ id: c.id, name: c.name })),
  ];

  const filteredProfiles = allProfiles.filter(p => (p.name || '').toLowerCase().includes(searchUsers.toLowerCase()) || (p.phone || '').includes(searchUsers));
  const filteredBusinesses = allBusinesses.filter(b => {
    const matchSearch = (b.business_name || '').toLowerCase().includes(searchBiz.toLowerCase());
    const matchCat = selectedBizCategory === 'All' || b.category === selectedBizCategory;
    return matchSearch && matchCat;
  });

  const bizCategories = ['All', ...new Set(allBusinesses.map(b => b.category))];

  const statCards = [
    { title: 'Users', value: stats.users, icon: Users, color: 'text-primary' },
    { title: 'Businesses', value: stats.businesses, icon: Store, color: 'text-accent' },
    { title: 'Products', value: stats.products, icon: Package, color: 'text-success' },
    { title: 'Invoices', value: stats.invoices, icon: Receipt, color: 'text-warning' },
    { title: 'Customers', value: stats.customers, icon: Users, color: 'text-primary' },
    { title: 'Gallery', value: stats.gallery, icon: Database, color: 'text-accent' },
    { title: 'Reviews', value: stats.reviews, icon: Tag, color: 'text-success' },
    { title: 'Offers', value: stats.offers, icon: Tag, color: 'text-warning' },
  ];

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-5 pb-24">
      {/* Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {statCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div key={card.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="rounded-2xl glass-card shadow-soft p-4">
                  <div className="flex items-center gap-2 mb-2"><Icon className={`w-4 h-4 ${card.color}`} /><span className="text-xs text-muted-foreground font-medium">{card.title}</span></div>
                  <p className="text-2xl font-bold font-display text-foreground">{card.value}</p>
                </motion.div>
              );
            })}
          </div>

          <div className="rounded-2xl glass-card shadow-soft p-4 space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Businesses by Category</h3>
            {bizCategories.filter(c => c !== 'All').map(cat => {
              const count = allBusinesses.filter(b => b.category === cat).length;
              const config = getCategoryConfig(cat);
              const CatIcon = config.icon;
              return (
                <div key={cat} className="flex items-center gap-3 py-1.5">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><CatIcon className="w-4 h-4 text-primary" /></div>
                  <p className="text-sm font-medium text-foreground flex-1">{config.name}</p>
                  <span className="text-sm font-bold text-foreground">{count}</span>
                </div>
              );
            })}
          </div>

          <div className="rounded-2xl glass-card shadow-soft p-4 space-y-2">
            <h3 className="text-sm font-semibold text-foreground">Recent Businesses</h3>
            {allBusinesses.slice(0, 5).map(b => {
              const config = getCategoryConfig(b.category);
              const CatIcon = config.icon;
              return (
                <div key={b.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex items-center gap-2"><CatIcon className="w-4 h-4 text-muted-foreground" /><div><p className="text-sm font-medium text-foreground">{b.business_name}</p><p className="text-xs text-muted-foreground">{config.name}</p></div></div>
                  {b.store_slug && <button onClick={() => window.open(`/store/${b.store_slug}`, '_blank')} className="p-1.5 rounded-lg hover:bg-muted"><Eye className="w-3.5 h-3.5 text-muted-foreground" /></button>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Gallery */}
      {activeTab === 'gallery' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Product Gallery ({galleryItems.length})</p>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => { closeForm(); setShowGalleryForm(true); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl gradient-primary text-primary-foreground text-xs font-semibold">
              <Plus className="w-3.5 h-3.5" /> Add Product
            </motion.button>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-1.5">Store Type</p>
            <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
              {galleryStoreCats.map(cat => (
                <button key={cat} onClick={() => setGalleryStoreCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${galleryStoreCategory === cat ? 'gradient-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                  {cat === 'All' ? 'All Types' : getCategoryConfig(cat).name}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
            {galleryCats.map(cat => (
              <button key={cat} onClick={() => setGalleryCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${galleryCategory === cat ? 'bg-accent text-accent-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                {cat}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredGallery.length === 0 ? (
              <div className="col-span-full p-8 text-center rounded-2xl glass-card"><Package className="w-8 h-8 mx-auto text-muted-foreground/30 mb-2" /><p className="text-sm text-muted-foreground">No products in gallery.</p></div>
            ) : filteredGallery.map(item => {
              const imgSrc = getImageSrc(item.image_url || '');
              const storeConfig = getCategoryConfig(item.store_category || 'custom');
              return (
                <div key={item.id} className="rounded-2xl glass-card shadow-soft overflow-hidden">
                  <div className="aspect-[3/1] bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center">
                    {imgSrc ? <img src={imgSrc} alt={item.name} className="w-full h-full object-cover" /> : <Package className="w-8 h-8 text-muted-foreground/30" />}
                  </div>
                  <div className="p-3 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.category} {item.brand_name ? `• ${item.brand_name}` : ''} • ₹{item.discount_price || item.price}</p>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">{storeConfig.name}</span>
                    </div>
                    <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg hover:bg-muted"><Pencil className="w-4 h-4 text-muted-foreground" /></button>
                    <button onClick={() => deleteGalleryItem(item.id)} className="p-1.5 rounded-lg hover:bg-destructive/10"><Trash2 className="w-4 h-4 text-destructive" /></button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Businesses/Stores */}
      {activeTab === 'businesses' && (
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" placeholder="Search businesses..." value={searchBiz} onChange={e => setSearchBiz(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
            {bizCategories.map(cat => (
              <button key={cat} onClick={() => setSelectedBizCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${selectedBizCategory === cat ? 'gradient-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                {cat === 'All' ? 'All' : getCategoryConfig(cat).name}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">{filteredBusinesses.length} businesses</p>
          {filteredBusinesses.map(b => {
            const config = getCategoryConfig(b.category);
            const CatIcon = config.icon;
            return (
              <div key={b.id} className="rounded-2xl glass-card shadow-soft p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><CatIcon className="w-5 h-5 text-primary" /></div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{b.business_name}</p>
                      <p className="text-xs text-muted-foreground">{config.name} {b.store_slug ? `• /store/${b.store_slug}` : ''}</p>
                      {b.phone && <p className="text-[10px] text-muted-foreground">📞 {b.phone}</p>}
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent/10 text-accent font-medium">Theme: {STORE_THEMES_INFO[b.store_theme]?.label || b.store_theme || 'Default'}</span>
                    </div>
                  </div>
                  {b.store_slug && <button onClick={() => window.open(`/store/${b.store_slug}`, '_blank')} className="p-1.5 rounded-lg hover:bg-muted"><Globe className="w-4 h-4 text-muted-foreground" /></button>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Users */}
      {activeTab === 'users' && (
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" placeholder="Search users by name or phone..." value={searchUsers} onChange={e => setSearchUsers(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <p className="text-xs text-muted-foreground">{filteredProfiles.length} users found</p>
          {filteredProfiles.length === 0 ? (
            <div className="text-center py-12 rounded-2xl glass-card">
              <Users className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-sm font-semibold text-foreground">No users found</p>
              <p className="text-xs text-muted-foreground mt-1">Users will appear here after they sign up.</p>
            </div>
          ) : filteredProfiles.map(p => {
            const userBiz = allBusinesses.filter(b => b.owner_id === p.id);
            return (
              <div key={p.id} className="rounded-2xl glass-card shadow-soft p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
                  {p.avatar_url ? <img src={p.avatar_url} alt="" className="w-full h-full object-cover" /> : <Users className="w-5 h-5 text-primary" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{p.name || 'Unnamed'}</p>
                  <p className="text-xs text-muted-foreground">{p.phone || 'No phone'} • Lang: {(p as any).language || 'en'}</p>
                  {userBiz.length > 0 && <p className="text-[10px] text-primary font-medium">{userBiz.length} business(es): {userBiz.map(b => b.business_name).join(', ')}</p>}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] text-muted-foreground">Joined</p>
                  <p className="text-xs font-medium text-foreground">{p.created_at ? new Date(p.created_at).toLocaleDateString() : '--'}</p>
                  {(p as any).last_sign_in_at && <p className="text-[10px] text-muted-foreground mt-0.5">Last: {new Date((p as any).last_sign_in_at).toLocaleDateString()}</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Theme Management - Upgraded */}
      {activeTab === 'themes' && (
        <div className="space-y-4">
          <div className="rounded-2xl glass-card shadow-soft p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"><Palette className="w-6 h-6 text-primary" /></div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Store Theme Management</h3>
                <p className="text-xs text-muted-foreground">Control which themes are available and which are Pro-only</p>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-success/5 border border-success/20">
                <Eye className="w-3 h-3 text-success" />
                <span className="text-xs font-medium text-foreground">{themeSettings.filter(t => t.is_active).length} Active</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-warning/5 border border-warning/20">
                <CreditCard className="w-3 h-3 text-warning" />
                <span className="text-xs font-medium text-foreground">{themeSettings.filter(t => t.is_pro_only).length} Pro Only</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-destructive/5 border border-destructive/20">
                <EyeOff className="w-3 h-3 text-destructive" />
                <span className="text-xs font-medium text-foreground">{themeSettings.filter(t => !t.is_active).length} Hidden</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {themeSettings.map((ts, idx) => {
              const info = STORE_THEMES_INFO[ts.theme_key] || { label: ts.theme_key, emoji: '🎨', desc: '' };
              const storesUsing = allBusinesses.filter(b => b.store_theme === ts.theme_key);
              return (
                <motion.div key={ts.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}
                  className={`rounded-2xl glass-card shadow-soft overflow-hidden border-2 transition-all hover:shadow-elevated ${ts.is_active ? 'border-success/30' : 'border-destructive/30 opacity-70'}`}>
                  {/* Theme preview header */}
                  <div className="h-20 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 flex items-center justify-center relative">
                    <span className="text-4xl">{info.emoji}</span>
                    {ts.is_pro_only && (
                      <span className="absolute top-2 right-2 text-[9px] px-2 py-0.5 rounded-full bg-warning/20 text-warning font-bold border border-warning/30">PRO</span>
                    )}
                    {storesUsing.length > 0 && (
                      <span className="absolute top-2 left-2 text-[9px] px-2 py-0.5 rounded-full bg-primary/20 text-primary font-bold">{storesUsing.length} store{storesUsing.length > 1 ? 's' : ''}</span>
                    )}
                  </div>
                  <div className="p-4 space-y-3">
                    <div>
                      <p className="text-sm font-bold text-foreground">{info.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{info.desc}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleToggleTheme(ts.id, 'is_active', ts.is_active)}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${ts.is_active ? 'bg-success/10 text-success hover:bg-success/20' : 'bg-destructive/10 text-destructive hover:bg-destructive/20'}`}>
                        {ts.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        {ts.is_active ? 'Active' : 'Hidden'}
                      </button>
                      <button onClick={() => handleToggleTheme(ts.id, 'is_pro_only', ts.is_pro_only)}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${ts.is_pro_only ? 'bg-warning/10 text-warning hover:bg-warning/20' : 'bg-secondary text-secondary-foreground hover:bg-muted'}`}>
                        <CreditCard className="w-3.5 h-3.5" />
                        {ts.is_pro_only ? 'Pro Only' : 'Free'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* SMTP / Auth Settings */}
      {activeTab === 'smtp' && (
        <div className="space-y-4">
          <div className="rounded-2xl glass-card shadow-soft p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"><Shield className="w-6 h-6 text-primary" /></div>
              <div><h3 className="text-sm font-bold text-foreground">Authentication Settings</h3><p className="text-xs text-muted-foreground">Lovable Cloud manages Google & Apple sign-in automatically</p></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="rounded-xl bg-success/5 border border-success/20 p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center"><CheckCircle className="w-5 h-5 text-success" /></div>
                <div><p className="text-sm font-semibold text-foreground">Google Sign-In</p><p className="text-xs text-muted-foreground">Managed by Lovable Cloud</p></div>
              </div>
              <div className="rounded-xl bg-success/5 border border-success/20 p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center"><CheckCircle className="w-5 h-5 text-success" /></div>
                <div><p className="text-sm font-semibold text-foreground">Apple Sign-In</p><p className="text-xs text-muted-foreground">Managed by Lovable Cloud</p></div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl glass-card shadow-soft p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"><Server className="w-6 h-6 text-primary" /></div>
              <div><h3 className="text-sm font-bold text-foreground">SMTP Configuration</h3><p className="text-xs text-muted-foreground">Configure custom SMTP for billing notifications</p></div>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-medium text-muted-foreground mb-1 block">SMTP Host</label>
                  <input type="text" placeholder="smtp.gmail.com" value={smtpConfig.host} onChange={e => setSmtpConfig(f => ({ ...f, host: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
                <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Port</label>
                  <input type="text" placeholder="587" value={smtpConfig.port} onChange={e => setSmtpConfig(f => ({ ...f, port: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
              </div>
              <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Username</label>
                <input type="text" placeholder="your@email.com" value={smtpConfig.username} onChange={e => setSmtpConfig(f => ({ ...f, username: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
              <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Password</label>
                <input type="password" placeholder="••••••••" value={smtpConfig.password} onChange={e => setSmtpConfig(f => ({ ...f, password: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Encryption</label>
                  <select value={smtpConfig.encryption} onChange={e => setSmtpConfig(f => ({ ...f, encryption: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
                    <option value="tls">TLS</option><option value="ssl">SSL</option><option value="none">None</option>
                  </select></div>
                <div><label className="text-xs font-medium text-muted-foreground mb-1 block">From Name</label>
                  <input type="text" placeholder="Ezo POS" value={smtpConfig.from_name} onChange={e => setSmtpConfig(f => ({ ...f, from_name: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
              </div>
              <div><label className="text-xs font-medium text-muted-foreground mb-1 block">From Email</label>
                <input type="email" placeholder="noreply@yourdomain.com" value={smtpConfig.from_email} onChange={e => setSmtpConfig(f => ({ ...f, from_email: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-secondary">
                <div><p className="text-sm font-semibold text-foreground">Enable SMTP</p></div>
                <button onClick={() => setSmtpConfig(f => ({ ...f, is_active: !f.is_active }))}
                  className={`w-12 h-7 rounded-full relative transition-colors ${smtpConfig.is_active ? 'bg-success' : 'bg-muted'}`}>
                  <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-all ${smtpConfig.is_active ? 'right-0.5' : 'left-0.5'}`} />
                </button>
              </div>
              <motion.button whileTap={{ scale: 0.97 }} onClick={handleSaveSmtp} disabled={savingSmtp}
                className="w-full py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
                {savingSmtp ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save SMTP
              </motion.button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications / Alerts */}
      {activeTab === 'notifications' && (
        <div className="space-y-4">
          <div className="rounded-2xl glass-card shadow-soft p-4">
            <h3 className="text-sm font-bold text-foreground">Email Notifications Log</h3>
            <p className="text-xs text-muted-foreground">{notifications.length} notifications</p>
          </div>
          {notifications.length === 0 ? (
            <div className="text-center py-8 rounded-2xl glass-card"><Bell className="w-8 h-8 mx-auto text-muted-foreground/30 mb-2" /><p className="text-sm text-muted-foreground">No notifications yet.</p></div>
          ) : notifications.map(n => (
            <div key={n.id} className="rounded-2xl glass-card shadow-soft p-4 flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${n.status === 'sent' ? 'bg-success/10' : n.status === 'failed' ? 'bg-destructive/10' : 'bg-warning/10'}`}>
                {n.status === 'sent' ? <CheckCircle className="w-4 h-4 text-success" /> : n.status === 'failed' ? <XCircle className="w-4 h-4 text-destructive" /> : <Clock className="w-4 h-4 text-warning" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{n.subject}</p>
                <p className="text-xs text-muted-foreground">{n.recipient_email} • {new Date(n.created_at).toLocaleString()}</p>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${n.status === 'sent' ? 'bg-success/10 text-success' : n.status === 'failed' ? 'bg-destructive/10 text-destructive' : 'bg-warning/10 text-warning'}`}>{n.status}</span>
            </div>
          ))}
        </div>
      )}

      {/* Analytics */}
      {activeTab === 'analytics' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Total Revenue', value: '₹--', desc: 'Across all stores', icon: Receipt },
              { label: 'Active Stores', value: allBusinesses.length, desc: 'Currently active', icon: Store },
              { label: 'Avg Products/Store', value: stats.businesses > 0 ? Math.round(stats.products / stats.businesses) : 0, desc: 'Per business', icon: Package },
              { label: 'Gallery Items', value: stats.gallery, desc: 'Pre-built products', icon: Database },
            ].map(s => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="rounded-2xl glass-card shadow-soft p-4 space-y-1">
                  <Icon className="w-4 h-4 text-primary" />
                  <p className="text-xl font-bold font-display text-foreground">{s.value}</p>
                  <p className="text-xs font-medium text-foreground">{s.label}</p>
                  <p className="text-[10px] text-muted-foreground">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Features */}
      {activeTab === 'features' && (
        <div className="space-y-4">
          <div className="rounded-2xl glass-card shadow-soft p-4">
            <h3 className="text-sm font-semibold text-foreground">Category Feature Matrix</h3>
            <p className="text-xs text-muted-foreground">Features available per business type</p>
          </div>
          {Object.entries(CATEGORY_CONFIGS).map(([key, config]) => {
            const CatIcon = config.icon;
            return (
              <div key={key} className="rounded-2xl glass-card shadow-soft p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><CatIcon className="w-5 h-5 text-primary" /></div>
                  <div><p className="text-sm font-semibold text-foreground">{config.name}</p><p className="text-xs text-muted-foreground">{config.defaultCategories.length} categories</p></div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {config.defaultCategories.map(cat => (
                    <span key={cat} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">{cat}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Subscriptions / Plans */}
      {activeTab === 'subscriptions' && (
        <div className="space-y-4">
          <div className="rounded-2xl glass-card shadow-soft p-5">
            <h3 className="text-sm font-bold text-foreground">Subscription Plans</h3>
            <p className="text-xs text-muted-foreground mt-1">Free and Pro tiers for store owners</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plans.map(plan => {
              const features = Array.isArray(plan.features) ? plan.features : [];
              const isPro = plan.name === 'Pro';
              return (
                <div key={plan.id} className={`rounded-2xl glass-card shadow-soft p-5 border-2 space-y-3 ${isPro ? 'border-primary' : 'border-border'}`}>
                  {isPro && <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">POPULAR</span>}
                  <h4 className="text-lg font-bold text-foreground">{plan.name}</h4>
                  <p className="text-2xl font-bold text-primary">₹{plan.price}<span className="text-sm text-muted-foreground font-normal">/{plan.interval}</span></p>
                  <ul className="space-y-1.5">
                    {features.map((f: string) => (
                      <li key={f} className="text-xs text-muted-foreground flex items-center gap-1.5"><CheckCircle className="w-3 h-3 text-success shrink-0" /> {f}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
          
          {/* Pro plan extras */}
          <div className="rounded-2xl glass-card shadow-soft p-5 space-y-3">
            <h3 className="text-sm font-bold text-foreground">Enterprise Add-ons (Coming Soon)</h3>
            <div className="grid grid-cols-2 gap-2">
              {['Multiple Staff', 'API Access', 'White Label', 'Dedicated Support', 'Custom Features'].map(f => (
                <div key={f} className="flex items-center gap-2 p-2 rounded-lg bg-secondary">
                  <CreditCard className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-foreground">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Backup */}
      {activeTab === 'backup' && (
        <div className="space-y-4">
          <div className="rounded-2xl glass-card shadow-soft p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"><Database className="w-6 h-6 text-primary" /></div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Platform Backup & Data</h3>
                <p className="text-xs text-muted-foreground">Export/import all platform data for disaster recovery</p>
              </div>
            </div>
          </div>

          {/* Platform-wide export */}
          <div className="rounded-2xl glass-card shadow-soft p-5 space-y-3">
            <p className="text-sm font-semibold text-foreground">Export All Businesses</p>
            <p className="text-xs text-muted-foreground">Download a combined backup of all {allBusinesses.length} businesses in the platform</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { label: 'Businesses', count: allBusinesses.length },
                { label: 'Users', count: allProfiles.length },
                { label: 'Products', count: stats.products },
                { label: 'Invoices', count: stats.invoices },
              ].map(s => (
                <div key={s.label} className="rounded-xl bg-secondary p-3 text-center">
                  <p className="text-lg font-bold text-foreground">{s.count}</p>
                  <p className="text-[10px] text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
            <button onClick={async () => {
              const backup = {
                version: '2.0', exported_at: new Date().toISOString(), type: 'platform',
                businesses: allBusinesses, users: allProfiles, stats,
              };
              const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a'); a.href = url;
              a.download = `ezo-platform-backup-${new Date().toISOString().slice(0, 10)}.json`;
              document.body.appendChild(a); a.click(); document.body.removeChild(a);
              URL.revokeObjectURL(url);
              toast({ title: 'Platform backup exported!' });
            }} className="px-6 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold flex items-center gap-2">
              <Database className="w-4 h-4" /> Export Platform Data
            </button>
          </div>

          {/* Gallery export */}
          <div className="rounded-2xl glass-card shadow-soft p-5 space-y-3">
            <p className="text-sm font-semibold text-foreground">Export Gallery Products</p>
            <p className="text-xs text-muted-foreground">{galleryItems.length} products in gallery catalog</p>
            <button onClick={() => {
              const blob = new Blob([JSON.stringify(galleryItems, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a'); a.href = url;
              a.download = `ezo-gallery-${new Date().toISOString().slice(0, 10)}.json`;
              document.body.appendChild(a); a.click(); document.body.removeChild(a);
              URL.revokeObjectURL(url);
              toast({ title: 'Gallery exported!' });
            }} className="px-6 py-2.5 rounded-xl bg-secondary text-secondary-foreground text-sm font-semibold flex items-center gap-2 hover:bg-muted transition-colors">
              <Package className="w-4 h-4" /> Export Gallery
            </button>
          </div>
        </div>
      )}

      <Dialog open={showGalleryForm} onOpenChange={open => !open && closeForm()}>
        <DialogContent className="rounded-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingItem ? 'Edit Product' : 'Add Product'}</DialogTitle><DialogDescription>Gallery product for store owners</DialogDescription></DialogHeader>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-20 h-20 rounded-xl bg-muted flex items-center justify-center overflow-hidden cursor-pointer border-2 border-dashed border-border" onClick={() => fileInputRef.current?.click()}>
                {imagePreview ? <img src={imagePreview} alt="" className="w-full h-full object-cover" /> : <ImagePlus className="w-6 h-6 text-muted-foreground" />}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
              <div className="flex-1 space-y-1.5">
                <input type="text" placeholder="Product Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                <input type="text" placeholder="Brand (optional)" value={form.brand_name} onChange={e => setForm(f => ({ ...f, brand_name: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
            </div>
            <textarea placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2}
              className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs text-muted-foreground mb-1 block">Category</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm text-foreground">{uniqueGalleryCats.map(c => <option key={c}>{c}</option>)}</select></div>
              <div><label className="text-xs text-muted-foreground mb-1 block">Store Type</label>
                <select value={form.store_category} onChange={e => setForm(f => ({ ...f, store_category: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm text-foreground">{storeCategoryOptions.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div><label className="text-xs text-muted-foreground mb-1 block">Price (₹)</label>
                <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm text-foreground" /></div>
              <div><label className="text-xs text-muted-foreground mb-1 block">Sale Price</label>
                <input type="number" value={form.discount_price} onChange={e => setForm(f => ({ ...f, discount_price: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm text-foreground" /></div>
              <div><label className="text-xs text-muted-foreground mb-1 block">Tax %</label>
                <input type="number" min="0" step="0.01" value={form.tax_percent} onChange={e => setForm(f => ({ ...f, tax_percent: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm text-foreground" /></div>
            </div>
            <div><label className="text-xs text-muted-foreground mb-1 block">SKU</label>
              <input type="text" value={form.sku} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm text-foreground" /></div>
            <motion.button whileTap={{ scale: 0.97 }} onClick={handleSaveGallery} disabled={saving || !form.name.trim()}
              className="w-full py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} {editingItem ? 'Update' : 'Add to Gallery'}
            </motion.button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
