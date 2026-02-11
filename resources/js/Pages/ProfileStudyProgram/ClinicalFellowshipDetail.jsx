import { useState, useEffect, useCallback } from "react";
import { Link } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { MapPin, Phone, Globe, Search, ChevronLeft, ChevronRight } from "lucide-react";
import HomepageLayout from "../../Layouts/HomepageLayout";
import api from "@/api/axios";

const DEFAULT_LOGO = "/assets/images/logo-univ/FK-UI.png";
const DEFAULT_PHOTO = "/assets/images/university/FK-UI.png";

const STATUS_COLORS = {
  active: "bg-red-500",
  graduated: "bg-green-500",
  leave: "bg-yellow-500",
};

export default function ClinicalFellowshipDetail({ fellowship }) {
  const data = fellowship || {};

  // Fellows list state
  const [fellows, setFellows] = useState([]);
  const [fellowsLoading, setFellowsLoading] = useState(false);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0, per_page: 10 });
  const [filters, setFilters] = useState({
    status: "",
    search: "",
  });

  const fetchFellows = useCallback(async (page = 1) => {
    setFellowsLoading(true);
    try {
      const params = {
        organization_type: "fellow",
        per_page: pagination.per_page,
        page,
        affiliation_id: data.id,
      };
      if (filters.status) params.status = filters.status;
      if (filters.search) params.search = filters.search;

      const response = await api.get("/public/database-members/all", {
        params,
        headers: { "X-Skip-Auth-Redirect": "1" },
      });

      if (response.data?.status === "success") {
        const d = response.data.data;
        setFellows(d.data || []);
        setPagination({
          current_page: d.current_page || 1,
          last_page: d.last_page || 1,
          total: d.total || 0,
          per_page: d.per_page || 10,
        });
      }
    } catch (e) {
      console.error("Failed to fetch fellows", e);
    } finally {
      setFellowsLoading(false);
    }
  }, [filters, pagination.per_page, data.id]);

  useEffect(() => {
    if (data.id) fetchFellows(1);
  }, [filters, data.id]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handlePageChange = (page) => {
    fetchFellows(page);
    window.scrollTo({ top: document.getElementById("fellows-table")?.offsetTop - 100, behavior: "smooth" });
  };

  const startIndex = (pagination.current_page - 1) * pagination.per_page;

  const resolvedLogo = data.logo || DEFAULT_LOGO;
  const resolvedPhoto = data.image || DEFAULT_PHOTO;

  return (
    <HomepageLayout>
      {/* Breadcrumb */}
      <section className="bg-gradient-to-r from-primary to-secondary py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-white text-sm">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <Link href="/profile-study-program/clinical-fellowship" className="hover:underline">Clinical Fellowship</Link>
            <span>/</span>
            <span>{data.name}</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header: Image + Info */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-0">
              {/* Cover Image */}
              <div className="w-full md:w-2/5 h-64 flex-shrink-0 overflow-hidden">
                <img
                  src={resolvedPhoto}
                  alt={data.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { if (e.target.src !== DEFAULT_PHOTO) e.target.src = DEFAULT_PHOTO; }}
                />
              </div>
              {/* Info */}
              <div className="flex-1 p-8 flex flex-col justify-center">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-white border-4 border-primary flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <img
                      src={resolvedLogo}
                      alt="Logo"
                      className="w-full h-full object-cover"
                      onError={(e) => { if (e.target.src !== DEFAULT_LOGO) e.target.src = DEFAULT_LOGO; }}
                    />
                  </div>
                  <div>
                    <p className="text-sm text-primary font-semibold mb-1">{data.subTitle || "Clinical Fellowship"}</p>
                    <h1 className="text-2xl md:text-3xl font-bold text-primary leading-tight">{data.name}</h1>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{data.stats?.fellowActive ?? 0}</div>
                    <div className="text-sm text-gray-600">Fellow Active</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{data.stats?.staffPendidik ?? 0}</div>
                    <div className="text-sm text-gray-600">Teaching Staff</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{data.stats?.rsPendidikan ?? 0}</div>
                    <div className="text-sm text-gray-600">Teaching Hospitals</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row: Short Profile + Secretariat Contact */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Short Profile */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                <Icon icon="mdi:file-document-outline" className="w-5 h-5" />
                Short Profile
              </h2>
              {data.description ? (
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {data.description}
                </div>
              ) : (
                <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center text-sm text-gray-500">
                  No profile description available yet.
                </div>
              )}
            </div>

            {/* Secretariat Contact */}
            <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-primary mb-4">Secretariat Contact</h2>
              <div className="space-y-4">
                {data.contact?.address && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-primary font-semibold mb-1">Address</p>
                    <p className="text-xs text-gray-700">{data.contact.address}</p>
                  </div>
                </div>
                )}
                {data.contact?.phone && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Phone className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-primary font-semibold mb-1">Phone</p>
                    <a href={`tel:${data.contact.phone}`} className="text-xs text-gray-700 hover:text-primary">
                      {data.contact.phone}
                    </a>
                  </div>
                </div>
                )}
                {data.contact?.website && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Globe className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-primary font-semibold mb-1">Website</p>
                    <a href={data.contact.website} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline break-all">
                      {data.contact.website}
                    </a>
                  </div>
                </div>
                )}
              </div>
            </div>
          </div>

          {/* Row: Clinical Fellowship Staff + Registration */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Clinical Fellowship Staff (orgStructure / teacherStaff) */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-primary mb-6 flex items-center gap-2">
                <Icon icon="mdi:hospital-building" className="w-5 h-5" />
                Clinical Fellowship {data.name}
              </h2>
              {(data.teacherStaff?.length > 0 || data.orgStructure?.length > 0) ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {(data.teacherStaff?.length > 0 ? data.teacherStaff : data.orgStructure).map((member) => (
                    <div key={member.id} className="flex items-start gap-3">
                      {member.photo ? (
                        <img
                          src={member.photo}
                          alt={member.name}
                          className="w-12 h-12 rounded-full object-cover flex-shrink-0 border-2 border-primary/20"
                          onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                        />
                      ) : null}
                      <div className={`w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-primary/20 ${member.photo ? 'hidden' : ''}`}>
                        <Icon icon="mdi:account" className="w-7 h-7 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-primary leading-tight">{member.name}</h3>
                        {(member.division || member.position) && (
                          <p className="text-xs text-gray-600 mt-0.5">{member.division || member.position}</p>
                        )}
                        {member.institution_origin && (
                          <p className="text-xs text-gray-500 mt-0.5">{member.institution_origin}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center text-sm text-gray-500">
                  No staff data available yet.
                </div>
              )}
            </div>

            {/* Registration */}
            <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-primary mb-4">Registration</h2>
              {data.registration?.info ? (
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {data.registration.info}
                </div>
              ) : (
                <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center text-sm text-gray-500">
                  No registration information available yet.
                </div>
              )}
              {data.registration?.url && (
                <div className="mt-4">
                  <a
                    href={data.registration.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline break-all text-sm"
                  >
                    {data.registration.url}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                >
                  <option value="">All</option>
                  <option value="active">Active</option>
                  <option value="graduated">Graduated</option>
                  <option value="leave">Leave</option>
                </select>
              </div>

              {/* Search */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Fellow
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange("search", e.target.value)}
                    placeholder="Search by name..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Fellows Table */}
          <div id="fellows-table" className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-primary">
                  Clinical Fellowship Students
                </h2>
                <p className="text-sm text-gray-600">
                  Showing {fellows.length > 0 ? startIndex + 1 : 0}-{startIndex + fellows.length} of {pagination.total} fellows
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">No</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Fellow</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Affiliation</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Gender</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {fellowsLoading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500">
                        Loading...
                      </td>
                    </tr>
                  ) : fellows.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500">
                        No fellow data found.
                      </td>
                    </tr>
                  ) : (
                    fellows.map((fellow, index) => (
                      <tr key={fellow.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {startIndex + index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {fellow.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {fellow.affiliation?.name || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {fellow.gender || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`${STATUS_COLORS[fellow.status] || "bg-gray-400"} text-white px-3 py-1 rounded-full text-xs font-semibold capitalize`}>
                            {fellow.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.last_page > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.current_page - 1)}
                  disabled={pagination.current_page === 1}
                  className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {Array.from({ length: pagination.last_page }, (_, i) => i + 1)
                  .filter((page) => {
                    if (pagination.last_page <= 5) return true;
                    if (page === 1 || page === pagination.last_page) return true;
                    return Math.abs(page - pagination.current_page) <= 1;
                  })
                  .map((page, idx, arr) => (
                    <span key={page} className="flex items-center gap-2">
                      {idx > 0 && arr[idx - 1] !== page - 1 && (
                        <span className="text-gray-400">...</span>
                      )}
                      <button
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                          pagination.current_page === page
                            ? "bg-primary text-white"
                            : "bg-primary/10 text-primary hover:bg-primary/20"
                        }`}
                      >
                        {page}
                      </button>
                    </span>
                  ))}

                <button
                  onClick={() => handlePageChange(pagination.current_page + 1)}
                  disabled={pagination.current_page === pagination.last_page}
                  className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            )}
          </div>

        </div>
      </section>
    </HomepageLayout>
  );
}
