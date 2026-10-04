import { type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';

const AppLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const visual = location.pathname === '/billing' ? 'billing-flow' : location.pathname === '/workspace' ? 'inventory-network' : location.pathname === '/settings' ? 'settings-studio' : 'pos-terminal';
  return (
    <div className="zen-app-shell relative min-h-screen overflow-x-hidden bg-[#f8f6f1] text-[#141b34]">
      <div className="pointer-events-none fixed inset-0 opacity-[.34]" style={{ backgroundImage: 'radial-gradient(#141b34 0.65px, transparent 0.65px)', backgroundSize: '18px 18px', maskImage: 'linear-gradient(to bottom, black, transparent 75%)' }} />
      <motion.div className="pointer-events-none fixed -left-24 top-24 h-72 w-72 rounded-full bg-[#c9b6ff]/35 blur-3xl" animate={reduceMotion ? undefined : { y: [0, 42, 0], x: [0, 18, 0] }} transition={{ duration: 12, repeat: Infinity }} />
      <motion.div className="pointer-events-none fixed -right-28 top-[35%] h-80 w-80 rounded-full bg-[#ffd84d]/25 blur-3xl" animate={reduceMotion ? undefined : { y: [0, -36, 0] }} transition={{ duration: 14, repeat: Infinity }} />
      <motion.img key={visual} src={`/images/experience-layers/${visual}.webp`} alt="" aria-hidden="true" initial={{ opacity: 0, scale: .9 }} animate={{ opacity: .075, scale: 1 }} className="pointer-events-none fixed -right-24 bottom-10 hidden w-[520px] mix-blend-multiply lg:block" />
      <AnimatePresence mode="wait">
        <motion.main key={location.pathname} initial={reduceMotion ? false : { opacity: 0, y: 12, scale: .995 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={reduceMotion ? undefined : { opacity: 0, y: -6 }} transition={{ duration: .28, ease: [0.22, 1, 0.36, 1] }} className="relative z-10 min-h-screen pb-24 lg:pb-6">
          {!reduceMotion && <motion.div className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-gradient-to-r from-[#ff5d3b] via-[#7050db] to-[#c9f26a]" initial={{ scaleX: 0 }} animate={{ scaleX: [0, .72, 1], opacity: [1, 1, 0] }} transition={{ duration: .55, times: [0, .72, 1] }} />}
          {children}
        </motion.main>
      </AnimatePresence>
      <BottomNav />
    </div>
  );
};
export default AppLayout;
