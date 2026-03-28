import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Users, Heart, Building, Building2, Calendar, ClipboardList, AlertCircle, Loader2 } from 'lucide-react';

interface Stats {
  totalUsers: number;
  totalVolunteers: number;
  totalOrgReps: number;
  totalOrgs: number;
  totalEvents: number;
  totalEnrollments: number;
  pendingRegistrations: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/admin/stats')
      .then((res) => setStats(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  if (!stats) {
    return <p className="text-center text-muted-foreground py-20">Failed to load dashboard stats.</p>;
  }

  const cards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-500' },
    { label: 'Volunteers', value: stats.totalVolunteers, icon: Heart, color: 'text-pink-500' },
    { label: 'Org Reps', value: stats.totalOrgReps, icon: Building, color: 'text-purple-500' },
    { label: 'Organizations', value: stats.totalOrgs, icon: Building2, color: 'text-indigo-500' },
    { label: 'Events', value: stats.totalEvents, icon: Calendar, color: 'text-green-500' },
    { label: 'Total Enrollments', value: stats.totalEnrollments, icon: ClipboardList, color: 'text-cyan-500' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{c.label}</CardTitle>
              <c.icon className={`h-5 w-5 ${c.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{c.value}</p>
            </CardContent>
          </Card>
        ))}
        {/* Pending Registrations highlighted */}
        <Card
          className="border-orange-300 bg-orange-50 dark:bg-orange-950/20 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/admin/org-registrations')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-400">Pending Registrations</CardTitle>
            <AlertCircle className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">{stats.pendingRegistrations}</p>
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">Click to review →</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
