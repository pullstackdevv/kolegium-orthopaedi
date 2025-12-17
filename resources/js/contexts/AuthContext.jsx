import React, { createContext, useContext, useMemo } from 'react';
import { usePage } from '@inertiajs/react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const { auth } = usePage().props;
    
    const user = auth?.user || null;
    const role = user?.role || null;
    // Get permissions from user.permissions (all permissions including from roles)
    const permissions = user?.permissions || [];
    
    // Check if user has permission
    const hasPermission = (permission) => {
        if (!permission) return true;
        if (!permissions || permissions.length === 0) return false;
        
        // Owner/wildcard has all permissions
        if (permissions.includes('*')) return true;
        
        // Check exact permission
        if (permissions.includes(permission)) return true;

        // Check wildcard permissions (e.g., 'users.*' matches 'users.view',
        // 'agenda.kolegium.*' matches 'agenda.kolegium.view')
        for (const perm of permissions) {
            if (typeof perm === 'string' && perm.endsWith('.*')) {
                const prefix = perm.slice(0, -2);
                if (permission.startsWith(prefix + '.')) {
                    return true;
                }
            }
        }
        
        return false;
    };
    
    // Check if user has any of the permissions
    const hasAnyPermission = (permissionList) => {
        if (!Array.isArray(permissionList)) return false;
        return permissionList.some(permission => hasPermission(permission));
    };
    
    // Check if user has all permissions
    const hasAllPermissions = (permissionList) => {
        if (!Array.isArray(permissionList)) return false;
        return permissionList.every(permission => hasPermission(permission));
    };
    
    // Check if user has specific role
    const hasRole = (roleName) => {
        return role?.name === roleName;
    };
    
    // Check if user has any of the roles
    const hasAnyRole = (roleList) => {
        if (!Array.isArray(roleList)) return false;
        return roleList.includes(role?.name);
    };
    
    const value = useMemo(() => ({
        user,
        role,
        permissions,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        hasRole,
        hasAnyRole,
        isAuthenticated: !!user,
        isSuperAdmin: hasRole('super_admin') || hasRole('owner'),
        isAdminKolegium: hasRole('admin_kolegium'),
        isAdminStudyProgram: hasRole('admin_study_program'),
        isAdminPeerGroup: hasRole('admin_peer_group'),
        isOwner: hasRole('owner'),
        isAdmin: hasRole('admin'),
        isStaff: hasRole('staff'),
    }), [user, role, permissions]);
    
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;