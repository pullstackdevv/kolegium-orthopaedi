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
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [achModalMember, setAchModalMember] = useState(null);

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

  const fetchAchievements = useCallback(async () => {
    if (!affiliation?.id) return;
    try {
      const res = await api.get("/public/member-achievements", {
        params: { affiliation_id: affiliation.id, organization_type: orgType },
        headers: { "X-Skip-Auth-Redirect": "1" },
      });
      if (res.data?.status === "success") {
        setAchievements(Array.isArray(res.data.data) ? res.data.data : []);
      }
    } catch (e) {
      console.error("Failed to fetch achievements", e);
    }
  }, [affiliation?.id, orgType]);

  useEffect(() => {
    fetchMembers({ page: 1 });
    fetchAchievements();
  }, [fetchMembers, fetchAchievements]);

  const genderLabel = (v) => {
    if (v === "male") return "Male";
    if (v === "female") return "Female";
    return "-";
  };

  const calculateSemester = (entryDate) => {
    if (!entryDate) return "-";
    const entry = new Date(entryDate);
    if (Number.isNaN(entry.getTime())) return "-";
    const now = new Date();
    const diffMonths = (now.getFullYear() - entry.getFullYear()) * 12 + (now.getMonth() - entry.getMonth());
    const semester = Math.max(1, Math.ceil(diffMonths / 6));
    return `Semester ${semester}`;
  };

  const achievementsByMember = useMemo(() => {
    const map = {};
    achievements.forEach((ach) => {
      const mid = ach.database_member_id;
      if (!map[mid]) map[mid] = [];
      map[mid].push(ach);
    });
    return map;
  }, [achievements]);

  const statusLabel = (v) => {
    if (v === "active") return "Active";
    if (v === "graduated") return "Graduated";
    if (v === "leave") return "On Leave";
    return "-";
  };

  const statusPillClass = (v) => {
    if (v === "active") return "bg-emerald-100 text-emerald-700";
    if (v === "graduated") return "bg-blue-100 text-blue-700";
    if (v === "leave") return "bg-yellow-100 text-yellow-700";
    return "bg-gray-100 text-gray-700";
  };

  const title = type === "ppds1" ? "PPDS1 Resident Data" : "Subspecialist Trainee Data";

  return (
    <HomepageLayout>
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-white text-sm">
            <Link href="/" className="hover:underline">
              Home
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
                <div className="text-sm text-gray-600">Total Members</div>
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
                <div className="text-sm text-gray-600">Active This Semester</div>
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
                  {achievements.length}
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
                <div className="text-xs font-semibold text-gray-700 mb-1">Study Program</div>
                <div className="h-10 px-3 rounded-md border border-gray-200 flex items-center text-sm text-gray-700 bg-gray-50">
                  {affiliation?.name || "-"}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-gray-700 mb-1">Semester</div>
                <div className="h-10 px-3 rounded-md border border-gray-200 flex items-center text-sm text-gray-500 bg-gray-50">
                  All
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-gray-700 mb-1">Status</div>
                <select
                  className="h-10 w-full px-3 rounded-md border border-gray-200 text-sm"
                  value={filters.status}
                  onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))}
                >
                  <option value="">All</option>
                  <option value="active">Active</option>
                  <option value="graduated">Graduated</option>
                  <option value="leave">On Leave</option>
                </select>
              </div>

              <div>
                <div className="text-xs font-semibold text-gray-700 mb-1">Search Member</div>
                <div className="relative">
                  <input
                    className="h-10 w-full pl-10 pr-3 rounded-md border border-gray-200 text-sm"
                    placeholder="Search name / ID number"
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
                Apply
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold" style={{ color: "#254D95" }}>
                Member List
              </h2>
              <div className="text-sm text-gray-600">
                Showing {members.length} of {pagination.total} members
              </div>
            </div>

            {loading ? (
              <div className="p-8 text-sm text-gray-600">Loading data...</div>
            ) : error ? (
              <div className="p-8 text-sm text-red-600">{error}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left text-sm font-semibold text-gray-700 px-5 py-3">No</th>
                      <th className="text-left text-sm font-semibold text-gray-700 px-5 py-3">Photo</th>
                      <th className="text-left text-sm font-semibold text-gray-700 px-5 py-3">Name</th>
                      <th className="text-left text-sm font-semibold text-gray-700 px-5 py-3">Gender</th>
                      {type === "ppds1" && <th className="text-left text-sm font-semibold text-gray-700 px-5 py-3">Semester</th>}
                      <th className="text-left text-sm font-semibold text-gray-700 px-5 py-3">Status</th>
                      {type !== "ppds1" && <th className="text-left text-sm font-semibold text-gray-700 px-5 py-3">Specialization</th>}
                      <th className="text-left text-sm font-semibold text-gray-700 px-5 py-3">Achievements</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((m, idx) => (
                      <tr key={m.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50/40"}>
                        <td className="px-5 py-3 text-sm text-gray-700">{(pagination.current_page - 1) * pagination.per_page + idx + 1}</td>
                        <td className="px-5 py-3">
                          <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                            {m.photo ? (
                              <img src={m.photo} alt={m.name} className="h-full w-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                            ) : (
                              <Icon icon="mdi:account" className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-900">
                          <div className="font-medium">{m.name}</div>
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-700">{genderLabel(m.gender)}</td>
                        {type === "ppds1" && <td className="px-5 py-3 text-sm text-gray-700">{calculateSemester(m.entry_date)}</td>}
                        <td className="px-5 py-3">
                          <span className={`text-xs font-semibold px-3 py-1 rounded ${statusPillClass(m.status)}`}>{statusLabel(m.status)}</span>
                        </td>
                        {type !== "ppds1" && <td className="px-5 py-3 text-sm text-gray-700">{m.specialization || "-"}</td>}
                        <td className="px-5 py-3">
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
                            <span className="text-xs text-gray-400">0</span>
                          )}
                        </td>
                      </tr>
                    ))}

                    {members.length === 0 ? (
                      <tr>
                        <td className="px-5 py-6 text-sm text-gray-600" colSpan={10}>
                          No data available.
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

      {achModalMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setAchModalMember(null)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-bold" style={{ color: "#254D95" }}>Achievements</h3>
                <p className="text-sm text-gray-600">{achModalMember.name}</p>
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
                <div className="text-sm text-gray-500 text-center py-4">Belum ada achievement.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </HomepageLayout>
  );
}
