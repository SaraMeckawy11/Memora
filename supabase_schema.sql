-- SQL for Supabase Database setup

-- 1. Projects Table (Drafts)
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT DEFAULT 'Untitled Project',
    content JSONB DEFAULT '{"pages": [], "uploadedImages": []}'::JSONB,
    metadata JSONB DEFAULT '{}'::JSONB,
    is_ordered BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Discount Codes
CREATE TABLE IF NOT EXISTS public.discount_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL, -- 'percentage', 'fixed'
    value FLOAT8 NOT NULL,
    min_order_amount FLOAT8 DEFAULT 0,
    max_discount_amount FLOAT8,
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMPTZ,
    usage_limit INT,
    used_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Templates
CREATE TABLE IF NOT EXISTS public.templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    config JSONB NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Orders
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    
    -- Customer Info
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    
    -- Delivery Address
    street TEXT NOT NULL,
    building TEXT,
    floor TEXT,
    apartment TEXT,
    city TEXT NOT NULL,
    governorate TEXT NOT NULL,
    country TEXT NOT NULL,
    postal_code TEXT,
    
    -- Order Details
    book_size TEXT NOT NULL,
    content JSONB NOT NULL, -- Final point-in-time snapshot of pages/images
    
    status TEXT DEFAULT 'pending',
    
    -- Payment
    payment_method TEXT DEFAULT 'paymob',
    paymob_order_id TEXT,
    transaction_id TEXT,
    amount_cents INT,
    currency TEXT DEFAULT 'EGP',
    paid_at TIMESTAMPTZ,
    
    -- Promo
    promo_code TEXT,
    discount_amount FLOAT8 DEFAULT 0,
    total_price FLOAT8 NOT NULL,
    
    -- Shipping
    tracking_number TEXT,
    shipped_at TIMESTAMPTZ,
    estimated_delivery TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ENABLE RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discount_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

-- POLICIES

-- Projects
CREATE POLICY "Users can view their own projects" ON public.projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own projects" ON public.projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own projects" ON public.projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own projects" ON public.projects FOR DELETE USING (auth.uid() = user_id);

-- Orders
CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Discount Codes & Templates (Public View for consumption)
CREATE POLICY "Public can view active discount codes" ON public.discount_codes FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active templates" ON public.templates FOR SELECT USING (is_active = true);

-- UPDATED_AT TRIGGER
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER discount_codes_updated_at BEFORE UPDATE ON public.discount_codes FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER templates_updated_at BEFORE UPDATE ON public.templates FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
