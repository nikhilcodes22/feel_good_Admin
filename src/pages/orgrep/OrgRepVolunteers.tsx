import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, User, Search, Phone } from 'lucide-react';

// Mock data – replace with GET /api/core-volunteers/organization/:organizationId
const mockVolunteers = [
  { _id: '1', name: 'Aarav Sharma', phone: '+91 98765 43210', email: 'aarav@email.com', eventsAttended: 8, status: 'active' },
  { _id: '2', name: 'Priya Patel', phone: '+91 87654 32109', email: 'priya@email.com', eventsAttended: 12, status: 'active' },
  { _id: '3', name: 'Rohan Mehta', phone: '+91 76543 21098', email: 'rohan@email.com', eventsAttended: 5, status: 'active' },
  { _id: '4', name: 'Sneha Gupta', phone: '+91 65432 10987', email: 'sneha@email.com', eventsAttended: 10, status: 'inactive' },
  { _id: '5', name: 'Kiran Desai', phone: '+91 54321 09876', email: 'kiran@email.com', eventsAttended: 3, status: 'active' },
];

const OrgRepVolunteers = () => {
  const [search, setSearch] = useState('');

  const filtered = mockVolunteers.filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Core Volunteers</h1>
        <p className="text-muted-foreground">Volunteers associated with your organization</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-1">No volunteers found</h3>
            <p className="text-muted-foreground">No volunteers match your search criteria.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {filtered.map((vol) => (
            <Card key={vol._id} className="hover:shadow-sm transition-shadow">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{vol.name}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {vol.phone}
                        </span>
                        <span>{vol.email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
                      {vol.eventsAttended} events
                    </Badge>
                    <Badge
                      variant="secondary"
                      className={
                        vol.status === 'active'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-muted text-muted-foreground'
                      }
                    >
                      {vol.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="border-dashed">
        <CardContent className="py-4">
          <p className="text-sm text-muted-foreground text-center">
            📌 <strong>Backend endpoint needed:</strong> <code>GET /api/core-volunteers/organization/:organizationId</code> — Returns core volunteers for the org.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrgRepVolunteers;
