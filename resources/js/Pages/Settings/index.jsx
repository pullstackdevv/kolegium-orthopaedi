import { useState } from "react";
import { Icon } from "@iconify/react";
import { Link } from "@inertiajs/react";
import DashboardLayout from "../../Layouts/DashboardLayout";
import UserSettings from "./UserSettings";
import RoleSettings from "./RoleSettings";

const menus = [
  { key: "user", label: "User Management", icon: "mdi:account-outline" },
  { key: "role", label: "Role & Permissions", icon: "mdi:shield-account-outline" },
];

function SettingsPage({ activeMenu: initialActiveMenu = "user" }) {
  const [activeMenu, setActiveMenu] = useState(initialActiveMenu);

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Kolegium Settings</h1>
        <div className="flex flex-wrap gap-3 mb-6">
          {menus.map((menu) => (
            <Link
              key={menu.key}
              href={`/cms/settings/${menu.key}`}
              className={`px-6 py-3 rounded-lg border flex items-center gap-2 transition-all font-medium ${
                activeMenu === menu.key 
                  ? "bg-blue-600 text-white border-blue-600 shadow-md" 
                  : "border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-400"
              }`}
            >
              <Icon icon={menu.icon} width={22} height={22} />
              {menu.label}
            </Link>
          ))}
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {activeMenu === "user" && <UserSettings />}
          {activeMenu === "role" && <RoleSettings />}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default SettingsPage;