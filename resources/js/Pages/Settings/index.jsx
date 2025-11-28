import { useState } from "react";
import { Users, ShieldCheck } from "lucide-react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import UserSettings from "./UserSettings";
import RoleSettings from "./RoleSettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function SettingsPage({ activeMenu: initialActiveMenu = "user" }) {
  const [activeMenu, setActiveMenu] = useState(initialActiveMenu);

  return (
    <DashboardLayout title="Settings">
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Kelola pengaturan sistem, pengguna, dan hak akses
          </p>
        </div>
        
        {/* Tabs */}
        <Tabs value={activeMenu} onValueChange={setActiveMenu} className="space-y-4">
          <TabsList>
            <TabsTrigger value="user" className="gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="role" className="gap-2">
              <ShieldCheck className="h-4 w-4" />
              Roles
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="user" className="space-y-4">
            <UserSettings />
          </TabsContent>
          
          <TabsContent value="role" className="space-y-4">
            <RoleSettings />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

export default SettingsPage;