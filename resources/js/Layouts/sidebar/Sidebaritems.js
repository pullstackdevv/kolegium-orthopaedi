import { uniqueId } from "lodash";

const SidebarContent = [
    {
        name: "Dashboard",
        icon: "solar:widget-add-line-duotone",
        id: uniqueId(),
        url: "/cms/dashboard",
        permission: "dashboard",
    },
    {
        name: "User Management",
        icon: "solar:users-group-rounded-outline",
        id: uniqueId(),
        permission: "users",
        children: [
            {
                name: "Users",
                icon: "solar:user-outline",
                id: uniqueId(),
                url: "/cms/settings/user",
            },
            {
                name: "Roles & Permissions",
                icon: "solar:shield-user-outline",
                id: uniqueId(),
                url: "/cms/settings/role",
            },
        ],
    },
    {
        name: "Settings",
        icon: "solar:settings-outline",
        id: uniqueId(),
        url: "/cms/settings",
        permission: "settings",
    },
];

export default SidebarContent;
