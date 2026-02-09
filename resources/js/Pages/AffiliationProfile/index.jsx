import { useEffect, useState, useCallback } from "react";
import { Loader2, Save, Upload, Image as ImageIcon, Trash2, ArrowLeft, Pencil, Building2, Search } from "lucide-react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import api from "@/api/axios";
import Swal from "sweetalert2";
import { useAuth } from "@/contexts/AuthContext";
import { usePage } from "@inertiajs/react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const SCOPE_LABELS = {
  study_program: "Study Program",
  peer_group: "Peer Group",
};

const SECTION_LABELS = {
  resident: "Resident",
  fellow: "Fellow (CF)",
  trainee: "Trainee",
};

function buildPageTitle(scope, section) {
  const scopeLabel = SCOPE_LABELS[scope] || scope;
  const sectionLabel = SECTION_LABELS[section] || "";
  if (scope === "study_program" && sectionLabel) {
    return `${sectionLabel} - Profile`;
  }
  if (scope === "peer_group") {
    return "Peer Group - Profile";
  }
  return "Affiliation Profile";
}

const EMPTY_FORM = {
  description: "",
  sub_title: "",
  accreditation: "",
  established_year: "",
  program_duration: "",
  capacity: "",
  contact_address: "",
  contact_phone: "",
  contact_email: "",
  contact_website: "",
  registration_info: "",
  registration_url: "",
};

export default function AffiliationProfilePage() {
  return (
    <DashboardLayout>
      <AffiliationProfileContent />
    </DashboardLayout>
  );
}

function AffiliationProfileContent() {
  const { isSuperAdmin } = useAuth();
  const { url } = usePage();

  // Parse scope & section from URL query params
  const params = new URLSearchParams(url.split("?")[1] || "");
  const scope = params.get("scope") || "";
  const section = params.get("section") || "";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // View mode: "list" (affiliations list) or "edit" (profile form)
  const [view, setView] = useState(isSuperAdmin ? "list" : "edit");
  const [search, setSearch] = useState("");

  // For super_admin: list of affiliations
  const [affiliations, setAffiliations] = useState([]);

  // Current affiliation info
  const [affiliation, setAffiliation] = useState(null);

  // Form data
  const [form, setForm] = useState({ ...EMPTY_FORM });

  const [coverImageUrl, setCoverImageUrl] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  const [logoUrl, setLogoUrl] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const pageTitle = buildPageTitle(scope, section);

  // Fetch list of affiliations (super admin) or single profile (non-super admin)
  const fetchInitial = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/affiliation-profiles", {
        params: { scope, section },
      });

      if (data?.status === "success") {
        const result = data.data;

        if (result.affiliations) {
          // Super admin: got list of affiliations
          setAffiliations(result.affiliations);
          setView("list");
        } else if (result.affiliation) {
          // Non-super admin: got single affiliation + profile
          setAffiliation(result.affiliation);
          loadFormFromProfile(result.profile);
          setView("edit");
        }
      }
    } catch (error) {
      console.error("Failed to fetch:", error);
      Swal.fire("Error", "Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  }, [scope, section]);

  // Fetch profile for a specific affiliation (when super admin clicks one)
  const fetchProfileForAffiliation = useCallback(
    async (affiliationId) => {
      setLoading(true);
      try {
        const { data } = await api.get("/affiliation-profiles", {
          params: { scope, section, affiliation_id: affiliationId },
        });

        if (data?.status === "success") {
          const result = data.data;
          if (result.affiliation) {
            setAffiliation(result.affiliation);
          }
          loadFormFromProfile(result.profile);
          setView("edit");
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        Swal.fire("Error", "Failed to load profile data", "error");
      } finally {
        setLoading(false);
      }
    },
    [scope, section]
  );

  const loadFormFromProfile = (profile) => {
    if (profile) {
      setForm({
        description: profile.description || "",
        sub_title: profile.sub_title || "",
        accreditation: profile.accreditation || "",
        established_year: profile.established_year || "",
        program_duration: profile.program_duration || "",
        capacity: profile.capacity || "",
        contact_address: profile.contact_address || "",
        contact_phone: profile.contact_phone || "",
        contact_email: profile.contact_email || "",
        contact_website: profile.contact_website || "",
        registration_info: profile.registration_info || "",
        registration_url: profile.registration_url || "",
      });
      setCoverImageUrl(profile.cover_image_url || null);
      setLogoUrl(profile.logo_url || null);
    } else {
      setForm({ ...EMPTY_FORM });
      setCoverImageUrl(null);
      setLogoUrl(null);
    }
    setCoverImageFile(null);
    setCoverPreview(null);
    setLogoFile(null);
    setLogoPreview(null);
  };

  useEffect(() => {
    fetchInitial();
  }, [fetchInitial]);

  const handleSelectAffiliation = (aff) => {
    fetchProfileForAffiliation(aff.id);
  };

  const handleBackToList = () => {
    setAffiliation(null);
    setForm({ ...EMPTY_FORM });
    setCoverImageUrl(null);
    setCoverImageFile(null);
    setCoverPreview(null);
    setLogoUrl(null);
    setLogoFile(null);
    setLogoPreview(null);
    setView("list");
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire("Error", "Image size must be less than 5MB", "error");
      return;
    }

    setCoverImageFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire("Error", "Image size must be less than 5MB", "error");
      return;
    }

    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleUploadLogo = async () => {
    if (!logoFile || !affiliation) return;

    setUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append("logo", logoFile);
      formData.append("affiliation_id", affiliation.id);

      const { data } = await api.post(
        `/affiliation-profiles/upload-logo?scope=${scope}&section=${section}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (data?.status === "success") {
        setLogoUrl(data.data.logo_url);
        setLogoFile(null);
        setLogoPreview(null);
        Swal.fire("Success", "Logo uploaded", "success");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      Swal.fire("Error", "Failed to upload logo", "error");
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleUploadCover = async () => {
    if (!coverImageFile || !affiliation) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("cover_image", coverImageFile);
      formData.append("affiliation_id", affiliation.id);

      const { data } = await api.post(
        `/affiliation-profiles/upload-cover?scope=${scope}&section=${section}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (data?.status === "success") {
        setCoverImageUrl(data.data.cover_image_url);
        setCoverImageFile(null);
        setCoverPreview(null);
        Swal.fire("Success", "Cover image uploaded", "success");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      Swal.fire("Error", "Failed to upload cover image", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!affiliation) return;

    setSaving(true);
    try {
      const payload = {
        ...form,
        affiliation_id: affiliation.id,
      };

      const { data } = await api.post(
        `/affiliation-profiles?scope=${scope}&section=${section}`,
        payload
      );

      if (data?.status === "success") {
        Swal.fire("Success", "Profile saved successfully", "success");
      }
    } catch (error) {
      console.error("Save failed:", error);
      const message =
        error.response?.data?.message || "Failed to save profile";
      Swal.fire("Error", message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!affiliation) return;

    const result = await Swal.fire({
      title: "Delete Profile?",
      text: "This will soft-delete the profile data. It can be restored later.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const { data } = await api.delete(
        `/affiliation-profiles/${affiliation.id}?scope=${scope}&section=${section}`
      );

      if (data?.status === "success") {
        setForm({ ...EMPTY_FORM });
        setCoverImageUrl(null);
        Swal.fire("Deleted", "Profile has been deleted", "success");
      }
    } catch (error) {
      Swal.fire("Error", "Failed to delete profile", "error");
    }
  };

  // --- Loading ---
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // --- LIST VIEW (super admin) ---
  if (view === "list" && isSuperAdmin) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
          <p className="text-sm text-gray-500 mt-1">
            Select an affiliation to edit its profile
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or code..."
            className="pl-10"
          />
        </div>

        {affiliations.filter(
          (aff) =>
            !search ||
            aff.name.toLowerCase().includes(search.toLowerCase()) ||
            aff.code.toLowerCase().includes(search.toLowerCase())
        ).length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              {affiliations.length === 0
                ? "No affiliations found for this category."
                : "No affiliations match your search."}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {affiliations.filter(
              (aff) =>
                !search ||
                aff.name.toLowerCase().includes(search.toLowerCase()) ||
                aff.code.toLowerCase().includes(search.toLowerCase())
            ).map((aff) => (
              <Card
                key={aff.id}
                className="cursor-pointer hover:border-primary/40 hover:shadow-md transition-all"
                onClick={() => handleSelectAffiliation(aff)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {aff.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-0.5">
                        Code: {aff.code}
                      </p>
                    </div>
                    <Pencil className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  // --- NO AFFILIATION (non-super admin) ---
  if (!affiliation) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>{pageTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">
              No affiliation found for your account. Please contact the
              administrator.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- EDIT VIEW ---
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isSuperAdmin && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBackToList}
              className="flex-shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {affiliation.name} ({affiliation.code})
            </p>
          </div>
        </div>
      </div>

      {/* Logo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Logo
          </CardTitle>
          <CardDescription>
            Upload a logo for this affiliation profile (max 5MB, JPG/PNG/WebP/SVG)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(logoPreview || logoUrl) && (
              <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-gray-100 border">
                <img
                  src={logoPreview || logoUrl}
                  alt="Logo"
                  className="w-full h-full object-contain p-2"
                />
              </div>
            )}
            <div className="flex items-center gap-3">
              <Input
                type="file"
                accept="image/jpeg,image/png,image/jpg,image/webp,image/svg+xml"
                onChange={handleLogoChange}
                className="max-w-xs"
              />
              {logoFile && (
                <Button
                  onClick={handleUploadLogo}
                  disabled={uploadingLogo}
                  size="sm"
                >
                  {uploadingLogo ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Upload className="w-4 h-4 mr-2" />
                  )}
                  Upload
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cover Image */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Cover Image
          </CardTitle>
          <CardDescription>
            Upload a cover photo for the profile page (max 5MB, JPG/PNG/WebP)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(coverPreview || coverImageUrl) && (
              <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={coverPreview || coverImageUrl}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex items-center gap-3">
              <Input
                type="file"
                accept="image/jpeg,image/png,image/jpg,image/webp"
                onChange={handleCoverImageChange}
                className="max-w-xs"
              />
              {coverImageFile && (
                <Button
                  onClick={handleUploadCover}
                  disabled={uploading}
                  size="sm"
                >
                  {uploading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Upload className="w-4 h-4 mr-2" />
                  )}
                  Upload
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Short Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Short Profile</CardTitle>
          <CardDescription>
            Description and key information about the program
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="sub_title">Sub Title</Label>
            <Input
              id="sub_title"
              value={form.sub_title}
              onChange={(e) => handleChange("sub_title", e.target.value)}
              placeholder="e.g. PPDS I Orthopaedi & Traumatologi"
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Displayed as subtitle on the public detail page
            </p>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={6}
              placeholder="Write a short profile description..."
              className="mt-1"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="accreditation">Accreditation</Label>
              <Input
                id="accreditation"
                value={form.accreditation}
                onChange={(e) =>
                  handleChange("accreditation", e.target.value)
                }
                placeholder="e.g. A - LAM PT Kes"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="established_year">Established Year</Label>
              <Input
                id="established_year"
                value={form.established_year}
                onChange={(e) =>
                  handleChange("established_year", e.target.value)
                }
                placeholder="e.g. 1960"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="program_duration">Program Duration</Label>
              <Input
                id="program_duration"
                value={form.program_duration}
                onChange={(e) =>
                  handleChange("program_duration", e.target.value)
                }
                placeholder="e.g. 8 Semester"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                value={form.capacity}
                onChange={(e) => handleChange("capacity", e.target.value)}
                placeholder="e.g. 20 per tahun"
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>
            Address, phone, email, and website for this affiliation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="contact_address">Address</Label>
            <Textarea
              id="contact_address"
              value={form.contact_address}
              onChange={(e) =>
                handleChange("contact_address", e.target.value)
              }
              rows={3}
              placeholder="Full address..."
              className="mt-1"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contact_phone">Phone</Label>
              <Input
                id="contact_phone"
                value={form.contact_phone}
                onChange={(e) =>
                  handleChange("contact_phone", e.target.value)
                }
                placeholder="e.g. +62 21 391 0123"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="contact_email">Email</Label>
              <Input
                id="contact_email"
                type="email"
                value={form.contact_email}
                onChange={(e) =>
                  handleChange("contact_email", e.target.value)
                }
                placeholder="e.g. ortopedi@ui.ac.id"
                className="mt-1"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="contact_website">Website</Label>
            <Input
              id="contact_website"
              value={form.contact_website}
              onChange={(e) =>
                handleChange("contact_website", e.target.value)
              }
              placeholder="e.g. https://www.ortopedi-fkui.com"
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Registration Info */}
      <Card>
        <CardHeader>
          <CardTitle>Registration Information</CardTitle>
          <CardDescription>
            Information about how to register for this program
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="registration_info">Registration Info</Label>
            <Textarea
              id="registration_info"
              value={form.registration_info}
              onChange={(e) =>
                handleChange("registration_info", e.target.value)
              }
              rows={4}
              placeholder="Registration details, links, periods..."
              className="mt-1"
            />
          </div>
          <div className="mt-4">
            <Label htmlFor="registration_url">Registration URL</Label>
            <Input
              id="registration_url"
              value={form.registration_url}
              onChange={(e) =>
                handleChange("registration_url", e.target.value)
              }
              placeholder="e.g. https://registrasi.ortopedi.ac.id"
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Link to the registration page (will be displayed as a button on the public detail page)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pb-8">
        <Button variant="destructive" onClick={handleDelete} size="sm">
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Profile
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Save Profile
        </Button>
      </div>
    </div>
  );
}
