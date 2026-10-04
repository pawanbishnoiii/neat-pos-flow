import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  backTo?: string;
  actions?: ReactNode;
}

const PageHeader = ({ title, backTo = '/', actions }: PageHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between rounded-[24px] border border-white/70 bg-white/68 p-3 shadow-[0_12px_38px_rgba(20,27,52,.06)] backdrop-blur-2xl md:p-4">
      <div className="flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(backTo)}
          className="grid h-10 w-10 place-items-center rounded-[14px] bg-[#141b34] text-white shadow-sm transition-transform hover:-translate-x-0.5"
        >
          <ArrowLeft className="h-4 w-4" />
        </motion.button>
        <motion.h1
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-xl font-black tracking-[-.045em] text-[#141b34] md:text-2xl"
        >
          {title}
        </motion.h1>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
};

export default PageHeader;
