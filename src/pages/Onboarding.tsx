import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, MapPin, Phone, FileText, Loader2, ChevronRight, ChevronLeft, Check, Printer, Globe, SkipForward, Languages, Instagram, Youtube, MessageCircle } from 'lucide-react';
import { useBusiness } from '@/hooks/useBusiness';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { BUSINESS_CATEGORIES } from '@/lib/categories';
import LottieAnimation from '@/components/common/LottieAnimation';

const steps = ['Language', 'Business Type', 'Business Name', 'Store Link', 'Social & WhatsApp', 'Contact Info', 'Printer Setup', 'Confirm'];

const Onboarding = () => {
  const { business, loading } = useBusiness();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState(0);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [checkingSlug, setCheckingSlug] = useState(false);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [gst, setGst] = useState('');
  const [printerType, setPrinterType] = useState('58mm');
  const [saving, setSaving] = useState(false);
  const [instagram, setInstagram] = useState('');
  const [youtube, setYoutube] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  useEffect(() => {
    if (!loading && business) navigate('/dashboard', { replace: true });
  }, [loading, business]);

  useEffect(() => {
    if (step === 3 && name.trim() && !slug) {
      setSlug(name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  }, [step, name]);

  useEffect(() => {
    if (step !== 3 || !slug.trim()) { setSlugAvailable(null); return; }
    const timer = setTimeout(async () => {
      setCheckingSlug(true);
      try {
        const { data, error } = await supabase.rpc('check_slug_available', { _slug: slug.trim() });
        if (!error) setSlugAvailable(data as boolean);
      } catch { setSlugAvailable(null); }
      setCheckingSlug(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [slug, step]);

  const canNext = () => {
    if (step === 0) return true; // language always selected
    if (step === 1) return !!category;
    if (step === 2) return name.trim().length >= 2;
    if (step === 3) return slug.trim().length >= 2 && slugAvailable === true;
    return true;
  };

  const handleSkipSetup = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await supabase.from('profiles').update({ language }).eq('id', user.id);
      const autoSlug = `store-${Date.now().toString(36)}`;
      const { error } = await supabase.from('businesses').insert({
        owner_id: user.id, business_name: 'My Business', category: 'custom',
        theme: 'custom', printer_type: '58mm', store_slug: autoSlug,
      }).select().single();
      if (error) throw error;
      toast({ title: language === 'hi' ? 'सेटअप हो गया!' : 'Quick Setup Done!' });
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally { setSaving(false); }
  };

  const handleFinish = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await supabase.from('profiles').update({ language }).eq('id', user.id);
      const { data, error } = await supabase.from('businesses').insert({
        owner_id: user.id, business_name: name.trim(), category,
        theme: category, phone: phone.trim() || null, address: address.trim() || null,
        gst_number: gst.trim() || null, printer_type: printerType,
        store_slug: slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, ''),
        instagram_handle: instagram.trim() || null, youtube_handle: youtube.trim() || null,
        whatsapp_number: whatsapp.trim() || null,
      }).select().single();
      if (error) throw error;
      if (data) await supabase.rpc('seed_business_starter_catalog', { _business_id: data.id });
      toast({ title: language === 'hi' ? 'व्यवसाय बनाया गया!' : 'Business Created!' });
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally { setSaving(false); }
  };

  const selectedCat = BUSINESS_CATEGORIES.find(c => c.id === category);
  const l = language;

  return (
    <div className="px-4 pt-6 lg:pl-24 max-w-lg mx-auto space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold font-display text-foreground">
            {l === 'hi' ? 'अपना व्यवसाय सेटअप करें' : 'Setup Your Business'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {l === 'hi' ? `चरण ${step + 1} / ${steps.length}` : `Step ${step + 1} of ${steps.length}`} — {steps[step]}
          </p>
        </div>
        <motion.button whileTap={{ scale: 0.95 }} onClick={handleSkipSetup} disabled={saving}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-secondary text-secondary-foreground text-xs font-semibold">
          <SkipForward className="w-3.5 h-3.5" /> {l === 'hi' ? 'छोड़ें' : 'Skip'}
        </motion.button>
      </div>

      <div className="flex gap-1.5">
        {steps.map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full flex-1 transition-colors ${i <= step ? 'gradient-primary' : 'bg-secondary'}`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
          {/* Step 0: Language */}
          {step === 0 && (
            <div className="space-y-4">
              <div className="mx-auto w-20 h-20">
                <LottieAnimation type="welcome" size={80} />
              </div>
              <p className="text-center text-sm text-muted-foreground">{l === 'hi' ? 'अपनी भाषा चुनें' : 'Choose your preferred language'}</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'en' as const, label: 'English', sub: 'Continue in English', flag: '🇬🇧' },
                  { id: 'hi' as const, label: 'हिंदी', sub: 'हिंदी में जारी रखें', flag: '🇮🇳' },
                ].map(lang => (
                  <motion.button key={lang.id} whileTap={{ scale: 0.95 }} onClick={() => setLanguage(lang.id)}
                    className={`p-5 rounded-2xl border-2 text-center space-y-2 transition-colors ${language === lang.id ? 'border-primary bg-primary/5' : 'border-border bg-card'}`}>
                    <span className="text-3xl">{lang.flag}</span>
                    <p className="text-sm font-bold text-foreground">{lang.label}</p>
                    <p className="text-[10px] text-muted-foreground">{lang.sub}</p>
                    {language === lang.id && <Check className="w-4 h-4 text-primary mx-auto" />}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Business Type */}
          {step === 1 && (
            <div className="grid grid-cols-2 gap-2.5 max-h-[55vh] overflow-y-auto no-scrollbar pr-1">
              {BUSINESS_CATEGORIES.map(cat => {
                const Icon = cat.icon;
                const isSelected = category === cat.id;
                return (
                  <motion.button key={cat.id} whileTap={{ scale: 0.95 }} onClick={() => setCategory(cat.id)}
                    className={`p-4 rounded-2xl border-2 text-left space-y-2 transition-colors ${isSelected ? 'border-primary bg-primary/5' : 'border-border bg-card'}`}>
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Icon className="w-5 h-5 text-primary" /></div>
                    <p className="text-xs font-bold text-foreground leading-tight">{cat.name}</p>
                    <p className="text-[10px] text-muted-foreground leading-snug">{cat.desc}</p>
                    {isSelected && <Check className="w-4 h-4 text-primary" />}
                  </motion.button>
                );
              })}
            </div>
          )}

          {/* Step 2: Business Name */}
          {step === 2 && (
            <div className="space-y-3">
              <div className="relative">
                <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" placeholder={l === 'hi' ? 'व्यवसाय का नाम *' : 'Business Name *'} value={name} onChange={e => setName(e.target.value)} autoFocus
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <p className="text-xs text-muted-foreground">{l === 'hi' ? 'यह नाम चालान और स्टोर पेज पर दिखेगा' : 'This name appears on invoices and your public store page'}</p>
              {selectedCat && (
                <div className="rounded-xl bg-primary/5 border border-primary/10 p-3 flex items-center gap-2">
                  {(() => { const Icon = selectedCat.icon; return <Icon className="w-4 h-4 text-primary shrink-0" />; })()}
                  <p className="text-xs text-foreground"><span className="font-semibold">{selectedCat.name}</span> — {selectedCat.desc}</p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Store Link */}
          {step === 3 && (
            <div className="space-y-3">
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" placeholder="store-link" value={slug}
                  onChange={e => { setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')); setSlugAvailable(null); }}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <p className="text-xs text-muted-foreground">Store URL: <span className="text-primary font-medium">{window.location.origin}/store/{slug || '...'}</span></p>
              {checkingSlug && <p className="text-xs text-muted-foreground flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Checking...</p>}
              {!checkingSlug && slugAvailable === true && slug.trim() && <p className="text-xs text-success font-medium flex items-center gap-1"><Check className="w-3 h-3" /> Available!</p>}
              {!checkingSlug && slugAvailable === false && slug.trim() && <p className="text-xs text-destructive font-medium">Already taken. Try another.</p>}
            </div>
          )}

          {/* Step 4: Social & WhatsApp */}
          {step === 4 && (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-foreground">{l === 'hi' ? 'सोशल मीडिया और व्हाट्सएप' : 'Social Media & WhatsApp'}</p>
              <p className="text-xs text-muted-foreground">{l === 'hi' ? 'ये आपके स्टोर पेज पर दिखेंगे (वैकल्पिक)' : 'These will appear on your store page (optional)'}</p>
              <div className="relative">
                <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" placeholder="@instagram_handle" value={instagram} onChange={e => setInstagram(e.target.value.replace(/^@/, ''))}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div className="relative">
                <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" placeholder="YouTube channel URL or handle" value={youtube} onChange={e => setYoutube(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div className="relative">
                <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="tel" placeholder={l === 'hi' ? 'व्हाट्सएप नंबर (91XXXXXXXXXX)' : 'WhatsApp Number (91XXXXXXXXXX)'} value={whatsapp} onChange={e => setWhatsapp(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
            </div>
          )}

          {/* Step 5: Contact */}
          {step === 5 && (
            <div className="space-y-3">
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="tel" placeholder={l === 'hi' ? 'फ़ोन नंबर (वैकल्पिक)' : 'Phone Number (optional)'} value={phone} onChange={e => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <textarea placeholder={l === 'hi' ? 'व्यवसाय का पता (वैकल्पिक)' : 'Business Address (optional)'} value={address} onChange={e => setAddress(e.target.value)} rows={2}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
              </div>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" placeholder={l === 'hi' ? 'GST / कर संख्या (वैकल्पिक)' : 'GST / Tax Number (optional)'} value={gst} onChange={e => setGst(e.target.value.toUpperCase())}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
            </div>
          )}

          {/* Step 6: Printer */}
          {step === 6 && (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1"><Printer className="w-3 h-3" /> {l === 'hi' ? 'प्रिंटर पेपर साइज़' : 'Printer Paper Size'}</p>
                <div className="flex gap-2">
                  {['58mm', '80mm'].map(s => (
                    <button key={s} onClick={() => setPrinterType(s)}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${printerType === s ? 'gradient-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>{s}</button>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl glass-card p-4 space-y-2">
                <p className="text-sm font-semibold text-foreground">{l === 'hi' ? 'स्टार्टर प्रोडक्ट्स' : 'Starter Products'}</p>
                <p className="text-xs text-muted-foreground">{l === 'hi' ? 'आपके व्यवसाय के आधार पर स्टार्टर कैटलॉग जोड़ा जाएगा।' : 'Based on your business type, a starter catalog will be added automatically.'}</p>
              </div>
            </div>
          )}

          {/* Step 7: Confirm */}
          {step === 7 && (
            <div className="rounded-2xl glass-card shadow-soft p-5 space-y-3">
              <h3 className="text-sm font-bold text-foreground">{l === 'hi' ? 'अपना सेटअप देखें' : 'Review Your Setup'}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">{l === 'hi' ? 'भाषा' : 'Language'}</span><span className="font-semibold text-foreground">{language === 'hi' ? 'हिंदी' : 'English'}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">{l === 'hi' ? 'प्रकार' : 'Type'}</span><span className="font-semibold text-foreground">{selectedCat?.name || category}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">{l === 'hi' ? 'नाम' : 'Name'}</span><span className="font-semibold text-foreground">{name}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">{l === 'hi' ? 'स्टोर लिंक' : 'Store Link'}</span><span className="font-semibold text-primary">/store/{slug}</span></div>
                {instagram && <div className="flex justify-between"><span className="text-muted-foreground">Instagram</span><span className="text-foreground">@{instagram}</span></div>}
                {youtube && <div className="flex justify-between"><span className="text-muted-foreground">YouTube</span><span className="text-foreground truncate max-w-[180px]">{youtube}</span></div>}
                {whatsapp && <div className="flex justify-between"><span className="text-muted-foreground">WhatsApp</span><span className="text-foreground">{whatsapp}</span></div>}
                {phone && <div className="flex justify-between"><span className="text-muted-foreground">{l === 'hi' ? 'फ़ोन' : 'Phone'}</span><span className="text-foreground">{phone}</span></div>}
                <div className="flex justify-between"><span className="text-muted-foreground">{l === 'hi' ? 'प्रिंटर' : 'Printer'}</span><span className="text-foreground">{printerType}</span></div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-3 pt-2">
        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)} className="flex-1 py-3 rounded-xl bg-secondary text-secondary-foreground text-sm font-semibold flex items-center justify-center gap-1">
            <ChevronLeft className="w-4 h-4" /> {l === 'hi' ? 'वापस' : 'Back'}
          </button>
        )}
        {step < 7 ? (
          <motion.button whileTap={{ scale: 0.97 }} disabled={!canNext()} onClick={() => setStep(s => s + 1)}
            className="flex-[2] py-3 rounded-xl gradient-primary text-primary-foreground font-bold text-sm glow-primary flex items-center justify-center gap-1 disabled:opacity-50">
            {l === 'hi' ? 'आगे' : 'Next'} <ChevronRight className="w-4 h-4" />
          </motion.button>
        ) : (
          <motion.button whileTap={{ scale: 0.97 }} disabled={saving} onClick={handleFinish}
            className="flex-[2] py-3 rounded-xl gradient-primary text-primary-foreground font-bold text-sm glow-primary flex items-center justify-center gap-2 disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} {l === 'hi' ? 'व्यवसाय बनाएं' : 'Create Business'}
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
