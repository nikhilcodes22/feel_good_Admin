import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Users, Building2, Calendar, BarChart3, ArrowLeft, Search, CheckCircle, XCircle, Clock, MessageSquare } from "lucide-react";
import OrgDetailSheet, { type Organization } from "@/components/admin/OrgDetailSheet";
import { dummyOrganizations } from "@/components/admin/dummyOrgs";
import { toast } from "sonner";

const statusConfig: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
  pending: { label: "Pending", className: "bg-accent/20 text-accent-foreground border-accent/30", icon: <Clock className="w-3 h-3" /> },
  approved: { label: "Approved", className: "bg-secondary/20 text-secondary border-secondary/30", icon: <CheckCircle className="w-3 h-3" /> },
  rejected: { label: "Rejected", className: "bg-destructive/20 text-destructive border-destructive/30", icon: <XCircle className="w-3 h-3" /> },
  info_requested: { label: "Info Requested", className: "bg-primary/20 text-primary border-primary/30", icon: <MessageSquare className="w-3 h-3" /> },
};

const Admin = () => {
  const [organizations, setOrganizations] = useState<Organization[]>(dummyOrganizations);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredOrgs = organizations.filter((org) => {
    const matchesSearch =
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.contactPerson.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || org.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOrgClick = (org: Organization) => {
    setSelectedOrg(org);
    setSheetOpen(true);
  };

  const handleAction = (orgId: string, action: "approved" | "rejected" | "info_requested", comment: string) => {
    setOrganizations((prev) =>
      prev.map((o) => (o.id === orgId ? { ...o, status: action } : o))
    );
    const actionLabels = { approved: "approved", rejected: "rejected", info_requested: "requested more info for" };
    toast.success(`Successfully ${actionLabels[action]} the organization.${comment ? ` Comment: "${comment}"` : ""}`);
  };

  const counts = {
    total: organizations.length,
    pending: organizations.filter((o) => o.status === "pending").length,
    approved: organizations.filter((o) => o.status === "approved").length,
    rejected: organizations.filter((o) => o.status === "rejected").length,
  };

  const stats = [
    { label: "Total Orgs", value: counts.total, icon: Building2, color: "text-primary" },
    { label: "Pending", value: counts.pending, icon: Clock, color: "text-accent" },
    { label: "Approved", value: counts.approved, icon: CheckCircle, color: "text-secondary" },
    { label: "Rejected", value: counts.rejected, icon: XCircle, color: "text-destructive" },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                  <Heart className="w-4 h-4 text-primary-foreground fill-current" />
                </div>
                <span className="font-display font-bold text-lg">FeelGood</span>
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="font-medium">Admin Dashboard</span>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Site</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl text-foreground mb-2">Organization Management</h1>
          <p className="text-muted-foreground">Review and manage enrolled organization registrations.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-4 p-4">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
                <div>
                  <p className="text-2xl font-display font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, city, or contact..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="info_requested">Info Requested</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Org Table */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Enrolled Organizations</CardTitle>
            <CardDescription>{filteredOrgs.length} organization{filteredOrgs.length !== 1 ? "s" : ""} found</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organization</TableHead>
                  <TableHead className="hidden md:table-cell">Contact</TableHead>
                  <TableHead className="hidden lg:table-cell">City</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Submitted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrgs.map((org) => {
                  const status = statusConfig[org.status];
                  return (
                    <TableRow
                      key={org.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleOrgClick(org)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 rounded-lg">
                            <AvatarImage src={org.logoUrl} />
                            <AvatarFallback className="rounded-lg bg-primary/10 text-primary text-xs font-bold">
                              {org.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm text-primary hover:underline">{org.name}</p>
                            <p className="text-xs text-muted-foreground md:hidden">{org.contactPerson}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <p className="text-sm">{org.contactPerson}</p>
                        <p className="text-xs text-muted-foreground">{org.email}</p>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm">{org.city}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`gap-1 text-xs ${status.className}`}>
                          {status.icon} {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">{org.submittedAt}</TableCell>
                    </TableRow>
                  );
                })}
                {filteredOrgs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                      No organizations found matching your criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

      <OrgDetailSheet
        org={selectedOrg}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onAction={handleAction}
      />
    </div>
  );
};

export default Admin;
