import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';

interface Event {
  _id: string;
  eventName: string;
  eventType: string;
  category: string;
  startDate: string;
  endDate: string;
  volunteers: number;
  location: string;
  city: string;
  orgName: string;
  createdAt: string;
}

const AdminEvents = () => {
  const [data, setData] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/admin/events')
      .then((res) => setData(res.data.data))
      .catch(() => toast.error('Failed to load events'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Events</h2>
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : data.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">No events found.</p>
      ) : (
        <div className="rounded-md border overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Volunteers</TableHead>
                <TableHead>Org Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((e) => (
                <TableRow key={e._id}>
                  <TableCell className="font-medium">{e.eventName}</TableCell>
                  <TableCell>{e.category}</TableCell>
                  <TableCell>{e.eventType}</TableCell>
                  <TableCell>{e.location || e.city}</TableCell>
                  <TableCell>{format(new Date(e.startDate), 'dd MMM yyyy')}</TableCell>
                  <TableCell>{e.volunteers}</TableCell>
                  <TableCell>{e.orgName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AdminEvents;
