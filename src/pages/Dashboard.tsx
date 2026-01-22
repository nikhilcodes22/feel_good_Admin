import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Heart, LogOut, Building2, Package, Users, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
    navigate('/');
  };

  const quickActions = [
    { icon: Building2, label: 'My Organization', description: 'Manage your organization settings', href: '#' },
    { icon: Package, label: 'Assets', description: 'View and manage assets', href: '#' },
    { icon: Users, label: 'Team', description: 'Manage team members', href: '#' },
    { icon: Settings, label: 'Settings', description: 'Account preferences', href: '#' },
  ];

  return (
    <div className="min-h-screen gradient-warm">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-lg border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
                <Heart className="w-5 h-5 text-primary-foreground fill-current" />
              </div>
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

        {/* Placeholder Content */}
        <div className="mt-8 bg-card rounded-xl p-8 shadow-soft text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-display font-semibold text-foreground mb-2">
            No organization yet
          </h2>
          <p className="text-muted-foreground mb-4">
            Create or join an organization to start managing assets.
          </p>
          <Button className="gradient-primary border-0 shadow-soft hover:shadow-glow transition-shadow">
            Create Organization
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
