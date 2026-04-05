import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Loader2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';

interface Registration {
  _id: string;
  applicantPhone: string;
  applicantName: string;
  applicantEmail: string;
  orgName: string;
  orgType: string;
  contactPerson: string;
  orgMobile: string;
  email: string;
  gstin: string;
  description: string;
  address1: string;
  city: string;
  pincode: string;
  logo: string;
  status: string;
  reviewedBy: string | null;
  reviewedAt: string | null;
  rejectionReason: string | null;
  createdAt: string;
}

const statusColor: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  moreInfoNeeded: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
};

const AdminOrgRegistrations = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('pending');
  const [selected, setSelected] = useState<Registration | null>(null);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);
  const [moreInfoOpen, setMoreInfoOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [moreInfoNote, setMoreInfoNote] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = (status?: string) => {
    setLoading(true);
    const params = status && status !== 'all' ? `?status=${status}` : '';
    api.get(`/api/admin/org-registrations${params}`)
      .then((res) => setRegistrations(res.data.data))
      .catch(() => toast.error('Failed to load registrations'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(tab); }, [tab]);

  const handleApprove = async () => {
    if (!selected) return;
    setActionLoading(true);
    try {
      await api.post(`/api/admin/org-registrations/${selected._id}/approve`);
      toast.success('Registration approved');
      setSelected(null);
      setApproveOpen(false);
      fetchData(tab);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to approve');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selected || !reason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    setActionLoading(true);
    try {
      await api.post(`/api/admin/org-registrations/${selected._id}/reject`, { reason });
      toast.success('Registration rejected');
      setSelected(null);
      setRejectOpen(false);
      setReason('');
      fetchData(tab);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to reject');
    } finally {
      setActionLoading(false);
    }
  };

  const handleMoreInfo = async () => {
    if (!selected || !moreInfoNote.trim()) {
      toast.error('Please provide a note');
      return;
    }
    setActionLoading(true);
    try {
      await api.post(`/api/admin/org-registrations/${selected._id}/more-info`, { note: moreInfoNote });
      toast.success('More info requested');
      setSelected(null);
      setMoreInfoOpen(false);
      setMoreInfoNote('');
      fetchData(tab);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to request more info');
    } finally {
      setActionLoading(false);
    }
  };

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Organization Registrations</h2>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="moreInfoNeeded">More Info</TabsTrigger>
        </TabsList>
      </Tabs>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : registrations.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">No registrations found.</p>
      ) : (
        <div className="rounded-md border overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant</TableHead>
                <TableHead>Org Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Applied</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registrations.map((r) => (
                <TableRow key={r._id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelected(r)}>
                  <TableCell className="font-medium">{r.applicantName}</TableCell>
                  <TableCell>{r.orgName}</TableCell>
                  <TableCell>{r.orgType}</TableCell>
                  <TableCell>{r.city}</TableCell>
                  <TableCell>{format(new Date(r.createdAt), 'dd MMM yyyy')}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[r.status] || ''}`}>
                      {r.status === 'moreInfoNeeded' ? 'More Info' : r.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Detail Sheet */}
      <Sheet open={!!selected} onOpenChange={(open) => { if (!open) setSelected(null); }}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.orgName}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                {selected.logo && (
                  <img
                    src={`${API_BASE}${selected.logo}`}
                    alt="Logo"
                    className="h-20 w-20 rounded-lg object-cover border"
                  />
                )}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-muted-foreground">Applicant</p><p className="font-medium">{selected.applicantName}</p></div>
                  <div><p className="text-muted-foreground">Phone</p><p className="font-medium">{selected.applicantPhone}</p></div>
                  <div><p className="text-muted-foreground">Email</p><p className="font-medium">{selected.applicantEmail}</p></div>
                  <div><p className="text-muted-foreground">Org Type</p><p className="font-medium">{selected.orgType}</p></div>
                  <div><p className="text-muted-foreground">Contact Person</p><p className="font-medium">{selected.contactPerson}</p></div>
                  <div><p className="text-muted-foreground">Org Mobile</p><p className="font-medium">{selected.orgMobile}</p></div>
                  <div><p className="text-muted-foreground">Org Email</p><p className="font-medium">{selected.email}</p></div>
                  <div><p className="text-muted-foreground">GSTIN</p><p className="font-medium">{selected.gstin || '—'}</p></div>
                  <div className="col-span-2"><p className="text-muted-foreground">Address</p><p className="font-medium">{selected.address1}, {selected.city} - {selected.pincode}</p></div>
                  <div className="col-span-2"><p className="text-muted-foreground">Description</p><p className="font-medium">{selected.description || '—'}</p></div>
                  <div><p className="text-muted-foreground">Status</p><span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[selected.status] || ''}`}>{selected.status === 'moreInfoNeeded' ? 'More Info Needed' : selected.status}</span></div>
                  {selected.rejectionReason && (
                    <div className="col-span-2"><p className="text-muted-foreground">Rejection Reason</p><p className="font-medium text-destructive">{selected.rejectionReason}</p></div>
                  )}
                </div>
                {selected.status === 'pending' && (
                  <div className="flex gap-3 pt-4">
                    <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => setApproveOpen(true)}>Approve</Button>
                    <Button variant="outline" className="flex-1" onClick={() => setMoreInfoOpen(true)}>Request Info</Button>
                    <Button variant="destructive" className="flex-1" onClick={() => setRejectOpen(true)}>Reject</Button>
                  </div>
                )}
                {selected.status === 'moreInfoNeeded' && (
                  <div className="flex gap-3 pt-4">
                    <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => setApproveOpen(true)}>Approve</Button>
                    <Button variant="destructive" className="flex-1" onClick={() => setRejectOpen(true)}>Reject</Button>
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Approve Confirmation */}
      <Dialog open={approveOpen} onOpenChange={setApproveOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Approve Registration</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to approve <strong>{selected?.orgName}</strong>? This will create the organization and update the applicant's role.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveOpen(false)}>Cancel</Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={handleApprove} disabled={actionLoading}>
              {actionLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Reject Registration</DialogTitle></DialogHeader>
          <Textarea placeholder="Reason for rejection (required)" value={reason} onChange={(e) => setReason(e.target.value)} />
          <DialogFooter>
            <Button variant="outline" onClick={() => { setRejectOpen(false); setReason(''); }}>Cancel</Button>
            <Button variant="destructive" onClick={handleReject} disabled={actionLoading || !reason.trim()}>
              {actionLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* More Info Dialog */}
      <Dialog open={moreInfoOpen} onOpenChange={setMoreInfoOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Request More Information</DialogTitle></DialogHeader>
          <Textarea placeholder="Note to applicant (required)" value={moreInfoNote} onChange={(e) => setMoreInfoNote(e.target.value)} />
          <DialogFooter>
            <Button variant="outline" onClick={() => { setMoreInfoOpen(false); setMoreInfoNote(''); }}>Cancel</Button>
            <Button onClick={handleMoreInfo} disabled={actionLoading || !moreInfoNote.trim()}>
              {actionLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Send Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrgRegistrations;