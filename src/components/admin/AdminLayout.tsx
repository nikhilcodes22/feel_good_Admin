import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import api from '@/lib/api';
import { toast } from 'sonner';
import {
  LayoutDashboard, FileCheck, Users, Heart, Building, Calendar, Building2, LogOut, Menu,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const navItems = [
  { title: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { title: 'Org Registrations', path: '/admin/org-registrations', icon: FileCheck, badge: true },
  { title: 'Users', path: '/admin/users', icon: Users },
  { title: 'Volunteers', path: '/admin/volunteers', icon: Heart },
  { title: 'Org Reps', path: '/admin/org-reps', icon: Building },
  { title: 'Events', path: '/admin/events', icon: Calendar },
  { title: 'Organizations', path: '/admin/organizations', icon: Building2 },
];

interface AdminLayoutProps {
  pendingCount?: number;
}

const AdminLayout = ({ pendingCount = 0 }: AdminLayoutProps) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch { /* ignore */ }
    logout();
    navigate('/admin/login');
    toast.success('Logged out');
  };

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h1 className="text-xl font-bold text-[hsl(207,90%,54%)]">FeelGood Admin</h1>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => { navigate(item.path); setSidebarOpen(false); }}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'bg-[hsl(207,90%,54%)]/10 text-[hsl(207,90%,54%)]'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-left">{item.title}</span>
              {item.badge && pendingCount > 0 && (
                <Badge variant="destructive" className="text-xs px-1.5 py-0.5 min-w-[20px] justify-center">
                  {pendingCount}
                </Badge>
              )}
            </button>
          );
        })}
      </nav>
      <div className="p-3 border-t border-border">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 border-r border-border flex-col bg-card">
        <NavContent />
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed left-0 top-0 bottom-0 w-60 bg-card z-50 shadow-xl">
            <NavContent />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-card">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <span className="text-sm text-muted-foreground hidden sm:block">Welcome back</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">{user?.firstName} {user?.lastName}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="hidden sm:flex">
              <LogOut className="h-4 w-4 mr-1" /> Logout
            </Button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
