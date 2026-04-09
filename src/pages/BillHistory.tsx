import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Receipt, Calendar, ChevronRight, Loader2, Download, Filter, TrendingUp, IndianRupee } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import { useBusiness } from '@/hooks/useBusiness';
import { supabase } from '@/integrations/supabase/client';
import dayjs from 'dayjs';
import InvoiceDetailDialog from '@/components/billing/InvoiceDetailDialog';
import { useLanguage } from '@/hooks/useLanguage';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

const BillHistory = () => {
  const { business } = useBusiness();
  const { t } = useLanguage();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<any>(null);
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [paymentFilter, setPaymentFilter] = useState('all');

  useEffect(() => {
    if (!business) return;
    const fetchInvoices = async () => {
      setLoading(true);
      let query = supabase.from('invoices').select('*').eq('business_id', business.id).order('created_at', { ascending: false }).limit(500);
      if (dateFrom) query = query.gte('created_at', dayjs(dateFrom).startOf('day').toISOString());
      if (dateTo) query = query.lte('created_at', dayjs(dateTo).endOf('day').toISOString());
      if (paymentFilter !== 'all') query = query.eq('payment_method', paymentFilter);
      const { data } = await query;
      setInvoices(data || []);
      setLoading(false);
    };
    fetchInvoices();
  }, [business?.id, dateFrom, dateTo, paymentFilter]);

  const filtered = invoices.filter(inv =>
    inv.invoice_number.toLowerCase().includes(search.toLowerCase()) ||
    (inv.customer_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (inv.customer_phone || '').includes(search)
  );

  const totalRevenue = filtered.reduce((s, i) => s + Number(i.grand_total), 0);
  const todayRevenue = filtered.filter(i => dayjs(i.created_at).isSame(dayjs(), 'day')).reduce((s, i) => s + Number(i.grand_total), 0);
  const weekRevenue = filtered.filter(i => dayjs(i.created_at).isAfter(dayjs().subtract(7, 'day'))).reduce((s, i) => s + Number(i.grand_total), 0);

  const exportCSV = () => {
    const headers = ['Invoice #', 'Customer', 'Phone', 'Total', 'Payment', 'Date'];
    const rows = filtered.map(i => [i.invoice_number, i.customer_name || 'Walk-in', i.customer_phone || '', i.grand_total, i.payment_method || 'cash', dayjs(i.created_at).format('DD/MM/YYYY HH:mm')]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `invoices-${dayjs().format('YYYY-MM-DD')}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="px-4 pt-4 lg:pl-24 max-w-4xl mx-auto space-y-4 pb-24">
      <PageHeader title={t('nav.history')} backTo="/dashboard" actions={
        <button onClick={exportCSV} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary text-secondary-foreground text-xs font-semibold">
          <Download className="w-3.5 h-3.5" /> Export CSV
        </button>
      } />

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Today', value: `₹${todayRevenue.toLocaleString()}`, icon: IndianRupee, color: 'text-primary' },
          { label: 'This Week', value: `₹${(weekRevenue / 1000).toFixed(1)}K`, icon: TrendingUp, color: 'text-success' },
          { label: 'Total', value: `₹${(totalRevenue / 1000).toFixed(1)}K`, icon: Receipt, color: 'text-warning' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl glass-card shadow-soft p-3 text-center">
            <s.icon className={`w-4 h-4 ${s.color} mx-auto mb-1`} />
            <p className="text-lg font-bold font-display text-foreground">{s.value}</p>
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-secondary text-secondary-foreground text-xs font-semibold">
              <Calendar className="w-3.5 h-3.5" /> {dateFrom ? dayjs(dateFrom).format('DD MMM') : 'From'}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent mode="single" selected={dateFrom} onSelect={setDateFrom} className={cn("p-3 pointer-events-auto")} />
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-secondary text-secondary-foreground text-xs font-semibold">
              <Calendar className="w-3.5 h-3.5" /> {dateTo ? dayjs(dateTo).format('DD MMM') : 'To'}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent mode="single" selected={dateTo} onSelect={setDateTo} className={cn("p-3 pointer-events-auto")} />
          </PopoverContent>
        </Popover>
        {['all', 'cash', 'upi', 'card'].map(m => (
          <button key={m} onClick={() => setPaymentFilter(m)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${paymentFilter === m ? 'gradient-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
            {m === 'all' ? 'All' : m.toUpperCase()}
          </button>
        ))}
        {(dateFrom || dateTo || paymentFilter !== 'all') && (
          <button onClick={() => { setDateFrom(undefined); setDateTo(undefined); setPaymentFilter('all'); }}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-destructive/10 text-destructive">Clear</button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input type="text" placeholder="Search by invoice #, customer name or phone..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
      </div>

      <div className="text-xs text-muted-foreground">{filtered.length} invoices</div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12"><Receipt className="w-10 h-10 mx-auto text-muted-foreground/30 mb-2" /><p className="text-sm text-muted-foreground">No invoices found</p></div>
      ) : (
        <div className="space-y-2">
          {filtered.map((inv, i) => (
            <motion.button key={inv.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.02, 0.3) }}
              onClick={() => setSelected(inv)}
              className="w-full flex items-center gap-3 p-4 rounded-2xl glass-card shadow-soft text-left hover:shadow-elevated transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Receipt className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">{inv.invoice_number}</p>
                  <p className="text-sm font-bold text-foreground">₹{Number(inv.grand_total).toFixed(0)}</p>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <p className="text-xs text-muted-foreground truncate">{inv.customer_name || 'Walk-in'} {inv.customer_phone ? `• ${inv.customer_phone}` : ''}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${inv.payment_method === 'upi' ? 'bg-violet-100 text-violet-700' : inv.payment_method === 'card' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                      {(inv.payment_method || 'cash').toUpperCase()}
                    </span>
                    <Calendar className="w-3 h-3 ml-1" />
                    {dayjs(inv.created_at).format('DD MMM, h:mm A')}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
            </motion.button>
          ))}
        </div>
      )}

      {selected && <InvoiceDetailDialog open={!!selected} onClose={() => setSelected(null)} invoice={selected} businessName={business?.business_name}
        onDeleted={() => { setInvoices(prev => prev.filter(i => i.id !== selected.id)); setSelected(null); }} />}
    </div>
  );
};

export default BillHistory;
