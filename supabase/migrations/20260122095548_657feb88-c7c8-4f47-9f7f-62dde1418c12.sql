-- Drop the problematic policies that cause recursion
DROP POLICY IF EXISTS "Members can view their organization's members" ON public.organization_members;
DROP POLICY IF EXISTS "Org admins can manage members" ON public.organization_members;

-- Recreate policies without recursion
-- Users can view members of organizations they belong to (direct check, no function call)
CREATE POLICY "Members can view org members"
ON public.organization_members
FOR SELECT
USING (
  organization_id IN (
    SELECT om.organization_id 
    FROM public.organization_members om 
    WHERE om.user_id = auth.uid()
  )
);

-- Org admins can manage members (fixed self-referencing bug)
CREATE POLICY "Org admins can manage members"
ON public.organization_members
FOR ALL
USING (
  EXISTS (
    SELECT 1 
    FROM public.organization_members om
    WHERE om.organization_id = organization_members.organization_id 
      AND om.user_id = auth.uid() 
      AND om.role = 'admin'
  )
);