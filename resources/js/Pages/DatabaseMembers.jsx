import { Link } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, Users, GraduationCap, UserX, ChevronLeft, ChevronRight } from "lucide-react";
import HomepageLayout from "../Layouts/HomepageLayout";
import api from "@/api/axios";

export default function DatabaseMembers() {
  const [members, setMembers] = useState([]);
  const [affiliations, setAffiliations] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 12,
  });

  const [stats, setStats] = useState({ 
    total: 0, 
    active: 0, 
    graduated: 0, 
    leave: 0,
    resident: 0,
    fellow: 0,
    trainee: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    status: "",
    search: "",
    organization_type: "",
    affiliation_id: "",
    per_page: "12",
  });

  const fetchMembers = useCallback(
    async ({ page = 1 } = {}) => {
      try {
        setLoading(true);
        setError(null);

        const params = {
          page,
          per_page: Number(filters.per_page || 12),
        };

        if (filters.status) params.status = filters.status;
        if (filters.search) params.search = filters.search;
        if (filters.organization_type) params.organization_type = filters.organization_type;
        if (filters.affiliation_id) params.affiliation_id = filters.affiliation_id;

        const response = await api.get("/public/database-members/all", {
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
          per_page: paginator?.per_page || Number(filters.per_page || 12),
        });

        const st = response.data?.stats;
        if (st && typeof st === "object") {
          setStats({
            total: Number(st.total || 0),
            active: Number(st.active || 0),
            graduated: Number(st.graduated || 0),
            leave: Number(st.leave || 0),
            resident: Number(st.resident || 0),
            fellow: Number(st.fellow || 0),
            trainee: Number(st.trainee || 0),
          });
        }
      } catch (e) {
        setMembers([]);
        setError("Terjadi kesalahan saat mengambil data.");
      } finally {
        setLoading(false);
      }
    },
    [filters.per_page, filters.search, filters.status, filters.organization_type, filters.affiliation_id]
  );

  useEffect(() => {
    const fetchAffiliations = async () => {
      try {
        const response = await api.get("/public/affiliations", {
          params: { per_page: 1000 },
          headers: { "X-Skip-Auth-Redirect": "1" },
        });
        if (response.data?.status === "success") {
          const data = response.data.data?.data || response.data.data || [];
          setAffiliations(Array.isArray(data) ? data : []);
        }
      } catch (e) {
        console.error("Failed to fetch affiliations", e);
      }
    };
    fetchAffiliations();
  }, []);

  useEffect(() => {
    fetchMembers({ page: 1 });
  }, [fetchMembers]);

  const genderLabel = (v) => {
    if (v === "male") return "L";
    if (v === "female") return "P";
    return "-";
  };

  const statusLabel = (v) => {
    if (v === "active") return "Aktif";
    if (v === "graduated") return "Lulus";
    if (v === "leave") return "Cuti";
    return "-";
  };

  const statusPillClass = (v) => {
    if (v === "active") return "bg-emerald-100 text-emerald-700";
    if (v === "graduated") return "bg-blue-100 text-blue-700";
    if (v === "leave") return "bg-yellow-100 text-yellow-700";
    return "bg-gray-100 text-gray-700";
  };

  const orgTypeLabel = (v) => {
    if (v === "resident") return "Residen";
    if (v === "fellow") return "Fellow";
    if (v === "trainee") return "Trainee";
    return "-";
  };

  const getPhotoUrl = (photoPath) => {
    if (!photoPath) return null;
    if (photoPath.startsWith('http://') || photoPath.startsWith('https://')) {
      return photoPath;
    }
    return `${window.location.origin}/${photoPath.replace(/^\//, '')}`;
  };

  return (
    <HomepageLayout>
      {/* Breadcrumb */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-white text-sm">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <span>/</span>
            <span>Database Member</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold" style={{ color: "#254D95" }}>
              Database Member
            </h1>
            <p className="text-gray-600 mt-2">Daftar lengkap member Residen, Fellow, dan Trainee</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Member</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Residen</p>
                <p className="text-2xl font-bold text-gray-900">{stats.resident}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-emerald-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Fellow</p>
                <p className="text-2xl font-bold text-gray-900">{stats.fellow}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-purple-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Trainee</p>
                <p className="text-2xl font-bold text-gray-900">{stats.trainee}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cari Member</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Nama atau kode member..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Organization Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipe</label>
                <select
                  value={filters.organization_type}
                  onChange={(e) => setFilters({ ...filters, organization_type: e.target.value })}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                    backgroundSize: '1.25rem 1.25rem'
                  }}
                >
                  <option value="">Semua Tipe</option>
                  <option value="resident">Residen</option>
                  <option value="fellow">Fellow</option>
                  <option value="trainee">Trainee</option>
                </select>
              </div>

              {/* Affiliation Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Afiliasi</label>
                <select
                  value={filters.affiliation_id}
                  onChange={(e) => setFilters({ ...filters, affiliation_id: e.target.value })}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                    backgroundSize: '1.25rem 1.25rem'
                  }}
                >
                  <option value="">Semua Afiliasi</option>
                  {affiliations.map((affiliation) => (
                    <option key={affiliation.id} value={affiliation.id}>
                      {affiliation.code || affiliation.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                    backgroundSize: '1.25rem 1.25rem'
                  }}
                >
                  <option value="">Semua Status</option>
                  <option value="active">Aktif</option>
                  <option value="graduated">Lulus</option>
                  <option value="leave">Cuti</option>
                </select>
              </div>
            </div>
          </div>

          {/* Members Table */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-600">{error}</p>
            </div>
          ) : members.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <UserX className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Tidak ada data member</p>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Foto
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kode Member
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nama
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tipe
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Afiliasi
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Spesialisasi
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Gender
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Achievement
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {members.map((member) => (
                        <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
                              {member.photo ? (
                                <img
                                  src={getPhotoUrl(member.photo)}
                                  alt={member.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                              ) : (
                                <span className="text-blue-600 font-bold text-sm">
                                  {member.name?.charAt(0)?.toUpperCase() || '?'}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{member.member_code}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{member.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                              {orgTypeLabel(member.organization_type)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {member.affiliation ? (member.affiliation.code || member.affiliation.name) : '-'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 max-w-xs truncate">
                              {member.specialization || '-'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{genderLabel(member.gender)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-xs px-2 py-1 rounded-full ${statusPillClass(member.status)}`}>
                              {statusLabel(member.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            -
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              {pagination.last_page > 1 && (
                <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  <div className="text-sm text-gray-600">
                    Menampilkan {((pagination.current_page - 1) * pagination.per_page) + 1} - {Math.min(pagination.current_page * pagination.per_page, pagination.total)} dari {pagination.total} member
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => fetchMembers({ page: pagination.current_page - 1 })}
                      disabled={pagination.current_page === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>
                    <span className="text-sm text-gray-600">
                      Page {pagination.current_page} of {pagination.last_page}
                    </span>
                    <button
                      onClick={() => fetchMembers({ page: pagination.current_page + 1 })}
                      disabled={pagination.current_page === pagination.last_page}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </HomepageLayout>
  );
}
