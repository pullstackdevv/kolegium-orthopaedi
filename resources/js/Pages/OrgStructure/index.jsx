import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, Pencil, Plus, Trash2, Upload, X } from "lucide-react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import api from "@/api/axios";
import Swal from "sweetalert2";
import { useAuth } from "@/contexts/AuthContext";
import { usePage } from "@inertiajs/react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

const INSTITUTION_ORIGINS = [
  "PNS Kemendiktisaintek",
  "PPPK Kemendiktisaintek",
  "Honorer Kemendiktisaintek",
  "PNS Kemenkes",
  "PPPK Kemenkes",
  "Honorer Kemenkes",
  "Pegawai Tetap Swasta",
  "Pegawai Honorer Swasta",
];

const ORG_LABELS = {
  koti: "Struktur Organisasi (KOTI)",
  kolkes: "Struktur Organisasi (Kolkes)",
  resident: "Resident - Struktur Organisasi",
  fellow: "Fellow (CF) - Struktur Organisasi",
  trainee: "Trainee - Struktur Organisasi",
  peer_group: "Peer Group - Struktur Organisasi",
};

const AFFILIATION_TYPE_BY_ORG = {
  koti: "kolegium",
  kolkes: "kolegium",
  resident: "residen",
  fellow: "clinical_fellowship",
  trainee: "subspesialis",
  peer_group: "peer_group",
};

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
  if (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("data:") || s.startsWith("//")) return s;
  if (s.startsWith("/")) return s;
  if (s.startsWith("storage/")) return `/${s}`;
  return `/${s}`;
};

function OrgStructureContent() {
  const { user, isSuperAdmin, hasPermission } = useAuth();
  const { url } = usePage();
  const params = new URLSearchParams(url.split("?")[1] || "");
  const orgFromUrl = params.get("org") || "resident";

  const orgType = ORG_TYPES.includes(orgFromUrl) ? orgFromUrl : "resident";
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState([]);
  const [affiliations, setAffiliations] = useState([]);
  const [selectedAffiliation, setSelectedAffiliation] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [saving, setSaving] = useState(false);
  const [dialogAffiliation, setDialogAffiliation] = useState("");

  const [form, setForm] = useState({
    name: "",
    position: "",
    email: "",
    photo: "",
    position_order: 0,
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const photoInputRef = useRef(null);

  // Fetch affiliations for the dropdown
  useEffect(() => {
    const fetchAffiliations = async () => {
      try {
        const affType = AFFILIATION_TYPE_BY_ORG[orgType] || "";
        const { data } = await api.get("/org-structure-members/affiliations", {
          params: { type: affType },
        });
        const list = data?.data || [];
        setAffiliations(list);

        if (!isSuperAdmin && list.length > 0) {
          setSelectedAffiliation(String(list[0].id));
        } else {
          setSelectedAffiliation("all");
        }
      } catch (err) {
        console.error("Failed to load affiliations", err);
      }
    };
    fetchAffiliations();
  }, [orgType, isSuperAdmin]);

  // Fetch members
  const fetchMembers = async () => {
    setLoading(true);
    try {
      const params = { organization_type: orgType };
      if (selectedAffiliation && selectedAffiliation !== "all") params.affiliation_id = selectedAffiliation;
      const { data } = await api.get("/org-structure-members", { params });
      setMembers(data?.data || []);
    } catch (err) {
      console.error("Failed to load members", err);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSuperAdmin || selectedAffiliation) {
      fetchMembers();
    }
  }, [orgType, selectedAffiliation]);

  const openCreateDialog = () => {
    setEditingMember(null);
    setForm({ name: "", position: "", email: "", photo: "", position_order: 0 });
    setPhotoFile(null);
    setPhotoPreview(null);
    setDialogAffiliation(selectedAffiliation && selectedAffiliation !== "all" ? selectedAffiliation : (affiliations.length > 0 ? String(affiliations[0].id) : ""));
    setDialogOpen(true);
  };

  const openEditDialog = (member) => {
    setEditingMember(member);
    setForm({
      name: member.name || "",
      position: member.position || "",
      email: member.email || "",
      photo: member.photo || "",
      position_order: member.position_order || 0,
    });
    setPhotoFile(null);
    setPhotoPreview(member.photo ? resolveImageUrl(member.photo) : null);
    setDialogAffiliation(member.affiliation_id ? String(member.affiliation_id) : "");
    setDialogOpen(true);
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const uploadPhoto = async () => {
    if (!photoFile) return form.photo;
    setUploadingPhoto(true);
    try {
      const fd = new FormData();
      fd.append("image", photoFile);
      fd.append("organization_type", orgType);
      const { data } = await api.post("/org-structure-members/upload-photo", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data?.data?.url || form.photo;
    } catch (err) {
      console.error("Photo upload failed", err);
      return form.photo;
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      Swal.fire("Error", "Nama wajib diisi", "error");
      return;
    }
    setSaving(true);
    try {
      const photoUrl = await uploadPhoto();

      const payload = {
        ...form,
        photo: photoUrl,
        organization_type: orgType,
        position_order: parseInt(form.position_order, 10) || 0,
      };

      // Always send affiliation_id from the dialog selector
      if (dialogAffiliation && dialogAffiliation !== "all") {
        payload.affiliation_id = parseInt(dialogAffiliation, 10);
      }

      if (editingMember) {
        await api.put(`/org-structure-members/${editingMember.id}`, payload);
        Swal.fire("Berhasil", "Data berhasil diperbarui", "success");
      } else {
        await api.post("/org-structure-members", payload);
        Swal.fire("Berhasil", "Data berhasil ditambahkan", "success");
      }

      setDialogOpen(false);
      fetchMembers();
    } catch (err) {
      console.error("Save failed", err);
      Swal.fire("Error", err?.response?.data?.message || "Gagal menyimpan data", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (member) => {
    const result = await Swal.fire({
      title: "Hapus data?",
      text: `Apakah Anda yakin ingin menghapus "${member.name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/org-structure-members/${member.id}`);
      Swal.fire("Berhasil", "Data berhasil dihapus", "success");
      fetchMembers();
    } catch (err) {
      Swal.fire("Error", err?.response?.data?.message || "Gagal menghapus data", "error");
    }
  };

  const canCreate = isSuperAdmin || hasPermission(permissionKey(orgType, "create"));
  const canEdit = isSuperAdmin || hasPermission(permissionKey(orgType, "edit"));
  const canDelete = isSuperAdmin || hasPermission(permissionKey(orgType, "delete"));

  // ─── Teacher Staff (resident only) ───
  const isResident = orgType === "resident";
  const [tsMembers, setTsMembers] = useState([]);
  const [tsLoading, setTsLoading] = useState(false);
  const [tsDivisions, setTsDivisions] = useState([]);
  const [tsDialogOpen, setTsDialogOpen] = useState(false);
  const [tsEditing, setTsEditing] = useState(null);
  const [tsSaving, setTsSaving] = useState(false);
  const [tsDialogAffiliation, setTsDialogAffiliation] = useState("");
  const [tsForm, setTsForm] = useState({ name: "", photo: "", institution_origin: "", teacher_staff_division_id: "" });
  const [tsPhotoFile, setTsPhotoFile] = useState(null);
  const [tsPhotoPreview, setTsPhotoPreview] = useState(null);
  const [tsUploadingPhoto, setTsUploadingPhoto] = useState(false);
  const tsPhotoInputRef = useRef(null);

  useEffect(() => {
    if (!isResident) return;
    const fetchDivisions = async () => {
      try {
        const { data } = await api.get("/teacher-staff-members/divisions");
        setTsDivisions(data?.data || []);
      } catch (err) {
        console.error("Failed to load divisions", err);
      }
    };
    fetchDivisions();
  }, [isResident]);

  const fetchTsMembers = async () => {
    if (!isResident) return;
    setTsLoading(true);
    try {
      const params = {};
      if (selectedAffiliation && selectedAffiliation !== "all") params.affiliation_id = selectedAffiliation;
      const { data } = await api.get("/teacher-staff-members", { params });
      setTsMembers(data?.data || []);
    } catch (err) {
      console.error("Failed to load teacher staff", err);
      setTsMembers([]);
    } finally {
      setTsLoading(false);
    }
  };

  useEffect(() => {
    if (isResident && (isSuperAdmin || selectedAffiliation)) {
      fetchTsMembers();
    }
  }, [isResident, selectedAffiliation]);

  const openTsCreateDialog = () => {
    setTsEditing(null);
    setTsForm({ name: "", photo: "", institution_origin: "", teacher_staff_division_id: "" });
    setTsPhotoFile(null);
    setTsPhotoPreview(null);
    setTsDialogAffiliation(selectedAffiliation && selectedAffiliation !== "all" ? selectedAffiliation : (affiliations.length > 0 ? String(affiliations[0].id) : ""));
    setTsDialogOpen(true);
  };

  const openTsEditDialog = (member) => {
    setTsEditing(member);
    setTsForm({
      name: member.name || "",
      photo: member.photo || "",
      institution_origin: member.institution_origin || "",
      teacher_staff_division_id: member.teacher_staff_division_id ? String(member.teacher_staff_division_id) : "",
    });
    setTsPhotoFile(null);
    setTsPhotoPreview(member.photo ? resolveImageUrl(member.photo) : null);
    setTsDialogAffiliation(member.affiliation_id ? String(member.affiliation_id) : "");
    setTsDialogOpen(true);
  };

  const handleTsPhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setTsPhotoFile(file);
    setTsPhotoPreview(URL.createObjectURL(file));
  };

  const uploadTsPhoto = async () => {
    if (!tsPhotoFile) return tsForm.photo;
    setTsUploadingPhoto(true);
    try {
      const fd = new FormData();
      fd.append("image", tsPhotoFile);
      const { data } = await api.post("/teacher-staff-members/upload-photo", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data?.data?.url || tsForm.photo;
    } catch (err) {
      console.error("Photo upload failed", err);
      return tsForm.photo;
    } finally {
      setTsUploadingPhoto(false);
    }
  };

  const handleTsSave = async () => {
    if (!tsForm.name.trim()) {
      Swal.fire("Error", "Nama wajib diisi", "error");
      return;
    }
    if (!tsForm.teacher_staff_division_id) {
      Swal.fire("Error", "Divisi wajib dipilih", "error");
      return;
    }
    setTsSaving(true);
    try {
      const photoUrl = await uploadTsPhoto();
      const payload = {
        name: tsForm.name,
        photo: photoUrl || null,
        institution_origin: tsForm.institution_origin || null,
        teacher_staff_division_id: parseInt(tsForm.teacher_staff_division_id, 10),
      };
      if (tsDialogAffiliation && tsDialogAffiliation !== "all") {
        payload.affiliation_id = parseInt(tsDialogAffiliation, 10);
      }
      if (tsEditing) {
        await api.put(`/teacher-staff-members/${tsEditing.id}`, payload);
        Swal.fire("Berhasil", "Data teacher staff berhasil diperbarui", "success");
      } else {
        await api.post("/teacher-staff-members", payload);
        Swal.fire("Berhasil", "Data teacher staff berhasil ditambahkan", "success");
      }
      setTsDialogOpen(false);
      fetchTsMembers();
    } catch (err) {
      console.error("Save failed", err);
      Swal.fire("Error", err?.response?.data?.message || "Gagal menyimpan data", "error");
    } finally {
      setTsSaving(false);
    }
  };

  const handleTsDelete = async (member) => {
    const result = await Swal.fire({
      title: "Hapus data?",
      text: `Apakah Anda yakin ingin menghapus "${member.name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });
    if (!result.isConfirmed) return;
    try {
      await api.delete(`/teacher-staff-members/${member.id}`);
      Swal.fire("Berhasil", "Data berhasil dihapus", "success");
      fetchTsMembers();
    } catch (err) {
      Swal.fire("Error", err?.response?.data?.message || "Gagal menghapus data", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {ORG_LABELS[orgType] || "Struktur Organisasi"}
        </h1>
        <p className="text-muted-foreground">
          Kelola data struktur organisasi per afiliasi
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 items-end">
            {isSuperAdmin && (
              <div className="w-64">
                <Label>Afiliasi</Label>
                <Select
                  value={selectedAffiliation}
                  onValueChange={(v) => setSelectedAffiliation(v)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Pilih afiliasi..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Afiliasi</SelectItem>
                    {affiliations.map((a) => (
                      <SelectItem key={a.id} value={String(a.id)}>
                        {a.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {!isSuperAdmin && affiliations.length > 0 && (
              <div className="text-sm text-muted-foreground">
                Afiliasi: <span className="font-semibold text-foreground">{affiliations.find(a => String(a.id) === selectedAffiliation)?.name || "-"}</span>
              </div>
            )}

          </div>
        </CardContent>
      </Card>

      {/* Members Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Daftar Struktur Organisasi</CardTitle>
            <CardDescription>
              {members.length} anggota ditemukan
            </CardDescription>
          </div>
          {canCreate && (
            <Button onClick={openCreateDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Data
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : members.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Belum ada data struktur organisasi.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">No</TableHead>
                  <TableHead className="w-16">Foto</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Jabatan</TableHead>
                  <TableHead>Email</TableHead>
                  {isSuperAdmin && <TableHead>Afiliasi</TableHead>}
                  <TableHead className="w-16">Urutan</TableHead>
                  <TableHead className="w-24 text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((m, idx) => (
                  <TableRow key={m.id}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>
                      {m.photo ? (
                        <img
                          src={resolveImageUrl(m.photo)}
                          alt={m.name}
                          className="w-10 h-10 rounded-full object-cover"
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                          —
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{m.name}</TableCell>
                    <TableCell>{m.position || "—"}</TableCell>
                    <TableCell>{m.email || "—"}</TableCell>
                    {isSuperAdmin && (
                      <TableCell>{m.affiliation?.name || "—"}</TableCell>
                    )}
                    <TableCell>{m.position_order}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {canEdit && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(m)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                        )}
                        {canDelete && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(m)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingMember ? "Edit Anggota" : "Tambah Anggota"}
            </DialogTitle>
            <DialogDescription>
              {editingMember
                ? "Perbarui data anggota struktur organisasi"
                : "Tambahkan anggota baru ke struktur organisasi"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Affiliation selector for super admin */}
            {isSuperAdmin && affiliations.length > 0 && (
              <div>
                <Label htmlFor="dialog_affiliation">Afiliasi *</Label>
                <Select
                  value={dialogAffiliation}
                  onValueChange={(v) => setDialogAffiliation(v)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Pilih afiliasi..." />
                  </SelectTrigger>
                  <SelectContent>
                    {affiliations.map((a) => (
                      <SelectItem key={a.id} value={String(a.id)}>
                        {a.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Photo */}
            <div>
              <Label>Foto Profil</Label>
              <div className="mt-2 flex items-center gap-4">
                {photoPreview ? (
                  <div className="relative">
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-20 h-20 rounded-full object-cover border"
                    />
                    <button
                      type="button"
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"
                      onClick={() => {
                        setPhotoFile(null);
                        setPhotoPreview(null);
                        setForm((f) => ({ ...f, photo: "" }));
                      }}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-gray-400" />
                  </div>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => photoInputRef.current?.click()}
                >
                  {photoPreview ? "Ganti Foto" : "Upload Foto"}
                </Button>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoSelect}
                />
              </div>
            </div>

            {/* Name */}
            <div>
              <Label htmlFor="name">Nama (beserta gelar) *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Prof. Dr. Ahmad Jabir, Sp.OT(K)"
                className="mt-1"
              />
            </div>

            {/* Position */}
            <div>
              <Label htmlFor="position">Keterangan / Jabatan</Label>
              <Input
                id="position"
                value={form.position}
                onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))}
                placeholder="e.g. Ketua Program Studi"
                className="mt-1"
              />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="e.g. ahmad@orthopaedi.id"
                className="mt-1"
              />
            </div>

            {/* Position Order */}
            <div>
              <Label htmlFor="position_order">Urutan Tampil</Label>
              <Input
                id="position_order"
                type="number"
                min="0"
                value={form.position_order}
                onChange={(e) =>
                  setForm((f) => ({ ...f, position_order: e.target.value }))
                }
                placeholder="0"
                className="mt-1 w-24"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Semakin kecil angka, semakin atas posisinya
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={saving}
            >
              Batal
            </Button>
            <Button onClick={handleSave} disabled={saving || uploadingPhoto}>
              {(saving || uploadingPhoto) && (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              )}
              {editingMember ? "Simpan Perubahan" : "Tambah"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Teacher Staff Section (resident only) ─── */}
      {isResident && (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Teacher Staff</CardTitle>
                  <CardDescription>{tsMembers.length} teacher staff ditemukan</CardDescription>
                </div>
                {canCreate && (
                  <Button onClick={openTsCreateDialog}>
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Teacher Staff
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {tsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : tsMembers.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  Belum ada data teacher staff.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">No</TableHead>
                      <TableHead className="w-16">Foto</TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead>Asal Institusi</TableHead>
                      <TableHead>Divisi</TableHead>
                      {isSuperAdmin && <TableHead>Afiliasi</TableHead>}
                      <TableHead className="w-24 text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tsMembers.map((m, idx) => (
                      <TableRow key={m.id}>
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell>
                          {m.photo ? (
                            <img
                              src={resolveImageUrl(m.photo)}
                              alt={m.name}
                              className="w-10 h-10 rounded-full object-cover"
                              onError={(e) => { e.target.style.display = "none"; }}
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                              —
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{m.name}</TableCell>
                        <TableCell>{m.institution_origin || "—"}</TableCell>
                        <TableCell>{m.division?.name || "—"}</TableCell>
                        {isSuperAdmin && (
                          <TableCell>{m.affiliation?.name || "—"}</TableCell>
                        )}
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            {canEdit && (
                              <Button variant="ghost" size="icon" onClick={() => openTsEditDialog(m)}>
                                <Pencil className="w-4 h-4" />
                              </Button>
                            )}
                            {canDelete && (
                              <Button variant="ghost" size="icon" onClick={() => handleTsDelete(m)}>
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Teacher Staff Create/Edit Dialog */}
          <Dialog open={tsDialogOpen} onOpenChange={setTsDialogOpen}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>{tsEditing ? "Edit Teacher Staff" : "Tambah Teacher Staff"}</DialogTitle>
                <DialogDescription>
                  {tsEditing ? "Perbarui data teacher staff" : "Tambahkan teacher staff baru"}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {isSuperAdmin && affiliations.length > 0 && (
                  <div>
                    <Label>Afiliasi *</Label>
                    <Select value={tsDialogAffiliation} onValueChange={(v) => setTsDialogAffiliation(v)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Pilih afiliasi..." />
                      </SelectTrigger>
                      <SelectContent>
                        {affiliations.map((a) => (
                          <SelectItem key={a.id} value={String(a.id)}>{a.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Photo */}
                <div>
                  <Label>Foto Profil</Label>
                  <div className="mt-2 flex items-center gap-4">
                    {tsPhotoPreview ? (
                      <div className="relative">
                        <img src={tsPhotoPreview} alt="Preview" className="w-20 h-20 rounded-full object-cover border" />
                        <button
                          type="button"
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"
                          onClick={() => { setTsPhotoFile(null); setTsPhotoPreview(null); setTsForm((f) => ({ ...f, photo: "" })); }}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                        <Upload className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    <Button type="button" variant="outline" size="sm" onClick={() => tsPhotoInputRef.current?.click()}>
                      {tsPhotoPreview ? "Ganti Foto" : "Upload Foto"}
                    </Button>
                    <input ref={tsPhotoInputRef} type="file" accept="image/*" className="hidden" onChange={handleTsPhotoSelect} />
                  </div>
                </div>

                {/* Name */}
                <div>
                  <Label>Nama (beserta gelar) *</Label>
                  <Input
                    value={tsForm.name}
                    onChange={(e) => setTsForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Prof. Dr. Ahmad Jabir, Sp.OT(K)"
                    className="mt-1"
                  />
                </div>

                {/* Institution Origin */}
                <div>
                  <Label>Asal Institusi</Label>
                  <Select value={tsForm.institution_origin} onValueChange={(v) => setTsForm((f) => ({ ...f, institution_origin: v }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Pilih asal institusi..." />
                    </SelectTrigger>
                    <SelectContent>
                      {INSTITUTION_ORIGINS.map((io) => (
                        <SelectItem key={io} value={io}>{io}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Division */}
                <div>
                  <Label>Divisi *</Label>
                  <Select value={tsForm.teacher_staff_division_id} onValueChange={(v) => setTsForm((f) => ({ ...f, teacher_staff_division_id: v }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Pilih divisi..." />
                    </SelectTrigger>
                    <SelectContent>
                      {tsDivisions.map((d) => (
                        <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setTsDialogOpen(false)} disabled={tsSaving}>
                  Batal
                </Button>
                <Button onClick={handleTsSave} disabled={tsSaving || tsUploadingPhoto}>
                  {(tsSaving || tsUploadingPhoto) && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  {tsEditing ? "Simpan Perubahan" : "Tambah"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}

export default function OrgStructurePage() {
  return (
    <DashboardLayout>
      <OrgStructureContent />
    </DashboardLayout>
  );
}
