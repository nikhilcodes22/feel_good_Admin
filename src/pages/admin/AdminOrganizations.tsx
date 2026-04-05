import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Loader2, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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
  const navigate = useNavigate();
  const [data, setData] = useState<Org[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteOrg, setDeleteOrg] = useState<Org | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = () => {
    setLoading(true);
    api.get('/api/admin/organizations')
      .then((res) => setData(res.data.data))
      .catch(() => toast.error('Failed to load organizations'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async () => {
    if (!deleteOrg) return;
    setDeleting(true);
    try {
      await api.delete(`/api/admin/organizations/${deleteOrg._id}`);
      toast.success('Organization deleted');
      setDeleteOrg(null);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete organization');
    } finally {
      setDeleting(false);
    }
  };

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
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((o) => (
                <TableRow key={o._id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/admin/organizations/${o._id}`)}>
                  <TableCell className="font-medium">{o.orgName}</TableCell>
                  <TableCell>{o.orgType}</TableCell>
                  <TableCell>{o.contactPerson}</TableCell>
                  <TableCell>{o.email}</TableCell>
                  <TableCell>{o.phone}</TableCell>
                  <TableCell>{o.city}</TableCell>
                  <TableCell>{format(new Date(o.createdAt), 'dd MMM yyyy')}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); setDeleteOrg(o); }} title="Delete organization" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Delete Confirmation */}
      <Dialog open={!!deleteOrg} onOpenChange={(open) => { if (!open) setDeleteOrg(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Organization</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete <strong>{deleteOrg?.orgName}</strong>? This will also cascade-delete all events and enrollments. This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOrg(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrganizations;
