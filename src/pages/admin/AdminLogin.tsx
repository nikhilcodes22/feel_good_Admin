import { Navigate } from 'react-router-dom';

/**
 * AdminLogin is no longer a separate login page.
 * Single login flow at /auth handles all users.
 * isSuperAdmin users are redirected to /admin/dashboard after login.
 */
const AdminLogin = () => <Navigate to="/auth" replace />;

export default AdminLogin;
