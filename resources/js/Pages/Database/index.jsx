import { useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, Check, ChevronsUpDown, Download, FileUp, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import api from "@/api/axios";
import Swal from "sweetalert2";
import PermissionGuard from "@/components/PermissionGuard";
import { useAuth } from "@/contexts/AuthContext";
import { usePage } from "@inertiajs/react";
import { Datepicker } from "flowbite-react";
import { Icon } from "@iconify/react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

const ORG_TYPES = ["koti", "kolkes", "resident", "fellow", "trainee", "peer_group"];

const ORG_LABELS = {
  koti: "Org. Structure (KOTI)",
  kolkes: "Org. Structure (Kolkes)",
  resident: "Resident - Database",
  fellow: "Fellow - Database",
  trainee: "Trainee - Database",
  peer_group: "Peer Group - Member Database",
};

const AFFILIATION_TYPE_BY_ORG = {
  koti: "kolegium",
  kolkes: "kolegium",
  resident: "residen",
  fellow: "clinical_fellowship",
  trainee: "subspesialis",
  peer_group: "peer_group",
};

const SPECIALIZATION_OPTIONS = [
  "Hip and Knee (Adult Reconstruction, Trauma, and Sports)",
  "Orthopaedic Sports Injury",
  "Advanced Orthopaedic Trauma",
  "Shoulder and Elbow",
  "Foot and Ankle",
  "Pediatric Orthopaedic",
  "Orthopaedic Oncology",
  "Hand, Upper Limb and Microsurgery",
  "Orthopaedic Spine",
];

const permissionKey = (org, action) => {
  if (org === "koti") return `database.kolegium.koti.${action}`;
  if (org === "kolkes") return `database.kolegium.kolkes.${action}`;
  if (org === "resident") return `database.study_program.resident.${action}`;
  if (org === "fellow") return `database.study_program.fellow.${action}`;
  if (org === "trainee") return `database.study_program.trainee.${action}`;
  if (org === "peer_group") return `database.peer_group.${action}`;
  return null;
};

const resolveImageUrl = (raw) => {
  if (!raw) return "";
  const s = String(raw).trim();
  if (!s) return "";

  if (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("data:") || s.startsWith("//")) {
    return s;
  }

  if (s.startsWith("/")) return s;
  if (s.startsWith("public/")) return `/${s.replace(/^public\//, "")}`;
  if (s.startsWith("storage/")) return `/${s}`;
  if (s.startsWith("assets/")) return `/${s}`;

  return `/${s}`;
};

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

const ymdToDate = (ymd) => {
  if (!ymd) return null;
  const m = String(ymd).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  if (!year || !month || !day) return null;
  const d = new Date(year, month - 1, day);
  d.setHours(12, 0, 0, 0);
  return d;
};

const dateToYmd = (date) => {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  const yyyy = String(d.getFullYear());
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const statusBadge = (status) => {
  const s = (status || "").toString();

  const map = {
    active: {
      label: "Aktif",
      className: "bg-emerald-100 text-emerald-800 border-emerald-200",
    },
    graduated: {
      label: "Lulus",
      className: "bg-blue-100 text-blue-800 border-blue-200",
    },
    leave: {
      label: "Cuti",
      className: "bg-amber-100 text-amber-900 border-amber-200",
    },
  };

  const meta = map[s] || {
    label: s || "-",
    className: "bg-muted text-muted-foreground border-border",
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${meta.className}`}>
      {meta.label}
    </span>
  );
};

const buildDisplayName = (member) => {
  const baseName = (member?.name || "").trim();
  const title = (member?.title || "").trim();
  if (!baseName) return title;
  if (!title) return baseName;
  return `${baseName} ${title}`;
};

const calculateSemester = (entryDate, status, graduatedAt, leaveAt, activeAgainAt, nowYmd) => {
  if (!entryDate) return "-";

  const semesterIndex = (d) => {
    if (!d) return null;
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return null;
    const y = dt.getFullYear();
    const m = dt.getMonth() + 1;
    return y * 2 + (m >= 7 ? 1 : 0);
  };

  const between = (start, end) => {
    const s = semesterIndex(start);
    const e = semesterIndex(end);
    if (s === null || e === null) return null;
    const sem = e - s + 1;
    return sem > 0 ? sem : null;
  };

  const st = (status || "active").trim();
  const now = nowYmd || new Date().toISOString().slice(0, 10);

  if (st === "graduated") {
    const sem = between(entryDate, graduatedAt);
    return sem ?? "-";
  }

  if (st === "leave") {
    const s1 = between(entryDate, leaveAt);
    if (s1 === null) return "-";
    let total = s1;
    const s2 = between(activeAgainAt, now);
    if (s2 !== null) total += s2;
    return total > 0 ? total : "-";
  }

  const sem = between(entryDate, now);
  return sem ?? "-";
};

export default function DatabasePage() {
  const page = usePage();
  const inertiaUrl = page.url;

  const queryParams = useMemo(() => {
    const query = (inertiaUrl || "").split("?")[1] || "";
    return new URLSearchParams(query);
  }, [inertiaUrl]);

  const orgFromUrl = queryParams.get("org") || "";
  const activeOrg = ORG_TYPES.includes(orgFromUrl) ? orgFromUrl : "";

  const title = activeOrg ? ORG_LABELS[activeOrg] || "Database" : "Database";

  return (
    <DashboardLayout title={title}>
      <DatabaseContent activeOrg={activeOrg} />
    </DashboardLayout>
  );
}

function DatabaseContent({ activeOrg }) {
  const { user, hasPermission, isSuperAdmin } = useAuth();

  const userAffiliations = Array.isArray(user?.affiliations) ? user.affiliations : [];
  const hasUserAffiliations = userAffiliations.length > 0;

  const [affiliations, setAffiliations] = useState([]);
  const [selectedAffiliationId, setSelectedAffiliationId] = useState("");

  const [members, setMembers] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 10,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    per_page: "10",
  });

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("create");
  const [selectedMember, setSelectedMember] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const formDialogRef = useRef(null);

  const [photoMode, setPhotoMode] = useState("url");
  const [photoUploading, setPhotoUploading] = useState(false);

  const [formData, setFormData] = useState({
    affiliation_id: "",
    member_code: "",
    name: "",
    position: "",
    photo: "",
    contact: "",
    entry_date: "",
    graduated_at: "",
    leave_at: "",
    active_again_at: "",
    gender: "",
    specialization: "",
    status: "active",
    specialty: "",
    group: "",
    title: "",
    location: "",
    regency_id: "",
  });

  const [provinces, setProvinces] = useState([]);
  const [regencies, setRegencies] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [regenciesLoading, setRegenciesLoading] = useState(false);

  const [achievements, setAchievements] = useState([]);
  const [achievementsLoading, setAchievementsLoading] = useState(false);
  const [achievementForm, setAchievementForm] = useState({ title: "", description: "", date: "", category: "" });
  const [editingAchievementId, setEditingAchievementId] = useState(null);
  const [achievementSaving, setAchievementSaving] = useState(false);
  const [allAchievements, setAllAchievements] = useState([]);
  const [achModalMember, setAchModalMember] = useState(null);

  const isPeerGroupOrg = activeOrg === "peer_group";
  const isResidentOrg = activeOrg === "resident";

  const fetchProvinces = async () => {
    try {
      const res = await api.get("/provinces", { headers: { "X-Skip-Auth-Redirect": "1" } });
      const data = res.data;
      setProvinces(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Failed to fetch provinces", e);
    }
  };

  const fetchRegencies = async (provinceId) => {
    if (!provinceId) {
      setRegencies([]);
      return;
    }
    try {
      setRegenciesLoading(true);
      const res = await api.get(`/provinces/${provinceId}/regencies`, { headers: { "X-Skip-Auth-Redirect": "1" } });
      const data = res.data;
      setRegencies(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Failed to fetch regencies", e);
      setRegencies([]);
    } finally {
      setRegenciesLoading(false);
    }
  };

  useEffect(() => {
    if (isResidentOrg && formData.status === "graduated" && provinces.length === 0) {
      fetchProvinces();
    }
  }, [formData.status, isResidentOrg]);

  useEffect(() => {
    if (selectedProvince) {
      fetchRegencies(selectedProvince);
    } else {
      setRegencies([]);
    }
  }, [selectedProvince]);

  const fetchAchievements = async (memberId) => {
    if (!memberId) return;
    try {
      setAchievementsLoading(true);
      const res = await api.get("/member-achievements", {
        params: { database_member_id: memberId },
        headers: { "X-Skip-Auth-Redirect": "1" },
      });
      if (res.data?.status === "success") {
        setAchievements(Array.isArray(res.data.data) ? res.data.data : []);
      }
    } catch (e) {
      console.error("Failed to fetch achievements", e);
    } finally {
      setAchievementsLoading(false);
    }
  };

  const resetAchievementForm = () => {
    setAchievementForm({ title: "", description: "", date: "", category: "" });
    setEditingAchievementId(null);
  };

  const handleSaveAchievement = async () => {
    if (!achievementForm.title.trim()) return;
    if (!selectedMember?.id) return;

    try {
      setAchievementSaving(true);
      const payload = {
        title: achievementForm.title,
        description: achievementForm.description || null,
        date: achievementForm.date || null,
        category: achievementForm.category || null,
      };

      if (editingAchievementId) {
        await api.put(`/member-achievements/${editingAchievementId}`, payload, {
          headers: { "X-Skip-Auth-Redirect": "1" },
        });
      } else {
        payload.database_member_id = selectedMember.id;
        await api.post("/member-achievements", payload, {
          headers: { "X-Skip-Auth-Redirect": "1" },
        });
      }

      resetAchievementForm();
      fetchAchievements(selectedMember.id);
    } catch (e) {
      console.error("Failed to save achievement", e);
    } finally {
      setAchievementSaving(false);
    }
  };

  const handleEditAchievement = (ach) => {
    setEditingAchievementId(ach.id);
    setAchievementForm({
      title: ach.title || "",
      description: ach.description || "",
      date: toDateInputValue(ach.date),
      category: ach.category || "",
    });
  };

  const handleDeleteAchievement = async (achId) => {
    const result = await Swal.fire({
      title: "Hapus Achievement?",
      text: "Data achievement akan dihapus.",
      icon: "warning",
      confirmButtonColor: "#d33",
      confirmButtonText: "Ya, Hapus!",
      showCancelButton: true,
      cancelButtonText: "Batal",
    });
    if (!result.isConfirmed) return;

    try {
      await api.delete(`/member-achievements/${achId}`, {
        headers: { "X-Skip-Auth-Redirect": "1" },
      });
      fetchAchievements(selectedMember?.id);
    } catch (e) {
      console.error("Failed to delete achievement", e);
    }
  };

  const fetchAllAchievements = async () => {
    if (!activeOrg) return;
    try {
      const params = { organization_type: activeOrg };
      if (selectedAffiliationId) {
        params.affiliation_id = Number(selectedAffiliationId);
      }
      const res = await api.get("/public/member-achievements", {
        params,
        headers: { "X-Skip-Auth-Redirect": "1" },
      });
      if (res.data?.status === "success") {
        setAllAchievements(Array.isArray(res.data.data) ? res.data.data : []);
      }
    } catch (e) {
      console.error("Failed to fetch all achievements", e);
    }
  };

  const achievementsByMember = useMemo(() => {
    const map = {};
    allAchievements.forEach((ach) => {
      const mid = ach.database_member_id;
      if (!map[mid]) map[mid] = [];
      map[mid].push(ach);
    });
    return map;
  }, [allAchievements]);

  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importAffiliationId, setImportAffiliationId] = useState("");
  const [importError, setImportError] = useState(null);
  const [importLoading, setImportLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [templateLoading, setTemplateLoading] = useState(false);

  const canView = activeOrg ? hasPermission(permissionKey(activeOrg, "view")) : false;

  const loadAffiliations = async () => {
    if (hasUserAffiliations && !isSuperAdmin) return;

    try {
      const type = AFFILIATION_TYPE_BY_ORG[activeOrg] || "";
      const response = await api.get("/database-members/affiliations", {
        params: type ? { type } : {},
        headers: { "X-Skip-Auth-Redirect": "1" },
      });

      if (response.data?.status === "success") {
        const list = Array.isArray(response.data.data) ? response.data.data : [];
        setAffiliations(list);
        if (!selectedAffiliationId && list[0]?.id) {
          setSelectedAffiliationId(String(list[0].id));
        }
      }
    } catch (e) {
    }
  };

  const handleExportExcel = async () => {
    if (!activeOrg) return;
    if (!canView) return;

    if (!isSuperAdmin && !hasUserAffiliations && !selectedAffiliationId) {
      Swal.fire({ icon: "error", title: "Unduh gagal", text: "Affiliation wajib dipilih." });
      return;
    }

    try {
      setExportLoading(true);

      const params = {
        organization_type: activeOrg,
      };

      if (!isSuperAdmin && !hasUserAffiliations) {
        params.affiliation_id = Number(selectedAffiliationId);
      }

      const response = await api.get("/database-members/export-excel", {
        params,
        responseType: "blob",
        headers: { "X-Skip-Auth-Redirect": "1" },
      });

      const disposition = response.headers?.["content-disposition"] || response.headers?.["Content-Disposition"];
      const match = typeof disposition === "string" ? disposition.match(/filename\*?=(?:UTF-8''|\")?([^;\"]+)/i) : null;
      const filename = (match?.[1] || `database-members-${activeOrg}.xlsx`).replace(/\"/g, "");

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      Swal.fire({ icon: "error", title: "Unduh gagal", text: "Terjadi kesalahan." });
    } finally {
      setExportLoading(false);
    }
  };

  const fetchMembers = async ({ page = 1 } = {}) => {
    try {
      setLoading(true);
      setError(null);

      if (!activeOrg) {
        setMembers([]);
        setError("Org parameter tidak valid.");
        return;
      }

      if (!canView) {
        setMembers([]);
        setError("Anda tidak memiliki akses untuk membuka halaman ini.");
        return;
      }

      if (!isSuperAdmin && !hasUserAffiliations && !selectedAffiliationId) {
        setMembers([]);
        setError("Affiliation wajib dipilih.");
        return;
      }

      const params = {
        organization_type: activeOrg,
        page,
        per_page: Number(filters.per_page || 10),
      };

      if (isSuperAdmin && selectedAffiliationId) {
        params.affiliation_id = Number(selectedAffiliationId);
      } else if (!isSuperAdmin && !hasUserAffiliations) {
        params.affiliation_id = Number(selectedAffiliationId);
      }

      const response = await api.get("/database-members", {
        params,
        headers: { "X-Skip-Auth-Redirect": "1" },
      });

      if (response.data?.status !== "success") {
        setMembers([]);
        setError("Gagal mengambil data.");
        return;
      }

      const paginator = response.data.data;
      const data = paginator?.data || [];

      setMembers(Array.isArray(data) ? data : []);
      setPagination({
        current_page: paginator?.current_page || 1,
        last_page: paginator?.last_page || 1,
        total: paginator?.total || 0,
        per_page: paginator?.per_page || Number(filters.per_page || 10),
      });
    } catch (err) {
      if (err.response?.status === 403) {
        setError("Anda tidak memiliki akses.");
      } else if (err.response?.status === 401) {
        setError("Sesi Anda telah berakhir. Silakan login kembali.");
      } else {
        setError("Terjadi kesalahan saat mengambil data.");
      }
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!activeOrg) return;
    loadAffiliations();
  }, [activeOrg]);

  useEffect(() => {
    if (!activeOrg) return;
    fetchMembers({ page: 1 });
    if (activeOrg === "resident") {
      fetchAllAchievements();
    }
  }, [activeOrg, selectedAffiliationId, filters.per_page, canView]);

  const resetForm = () => {
    setSelectedMember(null);
    setFormError(null);
    setFormData({
      affiliation_id: "",
      member_code: "",
      name: "",
      position: "",
      photo: "",
      contact: "",
      entry_date: "",
      graduated_at: "",
      leave_at: "",
      active_again_at: "",
      gender: "",
      specialization: "",
      status: "active",
      specialty: "",
      group: "",
      title: "",
      location: "",
      regency_id: "",
    });
    setPhotoMode("url");
    setSelectedProvince("");
    setRegencies([]);
    setAchievements([]);
    resetAchievementForm();
  };

  const openCreateModal = () => {
    resetForm();

    if (!hasUserAffiliations) {
      setFormData((p) => ({ ...p, affiliation_id: selectedAffiliationId || "" }));
    }

    setModalType("create");
    setShowModal(true);
  };

  const openEditModal = (member) => {
    setSelectedMember(member);
    setFormError(null);
    setFormData({
      affiliation_id: member?.affiliation_id ? String(member.affiliation_id) : "",
      member_code: member?.member_code || "",
      name: member?.name || "",
      position: member?.position || "",
      photo: member?.photo || "",
      contact: member?.contact || "",
      entry_date: toDateInputValue(member?.entry_date),
      graduated_at: toDateInputValue(member?.graduated_at),
      leave_at: toDateInputValue(member?.leave_at),
      active_again_at: toDateInputValue(member?.active_again_at),
      gender: member?.gender || "",
      specialization: SPECIALIZATION_OPTIONS.includes(member?.specialization || "") ? (member?.specialization || "") : "",
      status: member?.status || "active",
      specialty: member?.specialty || "",
      group: member?.group || "",
      title: member?.title || "",
      location: member?.location || "",
      regency_id: member?.regency_id ? String(member.regency_id) : "",
    });
    setPhotoMode("url");

    const provinceId = member?.regency?.province_id ? String(member.regency.province_id) : "";
    setSelectedProvince(provinceId);
    if (provinceId) {
      fetchRegencies(provinceId);
    } else {
      setRegencies([]);
    }

    setModalType("edit");
    setShowModal(true);

    fetchAchievements(member.id);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedMember(null);
    setFormError(null);
  };

  useEffect(() => {
    if (!showModal) return;
    if (!formError) return;
    const el = formDialogRef.current;
    if (!el) return;
    el.scrollTo({ top: 0, behavior: "smooth" });
  }, [formError, showModal]);

  const openImportModal = () => {
    setImportError(null);
    setImportFile(null);
    setImportAffiliationId(!hasUserAffiliations ? (selectedAffiliationId || "") : "");
    setShowImportModal(true);
  };

  const closeImportModal = () => {
    setShowImportModal(false);
    setImportError(null);
    setImportFile(null);
  };

  const handleDownloadTemplate = async () => {
    if (!activeOrg) return;
    if (!canImport) return;

    if (!isSuperAdmin && !hasUserAffiliations && !importAffiliationId) {
      setImportError("Affiliation wajib dipilih.");
      return;
    }

    try {
      setTemplateLoading(true);
      setImportError(null);

      const params = {
        organization_type: activeOrg,
      };

      if (!isSuperAdmin && !hasUserAffiliations) {
        params.affiliation_id = Number(importAffiliationId);
      }

      const response = await api.get("/database-members/template-excel", {
        params,
        responseType: "blob",
        headers: { "X-Skip-Auth-Redirect": "1" },
      });

      const disposition = response.headers?.["content-disposition"] || response.headers?.["Content-Disposition"];
      const match = typeof disposition === "string" ? disposition.match(/filename\*?=(?:UTF-8''|\")?([^;\"]+)/i) : null;
      const filename = (match?.[1] || `template-${activeOrg}.xlsx`).replace(/\"/g, "");

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      Swal.fire({ icon: "error", title: "Unduh gagal", text: "Terjadi kesalahan." });
    } finally {
      setTemplateLoading(false);
    }
  };

  const uploadPhotoFile = async (file) => {
    if (!file) return;

    try {
      setPhotoUploading(true);
      setFormError(null);

      const form = new FormData();
      form.append("organization_type", activeOrg);
      form.append("image", file);

      const response = await api.post("/database-members/upload-photo", form, {
        headers: { "X-Skip-Auth-Redirect": "1" },
      });

      if (response.data?.status === "success" && response.data?.data?.url) {
        setFormData((p) => ({ ...p, photo: response.data.data.url }));
        return;
      }

      setFormError("Gagal upload foto.");
    } catch (err) {
      if (err.response?.status === 422 && err.response.data?.errors) {
        const errors = Object.values(err.response.data.errors).flat();
        setFormError(errors.join(", "));
      } else if (err.response?.status === 403) {
        setFormError("Anda tidak memiliki akses untuk upload.");
      } else {
        setFormError("Terjadi kesalahan saat upload foto.");
      }
    } finally {
      setPhotoUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setFormLoading(true);
      setFormError(null);

      const payload = {
        organization_type: activeOrg,
        member_code: formData.member_code,
        name: formData.name,
        photo: formData.photo || null,
        gender: formData.gender || null,
        status: isPeerGroupOrg ? "active" : (formData.status || "active"),
      };

      if (!isPeerGroupOrg) {
        payload.entry_date = formData.entry_date || null;
      }

      if (isResidentOrg) {
        if (formData.status === "graduated") {
          payload.graduated_at = formData.graduated_at || null;
          payload.leave_at = null;
          payload.active_again_at = null;
        } else if (formData.status === "leave") {
          payload.graduated_at = null;
          payload.leave_at = formData.leave_at || null;
          payload.active_again_at = formData.active_again_at || null;
        } else {
          payload.graduated_at = null;
          payload.leave_at = null;
          payload.active_again_at = null;
        }
      }

      if (!isPeerGroupOrg && !isResidentOrg) {
        payload.specialization = formData.specialization || null;
      }

      if (isResidentOrg && formData.status === "graduated") {
        payload.regency_id = formData.regency_id ? Number(formData.regency_id) : null;
      } else {
        payload.regency_id = null;
      }

      if (!hasUserAffiliations) {
        payload.affiliation_id = formData.affiliation_id ? Number(formData.affiliation_id) : null;
      }

      const response =
        modalType === "create"
          ? await api.post("/database-members", payload, {
              headers: { "X-Skip-Auth-Redirect": "1" },
            })
          : await api.put(`/database-members/${selectedMember.id}`, payload, {
              headers: { "X-Skip-Auth-Redirect": "1" },
            });

      if (response.data?.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: modalType === "create" ? "Data berhasil dibuat" : "Data berhasil diperbarui",
          timer: 2000,
          showConfirmButton: false,
        });

        closeModal();

        if (modalType === "create") {
          fetchMembers({ page: 1 });
        } else {
          fetchMembers({ page: pagination.current_page });
        }
        return;
      }

      setFormError("Gagal menyimpan data.");
    } catch (err) {
      if (err.response?.status === 422) {
        const data = err.response.data;
        if (Array.isArray(data?.errors)) {
          setFormError(data.errors.map((e) => e.message).join(", "));
        } else if (data?.errors && typeof data.errors === "object") {
          const errors = Object.values(data.errors).flat();
          setFormError(errors.join(", "));
        } else {
          setFormError(data?.message || "Validasi gagal.");
        }
      } else if (err.response?.status === 403) {
        setFormError("Anda tidak memiliki akses untuk melakukan aksi ini.");
      } else {
        setFormError("Terjadi kesalahan saat menyimpan data.");
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (member) => {
    const result = await Swal.fire({
      title: "Konfirmasi Hapus",
      text: `Apakah Anda yakin ingin menghapus "${member.name}"?`,
      icon: "warning",
      confirmButtonColor: "#d33",
      confirmButtonText: "Ya, Hapus!",
      showCancelButton: true,
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await api.delete(`/database-members/${member.id}`, {
        headers: { "X-Skip-Auth-Redirect": "1" },
      });

      if (response.data?.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Data berhasil dihapus",
          timer: 1500,
          showConfirmButton: false,
        });
        fetchMembers({ page: pagination.current_page });
        return;
      }

      Swal.fire({ icon: "error", title: "Gagal!", text: "Gagal menghapus data" });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Gagal!", text: "Gagal menghapus data" });
    }
  };

  const handleImport = async (e) => {
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
    }

    if (!activeOrg) return;

    if (!importFile) {
      setImportError("File excel wajib dipilih.");
      return;
    }

    if (!isSuperAdmin && !hasUserAffiliations && !importAffiliationId) {
      setImportError("Affiliation wajib dipilih.");
      return;
    }

    try {
      setImportLoading(true);
      setImportError(null);

      const form = new FormData();
      form.append("organization_type", activeOrg);
      form.append("file", importFile);
      if (!isSuperAdmin && !hasUserAffiliations) {
        form.append("affiliation_id", importAffiliationId);
      }

      const response = await api.post("/database-members/import-excel", form, {
        headers: { "X-Skip-Auth-Redirect": "1" },
      });

      if (response.data?.status === "success") {
        const processed = response.data?.data?.processed || 0;
        const failed = response.data?.data?.failed || 0;
        const importErrors = response.data?.errors || [];

        let html = `<div class="text-left"><p class="mb-2"><b>${processed}</b> data berhasil diimport.</p>`;
        if (failed > 0) {
          html += `<p class="mb-2 text-red-600"><b>${failed}</b> data gagal.</p>`;
          html += `<div class="max-h-40 overflow-y-auto text-xs border rounded p-2 mt-2">`;
          importErrors.slice(0, 20).forEach((e) => {
            html += `<div class="mb-1">Row ${e.row} (${e.column}): ${e.message}</div>`;
          });
          if (importErrors.length > 20) html += `<div class="text-gray-500">...dan ${importErrors.length - 20} error lainnya</div>`;
          html += `</div>`;
        }
        html += `</div>`;

        Swal.fire({
          icon: failed > 0 ? "warning" : "success",
          title: failed > 0 ? "Import Selesai (Partial)" : "Import Berhasil",
          html,
        });

        setImportError(null);
        setImportFile(null);
        fetchMembers({ page: 1 });
        return;
      }

      Swal.fire({ icon: "error", title: "Import gagal", text: "Gagal import data." });
    } catch (err) {
      const data = err.response?.data;
      if (err.response?.status === 422) {
        const importErrors = Array.isArray(data?.errors) ? data.errors : [];
        const processed = data?.data?.processed || 0;
        const failed = data?.data?.failed || importErrors.length;

        let html = `<div class="text-left">`;
        if (processed > 0) html += `<p class="mb-2"><b>${processed}</b> data berhasil.</p>`;
        html += `<p class="mb-2 text-red-600"><b>${failed}</b> data gagal.</p>`;
        if (importErrors.length > 0) {
          html += `<div class="max-h-40 overflow-y-auto text-xs border rounded p-2 mt-2">`;
          importErrors.slice(0, 20).forEach((e) => {
            html += `<div class="mb-1">Row ${e.row} (${e.column}): ${e.message}</div>`;
          });
          if (importErrors.length > 20) html += `<div class="text-gray-500">...dan ${importErrors.length - 20} error lainnya</div>`;
          html += `</div>`;
        }
        html += `</div>`;

        Swal.fire({
          icon: "error",
          title: "Import Gagal",
          html: html || data?.message || "Validasi gagal.",
        });
        return;
      }

      Swal.fire({ icon: "error", title: "Import gagal", text: data?.message || "Terjadi kesalahan." });
    } finally {
      setImportLoading(false);
    }
  };

  const canCreate = activeOrg ? hasPermission(permissionKey(activeOrg, "create")) : false;
  const canEdit = activeOrg ? hasPermission(permissionKey(activeOrg, "edit")) : false;
  const canDelete = activeOrg ? hasPermission(permissionKey(activeOrg, "delete")) : false;
  const canImport = activeOrg ? hasPermission(permissionKey(activeOrg, "import")) : false;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{activeOrg ? ORG_LABELS[activeOrg] : "Database"}</h1>
          <p className="text-muted-foreground">Kelola data member.</p>
        </div>

        <div className="flex gap-2">
          <PermissionGuard permission={activeOrg ? permissionKey(activeOrg, "view") : null}>
            <Button
              variant="outline"
              className="gap-2"
              disabled={!canView || !activeOrg || exportLoading || (!isSuperAdmin && !hasUserAffiliations && !selectedAffiliationId)}
              onClick={handleExportExcel}
            >
              {exportLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Export Excel
            </Button>
          </PermissionGuard>

          <PermissionGuard permission={activeOrg ? permissionKey(activeOrg, "import") : null}>
            <Button
              variant="outline"
              className="gap-2"
              disabled={!canImport || !activeOrg || importLoading}
              onClick={openImportModal}
            >
              {importLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileUp className="h-4 w-4" />}
              Import Excel
            </Button>
          </PermissionGuard>

          <PermissionGuard permission={activeOrg ? permissionKey(activeOrg, "create") : null}>
            <Button className="gap-2" onClick={openCreateModal} disabled={!canCreate || !activeOrg}>
              <Plus className="h-4 w-4" />
              Tambah
            </Button>
          </PermissionGuard>
        </div>
      </div>

      {!activeOrg ? (
        <div className="rounded-lg border p-6 text-sm text-muted-foreground">Org parameter tidak valid.</div>
      ) : !canView ? (
        <div className="rounded-lg border p-6 text-sm text-muted-foreground">Anda tidak memiliki akses untuk membuka halaman ini.</div>
      ) : (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Filter</CardTitle>
              <CardDescription>Atur filter untuk menampilkan data.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {!hasUserAffiliations ? (
                  <div className="space-y-2">
                    <Label>Afiliasi *</Label>
                    <Select value={selectedAffiliationId} onValueChange={setSelectedAffiliationId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih afiliasi" />
                      </SelectTrigger>
                      <SelectContent>
                        {affiliations.map((a) => (
                          <SelectItem key={a.id} value={String(a.id)}>
                            {a.name} ({a.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : isSuperAdmin ? (
                  <div className="space-y-2">
                    <Label>Afiliasi</Label>
                    <Select value={selectedAffiliationId} onValueChange={setSelectedAffiliationId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Semua afiliasi" />
                      </SelectTrigger>
                      <SelectContent>
                        {affiliations.map((a) => (
                          <SelectItem key={a.id} value={String(a.id)}>
                            {a.name} ({a.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : null}

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
                <CardTitle>Daftar Member</CardTitle>
                <CardDescription>Total: {pagination.total} data</CardDescription>
              </CardHeader>
              <CardContent>
                {members.length === 0 ? (
                  <div className="rounded-lg border p-6 text-sm text-muted-foreground">Belum ada data.</div>
                ) : (
                  <>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Foto</TableHead>
                          {isSuperAdmin ? <TableHead>Afiliasi</TableHead> : null}
                          <TableHead>Nama</TableHead>
                          <TableHead>Jenis Kelamin</TableHead>
                          {!isPeerGroupOrg && !isResidentOrg ? <TableHead>Tanggal Masuk</TableHead> : null}
                          {!isPeerGroupOrg && !isResidentOrg ? <TableHead>Spesialisasi</TableHead> : null}
                          {isResidentOrg ? <TableHead>Semester</TableHead> : null}
                          {!isPeerGroupOrg ? <TableHead>Status</TableHead> : null}
                          {isResidentOrg ? <TableHead>Achievements</TableHead> : null}
                          <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {members.map((m) => (
                          <TableRow key={m.id}>
                            <TableCell>
                              <div className="h-10 w-10 rounded bg-muted overflow-hidden flex items-center justify-center">
                                {resolveImageUrl(m.photo) ? (
                                  <img
                                    src={resolveImageUrl(m.photo)}
                                    alt={m.name}
                                    className="h-full w-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.style.display = "none";
                                    }}
                                  />
                                ) : null}
                              </div>
                            </TableCell>
                            {isSuperAdmin ? <TableCell>{m?.affiliation?.name ? (m.affiliation.code ? `${m.affiliation.name} (${m.affiliation.code})` : m.affiliation.name) : "-"}</TableCell> : null}
                            <TableCell>{buildDisplayName(m)}</TableCell>
                            <TableCell>{m.gender === "male" ? "Male" : m.gender === "female" ? "Female" : "-"}</TableCell>
                            {!isPeerGroupOrg && !isResidentOrg ? <TableCell>{toDateInputValue(m.entry_date) || "-"}</TableCell> : null}
                            {!isPeerGroupOrg && !isResidentOrg ? <TableCell>{m.specialization || "-"}</TableCell> : null}
                            {isResidentOrg ? (
                              <TableCell>{calculateSemester(m.entry_date, m.status, m.graduated_at, m.leave_at, m.active_again_at)}</TableCell>
                            ) : null}
                            {!isPeerGroupOrg ? <TableCell>{statusBadge(m.status)}</TableCell> : null}
                            {isResidentOrg ? (
                              <TableCell>
                                {(achievementsByMember[m.id]?.length || 0) > 0 ? (
                                  <button
                                    type="button"
                                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-yellow-700 bg-yellow-50 hover:bg-yellow-100 px-3 py-1 rounded transition-colors"
                                    onClick={() => setAchModalMember(m)}
                                  >
                                    <Icon icon="mdi:trophy" className="w-4 h-4" />
                                    {achievementsByMember[m.id].length}
                                  </button>
                                ) : (
                                  <span className="text-xs text-muted-foreground">0</span>
                                )}
                              </TableCell>
                            ) : null}
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <PermissionGuard permission={permissionKey(activeOrg, "edit")}>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openEditModal(m)}
                                    disabled={!canEdit}
                                  >
                                    <Pencil className="h-4 w-4 mr-1" />
                                    Edit
                                  </Button>
                                </PermissionGuard>

                                <PermissionGuard permission={permissionKey(activeOrg, "delete")}>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDelete(m)}
                                    disabled={!canDelete}
                                  >
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
                          onClick={() => fetchMembers({ page: pagination.current_page - 1 })}
                        >
                          Prev
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={pagination.current_page >= pagination.last_page}
                          onClick={() => fetchMembers({ page: pagination.current_page + 1 })}
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

      <Dialog open={showImportModal} onOpenChange={setShowImportModal}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Import Excel</DialogTitle>
            <DialogDescription>Upload file excel untuk melakukan insert / update data.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleImport} className="space-y-4">
            {importError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error!</AlertTitle>
                <AlertDescription>{importError}</AlertDescription>
              </Alert>
            ) : null}

            {!hasUserAffiliations ? (
              <div className="space-y-2">
                <Label>Afiliasi *</Label>
                <Select value={importAffiliationId} onValueChange={setImportAffiliationId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih afiliasi" />
                  </SelectTrigger>
                  <SelectContent>
                    {affiliations.map((a) => (
                      <SelectItem key={a.id} value={String(a.id)}>
                        {a.name} ({a.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}

            <div className="space-y-2">
              <Label>File Excel *</Label>
              <Input
                type="file"
                accept=".xlsx,.xls"
                required
                onChange={(e) => setImportFile(e.target.files?.[0] || null)}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={closeImportModal} disabled={importLoading}>
                Batal
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleDownloadTemplate}
                disabled={importLoading || templateLoading}
              >
                {templateLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Mengunduh...
                  </>
                ) : (
                  "Download Template"
                )}
              </Button>
              <Button type="submit" disabled={importLoading}>
                {importLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Memproses...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent ref={formDialogRef} className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{modalType === "create" ? "Tambah Member" : "Edit Member"}</DialogTitle>
            <DialogDescription>
              {modalType === "create" ? "Buat data baru" : "Perbarui data"}
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

            <div className="grid gap-4 grid-cols-1">
              {!hasUserAffiliations ? (
                <div className="space-y-2">
                  <Label>Afiliasi *</Label>
                  <Select
                    value={formData.affiliation_id}
                    onValueChange={(v) => setFormData((p) => ({ ...p, affiliation_id: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih afiliasi" />
                    </SelectTrigger>
                    <SelectContent>
                      {affiliations.map((a) => (
                        <SelectItem key={a.id} value={String(a.id)}>
                          {a.name} ({a.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : null}

              <div className="space-y-2">
                <Label>NIK *</Label>
                <Input
                  value={formData.member_code}
                  onChange={(e) => setFormData((p) => ({ ...p, member_code: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Nama *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Foto</Label>
                <Select value={photoMode} onValueChange={setPhotoMode}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="url">URL</SelectItem>
                    <SelectItem value="upload">Upload</SelectItem>
                  </SelectContent>
                </Select>

                {photoMode === "upload" ? (
                  <Input
                    type="file"
                    accept="image/*"
                    disabled={photoUploading}
                    onChange={(e) => uploadPhotoFile(e.target.files?.[0] || null)}
                  />
                ) : (
                  <Input
                    value={formData.photo}
                    onChange={(e) => setFormData((p) => ({ ...p, photo: e.target.value }))}
                    placeholder="Masukkan URL foto"
                  />
                )}

                <div className="flex items-center gap-3">
                  {formData.photo ? (
                    <img
                      src={resolveImageUrl(formData.photo)}
                      alt={formData.name || "Foto"}
                      className="h-14 w-14 rounded object-cover border"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : null}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setFormData((p) => ({ ...p, photo: "" }))}
                    disabled={photoUploading || !formData.photo}
                  >
                    Hapus Foto
                  </Button>
                </div>

                {photoUploading ? <div className="text-xs text-muted-foreground">Mengunggah foto...</div> : null}
              </div>

              {!isPeerGroupOrg ? (
                <div className="space-y-2">
                  <Label>Status *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(v) => {
                      setFormData((p) => ({
                        ...p,
                        status: v,
                        regency_id: v !== "graduated" ? "" : p.regency_id,
                        graduated_at: v === "graduated" ? p.graduated_at : "",
                        leave_at: v === "leave" ? p.leave_at : "",
                        active_again_at: v === "leave" ? p.active_again_at : "",
                      }));
                      if (v !== "graduated") {
                        setSelectedProvince("");
                        setRegencies([]);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Aktif</SelectItem>
                      <SelectItem value="graduated">Lulus</SelectItem>
                      <SelectItem value="leave">Cuti</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ) : null}

              {isResidentOrg && formData.status === "graduated" ? (
                <>
                  <div className="space-y-2">
                    <Label>Provinsi</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between font-normal",
                            !selectedProvince && "text-muted-foreground"
                          )}
                        >
                          {selectedProvince
                            ? provinces.find((p) => String(p.id) === String(selectedProvince))?.name || "Pilih provinsi"
                            : "Pilih provinsi"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Cari provinsi..." />
                          <CommandList>
                            <CommandEmpty>Provinsi tidak ditemukan.</CommandEmpty>
                            <CommandGroup>
                              {provinces.map((prov) => (
                                <CommandItem
                                  key={prov.id}
                                  value={prov.name}
                                  onSelect={() => {
                                    const newVal = String(prov.id) === String(selectedProvince) ? "" : String(prov.id);
                                    setSelectedProvince(newVal);
                                    setFormData((p) => ({ ...p, regency_id: "" }));
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      String(selectedProvince) === String(prov.id) ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {prov.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>Kabupaten / Kota</Label>
                    {regenciesLoading ? (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Memuat data kabupaten...
                      </div>
                    ) : (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            disabled={!selectedProvince || regencies.length === 0}
                            className={cn(
                              "w-full justify-between font-normal",
                              !formData.regency_id && "text-muted-foreground"
                            )}
                          >
                            {formData.regency_id
                              ? regencies.find((r) => String(r.id) === String(formData.regency_id))?.name || "Pilih kabupaten/kota"
                              : "Pilih kabupaten/kota"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Cari kabupaten/kota..." />
                            <CommandList>
                              <CommandEmpty>Kabupaten/kota tidak ditemukan.</CommandEmpty>
                              <CommandGroup>
                                {regencies.map((reg) => (
                                  <CommandItem
                                    key={reg.id}
                                    value={reg.name}
                                    onSelect={() => {
                                      setFormData((p) => ({
                                        ...p,
                                        regency_id: String(p.regency_id) === String(reg.id) ? "" : String(reg.id),
                                      }));
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        String(formData.regency_id) === String(reg.id) ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    {reg.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                </>
              ) : null}

              <div className="space-y-2">
                <Label>Jenis Kelamin</Label>
                <Select value={formData.gender} onValueChange={(v) => setFormData((p) => ({ ...p, gender: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Laki-laki</SelectItem>
                    <SelectItem value="female">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {!isPeerGroupOrg ? (
                <div className="space-y-2">
                  <Label>Tanggal Masuk</Label>
                  <Datepicker
                    value={ymdToDate(formData.entry_date)}
                    onChange={(d) => setFormData((p) => ({ ...p, entry_date: dateToYmd(d) }))}
                    weekStart={1}
                    autoHide
                    placeholder="Pilih tanggal"
                    theme={{
                      root: {
                        input: {
                          field: {
                            input: {
                              base:
                                "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                            },
                          },
                        },
                      },
                    }}
                  />
                </div>
              ) : null}

              {isResidentOrg && formData.status === "graduated" ? (
                <div className="space-y-2">
                  <Label>Tanggal Lulus</Label>
                  <Datepicker
                    value={ymdToDate(formData.graduated_at)}
                    onChange={(d) => setFormData((p) => ({ ...p, graduated_at: dateToYmd(d) }))}
                    weekStart={1}
                    autoHide
                    placeholder="Pilih tanggal"
                    theme={{
                      root: {
                        input: {
                          field: {
                            input: {
                              base:
                                "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                            },
                          },
                        },
                      },
                    }}
                  />
                </div>
              ) : null}

              {isResidentOrg && formData.status === "leave" ? (
                <>
                  <div className="space-y-2">
                    <Label>Mulai Cuti</Label>
                    <Datepicker
                      value={ymdToDate(formData.leave_at)}
                      onChange={(d) => setFormData((p) => ({ ...p, leave_at: dateToYmd(d) }))}
                      weekStart={1}
                      autoHide
                      placeholder="Pilih tanggal"
                      theme={{
                        root: {
                          input: {
                            field: {
                              input: {
                                base:
                                  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                              },
                            },
                          },
                        },
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Mulai Aktif Kembali</Label>
                    <Datepicker
                      value={ymdToDate(formData.active_again_at)}
                      onChange={(d) => setFormData((p) => ({ ...p, active_again_at: dateToYmd(d) }))}
                      weekStart={1}
                      autoHide
                      placeholder="Pilih tanggal"
                      theme={{
                        root: {
                          input: {
                            field: {
                              input: {
                                base:
                                  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                              },
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </>
              ) : null}

              {!isPeerGroupOrg && !isResidentOrg ? (
                <div className="space-y-2">
                  <Label>Spesialisasi</Label>
                  <Select
                    value={formData.specialization ? formData.specialization : "__none__"}
                    onValueChange={(v) => setFormData((p) => ({ ...p, specialization: v === "__none__" ? "" : v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih spesialisasi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">-</SelectItem>
                      {SPECIALIZATION_OPTIONS.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : null}
            </div>

            {modalType === "edit" && selectedMember?.id ? (
              <div className="border-t pt-4 mt-2 space-y-3">
                <h4 className="text-sm font-semibold">Achievements</h4>

                {achievementsLoading ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Memuat achievements...
                  </div>
                ) : achievements.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {achievements.map((ach) => (
                      <div key={ach.id} className="flex items-start justify-between gap-2 rounded-md border p-2 text-sm">
                        <div className="min-w-0 flex-1">
                          <div className="font-medium">{ach.title}</div>
                          {ach.description ? <div className="text-xs text-muted-foreground truncate">{ach.description}</div> : null}
                          <div className="text-xs text-muted-foreground">
                            {ach.category ? <span className="mr-2">{ach.category}</span> : null}
                            {ach.date ? <span>{toDateInputValue(ach.date)}</span> : null}
                          </div>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <Button type="button" variant="outline" size="sm" onClick={() => handleEditAchievement(ach)}>
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button type="button" variant="destructive" size="sm" onClick={() => handleDeleteAchievement(ach.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground">Belum ada achievement.</div>
                )}

                <div className="grid gap-2 grid-cols-1 rounded-md border p-3 bg-muted/30">
                  <div className="text-xs font-medium">{editingAchievementId ? "Edit Achievement" : "Tambah Achievement"}</div>
                  <Input
                    placeholder="Judul achievement *"
                    value={achievementForm.title}
                    onChange={(e) => setAchievementForm((p) => ({ ...p, title: e.target.value }))}
                  />
                  <Input
                    placeholder="Deskripsi (opsional)"
                    value={achievementForm.description}
                    onChange={(e) => setAchievementForm((p) => ({ ...p, description: e.target.value }))}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="date"
                      placeholder="Tanggal"
                      value={achievementForm.date}
                      onChange={(e) => setAchievementForm((p) => ({ ...p, date: e.target.value }))}
                    />
                    <Input
                      placeholder="Kategori (opsional)"
                      value={achievementForm.category}
                      onChange={(e) => setAchievementForm((p) => ({ ...p, category: e.target.value }))}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      disabled={!achievementForm.title.trim() || achievementSaving}
                      onClick={handleSaveAchievement}
                    >
                      {achievementSaving ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Plus className="h-3 w-3 mr-1" />}
                      {editingAchievementId ? "Update" : "Tambah"}
                    </Button>
                    {editingAchievementId ? (
                      <Button type="button" variant="outline" size="sm" onClick={resetAchievementForm}>
                        Batal
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null}

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={closeModal} disabled={formLoading}>
                Batal
              </Button>
              <Button type="submit" disabled={formLoading || photoUploading}>
                {formLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Menyimpan...
                  </>
                ) : modalType === "create" ? (
                  "Add"
                ) : (
                  "Simpan"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {achModalMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setAchModalMember(null)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-bold">Achievements</h3>
                <p className="text-sm text-muted-foreground">{achModalMember.name}</p>
              </div>
              <button type="button" className="p-1 rounded-full hover:bg-gray-100" onClick={() => setAchModalMember(null)}>
                <Icon icon="mdi:close" className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {(achievementsByMember[achModalMember.id] || []).length > 0 ? (
                (achievementsByMember[achModalMember.id] || []).map((ach) => (
                  <div key={ach.id} className="flex items-start gap-3 p-3 bg-yellow-50/50 border border-yellow-100 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon icon="mdi:medal" className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900">{ach.title}</p>
                      {ach.description ? <p className="text-xs text-gray-600 mt-0.5">{ach.description}</p> : null}
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        {ach.category ? <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{ach.category}</span> : null}
                        {ach.date ? <span>{new Date(ach.date).toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "numeric" })}</span> : null}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground text-center py-4">Belum ada achievement.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
