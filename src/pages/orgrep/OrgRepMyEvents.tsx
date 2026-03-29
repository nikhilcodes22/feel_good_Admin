import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, MapPin, Clock, Users, Plus } from 'lucide-react';

// Mock data – replace with API call to GET /api/orgrep/my-events
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
];

const statusColors: Record<string, string> = {
  upcoming: 'bg-primary/10 text-primary',
  completed: 'bg-muted text-muted-foreground',
  cancelled: 'bg-destructive/10 text-destructive',
};

const OrgRepMyEvents = () => {
  const [events] = useState(mockEvents);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">My Events</h1>
          <p className="text-muted-foreground">Events created by your organization</p>
        </div>
        <Button className="gradient-primary border-0">
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </Button>
      </div>

      {events.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <CalendarDays className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-1">No events yet</h3>
            <p className="text-muted-foreground">Create your first event to start recruiting volunteers!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {events.map((event) => (
            <Card key={event._id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <Badge variant="secondary" className={statusColors[event.status]}>
                    {event.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <CalendarDays className="w-4 h-4" />
                    {event.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {event.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {event.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {event.volunteersEnrolled}/{event.maxVolunteers} volunteers
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="border-dashed">
        <CardContent className="py-4">
          <p className="text-sm text-muted-foreground text-center">
            📌 <strong>Backend endpoint needed:</strong> <code>GET /api/orgrep/my-events</code> — Returns events created by the authenticated orgRep's organization.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrgRepMyEvents;
