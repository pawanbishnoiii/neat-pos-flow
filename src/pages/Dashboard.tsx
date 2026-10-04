import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import dayjs from 'dayjs';
import {
  ArrowUpRight, Boxes, CreditCard, IndianRupee, LogOut, MessageSquareHeart,
  PackageCheck, ReceiptText, ScanLine, Shield, Sparkles, Tags, TrendingDown,
  TrendingUp, UsersRound, WalletCards,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useBusiness } from '@/hooks/useBusiness';
import { supabase } from '@/integrations/supabase/client';
import NotificationBell from '@/components/notifications/NotificationBell';

type Stats = { todaySales: number; monthlySales: number; totalProducts: number; lowStock: number; totalCustomers: number; totalInvoices: number; activeOffers: number };

const Dashboard = () => {
  const { signOut, isAdmin } = useAuth();
  const { business } = useBusiness();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [stats, setStats] = useState<Stats>({ todaySales: 0, monthlySales: 0, totalProducts: 0, lowStock: 0, totalCustomers: 0, totalInvoices: 0, activeOffers: 0 });
  const [revenue, setRevenue] = useState<{ name: string; revenue: number }[]>([]);

  useEffect(() => {
    if (!business) return;
    const load = async () => {
      const today = dayjs().startOf('day').toISOString();
      const monthStart = dayjs().startOf('month').toISOString();
      const [todayInv, monthInv, products, customers, invoices, offers] = await Promise.all([
        supabase.from('invoices').select('grand_total').eq('business_id', business.id).gte('created_at', today),
        supabase.from('invoices').select('grand_total').eq('business_id', business.id).gte('created_at', monthStart),
        supabase.from('products').select('id, stock').eq('business_id', business.id),
        supabase.from('customers').select('id', { count: 'exact', head: true }).eq('business_id', business.id),
        supabase.from('invoices').select('id', { count: 'exact', head: true }).eq('business_id', business.id),
        supabase.from('business_offers').select('id', { count: 'exact', head: true }).eq('business_id', business.id).eq('is_active', true),
      ]);
      setStats({
        todaySales: (todayInv.data || []).reduce((sum, item) => sum + Number(item.grand_total), 0),
        monthlySales: (monthInv.data || []).reduce((sum, item) => sum + Number(item.grand_total), 0),
        totalProducts: products.data?.length || 0,
        lowStock: (products.data || []).filter((item) => item.stock < 20).length,
        totalCustomers: customers.count || 0,
        totalInvoices: invoices.count || 0,
        activeOffers: offers.count || 0,
      });
      const points = await Promise.all(Array.from({ length: 7 }, async (_, index) => {
        const date = dayjs().subtract(6 - index, 'day');
        const { data } = await supabase.from('invoices').select('grand_total').eq('business_id', business.id).gte('created_at', date.startOf('day').toISOString()).lte('created_at', date.endOf('day').toISOString());
        return { name: date.format('ddd'), revenue: (data || []).reduce((sum, item) => sum + Number(item.grand_total), 0) };
      }));
      setRevenue(points);
    };
    void load();
  }, [business]);

  const modules = [
    { path: '/offers', label: 'Offers', sub: 'ऑफ़र और कूपन', value: stats.activeOffers, icon: Tags, color: 'bg-[#ff8d72]' },
    { path: '/customers', label: 'Customers', sub: 'ग्राहक', value: stats.totalCustomers, icon: UsersRound, color: 'bg-[#c9f26a]' },
    { path: '/history', label: 'Bill History', sub: 'बिल इतिहास', value: stats.totalInvoices, icon: ReceiptText, color: 'bg-[#ffd84d]' },
    { path: '/expenses', label: 'Expenses', sub: 'खर्चे', value: 'Track', icon: TrendingDown, color: 'bg-[#c9b6ff]' },
    { path: '/credit-ledger', label: 'Credit', sub: 'उधार खाता', value: 'Open', icon: CreditCard, color: 'bg-[#79b8ff]' },
    { path: '/reviews', label: 'Reviews', sub: 'रिव्यू', value: 'View', icon: MessageSquareHeart, color: 'bg-[#ffb4ca]' },
  ];
  const cards = [
    { label: 'Today', value: `₹${stats.todaySales.toLocaleString()}`, icon: IndianRupee, color: 'bg-[#141b34] text-white', note: 'Live sales' },
    { label: 'This month', value: `₹${stats.monthlySales.toLocaleString()}`, icon: TrendingUp, color: 'bg-[#c9f26a]', note: 'Revenue' },
    { label: 'Products', value: stats.totalProducts.toString(), icon: Boxes, color: 'bg-[#c9b6ff]', note: `${stats.lowStock} low stock` },
    { label: 'Invoices', value: stats.totalInvoices.toString(), icon: ReceiptText, color: 'bg-[#ffd84d]', note: 'All time' },
  ];

  return (
    <div className="mx-auto max-w-[1380px] space-y-5 px-4 pt-4 pb-24 lg:pl-24">
      <header className="flex items-center justify-between rounded-[24px] border border-white/70 bg-white/68 p-3 shadow-[0_12px_38px_rgba(20,27,52,.06)] backdrop-blur-2xl md:p-4">
        <div><p className="text-[10px] font-black uppercase tracking-[.17em] text-[#ff5d3b]">{dayjs().format('dddd · D MMMM')}</p><h1 className="font-display text-xl font-black tracking-[-.045em] md:text-2xl">{business?.business_name || 'Your business'}</h1></div>
        <div className="flex items-center gap-2"><NotificationBell />{isAdmin && <button onClick={() => navigate('/admin')} className="grid h-10 w-10 place-items-center rounded-[14px] bg-[#c9b6ff]"><Shield className="h-4 w-4" /></button>}<button onClick={signOut} className="grid h-10 w-10 place-items-center rounded-[14px] bg-[#141b34] text-white"><LogOut className="h-4 w-4" /></button></div>
      </header>

      <section className="relative min-h-[380px] overflow-hidden rounded-[36px] bg-gradient-to-br from-[#ff6848] via-[#ff7f5e] to-[#ffad63] p-7 text-white shadow-[0_26px_65px_rgba(255,93,59,.22)] md:p-10 lg:min-h-[420px]">
        <div className="relative z-10 max-w-xl"><span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3 py-2 text-[10px] font-black uppercase tracking-[.17em] backdrop-blur-xl"><Sparkles className="h-3.5 w-3.5" /> Business pulse</span><h2 className="mt-6 font-display text-[clamp(3rem,6vw,6.2rem)] font-black leading-[.82] tracking-[-.08em]">Make today<br />count.</h2><p className="mt-6 max-w-md text-sm leading-6 text-white/75">Sales, stock, customers and every important module—one joyful command center.</p><div className="mt-8 flex flex-wrap gap-3"><button onClick={() => navigate('/billing')} className="flex items-center gap-2 rounded-2xl bg-[#141b34] px-5 py-4 text-sm font-extrabold shadow-xl"><ScanLine className="h-4 w-4 text-[#c9f26a]" /> Start a bill</button><button onClick={() => navigate('/workspace')} className="flex items-center gap-2 rounded-2xl border border-white/50 bg-white/20 px-5 py-4 text-sm font-extrabold backdrop-blur-xl"><PackageCheck className="h-4 w-4" /> Manage stock</button></div></div>
        <motion.img src="/images/dashboard-clay.png" alt="Colorful retail analytics dashboard" className="absolute -bottom-[8%] -right-[14%] w-[76%] max-w-[820px] drop-shadow-[0_32px_45px_rgba(20,27,52,.28)] md:-right-[8%] md:w-[64%]" animate={reduceMotion ? undefined : { y: [0, -13, 0], rotate: [0, 1, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} />
      </section>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">{cards.map((card, index) => { const Icon = card.icon; return <motion.article key={card.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .05 }} whileHover={{ y: -5 }} className={`rounded-[27px] p-5 shadow-[0_14px_38px_rgba(20,27,52,.07)] ${card.color}`}><div className="flex items-start justify-between"><p className="text-[10px] font-black uppercase tracking-[.13em] opacity-60">{card.label}</p><Icon className="h-5 w-5 opacity-70" /></div><p className="mt-7 font-display text-3xl font-black tracking-[-.055em] md:text-4xl">{card.value}</p><p className="mt-1 text-[11px] font-bold opacity-55">{card.note}</p></motion.article>; })}</section>

      <section className="grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
        <div className="rounded-[32px] border border-white/80 bg-white/72 p-5 shadow-[0_18px_48px_rgba(20,27,52,.07)] backdrop-blur-2xl md:p-7"><div className="flex items-center justify-between"><div><p className="text-[10px] font-black uppercase tracking-[.16em] text-[#7050db]">7-day movement</p><h3 className="mt-1 font-display text-2xl font-black tracking-[-.045em]">Revenue rhythm</h3></div><span className="grid h-11 w-11 place-items-center rounded-[16px] bg-[#c9b6ff]"><WalletCards className="h-5 w-5" /></span></div><div className="mt-5 h-64"><ResponsiveContainer width="100%" height="100%"><AreaChart data={revenue}><defs><linearGradient id="dash-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ff5d3b" stopOpacity=".38" /><stop offset="1" stopColor="#ff5d3b" stopOpacity="0" /></linearGradient></defs><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#8b8f9d' }} /><Tooltip contentStyle={{ border: 0, borderRadius: 16, boxShadow: '0 16px 40px rgba(20,27,52,.14)' }} /><Area type="monotone" dataKey="revenue" stroke="#ff5d3b" strokeWidth={4} fill="url(#dash-fill)" /></AreaChart></ResponsiveContainer></div></div>
        <div className="relative min-h-[330px] overflow-hidden rounded-[32px] bg-[#141b34] text-white"><img src="/images/shop-team.webp" alt="Indian retail team managing inventory" className="absolute inset-0 h-full w-full object-cover opacity-55" /><div className="absolute inset-0 bg-gradient-to-t from-[#141b34] via-[#141b34]/25 to-transparent" /><div className="absolute inset-x-6 bottom-6"><p className="text-[10px] font-black uppercase tracking-[.16em] text-[#c9f26a]">Built for teams</p><h3 className="mt-2 font-display text-3xl font-black leading-[.95] tracking-[-.05em]">Clear for everyone at the counter.</h3></div></div>
      </section>

      <section><div className="mb-4 flex items-end justify-between"><div><p className="text-[10px] font-black uppercase tracking-[.16em] text-[#ff5d3b]">Daily tools</p><h3 className="mt-1 font-display text-3xl font-black tracking-[-.05em]">Important modules</h3></div><button onClick={() => navigate('/modules')} className="flex items-center gap-1 text-xs font-extrabold">View all <ArrowUpRight className="h-4 w-4" /></button></div><div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">{modules.map((item, index) => { const Icon = item.icon; return <motion.button key={item.path} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .04 }} whileHover={{ y: -6 }} onClick={() => navigate(item.path)} className="rounded-[25px] border border-white/80 bg-white/72 p-4 text-left shadow-[0_12px_34px_rgba(20,27,52,.06)] backdrop-blur-xl"><span className={`grid h-11 w-11 place-items-center rounded-[16px] ${item.color}`}><Icon className="h-5 w-5" /></span><p className="mt-5 font-display text-base font-black tracking-[-.03em]">{item.label}</p><p className="mt-0.5 text-[10px] font-bold text-[#8b8f9d]">{item.sub}</p><p className="mt-4 text-xs font-black text-[#ff5d3b]">{item.value}</p></motion.button>; })}</div></section>
    </div>
  );
};
export default Dashboard;
