import { type ReactNode, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Activity, BarChart3, Bell, ChevronLeft, ChevronRight, CreditCard, LogOut, Mail, Menu, Package, Palette, Settings, Shield, Sparkles, Store, Users, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const NAV_ITEMS = [
  { path: '/admin', icon: BarChart3, label: 'Overview', color: '#c9f26a' }, { path: '/admin/gallery', icon: Package, label: 'Gallery', color: '#ffd84d' },
  { path: '/admin/stores', icon: Store, label: 'Stores', color: '#ff795c' }, { path: '/admin/users', icon: Users, label: 'Users', color: '#8ba7ff' },
  { path: '/admin/themes', icon: Palette, label: 'Themes', color: '#c9b6ff' }, { path: '/admin/smtp', icon: Mail, label: 'Auth & SMTP', color: '#6ee7cb' },
  { path: '/admin/alerts', icon: Bell, label: 'Alerts', color: '#ff9ec9' }, { path: '/admin/features', icon: Settings, label: 'Features', color: '#8ba7ff' },
  { path: '/admin/analytics', icon: Activity, label: 'Analytics', color: '#c9f26a' }, { path: '/admin/subscriptions', icon: CreditCard, label: 'Plans', color: '#ffd84d' },
];

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate(); const location = useLocation(); const { signOut } = useAuth();
  const [collapsed, setCollapsed] = useState(false); const [mobileOpen, setMobileOpen] = useState(false);
  const isActive = (path: string) => path === '/admin' ? location.pathname === path : location.pathname.startsWith(path);
  const sidebar = <div className="flex h-full flex-col">
    <div className="flex items-center gap-3 px-4 pb-6 pt-5"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#ff6847] text-white shadow-[0_10px_28px_rgba(255,104,71,.3)]"><Shield className="h-5 w-5" /></div>{!collapsed && <div><p className="font-display text-lg font-black tracking-[-.04em] text-white">Zen Control</p><p className="text-[10px] font-bold uppercase tracking-[.15em] text-white/40">Super admin</p></div>}</div>
    {!collapsed && <div className="mx-3 mb-5 rounded-2xl border border-white/10 bg-white/[.06] p-3"><div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[.16em] text-[#c9f26a]"><Sparkles className="h-3.5 w-3.5" /> Live command centre</div><p className="mt-2 text-xs leading-5 text-white/45">Everything healthy. Stores are syncing in real time.</p></div>}
    <nav className="flex-1 space-y-1 overflow-y-auto px-2.5">{NAV_ITEMS.map((item) => { const Icon = item.icon; const active = isActive(item.path); return <button key={item.path} title={collapsed ? item.label : undefined} onClick={() => { navigate(item.path); setMobileOpen(false); }} className={`group flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold transition-all ${active ? 'bg-white text-[#141b34] shadow-xl' : 'text-white/55 hover:bg-white/[.07] hover:text-white'}`}><span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl transition-transform group-hover:scale-105" style={{ backgroundColor: active ? item.color : 'rgba(255,255,255,.07)' }}><Icon className="h-4 w-4" /></span>{!collapsed && <span>{item.label}</span>}{active && !collapsed && <span className="ml-auto h-2 w-2 rounded-full bg-[#ff6847]" />}</button>; })}</nav>
    <div className="m-2.5 space-y-1 border-t border-white/10 pt-3"><button onClick={() => navigate('/dashboard')} className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold text-white/55 transition hover:bg-white/[.07] hover:text-white"><ChevronLeft className="h-4 w-4" />{!collapsed && 'Back to app'}</button><button onClick={signOut} className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold text-[#ff947e] transition hover:bg-[#ff6847]/10"><LogOut className="h-4 w-4" />{!collapsed && 'Log out'}</button></div>
  </div>;
  return <div className="zen-admin-shell relative flex min-h-screen overflow-hidden bg-[#f4f2ed]">
    <div className="pointer-events-none fixed -right-24 -top-24 h-96 w-96 rounded-full bg-[#c9b6ff]/25 blur-3xl" />
    <aside className={`sticky top-0 hidden h-screen shrink-0 bg-[#141b34] transition-[width] duration-300 lg:block ${collapsed ? 'w-[84px]' : 'w-[268px]'}`}>{sidebar}<button onClick={() => setCollapsed((value) => !value)} className="absolute -right-3 top-20 grid h-7 w-7 place-items-center rounded-full border-4 border-[#f4f2ed] bg-[#ffd84d] text-[#141b34] shadow-md" aria-label="Toggle navigation">{collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}</button></aside>
    <div className="relative flex min-w-0 flex-1 flex-col"><header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#141b34]/5 bg-[#f4f2ed]/80 px-4 py-3 backdrop-blur-2xl lg:hidden"><button onClick={() => setMobileOpen(true)} className="grid h-10 w-10 place-items-center rounded-2xl bg-[#141b34] text-white"><Menu className="h-5 w-5" /></button><span className="font-display font-black">Zen Control</span><span className="h-2.5 w-2.5 rounded-full bg-[#82c91e] shadow-[0_0_0_5px_rgba(130,201,30,.15)]" /></header>
      <AnimatePresence>{mobileOpen && <motion.div className="fixed inset-0 z-50 flex lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><motion.aside initial={{ x: -290 }} animate={{ x: 0 }} exit={{ x: -290 }} transition={{ type: 'spring', damping: 28, stiffness: 280 }} className="relative w-[280px] bg-[#141b34]"><button onClick={() => setMobileOpen(false)} className="absolute right-4 top-5 z-10 text-white/60"><X className="h-5 w-5" /></button>{sidebar}</motion.aside><button aria-label="Close menu" onClick={() => setMobileOpen(false)} className="flex-1 bg-[#141b34]/55 backdrop-blur-sm" /></motion.div>}</AnimatePresence><main className="relative flex-1 overflow-x-hidden">{children}</main></div>
  </div>;
};
export default AdminLayout;
