import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Building2, Package, Users, Settings, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { CreateOrganizationDialog } from '@/components/organization/CreateOrganizationDialog';
import feelgoodLogo from '@/assets/feelgood-logo.png';

interface Organization {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isLoadingOrg, setIsLoadingOrg] = useState(true);
  const [userOrganization, setUserOrganization] = useState<Organization | null>(null);
  const [isCreateOrgOpen, setIsCreateOrgOpen] = useState(false);

  const fetchUserOrganization = async () => {
    if (!user) return;

    try {
      // Get user's organization membership
      const { data: membershipData, error: membershipError } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle();

      if (membershipError) {
        console.error('Error fetching membership:', membershipError);
        return;
      }

      if (membershipData?.organization_id) {
        // Fetch organization details
        const { data: orgData, error: orgError } = await supabase
          .from('organizations')
          .select('id, name, description, logo_url')
          .eq('id', membershipData.organization_id)
          .single();

        if (orgError) {
          console.error('Error fetching organization:', orgError);
          return;
        }

        setUserOrganization(orgData);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoadingOrg(false);
    }
  };

  useEffect(() => {
    fetchUserOrganization();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
    navigate('/');
  };

  const handleOrgCreated = () => {
    fetchUserOrganization();
  };

  const quickActions = [
    { icon: Building2, label: 'My Organization', description: 'Manage your organization settings', href: '/organization' },
    { icon: Package, label: 'Assets', description: 'View and manage assets', href: '/assets' },
    { icon: LayoutGrid, label: 'Space Management', description: 'Generate booth layouts for events', href: '/space-management' },
    { icon: Users, label: 'Team', description: 'Manage team members', href: '/team' },
    { icon: Settings, label: 'Settings', description: 'Account preferences', href: '/settings' },
  ];

  return (
    <div className="min-h-screen gradient-warm">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-lg border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img 
                src={feelgoodLogo} 
                alt="FeelGood Logo" 
                className="w-10 h-10"
              />
              <span className="font-display font-bold text-xl text-foreground">
                FeelGood
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden sm:block">
                {user?.email || user?.user_metadata?.phone || 'Welcome'}
              </span>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            Welcome to FeelGood
          </h1>
          <p className="text-muted-foreground">
            Manage your organization's assets and volunteers in one place.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => navigate(action.href)}
              className="bg-card rounded-xl p-6 shadow-soft hover:shadow-medium transition-all text-left group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <action.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-1">
                {action.label}
              </h3>
              <p className="text-sm text-muted-foreground">
                {action.description}
              </p>
            </button>
          ))}
        </div>

        {/* Organization Status */}
        <div className="mt-8 bg-card rounded-xl p-8 shadow-soft">
          {isLoadingOrg ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : userOrganization ? (
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {userOrganization.logo_url ? (
                <img
                  src={userOrganization.logo_url}
                  alt={userOrganization.name}
                  className="w-20 h-20 rounded-xl object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-10 h-10 text-primary" />
                </div>
              )}
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-xl font-display font-semibold text-foreground mb-1">
                  {userOrganization.name}
                </h2>
                {userOrganization.description && (
                  <p className="text-muted-foreground">
                    {userOrganization.description}
                  </p>
                )}
              </div>
              <Button
                onClick={() => navigate('/assets')}
                className="gradient-primary border-0 shadow-soft hover:shadow-glow transition-shadow"
              >
                <Package className="w-4 h-4 mr-2" />
                Manage Assets
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-display font-semibold text-foreground mb-2">
                No organization yet
              </h2>
              <p className="text-muted-foreground mb-4">
                Create or join an organization to start managing assets.
              </p>
              <Button
                onClick={() => setIsCreateOrgOpen(true)}
                className="gradient-primary border-0 shadow-soft hover:shadow-glow transition-shadow"
              >
                Create Organization
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Create Organization Dialog */}
      <CreateOrganizationDialog
        open={isCreateOrgOpen}
        onOpenChange={setIsCreateOrgOpen}
        onSuccess={handleOrgCreated}
      />
    </div>
  );
};

export default Dashboard;
