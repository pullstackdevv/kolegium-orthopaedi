import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  HelpCircle,
  ChevronRight,
  ShieldCheck,
  UserCog
} from "lucide-react";

export const sidebarMenu = [
  {
    group: "General",
    items: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        href: "/cms/dashboard",
        permission: "dashboard",
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
        permission: "users",
      },
      {
        title: "Roles",
        icon: ShieldCheck,
        href: "/cms/settings/role",
        permission: "users",
      },
    ],
  },
  {
    group: "Other",
    items: [
      {
        title: "Settings",
        icon: Settings,
        href: "/cms/settings",
        permission: "settings",
      },
      {
        title: "Help Center",
        icon: HelpCircle,
        href: "#",
        permission: null,
      },
    ],
  },
];
