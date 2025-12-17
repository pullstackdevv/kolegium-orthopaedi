import {
  LayoutDashboard,
  Info,
  Images,
  History,
  Eye,
  Users,
  CalendarDays,
  BookOpen,
  GraduationCap,
  Layers,
  Settings,
  HelpCircle,
  ShieldCheck,
  Key,
} from "lucide-react";

// NOTE: href untuk konten Kolegium yang belum dikembangkan
// diarahkan ke halaman generic `/cms/coming-soon/{slug}`.

export const sidebarMenu = [
  // ===== Core CMS Menus (lama) =====
  {
    group: "General",
    items: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        href: "/cms/coming-soon/dashboard",
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
        permission: "permissions.view",
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
        permissions: ["users.view", "roles.view", "permissions.view"],
      },
      {
        title: "Help",
        icon: HelpCircle,
        href: "#",
        permission: null,
      },
    ],
  },

  // ===== Kolegium Content Menus (baru, placeholder) =====

  {
    group: "Kolegium Profile",
    items: [
      {
        title: "About Kolegium",
        icon: Info,
        href: "/cms/coming-soon/kolegium-about",
        permission: null,
      },
      {
        title: "Org. Structure (KOTI)",
        icon: Users,
        href: "/cms/coming-soon/kolegium-structure-koti",
        permission: null,
      },
      {
        title: "Org. Structure (Kolkes)",
        icon: Users,
        href: "/cms/coming-soon/kolegium-structure-kolkes",
        permission: null,
      },
      {
        title: "Event Gallery",
        icon: Images,
        href: "/cms/coming-soon/kolegium-gallery-events",
        permission: null,
      },
    ],
  },

  {
    group: "Kolegium Agenda",
    items: [
      {
        title: "Academic Calendar",
        icon: CalendarDays,
        href: "/cms/agenda",
        permission: "agenda.kolegium.view",
      },
      {
        title: "National Examination",
        icon: CalendarDays,
        href: "/cms/agenda",
        permission: "agenda.kolegium.view",
      },
      {
        title: "Local Examination",
        icon: CalendarDays,
        href: "/cms/agenda",
        permission: "agenda.kolegium.view",
      },
      {
        title: "Nasional Event",
        icon: CalendarDays,
        href: "/cms/agenda",
        permission: "agenda.kolegium.view",
      },
      {
        title: "Local Event",
        icon: CalendarDays,
        href: "/cms/agenda",
        permission: "agenda.kolegium.view",
      },
    ],
  },

  {
    group: "Study Programs",
    items: [
      {
        title: "Resident - Profile",
        icon: GraduationCap,
        href: "/cms/coming-soon/resident-profile",
        permission: null,
      },
      {
        title: "Resident - Organizational Structure",
        icon: Users,
        href: "/cms/coming-soon/resident-management",
        permission: null,
      },
      {
        title: "Resident - Secretariat Contact",
        icon: Info,
        href: "/cms/coming-soon/resident-secretariat",
        permission: null,
      },
      {
        title: "Resident - Database",
        icon: BookOpen,
        href: "/cms/coming-soon/resident-database",
        permission: null,
      },
      {
        title: "Resident - Agenda",
        icon: CalendarDays,
        href: "/cms/coming-soon/resident-agenda",
        permission: null,
      },
      {
        title: "Resident - Gallery",
        icon: Images,
        href: "/cms/coming-soon/resident-gallery",
        permission: null,
      },

      {
        title: "Fellow (CF) - Profile",
        icon: GraduationCap,
        href: "/cms/coming-soon/fellow-profile",
        permission: null,
      },
      {
        title: "Fellow (CF) - Organizational Structure",
        icon: Users,
        href: "/cms/coming-soon/fellow-management",
        permission: null,
      },
      {
        title: "Fellow (CF) - Secretariat Contact",
        icon: Info,
        href: "/cms/coming-soon/fellow-secretariat",
        permission: null,
      },
      {
        title: "Fellow (CF) - Database",
        icon: BookOpen,
        href: "/cms/coming-soon/fellow-database",
        permission: null,
      },
      {
        title: "Fellow (CF) - Agenda",
        icon: CalendarDays,
        href: "/cms/coming-soon/fellow-agenda",
        permission: null,
      },
      {
        title: "Fellow (CF) - Gallery",
        icon: Images,
        href: "/cms/coming-soon/fellow-gallery",
        permission: null,
      },

      {
        title: "Trainee - Profile",
        icon: GraduationCap,
        href: "/cms/coming-soon/trainee-profile",
        permission: null,
      },
      {
        title: "Trainee - Organizational Structure",
        icon: Users,
        href: "/cms/coming-soon/trainee-management",
        permission: null,
      },
      {
        title: "Trainee - Secretariat Contact",
        icon: Info,
        href: "/cms/coming-soon/trainee-secretariat",
        permission: null,
      },
      {
        title: "Trainee - Database",
        icon: BookOpen,
        href: "/cms/coming-soon/trainee-database",
        permission: null,
      },
      {
        title: "Trainee - Agenda",
        icon: CalendarDays,
        href: "/cms/coming-soon/trainee-agenda",
        permission: null,
      },
      {
        title: "Trainee - Gallery",
        icon: Images,
        href: "/cms/coming-soon/trainee-gallery",
        permission: null,
      },
    ],
  },

  {
    group: "Peer Groups",
    items: [
      {
        title: "Peer Group - Profile",
        icon: Info,
        href: "/cms/coming-soon/peergroup-profile",
        permission: null,
      },
      // ,
      // {
      //   title: "Peer Group - Logo & Photos",
      //   icon: Images,
      //   href: "/cms/coming-soon/peergroup-logo-photos",
      //   permission: null,
      // },
      // {
      //   title: "Peer Group - Histories",
      //   icon: History,
      //   href: "/cms/coming-soon/peergroup-histories",
      //   permission: null,
      // },
      // {
      //   title: "Peer Group - Vision & Mission",
      //   icon: Eye,
      //   href: "/cms/coming-soon/peergroup-vision-mission",
      //   permission: null,
      // },
      // {
      //   title: "Peer Group - Org. Structure",
      //   icon: Users,
      //   href: "/cms/coming-soon/peergroup-structure",
      //   permission: null,
      // },
      // {
      //   title: "Peer Group - Secretariat Contact",
      //   icon: Info,
      //   href: "/cms/coming-soon/peergroup-secretariat",
      //   permission: null,
      // },

      {
        title: "Member Database",
        icon: BookOpen,
        href: "/cms/coming-soon/peergroup-members",
        permission: null,
      },
      {
        title: "Peer Group - National Event",
        icon: CalendarDays,
        href: "/cms/coming-soon/peergroup-local-event",
        permission: null,
      },
      {
        title: "Peer Group - International Event",
        icon: CalendarDays,
        href: "/cms/coming-soon/peergroup-international-event",
        permission: null,
      },

      {
        title: "Peer Group - Gallery",
        icon: Images,
        href: "/cms/coming-soon/peergroup-gallery",
        permission: null,
      },
    ],
  },
];
