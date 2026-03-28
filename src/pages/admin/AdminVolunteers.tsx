import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';

interface Volunteer {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  gender: string;
  location: string;
  createdAt: string;
}

const AdminVolunteers = () => {
  const [data, setData] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/admin/volunteers')
      .then((res) => setData(res.data.data))
      .catch(() => toast.error('Failed to load volunteers'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Volunteers</h2>
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : data.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">No volunteers found.</p>
      ) : (
        <div className="rounded-md border overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((v) => (
                <TableRow key={v._id}>
                  <TableCell className="font-medium">{v.firstName} {v.lastName}</TableCell>
                  <TableCell>{v.phone}</TableCell>
                  <TableCell>{v.email || '—'}</TableCell>
                  <TableCell>{v.gender || '—'}</TableCell>
                  <TableCell>{v.location || '—'}</TableCell>
                  <TableCell>{format(new Date(v.createdAt), 'dd MMM yyyy')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AdminVolunteers;
