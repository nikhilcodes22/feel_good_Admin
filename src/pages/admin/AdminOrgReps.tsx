import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';

interface OrgRep {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  location: string;
  createdAt: string;
}

const AdminOrgReps = () => {
  const [data, setData] = useState<OrgRep[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/admin/org-reps')
      .then((res) => setData(res.data.data))
      .catch(() => toast.error('Failed to load org reps'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Organization Representatives</h2>
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : data.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">No org reps found.</p>
      ) : (
        <div className="rounded-md border overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((r) => (
                <TableRow key={r._id}>
                  <TableCell className="font-medium">{r.firstName} {r.lastName}</TableCell>
                  <TableCell>{r.phone}</TableCell>
                  <TableCell>{r.email || '—'}</TableCell>
                  <TableCell>{r.location || '—'}</TableCell>
                  <TableCell>{format(new Date(r.createdAt), 'dd MMM yyyy')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AdminOrgReps;
