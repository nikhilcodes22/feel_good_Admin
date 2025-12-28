import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, Building2, Calendar, BarChart3, Settings, ArrowLeft } from "lucide-react";

const Admin = () => {
  const stats = [
    { label: "Total Volunteers", value: "10,234", icon: Users, change: "+12%" },
    { label: "Organizations", value: "567", icon: Building2, change: "+8%" },
    { label: "Active Events", value: "89", icon: Calendar, change: "+24%" },
    { label: "Hours Logged", value: "52.4K", icon: BarChart3, change: "+18%" },
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
          <h1 className="font-display font-bold text-3xl text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Overview of platform activity and management tools.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                <stat.icon className="w-5 h-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-display font-bold">{stat.value}</div>
                <p className="text-xs text-secondary">{stat.change} from last month</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Management Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-medium transition-shadow cursor-pointer">
            <CardHeader>
              <Users className="w-10 h-10 text-primary mb-2" />
              <CardTitle>Manage Volunteers</CardTitle>
              <CardDescription>View, approve, and manage volunteer accounts</CardDescription>
            </CardHeader>
          </Card>
          <Card className="hover:shadow-medium transition-shadow cursor-pointer">
            <CardHeader>
              <Building2 className="w-10 h-10 text-secondary mb-2" />
              <CardTitle>Manage Organizations</CardTitle>
              <CardDescription>Review and approve organization registrations</CardDescription>
            </CardHeader>
          </Card>
          <Card className="hover:shadow-medium transition-shadow cursor-pointer">
            <CardHeader>
              <Calendar className="w-10 h-10 text-accent mb-2" />
              <CardTitle>Manage Events</CardTitle>
              <CardDescription>Oversee all events and volunteer enrollments</CardDescription>
            </CardHeader>
          </Card>
          <Card className="hover:shadow-medium transition-shadow cursor-pointer">
            <CardHeader>
              <BarChart3 className="w-10 h-10 text-primary mb-2" />
              <CardTitle>Analytics</CardTitle>
              <CardDescription>View platform statistics and reports</CardDescription>
            </CardHeader>
          </Card>
          <Card className="hover:shadow-medium transition-shadow cursor-pointer">
            <CardHeader>
              <Settings className="w-10 h-10 text-muted-foreground mb-2" />
              <CardTitle>Settings</CardTitle>
              <CardDescription>Configure platform settings and preferences</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Admin;
