import { usePage } from "@inertiajs/react";
import {
  Users,
  ShieldCheck,
  Activity,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Stats Card Component
const StatsCard = ({ title, value, description, icon: Icon, trend, trendValue }) => {
  const isPositive = trend === "up";
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            {trend && (
              <span className={`flex items-center ${isPositive ? "text-green-600" : "text-red-600"}`}>
                {isPositive ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
                {trendValue}
              </span>
            )}
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

// Recent Activity Item
const ActivityItem = ({ initials, name, email, action, time }) => (
  <div className="flex items-center gap-4">
    <Avatar className="h-9 w-9">
      <AvatarFallback className="bg-primary/10 text-primary text-xs">
        {initials}
      </AvatarFallback>
    </Avatar>
    <div className="flex-1 space-y-1">
      <p className="text-sm font-medium leading-none">{name}</p>
      <p className="text-xs text-muted-foreground">{email}</p>
    </div>
    <div className="text-right">
      <p className="text-sm font-medium">{action}</p>
      <p className="text-xs text-muted-foreground">{time}</p>
    </div>
  </div>
);

export default function Dashboard() {
  const { auth } = usePage().props;
  const user = auth?.user || { name: "Admin" };

  // Sample data - replace with real data from backend
  const stats = [
    {
      title: "Total Users",
      value: "128",
      description: "from last month",
      icon: Users,
      trend: "up",
      trendValue: "+12%",
    },
    {
      title: "Active Roles",
      value: "5",
      description: "roles configured",
      icon: ShieldCheck,
    },
    {
      title: "Active Sessions",
      value: "24",
      description: "users online now",
      icon: Activity,
      trend: "up",
      trendValue: "+8%",
    },
    {
      title: "System Health",
      value: "99.9%",
      description: "uptime this month",
      icon: TrendingUp,
    },
  ];

  const recentActivities = [
    {
      initials: "JD",
      name: "John Doe",
      email: "john@example.com",
      action: "Login",
      time: "2 min ago",
    },
    {
      initials: "AS",
      name: "Alice Smith",
      email: "alice@example.com",
      action: "Updated profile",
      time: "15 min ago",
    },
    {
      initials: "BW",
      name: "Bob Wilson",
      email: "bob@example.com",
      action: "Created user",
      time: "1 hour ago",
    },
    {
      initials: "CJ",
      name: "Carol Johnson",
      email: "carol@example.com",
      action: "Changed role",
      time: "2 hours ago",
    },
    {
      initials: "DM",
      name: "David Miller",
      email: "david@example.com",
      action: "Login",
      time: "3 hours ago",
    },
  ];

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Selamat datang kembali, {user.name}!
            </h1>
            <p className="text-muted-foreground">
              Berikut ringkasan aktivitas sistem Anda
            </p>
          </div>
          <Button>
            Download Report
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <StatsCard key={index} {...stat} />
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              {/* Overview Chart Placeholder */}
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                  <CardDescription>
                    User activity for the current month
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded-lg">
                    <p className="text-muted-foreground">Chart placeholder</p>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Latest user activities in the system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {recentActivities.map((activity, index) => (
                      <ActivityItem key={index} {...activity} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>
                  Detailed analytics and metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center bg-muted/50 rounded-lg">
                  <p className="text-muted-foreground">Analytics content coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Reports</CardTitle>
                <CardDescription>
                  Generate and download reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center bg-muted/50 rounded-lg">
                  <p className="text-muted-foreground">Reports content coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
