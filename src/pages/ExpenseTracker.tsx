import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Loader2, Trash2, Pencil, Calendar, IndianRupee, TrendingDown, Filter } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import { useBusiness } from '@/hooks/useBusiness';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { EXPENSE_CATEGORIES } from '@/lib/i18n';
import dayjs from 'dayjs';

const ExpenseTracker = () => {
  const { business } = useBusiness();
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [filterCat, setFilterCat] = useState('all');
  const [form, setForm] = useState({ title: '', amount: '', category: 'general', notes: '', expense_date: dayjs().format('YYYY-MM-DD') });

  const fetchExpenses = async () => {
    if (!business) return;
    setLoading(true);
    const { data } = await supabase.from('expenses').select('*').eq('business_id', business.id).order('expense_date', { ascending: false }).limit(200);
    setExpenses(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchExpenses(); }, [business?.id]);

  const handleSave = async () => {
    if (!business || !form.title.trim() || !form.amount) return;
    setSaving(true);
    const payload = {
      business_id: business.id, title: form.title.trim(), amount: parseFloat(form.amount) || 0,
      category: form.category, notes: form.notes.trim(), expense_date: form.expense_date,
    };
    let error;
    if (editing) ({ error } = await supabase.from('expenses').update(payload).eq('id', editing.id));
    else ({ error } = await supabase.from('expenses').insert(payload));
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else { toast({ title: editing ? 'Updated!' : 'Expense added!' }); resetForm(); fetchExpenses(); }
    setSaving(false);
  };

  const resetForm = () => {
    setShowForm(false); setEditing(null);
    setForm({ title: '', amount: '', category: 'general', notes: '', expense_date: dayjs().format('YYYY-MM-DD') });
  };

  const openEdit = (e: any) => {
    setEditing(e); setShowForm(true);
    setForm({ title: e.title, amount: String(e.amount), category: e.category, notes: e.notes || '', expense_date: e.expense_date });
  };

  const handleDelete = async (id: string) => {
    await supabase.from('expenses').delete().eq('id', id);
    toast({ title: 'Deleted' }); fetchExpenses();
  };

  const filtered = filterCat === 'all' ? expenses : expenses.filter(e => e.category === filterCat);
  const totalExpenses = filtered.reduce((s, e) => s + Number(e.amount), 0);
  const thisMonthExpenses = filtered.filter(e => dayjs(e.expense_date).isSame(dayjs(), 'month')).reduce((s, e) => s + Number(e.amount), 0);

  return (
    <div className="px-4 pt-4 lg:pl-24 max-w-3xl mx-auto space-y-4 pb-24">
      <PageHeader title="Expenses" backTo="/dashboard" actions={
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-primary text-primary-foreground text-xs font-semibold">
          <Plus className="w-4 h-4" /> Add Expense
        </motion.button>
      } />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl glass-card shadow-soft p-4 text-center">
          <TrendingDown className="w-5 h-5 mx-auto text-destructive mb-1" />
          <p className="text-xl font-bold font-display text-foreground">₹{thisMonthExpenses.toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground">This Month</p>
        </div>
        <div className="rounded-2xl glass-card shadow-soft p-4 text-center">
          <IndianRupee className="w-5 h-5 mx-auto text-warning mb-1" />
          <p className="text-xl font-bold font-display text-foreground">₹{totalExpenses.toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground">Total ({filtered.length})</p>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
        <button onClick={() => setFilterCat('all')} className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap ${filterCat === 'all' ? 'gradient-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>All</button>
        {EXPENSE_CATEGORIES.map(c => (
          <button key={c.id} onClick={() => setFilterCat(c.id)} className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap ${filterCat === c.id ? 'gradient-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
            {c.emoji} {c.label.en}
          </button>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl glass-card shadow-soft p-4 space-y-3 border border-primary/20">
          <input type="text" placeholder="Expense Title *" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Amount (₹)</label>
              <input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Date</label>
              <input type="date" value={form.expense_date} onChange={e => setForm(f => ({ ...f, expense_date: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Category</label>
            <div className="grid grid-cols-3 gap-2">
              {EXPENSE_CATEGORIES.map(c => (
                <button key={c.id} onClick={() => setForm(f => ({ ...f, category: c.id }))}
                  className={`px-2 py-2 rounded-xl text-xs font-medium text-center transition-colors ${form.category === c.id ? 'gradient-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                  {c.emoji} {c.label.en}
                </button>
              ))}
            </div>
          </div>
          <input type="text" placeholder="Notes (optional)" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
          <div className="flex gap-2">
            <button onClick={resetForm} className="flex-1 py-2.5 rounded-xl bg-secondary text-secondary-foreground text-sm font-semibold">Cancel</button>
            <motion.button whileTap={{ scale: 0.95 }} disabled={saving || !form.title.trim() || !form.amount} onClick={handleSave}
              className="flex-[2] py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-1">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />} {editing ? 'Update' : 'Add'}
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12"><TrendingDown className="w-10 h-10 mx-auto text-muted-foreground/30 mb-2" /><p className="text-sm text-muted-foreground">No expenses recorded yet</p></div>
      ) : (
        <div className="space-y-2">
          {filtered.map((e, i) => {
            const cat = EXPENSE_CATEGORIES.find(c => c.id === e.category);
            return (
              <motion.div key={e.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.02, 0.3) }}
                className="rounded-2xl glass-card shadow-soft p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-xl">{cat?.emoji || '📝'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{e.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-secondary text-secondary-foreground">{cat?.label.en || e.category}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" />{dayjs(e.expense_date).format('DD MMM YYYY')}</span>
                      </div>
                      {e.notes && <p className="text-xs text-muted-foreground mt-1">{e.notes}</p>}
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <p className="text-sm font-bold text-destructive">-₹{Number(e.amount).toLocaleString()}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <button onClick={() => openEdit(e)} className="p-1 rounded-lg hover:bg-muted"><Pencil className="w-3.5 h-3.5 text-muted-foreground" /></button>
                      <button onClick={() => handleDelete(e.id)} className="p-1 rounded-lg hover:bg-destructive/10"><Trash2 className="w-3.5 h-3.5 text-destructive" /></button>
                    </div>
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

export default ExpenseTracker;
