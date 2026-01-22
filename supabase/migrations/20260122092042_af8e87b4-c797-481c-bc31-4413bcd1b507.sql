-- Create enum for app roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create enum for asset status
CREATE TYPE public.asset_status AS ENUM ('available', 'lent_out', 'maintenance', 'retired');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE (user_id, role)
);

-- Create organizations table
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  logo_url TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create organization_members table (links users to organizations)
CREATE TABLE public.organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'member' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (organization_id, user_id)
);

-- Create asset_categories table
CREATE TABLE public.asset_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create assets table
CREATE TABLE public.assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES public.asset_categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  serial_number TEXT,
  purchase_date DATE,
  purchase_value DECIMAL(12, 2),
  current_value DECIMAL(12, 2),
  status asset_status DEFAULT 'available' NOT NULL,
  image_url TEXT,
  lent_to TEXT,
  lent_date DATE,
  expected_return_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create OTP table for authentication
CREATE TABLE public.otp_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL, -- email or phone
  code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.otp_codes ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to check organization membership
CREATE OR REPLACE FUNCTION public.is_org_member(_user_id UUID, _org_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.organization_members
    WHERE user_id = _user_id
      AND organization_id = _org_id
  )
$$;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User roles policies
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- Organizations policies
CREATE POLICY "Anyone can view organizations" ON public.organizations
  FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create organizations" ON public.organizations
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Org members can update their organization" ON public.organizations
  FOR UPDATE USING (public.is_org_member(auth.uid(), id));

-- Organization members policies
CREATE POLICY "Members can view their organization's members" ON public.organization_members
  FOR SELECT USING (public.is_org_member(auth.uid(), organization_id));
CREATE POLICY "Org admins can manage members" ON public.organization_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.organization_members
      WHERE organization_id = organization_members.organization_id
      AND user_id = auth.uid()
      AND role = 'admin'
    )
  );
CREATE POLICY "Users can see their own memberships" ON public.organization_members
  FOR SELECT USING (auth.uid() = user_id);

-- Asset categories policies
CREATE POLICY "Org members can view categories" ON public.asset_categories
  FOR SELECT USING (public.is_org_member(auth.uid(), organization_id));
CREATE POLICY "Org members can manage categories" ON public.asset_categories
  FOR ALL USING (public.is_org_member(auth.uid(), organization_id));

-- Assets policies
CREATE POLICY "Org members can view assets" ON public.assets
  FOR SELECT USING (public.is_org_member(auth.uid(), organization_id));
CREATE POLICY "Org members can manage assets" ON public.assets
  FOR INSERT WITH CHECK (public.is_org_member(auth.uid(), organization_id));
CREATE POLICY "Org members can update assets" ON public.assets
  FOR UPDATE USING (public.is_org_member(auth.uid(), organization_id));
CREATE POLICY "Org members can delete assets" ON public.assets
  FOR DELETE USING (public.is_org_member(auth.uid(), organization_id));

-- OTP policies (service role only via edge functions)
CREATE POLICY "OTP codes are managed by edge functions" ON public.otp_codes
  FOR ALL USING (false);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, phone)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.phone
  );
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-add creator as org admin
CREATE OR REPLACE FUNCTION public.handle_new_organization()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.organization_members (organization_id, user_id, role)
  VALUES (NEW.id, NEW.created_by, 'admin');
  
  -- Create default categories
  INSERT INTO public.asset_categories (organization_id, name, is_default) VALUES
    (NEW.id, 'Equipment', true),
    (NEW.id, 'Furniture', true),
    (NEW.id, 'Vehicles', true),
    (NEW.id, 'Electronics', true),
    (NEW.id, 'Supplies', true);
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_organization_created
  AFTER INSERT ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_organization();

-- Update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_assets_updated_at
  BEFORE UPDATE ON public.assets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for assets
INSERT INTO storage.buckets (id, name, public) VALUES ('assets', 'assets', true);

-- Storage policies for assets bucket
CREATE POLICY "Authenticated users can upload asset images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'assets' AND auth.uid() IS NOT NULL);
CREATE POLICY "Anyone can view asset images" ON storage.objects
  FOR SELECT USING (bucket_id = 'assets');
CREATE POLICY "Users can update their uploaded images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'assets' AND auth.uid() IS NOT NULL);
CREATE POLICY "Users can delete their uploaded images" ON storage.objects
  FOR DELETE USING (bucket_id = 'assets' AND auth.uid() IS NOT NULL);