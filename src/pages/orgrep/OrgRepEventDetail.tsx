import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  CalendarDays, MapPin, Clock, Users, ArrowLeft, Star, Phone, Mail,
} from 'lucide-react';

// Mock event detail – replace with GET /api/events/:eventId
const mockEventDetail = {
  _id: '1',
  title: 'Beach Cleanup Drive',
  description: 'Join us for a community beach cleanup drive at Juhu Beach. Help keep our beaches clean and beautiful!',
  date: '2026-04-05',
  time: '9:00 AM - 12:00 PM',
  location: 'Juhu Beach, Mumbai',
  volunteersEnrolled: 3,
  maxVolunteers: 20,
  status: 'upcoming',
  category: 'Environment',
};

// Mock enrolled volunteers – replace with GET /api/events/:eventId/enrolled-volunteers
const mockEnrolledVolunteers = [
  { _id: 'v1', name: 'Aarav Sharma', phone: '+91 98765 43210', email: 'aarav@email.com', isCoreVolunteer: true },
  { _id: 'v2', name: 'Priya Patel', phone: '+91 87654 32109', email: 'priya@email.com', isCoreVolunteer: true },
  { _id: 'v3', name: 'Rohit Kumar', phone: '+91 76543 21098', email: 'rohit@email.com', isCoreVolunteer: false },
];

const statusColors: Record<string, string> = {
  upcoming: 'bg-primary/10 text-primary',
  completed: 'bg-muted text-muted-foreground',
  cancelled: 'bg-destructive/10 text-destructive',
};

const OrgRepEventDetail = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event] = useState(mockEventDetail);
  const [volunteers] = useState(mockEnrolledVolunteers);

  return (
    <div className="space-y-6">
      {/* Back + Header */}
      <div>
        <Button variant="ghost" size="sm" className="mb-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">{event.title}</h1>
            {event.category && (
              <p className="text-sm text-muted-foreground mt-1">{event.category}</p>
            )}
          </div>
          <Badge variant="secondary" className={statusColors[event.status]}>
            {event.status}
          </Badge>
        </div>
      </div>

      {/* Event Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarDays className="w-4 h-4" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{event.volunteersEnrolled}/{event.maxVolunteers} volunteers enrolled</span>
            </div>
          </div>
          {event.description && (
            <p className="mt-4 text-sm text-foreground">{event.description}</p>
          )}
        </CardContent>
      </Card>

      {/* Enrolled Volunteers */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Enrolled Volunteers ({volunteers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {volunteers.length === 0 ? (
            <div className="py-8 text-center">
              <Users className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">No volunteers enrolled yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {volunteers.map((vol) => (
                <div
                  key={vol._id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground">{vol.name}</p>
                        {vol.isCoreVolunteer && (
                          <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 text-[10px] px-1.5 py-0">
                            <Star className="w-3 h-3 mr-0.5" /> Core
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-3 text-xs text-muted-foreground mt-0.5">
                        <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{vol.phone}</span>
                        <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{vol.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Backend note */}
      <Card className="border-dashed">
        <CardContent className="py-4">
          <p className="text-sm text-muted-foreground text-center">
            📌 <strong>Backend endpoints needed:</strong><br />
            <code>GET /api/events/{eventId}</code> — Event details<br />
            <code>GET /api/events/{eventId}/enrolled-volunteers</code> — Enrolled volunteers with isCoreVolunteer flag
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrgRepEventDetail;
