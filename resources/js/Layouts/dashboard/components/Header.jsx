import { useState } from "react";
import { usePage, Link } from "@inertiajs/react";
import { Menu, Search, Settings, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = ({ onMenuClick, isSidebarOpen }) => {
  const { auth } = usePage().props;
  const user = auth?.user || { name: "Guest", email: "guest@example.com" };

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
    <header
      className={cn(
        "fixed top-0 z-40 flex h-14 w-full items-center border-b bg-background transition-all duration-300",
        isSidebarOpen ? "lg:pl-56" : "lg:pl-0"
      )}
    >
      <div className="flex w-full items-center gap-4 px-4">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden shrink-0"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>

        {/* Logo for mobile */}
        <Link href="/cms/dashboard" className="flex items-center gap-2 lg:hidden">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-bold">
            KO
          </div>
        </Link>

        <Separator orientation="vertical" className="h-6 lg:hidden" />

        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="h-9 w-full pl-9 bg-muted/50 border-0 focus-visible:ring-1"
          />
          <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-1 ml-auto">
          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Sun className="h-4 w-4" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Settings */}
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Settings className="h-4 w-4" />
            <span className="sr-only">Settings</span>
          </Button>

          {/* User Avatar */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
