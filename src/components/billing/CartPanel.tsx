import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore, CartItem } from '@/store/useAppStore';
import { Minus, Plus, Trash2, Banknote, Smartphone, Printer, FileText, Loader2, UserCheck, Share2, Tag, Percent, IndianRupee, QrCode, Search, UserPlus, X, CheckCircle, Volume2, CreditCard, BookOpen, Car, Phone, Mail } from 'lucide-react';
import { useState, useRef, useEffect, useMemo } from 'react';
import { useBusiness } from '@/hooks/useBusiness';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import InvoicePreview from './InvoicePreview';
import { connectPrinter, sendToPrinter, buildReceiptData, PrinterConnection } from '@/lib/ezoPrinter';
import { QRCodeSVG } from 'qrcode.react';
import { playBeep, playSuccess, playError } from '@/lib/sounds';

const CartPanel = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useAppStore();
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [saving, setSaving] = useState(false);
  const [printer, setPrinter] = useState<PrinterConnection>({ device: null, characteristic: null, connected: false });
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [showDiscount, setShowDiscount] = useState(false);
  const [discountType, setDiscountType] = useState<'percent' | 'flat'>('percent');
  const [discountValue, setDiscountValue] = useState('');
  const [showUpiQr, setShowUpiQr] = useState(false);
  const [upiApproved, setUpiApproved] = useState(false);
  const [creditBalance, setCreditBalance] = useState(0);
  const [showCredit, setShowCredit] = useState(false);
  const [creditAmount, setCreditAmount] = useState('');
  const [creditLoading, setCreditLoading] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);
  const { business } = useBusiness();
  const { toast } = useToast();

  const subtotal = cart.reduce((sum, item) => sum + item.product.discountPrice * item.quantity, 0);
  const taxTotal = cart.reduce((sum, item) => sum + (item.product.discountPrice * item.quantity * item.product.taxPercent) / 100, 0);
  const couponAmount = couponDiscount > 0 ? (subtotal * couponDiscount) / 100 : 0;

  const manualDiscount = useMemo(() => {
    const val = parseFloat(discountValue) || 0;
    if (discountType === 'percent') return (subtotal * Math.min(val, 100)) / 100;
    return Math.min(val, subtotal);
  }, [discountValue, discountType, subtotal]);

  const grandTotal = Math.max(0, subtotal + taxTotal - couponAmount - manualDiscount);

  const upiId = (business as any)?.upi_id || '';
  const upiLink = upiId ? `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(business?.business_name || '')}&am=${grandTotal.toFixed(2)}&cu=INR` : '';

  const paymentMethods = [
    { id: 'cash', label: 'Cash', icon: Banknote },
    { id: 'upi', label: 'UPI', icon: Smartphone },
    { id: 'credit', label: 'Credit', icon: CreditCard },
    { id: 'cod', label: 'COD', icon: FileText },
  ];

  // Customer search with name, phone, email, vehicle_number
  useEffect(() => {
    if (!business || customerSearch.length < 2) { setSuggestions([]); setShowSuggestions(false); return; }
    const timer = setTimeout(async () => {
      const { data } = await supabase.from('customers').select('id, full_name, phone, email, vehicle_number, vehicle_type, visit_count, total_spent')
        .eq('business_id', business.id)
        .or(`phone.ilike.%${customerSearch}%,full_name.ilike.%${customerSearch}%,email.ilike.%${customerSearch}%,vehicle_number.ilike.%${customerSearch}%`)
        .limit(8);
      setSuggestions(data || []);
      setShowSuggestions((data || []).length > 0);
    }, 250);
    return () => clearTimeout(timer);
  }, [customerSearch, business?.id]);

  // Fetch credit balance when customer selected
  useEffect(() => {
    if (!selectedCustomer?.id || !business || selectedCustomer.isNew) { setCreditBalance(0); return; }
    const fetchCredit = async () => {
      const { data } = await supabase.from('credit_ledger')
        .select('balance_after')
        .eq('business_id', business.id)
        .eq('customer_id', selectedCustomer.id)
        .order('created_at', { ascending: false })
        .limit(1);
      setCreditBalance(data?.[0]?.balance_after ? Number(data[0].balance_after) : 0);
    };
    fetchCredit();
  }, [selectedCustomer?.id, business?.id]);

  const selectCustomer = (c: any) => {
    setCustomerName(c.full_name || '');
    setCustomerPhone(c.phone || '');
    setCustomerEmail(c.email || '');
    setVehicleNumber(c.vehicle_number || '');
    setVehicleType(c.vehicle_type || '');
    setSelectedCustomer(c);
    setShowSuggestions(false);
    setCustomerSearch('');
    playBeep();
  };

  const clearCustomer = () => {
    setCustomerName(''); setCustomerPhone(''); setCustomerEmail('');
    setVehicleNumber(''); setVehicleType(''); setSelectedCustomer(null);
    setCustomerSearch(''); setCreditBalance(0); setShowCredit(false);
  };

  const handleApplyCoupon = async () => {
    if (!business || !couponCode.trim()) return;
    const { data } = await supabase.from('business_offers').select('discount_percent, title')
      .eq('business_id', business.id).eq('coupon_code', couponCode.trim().toUpperCase()).eq('is_active', true).maybeSingle();
    if (data) {
      setCouponDiscount(data.discount_percent);
      playBeep();
      toast({ title: 'Coupon Applied!', description: `${data.title} — ${data.discount_percent}% off` });
    } else {
      setCouponDiscount(0);
      playError();
      toast({ title: 'Invalid Coupon', variant: 'destructive' });
    }
  };

  const generateInvoiceNumber = () => {
    const prefix = (business?.category || 'ZP').substring(0, 2).toUpperCase();
    return `${prefix}-${Date.now().toString(36).toUpperCase()}`;
  };

  const canCharge = () => {
    if (!customerName.trim() && !customerPhone.trim()) return false;
    if (cart.length === 0) return false;
    if (paymentMethod === 'upi' && upiId && !upiApproved) return false;
    return true;
  };

  const handleCreditAction = async (type: 'credit' | 'payment') => {
    if (!business || !selectedCustomer?.id || selectedCustomer.isNew) return;
    const amount = parseFloat(creditAmount);
    if (!amount || amount <= 0) { toast({ title: 'Enter valid amount', variant: 'destructive' }); return; }
    setCreditLoading(true);
    const newBalance = type === 'credit' ? creditBalance + amount : Math.max(0, creditBalance - amount);
    const { error } = await supabase.from('credit_ledger').insert({
      business_id: business.id, customer_id: selectedCustomer.id,
      amount, balance_after: newBalance, type,
      notes: type === 'credit' ? 'Added from billing' : 'Payment from billing',
    });
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); }
    else {
      setCreditBalance(newBalance);
      setCreditAmount('');
      playBeep();
      toast({ title: type === 'credit' ? 'Credit Added' : 'Payment Recorded', description: `Balance: ₹${newBalance.toFixed(0)}` });
    }
    setCreditLoading(false);
  };

  const handleCharge = async () => {
    if (!business) { toast({ title: 'Error', description: 'Set up business first', variant: 'destructive' }); playError(); return; }
    if (!customerName.trim() && !customerPhone.trim()) {
      toast({ title: 'Customer Required', description: 'Please add customer name or phone number', variant: 'destructive' });
      playError(); return;
    }
    setSaving(true);
    const invNum = generateInvoiceNumber();
    setInvoiceNumber(invNum);
    try {
      let customerId: string | null = null;
      const hasDetails = [customerName, customerPhone, customerEmail, vehicleNumber].some(v => v.trim().length > 0);
      if (hasDetails) {
        const { data: uid, error: ce } = await supabase.rpc('upsert_customer_for_invoice', {
          _business_id: business.id, _full_name: customerName, _phone: customerPhone, _email: customerEmail, _vehicle_number: vehicleNumber,
        });
        if (ce) throw ce;
        customerId = uid as string;
      }
      const discountTotal = cart.reduce((s, i) => s + (i.product.price - i.product.discountPrice) * i.quantity, 0) + couponAmount + manualDiscount;
      const { data: invoice, error: invError } = await supabase.from('invoices').insert({
        business_id: business.id, invoice_number: invNum, customer_id: customerId,
        customer_name: customerName || null, customer_phone: customerPhone || null,
        subtotal, discount_total: discountTotal, tax_total: taxTotal, grand_total: grandTotal, payment_method: paymentMethod,
      }).select().single();
      if (invError) throw invError;

      const items = cart.map(item => ({
        invoice_id: invoice.id, product_id: item.product.id, product_name: item.product.name,
        quantity: item.quantity, price: item.product.discountPrice, total: item.product.discountPrice * item.quantity,
      }));
      const { error: ie } = await supabase.from('invoice_items').insert(items);
      if (ie) throw ie;

      for (const item of cart) {
        await supabase.from('products').update({ stock: Math.max(0, item.product.stock - item.quantity) }).eq('id', item.product.id);
      }

      if (customerId) {
        const { data: cs } = await supabase.from('customers').select('visit_count,total_spent').eq('id', customerId).maybeSingle();
        if (cs) {
          await supabase.from('customers').update({
            visit_count: Number(cs.visit_count || 0) + 1, total_spent: Number(cs.total_spent || 0) + grandTotal,
            last_visit_at: new Date().toISOString(), vehicle_type: vehicleType || undefined,
          }).eq('id', customerId);
        }
      }

      if (paymentMethod === 'credit' && customerId) {
        const newBalance = creditBalance + grandTotal;
        await supabase.from('credit_ledger').insert({
          business_id: business.id, customer_id: customerId,
          amount: grandTotal, balance_after: newBalance, type: 'credit',
          notes: `Invoice ${invNum}`,
        });
        setCreditBalance(newBalance);
      }

      playSuccess();
      setShowInvoice(true);
      toast({ title: 'Invoice Created!', description: `${invNum} saved.` });
    } catch (err: any) {
      playError();
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally { setSaving(false); }
  };

  const handleDeleteInvoice = async () => {
    if (!invoiceNumber || !business) return;
    try {
      const { data: inv } = await supabase.from('invoices').select('id').eq('business_id', business.id).eq('invoice_number', invoiceNumber).maybeSingle();
      if (inv) {
        await supabase.from('invoice_items').delete().eq('invoice_id', inv.id);
        await supabase.from('invoices').delete().eq('id', inv.id);
        toast({ title: 'Invoice Deleted' });
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
    handleDone();
  };

  const handleConnectPrinter = async () => {
    const conn = await connectPrinter();
    setPrinter(conn);
    if (conn.connected) { playBeep(); toast({ title: 'Printer Connected!' }); }
    else toast({ title: 'Failed', variant: 'destructive' });
  };

  const handlePrint = async () => {
    if (!printer.connected || !printer.characteristic) return;
    const receiptData = buildReceiptData({
      businessName: business?.business_name || '', businessAddress: business?.address || '',
      businessPhone: business?.phone || '', businessGst: business?.gst_number || '',
      invoiceNumber, customerName, customerPhone,
      items: cart.map(i => ({ name: i.product.name, qty: i.quantity, price: i.product.discountPrice, total: i.product.discountPrice * i.quantity })),
      subtotal, tax: taxTotal, total: grandTotal, paymentMethod,
    });
    try {
      await sendToPrinter(printer.characteristic, receiptData);
      playSuccess(); toast({ title: 'Printed!' });
    } catch (err: any) {
      playError(); toast({ title: 'Print Error', description: err.message, variant: 'destructive' });
    }
  };

  const handleShareWhatsApp = () => {
    const itemsList = cart.map(i => `• ${i.product.name} x${i.quantity} = ₹${(i.product.discountPrice * i.quantity).toFixed(0)}`).join('\n');
    const storeUrl = business?.store_slug ? `${window.location.origin}/store/${business.store_slug}` : '';
    const msg = `*Invoice: ${invoiceNumber}*\n${business?.business_name || ''}\n\n${itemsList}\n\nSubtotal: ₹${subtotal.toFixed(0)}\nTax: ₹${taxTotal.toFixed(0)}${couponAmount > 0 ? `\nCoupon: -₹${couponAmount.toFixed(0)}` : ''}${manualDiscount > 0 ? `\nDiscount: -₹${manualDiscount.toFixed(0)}` : ''}\n*Total: ₹${grandTotal.toFixed(0)}*\nPayment: ${paymentMethod.toUpperCase()}${storeUrl ? `\n\nVisit: ${storeUrl}` : ''}\n\nThank you!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleDone = () => {
    setShowInvoice(false); setCustomerName(''); setCustomerPhone(''); setVehicleNumber('');
    setVehicleType(''); setCustomerEmail(''); setCouponCode(''); setCouponDiscount(0);
    setDiscountValue(''); setSelectedCustomer(null); setShowUpiQr(false); setUpiApproved(false);
    setShowDiscount(false); setCustomerSearch(''); setShowCredit(false); setCreditAmount('');
    setCreditBalance(0); clearCart();
  };

  // Invoice view
  if (showInvoice) {
    return (
      <div className="flex flex-col h-full">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-bold font-display text-foreground">Invoice</h2>
          <motion.button whileTap={{ scale: 0.95 }} onClick={handleConnectPrinter}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${printer.connected ? 'bg-emerald-500/10 text-emerald-500' : 'bg-secondary text-secondary-foreground'}`}>
            <Printer className="w-3.5 h-3.5" />{printer.connected ? 'Connected' : 'Connect'}
          </motion.button>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 flex justify-center">
          <InvoicePreview ref={invoiceRef} cart={cart} customerName={customerName} customerPhone={customerPhone} customerEmail={customerEmail}
            paymentMethod={paymentMethod} invoiceNumber={invoiceNumber} businessName={business?.business_name || ''}
            businessAddress={business?.address} businessPhone={business?.phone} businessGst={business?.gst_number}
            subtotal={subtotal} taxTotal={taxTotal} grandTotal={grandTotal}
            storeUrl={business?.store_slug ? `${window.location.origin}/store/${business.store_slug}` : undefined} />
        </div>
        <div className="border-t border-border p-4 space-y-2">
          <div className="flex gap-2">
            <motion.button whileTap={{ scale: 0.95 }} onClick={handlePrint} disabled={!printer.connected}
              className="flex-1 py-3 rounded-xl bg-secondary text-secondary-foreground text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-40">
              <Printer className="w-4 h-4" /> Print
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={handleShareWhatsApp}
              className="flex-1 py-3 rounded-xl bg-emerald-500/10 text-emerald-500 text-sm font-semibold flex items-center justify-center gap-2">
              <Share2 className="w-4 h-4" /> WhatsApp
            </motion.button>
          </div>
          <div className="flex gap-2">
            <motion.button whileTap={{ scale: 0.95 }} onClick={handleDeleteInvoice}
              className="flex-1 py-3 rounded-xl bg-destructive/10 text-destructive text-sm font-semibold flex items-center justify-center gap-2">
              <Trash2 className="w-4 h-4" /> Delete Bill
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={handleDone} className="flex-[2] py-3 rounded-xl gradient-primary text-primary-foreground text-sm font-bold glow-primary">
              Done — New Bill
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold font-display text-foreground">Cart</h2>
          <div className="flex items-center gap-2">
            <motion.button whileTap={{ scale: 0.95 }} onClick={handleConnectPrinter}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold flex items-center gap-1 ${printer.connected ? 'bg-emerald-500/10 text-emerald-500' : 'bg-secondary text-secondary-foreground'}`}>
              <Printer className="w-3 h-3" />{printer.connected ? '✓' : 'Printer'}
            </motion.button>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">{cart.length} items</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Banknote className="w-12 h-12 mb-2 opacity-30" /><p className="text-sm">Cart is empty</p><p className="text-xs">Scan or add products</p>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <AnimatePresence>
              {cart.map((item: CartItem) => (
                <motion.div key={item.product.id} layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="flex items-center gap-3 p-3 rounded-xl glass-card">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate text-foreground">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">₹{item.product.discountPrice} × {item.quantity}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <motion.button whileTap={{ scale: 0.85 }} onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center"><Minus className="w-3 h-3 text-secondary-foreground" /></motion.button>
                    <span className="w-8 text-center text-sm font-bold text-foreground">{item.quantity}</span>
                    <motion.button whileTap={{ scale: 0.85 }} onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center"><Plus className="w-3 h-3 text-secondary-foreground" /></motion.button>
                  </div>
                  <p className="text-sm font-bold w-14 text-right text-foreground">₹{(item.product.discountPrice * item.quantity).toFixed(0)}</p>
                  <motion.button whileTap={{ scale: 0.85 }} onClick={() => removeFromCart(item.product.id)} className="w-7 h-7 rounded-lg bg-destructive/10 flex items-center justify-center"><Trash2 className="w-3 h-3 text-destructive" /></motion.button>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Customer Section - Upgraded */}
            <div className="space-y-2 pt-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1"><UserCheck className="w-3 h-3" /> Customer <span className="text-destructive">*</span></p>

              {selectedCustomer ? (
                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl bg-primary/5 border border-primary/20 p-3 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center"><UserCheck className="w-4 h-4 text-primary" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{selectedCustomer.full_name}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        {selectedCustomer.phone && (
                          <span className="text-[10px] text-muted-foreground flex items-center gap-0.5"><Phone className="w-2.5 h-2.5" />{selectedCustomer.phone}</span>
                        )}
                        {selectedCustomer.vehicle_number && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500 font-medium flex items-center gap-0.5"><Car className="w-2.5 h-2.5" />{selectedCustomer.vehicle_number}</span>
                        )}
                        <span className="text-[10px] text-muted-foreground">{selectedCustomer.visit_count || 0} visits</span>
                      </div>
                    </div>
                    <button onClick={clearCustomer} className="p-1.5 rounded-lg hover:bg-destructive/10"><X className="w-3.5 h-3.5 text-destructive" /></button>
                  </div>

                  {/* Credit Balance Display */}
                  {selectedCustomer.id && !selectedCustomer.isNew && (
                    <div className="rounded-lg bg-amber-500/5 border border-amber-500/20 p-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                          <span className="text-xs font-semibold text-foreground">Credit (Udhar)</span>
                        </div>
                        <span className={`text-sm font-bold ${creditBalance > 0 ? 'text-destructive' : 'text-emerald-500'}`}>
                          ₹{creditBalance.toFixed(0)}
                        </span>
                      </div>
                      <button onClick={() => setShowCredit(!showCredit)} className="text-[10px] text-primary font-semibold mt-1 hover:underline">
                        {showCredit ? 'Hide' : 'Manage Credit →'}
                      </button>
                      <AnimatePresence>
                        {showCredit && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mt-2 space-y-2">
                            <input type="number" placeholder="Amount" value={creditAmount} onChange={e => setCreditAmount(e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                            <div className="flex gap-2">
                              <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleCreditAction('credit')} disabled={creditLoading}
                                className="flex-1 py-1.5 rounded-lg bg-destructive/10 text-destructive text-xs font-semibold flex items-center justify-center gap-1">
                                <Plus className="w-3 h-3" /> Add Credit
                              </motion.button>
                              <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleCreditAction('payment')} disabled={creditLoading}
                                className="flex-1 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 text-xs font-semibold flex items-center justify-center gap-1">
                                <Minus className="w-3 h-3" /> Payment
                              </motion.button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Vehicle Number */}
                  <input type="text" placeholder="Vehicle # (optional)" value={vehicleNumber} onChange={e => setVehicleNumber(e.target.value.toUpperCase())}
                    className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </motion.div>
              ) : (
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <input type="text" placeholder="Search name, phone, vehicle..." value={customerSearch}
                      onChange={e => { setCustomerSearch(e.target.value); setCustomerName(e.target.value); }}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>

                  {/* Enhanced Suggestions with name, phone, vehicle */}
                  {showSuggestions && suggestions.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl border border-border bg-card shadow-lg overflow-hidden max-h-48 overflow-y-auto">
                      {suggestions.map((s) => (
                        <button key={s.id} onClick={() => selectCustomer(s)} className="w-full flex items-center gap-2.5 p-2.5 text-left hover:bg-muted/50 text-sm border-b border-border last:border-0 transition-colors">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"><UserCheck className="w-3.5 h-3.5 text-primary" /></div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-foreground truncate text-xs">{s.full_name || 'Unknown'}</p>
                            <div className="flex items-center gap-2 flex-wrap mt-0.5">
                              {s.phone && (
                                <span className="text-[10px] text-muted-foreground flex items-center gap-0.5"><Phone className="w-2 h-2" />{s.phone}</span>
                              )}
                              {s.vehicle_number && (
                                <span className="text-[10px] px-1 py-0 rounded bg-blue-500/10 text-blue-500 font-medium flex items-center gap-0.5"><Car className="w-2 h-2" />{s.vehicle_number}</span>
                              )}
                              {s.email && (
                                <span className="text-[10px] text-muted-foreground flex items-center gap-0.5"><Mail className="w-2 h-2" />{s.email}</span>
                              )}
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-[10px] font-medium text-foreground">₹{Number(s.total_spent || 0).toFixed(0)}</span>
                            <p className="text-[9px] text-muted-foreground">{s.visit_count || 0} visits</p>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}

                  <div className="flex gap-2">
                    <input type="tel" placeholder="Phone *" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    <input type="text" placeholder="Vehicle #" value={vehicleNumber} onChange={e => setVehicleNumber(e.target.value.toUpperCase())}
                      className="flex-1 px-3 py-2 rounded-xl bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>

                  {(customerName.trim() || customerPhone.trim()) && !selectedCustomer && suggestions.length === 0 && customerSearch.length >= 2 && (
                    <motion.button initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} whileTap={{ scale: 0.95 }}
                      onClick={() => { setSelectedCustomer({ full_name: customerName, phone: customerPhone, email: customerEmail, visit_count: 0, isNew: true }); playBeep(); }}
                      className="w-full py-2 rounded-xl bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center gap-1">
                      <UserPlus className="w-3.5 h-3.5" /> Add "{customerName || customerPhone}" as New Customer
                    </motion.button>
                  )}
                </div>
              )}
            </div>

            {/* Discount */}
            <div className="space-y-2 pt-1">
              <button onClick={() => setShowDiscount(!showDiscount)}
                className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1 hover:text-primary transition-colors">
                <Tag className="w-3 h-3" /> Discount {manualDiscount > 0 && <span className="text-emerald-500 ml-1">−₹{manualDiscount.toFixed(0)}</span>}
              </button>
              <AnimatePresence>
                {showDiscount && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden space-y-2">
                    <div className="flex gap-2">
                      <div className="flex rounded-xl border border-border overflow-hidden">
                        <button onClick={() => setDiscountType('percent')}
                          className={`px-3 py-1.5 text-xs font-semibold flex items-center gap-1 transition-colors ${discountType === 'percent' ? 'bg-primary/10 text-primary' : 'bg-secondary text-secondary-foreground'}`}>
                          <Percent className="w-3 h-3" /> %
                        </button>
                        <button onClick={() => setDiscountType('flat')}
                          className={`px-3 py-1.5 text-xs font-semibold flex items-center gap-1 transition-colors ${discountType === 'flat' ? 'bg-primary/10 text-primary' : 'bg-secondary text-secondary-foreground'}`}>
                          <IndianRupee className="w-3 h-3" /> ₹
                        </button>
                      </div>
                      <input type="number" placeholder={discountType === 'percent' ? 'e.g. 10' : 'e.g. 50'} value={discountValue}
                        onChange={e => setDiscountValue(e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-xl bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Coupon */}
            <div className="space-y-2 pt-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1"><Tag className="w-3 h-3" /> Coupon</p>
              <div className="flex gap-2">
                <input type="text" placeholder="Enter coupon..." value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-2 rounded-xl bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                <button onClick={handleApplyCoupon} className="px-4 py-2 rounded-xl bg-secondary text-secondary-foreground text-xs font-semibold">Apply</button>
              </div>
              {couponDiscount > 0 && <p className="text-xs text-emerald-500 font-medium">Coupon: {couponDiscount}% off (−₹{couponAmount.toFixed(0)})</p>}
            </div>
          </>
        )}
      </div>

      {cart.length > 0 && (
        <div className="border-t border-border p-4 space-y-3">
          {/* Payment Methods */}
          <div className="flex gap-1.5">
            {paymentMethods.map(pm => {
              const Icon = pm.icon;
              return (
                <motion.button key={pm.id} whileTap={{ scale: 0.95 }}
                  onClick={() => { setPaymentMethod(pm.id); setShowUpiQr(false); setUpiApproved(false); }}
                  className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-[11px] font-medium transition-colors ${paymentMethod === pm.id ? 'gradient-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                  <Icon className="w-3.5 h-3.5" />{pm.label}
                </motion.button>
              );
            })}
          </div>

          {/* UPI Flow */}
          <AnimatePresence>
            {showUpiQr && upiId && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="rounded-xl bg-card border border-border p-4 flex flex-col items-center gap-3 overflow-hidden">
                <p className="text-xs font-semibold text-foreground">Scan to Pay ₹{grandTotal.toFixed(0)}</p>
                <a href={upiLink} className="block">
                  <QRCodeSVG value={upiLink} size={140} bgColor="transparent" fgColor="hsl(var(--foreground))" level="M" />
                </a>
                <p className="text-[10px] text-muted-foreground">{upiId}</p>
                <p className="text-[10px] text-primary">Tap QR to open UPI app</p>
                {!upiApproved ? (
                  <motion.button whileTap={{ scale: 0.95 }}
                    onClick={() => { setUpiApproved(true); playSuccess(); toast({ title: 'Payment Approved!' }); }}
                    className="w-full py-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 text-sm font-bold flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Approve Payment
                  </motion.button>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-500 text-sm font-semibold">
                    <CheckCircle className="w-4 h-4" /> Payment Approved ✓
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Totals */}
          <div className="space-y-1 text-sm">
            <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>₹{subtotal.toFixed(0)}</span></div>
            <div className="flex justify-between text-muted-foreground"><span>Tax</span><span>₹{taxTotal.toFixed(0)}</span></div>
            {manualDiscount > 0 && <div className="flex justify-between text-emerald-500"><span>Discount</span><span>−₹{manualDiscount.toFixed(0)}</span></div>}
            {couponAmount > 0 && <div className="flex justify-between text-emerald-500"><span>Coupon</span><span>−₹{couponAmount.toFixed(0)}</span></div>}
            <div className="flex justify-between text-base font-bold pt-1 border-t border-border text-foreground"><span>Total</span><span className="gradient-primary-text">₹{grandTotal.toFixed(0)}</span></div>
            {paymentMethod === 'credit' && selectedCustomer && (
              <div className="flex justify-between text-xs text-amber-500 pt-1"><span>New Credit Balance</span><span>₹{(creditBalance + grandTotal).toFixed(0)}</span></div>
            )}
          </div>

          {/* Validation */}
          {(!customerName.trim() && !customerPhone.trim()) && (
            <p className="text-[10px] text-destructive font-medium text-center">⚠ Customer name or phone required to bill</p>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <motion.button whileTap={{ scale: 0.95 }} onClick={clearCart} className="flex-1 py-3 rounded-xl bg-secondary text-secondary-foreground text-sm font-semibold">Clear</motion.button>
            {paymentMethod === 'upi' && upiId && !showUpiQr ? (
              <motion.button whileTap={{ scale: 0.95 }}
                onClick={() => { if (!customerName.trim() && !customerPhone.trim()) { playError(); toast({ title: 'Customer Required', variant: 'destructive' }); return; } setShowUpiQr(true); }}
                className="flex-[2] py-3 rounded-xl gradient-primary text-primary-foreground text-sm font-bold glow-primary flex items-center justify-center gap-2">
                <QrCode className="w-4 h-4" /> Pay ₹{grandTotal.toFixed(0)}
              </motion.button>
            ) : (
              <motion.button whileTap={{ scale: 0.95 }} onClick={handleCharge} disabled={saving || !canCharge()}
                className="flex-[2] py-3 rounded-xl gradient-primary text-primary-foreground text-sm font-bold glow-primary flex items-center justify-center gap-2 disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                {paymentMethod === 'credit' ? `Credit ₹${grandTotal.toFixed(0)}` : paymentMethod === 'upi' && upiApproved ? 'Print Bill' : `Charge ₹${grandTotal.toFixed(0)}`}
              </motion.button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPanel;
