import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import {
  ArrowLeft, Building2, Phone, Mail, MapPin, Globe, FileText, Loader2, Clock,
  CheckCircle2, XCircle, AlertCircle, Info,
} from 'lucide-react';
import { format } from 'date-fns';

interface OrgDetail {
  _id: string;
  orgName: string;
  orgType: string;
  contactPerson: string;
  email: string;
  phone?: string;
  orgMobile?: string;
  city: string;
  address1?: string;
  pincode?: string;
  gstin?: string;
  darpanId?: string;
  description?: string;
  logo?: string;
  status?: string;
  eventCount?: number;
  createdAt: string;
  applicantName?: string;
  applicantPhone?: string;
  applicantEmail?: string;
}

interface ActivityLog {
  _id: string;
  action: string;
  performedBy: string;
  performedByName?: string;
  comment?: string;
  createdAt: string;
}

interface OrgDocument {
  _id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
}

// Mock activity log
const mockActivityLog: ActivityLog[] = [
  { _id: '1', action: 'submitted', performedBy: 'applicant', performedByName: 'Ramesh Patel', createdAt: '2026-03-20T10:30:00Z' },
  { _id: '2', action: 'info_requested', performedBy: 'admin', performedByName: 'Admin User', comment: 'Please provide Darpan ID', createdAt: '2026-03-21T14:00:00Z' },
  { _id: '3', action: 'info_submitted', performedBy: 'applicant', performedByName: 'Ramesh Patel', createdAt: '2026-03-22T09:15:00Z' },
  { _id: '4', action: 'approved', performedBy: 'admin', performedByName: 'Admin User', comment: 'All documents verified', createdAt: '2026-03-23T11:00:00Z' },
];

// Mock documents
const mockDocuments: OrgDocument[] = [
  { _id: '1', name: 'Registration Certificate', type: 'registration_cert', url: '#', uploadedAt: '2026-03-20T10:30:00Z' },
  { _id: '2', name: 'Darpan ID Card', type: 'darpan_id', url: '#', uploadedAt: '2026-03-22T09:15:00Z' },
  { _id: '3', name: 'PAN Card', type: 'pan_card', url: '#', uploadedAt: '2026-03-20T10:30:00Z' },
];

const actionIcons: Record<string, { icon: React.ReactNode; color: string }> = {
  submitted: { icon: <FileText className="w-4 h-4" />, color: 'text-blue-500' },
  approved: { icon: <CheckCircle2 className="w-4 h-4" />, color: 'text-green-500' },
  rejected: { icon: <XCircle className="w-4 h-4" />, color: 'text-destructive' },
  info_requested: { icon: <AlertCircle className="w-4 h-4" />, color: 'text-orange-500' },
  info_submitted: { icon: <Info className="w-4 h-4" />, color: 'text-blue-500' },
};

const statusColor: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  moreInfoNeeded: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
};

const AdminOrgDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [org, setOrg] = useState<OrgDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activityLog] = useState<ActivityLog[]>(mockActivityLog);
  const [documents] = useState<OrgDocument[]>(mockDocuments);
  const [actionDialog, setActionDialog] = useState<'approved' | 'rejected' | 'info_requested' | null>(null);
  const [actionComment, setActionComment] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Determine if we came from registrations or organizations
  const isRegistration = location.pathname.includes('org-registrations');
  const apiBase = isRegistration
    ? `/api/admin/org-registrations/${id}`
    : `/api/admin/organizations/${id}`;

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    setLoading(true);
    api.get(apiBase)
      .then((res) => setOrg(res.data.data))
      .catch(() => toast.error('Failed to load organization details'))
      .finally(() => setLoading(false));
  }, [apiBase]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!org) {
    return (
      <div className="text-center py-20 text-muted-foreground">Organization not found.</div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back + Title */}
      <div>
        <Button variant="ghost" size="sm" className="mb-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {org.logo && (
              <img
                src={`${API_URL}${org.logo}`}
                alt="Logo"
                className="h-14 w-14 rounded-lg object-cover border"
              />
            )}
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">{org.orgName}</h1>
              <p className="text-sm text-muted-foreground">{org.orgType}</p>
            </div>
          </div>
          {org.status && (
            <Badge className={`${statusColor[org.status] || ''}`}>
              {org.status === 'moreInfoNeeded' ? 'More Info Needed' : org.status}
            </Badge>
          )}
        </div>
      </div>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" /> Organization Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <InfoRow icon={<Building2 className="w-4 h-4" />} label="Org Name" value={org.orgName} />
                <InfoRow icon={<FileText className="w-4 h-4" />} label="Type" value={org.orgType} />
                <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value={org.email} />
                <InfoRow icon={<Phone className="w-4 h-4" />} label="Phone" value={org.phone || org.orgMobile || '—'} />
                <InfoRow icon={<MapPin className="w-4 h-4" />} label="City" value={org.city} />
                {org.pincode && <InfoRow icon={<MapPin className="w-4 h-4" />} label="Pincode" value={org.pincode} />}
                {org.gstin && <InfoRow icon={<FileText className="w-4 h-4" />} label="GSTIN" value={org.gstin} />}
                {org.darpanId && <InfoRow icon={<FileText className="w-4 h-4" />} label="Darpan ID" value={org.darpanId} />}
                {org.contactPerson && <InfoRow icon={<Globe className="w-4 h-4" />} label="Contact Person" value={org.contactPerson} />}
                {org.eventCount !== undefined && <InfoRow icon={<FileText className="w-4 h-4" />} label="Total Events" value={String(org.eventCount)} />}
              </div>
              {org.address1 && (
                <div className="mt-4 text-sm">
                  <p className="text-muted-foreground mb-1">Address</p>
                  <p className="font-medium text-foreground">{org.address1}{org.pincode ? ` - ${org.pincode}` : ''}</p>
                </div>
              )}
              {org.description && (
                <div className="mt-4 text-sm">
                  <p className="text-muted-foreground mb-1">Description</p>
                  <p className="font-medium text-foreground">{org.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Applicant Info (for registrations) */}
          {org.applicantName && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Applicant Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <InfoRow icon={<Globe className="w-4 h-4" />} label="Name" value={org.applicantName} />
                  {org.applicantPhone && <InfoRow icon={<Phone className="w-4 h-4" />} label="Phone" value={org.applicantPhone} />}
                  {org.applicantEmail && <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value={org.applicantEmail} />}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Activity Log Tab */}
        <TabsContent value="activity" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" /> Activity Log
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activityLog.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No activity recorded.</p>
              ) : (
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-4 top-2 bottom-2 w-px bg-border" />
                  <div className="space-y-6">
                    {activityLog.map((log) => {
                      const config = actionIcons[log.action] || { icon: <Clock className="w-4 h-4" />, color: 'text-muted-foreground' };
                      return (
                        <div key={log._id} className="relative flex gap-4 pl-2">
                          <div className={`z-10 w-8 h-8 rounded-full bg-background border-2 flex items-center justify-center shrink-0 ${config.color}`}>
                            {config.icon}
                          </div>
                          <div className="flex-1 pt-0.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium text-sm text-foreground capitalize">
                                {log.action.replace(/_/g, ' ')}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                by {log.performedByName || log.performedBy}
                              </span>
                            </div>
                            {log.comment && (
                              <p className="text-sm text-muted-foreground mt-1 italic">"{log.comment}"</p>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                              {format(new Date(log.createdAt), 'dd MMM yyyy, hh:mm a')}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Backend note */}
          <Card className="border-dashed mt-4">
            <CardContent className="py-4">
              <p className="text-sm text-muted-foreground text-center">
                📌 <strong>Backend endpoint needed:</strong> <code>GET /api/admin/organizations/{id}/activity-log</code>
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" /> Uploaded Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              {documents.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No documents uploaded.</p>
              ) : (
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div
                      key={doc._id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-card"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FileText className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {doc.type.replace(/_/g, ' ')} · Uploaded {format(new Date(doc.uploadedAt), 'dd MMM yyyy')}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href={doc.url} target="_blank" rel="noopener noreferrer">
                          View
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Backend note */}
          <Card className="border-dashed mt-4">
            <CardContent className="py-4">
              <p className="text-sm text-muted-foreground text-center">
                📌 <strong>Backend endpoint needed:</strong> <code>GET /api/admin/organizations/{id}/documents</code>
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-start gap-2">
    <span className="text-muted-foreground mt-0.5">{icon}</span>
    <div>
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="font-medium text-foreground">{value}</p>
    </div>
  </div>
);

export default AdminOrgDetail;
