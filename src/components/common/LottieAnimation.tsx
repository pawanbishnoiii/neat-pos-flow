import Lottie from 'lottie-react';

// Pulse loading animation
const PULSE_DOT = {
  v: "5.5.7", fr: 30, ip: 0, op: 60, w: 200, h: 200,
  layers: [{
    ty: 4, nm: "dot", sr: 1, ks: {
      o: { a: 1, k: [{ t: 0, s: [100] }, { t: 30, s: [40] }, { t: 60, s: [100] }] },
      s: { a: 1, k: [{ t: 0, s: [100, 100] }, { t: 30, s: [120, 120] }, { t: 60, s: [100, 100] }] },
      p: { a: 0, k: [100, 100] }, a: { a: 0, k: [0, 0] }, r: { a: 0, k: 0 }
    }, shapes: [{ ty: "el", p: { a: 0, k: [0, 0] }, s: { a: 0, k: [60, 60] } }, { ty: "fl", c: { a: 0, k: [0.93, 0.4, 0.15, 1] }, o: { a: 0, k: 100 } }], ip: 0, op: 60, st: 0
  }]
};

// Checkmark success animation
const CHECK_MARK = {
  v: "5.5.7", fr: 30, ip: 0, op: 40, w: 200, h: 200,
  layers: [{
    ty: 4, nm: "circle", sr: 1, ks: {
      o: { a: 1, k: [{ t: 0, s: [0] }, { t: 8, s: [100] }] },
      s: { a: 1, k: [{ t: 0, s: [0, 0] }, { t: 12, s: [115, 115] }, { t: 20, s: [100, 100] }] },
      p: { a: 0, k: [100, 100] }, a: { a: 0, k: [0, 0] }, r: { a: 0, k: 0 }
    }, shapes: [{ ty: "el", p: { a: 0, k: [0, 0] }, s: { a: 0, k: [120, 120] } }, { ty: "fl", c: { a: 0, k: [0.22, 0.78, 0.45, 1] }, o: { a: 0, k: 100 } }], ip: 0, op: 40, st: 0
  }]
};

// Empty state - floating box
const EMPTY_BOX = {
  v: "5.5.7", fr: 30, ip: 0, op: 90, w: 200, h: 200,
  layers: [{
    ty: 4, nm: "box", sr: 1, ks: {
      o: { a: 1, k: [{ t: 0, s: [60] }, { t: 45, s: [100] }, { t: 90, s: [60] }] },
      s: { a: 0, k: [100, 100] },
      p: { a: 1, k: [{ t: 0, s: [100, 110] }, { t: 45, s: [100, 90] }, { t: 90, s: [100, 110] }] },
      a: { a: 0, k: [0, 0] }, r: { a: 1, k: [{ t: 0, s: [0] }, { t: 45, s: [5] }, { t: 90, s: [0] }] }
    }, shapes: [
      { ty: "rc", p: { a: 0, k: [0, 0] }, s: { a: 0, k: [70, 60] }, r: { a: 0, k: 10 } },
      { ty: "fl", c: { a: 0, k: [0.6, 0.6, 0.7, 1] }, o: { a: 0, k: 100 } }
    ], ip: 0, op: 90, st: 0
  }]
};

// Welcome sparkle animation
const WELCOME_SPARKLE = {
  v: "5.5.7", fr: 30, ip: 0, op: 90, w: 200, h: 200,
  layers: [
    {
      ty: 4, nm: "star1", sr: 1, ks: {
        o: { a: 1, k: [{ t: 0, s: [0] }, { t: 15, s: [100] }, { t: 60, s: [100] }, { t: 90, s: [0] }] },
        s: { a: 1, k: [{ t: 0, s: [0, 0] }, { t: 20, s: [120, 120] }, { t: 40, s: [100, 100] }] },
        p: { a: 0, k: [100, 100] }, a: { a: 0, k: [0, 0] },
        r: { a: 1, k: [{ t: 0, s: [0] }, { t: 90, s: [360] }] }
      }, shapes: [
        { ty: "sr", p: { a: 0, k: [0, 0] }, or: { a: 0, k: 40 }, ir: { a: 0, k: 20 }, pt: { a: 0, k: 4 }, r: { a: 0, k: 0 }, sy: 1 },
        { ty: "fl", c: { a: 0, k: [0.93, 0.7, 0.15, 1] }, o: { a: 0, k: 100 } }
      ], ip: 0, op: 90, st: 0
    }
  ]
};

// Cart/shopping animation
const CART_BOUNCE = {
  v: "5.5.7", fr: 30, ip: 0, op: 60, w: 200, h: 200,
  layers: [{
    ty: 4, nm: "cart", sr: 1, ks: {
      o: { a: 0, k: [100] },
      s: { a: 1, k: [{ t: 0, s: [100, 100] }, { t: 15, s: [110, 90] }, { t: 30, s: [95, 105] }, { t: 45, s: [100, 100] }] },
      p: { a: 1, k: [{ t: 0, s: [100, 100] }, { t: 15, s: [100, 110] }, { t: 30, s: [100, 95] }, { t: 45, s: [100, 100] }] },
      a: { a: 0, k: [0, 0] }, r: { a: 0, k: 0 }
    }, shapes: [
      { ty: "rc", p: { a: 0, k: [0, 0] }, s: { a: 0, k: [80, 60] }, r: { a: 0, k: 12 } },
      { ty: "fl", c: { a: 0, k: [0.4, 0.5, 0.95, 1] }, o: { a: 0, k: 100 } }
    ], ip: 0, op: 60, st: 0
  }]
};

// Invoice/receipt animation
const RECEIPT_ANIM = {
  v: "5.5.7", fr: 30, ip: 0, op: 60, w: 200, h: 200,
  layers: [{
    ty: 4, nm: "receipt", sr: 1, ks: {
      o: { a: 1, k: [{ t: 0, s: [0] }, { t: 10, s: [100] }] },
      s: { a: 1, k: [{ t: 0, s: [100, 0] }, { t: 20, s: [100, 110] }, { t: 30, s: [100, 100] }] },
      p: { a: 0, k: [100, 100] }, a: { a: 0, k: [0, 0] }, r: { a: 0, k: 0 }
    }, shapes: [
      { ty: "rc", p: { a: 0, k: [0, 0] }, s: { a: 0, k: [60, 80] }, r: { a: 0, k: 8 } },
      { ty: "fl", c: { a: 0, k: [0.3, 0.7, 0.5, 1] }, o: { a: 0, k: 100 } }
    ], ip: 0, op: 60, st: 0
  }]
};

// Error/warning shake
const ERROR_SHAKE = {
  v: "5.5.7", fr: 30, ip: 0, op: 40, w: 200, h: 200,
  layers: [{
    ty: 4, nm: "error", sr: 1, ks: {
      o: { a: 1, k: [{ t: 0, s: [0] }, { t: 5, s: [100] }] },
      s: { a: 1, k: [{ t: 0, s: [0, 0] }, { t: 10, s: [110, 110] }, { t: 20, s: [100, 100] }] },
      p: { a: 1, k: [{ t: 0, s: [100, 100] }, { t: 5, s: [92, 100] }, { t: 10, s: [108, 100] }, { t: 15, s: [96, 100] }, { t: 20, s: [100, 100] }] },
      a: { a: 0, k: [0, 0] }, r: { a: 0, k: 0 }
    }, shapes: [
      { ty: "el", p: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] } },
      { ty: "fl", c: { a: 0, k: [0.9, 0.3, 0.3, 1] }, o: { a: 0, k: 100 } }
    ], ip: 0, op: 40, st: 0
  }]
};

const ANIMATIONS: Record<string, any> = {
  loading: PULSE_DOT,
  success: CHECK_MARK,
  empty: EMPTY_BOX,
  welcome: WELCOME_SPARKLE,
  cart: CART_BOUNCE,
  receipt: RECEIPT_ANIM,
  error: ERROR_SHAKE,
};

interface Props {
  type: 'loading' | 'success' | 'empty' | 'welcome' | 'cart' | 'receipt' | 'error';
  size?: number;
  loop?: boolean;
  className?: string;
}

const LottieAnimation = ({ type, size = 120, loop = true, className = '' }: Props) => {
  const data = ANIMATIONS[type];
  if (!data) return null;

  return (
    <div className={`flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <Lottie animationData={data} loop={loop} style={{ width: size, height: size }} />
    </div>
  );
};

export default LottieAnimation;
