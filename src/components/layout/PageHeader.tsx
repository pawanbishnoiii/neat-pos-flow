import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  backTo?: string;
  actions?: ReactNode;
  subtitle?: string;
}

const PageHeader = ({ title, backTo = '/', actions, subtitle }: PageHeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const section = location.pathname.split('/').filter(Boolean).at(-1)?.replace('-', ' ') || 'home';

  return (
    <motion.header layout className="relative flex items-center justify-between overflow-hidden rounded-[24px] border border-white/80 bg-white/72 p-3 shadow-[0_12px_38px_rgba(20,27,52,.06)] backdrop-blur-2xl md:p-4">
      <div className="pointer-events-none absolute -right-8 -top-12 h-28 w-28 rounded-full bg-[#c9b6ff]/30 blur-2xl" />
      <div className="flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(backTo)}
          className="grid h-10 w-10 place-items-center rounded-[14px] bg-[#141b34] text-white shadow-sm transition-transform hover:-translate-x-0.5"
        >
          <ArrowLeft className="h-4 w-4" />
        </motion.button>
        <div><motion.div initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="mb-0.5 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[.16em] text-[#ff5d3b]"><Sparkles className="h-2.5 w-2.5" /> {section}</motion.div><motion.h1 initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="font-display text-xl font-black tracking-[-.045em] text-[#141b34] md:text-2xl">{title}</motion.h1>{subtitle && <p className="mt-0.5 hidden text-xs font-medium text-[#74798a] sm:block">{subtitle}</p>}</div>
      </div>
      {actions && <div className="relative z-10 flex items-center gap-2">{actions}</div>}
    </motion.header>
  );
};

export default PageHeader;
