import { usePage } from "@inertiajs/react";
import { AuthProvider } from "@/contexts/AuthContext";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/Sidebar";
import Header from "./components/Header";

export default function DashboardLayout({ children, title }) {
  const { auth } = usePage().props;
  const user = auth?.user || { name: "Guest", email: "guest@example.com" };

  return (
    <AuthProvider>
      <SidebarProvider>
        <AppSidebar user={user} />
        <SidebarInset>
          <Header title={title} />
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AuthProvider>
  );
}
