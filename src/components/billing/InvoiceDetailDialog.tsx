import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Receipt, Loader2, Printer, Share2, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import dayjs from 'dayjs';
import InvoicePreview from './InvoicePreview';
import { connectPrinter, sendToPrinter, buildReceiptData, PrinterConnection } from '@/lib/ezoPrinter';
import { playBeep, playSuccess, playError } from '@/lib/sounds';

interface InvoiceDetailDialogProps {
  open: boolean;
  onClose: () => void;
  invoice: any;
  businessName?: string;
  onDeleted?: () => void;
}

const InvoiceDetailDialog = ({ open, onClose, invoice, businessName, onDeleted }: InvoiceDetailDialogProps) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReprint, setShowReprint] = useState(false);
  const [printer, setPrinter] = useState<PrinterConnection>({ device: null, characteristic: null, connected: false });
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();
  const invoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !invoice) return;
    setLoading(true);
    supabase.from('invoice_items').select('*').eq('invoice_id', invoice.id).then(({ data }) => {
      setItems(data || []);
      setLoading(false);
    });
  }, [open, invoice?.id]);

  const handleConnectPrinter = async () => {
    const conn = await connectPrinter();
    setPrinter(conn);
    if (conn.connected) { playBeep(); toast({ title: 'Printer Connected!' }); }
    else toast({ title: 'Failed', variant: 'destructive' });
  };

  const handleReprint = async () => {
    if (!printer.connected || !printer.characteristic) return;
    const receiptData = buildReceiptData({
      businessName: businessName || '', businessAddress: '', businessPhone: '', businessGst: '',
      invoiceNumber: invoice.invoice_number, customerName: invoice.customer_name || '', customerPhone: invoice.customer_phone || '',
      items: items.map(i => ({ name: i.product_name, qty: i.quantity, price: Number(i.price), total: Number(i.total) })),
      subtotal: Number(invoice.subtotal), tax: Number(invoice.tax_total), total: Number(invoice.grand_total),
      paymentMethod: invoice.payment_method || 'cash',
    });
    try {
      await sendToPrinter(printer.characteristic, receiptData);
      playSuccess(); toast({ title: 'Reprinted!' });
    } catch (err: any) {
      playError(); toast({ title: 'Print Error', description: err.message, variant: 'destructive' });
    }
  };

  const handleShareWhatsApp = () => {
    const itemsList = items.map(i => `• ${i.product_name} x${i.quantity} = ₹${Number(i.total).toFixed(0)}`).join('\n');
    const msg = `*Invoice: ${invoice.invoice_number}*\n${businessName || ''}\n\n${itemsList}\n\n*Total: ₹${Number(invoice.grand_total).toFixed(0)}*\nPayment: ${(invoice.payment_method || 'cash').toUpperCase()}\n\nThank you!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await supabase.from('invoice_items').delete().eq('invoice_id', invoice.id);
      await supabase.from('invoices').delete().eq('id', invoice.id);
      toast({ title: 'Invoice Deleted' });
      onDeleted?.();
      onClose();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
    setDeleting(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end lg:items-center justify-center" onClick={onClose}>
          <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            onClick={e => e.stopPropagation()} className="w-full max-w-md max-h-[90vh] bg-card rounded-t-3xl lg:rounded-3xl border border-border overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
              <div className="flex items-center gap-2"><Receipt className="w-5 h-5 text-primary" /><h2 className="text-lg font-bold font-display text-foreground">{invoice.invoice_number}</h2></div>
              <button onClick={onClose} className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center"><X className="w-4 h-4 text-foreground" /></button>
            </div>
            <div className="flex-1 p-4 space-y-4 overflow-y-auto no-scrollbar">
              <div className="space-y-1 text-sm">
                <p className="text-muted-foreground">Business: <span className="text-foreground font-semibold">{businessName || 'ZEN POS'}</span></p>
                <p className="text-muted-foreground">Date: <span className="text-foreground">{dayjs(invoice.created_at).format('DD MMM YYYY, h:mm A')}</span></p>
                {invoice.customer_name && <p className="text-muted-foreground">Customer: <span className="text-foreground">{invoice.customer_name}</span></p>}
                {invoice.customer_phone && <p className="text-muted-foreground">Phone: <span className="text-foreground">{invoice.customer_phone}</span></p>}
                <p className="text-muted-foreground">Payment: <span className="text-foreground uppercase">{invoice.payment_method}</span></p>
              </div>

              {loading ? <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div> : (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Items</p>
                  {items.map(item => (
                    <div key={item.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div><p className="text-sm font-semibold text-foreground">{item.product_name}</p><p className="text-xs text-muted-foreground">₹{item.price} × {item.quantity}</p></div>
                      <p className="text-sm font-bold text-foreground">₹{Number(item.total).toFixed(0)}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-1 text-sm border-t border-border pt-3">
                <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>₹{Number(invoice.subtotal).toFixed(0)}</span></div>
                <div className="flex justify-between text-muted-foreground"><span>Tax</span><span>₹{Number(invoice.tax_total).toFixed(0)}</span></div>
                {Number(invoice.discount_total) > 0 && <div className="flex justify-between text-muted-foreground"><span>Discount</span><span>-₹{Number(invoice.discount_total).toFixed(0)}</span></div>}
                <div className="flex justify-between text-base font-bold text-foreground pt-1"><span>Total</span><span className="gradient-primary-text">₹{Number(invoice.grand_total).toFixed(0)}</span></div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="border-t border-border p-4 space-y-2 shrink-0">
              <div className="flex gap-2">
                <motion.button whileTap={{ scale: 0.95 }} onClick={handleConnectPrinter}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 ${printer.connected ? 'bg-emerald-500/10 text-emerald-500' : 'bg-secondary text-secondary-foreground'}`}>
                  <Printer className="w-3.5 h-3.5" />{printer.connected ? 'Connected' : 'Connect Printer'}
                </motion.button>
                <motion.button whileTap={{ scale: 0.95 }} onClick={handleReprint} disabled={!printer.connected}
                  className="flex-1 py-2.5 rounded-xl gradient-primary text-primary-foreground text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-40">
                  <Printer className="w-3.5 h-3.5" /> Reprint Bill
                </motion.button>
              </div>
              <div className="flex gap-2">
                <motion.button whileTap={{ scale: 0.95 }} onClick={handleShareWhatsApp}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 text-xs font-semibold flex items-center justify-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5" /> WhatsApp
                </motion.button>
                <motion.button whileTap={{ scale: 0.95 }} onClick={handleDelete} disabled={deleting}
                  className="flex-1 py-2.5 rounded-xl bg-destructive/10 text-destructive text-xs font-semibold flex items-center justify-center gap-1.5">
                  {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />} Delete
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InvoiceDetailDialog;
