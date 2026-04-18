import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Loader2 } from 'lucide-react';

const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth" replace />;
  }

  if (!user.isSuperAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <p className="text-destructive font-semibold text-lg">Access denied. SuperAdmin only.</p>
          <a href="/auth" className="text-primary underline">Back to Login</a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
