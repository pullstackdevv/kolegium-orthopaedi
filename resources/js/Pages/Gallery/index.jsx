import { useEffect, useRef, useState } from "react";
import { Loader2, Pencil, Plus, Trash2, Upload, X, Image as ImageIcon } from "lucide-react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import api from "@/api/axios";
import Swal from "sweetalert2";
import { useAuth } from "@/contexts/AuthContext";
import { usePage } from "@inertiajs/react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const SCOPE_LABELS = {
  kolegium: "Kolegium - Event Gallery",
  study_program: {
    resident: "Resident - Gallery",
    fellow: "Fellow (CF) - Gallery",
    trainee: "Trainee - Gallery",
  },
  peer_group: "Peer Group - Gallery",
};

const AFFILIATION_TYPE_MAP = {
  kolegium: "kolegium",
  resident: "residen",
  fellow: "clinical_fellowship",
  trainee: "subspesialis",
  peer_group: "peer_group",
};

function GalleryContent() {
  const { user } = useAuth();
  const { url } = usePage();
  const params = new URLSearchParams(url.split("?")[1] || "");
  const scope = params.get("scope") || "study_program";
  const section = params.get("section") || "resident";

  const isSuperAdmin = user?.roles?.some((r) => r.name === "super_admin");

  const pageLabel =
    scope === "study_program"
      ? SCOPE_LABELS.study_program?.[section] || "Gallery"
      : SCOPE_LABELS[scope] || "Gallery";

  const affiliationType =
    scope === "study_program"
      ? AFFILIATION_TYPE_MAP[section] || "residen"
      : AFFILIATION_TYPE_MAP[scope] || "residen";

  // State
  const [affiliations, setAffiliations] = useState([]);
  const [selectedAffiliationId, setSelectedAffiliationId] = useState(null);
  const [galleries, setGalleries] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ title: "", description: "", gallery_date: "", photo: "" });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  // Fetch affiliations
  useEffect(() => {
    const fetchAffiliations = async () => {
      try {
        const { data } = await api.get("/galleries/affiliations", {
          params: { type: affiliationType },
        });
        if (data?.status === "success" && Array.isArray(data.data)) {
          setAffiliations(data.data);
          if (!isSuperAdmin && data.data.length > 0) {
            setSelectedAffiliationId(data.data[0].id);
          }
        }
      } catch (e) {
        console.error("Failed to fetch affiliations", e);
      }
    };
    fetchAffiliations();
  }, [affiliationType, isSuperAdmin]);

  // Fetch galleries
  const fetchGalleries = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        scope,
        section: scope === "study_program" ? section : undefined,
        per_page: 12,
        page,
      };
      if (selectedAffiliationId) {
        params.affiliation_id = selectedAffiliationId;
      }
      const { data } = await api.get("/galleries", { params });
      if (data?.status === "success") {
        const pg = data.data;
        setGalleries(pg.data || []);
        setPagination({
          current_page: pg.current_page || 1,
          last_page: pg.last_page || 1,
          total: pg.total || 0,
        });
      }
    } catch (e) {
      console.error("Failed to fetch galleries", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleries(1);
  }, [selectedAffiliationId, scope, section]);

  // Photo upload
  const handlePhotoUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const { data } = await api.post("/galleries/upload-photo", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (data?.status === "success") {
        setFormData((prev) => ({ ...prev, photo: data.data.path }));
      }
    } catch (e) {
      Swal.fire("Error", "Failed to upload photo", "error");
    } finally {
      setUploading(false);
    }
  };

  // Open create dialog
  const openCreate = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      description: "",
      gallery_date: "",
      photo: "",
    });
    setDialogOpen(true);
  };

  // Open edit dialog
  const openEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || "",
      description: item.description || "",
      gallery_date: item.gallery_date ? item.gallery_date.split("T")[0] : "",
      photo: item.photo || "",
    });
    setDialogOpen(true);
  };

  // Save (create or update)
  const handleSave = async () => {
    if (!formData.title.trim()) {
      Swal.fire("Validation", "Title is required", "warning");
      return;
    }
    if (!formData.photo) {
      Swal.fire("Validation", "Photo is required", "warning");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        scope,
        section: scope === "study_program" ? section : undefined,
      };

      if (editingItem) {
        await api.put(`/galleries/${editingItem.id}`, payload);
        Swal.fire("Success", "Gallery item updated", "success");
      } else {
        // Determine affiliation_id for new item
        let affId = selectedAffiliationId;
        if (!affId && affiliations.length > 0) {
          affId = affiliations[0].id;
        }
        payload.affiliation_id = affId;
        await api.post("/galleries", payload);
        Swal.fire("Success", "Gallery item created", "success");
      }
      setDialogOpen(false);
      fetchGalleries(pagination.current_page);
    } catch (e) {
      const msg = e.response?.data?.message || "Failed to save";
      Swal.fire("Error", msg, "error");
    } finally {
      setSaving(false);
    }
  };

  // Delete
  const handleDelete = async (item) => {
    const result = await Swal.fire({
      title: "Delete Gallery Item?",
      text: `Are you sure you want to delete "${item.title}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Delete",
    });
    if (!result.isConfirmed) return;

    try {
      await api.delete(`/galleries/${item.id}`, {
        params: {
          scope,
          section: scope === "study_program" ? section : undefined,
        },
      });
      Swal.fire("Deleted", "Gallery item deleted", "success");
      fetchGalleries(pagination.current_page);
    } catch (e) {
      Swal.fire("Error", "Failed to delete", "error");
    }
  };

  const getPhotoUrl = (photo) => {
    if (!photo) return null;
    if (photo.startsWith("http")) return photo;
    return `/storage/${photo}`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-xl">{pageLabel}</CardTitle>
            <div className="flex items-center gap-3">
              {isSuperAdmin && affiliations.length > 0 && (
                <Select
                  value={selectedAffiliationId ? String(selectedAffiliationId) : "all"}
                  onValueChange={(val) =>
                    setSelectedAffiliationId(val === "all" ? null : Number(val))
                  }
                >
                  <SelectTrigger className="w-[220px]">
                    <SelectValue placeholder="All Affiliations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Affiliations</SelectItem>
                    {affiliations.map((a) => (
                      <SelectItem key={a.id} value={String(a.id)}>
                        {a.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {!isSuperAdmin && affiliations.length > 0 && (
                <span className="text-sm text-gray-600 font-medium">
                  {affiliations.find((a) => a.id === selectedAffiliationId)?.name || ""}
                </span>
              )}
              <Button onClick={openCreate} className="gap-2">
                <Plus className="w-4 h-4" /> Add Gallery
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : galleries.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-40" />
              <p className="text-lg font-medium">No gallery items yet</p>
              <p className="text-sm">Click "Add Gallery" to create one</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {galleries.map((item) => (
                  <div
                    key={item.id}
                    className="group relative rounded-xl overflow-hidden border border-gray-200 bg-white hover:shadow-lg transition-all duration-300"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                      {item.photo ? (
                        <img
                          src={getPhotoUrl(item.photo)}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-12 h-12 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-sm text-gray-900 line-clamp-1">{item.title}</h3>
                      {item.gallery_date && (
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(item.gallery_date).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      )}
                      {isSuperAdmin && item.affiliation && (
                        <p className="text-xs text-primary mt-1">{item.affiliation.name}</p>
                      )}
                      {item.description && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                      )}
                    </div>
                    {/* Action buttons */}
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEdit(item)}
                        className="bg-white/90 hover:bg-white rounded-full p-1.5 shadow-sm"
                      >
                        <Pencil className="w-3.5 h-3.5 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="bg-white/90 hover:bg-white rounded-full p-1.5 shadow-sm"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.last_page > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                  <p className="text-sm text-gray-500">
                    Page {pagination.current_page} of {pagination.last_page} ({pagination.total} items)
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.current_page <= 1}
                      onClick={() => fetchGalleries(pagination.current_page - 1)}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.current_page >= pagination.last_page}
                      onClick={() => fetchGalleries(pagination.current_page + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Gallery Item" : "Add Gallery Item"}</DialogTitle>
            <DialogDescription>
              {editingItem ? "Update the gallery item details below." : "Fill in the details to add a new gallery item."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Photo Upload */}
            <div>
              <Label>Photo *</Label>
              <div className="mt-1">
                {formData.photo ? (
                  <div className="relative rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={getPhotoUrl(formData.photo)}
                      alt="Preview"
                      className="w-full h-48 object-cover"
                    />
                    <button
                      type="button"
                      className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-full p-1 shadow"
                      onClick={() => setFormData((prev) => ({ ...prev, photo: "" }))}
                    >
                      <X className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                ) : (
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {uploading ? (
                      <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Click to upload photo</p>
                        <p className="text-xs text-gray-400 mt-1">Max 5MB (JPG, PNG)</p>
                      </>
                    )}
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handlePhotoUpload(e.target.files?.[0])}
                />
              </div>
            </div>

            {/* Affiliation selector (super admin only, for create) */}
            {isSuperAdmin && !editingItem && affiliations.length > 0 && (
              <div>
                <Label>Affiliation *</Label>
                <Select
                  value={selectedAffiliationId ? String(selectedAffiliationId) : ""}
                  onValueChange={(val) => setSelectedAffiliationId(Number(val))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select affiliation" />
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

            {/* Title */}
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Enter title"
                className="mt-1"
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Enter description (optional)"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                rows={3}
              />
            </div>

            {/* Date */}
            <div>
              <Label htmlFor="gallery_date">Date</Label>
              <Input
                id="gallery_date"
                type="date"
                value={formData.gallery_date}
                onChange={(e) => setFormData((prev) => ({ ...prev, gallery_date: e.target.value }))}
                className="mt-1"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving || uploading}>
              {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {editingItem ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function GalleryPage() {
  return (
    <DashboardLayout>
      <GalleryContent />
    </DashboardLayout>
  );
}
