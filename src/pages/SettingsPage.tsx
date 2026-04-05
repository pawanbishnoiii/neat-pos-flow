import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Store, Printer, Palette, User, Bell, Shield, Globe, LogOut, Tag, Users, Loader2, Link2, Save, ExternalLink, Check, X, Copy, Bluetooth, Wifi, Usb, Paintbrush, Star, MessageSquare, Moon, Sun, Clock, ChevronRight, Settings, Receipt, TrendingDown, CreditCard, BarChart3, Download, Upload, Database } from 'lucide-react';
import LottieAnimation from '@/components/common/LottieAnimation';
import BackupPanel from '@/components/settings/BackupPanel';
import PageHeader from '@/components/layout/PageHeader';
import { useAuth } from '@/hooks/useAuth';
import { useBusiness } from '@/hooks/useBusiness';
import { connectPrinter } from '@/lib/ezoPrinter';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { DASHBOARD_THEMES, type DashboardThemeKey, PRINTER_BRANDS } from '@/lib/categoryConfig';
import { getCategoryConfig } from '@/lib/categoryConfig';
import { useLanguage } from '@/hooks/useLanguage';

type SettingsPanel = 'business' | 'printer' | 'theme' | 'profile' | 'notifications' | 'security' | 'language' | 'store_design' | 'reviews' | 'backup' | null;

const SettingsPage = () => {
  const { signOut, user, isAdmin } = useAuth();
  const { business, refetch } = useBusiness();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const [activePanel, setActivePanel] = useState<SettingsPanel>(null);
  const [connecting, setConnecting] = useState(false);
  const [darkMode, setDarkMode] = useState(document.documentElement.classList.contains('dark'));
  const [liveTime, setLiveTime] = useState(new Date());

  const categoryConfig = business ? getCategoryConfig(business.category) : null;

  const [bizName, setBizName] = useState('');
  const [bizPhone, setBizPhone] = useState('');
  const [bizAddress, setBizAddress] = useState('');
  const [bizGst, setBizGst] = useState('');
  const [bizSlug, setBizSlug] = useState('');
  const [bizPrinterType, setBizPrinterType] = useState('58mm');
  const [savingBiz, setSavingBiz] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [checkingSlug, setCheckingSlug] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<DashboardThemeKey>('fire_orange');
  const [selectedPrinterBrand, setSelectedPrinterBrand] = useState('ezo');
  const [selectedPrinterModel, setSelectedPrinterModel] = useState('');
  const [selectedStoreTheme, setSelectedStoreTheme] = useState('suspended');
  const [bizUpi, setBizUpi] = useState('');
  const [savingStoreTheme, setSavingStoreTheme] = useState(false);
  const [pendingReviews, setPendingReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setLiveTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (business) {
      setBizName(business.business_name || '');
      setBizPhone(business.phone || '');
      setBizAddress(business.address || '');
      setBizGst(business.gst_number || '');
      setBizSlug(business.store_slug || '');
      setBizPrinterType(business.printer_type || '58mm');
      setBizUpi((business as any).upi_id || '');
      setSelectedStoreTheme((business as any).store_theme || 'suspended');
    }
  }, [business]);

  useEffect(() => {
    if (activePanel === 'profile' && user) {
      supabase.from('profiles').select('name, phone').eq('id', user.id).maybeSingle().then(({ data }) => {
        if (data) { setProfileName(data.name || ''); setProfilePhone(data.phone || ''); }
      });
    }
    if (activePanel === 'reviews' && business) {
      setLoadingReviews(true);
      supabase.from('product_reviews').select('*').eq('business_id', business.id).eq('is_approved', false).order('created_at', { ascending: false })
        .then(({ data }) => { setPendingReviews(data || []); setLoadingReviews(false); });
    }
  }, [activePanel, user, business]);

  useEffect(() => {
    if (activePanel !== 'business' || !bizSlug.trim()) { setSlugAvailable(null); return; }
    if (bizSlug === business?.store_slug) { setSlugAvailable(true); return; }
    const timer = setTimeout(async () => {
      setCheckingSlug(true);
      try { const { data } = await supabase.rpc('check_slug_available', { _slug: bizSlug.trim() }); setSlugAvailable(data as boolean); } catch { setSlugAvailable(null); }
      setCheckingSlug(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [bizSlug, activePanel]);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle('dark', next);
  };

  const handleSaveBusiness = async () => {
    if (!business) return;
    if (bizSlug.trim() && slugAvailable === false) { toast({ title: 'Link not available', variant: 'destructive' }); return; }
    setSavingBiz(true);
    const { error } = await supabase.from('businesses').update({
      business_name: bizName.trim(), phone: bizPhone.trim() || null, address: bizAddress.trim() || null,
      gst_number: bizGst.trim() || null, store_slug: bizSlug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '') || null, printer_type: bizPrinterType,
      upi_id: bizUpi.trim() || null,
    } as any).eq('id', business.id);
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else { toast({ title: 'Saved!' }); refetch(); }
    setSavingBiz(false);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSavingProfile(true);
    const { error } = await supabase.from('profiles').update({ name: profileName.trim(), phone: profilePhone.trim() || null }).eq('id', user.id);
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else toast({ title: 'Profile updated!' });
    setSavingProfile(false);
  };

  const handleConnectPrinter = async () => {
    setConnecting(true);
    const conn = await connectPrinter();
    setConnecting(false);
    if (conn.connected) toast({ title: 'Printer connected', description: conn.device?.name || 'Ready' });
    else toast({ title: 'Failed', description: 'Enable Bluetooth and try again.', variant: 'destructive' });
  };

  const handleApplyTheme = () => {
    const th = DASHBOARD_THEMES[selectedTheme];
    document.documentElement.style.setProperty('--primary', th.primary);
    document.documentElement.style.setProperty('--ring', th.primary);
    document.documentElement.style.setProperty('--accent', th.accent);
    toast({ title: `Theme: ${th.label}`, description: 'Applied!' });
  };

  const handleApproveReview = async (id: string) => {
    await supabase.from('product_reviews').update({ is_approved: true }).eq('id', id);
    setPendingReviews(prev => prev.filter(r => r.id !== id));
    toast({ title: 'Review approved!' });
  };

  const handleDeleteReview = async (id: string) => {
    await supabase.from('product_reviews').delete().eq('id', id);
    setPendingReviews(prev => prev.filter(r => r.id !== id));
    toast({ title: 'Review deleted' });
  };

  const handleChangeLanguage = async (lang: 'en' | 'hi') => {
    await setLanguage(lang);
    toast({ title: lang === 'hi' ? 'भाषा बदली गई!' : 'Language changed!' });
  };

  const storeUrl = bizSlug ? `${window.location.origin}/store/${bizSlug}` : '';
  const currentBrand = PRINTER_BRANDS.find(b => b.id === selectedPrinterBrand);

  const settingsGroups = useMemo(() => {
    const groups = [
      {
        title: language === 'hi' ? 'व्यवसाय' : 'BUSINESS',
        items: [
          { key: 'business' as SettingsPanel, icon: Store, label: 'Business Profile', desc: 'Name, GST, address, store link' },
          { nav: '/store-manager', icon: Paintbrush, label: 'Store Manager', desc: 'Manage your public store' },
          { key: 'printer' as SettingsPanel, icon: Printer, label: 'Printer & Devices', desc: 'Printer brand, model, connection' },
          { key: 'theme' as SettingsPanel, icon: Palette, label: 'Dashboard Theme', desc: 'Colors and appearance' },
        ],
      },
      {
        title: language === 'hi' ? 'मॉड्यूल' : 'MODULES',
        items: [
          { nav: '/offers', icon: Tag, label: t('nav.offers'), desc: 'Discount campaigns' },
          { nav: '/customers', icon: Users, label: t('nav.customers'), desc: 'CRM and analytics' },
          { nav: '/history', icon: Receipt, label: t('nav.history'), desc: 'All past invoices' },
          { nav: '/expenses', icon: TrendingDown, label: t('nav.expenses'), desc: 'Track expenses' },
          { nav: '/credit-ledger', icon: CreditCard, label: t('nav.credit'), desc: 'Udhar / Credit' },
          { key: 'reviews' as SettingsPanel, icon: MessageSquare, label: 'Reviews', desc: 'Approve reviews' },
        ],
      },
      {
        title: language === 'hi' ? 'खाता' : 'ACCOUNT',
        items: [
          { key: 'profile' as SettingsPanel, icon: User, label: 'Profile', desc: user?.email || 'Name & contact' },
          { key: 'language' as SettingsPanel, icon: Globe, label: language === 'hi' ? 'भाषा' : 'Language', desc: language === 'hi' ? 'हिंदी' : 'English' },
          { key: 'notifications' as SettingsPanel, icon: Bell, label: t('notifications.title'), desc: 'Alerts & updates' },
          { key: 'security' as SettingsPanel, icon: Shield, label: 'Security', desc: 'Sessions & login' },
          { key: 'backup' as SettingsPanel, icon: Database, label: 'Backup', desc: 'Import & export data' },
        ],
      },
    ];
    if (isAdmin) {
      groups.push({
        title: 'ADMINISTRATION',
        items: [{ nav: '/admin', icon: Shield, label: 'Ezo Admin', desc: 'Platform management' } as any],
      });
    }
    return groups;
  }, [user?.email, isAdmin, language]);

  // ---------- DESKTOP LAYOUT ----------
  const renderDesktopPanel = () => {
    if (!activePanel) return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/5 flex items-center justify-center">
            <Settings className="w-8 h-8 text-muted-foreground/30" />
          </div>
          <p className="text-lg font-semibold text-foreground">Select a setting</p>
          <p className="text-sm text-muted-foreground">Choose an option from the sidebar to configure.</p>
        </div>
      </div>
    );

    const panelTitle = activePanel === 'business' ? 'Business Profile' : activePanel === 'printer' ? 'Printer & Devices' : activePanel === 'profile' ? 'Profile' : activePanel === 'theme' ? 'Dashboard Theme' : activePanel === 'reviews' ? 'Manage Reviews' : activePanel === 'notifications' ? t('notifications.title') : activePanel === 'security' ? 'Security' : activePanel === 'language' ? (language === 'hi' ? 'भाषा चुनें' : 'Language') : activePanel === 'backup' ? 'Backup & Restore' : 'Settings';

    return (
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl">
          <h2 className="text-xl font-bold text-foreground mb-1">{panelTitle}</h2>
          <p className="text-sm text-muted-foreground mb-6">Manage your settings</p>
          {renderPanelContent()}
        </div>
      </div>
    );
  };

  // ---------- SHARED PANEL CONTENT ----------
  const renderPanelContent = () => {
    if (activePanel === 'business') return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Business Name</label>
            <input type="text" value={bizName} onChange={e => setBizName(e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
          <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Phone</label>
            <input type="tel" value={bizPhone} onChange={e => setBizPhone(e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
        </div>
        <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Address</label>
          <textarea value={bizAddress} onChange={e => setBizAddress(e.target.value)} rows={2} className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" /></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">GST Number</label>
            <input type="text" value={bizGst} onChange={e => setBizGst(e.target.value.toUpperCase())} className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Store Link</label>
            <input type="text" value={bizSlug} onChange={e => { setBizSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')); setSlugAvailable(null); }}
              placeholder="my-store" className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            {storeUrl && <p className="text-xs text-primary mt-1 flex items-center gap-1"><ExternalLink className="w-3 h-3" />{storeUrl}</p>}
            {checkingSlug && <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><Loader2 className="w-3 h-3 animate-spin" /> Checking...</p>}
            {!checkingSlug && slugAvailable === true && bizSlug.trim() && <p className="text-xs text-success font-medium flex items-center gap-1 mt-1"><Check className="w-3 h-3" /> Available</p>}
            {!checkingSlug && slugAvailable === false && bizSlug.trim() && <p className="text-xs text-destructive font-medium flex items-center gap-1 mt-1"><X className="w-3 h-3" /> Taken</p>}
          </div>
        </div>
        <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">UPI ID (for QR payments)</label>
          <input type="text" value={bizUpi} onChange={e => setBizUpi(e.target.value)} placeholder="yourname@upi"
            className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
          <p className="text-[10px] text-muted-foreground mt-1">Used to generate UPI QR code during billing</p>
        </div>
        <motion.button whileTap={{ scale: 0.97 }} onClick={handleSaveBusiness} disabled={savingBiz}
          className="px-6 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold flex items-center gap-2 disabled:opacity-50">
          {savingBiz ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Changes
        </motion.button>
      </div>
    );

    if (activePanel === 'profile') return (
      <div className="space-y-4">
        <p className="text-xs text-muted-foreground">Email: {user?.email}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Name</label>
            <input type="text" value={profileName} onChange={e => setProfileName(e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
          <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Phone</label>
            <input type="tel" value={profilePhone} onChange={e => setProfilePhone(e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
        </div>
        <motion.button whileTap={{ scale: 0.97 }} onClick={handleSaveProfile} disabled={savingProfile}
          className="px-6 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold flex items-center gap-2 disabled:opacity-50">
          {savingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
        </motion.button>
      </div>
    );

    if (activePanel === 'language') return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[
          { id: 'en' as const, label: 'English', flag: '🇬🇧', desc: 'Use English interface' },
          { id: 'hi' as const, label: 'हिंदी', flag: '🇮🇳', desc: 'हिंदी इंटरफ़ेस का उपयोग करें' },
        ].map(lang => (
          <button key={lang.id} onClick={() => handleChangeLanguage(lang.id)}
            className={`p-5 rounded-2xl border-2 text-left flex items-center gap-4 transition-all ${language === lang.id ? 'border-primary bg-primary/5 shadow-md' : 'border-border bg-card hover:bg-muted'}`}>
            <span className="text-3xl">{lang.flag}</span>
            <div className="flex-1"><p className="text-sm font-semibold text-foreground">{lang.label}</p><p className="text-xs text-muted-foreground">{lang.desc}</p></div>
            {language === lang.id && <Check className="w-5 h-5 text-primary" />}
          </button>
        ))}
      </div>
    );

    if (activePanel === 'reviews') return (
      <div className="space-y-3">
        {loadingReviews ? <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div> :
          pendingReviews.length === 0 ? <div className="text-center py-8 rounded-2xl bg-muted/30"><MessageSquare className="w-8 h-8 mx-auto text-muted-foreground/30 mb-2" /><p className="text-sm text-muted-foreground">No pending reviews</p></div> :
            pendingReviews.map(r => (
              <div key={r.id} className="rounded-xl border border-border p-4 space-y-2">
                <div className="flex items-center gap-1">{[...Array(5)].map((_, j) => <Star key={j} className={`w-3.5 h-3.5 ${j < r.rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground/20'}`} />)}</div>
                {r.review_text && <p className="text-sm text-foreground italic">"{r.review_text}"</p>}
                <p className="text-xs text-muted-foreground">{r.reviewer_name} • {new Date(r.created_at).toLocaleDateString()}</p>
                <div className="flex gap-2">
                  <button onClick={() => handleApproveReview(r.id)} className="px-4 py-1.5 rounded-lg bg-success/10 text-success text-xs font-semibold">Approve</button>
                  <button onClick={() => handleDeleteReview(r.id)} className="px-4 py-1.5 rounded-lg bg-destructive/10 text-destructive text-xs font-semibold">Delete</button>
                </div>
              </div>
            ))
        }
      </div>
    );

    if (activePanel === 'printer') return (
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block">Select Printer Brand</label>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
            {PRINTER_BRANDS.map(brand => (
              <button key={brand.id} onClick={() => { setSelectedPrinterBrand(brand.id); setSelectedPrinterModel(''); }}
                className={`p-2.5 rounded-xl text-xs font-semibold text-center transition-colors ${selectedPrinterBrand === brand.id ? 'gradient-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-muted'}`}>
                {brand.name}
              </button>
            ))}
          </div>
        </div>
        {currentBrand && (
          <>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">Select Model</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                {currentBrand.models.map(model => (
                  <button key={model} onClick={() => setSelectedPrinterModel(model)}
                    className={`p-3 rounded-xl text-left text-sm transition-colors ${selectedPrinterModel === model ? 'bg-primary/10 border border-primary/30 text-primary font-semibold' : 'bg-secondary text-secondary-foreground hover:bg-muted'}`}>
                    {model}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">Connection Type</label>
              <div className="flex gap-2 flex-wrap">
                {currentBrand.connectionType.map(ct => (
                  <div key={ct} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium">
                    {ct === 'bluetooth' && <Bluetooth className="w-3 h-3" />}
                    {ct === 'usb' && <Usb className="w-3 h-3" />}
                    {ct === 'wifi' && <Wifi className="w-3 h-3" />}
                    {ct === 'network' && <Globe className="w-3 h-3" />}
                    {ct.charAt(0).toUpperCase() + ct.slice(1)}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block">Paper Size</label>
          <div className="flex gap-2">
            {['58mm', '80mm'].map(s => (
              <button key={s} onClick={() => setBizPrinterType(s)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${bizPrinterType === s ? 'gradient-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
        <button onClick={() => void handleConnectPrinter()} disabled={connecting}
          className="px-6 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold flex items-center gap-2 disabled:opacity-50">
          {connecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link2 className="w-4 h-4" />} Connect Printer
        </button>
      </div>
    );

    if (activePanel === 'theme') return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {(Object.entries(DASHBOARD_THEMES) as [DashboardThemeKey, typeof DASHBOARD_THEMES[DashboardThemeKey]][]).map(([key, th]) => (
            <button key={key} onClick={() => setSelectedTheme(key)}
              className={`p-3 rounded-xl border-2 text-left space-y-2 transition-colors ${selectedTheme === key ? 'border-primary bg-primary/5' : 'border-border bg-card hover:bg-muted'}`}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg" style={{ background: `hsl(${th.primary})` }} />
                <div className="w-8 h-8 rounded-lg" style={{ background: `hsl(${th.accent})` }} />
                <span className="text-lg">{th.emoji}</span>
              </div>
              <p className="text-xs font-semibold text-foreground">{th.label}</p>
              {selectedTheme === key && <Check className="w-4 h-4 text-primary" />}
            </button>
          ))}
        </div>
        <motion.button whileTap={{ scale: 0.97 }} onClick={handleApplyTheme}
          className="px-6 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold">
          Apply Theme
        </motion.button>
      </div>
    );

    if (activePanel === 'notifications') return (
      <div className="space-y-3">
        {['Low stock alerts', 'New customer alerts', 'Daily sales summary', 'Offer expiry reminders'].map(item => (
          <div key={item} className="flex items-center justify-between p-4 rounded-xl bg-card border border-border">
            <span className="text-sm text-foreground">{item}</span>
            <div className="w-10 h-6 rounded-full bg-primary/30 relative cursor-pointer"><div className="absolute right-0.5 top-0.5 w-5 h-5 rounded-full bg-primary transition-all" /></div>
          </div>
        ))}
      </div>
    );

    if (activePanel === 'security') return (
      <div className="space-y-4">
        <div className="rounded-xl bg-success/10 border border-success/20 p-4">
          <p className="text-sm font-semibold text-success flex items-center gap-2"><Shield className="w-4 h-4" /> Session Active</p>
          <p className="text-xs text-muted-foreground mt-1">Last login: {new Date().toLocaleDateString()}</p>
        </div>
        <div className="rounded-xl border border-border p-4 space-y-2">
          <p className="text-sm font-semibold text-foreground">Email</p>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
      </div>
    );
    if (activePanel === 'backup') return (
      <BackupPanel business={business} toast={toast} />
    );

    return null;
  };

  return (
    <>
      {/* ===== DESKTOP LAYOUT ===== */}
      <div className="hidden lg:flex h-screen bg-background lg:ml-20">
        {/* Desktop Top Bar */}
        <div className="fixed top-0 left-20 right-0 h-16 bg-card border-b border-border z-30 flex items-center px-6">
          <div className="flex items-center gap-3 flex-1">
            {business?.logo_url ? (
              <img src={business.logo_url.startsWith('http') ? business.logo_url : supabase.storage.from('product-images').getPublicUrl(business.logo_url).data.publicUrl} alt="" className="w-8 h-8 rounded-lg object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><Store className="w-4 h-4 text-primary" /></div>
            )}
            <span className="text-sm font-bold text-foreground">{business?.business_name || 'Ezo POS'}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span className="font-mono">{liveTime.toLocaleTimeString()}</span>
            <span>•</span>
            <span>{liveTime.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
          <div className="flex-1 flex items-center justify-end gap-3">
            <button onClick={toggleDarkMode} className="p-2 rounded-lg hover:bg-muted transition-colors">
              {darkMode ? <Moon className="w-4 h-4 text-primary" /> : <Sun className="w-4 h-4 text-amber-500" />}
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/50">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center"><User className="w-3.5 h-3.5 text-primary" /></div>
              <span className="text-xs font-medium text-foreground">{user?.email?.split('@')[0]}</span>
            </div>
          </div>
        </div>

        {/* Desktop Sidebar */}
        <aside className="w-60 bg-card border-r border-border pt-16 overflow-y-auto shrink-0">
          <div className="p-3 space-y-4">
            {business?.store_slug && (
              <div className="rounded-xl bg-primary/5 p-3 space-y-1.5">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase">Your Store</p>
                <p className="text-xs text-primary font-medium truncate">{storeUrl}</p>
                <div className="flex gap-1">
                  <button onClick={() => { navigator.clipboard.writeText(storeUrl); toast({ title: 'Copied!' }); }} className="p-1.5 rounded hover:bg-muted"><Copy className="w-3 h-3 text-muted-foreground" /></button>
                  <button onClick={() => window.open(storeUrl, '_blank')} className="p-1.5 rounded hover:bg-muted"><ExternalLink className="w-3 h-3 text-muted-foreground" /></button>
                </div>
              </div>
            )}

            {settingsGroups.map(group => (
              <div key={group.title} className="space-y-0.5">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 mb-1.5">{group.title}</p>
                {group.items.map((item: any) => {
                  const Icon = item.icon;
                  const isActive = !item.nav && activePanel === item.key;
                  return (
                    <button key={item.label} onClick={() => item.nav ? navigate(item.nav) : setActivePanel(item.key)}
                      className={`flex items-center gap-2.5 px-3 py-2 w-full text-left rounded-xl text-xs font-medium transition-all ${isActive ? 'bg-primary/10 text-primary border-l-2 border-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}>
                      <Icon className={`w-4 h-4 shrink-0 ${group.title === 'ADMINISTRATION' ? 'text-destructive' : ''}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            ))}

            <button onClick={signOut} className="w-full py-2.5 rounded-xl bg-destructive/10 text-destructive font-semibold text-xs flex items-center justify-center gap-2 mt-4">
              <LogOut className="w-3.5 h-3.5" /> {t('common.logout')}
            </button>
          </div>
        </aside>

        {/* Desktop Content */}
        <main className="flex-1 pt-16 flex">
          {renderDesktopPanel()}
        </main>
      </div>

      {/* ===== MOBILE LAYOUT ===== */}
      <div className="lg:hidden px-4 pt-4 max-w-4xl mx-auto space-y-6 pb-24">
        <PageHeader title={t('nav.settings')} backTo="/dashboard" />

        {business?.store_slug && (
          <div className="rounded-2xl glass-card shadow-soft p-4 flex items-center gap-3">
            <Globe className="w-5 h-5 text-primary shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-muted-foreground">Your Store</p>
              <p className="text-sm text-primary font-semibold truncate">{storeUrl}</p>
            </div>
            <div className="flex gap-1.5">
              <button onClick={() => { navigator.clipboard.writeText(storeUrl); toast({ title: 'Copied!' }); }} className="p-2 rounded-lg hover:bg-muted"><Copy className="w-4 h-4 text-muted-foreground" /></button>
              <button onClick={() => window.open(storeUrl, '_blank')} className="p-2 rounded-lg hover:bg-muted"><ExternalLink className="w-4 h-4 text-muted-foreground" /></button>
            </div>
          </div>
        )}

        <button onClick={toggleDarkMode} className="w-full rounded-2xl glass-card shadow-soft p-4 flex items-center gap-3">
          {darkMode ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-amber-500" />}
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold text-foreground">{darkMode ? 'Dark Mode' : 'Light Mode'}</p>
          </div>
          <div className={`w-12 h-7 rounded-full relative transition-colors ${darkMode ? 'bg-primary' : 'bg-muted'}`}>
            <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-all ${darkMode ? 'right-0.5' : 'left-0.5'}`} />
          </div>
        </button>

        {settingsGroups.map((group, gi) => (
          <motion.div key={group.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: gi * 0.1 }} className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">{group.title}</p>
            <div className="rounded-2xl glass-card shadow-soft overflow-hidden divide-y divide-border">
              {group.items.map((item: any) => {
                const Icon = item.icon;
                return (
                  <button key={item.label} onClick={() => item.nav ? navigate(item.nav) : setActivePanel(item.key)}
                    className="flex items-center gap-3 p-4 w-full text-left hover:bg-muted/50 transition-colors">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${group.title === 'ADMINISTRATION' ? 'bg-destructive/10' : 'bg-primary/10'}`}>
                      <Icon className={`w-5 h-5 ${group.title === 'ADMINISTRATION' ? 'text-destructive' : 'text-primary'}`} />
                    </div>
                    <div className="flex-1 min-w-0"><p className="text-sm font-semibold text-foreground">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </button>
                );
              })}
            </div>
          </motion.div>
        ))}

        <motion.button whileTap={{ scale: 0.97 }} onClick={signOut}
          className="w-full py-3 rounded-xl bg-destructive/10 text-destructive font-semibold text-sm flex items-center justify-center gap-2">
          <LogOut className="w-4 h-4" /> {t('common.logout')}
        </motion.button>
      </div>

      {/* Mobile Panel Dialog */}
      {activePanel && (
        <div className="lg:hidden fixed inset-0 z-50 bg-background overflow-y-auto">
          <div className="px-4 pt-4 pb-24 max-w-lg mx-auto">
            <button onClick={() => setActivePanel(null)} className="flex items-center gap-2 text-sm text-muted-foreground mb-4 hover:text-foreground">
              <ChevronRight className="w-4 h-4 rotate-180" /> Back to Settings
            </button>
            <h2 className="text-xl font-bold text-foreground mb-4">
              {activePanel === 'business' ? 'Business Profile' : activePanel === 'printer' ? 'Printer & Devices' : activePanel === 'profile' ? 'Profile' : activePanel === 'theme' ? 'Dashboard Theme' : activePanel === 'reviews' ? 'Reviews' : activePanel === 'notifications' ? t('notifications.title') : activePanel === 'security' ? 'Security' : activePanel === 'language' ? 'Language' : activePanel === 'backup' ? 'Backup & Restore' : 'Settings'}
            </h2>
            {renderPanelContent()}
          </div>
        </div>
      )}
    </>
  );
};

export default SettingsPage;
