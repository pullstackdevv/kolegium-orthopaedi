import { useState } from "react";
import { Users, ShieldCheck } from "lucide-react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import UserSettings from "./UserSettings";
import RoleSettings from "./RoleSettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

function SettingsPage({ activeMenu: initialActiveMenu = "user" }) {
  const [activeMenu, setActiveMenu] = useState(initialActiveMenu);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kolegium Settings</h1>
          <p className="text-muted-foreground mt-1">Kelola pengaturan sistem, pengguna, dan hak akses</p>
        </div>
        
        <Tabs value={activeMenu} onValueChange={setActiveMenu} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="user" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="role" className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              Role & Permissions
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="user" className="mt-6">
            <Card>
              <CardContent className="p-0">
                <UserSettings />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="role" className="mt-6">
            <Card>
              <CardContent className="p-0">
                <RoleSettings />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

export default SettingsPage;