import { useState, useEffect } from "react";
import { Key, Plus, Pencil, Trash2, AlertCircle, Loader2, Search } from "lucide-react";
import api from "@/api/axios";
import Swal from "sweetalert2";
import PermissionGuard from "@/components/PermissionGuard";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function PermissionSettings() {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('create');
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    display_name: '',
    description: '',
    module: ''
  });

  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    fetchPermissions();
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      display_name: '',
      description: '',
      module: ''
    });
    setFormError(null);
    setSelectedPermission(null);
  };

  const openCreateModal = () => {
    resetForm();
    setModalType('create');
    setShowModal(true);
  };

  const openEditModal = (permission) => {
    setSelectedPermission(permission);
    setFormData({
      name: permission.name,
      display_name: permission.display_name || '',
      description: permission.description || '',
      module: permission.module || ''
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

    // Auto-generate display_name and module from name
    if (name === 'name' && modalType === 'create') {
      const displayName = value.replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      const module = value.split('.')[0] || '';
      setFormData(prev => ({
        ...prev,
        display_name: displayName,
        module: module
      }));
    }
  };

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get('/permissions');

      if (response.data.status === 'success') {
        setPermissions(response.data.data || []);
      } else {
        setError('Gagal mengambil data permission');
      }
    } catch (err) {
      console.error('Error fetching permissions:', err);
      if (err.response?.status === 401) {
        setError('Sesi Anda telah berakhir. Silakan login kembali.');
      } else {
        setError('Terjadi kesalahan saat mengambil data permission.');
      }
    } finally {
      setLoading(false);
    }
  };

  const createPermission = async () => {
    try {
      setFormLoading(true);
      setFormError(null);

      const response = await api.post('/permissions', formData);

      if (response.data.status === 'success') {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Permission berhasil dibuat!',
          timer: 2000,
          showConfirmButton: false
        });
        fetchPermissions();
        closeModal();
      }
    } catch (err) {
      handleError(err);
    } finally {
      setFormLoading(false);
    }
  };

  const updatePermission = async () => {
    try {
      setFormLoading(true);
      setFormError(null);

      const response = await api.put(`/permissions/${selectedPermission.id}`, {
        display_name: formData.display_name,
        description: formData.description,
        module: formData.module
      });

      if (response.data.status === 'success') {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Permission berhasil diupdate!',
          timer: 2000,
          showConfirmButton: false
        });
        fetchPermissions();
        closeModal();
      }
    } catch (err) {
      handleError(err);
    } finally {
      setFormLoading(false);
    }
  };

  const deletePermission = async (permission) => {
    const result = await Swal.fire({
      title: 'Hapus Permission?',
      text: `Apakah Anda yakin ingin menghapus permission "${permission.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        const response = await api.delete(`/permissions/${permission.id}`);

        if (response.data.status === 'success') {
          Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Permission berhasil dihapus!',
            timer: 2000,
            showConfirmButton: false
          });
          fetchPermissions();
        }
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          text: err.response?.data?.message || 'Gagal menghapus permission'
        });
      }
    }
  };

  const handleError = (err) => {
    console.error('Error:', err);
    if (err.response?.status === 401) {
      setFormError('Sesi Anda telah berakhir. Silakan login kembali.');
    } else if (err.response?.data?.errors) {
      const errors = Object.values(err.response.data.errors).flat();
      setFormError(errors.join(', '));
    } else {
      setFormError(err.response?.data?.message || 'Terjadi kesalahan.');
    }
  };

  const handleSubmit = () => {
    if (modalType === 'create') {
      createPermission();
    } else {
      updatePermission();
    }
  };

  // Group permissions by module
  const groupedPermissions = permissions.reduce((acc, perm) => {
    const module = perm.module || 'other';
    if (!acc[module]) {
      acc[module] = [];
    }
    acc[module].push(perm);
    return acc;
  }, {});

  // Filter permissions by search query
  const filteredPermissions = searchQuery
    ? permissions.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.module?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : permissions;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-medium">Permissions</h3>
          <p className="text-sm text-muted-foreground">
            Kelola semua permission yang tersedia dalam sistem.
          </p>
        </div>
        <PermissionGuard permission="permissions.create">
          <Button onClick={openCreateModal} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Permission
          </Button>
        </PermissionGuard>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cari permission..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
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
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Daftar Permission</CardTitle>
            <CardDescription>
              Total {permissions.length} permission dalam {Object.keys(groupedPermissions).length} modul
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredPermissions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <Key className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium">
                  {searchQuery ? 'Tidak ada hasil' : 'Belum ada permission'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {searchQuery ? 'Coba kata kunci lain' : 'Klik "Tambah Permission" untuk membuat permission baru'}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">No</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Display Name</TableHead>
                    <TableHead>Module</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPermissions.map((permission, index) => (
                    <TableRow key={permission.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                          {permission.name}
                        </code>
                      </TableCell>
                      <TableCell>{permission.display_name || '-'}</TableCell>
                      <TableCell>
                        {permission.module && (
                          <Badge variant="outline" className="capitalize text-xs">
                            {permission.module}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm max-w-xs truncate">
                        {permission.description || '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <PermissionGuard permission="permissions.edit">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditModal(permission)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                          </PermissionGuard>
                          <PermissionGuard permission="permissions.delete">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => deletePermission(permission)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </PermissionGuard>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {/* Dialog for Create/Edit Permission */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {modalType === 'create' ? 'Tambah Permission Baru' : 'Edit Permission'}
            </DialogTitle>
            <DialogDescription>
              {modalType === 'create'
                ? 'Buat permission baru untuk sistem'
                : 'Edit detail permission'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {formError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error!</AlertTitle>
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">
                Nama Permission *
                {modalType === 'edit' && (
                  <span className="text-xs text-muted-foreground ml-2">(tidak dapat diubah)</span>
                )}
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Contoh: users.create, orders.view"
                disabled={modalType === 'edit'}
              />
              <p className="text-xs text-muted-foreground">
                Format: module.action (contoh: users.create)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="display_name">Display Name</Label>
              <Input
                id="display_name"
                name="display_name"
                value={formData.display_name}
                onChange={handleInputChange}
                placeholder="Contoh: Create Users"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="module">Module</Label>
              <Input
                id="module"
                name="module"
                value={formData.module}
                onChange={handleInputChange}
                placeholder="Contoh: users, orders, settings"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Deskripsi singkat permission"
              />
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={closeModal} disabled={formLoading}>
              Batal
            </Button>
            <Button onClick={handleSubmit} disabled={formLoading || (modalType === 'create' && !formData.name)}>
              {formLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {modalType === 'create' ? 'Buat Permission' : 'Simpan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
