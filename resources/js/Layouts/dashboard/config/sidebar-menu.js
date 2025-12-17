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
    roles: ["super_admin", "admin_kolegium", "admin_study_program", "admin_study_program_resident", "admin_study_program_fellow", "admin_study_program_trainee", "admin_peer_group", "staff"],
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
    roles: ["super_admin"],
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
    roles: ["super_admin"],
    items: [
      {
        title: "Settings",
        icon: Settings,
        href: "/cms/coming-soon/settings-program",
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
    roles: ["super_admin", "admin_kolegium"],
    items: [
      {
        title: "About Kolegium",
        icon: Info,
        href: "/cms/coming-soon/kolegium-about",
        permission: "agenda.kolegium.view",
      },
      {
        title: "Org. Structure (KOTI)",
        icon: Users,
        href: "/cms/coming-soon/kolegium-structure-koti",
        permission: "agenda.kolegium.view",
      },
      {
        title: "Org. Structure (Kolkes)",
        icon: Users,
        href: "/cms/coming-soon/kolegium-structure-kolkes",
        permission: "agenda.kolegium.view",
      },
      {
        title: "Event Gallery",
        icon: Images,
        href: "/cms/coming-soon/kolegium-gallery-events",
        permission: "agenda.kolegium.view",
      },
    ],
  },

  {
    group: "Kolegium Agenda",
    roles: ["super_admin", "admin_kolegium"],
    items: [
      {
        title: "Academic Calendar",
        icon: CalendarDays,
        href: "/cms/agenda?scope=kolegium",
        permission: "agenda.kolegium.view",
      },
      // {
      //   title: "National Examination",
      //   icon: CalendarDays,
      //   href: "/cms/agenda",
      //   permission: "agenda.kolegium.view",
      // },
      // {
      //   title: "Local Examination",
      //   icon: CalendarDays,
      //   href: "/cms/agenda",
      //   permission: "agenda.kolegium.view",
      // },
      // {
      //   title: "Nasional Event",
      //   icon: CalendarDays,
      //   href: "/cms/agenda",
      //   permission: "agenda.kolegium.view",
      // },
      // {
      //   title: "Local Event",
      //   icon: CalendarDays,
      //   href: "/cms/agenda",
      //   permission: "agenda.kolegium.view",
      // },
    ],
  },

  {
    group: "Study Programs",
    roles: [
      "super_admin",
      "admin_study_program",
      "admin_study_program_resident",
      "admin_study_program_fellow",
      "admin_study_program_trainee",
    ],
    items: [
      {
        title: "Resident - Profile",
        icon: GraduationCap,
        href: "/cms/coming-soon/resident-profile",
        permission: "agenda.study_program.resident.view",
      },
      {
        title: "Resident - Organizational Structure",
        icon: Users,
        href: "/cms/coming-soon/resident-management",
        permission: "agenda.study_program.resident.view",
      },
      {
        title: "Resident - Secretariat Contact",
        icon: Info,
        href: "/cms/coming-soon/resident-secretariat",
        permission: "agenda.study_program.resident.view",
      },
      {
        title: "Resident - Database",
        icon: BookOpen,
        href: "/cms/coming-soon/resident-database",
        permission: "agenda.study_program.resident.view",
      },
      {
        title: "Resident - Agenda",
        icon: CalendarDays,
        href: "/cms/agenda?scope=study_program&section=resident",
        permission: "agenda.study_program.resident.view",
      },
      {
        title: "Resident - Gallery",
        icon: Images,
        href: "/cms/coming-soon/resident-gallery",
        permission: "agenda.study_program.resident.view",
      },

      {
        title: "Fellow (CF) - Profile",
        icon: GraduationCap,
        href: "/cms/coming-soon/fellow-profile",
        permission: "agenda.study_program.fellow.view",
      },
      {
        title: "Fellow (CF) - Organizational Structure",
        icon: Users,
        href: "/cms/coming-soon/fellow-management",
        permission: "agenda.study_program.fellow.view",
      },
      {
        title: "Fellow (CF) - Secretariat Contact",
        icon: Info,
        href: "/cms/coming-soon/fellow-secretariat",
        permission: "agenda.study_program.fellow.view",
      },
      {
        title: "Fellow (CF) - Database",
        icon: BookOpen,
        href: "/cms/coming-soon/fellow-database",
        permission: "agenda.study_program.fellow.view",
      },
      {
        title: "Fellow (CF) - Agenda",
        icon: CalendarDays,
        href: "/cms/agenda?scope=study_program&section=fellow",
        permission: "agenda.study_program.fellow.view",
      },
      {
        title: "Fellow (CF) - Gallery",
        icon: Images,
        href: "/cms/coming-soon/fellow-gallery",
        permission: "agenda.study_program.fellow.view",
      },

      {
        title: "Trainee - Profile",
        icon: GraduationCap,
        href: "/cms/coming-soon/trainee-profile",
        permission: "agenda.study_program.trainee.view",
      },
      {
        title: "Trainee - Organizational Structure",
        icon: Users,
        href: "/cms/coming-soon/trainee-management",
        permission: "agenda.study_program.trainee.view",
      },
      {
        title: "Trainee - Secretariat Contact",
        icon: Info,
        href: "/cms/coming-soon/trainee-secretariat",
        permission: "agenda.study_program.trainee.view",
      },
      {
        title: "Trainee - Database",
        icon: BookOpen,
        href: "/cms/coming-soon/trainee-database",
        permission: "agenda.study_program.trainee.view",
      },
      {
        title: "Trainee - Agenda",
        icon: CalendarDays,
        href: "/cms/agenda?scope=study_program&section=trainee",
        permission: "agenda.study_program.trainee.view",
      },
      {
        title: "Trainee - Gallery",
        icon: Images,
        href: "/cms/coming-soon/trainee-gallery",
        permission: "agenda.study_program.trainee.view",
      },
    ],
  },

  {
    group: "Peer Groups",
    roles: ["super_admin", "admin_peer_group"],
    items: [
      {
        title: "Peer Group - Profile",
        icon: Info,
        href: "/cms/coming-soon/peergroup-profile",
        permission: "agenda.peer_group.view",
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
        permission: "agenda.peer_group.view",
      },
      {
        title: "Peer Group - National Event",
        icon: CalendarDays,
        href: "/cms/agenda?scope=peer_group&type=event_peer_group_nasional",
        permission: "agenda.peer_group.view",
      },
      {
        title: "Peer Group - International Event",
        icon: CalendarDays,
        href: "/cms/agenda?scope=peer_group&type=event_peer_group",
        permission: "agenda.peer_group.view",
      },

      {
        title: "Peer Group - Gallery",
        icon: Images,
        href: "/cms/coming-soon/peergroup-gallery",
        permission: "agenda.peer_group.view",
      },
    ],
  },
];
