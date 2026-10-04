import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, BadgeCheck, Eye, EyeOff, Loader2, Lock, Mail,
  ShieldCheck, Sparkles, User, Zap,
} from 'lucide-react';
import BrandMark from '@/components/marketing/BrandMark';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { lovable } from '@/integrations/lovable/index';

const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const AppleIcon = () => <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" /></svg>;

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const { signIn, signUp, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && user) navigate('/', { replace: true });
  }, [authLoading, user, navigate]);

  const getErrorMessage = (err: unknown) => {
    if (!err) return 'Something went wrong. Please try again.';
    const message = err instanceof Error ? err.message : String(err);
    if (!navigator.onLine) return 'No internet connection. Please check network and retry.';
    if (message.toLowerCase().includes('failed to fetch')) return 'Unable to reach backend right now. Please retry in a few seconds.';
    return message || 'Something went wrong. Please try again.';
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!navigator.onLine) {
      toast({ title: 'No internet', description: 'Please reconnect and try again.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await signIn(email.trim(), password);
        if (error) throw error;
      } else {
        const { error } = await signUp(email.trim(), password, name.trim());
        if (error) throw error;
        toast({ title: 'Account created!', description: 'Check your email to verify, then log in.' });
        setIsLogin(true);
        setPassword('');
      }
    } catch (error) {
      toast({ title: 'Auth error', description: getErrorMessage(error), variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'apple') => {
    if (!navigator.onLine) {
      toast({ title: 'No internet', description: 'Please reconnect and try again.', variant: 'destructive' });
      return;
    }
    setOauthLoading(provider);
    try {
      const { error } = await lovable.auth.signInWithOAuth(provider, {
        redirect_uri: window.location.origin,
        extraParams: provider === 'google' ? { prompt: 'select_account' } : undefined,
      });
      if (error) toast({ title: 'Auth error', description: getErrorMessage(error), variant: 'destructive' });
    } catch (error) {
      toast({ title: 'Auth error', description: getErrorMessage(error), variant: 'destructive' });
    } finally {
      setOauthLoading(null);
    }
  };

  const busy = loading || authLoading || Boolean(oauthLoading);

  return (
    <main className="zen-auth min-h-screen bg-[#fbf8f2] p-3 text-[#141b34] md:p-5">
      <div className="mx-auto grid min-h-[calc(100vh-24px)] max-w-[1460px] overflow-hidden rounded-[30px] bg-white shadow-[0_30px_90px_rgba(20,27,52,.12)] md:min-h-[calc(100vh-40px)] lg:grid-cols-[1.02fr_.98fr]">
        <section className="relative hidden min-h-full overflow-hidden bg-[#141b34] p-10 text-white lg:flex lg:flex-col xl:p-14">
          <div className="absolute -left-24 -top-20 h-80 w-80 rounded-full bg-[#3568f5]/50 blur-[100px]" />
          <div className="absolute -bottom-32 -right-28 h-96 w-96 rounded-full bg-[#ff5d3b]/45 blur-[110px]" />
          <div className="relative z-10"><BrandMark inverse /></div>
          <div className="relative z-10 my-auto py-12">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }}>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs font-bold text-[#c9f26a]"><Sparkles className="h-3.5 w-3.5" /> Your calmer business starts here</span>
              <h1 className="mt-7 max-w-2xl font-display text-[clamp(3.5rem,5.5vw,6.5rem)] font-black leading-[.84] tracking-[-.08em]">One login.<br /><span className="text-[#ff6e4f]">Every sale.</span></h1>
              <p className="mt-6 max-w-md text-base leading-7 text-white/60">Run your counter, stockroom, customer book and online store from one bright, fast workspace.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: .92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: .18, duration: .8 }} className="relative mt-10 max-w-[620px]">
              <div className="overflow-hidden rounded-[32px] border border-white/15 bg-white/5 p-2 shadow-2xl"><img src="/images/clay-commerce.webp" alt="Colorful Zen POS retail toolkit" className="aspect-[3/2] w-full rounded-[26px] object-cover" /></div>
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -bottom-5 -right-2 flex items-center gap-3 rounded-2xl border border-white/60 bg-white px-4 py-3 text-[#141b34] shadow-2xl"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#c9f26a]"><BadgeCheck className="h-4 w-4" /></span><div><p className="text-[10px] font-bold uppercase tracking-wider text-[#74798a]">Ready to sell</p><p className="text-sm font-extrabold">In under 3 minutes</p></div></motion.div>
            </motion.div>
          </div>
          <div className="relative z-10 flex flex-wrap gap-5 text-xs font-semibold text-white/55"><span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#c9f26a]" /> Secure by design</span><span className="flex items-center gap-2"><Zap className="h-4 w-4 text-[#ffd84d]" /> Fast on every device</span></div>
        </section>

        <section className="relative flex min-h-full items-center justify-center px-5 py-10 sm:px-10 md:px-16 xl:px-24">
          <button onClick={() => navigate('/landing')} className="absolute left-5 top-5 flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-[#74798a] transition-colors hover:bg-[#141b34]/5 hover:text-[#141b34] md:left-8 md:top-8"><ArrowLeft className="h-4 w-4" /> Back to home</button>
          <div className="w-full max-w-[470px] pt-12 lg:pt-0">
            <div className="mb-9 lg:hidden"><BrandMark /></div>
            <motion.div key={isLogin ? 'login-title' : 'signup-title'} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#ff5d3b]">{isLogin ? 'Welcome back' : 'Start for free'}</p>
              <h2 className="mt-3 font-display text-[clamp(2.5rem,5vw,4rem)] font-black leading-[.92] tracking-[-.065em]">{isLogin ? <>Good to see<br />you again.</> : <>Meet your new<br />business brain.</>}</h2>
              <p className="mt-4 text-sm leading-6 text-[#74798a]">{isLogin ? 'Log in to pick up right where you left off.' : 'No card. No setup fee. Just a smarter way to sell.'}</p>
            </motion.div>

            <div className="mt-8 grid grid-cols-2 rounded-2xl bg-[#f1ede6] p-1.5">
              {['Log in', 'Create account'].map((tab, index) => { const active = index === 0 ? isLogin : !isLogin; return <button key={tab} type="button" onClick={() => setIsLogin(index === 0)} className={`relative rounded-[13px] py-3 text-sm font-extrabold transition-colors ${active ? 'text-[#141b34]' : 'text-[#8b8f9d]'}`}>{active && <motion.span layoutId="auth-tab" className="absolute inset-0 rounded-[13px] bg-white shadow-sm" transition={{ type: 'spring', stiffness: 500, damping: 34 }} />}<span className="relative z-10">{tab}</span></button>; })}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button type="button" onClick={() => handleOAuth('google')} disabled={busy} className="flex items-center justify-center gap-2.5 rounded-2xl border border-[#141b34]/10 bg-white py-3.5 text-sm font-bold shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#141b34]/20 disabled:opacity-50">{oauthLoading === 'google' ? <Loader2 className="h-5 w-5 animate-spin" /> : <GoogleIcon />} Google</button>
              <button type="button" onClick={() => handleOAuth('apple')} disabled={busy} className="flex items-center justify-center gap-2.5 rounded-2xl bg-[#141b34] py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 disabled:opacity-50">{oauthLoading === 'apple' ? <Loader2 className="h-5 w-5 animate-spin" /> : <AppleIcon />} Apple</button>
            </div>

            <div className="my-6 flex items-center gap-3"><div className="h-px flex-1 bg-[#141b34]/10" /><span className="text-[11px] font-semibold text-[#9a9daa]">or use your email</span><div className="h-px flex-1 bg-[#141b34]/10" /></div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence initial={false}>
                {!isLogin && <motion.label initial={{ opacity: 0, height: 0, y: -8 }} animate={{ opacity: 1, height: 'auto', y: 0 }} exit={{ opacity: 0, height: 0, y: -8 }} className="block overflow-hidden"><span className="mb-2 block text-xs font-extrabold">Your name</span><span className="relative block"><User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8b8f9d]" /><input type="text" autoComplete="name" placeholder="Aarohi Sharma" value={name} onChange={(event) => setName(event.target.value)} required={!isLogin} className="zen-input" /></span></motion.label>}
              </AnimatePresence>
              <label className="block"><span className="mb-2 block text-xs font-extrabold">Email address</span><span className="relative block"><Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8b8f9d]" /><input type="email" autoComplete="email" placeholder="you@business.com" value={email} onChange={(event) => setEmail(event.target.value)} required className="zen-input" /></span></label>
              <label className="block"><span className="mb-2 flex items-center justify-between text-xs font-extrabold">Password {isLogin && <span className="font-semibold text-[#ff5d3b]">6+ characters</span>}</span><span className="relative block"><Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8b8f9d]" /><input type={showPassword ? 'text' : 'password'} autoComplete={isLogin ? 'current-password' : 'new-password'} placeholder="••••••••" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={6} className="zen-input pr-12" /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8b8f9d]" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></span></label>
              <motion.button whileTap={{ scale: .98 }} type="submit" disabled={busy} className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-[#ff5d3b] py-4 text-sm font-extrabold text-white shadow-[0_14px_30px_rgba(255,93,59,.25)] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_35px_rgba(255,93,59,.32)] disabled:opacity-50">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>{isLogin ? 'Enter my workspace' : 'Create my free account'} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></>}</motion.button>
            </form>
            <p className="mt-6 text-center text-[11px] leading-5 text-[#9a9daa]">By continuing, you agree to Zen POS’s <span className="font-bold text-[#5f6577]">Terms</span> and <span className="font-bold text-[#5f6577]">Privacy Policy</span>.</p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Auth;
