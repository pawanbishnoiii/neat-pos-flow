import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Loader2, IndianRupee, TrendingUp, TrendingDown, Users, Calendar } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import { useBusiness } from '@/hooks/useBusiness';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import dayjs from 'dayjs';

const CreditLedger = () => {
  const { business } = useBusiness();
  const { toast } = useToast();
  const [entries, setEntries] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [form, setForm] = useState({ customer_id: '', amount: '', type: 'credit', notes: '' });

  const fetchData = async () => {
    if (!business) return;
    setLoading(true);
    const [ledger, custs] = await Promise.all([
      supabase.from('credit_ledger').select('*').eq('business_id', business.id).order('created_at', { ascending: false }).limit(200),
      supabase.from('customers').select('id, full_name, phone').eq('business_id', business.id).order('full_name'),
    ]);
    setEntries(ledger.data || []);
    setCustomers(custs.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [business?.id]);

  const getCustomerBalance = (customerId: string) => {
    return entries.filter(e => e.customer_id === customerId)
      .reduce((bal, e) => e.type === 'credit' ? bal + Number(e.amount) : bal - Number(e.amount), 0);
  };

  const handleSave = async () => {
    if (!business || !form.customer_id || !form.amount) return;
    setSaving(true);
    const amount = parseFloat(form.amount) || 0;
    const currentBal = getCustomerBalance(form.customer_id);
    const newBal = form.type === 'credit' ? currentBal + amount : currentBal - amount;

    const { error } = await supabase.from('credit_ledger').insert({
      business_id: business.id, customer_id: form.customer_id, amount,
      type: form.type, notes: form.notes.trim(), balance_after: newBal,
    });
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else { toast({ title: form.type === 'credit' ? 'Credit added!' : 'Payment recorded!' }); setShowForm(false); setForm({ customer_id: '', amount: '', type: 'credit', notes: '' }); fetchData(); }
    setSaving(false);
  };

  const totalCredit = entries.filter(e => e.type === 'credit').reduce((s, e) => s + Number(e.amount), 0);
  const totalPayments = entries.filter(e => e.type === 'payment').reduce((s, e) => s + Number(e.amount), 0);
  const outstanding = totalCredit - totalPayments;

  // Group by customer
  const customerBalances = customers.map(c => ({
    ...c, balance: getCustomerBalance(c.id),
  })).filter(c => c.balance !== 0).sort((a, b) => b.balance - a.balance);

  const filteredEntries = selectedCustomer ? entries.filter(e => e.customer_id === selectedCustomer) : entries;

  return (
    <div className="px-4 pt-4 lg:pl-24 max-w-3xl mx-auto space-y-4 pb-24">
      <PageHeader title="Credit Ledger (उधार)" backTo="/dashboard" actions={
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-primary text-primary-foreground text-xs font-semibold">
          <Plus className="w-4 h-4" /> Add Entry
        </motion.button>
      } />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl glass-card shadow-soft p-3 text-center">
          <TrendingUp className="w-4 h-4 mx-auto text-destructive mb-1" />
          <p className="text-lg font-bold font-display text-foreground">₹{totalCredit.toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground">Total Credit</p>
        </div>
        <div className="rounded-2xl glass-card shadow-soft p-3 text-center">
          <TrendingDown className="w-4 h-4 mx-auto text-success mb-1" />
          <p className="text-lg font-bold font-display text-foreground">₹{totalPayments.toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground">Received</p>
        </div>
        <div className="rounded-2xl glass-card shadow-soft p-3 text-center">
          <IndianRupee className="w-4 h-4 mx-auto text-warning mb-1" />
          <p className="text-lg font-bold font-display text-foreground">₹{outstanding.toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground">Outstanding</p>
        </div>
      </div>

      {/* Customer balances */}
      {customerBalances.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Outstanding Balances</p>
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
            <button onClick={() => setSelectedCustomer('')} className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap ${!selectedCustomer ? 'gradient-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>All</button>
            {customerBalances.map(c => (
              <button key={c.id} onClick={() => setSelectedCustomer(c.id)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-2 ${selectedCustomer === c.id ? 'gradient-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                {c.full_name} <span className="font-bold">₹{c.balance.toLocaleString()}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Add Form */}
      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl glass-card shadow-soft p-4 space-y-3 border border-primary/20">
          <select value={form.customer_id} onChange={e => setForm(f => ({ ...f, customer_id: e.target.value }))}
            className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
            <option value="">Select Customer *</option>
            {customers.map(c => <option key={c.id} value={c.id}>{c.full_name}{c.phone ? ` (${c.phone})` : ''}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Amount (₹)</label>
              <input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Type</label>
              <div className="flex gap-2">
                {[{ id: 'credit', label: 'उधार (Credit)', color: 'bg-destructive/10 text-destructive' }, { id: 'payment', label: 'Payment', color: 'bg-success/10 text-success' }].map(t => (
                  <button key={t.id} onClick={() => setForm(f => ({ ...f, type: t.id }))}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-colors ${form.type === t.id ? t.color + ' ring-2 ring-current' : 'bg-secondary text-secondary-foreground'}`}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <input type="text" placeholder="Notes (optional)" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
          <div className="flex gap-2">
            <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl bg-secondary text-secondary-foreground text-sm font-semibold">Cancel</button>
            <motion.button whileTap={{ scale: 0.95 }} disabled={saving || !form.customer_id || !form.amount} onClick={handleSave}
              className="flex-[2] py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-1">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />} Add Entry
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Entries */}
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : filteredEntries.length === 0 ? (
        <div className="text-center py-12"><IndianRupee className="w-10 h-10 mx-auto text-muted-foreground/30 mb-2" /><p className="text-sm text-muted-foreground">No credit entries yet</p></div>
      ) : (
        <div className="space-y-2">
          {filteredEntries.map((e, i) => {
            const cust = customers.find(c => c.id === e.customer_id);
            return (
              <motion.div key={e.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.02, 0.3) }}
                className="rounded-2xl glass-card shadow-soft p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">{cust?.full_name || 'Unknown'}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${e.type === 'credit' ? 'bg-destructive/10 text-destructive' : 'bg-success/10 text-success'}`}>
                        {e.type === 'credit' ? '↑ उधार' : '↓ Payment'}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" />{dayjs(e.created_at).format('DD MMM, h:mm A')}</span>
                    </div>
                    {e.notes && <p className="text-xs text-muted-foreground mt-1">{e.notes}</p>}
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${e.type === 'credit' ? 'text-destructive' : 'text-success'}`}>
                      {e.type === 'credit' ? '+' : '-'}₹{Number(e.amount).toLocaleString()}
                    </p>
                    <p className="text-[10px] text-muted-foreground">Bal: ₹{Number(e.balance_after).toLocaleString()}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CreditLedger;
