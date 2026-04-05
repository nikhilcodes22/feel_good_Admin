import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Loader2, Save, User, Building2 } from 'lucide-react';

const OrgRepProfile = () => {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  // User profile form
  const [userForm, setUserForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    email: '',
    gender: '',
    location: '',
  });

  // Org profile form (mock)
  const [orgForm, setOrgForm] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
  });

  const handleUserChange = (field: string, value: string) => {
    setUserForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleOrgChange = (field: string, value: string) => {
    setOrgForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Call PUT /api/user/profile
    await new Promise((r) => setTimeout(r, 1000));
    toast.success('User profile updated (mock)');
    setIsLoading(false);
  };

  const handleOrgSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Call PUT /api/organizations/by-phone/:phone
    await new Promise((r) => setTimeout(r, 1000));
    toast.success('Organization profile updated (mock)');
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground">Manage your personal and organization profiles</p>
      </div>

      <Tabs defaultValue="user" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="user" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            User Profile
          </TabsTrigger>
          <TabsTrigger value="org" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Organization Profile
          </TabsTrigger>
        </TabsList>

        <TabsContent value="user">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUserSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={userForm.firstName}
                      onChange={(e) => handleUserChange('firstName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={userForm.lastName}
                      onChange={(e) => handleUserChange('lastName', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={userForm.phone} disabled className="bg-muted" />
                  <p className="text-xs text-muted-foreground">Phone number cannot be changed</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userForm.email}
                    onChange={(e) => handleUserChange('email', e.target.value)}
                    placeholder="your@email.com"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Input
                      id="gender"
                      value={userForm.gender}
                      onChange={(e) => handleUserChange('gender', e.target.value)}
                      placeholder="Male / Female / Other"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={userForm.location}
                      onChange={(e) => handleUserChange('location', e.target.value)}
                      placeholder="City, State"
                    />
                  </div>
                </div>
                <Button type="submit" disabled={isLoading} className="gradient-primary border-0">
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="org">
          <Card>
            <CardHeader>
              <CardTitle>Organization Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleOrgSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="orgName">Organization Name</Label>
                  <Input
                    id="orgName"
                    value={orgForm.name}
                    onChange={(e) => handleOrgChange('name', e.target.value)}
                    placeholder="Your organization name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orgDescription">Description</Label>
                  <Textarea
                    id="orgDescription"
                    value={orgForm.description}
                    onChange={(e) => handleOrgChange('description', e.target.value)}
                    placeholder="What your organization does..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orgAddress">Address</Label>
                  <Input
                    id="orgAddress"
                    value={orgForm.address}
                    onChange={(e) => handleOrgChange('address', e.target.value)}
                    placeholder="Full address"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="orgPhone">Phone</Label>
                    <Input
                      id="orgPhone"
                      value={orgForm.phone}
                      onChange={(e) => handleOrgChange('phone', e.target.value)}
                      placeholder="Organization phone"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="orgEmail">Email</Label>
                    <Input
                      id="orgEmail"
                      type="email"
                      value={orgForm.email}
                      onChange={(e) => handleOrgChange('email', e.target.value)}
                      placeholder="org@example.com"
                    />
                  </div>
                </div>
                <Button type="submit" disabled={isLoading} className="gradient-primary border-0">
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="border-dashed">
        <CardContent className="py-4">
          <p className="text-sm text-muted-foreground text-center">
            📌 <strong>Backend endpoints needed:</strong><br />
            <code>GET /api/user/profile</code> — Fetch user profile<br />
            <code>PUT /api/user/profile</code> — Update user profile<br />
            <code>GET /api/organizations/by-phone/:phone</code> — Fetch org details<br />
            <code>PUT /api/organizations/by-phone/:phone</code> — Update org details
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrgRepProfile;
