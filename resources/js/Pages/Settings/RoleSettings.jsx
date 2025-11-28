import { useState, useEffect } from "react";
import { ShieldCheck, Pencil, AlertCircle, Loader2 } from "lucide-react";
import api from "@/api/axios";
import Swal from "sweetalert2";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function RoleSettings() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('edit'); 
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({
    role: '',
    description: '',
    permissions: []
  });
  
  const [availablePermissions] = useState([
    'dashboard',
    'orders',
    'products',
    'customers',
    'stock',
    'vouchers',
    'expenses',
    'reports',
    'settings'
  ]);
  
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    fetchRoles();
  }, []);

  const resetForm = () => {
    setFormData({
      role: '',
      description: '',
      permissions: []
    });
    setFormError(null);
    setSelectedRole(null);
  };

  const openEditModal = (role) => {
    setSelectedRole(role);
    setFormData({
      role: role.role,
      description: role.description,
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

  const updateRole = async () => {
    try {
      setFormLoading(true);
      setFormError(null);

      const response = await api.put(`/roles/${selectedRole.role}`, {
        description: formData.description,
        permissions: formData.permissions
      });
      
      if (response.data.status === 'success') {
        await Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: response.data.message || 'Role permission berhasil diupdate!',
          timer: 2000,
          showConfirmButton: false
        });
        fetchRoles();
        closeModal();
      } else {
        setFormError(response.data.message || 'Gagal memperbarui role');
      }
    } catch (err) {
      console.error('Error updating role:', err);

      if (err.response) {
        console.log('Error response data:', err.response.data);
      }

      if (err.response?.status === 401) {
        setFormError('Sesi Anda telah berakhir. Silakan login kembali.');
      } else if (err.response?.status === 403) {
        setFormError('Anda tidak memiliki akses untuk memperbarui role.');
      } else if (err.response?.data?.errors) {
        const errors = Object.values(err.response.data.errors).flat();
        setFormError(errors.join(', '));
      } else if (err.response?.data?.status === 'success') {
        // 🚀 tangani success di catch (kalau interceptor bikin error padahal success)
        await Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: response.data.message || 'Role permission berhasil diupdate!',
          timer: 2000,
          showConfirmButton: false
        });
        fetchRoles();
        closeModal();
      } else {
        setFormError('Terjadi kesalahan saat memperbarui role.');
      }
    }
 finally {
      setFormLoading(false);
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

  const getRoleLabel = (role) => {
    const roleLabels = {
      'owner': 'Owner',
      'admin': 'Administrator', 
      'staff': 'Staff',
      'warehouse': 'Staff Gudang'
    };
    return roleLabels[role] || role;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center pb-6 border-b">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Role Settings</h2>
          <p className="text-muted-foreground mt-1">Kelola role dan permissions sistem</p>
        </div>
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
            <CardTitle>Data Role</CardTitle>
            <CardDescription>Daftar semua role dan permissions yang tersedia</CardDescription>
          </CardHeader>
          <CardContent>
            {roles.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="p-4 bg-muted rounded-full mb-4">
                  <ShieldCheck className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-center font-medium">Belum ada data role</p>
                <p className="text-muted-foreground text-sm mt-1">Tidak ada role yang tersedia saat ini</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">No</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((role, index) => (
                    <TableRow key={role.role}>
                      <TableCell className="font-medium">{index + 1}.</TableCell>
                      <TableCell>
                        <span className="font-semibold capitalize">{getRoleLabel(role.role)}</span>
                      </TableCell>
                      <TableCell className="text-muted-foreground max-w-xs truncate">
                        {role.description}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {(role.permissions || []).length > 0 ? (
                            <>
                              {role.permissions.slice(0, 3).map((perm, idx) => (
                                <Badge key={idx} variant="secondary" className="capitalize text-xs">
                                  {perm}
                                </Badge>
                              ))}
                              {role.permissions.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{role.permissions.length - 3} more
                                </Badge>
                              )}
                            </>
                          ) : (
                            <Badge variant="outline" className="text-xs">No permissions</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => openEditModal(role)}>
                          <Pencil className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {/* Dialog for Edit Role */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Edit Role: <span className="text-primary capitalize">{formData.role}</span>
            </DialogTitle>
            <DialogDescription>
              Kelola deskripsi dan permissions untuk role ini
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

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi Role</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Masukkan deskripsi role..."
                rows={3}
              />
            </div>

            <div className="space-y-3">
              <Label>Permissions</Label>
              <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto border rounded-lg p-4 bg-muted/30">
                {availablePermissions.map((permission) => (
                  <div key={permission} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-background transition-colors">
                    <Checkbox
                      id={`permission-${permission}`}
                      checked={formData.permissions.includes(permission)}
                      onCheckedChange={() => handlePermissionChange(permission)}
                    />
                    <Label 
                      htmlFor={`permission-${permission}`} 
                      className="cursor-pointer capitalize font-normal"
                    >
                      {permission}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={closeModal} disabled={formLoading}>
              Batal
            </Button>
            <Button onClick={updateRole} disabled={formLoading}>
              {formLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}