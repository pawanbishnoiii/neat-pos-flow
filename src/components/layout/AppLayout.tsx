import { type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';

const AppLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  return (
    <div className="zen-app-shell relative min-h-screen overflow-x-hidden bg-[#f8f6f1] text-[#141b34]">
      <div className="pointer-events-none fixed inset-0 opacity-[.34]" style={{ backgroundImage: 'radial-gradient(#141b34 0.65px, transparent 0.65px)', backgroundSize: '18px 18px', maskImage: 'linear-gradient(to bottom, black, transparent 75%)' }} />
      <motion.div className="pointer-events-none fixed -left-24 top-24 h-72 w-72 rounded-full bg-[#c9b6ff]/35 blur-3xl" animate={reduceMotion ? undefined : { y: [0, 42, 0], x: [0, 18, 0] }} transition={{ duration: 12, repeat: Infinity }} />
      <motion.div className="pointer-events-none fixed -right-28 top-[35%] h-80 w-80 rounded-full bg-[#ffd84d]/25 blur-3xl" animate={reduceMotion ? undefined : { y: [0, -36, 0] }} transition={{ duration: 14, repeat: Infinity }} />
      <AnimatePresence mode="wait">
        <motion.main key={location.pathname} initial={reduceMotion ? false : { opacity: 0, y: 16, filter: 'blur(5px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={reduceMotion ? undefined : { opacity: 0, y: -8 }} transition={{ duration: .34, ease: [0.22, 1, 0.36, 1] }} className="relative z-10 min-h-screen pb-24 lg:pb-6">
          {children}
        </motion.main>
      </AnimatePresence>
      <BottomNav />
    </div>
  );
};
export default AppLayout;
