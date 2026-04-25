import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { CalendarDays, User, LogOut, Building2, LayoutDashboard, Users } from 'lucide-react';
import feelgoodLogo from '@/assets/feelgood-logo.png';

const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const role = user?.role;
  const basePath = role === 'orgRep' ? '/orgrep' : '/volunteer';
  const isOrgRep = role === 'orgRep';

  const handleLogout = () => {
    logout();
    navigate('/auth', { replace: true });
  };

  const navItems = isOrgRep
    ? [
        { label: 'Dashboard', path: `${basePath}/dashboard`, icon: LayoutDashboard },
        { label: 'Events', path: `${basePath}/events`, icon: CalendarDays },
        { label: 'Volunteers', path: `${basePath}/volunteers`, icon: Users },
        { label: 'Profile', path: `${basePath}/profile`, icon: Building2 },
      ]
    : [
        { label: 'My Events', path: `${basePath}/my-events`, icon: CalendarDays },
        { label: 'Profile', path: `${basePath}/profile`, icon: User },
      ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top Nav */}
      <header className="border-b bg-card shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          <Link to={basePath} className="flex items-center gap-2">
            <img src={feelgoodLogo} alt="FeelGood" className="w-8 h-8" />
            <span className="font-display font-bold text-lg text-foreground">FeelGood</span>
          </Link>

          <nav className="flex items-center gap-1 overflow-x-auto whitespace-nowrap scrollbar-none">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    size="sm"
                    className={isActive ? 'gradient-primary border-0' : ''}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
