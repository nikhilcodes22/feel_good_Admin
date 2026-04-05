import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Loader2, Eye, Trash2, Users } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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

interface EventDetail extends Event {
  description?: string;
  enrollmentCount?: number;
  maxVolunteers?: number;
  status?: string;
  orgId?: string;
}

interface Enrollment {
  _id: string;
  userName: string;
  userPhone: string;
  enrolledAt: string;
  status: string;
}

const AdminEvents = () => {
  const [data, setData] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailEvent, setDetailEvent] = useState<EventDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [enrollmentsOpen, setEnrollmentsOpen] = useState(false);
  const [enrollmentsLoading, setEnrollmentsLoading] = useState(false);
  const [enrollmentsEventName, setEnrollmentsEventName] = useState('');
  const [deleteEvent, setDeleteEvent] = useState<Event | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = () => {
    setLoading(true);
    api.get('/api/admin/events')
      .then((res) => setData(res.data.data))
      .catch(() => toast.error('Failed to load events'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleViewDetail = async (event: Event) => {
    setDetailLoading(true);
    setDetailEvent(event as EventDetail);
    try {
      const res = await api.get(`/api/admin/events/${event._id}`);
      setDetailEvent(res.data.data);
    } catch {
      toast.error('Failed to load event details');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleViewEnrollments = async (event: Event) => {
    setEnrollmentsLoading(true);
    setEnrollmentsEventName(event.eventName);
    setEnrollmentsOpen(true);
    try {
      const res = await api.get(`/api/admin/events/${event._id}/enrollments`);
      setEnrollments(res.data.data);
    } catch {
      toast.error('Failed to load enrollments');
    } finally {
      setEnrollmentsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteEvent) return;
    setDeleting(true);
    try {
      await api.delete(`/api/admin/events/${deleteEvent._id}`);
      toast.success('Event deleted');
      setDeleteEvent(null);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete event');
    } finally {
      setDeleting(false);
    }
  };

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
                <TableHead>Actions</TableHead>
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
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleViewDetail(e)} title="View details">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleViewEnrollments(e)} title="View enrollments">
                        <Users className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteEvent(e)} title="Delete event" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Event Detail Sheet */}
      <Sheet open={!!detailEvent} onOpenChange={(open) => { if (!open) setDetailEvent(null); }}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          {detailEvent && (
            <>
              <SheetHeader>
                <SheetTitle>{detailEvent.eventName}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                {detailLoading && <div className="flex justify-center py-4"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-muted-foreground">Category</p><p className="font-medium">{detailEvent.category}</p></div>
                  <div><p className="text-muted-foreground">Type</p><p className="font-medium">{detailEvent.eventType}</p></div>
                  <div><p className="text-muted-foreground">Location</p><p className="font-medium">{detailEvent.location || detailEvent.city}</p></div>
                  <div><p className="text-muted-foreground">City</p><p className="font-medium">{detailEvent.city}</p></div>
                  <div><p className="text-muted-foreground">Start Date</p><p className="font-medium">{format(new Date(detailEvent.startDate), 'dd MMM yyyy')}</p></div>
                  <div><p className="text-muted-foreground">End Date</p><p className="font-medium">{format(new Date(detailEvent.endDate), 'dd MMM yyyy')}</p></div>
                  <div><p className="text-muted-foreground">Volunteers</p><p className="font-medium">{detailEvent.volunteers}</p></div>
                  <div><p className="text-muted-foreground">Organization</p><p className="font-medium">{detailEvent.orgName}</p></div>
                  {detailEvent.enrollmentCount !== undefined && (
                    <div><p className="text-muted-foreground">Enrollments</p><p className="font-medium">{detailEvent.enrollmentCount}</p></div>
                  )}
                  {detailEvent.status && (
                    <div><p className="text-muted-foreground">Status</p><p className="font-medium">{detailEvent.status}</p></div>
                  )}
                  {detailEvent.description && (
                    <div className="col-span-2"><p className="text-muted-foreground">Description</p><p className="font-medium">{detailEvent.description}</p></div>
                  )}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Enrollments Dialog */}
      <Dialog open={enrollmentsOpen} onOpenChange={setEnrollmentsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Enrollments — {enrollmentsEventName}</DialogTitle></DialogHeader>
          {enrollmentsLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : enrollments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No enrollments found.</p>
          ) : (
            <div className="rounded-md border overflow-auto max-h-96">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Enrolled At</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enrollments.map((en) => (
                    <TableRow key={en._id}>
                      <TableCell className="font-medium">{en.userName}</TableCell>
                      <TableCell>{en.userPhone}</TableCell>
                      <TableCell>{format(new Date(en.enrolledAt), 'dd MMM yyyy')}</TableCell>
                      <TableCell>{en.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteEvent} onOpenChange={(open) => { if (!open) setDeleteEvent(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Event</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete <strong>{deleteEvent?.eventName}</strong>? This will also remove all enrollments. This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteEvent(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminEvents;