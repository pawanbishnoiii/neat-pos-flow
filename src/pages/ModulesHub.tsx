import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Clock3, CreditCard, MessageSquareHeart, ReceiptText, Sparkles, Tags, TrendingDown, UsersRound } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';

const modules = [
  { path: '/offers', icon: Tags, title: 'Offers & Coupons', hindi: 'ऑफ़र और कूपन', copy: 'Create discounts that bring customers back.', color: 'bg-[#ff8d72]' },
  { path: '/customers', icon: UsersRound, title: 'Customers', hindi: 'ग्राहक', copy: 'CRM, visits, spending and contact history.', color: 'bg-[#c9f26a]' },
  { path: '/history', icon: ReceiptText, title: 'Bill History', hindi: 'बिल इतिहास', copy: 'Find, open and share every past invoice.', color: 'bg-[#ffd84d]' },
  { path: '/expenses', icon: TrendingDown, title: 'Expenses', hindi: 'खर्चे', copy: 'Know where every rupee in the business goes.', color: 'bg-[#c9b6ff]' },
  { path: '/credit-ledger', icon: CreditCard, title: 'Credit Ledger', hindi: 'उधार खाता', copy: 'Track udhar, payments and running balances.', color: 'bg-[#79b8ff]' },
  { path: '/reviews', icon: MessageSquareHeart, title: 'Reviews', hindi: 'रिव्यू', copy: 'Approve feedback and protect your reputation.', color: 'bg-[#ffb4ca]' },
];

const ModulesHub = () => {
  const navigate = useNavigate();
  return (
    <div className="mx-auto max-w-6xl space-y-5 px-4 pt-4 pb-24 lg:pl-24">
      <PageHeader title="Business Modules" backTo="/dashboard" />
      <section className="relative overflow-hidden rounded-[34px] bg-[#141b34] p-7 text-white shadow-[0_22px_60px_rgba(20,27,52,.18)] md:p-10">
        <div className="relative z-10 max-w-2xl"><span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-[10px] font-black uppercase tracking-[.17em] text-[#c9f26a]"><Sparkles className="h-3.5 w-3.5" /> Your business toolbox</span><h1 className="mt-5 font-display text-4xl font-black leading-[.92] tracking-[-.065em] md:text-6xl">Everything important.<br /><span className="text-[#ff6f51]">Nothing in the way.</span></h1><p className="mt-5 max-w-xl text-sm leading-6 text-white/60">Daily business workflows now live together—not hidden inside Settings.</p></div>
        <img src="/images/dashboard-clay.png" alt="" className="absolute -bottom-24 -right-20 hidden w-[520px] opacity-45 md:block" />
      </section>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((item, index) => { const Icon = item.icon; return <motion.button key={item.path} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .05 }} whileHover={{ y: -7 }} onClick={() => navigate(item.path)} className="group rounded-[28px] border border-white/80 bg-white/75 p-5 text-left shadow-[0_14px_42px_rgba(20,27,52,.07)] backdrop-blur-2xl"><div className="flex items-start justify-between"><span className={`grid h-14 w-14 place-items-center rounded-[20px] ${item.color}`}><Icon className="h-6 w-6" /></span><ArrowRight className="h-5 w-5 text-[#9a9daa] transition-transform group-hover:translate-x-1 group-hover:text-[#141b34]" /></div><p className="mt-8 text-[10px] font-black uppercase tracking-[.18em] text-[#ff5d3b]">{item.hindi}</p><h2 className="mt-1 font-display text-2xl font-black tracking-[-.045em]">{item.title}</h2><p className="mt-2 text-sm leading-6 text-[#74798a]">{item.copy}</p><div className="mt-5 flex items-center gap-2 text-[11px] font-bold text-[#74798a]"><Clock3 className="h-3.5 w-3.5" /> Ready when you are</div></motion.button>; })}
      </div>
    </div>
  );
};
export default ModulesHub;
