import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2, MessageSquareHeart, Search, Star, Trash2 } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import { useBusiness } from '@/hooks/useBusiness';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

type Review = { id: string; reviewer_name: string; reviewer_email: string | null; review_text: string | null; rating: number; is_approved: boolean; created_at: string; products: { name: string } | null };

const ReviewsPage = () => {
  const { business } = useBusiness();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('pending');

  useEffect(() => {
    if (!business) return;
    const fetchReviews = async () => {
      setLoading(true);
      const { data } = await supabase.from('product_reviews').select('*, products(name)').eq('business_id', business.id).order('created_at', { ascending: false });
      setReviews((data || []) as Review[]);
      setLoading(false);
    };
    void fetchReviews();
  }, [business]);
  const visible = useMemo(() => reviews.filter((review) => (filter === 'all' || (filter === 'approved' ? review.is_approved : !review.is_approved)) && `${review.reviewer_name} ${review.products?.name || ''}`.toLowerCase().includes(query.toLowerCase())), [reviews, query, filter]);
  const approve = async (id: string) => { await supabase.from('product_reviews').update({ is_approved: true }).eq('id', id); setReviews((items) => items.map((item) => item.id === id ? { ...item, is_approved: true } : item)); toast({ title: 'Review approved' }); };
  const remove = async (id: string) => { await supabase.from('product_reviews').delete().eq('id', id); setReviews((items) => items.filter((item) => item.id !== id)); toast({ title: 'Review removed' }); };

  return <div className="mx-auto max-w-6xl space-y-5 px-4 pt-4 pb-24 lg:pl-24"><PageHeader title="Reviews" backTo="/modules" /><section className="grid gap-4 md:grid-cols-[1.4fr_.6fr]"><div className="rounded-[30px] bg-gradient-to-br from-[#7050db] to-[#9b7cff] p-7 text-white"><MessageSquareHeart className="h-9 w-9" /><h1 className="mt-8 font-display text-4xl font-black tracking-[-.055em]">Turn feedback into trust.</h1><p className="mt-3 text-sm text-white/65">Approve genuine reviews before they appear on your public store.</p></div><div className="rounded-[30px] bg-[#c9f26a] p-7"><p className="text-xs font-black uppercase tracking-wider">Average rating</p><p className="mt-8 font-display text-5xl font-black">{reviews.length ? (reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length).toFixed(1) : '—'}</p><div className="mt-2 flex text-[#141b34]">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}</div><p className="mt-3 text-xs font-bold text-[#141b34]/55">{reviews.length} total reviews</p></div></section><div className="flex flex-col gap-3 rounded-[24px] border border-white/80 bg-white/70 p-3 backdrop-blur-xl md:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8d91a0]" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search customer or product" className="w-full rounded-[16px] bg-[#f4f1eb] py-3 pl-10 pr-4 text-sm outline-none focus:ring-4 focus:ring-[#7050db]/10" /></div><div className="flex gap-2">{(['pending', 'approved', 'all'] as const).map((value) => <button key={value} onClick={() => setFilter(value)} className={`rounded-[14px] px-4 py-2 text-xs font-extrabold capitalize ${filter === value ? 'bg-[#141b34] text-white' : 'bg-[#f4f1eb] text-[#74798a]'}`}>{value}</button>)}</div></div>{loading ? <div className="grid min-h-52 place-items-center"><Loader2 className="h-7 w-7 animate-spin text-[#ff5d3b]" /></div> : <div className="grid gap-4 md:grid-cols-2">{visible.map((review) => <motion.article layout key={review.id} className="rounded-[27px] border border-white/80 bg-white/75 p-5 shadow-[0_14px_38px_rgba(20,27,52,.06)] backdrop-blur-xl"><div className="flex items-start justify-between"><div><p className="font-display text-lg font-black">{review.reviewer_name}</p><p className="text-xs text-[#8d91a0]">{review.products?.name || 'Store review'}</p></div><div className="flex text-[#ffb400]">{Array.from({ length: review.rating }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}</div></div><p className="mt-4 min-h-12 text-sm leading-6 text-[#5f6577]">{review.review_text || 'No written comment.'}</p><div className="mt-5 flex items-center justify-between"><span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase ${review.is_approved ? 'bg-[#c9f26a] text-[#315300]' : 'bg-[#ffd84d] text-[#6b5200]'}`}>{review.is_approved ? 'Live' : 'Pending'}</span><div className="flex gap-2">{!review.is_approved && <button onClick={() => approve(review.id)} className="grid h-9 w-9 place-items-center rounded-xl bg-[#141b34] text-white"><Check className="h-4 w-4" /></button>}<button onClick={() => remove(review.id)} className="grid h-9 w-9 place-items-center rounded-xl bg-[#ff5d3b]/10 text-[#ff5d3b]"><Trash2 className="h-4 w-4" /></button></div></div></motion.article>)}</div>}{!loading && visible.length === 0 && <div className="rounded-[28px] border border-dashed border-[#141b34]/15 bg-white/45 py-14 text-center"><MessageSquareHeart className="mx-auto h-10 w-10 text-[#141b34]/20" /><p className="mt-3 text-sm font-bold text-[#74798a]">No reviews in this view</p></div>}</div>;
};
export default ReviewsPage;
