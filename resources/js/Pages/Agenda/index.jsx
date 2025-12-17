import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Eye, EyeOff, Loader2, Pencil, Plus, Trash2, AlertCircle } from "lucide-react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import api from "@/api/axios";
import Swal from "sweetalert2";
import PermissionGuard from "@/components/PermissionGuard";
import { useAuth } from "@/contexts/AuthContext";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

const EVENT_TYPES = [
  { id: "ujian_lokal", name: "Ujian Lokal" },
  { id: "ujian_nasional", name: "Ujian Nasional" },
  { id: "event_lokal", name: "Event Lokal" },
  { id: "event_nasional", name: "Event Nasional" },
  { id: "event_peer_group", name: "Event Peer Group" },
];

const SCOPES = [
  { id: "kolegium", label: "Kolegium" },
  { id: "study_program", label: "Study Program" },
  { id: "peer_group", label: "Peer Group" },
];

export default function AgendaPage() {
  const { hasPermission } = useAuth();

  const tabs = useMemo(() => {
    return SCOPES.map((s) => ({
      value: s.id,
      label: s.label,
      enabled: hasPermission(`agenda.${s.id}.view`),
    })).filter((t) => t.enabled);
  }, [hasPermission]);

  const allowedValues = useMemo(() => tabs.map((t) => t.value), [tabs]);
  const defaultScope = allowedValues[0] || "kolegium";

  const [activeScope, setActiveScope] = useState(defaultScope);

  const [events, setEvents] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 10,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    type: "all",
    from: "",
    to: "",
    per_page: "10",
  });

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("create");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formData, setFormData] = useState({
    type: "event_nasional",
    title: "",
    description: "",
    location: "",
    registration_url: "",
    image_url: "",
    start_date: "",
    end_date: "",
    is_published: false,
  });

  useEffect(() => {
    if (!allowedValues.includes(activeScope)) {
      setActiveScope(defaultScope);
    }
  }, [activeScope, allowedValues, defaultScope]);

  const getTypeLabel = (type) => {
    return EVENT_TYPES.find((t) => t.id === type)?.name || type || "-";
  };

  const resetForm = () => {
    setSelectedEvent(null);
    setFormError(null);
    setFormData({
      type: "event_nasional",
      title: "",
      description: "",
      location: "",
      registration_url: "",
      image_url: "",
      start_date: "",
      end_date: "",
      is_published: false,
    });
  };

  const openCreateModal = () => {
    resetForm();
    setModalType("create");
    setShowModal(true);
  };

  const openEditModal = (event) => {
    setSelectedEvent(event);
    setFormError(null);
    setFormData({
      type: event.type || "event_nasional",
      title: event.title || "",
      description: event.description || "",
      location: event.location || "",
      registration_url: event.registration_url || "",
      image_url: event.image_url || "",
      start_date: event.start_date || "",
      end_date: event.end_date || "",
      is_published: !!event.is_published,
    });
    setModalType("edit");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const fetchEvents = async ({ scope = activeScope, page = 1 } = {}) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        scope,
        page,
        per_page: Number(filters.per_page || 10),
      };

      if (filters.type && filters.type !== "all") params.type = filters.type;
      if (filters.from) params.from = filters.from;
      if (filters.to) params.to = filters.to;

      const response = await api.get("/agenda-events", { params });

      if (response.data?.status !== "success") {
        setError("Gagal mengambil data agenda.");
        setEvents([]);
        return;
      }

      const paginator = response.data.data;
      const data = paginator?.data || [];

      setEvents(Array.isArray(data) ? data : []);
      setPagination({
        current_page: paginator?.current_page || 1,
        last_page: paginator?.last_page || 1,
        total: paginator?.total || 0,
        per_page: paginator?.per_page || Number(filters.per_page || 10),
      });
    } catch (err) {
      if (err.response?.status === 403) {
        setError("Anda tidak memiliki akses untuk melihat agenda pada scope ini.");
      } else {
        setError("Terjadi kesalahan saat mengambil data agenda.");
      }
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tabs.length === 0) return;
    fetchEvents({ scope: activeScope, page: 1 });
  }, [activeScope, filters.type, filters.from, filters.to, filters.per_page]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setFormLoading(true);
      setFormError(null);

      const payload = {
        ...formData,
        scope: activeScope,
      };

      if (!payload.end_date) delete payload.end_date;
      if (!payload.description) delete payload.description;
      if (!payload.location) delete payload.location;
      if (!payload.registration_url) delete payload.registration_url;
      if (!payload.image_url) delete payload.image_url;

      const response =
        modalType === "create"
          ? await api.post("/agenda-events", payload)
          : await api.put(`/agenda-events/${selectedEvent.id}`, payload);

      if (response.data?.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: modalType === "create" ? "Agenda berhasil dibuat" : "Agenda berhasil diperbarui",
          timer: 2000,
          showConfirmButton: false,
        });
        closeModal();
        fetchEvents({ scope: activeScope, page: pagination.current_page });
        return;
      }

      setFormError("Gagal menyimpan agenda.");
    } catch (err) {
      if (err.response?.status === 422 && err.response.data?.errors) {
        const errors = Object.values(err.response.data.errors).flat();
        setFormError(errors.join(", "));
      } else if (err.response?.status === 403) {
        setFormError("Anda tidak memiliki akses untuk melakukan aksi ini.");
      } else {
        setFormError("Terjadi kesalahan saat menyimpan agenda.");
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (event) => {
    const result = await Swal.fire({
      title: "Konfirmasi Hapus",
      text: `Apakah Anda yakin ingin menghapus agenda \"${event.title}\"?`,
      icon: "warning",
      confirmButtonColor: "#d33",
      confirmButtonText: "Ya, Hapus!",
      showCancelButton: true,
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await api.delete(`/agenda-events/${event.id}`);
      if (response.data?.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Agenda berhasil dihapus",
          timer: 2000,
          showConfirmButton: false,
        });
        fetchEvents({ scope: activeScope, page: pagination.current_page });
        return;
      }
      Swal.fire({ icon: "error", title: "Gagal!", text: "Gagal menghapus agenda" });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Gagal!", text: "Gagal menghapus agenda" });
    }
  };

  const handleTogglePublish = async (event) => {
    const target = event.is_published ? "unpublish" : "publish";

    try {
      const response = await api.post(`/agenda-events/${event.id}/${target}`);
      if (response.data?.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: event.is_published ? "Agenda berhasil di-unpublish" : "Agenda berhasil dipublish",
          timer: 1500,
          showConfirmButton: false,
        });
        fetchEvents({ scope: activeScope, page: pagination.current_page });
        return;
      }

      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Gagal memperbarui status publish.",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Gagal memperbarui status publish.",
      });
    }
  };

  const canCreate = hasPermission(`agenda.${activeScope}.create`);

  return (
    <DashboardLayout title="Agenda">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Agenda</h1>
            <p className="text-muted-foreground">
              Kelola agenda dan kalender untuk ditampilkan pada landing page.
            </p>
          </div>
          <PermissionGuard permission={`agenda.${activeScope}.create`}>
            <Button onClick={openCreateModal} className="gap-2" disabled={!canCreate || tabs.length === 0}>
              <Plus className="h-4 w-4" />
              Tambah Agenda
            </Button>
          </PermissionGuard>
        </div>

        {tabs.length === 0 ? (
          <div className="rounded-lg border p-6 text-sm text-muted-foreground">
            Anda tidak memiliki akses untuk membuka halaman ini.
          </div>
        ) : (
          <Tabs value={activeScope} onValueChange={setActiveScope} className="space-y-4">
            <TabsList>
              {tabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value} className="gap-2">
                  <CalendarDays className="h-4 w-4" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={activeScope} className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Filter</CardTitle>
                  <CardDescription>Gunakan filter untuk mencari agenda</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select value={filters.type} onValueChange={(v) => setFilters((p) => ({ ...p, type: v }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Semua</SelectItem>
                          {EVENT_TYPES.map((t) => (
                            <SelectItem key={t.id} value={t.id}>
                              {t.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Dari</Label>
                      <Input
                        type="date"
                        value={filters.from}
                        onChange={(e) => setFilters((p) => ({ ...p, from: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Sampai</Label>
                      <Input
                        type="date"
                        value={filters.to}
                        onChange={(e) => setFilters((p) => ({ ...p, to: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Per Page</Label>
                      <Select
                        value={filters.per_page}
                        onValueChange={(v) => setFilters((p) => ({ ...p, per_page: v }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Per page" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="25">25</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

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
                    <CardTitle>Daftar Agenda</CardTitle>
                    <CardDescription>
                      Total: {pagination.total} agenda
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {events.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12">
                        <div className="p-4 bg-muted rounded-full mb-4">
                          <CalendarDays className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground text-center font-medium">Belum ada agenda</p>
                        <p className="text-muted-foreground text-sm mt-1">Klik "Tambah Agenda" untuk menambahkan agenda baru</p>
                      </div>
                    ) : (
                      <>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Judul</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Tanggal</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {events.map((event) => (
                              <TableRow key={event.id}>
                                <TableCell className="font-medium">
                                  <div className="space-y-1">
                                    <div>{event.title}</div>
                                    {event.location ? (
                                      <div className="text-xs text-muted-foreground">{event.location}</div>
                                    ) : null}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="secondary" className="capitalize">
                                    {getTypeLabel(event.type)}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="text-sm">
                                    {event.start_date}
                                    {event.end_date ? ` - ${event.end_date}` : ""}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {event.is_published ? (
                                    <Badge variant="default">Published</Badge>
                                  ) : (
                                    <Badge variant="outline">Draft</Badge>
                                  )}
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <PermissionGuard permission={`agenda.${activeScope}.edit`}>
                                      <Button variant="outline" size="sm" onClick={() => openEditModal(event)}>
                                        <Pencil className="h-4 w-4 mr-1" />
                                        Edit
                                      </Button>
                                    </PermissionGuard>

                                    <PermissionGuard permission={`agenda.${activeScope}.publish`}>
                                      <Button
                                        variant={event.is_published ? "outline" : "default"}
                                        size="sm"
                                        onClick={() => handleTogglePublish(event)}
                                        className="gap-1"
                                      >
                                        {event.is_published ? (
                                          <>
                                            <EyeOff className="h-4 w-4" />
                                            Unpublish
                                          </>
                                        ) : (
                                          <>
                                            <Eye className="h-4 w-4" />
                                            Publish
                                          </>
                                        )}
                                      </Button>
                                    </PermissionGuard>

                                    <PermissionGuard permission={`agenda.${activeScope}.delete`}>
                                      <Button variant="destructive" size="sm" onClick={() => handleDelete(event)}>
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

                        <div className="flex items-center justify-between mt-4">
                          <div className="text-sm text-muted-foreground">
                            Page {pagination.current_page} of {pagination.last_page}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={pagination.current_page <= 1}
                              onClick={() => fetchEvents({ scope: activeScope, page: pagination.current_page - 1 })}
                            >
                              Prev
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={pagination.current_page >= pagination.last_page}
                              onClick={() => fetchEvents({ scope: activeScope, page: pagination.current_page + 1 })}
                            >
                              Next
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {modalType === "create" ? "Tambah Agenda" : "Edit Agenda"}
            </DialogTitle>
            <DialogDescription>
              {modalType === "create" ? "Buat agenda baru" : "Perbarui data agenda"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {formError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error!</AlertTitle>
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            ) : null}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Type *</Label>
                <Select value={formData.type} onValueChange={(v) => setFormData((p) => ({ ...p, type: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih type" />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_TYPES.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Judul *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                  required
                  placeholder="Masukkan judul"
                />
              </div>

              <div className="space-y-2">
                <Label>Tanggal Mulai *</Label>
                <Input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData((p) => ({ ...p, start_date: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Tanggal Selesai</Label>
                <Input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData((p) => ({ ...p, end_date: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Lokasi</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))}
                  placeholder="Masukkan lokasi"
                />
              </div>

              <div className="space-y-2">
                <Label>Registration URL</Label>
                <Input
                  value={formData.registration_url}
                  onChange={(e) => setFormData((p) => ({ ...p, registration_url: e.target.value }))}
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Image URL</Label>
                <Input
                  value={formData.image_url}
                  onChange={(e) => setFormData((p) => ({ ...p, image_url: e.target.value }))}
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Deskripsi</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  rows={4}
                  placeholder="Deskripsi agenda"
                />
              </div>
            </div>

            {modalType === "create" ? (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_published"
                  checked={formData.is_published}
                  onCheckedChange={(checked) => setFormData((p) => ({ ...p, is_published: !!checked }))}
                />
                <Label htmlFor="is_published" className="cursor-pointer">
                  Publish sekarang
                </Label>
              </div>
            ) : null}

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={closeModal} disabled={formLoading}>
                Batal
              </Button>
              <Button type="submit" disabled={formLoading}>
                {formLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Menyimpan...
                  </>
                ) : modalType === "create" ? (
                  "Buat"
                ) : (
                  "Simpan"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
