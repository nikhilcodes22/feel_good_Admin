import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';

interface Org {
  _id: string;
  orgName: string;
  orgType: string;
  contactPerson: string;
  email: string;
  phone: string;
  city: string;
  createdAt: string;
}

const AdminOrganizations = () => {
  const [data, setData] = useState<Org[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/admin/organizations')
      .then((res) => setData(res.data.data))
      .catch(() => toast.error('Failed to load organizations'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Organizations</h2>
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : data.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">No organizations found.</p>
      ) : (
        <div className="rounded-md border overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Org Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((o) => (
                <TableRow key={o._id}>
                  <TableCell className="font-medium">{o.orgName}</TableCell>
                  <TableCell>{o.orgType}</TableCell>
                  <TableCell>{o.contactPerson}</TableCell>
                  <TableCell>{o.email}</TableCell>
                  <TableCell>{o.phone}</TableCell>
                  <TableCell>{o.city}</TableCell>
                  <TableCell>{format(new Date(o.createdAt), 'dd MMM yyyy')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AdminOrganizations;
