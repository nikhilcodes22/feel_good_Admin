import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Assets from "./pages/Assets";
import Terms from "./pages/Terms";
import SpaceManagement from "./pages/SpaceManagement";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

// App layout & protected route for volunteer/orgrep
import AppLayout from "./components/AppLayout";
import AppProtectedRoute from "./components/AppProtectedRoute";

// Volunteer pages
import VolunteerMyEvents from "./pages/volunteer/VolunteerMyEvents";
import VolunteerProfile from "./pages/volunteer/VolunteerProfile";

// OrgRep pages
import OrgRepDashboard from "./pages/orgrep/OrgRepDashboard";
import OrgRepMyEvents from "./pages/orgrep/OrgRepMyEvents";
import OrgRepVolunteers from "./pages/orgrep/OrgRepVolunteers";
import OrgRepProfile from "./pages/orgrep/OrgRepProfile";
import OrgRepEventDetail from "./pages/orgrep/OrgRepEventDetail";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrgRegistrations from "./pages/admin/AdminOrgRegistrations";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminVolunteers from "./pages/admin/AdminVolunteers";
import AdminOrgReps from "./pages/admin/AdminOrgReps";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminOrganizations from "./pages/admin/AdminOrganizations";
import AdminOrgDetail from "./pages/admin/AdminOrgDetail";
import AdminLayout from "./components/admin/AdminLayout";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/assets" element={<ProtectedRoute><Assets /></ProtectedRoute>} />
            <Route path="/space-management" element={<ProtectedRoute><SpaceManagement /></ProtectedRoute>} />
            <Route path="/terms" element={<Terms />} />

            {/* Volunteer routes */}
            <Route path="/volunteer" element={<AppProtectedRoute allowedRoles={['volunteer']}><AppLayout /></AppProtectedRoute>}>
              <Route index element={<Navigate to="/volunteer/my-events" replace />} />
              <Route path="my-events" element={<VolunteerMyEvents />} />
              <Route path="profile" element={<VolunteerProfile />} />
            </Route>

            {/* OrgRep routes */}
            <Route path="/orgrep" element={<AppProtectedRoute allowedRoles={['orgRep', 'superAdmin']}><AppLayout /></AppProtectedRoute>}>
              <Route index element={<Navigate to="/orgrep/dashboard" replace />} />
              <Route path="dashboard" element={<OrgRepDashboard />} />
              <Route path="events" element={<OrgRepMyEvents />} />
              <Route path="events/:eventId" element={<OrgRepEventDetail />} />
              <Route path="volunteers" element={<OrgRepVolunteers />} />
              <Route path="profile" element={<OrgRepProfile />} />
            </Route>

            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="org-registrations" element={<AdminOrgRegistrations />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="volunteers" element={<AdminVolunteers />} />
              <Route path="org-reps" element={<AdminOrgReps />} />
              <Route path="events" element={<AdminEvents />} />
              <Route path="organizations" element={<AdminOrganizations />} />
              <Route path="organizations/:id" element={<AdminOrgDetail />} />
              <Route path="org-registrations/:id" element={<AdminOrgDetail />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
