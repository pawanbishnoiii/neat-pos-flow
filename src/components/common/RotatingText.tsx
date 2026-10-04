import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

type RotatingTextProps = { words: string[]; interval?: number; className?: string };

const RotatingText = ({ words, interval = 2400, className = '' }: RotatingTextProps) => {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion || words.length < 2) return;
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % words.length), interval);
    return () => window.clearInterval(timer);
  }, [interval, reduceMotion, words.length]);

  return (
    <span className={`relative inline-grid overflow-hidden align-bottom ${className}`} aria-live="polite">
      <span className="invisible col-start-1 row-start-1">{words.reduce((longest, word) => word.length > longest.length ? word : longest, '')}</span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={words[index]} className="col-start-1 row-start-1" initial={reduceMotion ? false : { y: '90%', opacity: 0, rotate: 2 }} animate={{ y: 0, opacity: 1, rotate: 0 }} exit={reduceMotion ? undefined : { y: '-90%', opacity: 0, rotate: -2 }} transition={{ duration: .42, ease: [0.22, 1, 0.36, 1] }}>{words[index]}</motion.span>
      </AnimatePresence>
    </span>
  );
};

export default RotatingText;
