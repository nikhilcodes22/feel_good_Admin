import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/AppLayout";
import AppProtectedRoute from "./components/AppProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";

// Lazy-loaded pages — split into separate chunks for faster initial load
const Index              = lazy(() => import("./pages/Index"));
const Auth               = lazy(() => import("./pages/Auth"));
const Dashboard          = lazy(() => import("./pages/Dashboard"));
const Assets             = lazy(() => import("./pages/Assets"));
const Terms              = lazy(() => import("./pages/Terms"));
const SpaceManagement    = lazy(() => import("./pages/SpaceManagement"));
const NotFound           = lazy(() => import("./pages/NotFound"));

const VolunteerMyEvents  = lazy(() => import("./pages/volunteer/VolunteerMyEvents"));
const VolunteerProfile   = lazy(() => import("./pages/volunteer/VolunteerProfile"));

const OrgRepDashboard    = lazy(() => import("./pages/orgrep/OrgRepDashboard"));
const OrgRepMyEvents     = lazy(() => import("./pages/orgrep/OrgRepMyEvents"));
const OrgRepVolunteers   = lazy(() => import("./pages/orgrep/OrgRepVolunteers"));
const OrgRepProfile      = lazy(() => import("./pages/orgrep/OrgRepProfile"));
const OrgRepEventDetail  = lazy(() => import("./pages/orgrep/OrgRepEventDetail"));

const AdminLogin         = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard     = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminOrgRegistrations = lazy(() => import("./pages/admin/AdminOrgRegistrations"));
const AdminUsers         = lazy(() => import("./pages/admin/AdminUsers"));
const AdminVolunteers    = lazy(() => import("./pages/admin/AdminVolunteers"));
const AdminOrgReps       = lazy(() => import("./pages/admin/AdminOrgReps"));
const AdminEvents        = lazy(() => import("./pages/admin/AdminEvents"));
const AdminOrganizations = lazy(() => import("./pages/admin/AdminOrganizations"));
const AdminOrgDetail     = lazy(() => import("./pages/admin/AdminOrgDetail"));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Suspense fallback={<PageLoader />}>
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
              <Route path="/orgrep" element={<AppProtectedRoute allowedRoles={['orgRep']}><AppLayout /></AppProtectedRoute>}>
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
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
