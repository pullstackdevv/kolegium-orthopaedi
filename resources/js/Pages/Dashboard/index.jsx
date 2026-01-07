import { usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import {
  Users,
  GraduationCap,
  Building2,
  Calendar,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  UserPlus,
  CalendarPlus,
  FileText,
  Settings,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@inertiajs/react";
import api from "@/api/axios";

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
  const { auth, stats: dashboardStats } = usePage().props;
  const user = auth?.user || { name: "Admin" };

  // Use stats from props (sent by controller)
  const stats = dashboardStats || {
    totalMembers: 0,
    totalAffiliations: 0,
    activePrograms: 0,
    upcomingEvents: 0,
    membersByProgram: {},
    membersByStatus: {},
    recentMembers: [],
    upcomingAgenda: [],
  };

  const loading = false; // No loading state needed since data comes from props

  const statsCards = [
    {
      title: "Total Members",
      value: loading ? "..." : stats.totalMembers.toString(),
      description: "Registered members",
      icon: Users,
      href: "/cms/database",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Programs",
      value: loading ? "..." : stats.activePrograms.toString(),
      description: "Study programs",
      icon: GraduationCap,
      href: "/cms/database",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Affiliations",
      value: loading ? "..." : stats.totalAffiliations.toString(),
      description: "Partner universities",
      icon: Building2,
      href: "/cms/settings/affiliations",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Upcoming Events",
      value: loading ? "..." : stats.upcomingEvents.toString(),
      description: "Scheduled agenda",
      icon: Calendar,
      href: "/cms/agenda",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  const quickActions = [
    {
      label: "Add Member",
      icon: UserPlus,
      href: "/cms/database",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Create Event",
      icon: CalendarPlus,
      href: "/cms/agenda",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Generate Report",
      icon: FileText,
      href: "/cms/database",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/cms/settings",
      color: "text-gray-600",
      bgColor: "bg-gray-50",
    },
  ];

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { label: "Active", class: "bg-green-100 text-green-800" },
      inactive: { label: "Inactive", class: "bg-gray-100 text-gray-800" },
      graduated: { label: "Graduated", class: "bg-blue-100 text-blue-800" },
      suspended: { label: "Suspended", class: "bg-red-100 text-red-800" },
    };
    const config = statusConfig[status] || { label: status, class: "bg-gray-100 text-gray-800" };
    return <Badge className={config.class}>{config.label}</Badge>;
  };

  const getProgramLabel = (type) => {
    const labels = {
      resident: "PPDS 1",
      trainee: "Subspesialis",
      fellow: "Clinical Fellowship",
    };
    return labels[type] || type;
  };

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
              Berikut ringkasan sistem E-Dashboard Kolegium Orthopaedi
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statsCards.map((stat, index) => (
            <Link key={index} href={stat.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`h-10 w-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Akses cepat ke fitur utama</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href}>
                  <Button
                    variant="outline"
                    className="w-full h-24 flex flex-col items-center justify-center gap-2 hover:shadow-md transition-shadow"
                  >
                    <div className={`h-10 w-10 rounded-lg ${action.bgColor} flex items-center justify-center`}>
                      <action.icon className={`h-5 w-5 ${action.color}`} />
                    </div>
                    <span className="text-sm font-medium">{action.label}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Members Distribution */}
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Members Distribution</CardTitle>
              <CardDescription>
                Distribusi anggota berdasarkan program studi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(stats.membersByProgram).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <GraduationCap className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{getProgramLabel(type)}</p>
                        <p className="text-xs text-muted-foreground">{count} members</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{count}</p>
                      <p className="text-xs text-muted-foreground">
                        {stats.totalMembers > 0 ? Math.round((count / stats.totalMembers) * 100) : 0}%
                      </p>
                    </div>
                  </div>
                ))}
                {Object.keys(stats.membersByProgram).length === 0 && !loading && (
                  <div className="text-center py-8 text-muted-foreground">
                    No data available
                  </div>
                )}
                {loading && (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading...
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Status Distribution */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Status Overview</CardTitle>
              <CardDescription>
                Status anggota saat ini
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(stats.membersByStatus).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {status === 'active' && <CheckCircle className="h-4 w-4 text-green-600" />}
                      {status === 'inactive' && <AlertCircle className="h-4 w-4 text-gray-600" />}
                      {status === 'graduated' && <CheckCircle className="h-4 w-4 text-blue-600" />}
                      <span className="text-sm font-medium capitalize">{status}</span>
                    </div>
                    <span className="text-lg font-bold">{count}</span>
                  </div>
                ))}
                {Object.keys(stats.membersByStatus).length === 0 && !loading && (
                  <div className="text-center py-8 text-muted-foreground">
                    No data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Members & Upcoming Events */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Recent Members */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Members</CardTitle>
              <CardDescription>
                Anggota yang baru terdaftar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentMembers.map((member) => (
                  <div key={member.id} className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {getInitials(member.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{member.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {getProgramLabel(member.organization_type)} • {formatDate(member.created_at)}
                      </p>
                    </div>
                    <div>
                      {getStatusBadge(member.status)}
                    </div>
                  </div>
                ))}
                {stats.recentMembers.length === 0 && !loading && (
                  <div className="text-center py-8 text-muted-foreground">
                    No recent members
                  </div>
                )}
                {loading && (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading...
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>
                Agenda dan event mendatang
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.upcomingAgenda.map((event) => (
                  <div key={event.id} className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-5 w-5 text-orange-600" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{event.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(event.start_date)}
                        {event.location && ` • ${event.location}`}
                      </p>
                    </div>
                  </div>
                ))}
                {stats.upcomingAgenda.length === 0 && !loading && (
                  <div className="text-center py-8 text-muted-foreground">
                    No upcoming events
                  </div>
                )}
                {loading && (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading...
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
