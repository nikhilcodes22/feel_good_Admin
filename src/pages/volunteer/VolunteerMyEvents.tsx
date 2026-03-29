import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MapPin, Clock } from 'lucide-react';

// Mock data – replace with API call to GET /api/volunteer/my-events
const mockEvents = [
  {
    _id: '1',
    title: 'Beach Cleanup Drive',
    organization: 'Green Earth Foundation',
    date: '2026-04-05',
    time: '9:00 AM - 12:00 PM',
    location: 'Juhu Beach, Mumbai',
    status: 'upcoming',
  },
  {
    _id: '2',
    title: 'Food Distribution',
    organization: 'Helping Hands NGO',
    date: '2026-03-20',
    time: '11:00 AM - 2:00 PM',
    location: 'Andheri West, Mumbai',
    status: 'completed',
  },
  {
    _id: '3',
    title: 'Tree Plantation Drive',
    organization: 'Green Earth Foundation',
    date: '2026-04-15',
    time: '7:00 AM - 10:00 AM',
    location: 'Sanjay Gandhi National Park',
    status: 'upcoming',
  },
];

const statusColors: Record<string, string> = {
  upcoming: 'bg-primary/10 text-primary',
  completed: 'bg-muted text-muted-foreground',
  cancelled: 'bg-destructive/10 text-destructive',
};

const VolunteerMyEvents = () => {
  const [events] = useState(mockEvents);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">My Events</h1>
        <p className="text-muted-foreground">Events you've enrolled in</p>
      </div>

      {events.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <CalendarDays className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-1">No events yet</h3>
            <p className="text-muted-foreground">Browse available events and start volunteering!</p>
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
                <p className="text-sm text-muted-foreground">{event.organization}</p>
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="border-dashed">
        <CardContent className="py-4">
          <p className="text-sm text-muted-foreground text-center">
            📌 <strong>Backend endpoint needed:</strong> <code>GET /api/volunteer/my-events</code> — Returns events the authenticated volunteer has enrolled in.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default VolunteerMyEvents;
