import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Eye, EyeOff, Loader2, Pencil, Plus, Trash2, AlertCircle } from "lucide-react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import api from "@/api/axios";
import Swal from "sweetalert2";
import PermissionGuard from "@/components/PermissionGuard";
import { useAuth } from "@/contexts/AuthContext";
import { usePage } from "@inertiajs/react";

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
import { Textarea } from "@/components/ui/textarea";

const FALLBACK_EVENT_TYPES = [
  { id: "ujian_lokal", name: "Ujian Lokal" },
  { id: "ujian_nasional", name: "Ujian Nasional" },
  { id: "event_lokal", name: "Event Lokal" },
  { id: "event_nasional", name: "Event Nasional" },
  { id: "event_peer_group", name: "Event Peer Group International" },
  { id: "event_peer_group_nasional", name: "Event Peer Group National" },
];

const EVENT_TYPE_COLORS = {
  ujian_lokal: { bg: "bg-red-500", text: "text-red-700" },
  ujian_nasional: { bg: "bg-blue-500", text: "text-blue-700" },
  event_lokal: { bg: "bg-green-500", text: "text-green-700" },
  event_nasional: { bg: "bg-orange-500", text: "text-orange-700" },
  event_peer_group: { bg: "bg-purple-500", text: "text-purple-700" },
  event_peer_group_nasional: { bg: "bg-indigo-500", text: "text-indigo-700" },
};

const SCOPE_LABELS = {
  kolegium: "Kolegium",
  study_program: "Study Program",
  peer_group: "Peer Group",
};

const SECTION_LABELS = {
  resident: "Resident",
  fellow: "Fellow",
  trainee: "Trainee",
};

const buildAgendaTitle = ({ scope, section, type }) => {
  const scopeLabel = scope ? SCOPE_LABELS[scope] : null;
  const sectionLabel = section ? SECTION_LABELS[section] : null;
  const typeLabel = type ? FALLBACK_EVENT_TYPES.find((t) => t.id === type)?.name || type : null;

  if (!scopeLabel) return "Agenda";

  if (scope === "study_program" && sectionLabel) {
    return `Agenda ${scopeLabel} - ${sectionLabel}`;
  }

  if (typeLabel) {
    return `Agenda ${scopeLabel} - ${typeLabel}`;
  }

  return `Agenda ${scopeLabel}`;
};

export default function AgendaPage() {
  const page = usePage();
  const inertiaUrl = page.url;
  const agendaTypeOptions = Array.isArray(page.props?.agendaTypeOptions) ? page.props.agendaTypeOptions : [];

  const queryParams = useMemo(() => {
    const query = (inertiaUrl || "").split("?")[1] || "";
    return new URLSearchParams(query);
  }, [inertiaUrl]);

  const pageTitle = useMemo(() => {
    const typeFromUrl = queryParams.get("type");
    const base = agendaTypeOptions.length > 0 ? agendaTypeOptions : FALLBACK_EVENT_TYPES;
    const typeLabel = typeFromUrl ? base.find((t) => t.id === typeFromUrl)?.name || null : null;

    return buildAgendaTitle({
      scope: queryParams.get("scope"),
      section: queryParams.get("section"),
      type: typeLabel ? typeFromUrl : null,
    });
  }, [agendaTypeOptions, queryParams]);

  return (
    <DashboardLayout title={pageTitle}>
      <AgendaContent />
    </DashboardLayout>
  );
}

function AgendaContent() {
  const page = usePage();
  const inertiaUrl = page.url;
  const agendaTypeOptions = Array.isArray(page.props?.agendaTypeOptions) ? page.props.agendaTypeOptions : [];
  const { hasPermission, hasAnyPermission, hasAnyRole } = useAuth();

  const queryParams = useMemo(() => {
    const query = (inertiaUrl || "").split("?")[1] || "";
    return new URLSearchParams(query);
  }, [inertiaUrl]);

  const scopeFromUrl = queryParams.get("scope");
  const sectionFromUrl = queryParams.get("section");
  const typeFromUrl = queryParams.get("type");
  const fixedType = useMemo(() => {
    if (!typeFromUrl) return null;
    const base = agendaTypeOptions.length > 0 ? agendaTypeOptions : FALLBACK_EVENT_TYPES;
    return base.some((t) => t.id === typeFromUrl) ? typeFromUrl : null;
  }, [agendaTypeOptions, typeFromUrl]);

  const toDateInputValue = (value) => {
    if (!value) return "";

    if (typeof value === "string") {
      const match = value.match(/^(\d{4}-\d{2}-\d{2})/);
      if (match?.[1]) return match[1];
      return value;
    }

    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    return d.toISOString().slice(0, 10);
  };

  const formatDateHuman = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateRangeHuman = (startStr, endStr) => {
    const start = formatDateHuman(startStr);
    if (!endStr) return start;
    const end = formatDateHuman(endStr);
    return `${start} - ${end}`;
  };

  const resolveImageUrl = (raw) => {
    if (!raw) return "";
    const s = String(raw).trim();
    if (!s) return "";

    if (
      s.startsWith("http://") ||
      s.startsWith("https://") ||
      s.startsWith("data:") ||
      s.startsWith("//")
    ) {
      return s;
    }

    if (s.startsWith("/")) return s;
    if (s.startsWith("public/")) return `/${s.replace(/^public\//, "")}`;
    if (s.startsWith("storage/")) return `/${s}`;
    if (s.startsWith("assets/")) return `/${s}`;
    if (s.startsWith("agenda-images/")) return `/storage/${s}`;

    return `/${s}`;
  };

  const getApiErrorMessage = (err, fallback) => {
    const data = err?.response?.data;
    if (typeof data?.message === "string" && data.message.trim()) return data.message;
    const firstErrMsg = data?.errors?.[0]?.message;
    if (typeof firstErrMsg === "string" && firstErrMsg.trim()) return firstErrMsg;
    return fallback;
  };

  const allowedValues = useMemo(() => {
    if (hasAnyRole(["admin_kolegium"])) {
      return ["kolegium", "study_program", "peer_group"];
    }

    const canViewStudyProgram = hasAnyPermission([
      "agenda.study_program.view",
      "agenda.study_program.resident.view",
      "agenda.study_program.fellow.view",
      "agenda.study_program.trainee.view",
    ]);

    const map = {
      kolegium: hasPermission("agenda.kolegium.view"),
      peer_group: hasPermission("agenda.peer_group.view"),
      study_program: canViewStudyProgram,
    };

    return Object.entries(map)
      .filter(([, ok]) => !!ok)
      .map(([key]) => key);
  }, [hasAnyPermission, hasAnyRole, hasPermission]);

  const defaultScope = allowedValues[0] || "kolegium";

  const routeScopeLocked = !!scopeFromUrl;
  const routeScopeAllowed = !routeScopeLocked || allowedValues.includes(scopeFromUrl);

  const allowedSections = useMemo(() => {
    if (hasAnyRole(["admin_kolegium"])) {
      return ["resident", "fellow", "trainee"];
    }

    const canViewAll = hasPermission("agenda.study_program.view");
    const all = ["resident", "fellow", "trainee"];
    return all.filter((s) => canViewAll || hasPermission(`agenda.study_program.${s}.view`));
  }, [hasAnyRole, hasPermission]);

  const activeScope = useMemo(() => scopeFromUrl || defaultScope, [scopeFromUrl, defaultScope]);

  const activeSection = useMemo(() => {
    if (activeScope !== "study_program") return null;
    if (sectionFromUrl && allowedSections.includes(sectionFromUrl)) return sectionFromUrl;
    return null;
  }, [activeScope, allowedSections, sectionFromUrl]);

  const pageHeading = useMemo(() => {
    return buildAgendaTitle({
      scope: activeScope,
      section: activeSection,
      type: fixedType,
    });
  }, [activeScope, activeSection, fixedType]);

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
    type: fixedType || "all",
    from: "",
    to: "",
    per_page: "10",
  });

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("create");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [imagePreview, setImagePreview] = useState({ url: "", title: "" });
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

  const [imageMode, setImageMode] = useState("url");
  const [imageFile, setImageFile] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);

  const getPermissionsForAction = (action) => {
    if (activeScope === "study_program") {
      const perms = [`agenda.study_program.${action}`];
      if (activeSection) perms.push(`agenda.study_program.${activeSection}.${action}`);
      return perms;
    }

    return [`agenda.${activeScope}.${action}`];
  };

  const getTypeLabel = (type) => {
    const base = agendaTypeOptions.length > 0 ? agendaTypeOptions : FALLBACK_EVENT_TYPES;
    return base.find((t) => t.id === type)?.name || type || "-";
  };

  const getTypeColor = (type) => {
    return EVENT_TYPE_COLORS[type] || EVENT_TYPE_COLORS.ujian_lokal;
  };

  const resetForm = () => {
    setSelectedEvent(null);
    setFormError(null);
    setFormData({
      type: fixedType || agendaTypeOptions?.[0]?.id || "event_nasional",
      title: "",
      description: "",
      location: "",
      registration_url: "",
      image_url: "",
      start_date: "",
      end_date: "",
      is_published: false,
    });
    setImageMode("url");
    setImageFile(null);
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
      start_date: toDateInputValue(event.start_date),
      end_date: toDateInputValue(event.end_date),
      is_published: !!event.is_published,
    });
    setImageMode("url");
    setImageFile(null);
    setModalType("edit");
    setShowModal(true);
  };

  const uploadImageFile = async (file) => {
    if (!file) return;

    try {
      setImageUploading(true);
      setFormError(null);

      const form = new FormData();
      form.append("image", file);

      let endpoint = "/agenda-events/upload-image";
      if (modalType === "edit" && selectedEvent?.id) {
        endpoint = `/agenda-events/${selectedEvent.id}/upload-image`;
      } else {
        form.append("scope", activeScope);
        if (activeScope === "study_program" && activeSection) {
          form.append("section", activeSection);
        }
      }

      const response = await api.post(endpoint, form, {
        headers: {
          "X-Skip-Auth-Redirect": "1",
        },
      });

      if (response.data?.status === "success" && response.data?.data?.url) {
        const url = response.data.data.url;

        setFormData((p) => ({ ...p, image_url: url }));

        if (modalType === "edit" && selectedEvent?.id) {
          setSelectedEvent((p) => (p ? { ...p, image_url: url } : p));
          setEvents((prev) =>
            Array.isArray(prev)
              ? prev.map((ev) => (ev.id === selectedEvent.id ? { ...ev, image_url: url } : ev))
              : prev
          );
        }
        return;
      }

      setFormError("Gagal upload gambar.");
    } catch (err) {
      console.log(err);
      
      if (err.response?.status === 422 && err.response.data?.errors) {
        const errors = Object.values(err.response.data.errors).flat();
        setFormError(errors.join(", "));
      } else if (err.response?.status === 401) {
        setFormError("Sesi Anda telah berakhir. Silakan login kembali.");
      } else if (err.response?.status === 419) {
        setFormError(getApiErrorMessage(err, "Sesi/CSRF tidak valid. Silakan refresh halaman dan coba lagi."));
      } else if (err.response?.status === 403) {
        setFormError("Anda tidak memiliki akses untuk upload gambar.");
      } else {
        setFormError(getApiErrorMessage(err, "Terjadi kesalahan saat upload gambar."));
      }
    } finally {
      setImageUploading(false);
    }
  };

  const handleTogglePublish = async (event) => {
    try {
      const target = event.is_published ? "unpublish" : "publish";
      const response = await api.post(
        `/agenda-events/${event.id}/${target}`,
        {},
        {
          headers: {
            "X-Skip-Auth-Redirect": "1",
          },
        }
      );

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
      if (err.response?.status === 401) {
        Swal.fire({
          icon: "error",
          title: "Sesi berakhir",
          text: "Sesi Anda telah berakhir. Silakan login kembali.",
        });
        return;
      }
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Gagal memperbarui status publish.",
      });
    }
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const openImagePreview = (event) => {
    const url = resolveImageUrl(event?.image_url);
    if (!url) return;
    setImagePreview({ url, title: event.title || "Preview" });
    setShowImagePreview(true);
  };

  const fetchEvents = async ({ scope = activeScope, page = 1 } = {}) => {
    try {
      setLoading(true);
      setError(null);

      if (scope === "study_program" && !activeSection) {
        setError("Section Study Program wajib dipilih dari menu (Resident/Fellow/Trainee)." );
        setEvents([]);
        setPagination((p) => ({
          ...p,
          current_page: 1,
          last_page: 1,
          total: 0,
        }));
        return;
      }

      const params = {
        scope,
        page,
        per_page: Number(filters.per_page || 10),
      };

      if (scope === "study_program") {
        if (activeSection) params.section = activeSection;
      }

      if (fixedType) {
        params.type = fixedType;
      }

      if (!fixedType && filters.type && filters.type !== "all") params.type = filters.type;
      if (filters.from) params.from = filters.from;
      if (filters.to) params.to = filters.to;

      const response = await api.get("/agenda-events", {
        params,
        headers: {
          "X-Skip-Auth-Redirect": "1",
        },
      });

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
      console.log(err);
      
      if (err.response?.status === 401) {
        setError("Sesi Anda telah berakhir. Silakan login kembali.");
      } else if (err.response?.status === 403) {
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
    if (allowedValues.length === 0) return;
    if (!routeScopeAllowed) return;
    fetchEvents({ scope: activeScope, page: 1 });
  }, [activeScope, activeSection, filters.type, filters.from, filters.to, filters.per_page, routeScopeAllowed, allowedValues.length]);

  useEffect(() => {
    if (!fixedType) return;
    setFilters((p) => ({ ...p, type: fixedType }));
  }, [fixedType]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setFormLoading(true);
      setFormError(null);

      const payload = {
        ...formData,
        scope: activeScope,
      };

      if (fixedType) {
        payload.type = fixedType;
      }

      if (activeScope === "study_program") {
        if (activeSection) payload.section = activeSection;
      }

      if (payload.end_date === "") payload.end_date = null;
      if (payload.description === "") payload.description = null;
      if (payload.location === "") payload.location = null;
      if (payload.registration_url === "") payload.registration_url = null;
      if (payload.image_url === "") payload.image_url = null;

      const response =
        modalType === "create"
          ? await api.post("/agenda-events", payload, {
              headers: {
                "X-Skip-Auth-Redirect": "1",
              },
            })
          : await api.put(`/agenda-events/${selectedEvent.id}`, payload, {
              headers: {
                "X-Skip-Auth-Redirect": "1",
              },
            });

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
      } else if (err.response?.status === 401) {
        setFormError("Sesi Anda telah berakhir. Silakan login kembali.");
      } else if (err.response?.status === 419) {
        setFormError(getApiErrorMessage(err, "Sesi/CSRF tidak valid. Silakan refresh halaman dan coba lagi."));
      } else if (err.response?.status === 403) {
        setFormError("Anda tidak memiliki akses untuk melakukan aksi ini.");
      } else {
        setFormError(getApiErrorMessage(err, "Terjadi kesalahan saat menyimpan agenda."));
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
      const response = await api.delete(`/agenda-events/${event.id}`, {
        headers: {
          "X-Skip-Auth-Redirect": "1",
        },
      });
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
      if (err.response?.status === 401) {
        Swal.fire({
          icon: "error",
          title: "Sesi berakhir",
          text: "Sesi Anda telah berakhir. Silakan login kembali.",
        });
        return;
      }
      Swal.fire({ icon: "error", title: "Gagal!", text: "Gagal menghapus agenda" });
    }
  };

  const canCreateSectioned =
    hasAnyPermission(getPermissionsForAction("create")) &&
    (activeScope !== "study_program" || !!activeSection) &&
    routeScopeAllowed;

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{pageHeading}</h1>
            <p className="text-muted-foreground">
              Kelola agenda dan kalender.
            </p>
          </div>
          <PermissionGuard permissions={getPermissionsForAction("create")}>
            <Button onClick={openCreateModal} className="gap-2" disabled={!canCreateSectioned || allowedValues.length === 0}>
              <Plus className="h-4 w-4" />
              Tambah Agenda
            </Button>
          </PermissionGuard>
        </div>

        {allowedValues.length === 0 || !routeScopeAllowed ? (
          <div className="rounded-lg border p-6 text-sm text-muted-foreground">
            Anda tidak memiliki akses untuk membuka halaman ini.
          </div>
        ) : (
          <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Filter</CardTitle>
                  <CardDescription>Gunakan filter untuk mencari agenda</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-4">
                    {fixedType ? (
                      <div className="space-y-2">
                        <Label>Type</Label>
                        <Input value={getTypeLabel(fixedType)} readOnly />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Label>Type</Label>
                        <Select value={filters.type} onValueChange={(v) => setFilters((p) => ({ ...p, type: v }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Semua</SelectItem>
                            {(agendaTypeOptions.length > 0 ? agendaTypeOptions : FALLBACK_EVENT_TYPES).map((t) => (
                              <SelectItem key={t.id} value={t.id}>
                                {t.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

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
                              <TableHead>Gambar</TableHead>
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
                                  <div
                                    className={`h-10 w-10 rounded bg-muted overflow-hidden flex items-center justify-center ${
                                      resolveImageUrl(event.image_url) ? "cursor-pointer" : ""
                                    }`}
                                    onClick={() => openImagePreview(event)}
                                    role={resolveImageUrl(event.image_url) ? "button" : undefined}
                                    tabIndex={resolveImageUrl(event.image_url) ? 0 : undefined}
                                    onKeyDown={(e) => {
                                      if (!resolveImageUrl(event.image_url)) return;
                                      if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        openImagePreview(event);
                                      }
                                    }}
                                  >
                                    {resolveImageUrl(event.image_url) ? (
                                      <img
                                        src={resolveImageUrl(event.image_url)}
                                        alt={event.title}
                                        className="h-full w-full object-cover"
                                        onError={(e) => {
                                          e.currentTarget.style.display = "none";
                                        }}
                                      />
                                    ) : null}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant="secondary"
                                    className={`capitalize ${getTypeColor(event.type).bg} bg-opacity-20 ${getTypeColor(event.type).text}`}
                                  >
                                    {getTypeLabel(event.type)}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="text-sm">
                                    {formatDateRangeHuman(event.start_date, event.end_date)}
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
                                    <PermissionGuard permissions={getPermissionsForAction("edit")}>
                                      <Button variant="outline" size="sm" onClick={() => openEditModal(event)}>
                                        <Pencil className="h-4 w-4 mr-1" />
                                        Edit
                                      </Button>
                                    </PermissionGuard>

                                    <PermissionGuard permissions={getPermissionsForAction("publish")}>
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

                                    <PermissionGuard permissions={getPermissionsForAction("delete")}>
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
          </div>
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
              {fixedType ? (
                <div className="space-y-2">
                  <Label>Type *</Label>
                  <Input value={getTypeLabel(fixedType)} readOnly />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>Type *</Label>
                  <Select value={formData.type} onValueChange={(v) => setFormData((p) => ({ ...p, type: v }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih type" />
                    </SelectTrigger>
                    <SelectContent>
                      {(agendaTypeOptions.length > 0 ? agendaTypeOptions : FALLBACK_EVENT_TYPES).map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

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
                <Label>Sumber Gambar</Label>
                <Select
                  value={imageMode}
                  onValueChange={(v) => {
                    setImageMode(v);
                    if (v !== "upload") {
                      setImageFile(null);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih sumber" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upload">Upload gambar</SelectItem>
                    <SelectItem value="url">Image URL</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {imageMode === "upload" ? (
                <div className="space-y-2 md:col-span-2">
                  <Label>Upload Gambar</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setImageFile(file);
                      if (file) {
                        uploadImageFile(file);
                      }
                    }}
                  />
                  {imageUploading ? (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Uploading...
                    </div>
                  ) : null}
                  {formData.image_url ? (
                    <Input value={formData.image_url} readOnly />
                  ) : null}
                </div>
              ) : (
                <div className="space-y-2 md:col-span-2">
                  <Label>Image URL</Label>
                  <Input
                    value={formData.image_url}
                    onChange={(e) => setFormData((p) => ({ ...p, image_url: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
              )}

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
              <Button type="submit" disabled={formLoading || imageUploading}>
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

      <Dialog
        open={showImagePreview}
        onOpenChange={(open) => {
          setShowImagePreview(open);
          if (!open) setImagePreview({ url: "", title: "" });
        }}
      >
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{imagePreview.title || "Preview"}</DialogTitle>
            <DialogDescription>Preview gambar agenda</DialogDescription>
          </DialogHeader>
          <div className="w-full overflow-hidden rounded-md border bg-muted">
            {imagePreview.url ? (
              <img
                src={imagePreview.url}
                alt={imagePreview.title || "Preview"}
                className="w-full max-h-[75vh] object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
