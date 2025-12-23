import React, { useEffect, useState, useMemo } from "react";
import { Building2, Plus, Pencil, Trash2, Users, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import api from "@/api/axios";
import Swal from "sweetalert2";
import PermissionGuard from "@/components/PermissionGuard";

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

export default function AffiliationSettings() {
  const [affiliations, setAffiliations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('create');
  const [selectedAffiliation, setSelectedAffiliation] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'residen',
    code: ''
  });
  
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchAffiliations();
  }, []);

  const fetchAffiliations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/affiliations');
      if (response.data.status === 'success') {
        setAffiliations(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch affiliations');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || 'Failed to fetch affiliations'
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'residen',
      code: ''
    });
    setFormError(null);
    setSelectedAffiliation(null);
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

  const getTypeBadgeVariant = (type) => {
    const variants = {
      kolegium: 'default',
      residen: 'secondary',
      clinical_fellowship: 'outline',
      subspesialis: 'destructive',
      peer_group: 'default',
    };
    return variants[type] || 'default';
  };

  const filteredAffiliations = useMemo(() => {
    return affiliations.filter(affiliation => {
      const matchesSearch = affiliation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           affiliation.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || affiliation.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [affiliations, searchTerm, filterType]);

  const totalPages = Math.ceil(filteredAffiliations.length / itemsPerPage);
  const paginatedAffiliations = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAffiliations.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAffiliations, currentPage, itemsPerPage]);

  const handleOpenModal = (type, affiliation = null) => {
    setModalType(type);
    if (type === 'edit' && affiliation) {
      setSelectedAffiliation(affiliation);
      setFormData({
        name: affiliation.name,
        type: affiliation.type,
        code: affiliation.code
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);

    try {
      if (modalType === 'create') {
        const response = await api.post('/affiliations', formData);
        if (response.data.status === 'success') {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Affiliation created successfully',
            timer: 2000
          });
          fetchAffiliations();
          handleCloseModal();
        }
      } else if (modalType === 'edit') {
        const response = await api.put(`/affiliations/${selectedAffiliation.id}`, formData);
        if (response.data.status === 'success') {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Affiliation updated successfully',
            timer: 2000
          });
          fetchAffiliations();
          handleCloseModal();
        }
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Operation failed';
      setFormError(errorMessage);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (affiliation) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Delete affiliation "${affiliation.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const response = await api.delete(`/affiliations/${affiliation.id}`);
        if (response.data.status === 'success') {
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Affiliation has been deleted.',
            timer: 2000
          });
          fetchAffiliations();
        }
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.response?.data?.message || 'Failed to delete affiliation'
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <PermissionGuard permission="users.view">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Affiliation Management
                </CardTitle>
                <CardDescription>
                  Manage organizational affiliations for users
                </CardDescription>
              </div>
              <PermissionGuard permission="users.create">
                <Button onClick={() => handleOpenModal('create')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Affiliation
                </Button>
              </PermissionGuard>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search by name or code..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="kolegium">Kolegium</SelectItem>
                    <SelectItem value="residen">Residen</SelectItem>
                    <SelectItem value="clinical_fellowship">Clinical Fellowship</SelectItem>
                    <SelectItem value="subspesialis">Subspesialis</SelectItem>
                    <SelectItem value="peer_group">Peer Group</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-center">Users</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedAffiliations.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                          No affiliations found
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedAffiliations.map((affiliation) => (
                        <TableRow key={affiliation.id}>
                          <TableCell className="font-medium">{affiliation.name}</TableCell>
                          <TableCell>
                            <code className="text-xs bg-muted px-2 py-1 rounded">
                              {affiliation.code}
                            </code>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getTypeBadgeVariant(affiliation.type)}>
                              {getTypeLabel(affiliation.type)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span>{affiliation.users_count || 0}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <PermissionGuard permission="users.edit">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleOpenModal('edit', affiliation)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </PermissionGuard>
                              <PermissionGuard permission="users.delete">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(affiliation)}
                                  disabled={affiliation.users_count > 0}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </PermissionGuard>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
                    {Math.min(currentPage * itemsPerPage, filteredAffiliations.length)} of{' '}
                    {filteredAffiliations.length} affiliations
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {modalType === 'create' ? 'Add New Affiliation' : 'Edit Affiliation'}
              </DialogTitle>
              <DialogDescription>
                {modalType === 'create' 
                  ? 'Create a new organizational affiliation' 
                  : 'Update affiliation details'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                {formError && (
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{formError}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., FK Universitas Indonesia"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="code">Code *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g., FK-UI"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Unique identifier for this affiliation
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kolegium">Kolegium</SelectItem>
                      <SelectItem value="residen">Residen</SelectItem>
                      <SelectItem value="clinical_fellowship">Clinical Fellowship</SelectItem>
                      <SelectItem value="subspesialis">Subspesialis</SelectItem>
                      <SelectItem value="peer_group">Peer Group</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                  disabled={formLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={formLoading}>
                  {formLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {modalType === 'create' ? 'Create' : 'Update'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </PermissionGuard>
  );
}
