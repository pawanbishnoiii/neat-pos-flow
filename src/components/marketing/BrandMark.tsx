import { Sparkles } from 'lucide-react';

type BrandMarkProps = { compact?: boolean; inverse?: boolean };

const BrandMark = ({ compact = false, inverse = false }: BrandMarkProps) => (
  <div className="flex items-center gap-2.5" aria-label="Zen POS home">
    <span className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-[15px] bg-[#ff5d3b] text-white shadow-[0_8px_22px_rgba(255,93,59,.32)]">
      <span className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-[#ffd84d]" />
      <Sparkles className="relative z-10 h-[18px] w-[18px]" strokeWidth={2.4} />
    </span>
    {!compact && <span className={`font-display text-[20px] font-extrabold tracking-[-0.04em] ${inverse ? 'text-white' : 'text-[#141b34]'}`}>ZEN<span className="text-[#ff5d3b]">POS</span></span>}
  </div>
);

export default BrandMark;
