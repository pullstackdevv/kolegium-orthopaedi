import { useMemo } from "react";
import { Link, usePage } from "@inertiajs/react";
import { ChevronsUpDown, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { sidebarMenu } from "../config/sidebar-menu";
import PermissionGuard from "@/components/PermissionGuard";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/api/axios";

export function AppSidebar({ user }) {
  const { url } = usePage();
  const currentPath = url || "/";
  const { hasPermission, hasAnyPermission, hasAllPermissions, hasRole, hasAnyRole } = useAuth();

  const hasAccess = ({ permission, permissions, role, roles, requireAll = false } = {}) => {
    let ok = false;

    if (permission) {
      ok = hasPermission(permission);
    }

    if (permissions && Array.isArray(permissions)) {
      ok = requireAll ? hasAllPermissions(permissions) : hasAnyPermission(permissions);
    }

    if (role) {
      ok = hasRole(role);
    }

    if (roles && Array.isArray(roles)) {
      ok = hasAnyRole(roles);
    }

    if (!permission && !permissions && !role && !roles) {
      ok = true;
    }

    return ok;
  };

  const filteredSidebarMenu = useMemo(() => {
    return sidebarMenu
      .filter((group) => hasAccess(group))
      .map((group) => {
        const items = (group.items || []).filter((item) => hasAccess(item));
        return { ...group, items };
      })
      .filter((group) => (group.items || []).length > 0);
  }, [hasAllPermissions, hasAnyPermission, hasAnyRole, hasPermission, hasRole]);

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = async () => {
    try {
      try {
        await api.post(
          "/auth/logout",
          {},
          {
            headers: {
              "X-Skip-Auth-Redirect": "1",
            },
          }
        );
      } catch (e) {
      }

      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");

      await fetch("/cms/logout", { method: "GET" });
      window.location.href = "/cms/login";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <Sidebar collapsible="icon">
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/cms/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <span className="text-xs font-bold">KO</span>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Kolegium</span>
                  <span className="truncate text-xs">Orthopaedi</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        {filteredSidebarMenu.map((group, groupIndex) => (
          <SidebarGroup key={groupIndex}>
            <SidebarGroupLabel>{group.group}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item, itemIndex) => (
                  <PermissionGuard
                    key={itemIndex}
                    permission={item.permission}
                    permissions={item.permissions}
                    role={item.role}
                    roles={item.roles}
                  >
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        isActive={currentPath === item.href}
                        tooltip={item.title}
                      >
                        <Link href={item.href}>
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </PermissionGuard>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                      {getInitials(user?.name || "Guest")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {user?.name || "Guest"}
                    </span>
                    <span className="truncate text-xs">
                      {user?.email || "guest@example.com"}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarFallback className="rounded-lg">
                        {getInitials(user?.name || "Guest")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user?.name || "Guest"}
                      </span>
                      <span className="truncate text-xs">
                        {user?.email || "guest@example.com"}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export default AppSidebar;
