import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  HelpCircle,
  ShieldCheck,
  Key,
} from "lucide-react";

export const sidebarMenu = [
  {
    group: "General",
    items: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        href: "/cms/dashboard",
        permission: "dashboard.view",
      },
    ],
  },
  {
    group: "Management",
    items: [
      {
        title: "Users",
        icon: Users,
        href: "/cms/settings/user",
        permission: "users.view",
      },
      {
        title: "Roles",
        icon: ShieldCheck,
        href: "/cms/settings/role",
        permission: "roles.view",
      },
      {
        title: "Permissions",
        icon: Key,
        href: "/cms/settings/permission",
        permission: "settings.edit",
      },
    ],
  },
  {
    group: "System",
    items: [
      {
        title: "Settings",
        icon: Settings,
        href: "/cms/settings",
        permission: "settings.view",
      },
      {
        title: "Help",
        icon: HelpCircle,
        href: "#",
        permission: null,
      },
    ],
  },
];
