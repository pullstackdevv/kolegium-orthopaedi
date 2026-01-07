import { Link } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import HomepageLayout from "../../Layouts/HomepageLayout";
import api from "@/api/axios";

export default function DatabaseMembersLanding({ type, affiliation }) {
  const orgType = useMemo(() => {
    if (type === "ppds1") return "resident";
    if (type === "subspesialis") return "trainee";
    return null;
  }, [type]);

  const [members, setMembers] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 10,
  });

  const [stats, setStats] = useState({ total: 0, active: 0, graduated: 0, leave: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    status: "",
    search: "",
    per_page: "10",
  });

  const fetchMembers = useCallback(
    async ({ page = 1 } = {}) => {
      if (!orgType) return;
      if (!affiliation?.id) return;

      try {
        setLoading(true);
        setError(null);

        const params = {
          organization_type: orgType,
          affiliation_id: affiliation.id,
          page,
          per_page: Number(filters.per_page || 10),
        };

        if (filters.status) params.status = filters.status;
        if (filters.search) params.search = filters.search;

        const response = await api.get("/public/database-members", {
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

        const st = response.data?.stats;
        if (st && typeof st === "object") {
          setStats({
            total: Number(st.total || 0),
            active: Number(st.active || 0),
            graduated: Number(st.graduated || 0),
            leave: Number(st.leave || 0),
          });
        }
      } catch (e) {
        setMembers([]);
        setError("Terjadi kesalahan saat mengambil data.");
      } finally {
        setLoading(false);
      }
    },
    [affiliation?.id, filters.per_page, filters.search, filters.status, orgType]
  );

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

  const title = type === "ppds1" ? "Data Residen PPDS1" : "Data Trainee Subspesialis";

  return (
    <HomepageLayout>
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-white text-sm">
            <Link href="/" className="hover:underline">
              Beranda
            </Link>
            <span>/</span>
            <Link href={type === "ppds1" ? "/profile-study-program/ppds1" : "/profile-study-program/subspesialis"} className="hover:underline">
              {type === "ppds1" ? "PPDS 1" : "Subspesialis"}
            </Link>
            <span>/</span>
            <Link href={`/profile-study-program/${type}/${affiliation?.id}`} className="hover:underline">
              {affiliation?.name || "Detail"}
            </Link>
            <span>/</span>
            <span>Data Base</span>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold" style={{ color: "#254D95" }}>
              {title} {affiliation?.name ? `- ${affiliation.name}` : ""}
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Total Residen</div>
                <div className="text-2xl font-bold" style={{ color: "#254D95" }}>
                  {stats.total}
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Icon icon="mdi:account-group" className="w-6 h-6 text-blue-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Aktif Semester Ini</div>
                <div className="text-2xl font-bold" style={{ color: "#254D95" }}>
                  {stats.active}
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <Icon icon="mdi:check-circle" className="w-6 h-6 text-emerald-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Achievements</div>
                <div className="text-2xl font-bold" style={{ color: "#254D95" }}>
                  {stats.graduated}
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <Icon icon="mdi:trophy" className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <div className="text-xs font-semibold text-gray-700 mb-1">Program Studi</div>
                <div className="h-10 px-3 rounded-md border border-gray-200 flex items-center text-sm text-gray-700 bg-gray-50">
                  {affiliation?.name || "-"}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-gray-700 mb-1">Semester</div>
                <div className="h-10 px-3 rounded-md border border-gray-200 flex items-center text-sm text-gray-500 bg-gray-50">
                  Semua
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-gray-700 mb-1">Status</div>
                <select
                  className="h-10 w-full px-3 rounded-md border border-gray-200 text-sm"
                  value={filters.status}
                  onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))}
                >
                  <option value="">Semua</option>
                  <option value="active">Aktif</option>
                  <option value="graduated">Lulus</option>
                  <option value="leave">Cuti</option>
                </select>
              </div>

              <div>
                <div className="text-xs font-semibold text-gray-700 mb-1">Cari Residen</div>
                <div className="relative">
                  <input
                    className="h-10 w-full pl-10 pr-3 rounded-md border border-gray-200 text-sm"
                    placeholder="Cari nama / nomor identitas"
                    value={filters.search}
                    onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        fetchMembers({ page: 1 });
                      }
                    }}
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Icon icon="mdi:magnify" className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                type="button"
                className="h-9 px-4 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
                onClick={() => fetchMembers({ page: 1 })}
              >
                Terapkan
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold" style={{ color: "#254D95" }}>
                Daftar Residen
              </h2>
              <div className="text-sm text-gray-600">
                Menampilkan {members.length} dari {pagination.total} residen
              </div>
            </div>

            {loading ? (
              <div className="p-8 text-sm text-gray-600">Memuat data...</div>
            ) : error ? (
              <div className="p-8 text-sm text-red-600">{error}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left text-sm font-semibold text-gray-700 px-5 py-3">No</th>
                      <th className="text-left text-sm font-semibold text-gray-700 px-5 py-3">Residen</th>
                      <th className="text-left text-sm font-semibold text-gray-700 px-5 py-3">Prodi</th>
                      <th className="text-left text-sm font-semibold text-gray-700 px-5 py-3">Gender</th>
                      <th className="text-left text-sm font-semibold text-gray-700 px-5 py-3">Status</th>
                      <th className="text-left text-sm font-semibold text-gray-700 px-5 py-3">Spesialisasi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((m, idx) => (
                      <tr key={m.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50/40"}>
                        <td className="px-5 py-3 text-sm text-gray-700">{(pagination.current_page - 1) * pagination.per_page + idx + 1}</td>
                        <td className="px-5 py-3 text-sm text-gray-900">
                          <div className="font-medium">{m.name}</div>
                          <div className="text-xs text-gray-500">{m.member_code || "-"}</div>
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-700">{affiliation?.name || "-"}</td>
                        <td className="px-5 py-3 text-sm text-gray-700">{genderLabel(m.gender)}</td>
                        <td className="px-5 py-3">
                          <span className={`text-xs font-semibold px-3 py-1 rounded ${statusPillClass(m.status)}`}>{statusLabel(m.status)}</span>
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-700">{m.specialization || "-"}</td>
                      </tr>
                    ))}

                    {members.length === 0 ? (
                      <tr>
                        <td className="px-5 py-6 text-sm text-gray-600" colSpan={6}>
                          Belum ada data.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
              <div className="text-sm text-gray-600">
                Page {pagination.current_page} of {pagination.last_page}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="h-9 w-9 rounded-full bg-blue-50 text-blue-700 disabled:opacity-50"
                  disabled={pagination.current_page <= 1}
                  onClick={() => fetchMembers({ page: pagination.current_page - 1 })}
                >
                  <Icon icon="mdi:chevron-left" className="w-5 h-5 mx-auto" />
                </button>
                <button
                  type="button"
                  className="h-9 w-9 rounded-full bg-blue-50 text-blue-700 disabled:opacity-50"
                  disabled={pagination.current_page >= pagination.last_page}
                  onClick={() => fetchMembers({ page: pagination.current_page + 1 })}
                >
                  <Icon icon="mdi:chevron-right" className="w-5 h-5 mx-auto" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </HomepageLayout>
  );
}
