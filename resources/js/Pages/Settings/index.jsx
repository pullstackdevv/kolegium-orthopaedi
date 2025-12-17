import { useEffect, useMemo, useState } from "react";
import { Users, ShieldCheck, Key } from "lucide-react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import UserSettings from "./UserSettings";
import RoleSettings from "./RoleSettings";
import PermissionSettings from "./PermissionSettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";

function SettingsPage({ activeMenu: initialActiveMenu = "user" }) {
  return (
    <DashboardLayout title="Settings">
      <SettingsContent initialActiveMenu={initialActiveMenu} />
    </DashboardLayout>
  );
}

function SettingsContent({ initialActiveMenu = "user" }) {
  const { hasPermission } = useAuth();

  const tabs = useMemo(() => {
    const canUsers = hasPermission('users.view');
    const canRoles = hasPermission('roles.view');
    const canPermissions = hasPermission('permissions.view');

    return [
      {
        value: 'user',
        label: 'Users',
        icon: Users,
        enabled: canUsers,
      },
      {
        value: 'role',
        label: 'Roles',
        icon: ShieldCheck,
        enabled: canRoles,
      },
      {
        value: 'permission',
        label: 'Permissions',
        icon: Key,
        enabled: canPermissions,
      },
    ].filter((t) => t.enabled);
  }, [hasPermission]);

  const allowedValues = useMemo(() => tabs.map((t) => t.value), [tabs]);
  const defaultValue = allowedValues[0] || 'user';

  const [activeMenu, setActiveMenu] = useState(
    allowedValues.includes(initialActiveMenu) ? initialActiveMenu : defaultValue
  );

  useEffect(() => {
    if (!allowedValues.includes(activeMenu)) {
      setActiveMenu(defaultValue);
    }
  }, [activeMenu, allowedValues, defaultValue]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Kelola pengaturan sistem, pengguna, dan hak akses
        </p>
      </div>
      
      {/* Tabs */}
      {tabs.length === 0 ? (
        <div className="rounded-lg border p-6 text-sm text-muted-foreground">
          Anda tidak memiliki akses untuk membuka halaman ini.
        </div>
      ) : (
        <Tabs value={activeMenu} onValueChange={setActiveMenu} className="space-y-4">
          <TabsList>
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="gap-2">
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {allowedValues.includes('user') && (
            <TabsContent value="user" className="space-y-4">
              <UserSettings />
            </TabsContent>
          )}

          {allowedValues.includes('role') && (
            <TabsContent value="role" className="space-y-4">
              <RoleSettings />
            </TabsContent>
          )}

          {allowedValues.includes('permission') && (
            <TabsContent value="permission" className="space-y-4">
              <PermissionSettings />
            </TabsContent>
          )}
        </Tabs>
      )}
    </div>
  );
}

export default SettingsPage;