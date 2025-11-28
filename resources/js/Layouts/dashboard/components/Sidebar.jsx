import { Link, usePage } from "@inertiajs/react";
import { ChevronRight, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sidebarMenu } from "../config/sidebar-menu";
import PermissionGuard from "@/components/PermissionGuard";

// Nav Item Component
const NavItem = ({ item, isActive, onClick }) => {
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        isActive
          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
      )}
    >
      {item.icon && <item.icon className="h-4 w-4 shrink-0" />}
      <span className="truncate">{item.title}</span>
    </Link>
  );
};

// Sidebar Content with Groups
const SidebarContent = ({ onItemClick, user }) => {
  const { url } = usePage();
  const currentPath = url || "/";

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
      await fetch("/cms/logout", { method: "GET" });
      window.location.href = "/cms/login";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      {/* Logo Header */}
      <div className="flex h-14 items-center border-b border-sidebar-border px-4">
        <Link href="/cms/dashboard" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground text-xs font-bold">
            KO
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold leading-none">Kolegium</span>
            <span className="text-[10px] text-sidebar-foreground/60">Orthopaedi</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-6">
          {sidebarMenu.map((group, groupIndex) => (
            <div key={groupIndex} className="flex flex-col gap-1">
              {/* Group Label */}
              <p className="px-3 text-[11px] font-medium uppercase tracking-wider text-sidebar-foreground/50 mb-1">
                {group.group}
              </p>
              
              {/* Group Items */}
              {group.items.map((item, itemIndex) => (
                <PermissionGuard key={itemIndex} permission={item.permission}>
                  <NavItem
                    item={item}
                    isActive={currentPath === item.href}
                    onClick={onItemClick}
                  />
                </PermissionGuard>
              ))}
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* User Footer */}
      <div className="border-t border-sidebar-border p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 px-2 py-6 hover:bg-sidebar-accent/50"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs">
                  {getInitials(user?.name || "Guest")}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-left flex-1 min-w-0">
                <span className="text-sm font-medium truncate w-full">
                  {user?.name || "Guest"}
                </span>
                <span className="text-xs text-sidebar-foreground/60 truncate w-full">
                  {user?.email || "guest@example.com"}
                </span>
              </div>
              <ChevronsUpDown className="h-4 w-4 text-sidebar-foreground/50 shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

// Desktop Sidebar
export const DesktopSidebar = ({ isOpen, user }) => {
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-30 hidden h-screen transition-all duration-300 lg:block",
        isOpen ? "w-56" : "w-0 overflow-hidden"
      )}
    >
      <SidebarContent user={user} />
    </aside>
  );
};

// Mobile Sidebar (Sheet)
export const MobileSidebar = ({ isOpen, onClose, user }) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-56 p-0 border-0">
        <SidebarContent onItemClick={onClose} user={user} />
      </SheetContent>
    </Sheet>
  );
};

export default { DesktopSidebar, MobileSidebar };
