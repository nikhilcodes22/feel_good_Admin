import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CalendarDays,
  MapPin,
  Clock,
  Users,
  Plus,
  Building2,
  User,
  Settings,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';

// Mock events – replace with GET /api/orgrep/my-events
const mockEvents = [
  {
    _id: '1',
    title: 'Beach Cleanup Drive',
    date: '2026-04-05',
    time: '9:00 AM - 12:00 PM',
    location: 'Juhu Beach, Mumbai',
    volunteersEnrolled: 12,
    maxVolunteers: 20,
    status: 'upcoming',
  },
  {
    _id: '2',
    title: 'Community Teaching Session',
    date: '2026-03-18',
    time: '3:00 PM - 5:00 PM',
    location: 'Community Hall, Bandra',
    volunteersEnrolled: 8,
    maxVolunteers: 10,
    status: 'completed',
  },
  {
    _id: '3',
    title: 'Blood Donation Camp',
    date: '2026-04-20',
    time: '10:00 AM - 4:00 PM',
    location: 'City Hospital, Andheri',
    volunteersEnrolled: 5,
    maxVolunteers: 30,
    status: 'upcoming',
  },
  {
    _id: '4',
    title: 'Tree Plantation Drive',
    date: '2026-02-10',
    time: '7:00 AM - 11:00 AM',
    location: 'Sanjay Gandhi Park',
    volunteersEnrolled: 15,
    maxVolunteers: 15,
    status: 'completed',
  },
];

// Mock core volunteers – replace with GET /api/orgrep/core-volunteers
const mockVolunteers = [
  { _id: '1', name: 'Aarav Sharma', phone: '+91 98765 43210', eventsAttended: 8, status: 'active' },
  { _id: '2', name: 'Priya Patel', phone: '+91 87654 32109', eventsAttended: 12, status: 'active' },
  { _id: '3', name: 'Rohan Mehta', phone: '+91 76543 21098', eventsAttended: 5, status: 'active' },
  { _id: '4', name: 'Sneha Gupta', phone: '+91 65432 10987', eventsAttended: 10, status: 'inactive' },
];

const statusColors: Record<string, string> = {
  upcoming: 'bg-primary/10 text-primary',
  completed: 'bg-muted text-muted-foreground',
  cancelled: 'bg-destructive/10 text-destructive',
};

const OrgRepDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [eventFilter, setEventFilter] = useState<'active' | 'past'>('active');

  const activeEvents = mockEvents.filter((e) => e.status === 'upcoming');
  const pastEvents = mockEvents.filter((e) => e.status === 'completed');
  const displayedEvents = eventFilter === 'active' ? activeEvents : pastEvents;

  const stats = [
    { label: 'Active Events', value: activeEvents.length, icon: CalendarDays, color: 'text-primary' },
    { label: 'Past Events', value: pastEvents.length, icon: CheckCircle2, color: 'text-muted-foreground' },
    { label: 'Core Volunteers', value: mockVolunteers.filter((v) => v.status === 'active').length, icon: Users, color: 'text-primary' },
    { label: 'Total Volunteers Engaged', value: mockEvents.reduce((sum, e) => sum + e.volunteersEnrolled, 0), icon: TrendingUp, color: 'text-primary' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Organization Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.firstName || 'OrgRep'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/orgrep/profile')}>
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button className="gradient-primary border-0" size="sm" onClick={() => navigate('/orgrep/events')}>
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6 pb-4 flex flex-col items-center text-center">
              <stat.icon className={`w-6 h-6 mb-2 ${stat.color}`} />
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Button variant="outline" className="h-auto py-3 flex flex-col gap-1" onClick={() => navigate('/orgrep/events')}>
          <CalendarDays className="w-5 h-5 text-primary" />
          <span className="text-xs">My Events</span>
        </Button>
        <Button variant="outline" className="h-auto py-3 flex flex-col gap-1" onClick={() => navigate('/orgrep/volunteers')}>
          <Users className="w-5 h-5 text-primary" />
          <span className="text-xs">Core Volunteers</span>
        </Button>
        <Button variant="outline" className="h-auto py-3 flex flex-col gap-1" onClick={() => navigate('/orgrep/profile?tab=user')}>
          <User className="w-5 h-5 text-primary" />
          <span className="text-xs">My Profile</span>
        </Button>
        <Button variant="outline" className="h-auto py-3 flex flex-col gap-1" onClick={() => navigate('/orgrep/profile?tab=org')}>
          <Building2 className="w-5 h-5 text-primary" />
          <span className="text-xs">Org Profile</span>
        </Button>
      </div>

      {/* Events Section */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Events</CardTitle>
            <Tabs value={eventFilter} onValueChange={(v) => setEventFilter(v as 'active' | 'past')}>
              <TabsList className="h-8">
                <TabsTrigger value="active" className="text-xs px-3 h-7">Active</TabsTrigger>
                <TabsTrigger value="past" className="text-xs px-3 h-7">Past</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {displayedEvents.length === 0 ? (
            <div className="py-8 text-center">
              <CalendarDays className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">
                {eventFilter === 'active' ? 'No active events' : 'No past events'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {displayedEvents.map((event) => (
                <div
                  key={event._id}
                  className="flex items-start justify-between p-3 rounded-lg border bg-card hover:shadow-sm transition-shadow"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{event.title}</p>
                      <Badge variant="secondary" className={`text-xs ${statusColors[event.status]}`}>
                        {event.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="w-3 h-3" />
                        {event.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {event.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {event.location}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <p className="text-sm font-semibold text-foreground">
                      {event.volunteersEnrolled}/{event.maxVolunteers}
                    </p>
                    <p className="text-xs text-muted-foreground">volunteers</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-3 text-primary"
            onClick={() => navigate('/orgrep/events')}
          >
            View all events →
          </Button>
        </CardContent>
      </Card>

      {/* Core Volunteers Section */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Core Volunteers</CardTitle>
            <Button variant="ghost" size="sm" className="text-primary" onClick={() => navigate('/orgrep/volunteers')}>
              View all →
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mockVolunteers.filter((v) => v.status === 'active').slice(0, 5).map((vol) => (
              <div
                key={vol._id}
                className="flex items-center justify-between p-3 rounded-lg border bg-card"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{vol.name}</p>
                    <p className="text-xs text-muted-foreground">{vol.phone}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
                  {vol.eventsAttended} events
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Backend note */}
      <Card className="border-dashed">
        <CardContent className="py-4">
          <p className="text-sm text-muted-foreground text-center">
            📌 <strong>Backend endpoints needed:</strong><br />
            <code>GET /api/orgrep/my-events</code> — Organization events<br />
            <code>GET /api/orgrep/core-volunteers</code> — Core volunteers list
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrgRepDashboard;
