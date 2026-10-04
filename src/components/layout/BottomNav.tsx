import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Boxes, LayoutDashboard, Layers3, ReceiptText, ScanLine, Settings } from 'lucide-react';
import BrandMark from '@/components/marketing/BrandMark';
import { useBusiness } from '@/hooks/useBusiness';
import { getCategoryConfig } from '@/lib/categoryConfig';

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { business } = useBusiness();
  const config = business ? getCategoryConfig(business.category) : null;
  const modulePaths = ['/modules', '/offers', '/customers', '/history', '/expenses', '/credit-ledger', '/reviews'];
  const items = [
    { path: '/dashboard', icon: LayoutDashboard, label: config?.navLabel.home || 'Home' },
    { path: '/workspace', icon: Boxes, label: config?.navLabel.workspace || 'Stock' },
    { path: '/billing', icon: ReceiptText, label: config?.navLabel.billing || 'Billing' },
    { path: '/modules', icon: Layers3, label: 'Modules', match: modulePaths },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];
  const active = (item: typeof items[number]) => item.match ? item.match.includes(location.pathname) : location.pathname === item.path;
  return (
    <>
      <nav className="fixed bottom-3 left-3 right-3 z-50 rounded-[24px] border border-white/70 bg-[#141b34]/94 px-2 py-2 shadow-[0_18px_50px_rgba(20,27,52,.3)] backdrop-blur-2xl lg:hidden">
        <div className="flex items-center justify-around">{items.map((item) => { const Icon = item.icon; const isActive = active(item); return <button key={item.path} onClick={() => navigate(item.path)} className={`relative flex min-w-[58px] flex-col items-center gap-1 rounded-[17px] px-2 py-2 text-[9px] font-bold ${isActive ? 'text-[#141b34]' : 'text-white/55'}`}>{isActive && <motion.span layoutId="mobile-nav" className="absolute inset-0 rounded-[17px] bg-[#c9f26a]" transition={{ type: 'spring', stiffness: 440, damping: 32 }} />}<Icon className="relative z-10 h-[18px] w-[18px]" /><span className="relative z-10">{item.label}</span></button>; })}</div>
      </nav>
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-[88px] flex-col items-center border-r border-white/70 bg-white/72 py-5 shadow-[12px_0_42px_rgba(20,27,52,.06)] backdrop-blur-2xl lg:flex">
        <button onClick={() => navigate('/dashboard')} className="mb-8"><BrandMark compact /></button>
        <nav className="flex flex-1 flex-col items-center gap-2">{items.map((item) => { const Icon = item.icon; const isActive = active(item); return <motion.button key={item.path} whileHover={{ y: -2 }} whileTap={{ scale: .94 }} onClick={() => navigate(item.path)} title={item.label} className={`relative flex h-[62px] w-[66px] flex-col items-center justify-center gap-1 rounded-[20px] text-[9px] font-extrabold ${isActive ? 'bg-[#141b34] text-white shadow-[0_12px_25px_rgba(20,27,52,.2)]' : 'text-[#74798a] hover:bg-white hover:text-[#141b34]'}`}><Icon className={`h-5 w-5 ${isActive ? 'text-[#c9f26a]' : ''}`} /><span>{item.label}</span>{isActive && <span className="absolute -right-[12px] h-6 w-1 rounded-full bg-[#ff5d3b]" />}</motion.button>; })}</nav>
        <motion.button whileHover={{ rotate: 8, scale: 1.06 }} onClick={() => navigate('/billing')} className="grid h-12 w-12 place-items-center rounded-[17px] bg-[#ff5d3b] text-white shadow-[0_12px_25px_rgba(255,93,59,.28)]" title="Quick bill"><ScanLine className="h-5 w-5" /></motion.button>
      </aside>
    </>
  );
};
export default BottomNav;
