import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Loader2, Eye, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  role: string;
  gender: string;
  location: string;
  createdAt: string;
}

interface UserDetail extends User {
  dob?: string;
  avatar?: string;
  bio?: string;
}

const roleBadge: Record<string, string> = {
  volunteer: 'bg-blue-100 text-blue-800',
  orgRep: 'bg-purple-100 text-purple-800',
  superAdmin: 'bg-red-100 text-red-800',
};

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [roleChangeUser, setRoleChangeUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState('');
  const [changing, setChanging] = useState(false);
  const [detailUser, setDetailUser] = useState<UserDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchUsers = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (roleFilter !== 'all') params.set('role', roleFilter);
    if (search) params.set('search', search);
    api.get(`/api/admin/users?${params}`)
      .then((res) => setUsers(res.data.data))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, [roleFilter]);

  const handleSearch = () => fetchUsers();

  const handleRoleChange = async () => {
    if (!roleChangeUser || !newRole) return;
    setChanging(true);
    try {
      await api.patch(`/api/admin/users/${roleChangeUser._id}/role`, { role: newRole });
      toast.success('Role updated');
      setRoleChangeUser(null);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update role');
    } finally {
      setChanging(false);
    }
  };

  const handleViewDetail = async (user: User) => {
    setDetailLoading(true);
    setDetailUser(user as UserDetail);
    try {
      const res = await api.get(`/api/admin/users/${user._id}`);
      setDetailUser(res.data.data);
    } catch {
      toast.error('Failed to load user details');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteUser) return;
    setDeleting(true);
    try {
      await api.delete(`/api/admin/users/${deleteUser._id}`);
      toast.success('User deleted');
      setDeleteUser(null);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Users</h2>
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search name, phone, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="sm:max-w-xs"
        />
        <Button variant="outline" onClick={handleSearch}>Search</Button>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="volunteer">Volunteer</SelectItem>
            <SelectItem value="orgRep">Org Rep</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : users.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">No users found.</p>
      ) : (
        <div className="rounded-md border overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u._id}>
                  <TableCell className="font-medium">{u.firstName} {u.lastName}</TableCell>
                  <TableCell>{u.phone}</TableCell>
                  <TableCell>{u.email || '—'}</TableCell>
                  <TableCell><span className={`px-2 py-1 rounded-full text-xs font-medium ${roleBadge[u.role] || ''}`}>{u.role}</span></TableCell>
                  <TableCell>{u.gender || '—'}</TableCell>
                  <TableCell>{u.location || '—'}</TableCell>
                  <TableCell>{format(new Date(u.createdAt), 'dd MMM yyyy')}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleViewDetail(u)} title="View details">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => { setRoleChangeUser(u); setNewRole(u.role); }}>
                        Change Role
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteUser(u)} title="Delete user" className="text-destructive hover:text-destructive">
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

      {/* User Detail Sheet */}
      <Sheet open={!!detailUser} onOpenChange={(open) => { if (!open) setDetailUser(null); }}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          {detailUser && (
            <>
              <SheetHeader>
                <SheetTitle>{detailUser.firstName} {detailUser.lastName}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                {detailLoading && <div className="flex justify-center py-4"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-muted-foreground">Phone</p><p className="font-medium">{detailUser.phone}</p></div>
                  <div><p className="text-muted-foreground">Email</p><p className="font-medium">{detailUser.email || '—'}</p></div>
                  <div><p className="text-muted-foreground">Role</p><span className={`px-2 py-1 rounded-full text-xs font-medium ${roleBadge[detailUser.role] || ''}`}>{detailUser.role}</span></div>
                  <div><p className="text-muted-foreground">Gender</p><p className="font-medium">{detailUser.gender || '—'}</p></div>
                  <div><p className="text-muted-foreground">Location</p><p className="font-medium">{detailUser.location || '—'}</p></div>
                  <div><p className="text-muted-foreground">Joined</p><p className="font-medium">{format(new Date(detailUser.createdAt), 'dd MMM yyyy')}</p></div>
                  {detailUser.dob && <div><p className="text-muted-foreground">Date of Birth</p><p className="font-medium">{format(new Date(detailUser.dob), 'dd MMM yyyy')}</p></div>}
                  {detailUser.bio && <div className="col-span-2"><p className="text-muted-foreground">Bio</p><p className="font-medium">{detailUser.bio}</p></div>}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Role Change Dialog */}
      <Dialog open={!!roleChangeUser} onOpenChange={(open) => { if (!open) setRoleChangeUser(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Change Role — {roleChangeUser?.firstName} {roleChangeUser?.lastName}</DialogTitle></DialogHeader>
          <Select value={newRole} onValueChange={setNewRole}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="volunteer">Volunteer</SelectItem>
              <SelectItem value="orgRep">Org Rep</SelectItem>
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleChangeUser(null)}>Cancel</Button>
            <Button onClick={handleRoleChange} disabled={changing || newRole === roleChangeUser?.role}>
              {changing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteUser} onOpenChange={(open) => { if (!open) setDeleteUser(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete User</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete <strong>{deleteUser?.firstName} {deleteUser?.lastName}</strong>? This will also remove their enrollments. This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteUser(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;