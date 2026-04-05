
-- 1. Upgrade business_offers
ALTER TABLE public.business_offers
  ADD COLUMN IF NOT EXISTS max_claims integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS per_user_limit integer DEFAULT 1,
  ADD COLUMN IF NOT EXISTS claimed_count integer DEFAULT 0;

-- 2. Create expenses table
CREATE TABLE public.expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL,
  title text NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  category text NOT NULL DEFAULT 'general',
  notes text DEFAULT '',
  expense_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can view own expenses" ON public.expenses FOR SELECT USING (is_business_owner(auth.uid(), business_id));
CREATE POLICY "Owners can create expenses" ON public.expenses FOR INSERT WITH CHECK (is_business_owner(auth.uid(), business_id));
CREATE POLICY "Owners can update expenses" ON public.expenses FOR UPDATE USING (is_business_owner(auth.uid(), business_id));
CREATE POLICY "Owners can delete expenses" ON public.expenses FOR DELETE USING (is_business_owner(auth.uid(), business_id));
CREATE POLICY "Admins can manage expenses" ON public.expenses FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON public.expenses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. Create credit_ledger table
CREATE TABLE public.credit_ledger (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL,
  customer_id uuid NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  type text NOT NULL DEFAULT 'credit',
  notes text DEFAULT '',
  balance_after numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.credit_ledger ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can view own ledger" ON public.credit_ledger FOR SELECT USING (is_business_owner(auth.uid(), business_id));
CREATE POLICY "Owners can create ledger entries" ON public.credit_ledger FOR INSERT WITH CHECK (is_business_owner(auth.uid(), business_id));
CREATE POLICY "Owners can update ledger entries" ON public.credit_ledger FOR UPDATE USING (is_business_owner(auth.uid(), business_id));
CREATE POLICY "Owners can delete ledger entries" ON public.credit_ledger FOR DELETE USING (is_business_owner(auth.uid(), business_id));
CREATE POLICY "Admins can manage ledger" ON public.credit_ledger FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- 4. Add social fields to businesses
ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS instagram_handle text DEFAULT '',
  ADD COLUMN IF NOT EXISTS youtube_handle text DEFAULT '',
  ADD COLUMN IF NOT EXISTS whatsapp_number text DEFAULT '',
  ADD COLUMN IF NOT EXISTS contact_email text DEFAULT '',
  ADD COLUMN IF NOT EXISTS pincode text DEFAULT '',
  ADD COLUMN IF NOT EXISTS google_map_url text DEFAULT '';

-- 5. Add language and last_sign_in_at to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS language text NOT NULL DEFAULT 'en',
  ADD COLUMN IF NOT EXISTS last_sign_in_at timestamptz;

-- 6. Create notifications table
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid,
  user_id uuid NOT NULL,
  title text NOT NULL,
  message text DEFAULT '',
  type text NOT NULL DEFAULT 'info',
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notifications" ON public.notifications FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all notifications" ON public.notifications FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "System can insert notifications" ON public.notifications FOR INSERT WITH CHECK (true);
