import React, { useEffect, useState, useMemo } from "react";
import { Users, UserPlus, Pencil, Trash2, CheckCircle, XCircle, AlertCircle, Loader2, ChevronLeft, ChevronRight, Building2, Eye, EyeOff, Search } from "lucide-react";
import api from "@/api/axios";
import Swal from "sweetalert2";
import PermissionGuard from "@/components/PermissionGuard";
import { handleSessionExpired } from "@/utils/auth";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function UserSettings() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('create'); 
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role_id: '',
    is_active: true
  });
  
  const [roles, setRoles] = useState([]);
  const [roleDescriptions, setRoleDescriptions] = useState({});
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const dialogContentRef = React.useRef(null);
  const [errorTrigger, setErrorTrigger] = useState(0);
  const [touched, setTouched] = useState({});
  const [clientErrors, setClientErrors] = useState({});

  // Affiliation management state
  const [showAffiliationModal, setShowAffiliationModal] = useState(false);
  const [selectedUserForAffiliation, setSelectedUserForAffiliation] = useState(null);
  const [affiliations, setAffiliations] = useState([]);
  const [userAffiliations, setUserAffiliations] = useState([]);
  const [selectedAffiliationIds, setSelectedAffiliationIds] = useState([]);
  const [affiliationLoading, setAffiliationLoading] = useState(false);

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Filter and search logic
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === 'all' || user.role?.name === filterRole;
      const matchesStatus = filterStatus === 'all' || 
                           (filterStatus === 'active' && user.is_active) ||
                           (filterStatus === 'inactive' && !user.is_active);
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, filterRole, filterStatus]);

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchRoleDescriptions();
  }, []);

  useEffect(() => {
    if (errorTrigger > 0 && dialogContentRef.current) {
      dialogContentRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [errorTrigger]);

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      role_id: roles.length > 0 ? roles.find(r => r.role === 'staff')?.role || roles[0]?.role || '' : '',
      is_active: true
    });
    setFormError(null);
    setFieldErrors({});
    setClientErrors({});
    setTouched({});
    setSelectedUser(null);
  };

  const getRoleLabel = (roleName) => {
    const labels = {
      super_admin: 'Super Admin',
      admin_kolegium: 'Admin Kolegium',
      admin_study_program: 'Admin Study Program',
      admin_peer_group: 'Admin Peer Group',
      staff: 'Staff',
    };

    return labels[roleName] || roleName || '-';
  };

  const openCreateModal = () => {
    resetForm();
    setModalType('create');
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      password_confirmation: '',
      role_id: user.role?.name || user.role_id || '',
      is_active: user.is_active
    });
    setSelectedUser(user);
    setModalType('edit');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const validateField = (name, value) => {
    const errors = {};
    
    switch(name) {
      case 'name':
        if (!value || value.trim() === '') {
          errors.name = 'Nama lengkap wajib diisi';
        } else if (value.trim().length < 3) {
          errors.name = 'Nama minimal 3 karakter';
        }
        break;
        
      case 'email':
        if (!value || value.trim() === '') {
          errors.email = 'Email wajib diisi';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.email = 'Format email tidak valid';
        }
        break;
        
      case 'password':
        if (modalType === 'create' && (!value || value === '')) {
          errors.password = 'Password wajib diisi';
        } else if (value && value.length < 6) {
          errors.password = 'Password minimal 6 karakter';
        } else if (value && !/(?=.*[a-z])/.test(value)) {
          errors.password = 'Password harus mengandung huruf kecil';
        } else if (value && !/(?=.*[A-Z])/.test(value)) {
          errors.password = 'Password harus mengandung huruf besar';
        } else if (value && !/(?=.*\d)/.test(value)) {
          errors.password = 'Password harus mengandung angka';
        }
        break;
        
      case 'password_confirmation':
        if ((modalType === 'create' || formData.password) && (!value || value === '')) {
          errors.password_confirmation = 'Konfirmasi password wajib diisi';
        } else if (value && value !== formData.password) {
          errors.password_confirmation = 'Password tidak cocok';
        }
        break;
        
      case 'role_id':
        if (!value || value === '') {
          errors.role_id = 'Role wajib dipilih';
        }
        break;
    }
    
    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Real-time validation for touched fields
    if (touched[name]) {
      const errors = validateField(name, newValue);
      setClientErrors(prev => ({
        ...prev,
        ...errors,
        [name]: errors[name] || null
      }));
    }
  };
  
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const errors = validateField(name, value);
    setClientErrors(prev => ({
      ...prev,
      ...errors,
      [name]: errors[name] || null
    }));
  };



  const handleRoleChange = (e) => {
    const roleId = e.target.value;
    setFormData(prev => ({
      ...prev,
      role_id: roleId
    }));
  };

  const createUser = async () => {
    try {
      setFormLoading(true);
      setFormError(null);

      const response = await api.post('/users', formData);
      
      if (response.data.status === 'success') {
        closeModal();
        fetchUsers();
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'User berhasil dibuat',
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (err) {
      console.error('Error creating user:', err);
      
      if (err.response?.status === 422) {
        // Validation errors
        const responseData = err.response.data;
        
        // Check if errors is an array (custom format) or object (Laravel format)
        if (Array.isArray(responseData.errors)) {
          // Custom format: [{field, tag, message}]
          const fieldErrorsObj = {};
          const errorMessages = responseData.errors.map(error => {
            if (error.field) {
              fieldErrorsObj[error.field] = [error.message];
            }
            return error.message;
          }).join('; ');
          setFieldErrors(fieldErrorsObj);
          setFormError(errorMessages || responseData.message || 'Terdapat kesalahan validasi pada form');
          setErrorTrigger(prev => prev + 1);
        } else {
          // Laravel format: {field: [messages]}
          const errors = responseData.errors;
          setFieldErrors(errors);
          const errorMessages = Object.entries(errors)
            .map(([field, messages]) => {
              const msgArray = Array.isArray(messages) ? messages : [messages];
              return msgArray.join(', ');
            })
            .join('; ');
          setFormError(errorMessages || 'Terdapat kesalahan validasi pada form');
          setErrorTrigger(prev => prev + 1);
        }
      } else if (err.response?.status === 401) {
        setFormError('Sesi Anda telah berakhir. Silakan login kembali.');
        setErrorTrigger(prev => prev + 1);
        setTimeout(() => handleSessionExpired(), 2000);
      } else if (err.response?.status === 403) {
        setFormError('Anda tidak memiliki akses untuk membuat user.');
        setErrorTrigger(prev => prev + 1);
      } else {
        const errorMessage = err.response?.data?.message || err.message || 'Gagal membuat user. Silakan coba lagi.';
        setFormError(errorMessage);
        setErrorTrigger(prev => prev + 1);
        Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          text: errorMessage
        });
      }
    } finally {
      setFormLoading(false);
    }
  };

  const updateUser = async () => {
    try {
      setFormLoading(true);
      setFormError(null);

      const updateData = { ...formData };
      // Remove password fields if empty
      if (!updateData.password) {
        delete updateData.password;
        delete updateData.password_confirmation;
      }

      const response = await api.put(`/users/${selectedUser.id}`, updateData);
      
      if (response.data.status === 'success') {
        closeModal();
        fetchUsers();
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'User berhasil diperbarui',
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (err) {
      console.error('Error updating user:', err);
      
      if (err.response?.status === 422) {
        // Validation errors
        const responseData = err.response.data;
        
        // Check if errors is an array (custom format) or object (Laravel format)
        if (Array.isArray(responseData.errors)) {
          // Custom format: [{field, tag, message}]
          const fieldErrorsObj = {};
          const errorMessages = responseData.errors.map(error => {
            if (error.field) {
              fieldErrorsObj[error.field] = [error.message];
            }
            return error.message;
          }).join('; ');
          setFieldErrors(fieldErrorsObj);
          setFormError(errorMessages || responseData.message || 'Terdapat kesalahan validasi pada form');
          setErrorTrigger(prev => prev + 1);
        } else {
          // Laravel format: {field: [messages]}
          const errors = responseData.errors;
          setFieldErrors(errors);
          const errorMessages = Object.entries(errors)
            .map(([field, messages]) => {
              const msgArray = Array.isArray(messages) ? messages : [messages];
              return msgArray.join(', ');
            })
            .join('; ');
          setFormError(errorMessages || 'Terdapat kesalahan validasi pada form');
          setErrorTrigger(prev => prev + 1);
        }
      } else if (err.response?.status === 401) {
        setFormError('Sesi Anda telah berakhir. Silakan login kembali.');
        setErrorTrigger(prev => prev + 1);
        setTimeout(() => handleSessionExpired(), 2000);
      } else if (err.response?.status === 403) {
        setFormError('Anda tidak memiliki akses untuk memperbarui user.');
        setErrorTrigger(prev => prev + 1);
      } else {
        const errorMessage = err.response?.data?.message || err.message || 'Gagal memperbarui user. Silakan coba lagi.';
        setFormError(errorMessage);
        setErrorTrigger(prev => prev + 1);
        Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          text: errorMessage
        });
      }
    } finally {
      setFormLoading(false);
    }
  };

  const deleteUser = async (user) => {
    const result = await Swal.fire({
      title: 'Konfirmasi Hapus',
      text: `Apakah Anda yakin ingin menghapus user ${user.name}?`,
      icon: 'warning',
      confirmButtonColor: '#d33',
      confirmButtonText: 'Ya, Hapus!'
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const response = await api.delete(`/users/${user.id}`);
      
      if (response.data.status === 'success') {
        fetchUsers();
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'User berhasil dihapus',
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Gagal menghapus user';
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: errorMessage
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setFormError(null);
    setFieldErrors({});
    
    // Validate all fields
    const allErrors = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'is_active') {
        const errors = validateField(key, formData[key]);
        Object.assign(allErrors, errors);
      }
    });
    
    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      password: true,
      password_confirmation: true,
      role_id: true
    });
    
    if (Object.keys(allErrors).length > 0) {
      setClientErrors(allErrors);
      const errorMessages = Object.values(allErrors).filter(Boolean).join(', ');
      setFormError(errorMessages);
      setErrorTrigger(prev => prev + 1);
      return;
    }

    if (modalType === 'create') {
      createUser();
    } else {
      updateUser();
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/users");
      
      if (response.data.status === 'success') {
        // Handle paginated data
        const userData = response.data.data.data || response.data.data;
        setUsers(Array.isArray(userData) ? userData : []);
      } else {
        setError('Gagal mengambil data pengguna');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      if (err.response?.status === 401) {
        setError('Sesi Anda telah berakhir. Silakan login kembali.');
        setTimeout(() => handleSessionExpired(), 2000);
      } else if (err.response?.status === 403) {
        setError('Anda tidak memiliki akses untuk melihat data pengguna.');
      } else {
        const errorMessage = err.response?.data?.message || err.message || 'Terjadi kesalahan saat mengambil data pengguna.';
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await api.get("/roles");
      if (response.data.status === 'success') {
        const rolesData = response.data.data.data || response.data.data;
        setRoles(Array.isArray(rolesData) ? rolesData : []);
      }
    } catch (err) {
      console.error('Error fetching roles:', err);
    }
  };

  const fetchRoleDescriptions = async () => {
    try {
      const response = await api.get("/users/role-permissions");
      if (response.data.status === 'success') {
        setRoleDescriptions(response.data.data || {});
      }
    } catch (err) {
      console.error('Error fetching role descriptions:', err);
    }
  };

  const getRoleBadgeVariant = (roleName) => {
    const variants = {
      'super_admin': 'default',
      'admin_kolegium': 'secondary',
      'admin_study_program': 'secondary',
      'admin_peer_group': 'secondary',
      'staff': 'outline',
    };
    return variants[roleName?.toLowerCase()] || 'outline';
  };

  const fetchAffiliations = async () => {
    try {
      const response = await api.get('/affiliations');
      if (response.data.status === 'success') {
        setAffiliations(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching affiliations:', err);
    }
  };

  const openAffiliationModal = async (user) => {
    setSelectedUserForAffiliation(user);
    setAffiliationLoading(true);
    setShowAffiliationModal(true);
    
    try {
      await fetchAffiliations();
      const response = await api.get(`/users/${user.id}/affiliations`);
      if (response.data.status === 'success') {
        const userAffIds = response.data.data.map(a => a.id);
        setUserAffiliations(response.data.data);
        setSelectedAffiliationIds(userAffIds);
      }
    } catch (err) {
      console.error('Error fetching user affiliations:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load user affiliations';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage
      });
    } finally {
      setAffiliationLoading(false);
    }
  };

  const closeAffiliationModal = () => {
    setShowAffiliationModal(false);
    setSelectedUserForAffiliation(null);
    setUserAffiliations([]);
    setSelectedAffiliationIds([]);
  };

  const handleAffiliationToggle = (affiliationId) => {
    setSelectedAffiliationIds(prev => {
      if (prev.includes(affiliationId)) {
        return prev.filter(id => id !== affiliationId);
      } else {
        return [...prev, affiliationId];
      }
    });
  };

  const saveUserAffiliations = async () => {
    if (selectedAffiliationIds.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: 'User must have at least one affiliation'
      });
      return;
    }

    try {
      setAffiliationLoading(true);
      const response = await api.post(`/users/${selectedUserForAffiliation.id}/affiliations`, {
        affiliation_ids: selectedAffiliationIds
      });

      if (response.data.status === 'success') {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'User affiliations updated successfully',
          timer: 2000
        });
        closeAffiliationModal();
      }
    } catch (err) {
      console.error('Error saving affiliations:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || 'Failed to update affiliations'
      });
    } finally {
      setAffiliationLoading(false);
    }
  };

  const getTypeLabel = (type) => {
    const labels = {
      kolegium: 'Kolegium',
      residen: 'Residen',
      clinical_fellowship: 'Clinical Fellowship',
      subspesialis: 'Subspesialis',
      peer_group: 'Peer Group',
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center pb-6 border-b">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Pengaturan User</h2>
          <p className="text-muted-foreground mt-1">Kelola data pengguna dan permission</p>
        </div>
        <PermissionGuard permission="users.create">
          <Button onClick={openCreateModal} className="gap-2">
            <UserPlus className="h-4 w-4" />
            Tambah User
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
        <>
          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Total User</p>
                    <p className="text-3xl font-bold">{users.length}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">User Aktif</p>
                    <p className="text-3xl font-bold text-emerald-600">{users.filter(u => u.is_active).length}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-emerald-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">User Nonaktif</p>
                    <p className="text-3xl font-bold text-rose-600">{users.filter(u => !u.is_active).length}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-rose-500/10 flex items-center justify-center">
                    <XCircle className="h-6 w-6 text-rose-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>Data Pengguna</CardTitle>
              <CardDescription>Daftar semua pengguna yang terdaftar dalam sistem</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari nama atau email..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-10"
                  />
                </div>
                <Select value={filterRole} onValueChange={(value) => {
                  setFilterRole(value);
                  setCurrentPage(1);
                }}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Filter Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Role</SelectItem>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                    <SelectItem value="admin_kolegium">Admin Kolegium</SelectItem>
                    <SelectItem value="admin_study_program_resident">Admin Residen</SelectItem>
                    <SelectItem value="admin_study_program_fellow">Admin Fellow</SelectItem>
                    <SelectItem value="admin_study_program_trainee">Admin Trainee</SelectItem>
                    <SelectItem value="admin_peer_group">Admin Peer Group</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={(value) => {
                  setFilterStatus(value);
                  setCurrentPage(1);
                }}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="inactive">Nonaktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>


              {filteredUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="p-4 bg-muted rounded-full mb-4">
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground text-center font-medium">
                    {users.length === 0 ? 'Belum ada data pengguna' : 'Tidak ada data yang sesuai dengan pencarian'}
                  </p>
                  <p className="text-muted-foreground text-sm mt-1">
                    {users.length === 0 ? 'Klik tombol "Tambah User" untuk membuat user baru' : 'Coba ubah kata kunci atau filter pencarian'}
                  </p>
                </div>
              ) : (
                <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">No</TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedUsers.map((user, index) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{(currentPage - 1) * itemsPerPage + index + 1}.</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium">{user.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={getRoleBadgeVariant(user.role?.name)}>
                            {getRoleLabel(user.role?.name) || 'Unknown'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${user.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                            <span className={`text-sm font-medium ${user.is_active ? 'text-green-700' : 'text-red-700'}`}>
                              {user.is_active ? 'Aktif' : 'Nonaktif'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <PermissionGuard permission="users.edit">
                              <Button variant="outline" size="sm" onClick={() => openAffiliationModal(user)}>
                                <Building2 className="h-4 w-4 mr-1" />
                                Affiliations
                              </Button>
                            </PermissionGuard>
                            <PermissionGuard permission="users.edit">
                              <Button variant="outline" size="sm" onClick={() => openEditModal(user)}>
                                <Pencil className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                            </PermissionGuard>
                            <PermissionGuard permission="users.delete">
                              <Button variant="destructive" size="sm" onClick={() => deleteUser(user)}>
                                <Trash2 className="h-4 w-4 mr-1" />
                                Hapus
                              </Button>
                            </PermissionGuard>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      Menampilkan {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredUsers.length)} dari {filteredUsers.length} data
                      {searchTerm || filterRole !== 'all' || filterStatus !== 'all' ? ` (difilter dari ${users.length} total)` : ''}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            className="w-8 h-8 p-0"
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </Button>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Dialog for Add/Edit User */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent ref={dialogContentRef} className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {modalType === 'create' ? 'Tambah User Baru' : 'Edit User'}
            </DialogTitle>
            <DialogDescription>
              {modalType === 'create' ? 'Buat pengguna baru untuk sistem' : 'Perbarui informasi pengguna'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error!</AlertTitle>
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                onBlur={handleBlur}
                placeholder="Masukkan nama lengkap"
                className={(
                  (touched.name && clientErrors.name) || fieldErrors.name
                    ? 'border-red-500 focus-visible:ring-red-500'
                    : touched.name && !clientErrors.name
                    ? 'border-green-500 focus-visible:ring-green-500'
                    : ''
                )}
              />
              {touched.name && clientErrors.name && (
                <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {clientErrors.name}
                </p>
              )}
              {fieldErrors.name && !clientErrors.name && (
                <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {fieldErrors.name[0]}
                </p>
              )}
              {touched.name && !clientErrors.name && !fieldErrors.name && formData.name && (
                <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Nama valid
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleBlur}
                placeholder="contoh@email.com"
                className={(
                  (touched.email && clientErrors.email) || fieldErrors.email
                    ? 'border-red-500 focus-visible:ring-red-500'
                    : touched.email && !clientErrors.email
                    ? 'border-green-500 focus-visible:ring-green-500'
                    : ''
                )}
              />
              {touched.email && clientErrors.email && (
                <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {clientErrors.email}
                </p>
              )}
              {fieldErrors.email && !clientErrors.email && (
                <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {fieldErrors.email[0]}
                </p>
              )}
              {touched.email && !clientErrors.email && !fieldErrors.email && formData.email && (
                <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Email valid
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                {modalType === 'create' ? 'Password *' : 'Password'}
              </Label>
              <p className="text-xs text-muted-foreground">
                {modalType === 'create' ? 'Minimal 6 karakter, harus mengandung huruf besar, kecil, dan angka' : 'Kosongkan jika tidak ingin mengubah'}
              </p>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Masukkan password"
                  className={(
                    (touched.password && clientErrors.password) || fieldErrors.password
                      ? 'border-red-500 focus-visible:ring-red-500 pr-10'
                      : touched.password && !clientErrors.password && formData.password
                      ? 'border-green-500 focus-visible:ring-green-500 pr-10'
                      : 'pr-10'
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {touched.password && clientErrors.password && (
                <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {clientErrors.password}
                </p>
              )}
              {fieldErrors.password && !clientErrors.password && (
                <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {fieldErrors.password[0]}
                </p>
              )}
              {formData.password && touched.password && !clientErrors.password && (
                <div className="space-y-1">
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Password kuat
                  </p>
                  <div className="flex gap-1">
                    <div className={`h-1 flex-1 rounded ${formData.password.length >= 8 ? 'bg-green-500' : 'bg-gray-200'}`} />
                    <div className={`h-1 flex-1 rounded ${/(?=.*[a-z])/.test(formData.password) && /(?=.*[A-Z])/.test(formData.password) ? 'bg-green-500' : 'bg-gray-200'}`} />
                    <div className={`h-1 flex-1 rounded ${/(?=.*\d)/.test(formData.password) ? 'bg-green-500' : 'bg-gray-200'}`} />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password_confirmation">
                Konfirmasi Password {(modalType === 'create' || formData.password) && '*'}
              </Label>
              <div className="relative">
                <Input
                  id="password_confirmation"
                  type={showPasswordConfirmation ? "text" : "password"}
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Ulangi password"
                  className={(
                    (touched.password_confirmation && clientErrors.password_confirmation) || fieldErrors.password_confirmation
                      ? 'border-red-500 focus-visible:ring-red-500 pr-10'
                      : touched.password_confirmation && !clientErrors.password_confirmation && formData.password_confirmation
                      ? 'border-green-500 focus-visible:ring-green-500 pr-10'
                      : 'pr-10'
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswordConfirmation ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {touched.password_confirmation && clientErrors.password_confirmation && (
                <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {clientErrors.password_confirmation}
                </p>
              )}
              {fieldErrors.password_confirmation && !clientErrors.password_confirmation && (
                <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {fieldErrors.password_confirmation[0]}
                </p>
              )}
              {touched.password_confirmation && !clientErrors.password_confirmation && formData.password_confirmation && formData.password === formData.password_confirmation && (
                <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Password cocok
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Role *</Label>
              <Select 
                value={formData.role_id} 
                onValueChange={(value) => {
                  setFormData(prev => ({ ...prev, role_id: value }));
                  setTouched(prev => ({ ...prev, role_id: true }));
                  const errors = validateField('role_id', value);
                  setClientErrors(prev => ({ ...prev, role_id: errors.role_id || null }));
                }}
              >
                <SelectTrigger className={(
                  (touched.role_id && clientErrors.role_id) || fieldErrors.role_id
                    ? 'border-red-500 focus:ring-red-500'
                    : touched.role_id && !clientErrors.role_id && formData.role_id
                    ? 'border-green-500 focus:ring-green-500'
                    : ''
                )}>
                  <SelectValue placeholder="Pilih Role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role, index) => (
                    <SelectItem key={index} value={role.role}>
                      {getRoleLabel(role.role)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {touched.role_id && clientErrors.role_id && (
                <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {clientErrors.role_id}
                </p>
              )}
              {fieldErrors.role_id && !clientErrors.role_id && (
                <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {fieldErrors.role_id[0]}
                </p>
              )}
              {touched.role_id && !clientErrors.role_id && !fieldErrors.role_id && formData.role_id && (
                <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Role dipilih
                </p>
              )}
              
              {/* Role Description */}
              {formData.role_id && (() => {
                const selectedRole = roles.find(r => r.role === formData.role_id);
                const roleDesc = roleDescriptions[selectedRole?.role];
                return selectedRole && (
                  <div className="mt-3 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <p className="text-sm font-medium mb-2">
                      {roleDesc?.description || selectedRole.description}
                    </p>
                    {(selectedRole.permissions || roleDesc?.permissions) && (selectedRole.permissions || roleDesc.permissions).length > 0 && (
                      <div className="text-xs text-muted-foreground">
                        <strong>Akses:</strong>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          {(selectedRole.permissions || roleDesc.permissions).map((permission, index) => (
                            <li key={index} className="capitalize">{permission.replace(/\./g, ' ').replace(/_/g, ' ')}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              />
              <Label htmlFor="is_active" className="cursor-pointer">User Aktif</Label>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={closeModal}>
                Batal
              </Button>
              <Button type="submit" disabled={formLoading}>
                {formLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {modalType === 'create' ? 'Membuat...' : 'Memperbarui...'}
                  </>
                ) : (
                  modalType === 'create' ? 'Buat User' : 'Perbarui User'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog for Manage User Affiliations */}
      <Dialog open={showAffiliationModal} onOpenChange={setShowAffiliationModal}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Manage Affiliations - {selectedUserForAffiliation?.name}
            </DialogTitle>
            <DialogDescription>
              Assign organizational affiliations to this user. User must have at least one affiliation.
            </DialogDescription>
          </DialogHeader>

          {affiliationLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="text-sm text-muted-foreground mb-4">
                Selected: <strong>{selectedAffiliationIds.length}</strong> affiliation(s)
              </div>

              {['kolegium', 'residen', 'clinical_fellowship', 'subspesialis', 'peer_group'].map(type => {
                const typeAffiliations = affiliations.filter(a => a.type === type);
                if (typeAffiliations.length === 0) return null;

                return (
                  <div key={type} className="space-y-2">
                    <h4 className="font-semibold text-sm uppercase text-muted-foreground">
                      {getTypeLabel(type)}
                    </h4>
                    <div className="space-y-2 pl-4">
                      {typeAffiliations.map(affiliation => (
                        <div key={affiliation.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`aff-${affiliation.id}`}
                            checked={selectedAffiliationIds.includes(affiliation.id)}
                            onCheckedChange={() => handleAffiliationToggle(affiliation.id)}
                          />
                          <Label
                            htmlFor={`aff-${affiliation.id}`}
                            className="cursor-pointer flex-1 flex items-center justify-between"
                          >
                            <span>{affiliation.name}</span>
                            <code className="text-xs bg-muted px-2 py-1 rounded">
                              {affiliation.code}
                            </code>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {affiliations.length === 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>No Affiliations</AlertTitle>
                  <AlertDescription>
                    No affiliations available. Please create affiliations first in the Affiliations tab.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={closeAffiliationModal}
              disabled={affiliationLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={saveUserAffiliations}
              disabled={affiliationLoading || selectedAffiliationIds.length === 0}
            >
              {affiliationLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Affiliations
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
