import { useState, useEffect } from "react";
import { ShieldCheck, Pencil, AlertCircle, Loader2, Plus } from "lucide-react";
import api from "@/api/axios";
import Swal from "sweetalert2";
import PermissionGuard from "@/components/PermissionGuard";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function RoleSettings() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('edit'); 
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: []
  });
  
  const [availablePermissions, setAvailablePermissions] = useState([]);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  // Permission groups for better organization
  const permissionGroups = {
    'Dashboard': ['dashboard.view'],
    'Users': ['users.view', 'users.create', 'users.edit', 'users.delete'],
    'Roles': ['roles.view', 'roles.create', 'roles.edit', 'roles.delete'],
    'Permissions': ['permissions.view', 'permissions.create', 'permissions.edit', 'permissions.delete'],
    'Agenda - Kolegium': ['agenda.kolegium.view', 'agenda.kolegium.create', 'agenda.kolegium.edit', 'agenda.kolegium.delete', 'agenda.kolegium.publish'],
    'Agenda - Study Program': ['agenda.study_program.view', 'agenda.study_program.create', 'agenda.study_program.edit', 'agenda.study_program.delete', 'agenda.study_program.publish'],
    'Agenda - Study Program (Resident)': ['agenda.study_program.resident.view', 'agenda.study_program.resident.create', 'agenda.study_program.resident.edit', 'agenda.study_program.resident.delete', 'agenda.study_program.resident.publish'],
    'Agenda - Study Program (Fellow)': ['agenda.study_program.fellow.view', 'agenda.study_program.fellow.create', 'agenda.study_program.fellow.edit', 'agenda.study_program.fellow.delete', 'agenda.study_program.fellow.publish'],
    'Agenda - Study Program (Trainee)': ['agenda.study_program.trainee.view', 'agenda.study_program.trainee.create', 'agenda.study_program.trainee.edit', 'agenda.study_program.trainee.delete', 'agenda.study_program.trainee.publish'],
    'Agenda - Peer Group': ['agenda.peer_group.view', 'agenda.peer_group.create', 'agenda.peer_group.edit', 'agenda.peer_group.delete', 'agenda.peer_group.publish'],
  };

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      permissions: []
    });
    setFormError(null);
    setSelectedRole(null);
  };

  const openCreateModal = () => {
    resetForm();
    setModalType('create');
    setShowModal(true);
  };

  const openEditModal = (role) => {
    setSelectedRole(role);
    setFormData({
      name: role.role,
      description: role.description || '',
      permissions: role.permissions || []
    });
    setModalType('edit');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePermissionChange = (permission) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  const handleGroupPermissionChange = (groupPermissions, checked) => {
    setFormData(prev => {
      let newPermissions = [...prev.permissions];
      if (checked) {
        // Add all permissions from group
        groupPermissions.forEach(p => {
          if (!newPermissions.includes(p)) {
            newPermissions.push(p);
          }
        });
      } else {
        // Remove all permissions from group
        newPermissions = newPermissions.filter(p => !groupPermissions.includes(p));
      }
      return { ...prev, permissions: newPermissions };
    });
  };

  const isGroupChecked = (groupPermissions) => {
    return groupPermissions.every(p => formData.permissions.includes(p));
  };

  const isGroupIndeterminate = (groupPermissions) => {
    const checkedCount = groupPermissions.filter(p => formData.permissions.includes(p)).length;
    return checkedCount > 0 && checkedCount < groupPermissions.length;
  };

  const createRole = async () => {
    try {
      setFormLoading(true);
      setFormError(null);

      const response = await api.post('/roles', {
        name: formData.name,
        description: formData.description,
        permissions: formData.permissions
      });
      
      if (response.data.status === 'success') {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Role berhasil dibuat!',
          timer: 2000,
          showConfirmButton: false
        });
        fetchRoles();
        closeModal();
      }
    } catch (err) {
      handleError(err);
    } finally {
      setFormLoading(false);
    }
  };

  const updateRole = async () => {
    try {
      setFormLoading(true);
      setFormError(null);

      const response = await api.put(`/roles/${selectedRole.role}`, {
        description: formData.description,
        permissions: formData.permissions
      });
      
      if (response.data.status === 'success') {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Role berhasil diupdate!',
          timer: 2000,
          showConfirmButton: false
        });
        fetchRoles();
        closeModal();
      }
    } catch (err) {
      handleError(err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleError = (err) => {
    console.error('Error:', err);
    if (err.response?.status === 401) {
      setFormError('Sesi Anda telah berakhir. Silakan login kembali.');
    } else if (err.response?.status === 403) {
      setFormError('Anda tidak memiliki akses untuk melakukan aksi ini.');
    } else if (err.response?.data?.errors) {
      const errors = Object.values(err.response.data.errors).flat();
      setFormError(errors.join(', '));
    } else {
      setFormError(err.response?.data?.message || 'Terjadi kesalahan.');
    }
  };

  const handleSubmit = () => {
    if (modalType === 'create') {
      createRole();
    } else {
      updateRole();
    }
  };

  const fetchRoles = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get('/roles');
      
      if (response.data.status === 'success') {
        setRoles(response.data.data || []);
      } else {
        setError('Gagal mengambil data role');
      }
    } catch (err) {
      console.error('Error fetching roles:', err);
      if (err.response?.status === 401) {
        setError('Sesi Anda telah berakhir. Silakan login kembali.');
      } else if (err.response?.status === 403) {
        setError('Anda tidak memiliki akses untuk melihat data role.');
      } else {
        setError('Terjadi kesalahan saat mengambil data role.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await api.get('/roles/permissions');
      if (response.data.status === 'success') {
        setAvailablePermissions(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching permissions:', err);
    }
  };

  const getRoleLabel = (role) => {
    const roleLabels = {
      'super_admin': 'Super Admin',
      'admin_kolegium': 'Admin Kolegium',
      'admin_study_program': 'Admin Study Program',
      'admin_peer_group': 'Admin Peer Group',
      'staff': 'Staff',
    };
    return roleLabels[role] || role;
  };

  const formatPermissionName = (permission) => {
    return permission.replace(/\./g, ' ').replace(/_/g, ' ');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-medium">Roles & Permissions</h3>
          <p className="text-sm text-muted-foreground">
            Kelola role dan hak akses pengguna dalam sistem.
          </p>
        </div>
        <PermissionGuard permission="roles.create">
          <Button onClick={openCreateModal} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Role
          </Button>
        </PermissionGuard>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-4">
          {roles.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <ShieldCheck className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium">Belum ada role</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Klik "Tambah Role" untuk membuat role baru
                </p>
              </CardContent>
            </Card>
          ) : (
            roles.map((role) => (
              <Card key={role.role} className="overflow-hidden">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                  <div className="space-y-1">
                    <CardTitle className="text-base flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <ShieldCheck className="h-4 w-4 text-primary" />
                      </div>
                      <span className="capitalize">{getRoleLabel(role.role)}</span>
                      {role.is_system && (
                        <Badge variant="outline" className="text-xs">System</Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {role.description || 'Tidak ada deskripsi'}
                    </CardDescription>
                  </div>
                  <PermissionGuard permission="roles.edit">
                    <Button variant="outline" size="sm" onClick={() => openEditModal(role)}>
                      <Pencil className="h-3.5 w-3.5 mr-1.5" />
                      Edit
                    </Button>
                  </PermissionGuard>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Permissions ({role.permissions?.length || 0})
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {(role.permissions || []).length > 0 ? (
                        role.permissions.includes('*') ? (
                          <Badge variant="default" className="text-xs">
                            All Permissions
                          </Badge>
                        ) : (
                          role.permissions.map((perm, idx) => (
                            <Badge 
                              key={idx} 
                              variant="secondary" 
                              className="capitalize text-xs font-normal"
                            >
                              {formatPermissionName(perm)}
                            </Badge>
                          ))
                        )
                      ) : (
                        <span className="text-xs text-muted-foreground italic">
                          Tidak ada permission
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Dialog for Create/Edit Role */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {modalType === 'create' ? 'Tambah Role Baru' : (
                <>Edit Role: <span className="text-primary capitalize">{formData.name}</span></>
              )}
            </DialogTitle>
            <DialogDescription>
              {modalType === 'create' 
                ? 'Buat role baru dengan permissions yang sesuai' 
                : 'Kelola deskripsi dan permissions untuk role ini'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {formError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error!</AlertTitle>
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}

            {modalType === 'create' && (
              <div className="space-y-2">
                <Label htmlFor="name">Nama Role *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Contoh: manager, supervisor"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi Role</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Masukkan deskripsi role..."
                rows={2}
              />
            </div>

            <div className="space-y-3">
              <Label>Permissions</Label>
              <div className="border rounded-lg divide-y">
                {Object.entries(permissionGroups).map(([group, permissions]) => (
                  <div key={group} className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Checkbox
                        id={`group-${group}`}
                        checked={isGroupChecked(permissions)}
                        onCheckedChange={(checked) => handleGroupPermissionChange(permissions, checked)}
                        className="data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground"
                      />
                      <Label 
                        htmlFor={`group-${group}`} 
                        className="cursor-pointer font-medium text-sm"
                      >
                        {group}
                      </Label>
                    </div>
                    <div className="grid grid-cols-2 gap-2 ml-6">
                      {permissions.map((permission) => (
                        <div key={permission} className="flex items-center space-x-2">
                          <Checkbox
                            id={`permission-${permission}`}
                            checked={formData.permissions.includes(permission)}
                            onCheckedChange={() => handlePermissionChange(permission)}
                          />
                          <Label 
                            htmlFor={`permission-${permission}`} 
                            className="cursor-pointer text-sm font-normal text-muted-foreground capitalize"
                          >
                            {formatPermissionName(permission)}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Dipilih: {formData.permissions.length} permission
              </p>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={closeModal} disabled={formLoading}>
              Batal
            </Button>
            <Button onClick={handleSubmit} disabled={formLoading}>
              {formLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {modalType === 'create' ? 'Buat Role' : 'Simpan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}