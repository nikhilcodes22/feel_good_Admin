-- Drop all existing policies on organization_members
DROP POLICY IF EXISTS "Members can view org members" ON public.organization_members;
DROP POLICY IF EXISTS "Org admins can manage members" ON public.organization_members;
DROP POLICY IF EXISTS "Users can see their own memberships" ON public.organization_members;

-- Create a security definer function to check admin status without recursion
CREATE OR REPLACE FUNCTION public.is_org_admin(_user_id uuid, _org_id uuid)
RETURNS boolean
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
      AND role = 'admin'
  )
$$;

-- Policy 1: Users can view their own memberships (no recursion - direct auth.uid check)
CREATE POLICY "Users can view own memberships"
ON public.organization_members
FOR SELECT
USING (auth.uid() = user_id);

-- Policy 2: Members can view other members in their organizations (uses security definer function)
CREATE POLICY "Members can view org memberships"
ON public.organization_members
FOR SELECT
USING (is_org_member(auth.uid(), organization_id));

-- Policy 3: Org admins can insert new members (uses security definer function)
CREATE POLICY "Org admins can add members"
ON public.organization_members
FOR INSERT
WITH CHECK (is_org_admin(auth.uid(), organization_id));

-- Policy 4: Org admins can update members (uses security definer function)
CREATE POLICY "Org admins can update members"
ON public.organization_members
FOR UPDATE
USING (is_org_admin(auth.uid(), organization_id));

-- Policy 5: Org admins can delete members (uses security definer function)
CREATE POLICY "Org admins can delete members"
ON public.organization_members
FOR DELETE
USING (is_org_admin(auth.uid(), organization_id));