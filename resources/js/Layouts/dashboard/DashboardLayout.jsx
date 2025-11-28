import { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/contexts/AuthContext";
import { DesktopSidebar, MobileSidebar } from "./components/Sidebar";
import Header from "./components/Header";

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const { auth } = usePage().props;
  const user = auth?.user || { name: "Guest", email: "guest@example.com" };

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleMenuClick = () => {
    if (isMobile) {
      setIsMobileSidebarOpen((prev) => !prev);
    } else {
      setIsSidebarOpen((prev) => !prev);
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        {/* Desktop Sidebar */}
        <DesktopSidebar isOpen={isSidebarOpen} user={user} />

        {/* Mobile Sidebar */}
        <MobileSidebar
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
          user={user}
        />

        {/* Header */}
        <Header
          onMenuClick={handleMenuClick}
          isSidebarOpen={isSidebarOpen && !isMobile}
        />

        {/* Main Content */}
        <main
          className={cn(
            "min-h-[calc(100vh-3.5rem)] pt-14 transition-all duration-300",
            isSidebarOpen && !isMobile ? "lg:pl-56" : "lg:pl-0"
          )}
        >
          <div className="p-4 lg:p-6">{children}</div>
        </main>
      </div>
    </AuthProvider>
  );
}
