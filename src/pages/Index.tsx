import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight, BadgeCheck, BarChart3, Boxes, ChevronDown, CircleCheck, Cloud,
  CreditCard, Globe2, Heart, IndianRupee, Layers3, MessageCircle, PackageCheck,
  Play, Quote, ReceiptText, ScanBarcode, ShieldCheck, ShoppingBag, Sparkles,
  Star, UsersRound, WandSparkles,
} from 'lucide-react';
import BrandMark from '@/components/marketing/BrandMark';
import { useAuth } from '@/hooks/useAuth';

gsap.registerPlugin(ScrollTrigger);

const shopTypes = ['Grocery', 'Fashion', 'Café', 'Pharmacy', 'Salon', 'Electronics', 'Auto care'];

const features = [
  { icon: ScanBarcode, title: 'Bill at the speed of thought', copy: 'Scan, search or tap. A checkout designed to keep queues moving and customers smiling.', className: 'md:col-span-2 bg-[#141b34] text-white', accent: 'bg-[#ff5d3b] text-white' },
  { icon: Boxes, title: 'Inventory that thinks ahead', copy: 'Live stock, low-stock nudges and product insights without spreadsheet archaeology.', className: 'bg-[#c9f26a] text-[#141b34]', accent: 'bg-[#141b34] text-white' },
  { icon: UsersRound, title: 'Customers, remembered', copy: 'Profiles, credit ledgers, purchase history and loyalty—beautifully connected.', className: 'bg-[#c9b6ff] text-[#141b34]', accent: 'bg-white/70 text-[#5a38c9]' },
  { icon: Globe2, title: 'Your store, online in minutes', copy: 'Publish a polished catalog and share it anywhere. No coding, no design degree.', className: 'md:col-span-2 bg-[#fff4df] text-[#141b34]', accent: 'bg-[#3568f5] text-white' },
];

const steps = [
  { id: '01', title: 'Tell us about your shop', copy: 'Choose a business type and Zen shapes itself around the way you work.', color: '#ff5d3b' },
  { id: '02', title: 'Bring your products', copy: 'Add manually, scan a barcode or start from a ready-made product gallery.', color: '#3568f5' },
  { id: '03', title: 'Make your first sale', copy: 'Bill, print and share—then watch your dashboard come alive in real time.', color: '#90c52d' },
];

const testimonials = [
  { quote: 'The first POS my team understood without training. Billing feels genuinely effortless now.', name: 'Priya Sharma', role: 'Krishna Grocery, Jaipur', initials: 'PS', color: '#ffd84d' },
  { quote: 'I run the counter from my phone and still know exactly what is selling across the whole week.', name: 'Ahmed Khan', role: 'TechZone, Lucknow', initials: 'AK', color: '#c9b6ff' },
  { quote: 'Our repeat customers are up because credit, history and WhatsApp bills finally live together.', name: 'Ritika Mehta', role: 'Sunday Studio, Surat', initials: 'RM', color: '#c9f26a' },
];

const FloatPill = ({ className, children }: { className: string; children: ReactNode }) => (
  <motion.div className={`absolute z-20 flex items-center gap-2 rounded-2xl border border-white/70 bg-white/90 px-3.5 py-2.5 text-xs font-bold text-[#141b34] shadow-[0_18px_50px_rgba(20,27,52,.14)] backdrop-blur-xl ${className}`} animate={{ y: [0, -9, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}>
    {children}
  </motion.div>
);

const SectionTitle = ({ eyebrow, title, copy, align = 'center' }: { eyebrow: string; title: ReactNode; copy?: string; align?: 'center' | 'left' }) => (
  <div className={`reveal ${align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-2xl text-left'}`}>
    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#141b34]/10 bg-white px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#ff5d3b] shadow-sm"><Sparkles className="h-3.5 w-3.5" /> {eyebrow}</div>
    <h2 className="font-display text-[clamp(2.25rem,5vw,4.8rem)] font-extrabold leading-[.96] tracking-[-.065em] text-[#141b34]">{title}</h2>
    {copy && <p className={`mt-5 text-base leading-7 text-[#5f6577] md:text-lg ${align === 'center' ? 'mx-auto max-w-2xl' : 'max-w-xl'}`}>{copy}</p>}
  </div>
);

const Index = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!loading && user) navigate('/', { replace: true });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (reduceMotion) return;
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true, wheelMultiplier: 0.9 });
    let frame = 0;
    const raf = (time: number) => { lenis.raf(time); frame = requestAnimationFrame(raf); };
    frame = requestAnimationFrame(raf);
    lenis.on('scroll', ScrollTrigger.update);
    return () => { cancelAnimationFrame(frame); lenis.destroy(); };
  }, [reduceMotion]);

  useLayoutEffect(() => {
    if (reduceMotion || !rootRef.current) return;
    const context = gsap.context(() => {
      gsap.from('.hero-rise', { y: 44, opacity: 0, duration: 1, stagger: 0.09, ease: 'power4.out' });
      gsap.from('.hero-art', { scale: 0.9, rotate: 3, opacity: 0, duration: 1.3, delay: 0.15, ease: 'power4.out' });
      gsap.utils.toArray<HTMLElement>('.reveal').forEach((element) => gsap.from(element, { y: 45, opacity: 0, duration: 0.85, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 84%', once: true } }));
      gsap.to('.hero-art', { yPercent: 9, ease: 'none', scrollTrigger: { trigger: '.hero-shell', start: 'top top', end: 'bottom top', scrub: 1 } });
      gsap.to('.story-image', { scale: 1.08, ease: 'none', scrollTrigger: { trigger: '.story-wrap', start: 'top bottom', end: 'bottom top', scrub: 1 } });
    }, rootRef);
    return () => context.revert();
  }, [reduceMotion]);

  const goToAuth = () => navigate('/auth');
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });

  return (
    <div ref={rootRef} className="zen-landing min-h-screen overflow-hidden bg-[#fbf8f2] text-[#141b34] selection:bg-[#ff5d3b] selection:text-white">
      <nav className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6 md:pt-5">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between rounded-[22px] border border-white/80 bg-[#fbf8f2]/85 px-4 py-3 shadow-[0_12px_45px_rgba(20,27,52,.07)] backdrop-blur-2xl md:px-6">
          <button onClick={() => scrollTo('top')} aria-label="Go to top"><BrandMark /></button>
          <div className="hidden items-center gap-7 text-sm font-semibold text-[#5f6577] md:flex">
            <button onClick={() => scrollTo('features')} className="transition-colors hover:text-[#141b34]">Features</button>
            <button onClick={() => scrollTo('how')} className="transition-colors hover:text-[#141b34]">How it works</button>
            <button onClick={() => scrollTo('stories')} className="transition-colors hover:text-[#141b34]">Stories</button>
            <button onClick={() => scrollTo('pricing')} className="transition-colors hover:text-[#141b34]">Pricing</button>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={goToAuth} className="hidden rounded-xl px-4 py-2.5 text-sm font-bold transition-colors hover:bg-[#141b34]/5 sm:block">Log in</button>
            <button onClick={goToAuth} className="group flex items-center gap-2 rounded-[14px] bg-[#141b34] px-4 py-2.5 text-sm font-bold text-white shadow-[0_9px_20px_rgba(20,27,52,.18)] transition-transform hover:-translate-y-0.5">Start free <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></button>
          </div>
        </div>
      </nav>

      <main>
        <section id="top" className="hero-shell relative min-h-[920px] overflow-hidden px-4 pb-20 pt-32 md:px-8 md:pt-40 lg:min-h-[850px]">
          <div className="absolute left-[-8rem] top-24 h-80 w-80 rounded-full bg-[#c9b6ff]/35 blur-3xl" />
          <div className="absolute right-[-8rem] top-20 h-96 w-96 rounded-full bg-[#ffd84d]/30 blur-3xl" />
          <div className="relative mx-auto grid max-w-[1240px] items-center gap-12 lg:grid-cols-[.9fr_1.1fr] lg:gap-4">
            <div className="relative z-20 text-center lg:text-left">
              <div className="hero-rise mb-6 inline-flex items-center gap-2 rounded-full border border-[#141b34]/10 bg-white px-3 py-2 text-xs font-extrabold shadow-sm"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#c9f26a]"><WandSparkles className="h-3.5 w-3.5" /></span>India’s delightfully simple POS</div>
              <h1 className="hero-rise font-display text-[clamp(3.6rem,7.3vw,7.5rem)] font-black leading-[.82] tracking-[-.085em]">Sell more.<br /><span className="relative inline-block text-[#ff5d3b]">Stress less.<svg className="absolute -bottom-4 left-2 w-[95%]" viewBox="0 0 430 22" fill="none" aria-hidden="true"><path d="M4 15C120 2 288 2 426 9" stroke="#3568F5" strokeWidth="9" strokeLinecap="round" /></svg></span></h1>
              <p className="hero-rise mx-auto mt-9 max-w-xl text-base leading-7 text-[#5f6577] md:text-lg lg:mx-0">Billing, inventory, customers and your online store—together in one joyful workspace built for ambitious Indian businesses.</p>
              <div className="hero-rise mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <button onClick={goToAuth} className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-[#ff5d3b] px-6 py-4 text-sm font-extrabold text-white shadow-[0_14px_30px_rgba(255,93,59,.28)] transition-all hover:-translate-y-1 sm:w-auto">Build my free store <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></button>
                <button onClick={() => scrollTo('product')} className="group flex w-full items-center justify-center gap-2 rounded-2xl border border-[#141b34]/10 bg-white px-6 py-4 text-sm font-extrabold shadow-sm transition-all hover:-translate-y-1 sm:w-auto"><span className="grid h-7 w-7 place-items-center rounded-full bg-[#ffd84d]"><Play className="ml-0.5 h-3.5 w-3.5 fill-current" /></span> See it in action</button>
              </div>
              <div className="hero-rise mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-semibold text-[#74798a] lg:justify-start"><span className="flex items-center gap-1.5"><CircleCheck className="h-4 w-4 text-[#63a515]" /> No credit card</span><span className="flex items-center gap-1.5"><CircleCheck className="h-4 w-4 text-[#63a515]" /> Set up in 3 minutes</span></div>
            </div>
            <div className="hero-art relative mx-auto w-full max-w-[760px] pt-3 lg:translate-x-8">
              <div className="absolute inset-6 rounded-[46%] bg-gradient-to-br from-[#c9b6ff]/50 via-[#ffd84d]/25 to-[#c9f26a]/40 blur-2xl" />
              <div className="relative overflow-hidden rounded-[32px] border-[7px] border-white bg-white shadow-[0_35px_100px_rgba(20,27,52,.16)] md:rounded-[44px]"><img src="/images/zen-pos-hero.webp" alt="Colorful Zen POS dashboard, payment terminal and receipt printer" className="aspect-[16/10] h-full w-full object-cover" fetchPriority="high" /></div>
              <FloatPill className="-left-2 top-[20%] md:-left-8"><span className="grid h-8 w-8 place-items-center rounded-xl bg-[#c9f26a]"><IndianRupee className="h-4 w-4" /></span> +28% this week</FloatPill>
              <FloatPill className="-bottom-5 right-4 md:right-12"><span className="grid h-8 w-8 place-items-center rounded-xl bg-[#c9b6ff]"><BadgeCheck className="h-4 w-4" /></span> Stock synced</FloatPill>
              <div className="absolute -right-3 -top-5 grid h-20 w-20 rotate-12 place-items-center rounded-[26px] bg-[#3568f5] text-white shadow-xl md:-right-8 md:h-24 md:w-24"><ReceiptText className="h-9 w-9" /></div>
            </div>
          </div>
          <button onClick={() => scrollTo('proof')} className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] font-bold uppercase tracking-[.2em] text-[#74798a] lg:flex">Scroll to discover <ChevronDown className="h-4 w-4 animate-bounce" /></button>
        </section>

        <section id="proof" className="border-y border-[#141b34]/8 bg-white py-7">
          <div className="mx-auto flex max-w-[1240px] flex-col items-center justify-between gap-6 px-5 lg:flex-row">
            <div className="flex items-center gap-4"><div className="flex -space-x-2">{['RK', 'PM', 'AS', 'NK'].map((name, index) => <span key={name} className="grid h-9 w-9 place-items-center rounded-full border-2 border-white text-[10px] font-extrabold" style={{ background: ['#ffd84d', '#c9b6ff', '#c9f26a', '#ff927a'][index] }}>{name}</span>)}</div><div><div className="flex text-[#ffb400]">{Array.from({ length: 5 }).map((_, index) => <Star key={index} className="h-3.5 w-3.5 fill-current" />)}</div><p className="mt-1 text-xs font-bold text-[#5f6577]">Loved by modern shop owners</p></div></div>
            <div className="flex flex-wrap items-center justify-center gap-3">{shopTypes.map((type) => <span key={type} className="rounded-full bg-[#f5f1ea] px-3.5 py-2 text-xs font-bold text-[#5f6577]">{type}</span>)}</div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#141b34] py-4 text-white">
          <motion.div
            className="flex w-max items-center gap-3"
            animate={reduceMotion ? undefined : { x: ['0%', '-50%'] }}
            transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
          >
            {[...shopTypes, ...shopTypes, ...shopTypes, ...shopTypes].map((type, index) => (
              <div key={`${type}-${index}`} className="flex items-center gap-3 whitespace-nowrap px-4 font-display text-sm font-extrabold uppercase tracking-[.12em] text-white/75">
                <span className={`h-2.5 w-2.5 rounded-full ${index % 4 === 0 ? 'bg-[#ff5d3b]' : index % 4 === 1 ? 'bg-[#c9f26a]' : index % 4 === 2 ? 'bg-[#c9b6ff]' : 'bg-[#ffd84d]'}`} />
                Made for {type}
              </div>
            ))}
          </motion.div>
        </section>

        <section id="features" className="px-4 py-24 md:px-8 md:py-32">
          <div className="mx-auto max-w-[1240px]">
            <SectionTitle eyebrow="One home for your business" title={<>Serious tools.<br /><span className="text-[#3568f5]">Zero boring bits.</span></>} copy="Every essential is thoughtfully connected, so your day feels lighter and your decisions get sharper." />
            <div className="mt-14 grid gap-4 md:grid-cols-3">
              {features.map((feature, index) => { const Icon = feature.icon; return <motion.article key={feature.title} whileHover={reduceMotion ? undefined : { y: -7, rotate: index % 2 ? -0.5 : 0.5 }} className={`reveal relative min-h-[300px] overflow-hidden rounded-[32px] p-7 md:p-9 ${feature.className}`}><div className={`mb-12 grid h-14 w-14 place-items-center rounded-[20px] shadow-sm ${feature.accent}`}><Icon className="h-6 w-6" /></div><h3 className="max-w-md font-display text-3xl font-extrabold leading-[1] tracking-[-.05em]">{feature.title}</h3><p className={`mt-4 max-w-lg text-sm leading-6 ${index === 0 ? 'text-white/65' : 'text-[#141b34]/65'}`}>{feature.copy}</p>{index === 0 && <div className="absolute -bottom-12 -right-8 h-44 w-44 rounded-full border-[28px] border-[#3568f5] opacity-80" />}{index === 2 && <Heart className="absolute right-7 top-7 h-20 w-20 fill-white/20 text-white/20" />}{index === 3 && <div className="absolute bottom-7 right-7 flex items-end gap-2">{[36, 58, 84].map((height, item) => <span key={height} className="w-5 rounded-t-lg bg-[#ff5d3b]" style={{ height, opacity: .55 + item * .18 }} />)}</div>}</motion.article>; })}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-gradient-to-b from-[#efe9ff] via-[#e8f1ff] to-[#fbf8f2] px-4 py-24 md:px-8 md:py-32">
          <div className="absolute left-[-8rem] top-[-7rem] h-80 w-80 rounded-full bg-[#ff8b72]/30 blur-3xl" />
          <div className="absolute bottom-[-9rem] right-[-5rem] h-96 w-96 rounded-full bg-[#c9f26a]/35 blur-3xl" />
          <div className="relative mx-auto max-w-[1240px]">
            <SectionTitle eyebrow="A more human workspace" title={<>Tools with personality.<br /><span className="text-[#7050db]">Power without the grey.</span></>} copy="Playful on the surface, serious underneath. Every interaction is tuned to feel quick, clear and surprisingly satisfying." />
            <div className="mt-14 grid gap-5 lg:grid-cols-3">
              {[
                { image: '/images/clay-pos-terminal.png', title: 'Checkout, reimagined', copy: 'Tap, scan, print and share without breaking your flow.', color: 'from-[#ff7659] to-[#ffb04e]', tag: 'SELL' },
                { image: '/images/clay-retail-categories.png', title: 'Made for your kind of shop', copy: 'A tailored setup for groceries, fashion, cafés, salons and more.', color: 'from-[#7358dd] to-[#b59cff]', tag: 'ADAPT' },
                { image: '/images/clay-analytics-icons.png', title: 'Clarity at a glance', copy: 'The numbers that matter, surfaced before you need to ask.', color: 'from-[#2458dd] to-[#62a4ff]', tag: 'GROW' },
              ].map((item, index) => (
                <motion.article
                  key={item.title}
                  whileHover={reduceMotion ? undefined : { y: -10, rotate: index === 1 ? 0 : index === 0 ? -1 : 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                  className={`reveal group relative min-h-[520px] overflow-hidden rounded-[38px] bg-gradient-to-br ${item.color} p-5 shadow-[0_24px_60px_rgba(34,37,68,.14)]`}
                >
                  <div className="absolute inset-x-4 top-4 flex items-center justify-between rounded-2xl border border-white/30 bg-white/15 px-4 py-3 text-white backdrop-blur-xl">
                    <span className="text-[10px] font-black tracking-[.22em]">{item.tag}</span>
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <motion.img
                    src={item.image}
                    alt=""
                    loading="lazy"
                    className="absolute inset-x-[-14%] top-12 h-[66%] w-[128%] object-contain drop-shadow-[0_28px_34px_rgba(18,21,45,.28)]"
                    animate={reduceMotion ? undefined : { y: [0, -10, 0], rotate: index === 1 ? [0, 1, 0] : [0, -1, 0] }}
                    transition={{ duration: 5 + index, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <div className="absolute inset-x-4 bottom-4 rounded-[27px] border border-white/60 bg-white/85 p-6 text-[#141b34] shadow-xl backdrop-blur-2xl">
                    <h3 className="font-display text-2xl font-black tracking-[-.045em]">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#5f6577]">{item.copy}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="product" className="bg-[#141b34] px-4 py-24 text-white md:px-8 md:py-32">
          <div className="mx-auto grid max-w-[1240px] items-center gap-14 lg:grid-cols-[.86fr_1.14fr]">
            <div><div className="reveal inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[.15em] text-[#c9f26a]"><Sparkles className="h-3.5 w-3.5" /> Live business cockpit</div><h2 className="reveal mt-5 font-display text-[clamp(2.8rem,5vw,5.3rem)] font-black leading-[.92] tracking-[-.07em]">Know what’s happening. <span className="text-[#c9f26a]">Right now.</span></h2><p className="reveal mt-6 max-w-lg text-base leading-7 text-white/60">Sales, stock and customer activity become one calm, clear view—on your phone, tablet or desktop.</p>
              <div className="mt-9 grid gap-3 sm:grid-cols-2">{([['Live revenue', BarChart3], ['Smart stock alerts', PackageCheck], ['Cloud backup', Cloud], ['Role-based access', ShieldCheck]] as const).map(([label, Icon]) => <div key={label} className="reveal flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.06] p-4 text-sm font-bold"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#3568f5]"><Icon className="h-4 w-4" /></span>{label}</div>)}</div>
            </div>
            <div className="reveal relative min-h-[500px]"><div className="absolute -inset-5 rounded-[46px] bg-gradient-to-br from-[#3568f5]/35 via-[#c9b6ff]/15 to-[#c9f26a]/25 blur-2xl" /><div className="absolute inset-0 overflow-hidden rounded-[34px] border border-white/15 bg-gradient-to-br from-white/[.09] to-white/[.02] shadow-2xl"><div className="absolute inset-8 rounded-full bg-[#3568f5]/25 blur-3xl" /><motion.img src="/images/clay-analytics-icons.png" alt="Floating clay analytics, customer, barcode and cloud icons" className="absolute inset-x-[-7%] top-[-2%] h-[88%] w-[114%] object-contain drop-shadow-[0_28px_42px_rgba(0,0,0,.35)]" animate={reduceMotion ? undefined : { y: [0, -12, 0], rotate: [0, 1, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} /><div className="absolute bottom-6 left-6 right-6 flex items-center justify-between rounded-2xl border border-white/60 bg-white/90 p-4 text-[#141b34] shadow-xl backdrop-blur-xl"><div><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#74798a]">Today’s sales</p><p className="mt-1 font-display text-2xl font-black tracking-tight">₹48,240</p></div><div className="rounded-xl bg-[#c9f26a] px-3 py-2 text-xs font-extrabold">↗ 18.4%</div></div></div></div>
          </div>
        </section>

        <section id="stories" className="story-wrap px-4 py-24 md:px-8 md:py-32">
          <div className="mx-auto grid max-w-[1240px] items-center gap-14 lg:grid-cols-2">
            <div className="reveal relative min-h-[560px] overflow-hidden rounded-[40px] bg-[#ffd84d]"><img src="/images/retail-founder.webp" alt="Indian shop owner smiling while using a point of sale tablet" className="story-image absolute inset-0 h-full w-full object-cover" loading="lazy" /><div className="absolute inset-x-5 bottom-5 rounded-[25px] border border-white/50 bg-[#141b34]/88 p-5 text-white backdrop-blur-xl md:inset-x-8 md:bottom-8 md:p-6"><Quote className="h-7 w-7 fill-[#ffd84d] text-[#ffd84d]" /><p className="mt-3 font-display text-xl font-bold leading-tight md:text-2xl">“Now I close the shop on time—and still know every number.”</p><p className="mt-3 text-xs font-semibold text-white/60">Aarohi · The Good Basket, Bengaluru</p></div></div>
            <div><SectionTitle align="left" eyebrow="Built for real shop days" title={<>Less admin.<br /><span className="text-[#ff5d3b]">More ambition.</span></>} copy="Zen takes care of the repetitive work, so you can focus on the people, products and ideas that make your store yours." /><div className="mt-9 space-y-3">{([['One tap to share every bill', MessageCircle, '#c9f26a'], ['Works beautifully on mobile', CreditCard, '#c9b6ff'], ['Your own online storefront', ShoppingBag, '#ffd84d']] as const).map(([label, Icon, color]) => <div key={label} className="reveal flex items-center gap-4 rounded-2xl border border-[#141b34]/8 bg-white p-4 shadow-sm"><span className="grid h-11 w-11 place-items-center rounded-[15px]" style={{ background: color }}><Icon className="h-5 w-5" /></span><span className="font-display text-base font-extrabold">{label}</span></div>)}</div></div>
          </div>
        </section>

        <section id="how" className="bg-[#efe9ff] px-4 py-24 md:px-8 md:py-32"><div className="mx-auto max-w-[1240px]"><SectionTitle eyebrow="Up and selling, quickly" title={<>Three little steps.<br /><span className="text-[#7050db]">One big upgrade.</span></>} /><div className="mt-14 grid gap-4 md:grid-cols-3">{steps.map((step) => <div key={step.id} className="reveal rounded-[30px] border border-white/80 bg-white/70 p-7 shadow-[0_20px_50px_rgba(75,49,135,.08)] backdrop-blur-lg md:p-8"><div className="font-display text-6xl font-black tracking-[-.08em]" style={{ color: step.color }}>{step.id}</div><h3 className="mt-10 font-display text-2xl font-extrabold leading-tight tracking-[-.04em]">{step.title}</h3><p className="mt-3 text-sm leading-6 text-[#5f6577]">{step.copy}</p></div>)}</div></div></section>

        <section className="px-4 py-24 md:px-8 md:py-32"><div className="mx-auto max-w-[1240px]"><SectionTitle eyebrow="Shop-owner approved" title={<>Big love from<br /><span className="text-[#ff5d3b]">small businesses.</span></>} /><div className="mt-14 grid gap-4 lg:grid-cols-3">{testimonials.map((item, index) => <motion.article key={item.name} whileHover={reduceMotion ? undefined : { y: -8 }} className={`reveal rounded-[30px] p-7 md:p-8 ${index === 1 ? 'bg-[#141b34] text-white' : 'border border-[#141b34]/8 bg-white'}`}><div className="flex gap-1 text-[#ffb400]">{Array.from({ length: 5 }).map((_, star) => <Star key={star} className="h-4 w-4 fill-current" />)}</div><p className="mt-8 font-display text-2xl font-bold leading-[1.18] tracking-[-.035em]">“{item.quote}”</p><div className="mt-9 flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-full text-xs font-black text-[#141b34]" style={{ background: item.color }}>{item.initials}</span><div><p className="text-sm font-extrabold">{item.name}</p><p className={`mt-0.5 text-xs ${index === 1 ? 'text-white/50' : 'text-[#74798a]'}`}>{item.role}</p></div></div></motion.article>)}</div></div></section>

        <section id="pricing" className="px-4 pb-8 md:px-8 md:pb-12"><div className="reveal relative mx-auto max-w-[1240px] overflow-hidden rounded-[40px] bg-[#ff5d3b] px-6 py-16 text-center text-white md:px-16 md:py-24"><div className="absolute -left-16 -top-20 h-56 w-56 rounded-full border-[38px] border-[#ffd84d]/80" /><div className="absolute -bottom-24 -right-14 h-64 w-64 rounded-full bg-[#3568f5]" /><Layers3 className="absolute right-[13%] top-12 h-16 w-16 rotate-12 text-[#ffd84d] opacity-90" /><div className="relative z-10 mx-auto max-w-3xl"><p className="text-xs font-extrabold uppercase tracking-[.2em] text-white/70">₹0 to get started · no card needed</p><h2 className="mt-5 font-display text-[clamp(2.8rem,6vw,6rem)] font-black leading-[.88] tracking-[-.075em]">Your best business day starts here.</h2><p className="mx-auto mt-6 max-w-xl text-base leading-7 text-white/75">Join the new generation of Indian shop owners running smarter, calmer, more delightful businesses.</p><button onClick={goToAuth} className="group mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-4 text-sm font-extrabold text-[#141b34] shadow-xl transition-transform hover:-translate-y-1">Start selling free <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></button></div></div></section>
      </main>

      <footer className="px-5 py-10 md:px-8"><div className="mx-auto flex max-w-[1240px] flex-col items-center justify-between gap-6 border-t border-[#141b34]/10 pt-8 md:flex-row"><BrandMark /><p className="text-center text-xs leading-5 text-[#74798a]">Made with care for India’s boldest small businesses.<br />© 2026 Zen POS. All rights reserved.</p><div className="flex items-center gap-5 text-xs font-bold text-[#5f6577]"><button onClick={() => scrollTo('features')}>Product</button><button onClick={goToAuth}>Login</button><button onClick={() => scrollTo('pricing')}>Pricing</button></div></div></footer>
    </div>
  );
};

export default Index;
