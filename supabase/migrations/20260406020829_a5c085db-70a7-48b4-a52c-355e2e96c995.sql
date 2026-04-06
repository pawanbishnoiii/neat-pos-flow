
-- Subscription plans table
CREATE TABLE public.subscription_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'INR',
  interval text NOT NULL DEFAULT 'month',
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active plans" ON public.subscription_plans
  FOR SELECT TO public USING (is_active = true);

CREATE POLICY "Admins can manage plans" ON public.subscription_plans
  FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- Business subscriptions
CREATE TABLE public.business_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL,
  plan_id uuid REFERENCES public.subscription_plans(id),
  plan_name text NOT NULL DEFAULT 'free',
  status text NOT NULL DEFAULT 'active',
  started_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.business_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can view own subscription" ON public.business_subscriptions
  FOR SELECT TO public USING (is_business_owner(auth.uid(), business_id) OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage subscriptions" ON public.business_subscriptions
  FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- Theme visibility management by admin
CREATE TABLE public.store_theme_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  theme_key text NOT NULL UNIQUE,
  is_active boolean NOT NULL DEFAULT true,
  is_pro_only boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.store_theme_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view theme settings" ON public.store_theme_settings
  FOR SELECT TO public USING (true);

CREATE POLICY "Admins can manage theme settings" ON public.store_theme_settings
  FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- Seed default themes
INSERT INTO public.store_theme_settings (theme_key, is_active, is_pro_only, sort_order) VALUES
  ('suspended', true, false, 0),
  ('starter', true, false, 1),
  ('modern', true, true, 2),
  ('bold', true, true, 3),
  ('luxury', true, true, 4),
  ('auto_service', true, true, 5),
  ('grocery', true, true, 6),
  ('fashion', true, true, 7),
  ('bookshop', true, true, 8);

-- Seed default plans
INSERT INTO public.subscription_plans (name, price, features, sort_order) VALUES
  ('Free', 0, '["5 Products","50 Invoices/mo","Basic Theme","Email Support"]', 0),
  ('Pro', 49, '["Unlimited Products","Unlimited Invoices","All Themes","Priority Support","Backup & Restore","SMTP Email","Custom Domain"]', 1);
