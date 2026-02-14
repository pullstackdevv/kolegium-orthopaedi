import { useEffect, useState } from "react";
import { ClipboardList, Search, Filter, ChevronLeft, ChevronRight, AlertTriangle, Smile, Meh, Frown, HelpCircle } from "lucide-react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import api from "@/api/axios";

const RISK_COLORS = {
  low: "bg-green-100 text-green-800",
  mild: "bg-yellow-100 text-yellow-800",
  moderate: "bg-orange-100 text-orange-800",
  high: "bg-red-100 text-red-800",
};

const MOOD_ICONS = {
  happy: { icon: Smile, color: "text-green-600" },
  normal: { icon: Meh, color: "text-blue-600" },
  worry: { icon: Meh, color: "text-yellow-600" },
  depressed: { icon: Frown, color: "text-orange-600" },
  help_me: { icon: AlertTriangle, color: "text-red-600" },
};

function WellbeingSurveyCms() {
  const [surveys, setSurveys] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [filters, setFilters] = useState({ risk_level: "", search: "" });
  const [selectedSurvey, setSelectedSurvey] = useState(null);

  const fetchSurveys = async (page = 1) => {
    try {
      setLoading(true);
      const params = { page, per_page: 15 };
      if (filters.risk_level) params.risk_level = filters.risk_level;

      const response = await api.get("/wellbeing-surveys", { params });
      if (response.data.status === "success") {
        setSurveys(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error("Error fetching surveys:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get("/wellbeing-surveys/stats");
      if (response.data.status === "success") {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    fetchSurveys();
    fetchStats();
  }, []);

  useEffect(() => {
    fetchSurveys(1);
  }, [filters.risk_level]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredSurveys = surveys.filter((s) => {
    if (!filters.search) return true;
    const q = filters.search.toLowerCase();
    return (
      (s.member_name && s.member_name.toLowerCase().includes(q)) ||
      (s.member_code && s.member_code.toLowerCase().includes(q)) ||
      (s.affiliation?.name && s.affiliation.name.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <ClipboardList className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Well-Being Survey</h1>
            <p className="text-sm text-gray-500">View survey submissions and risk analytics</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Total Responses</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total || 0}</p>
          </div>
          <div className="bg-white rounded-xl border border-green-200 p-4 shadow-sm">
            <p className="text-xs text-green-600 uppercase tracking-wide">Low Risk</p>
            <p className="text-2xl font-bold text-green-700 mt-1">{stats.by_risk?.low || 0}</p>
          </div>
          <div className="bg-white rounded-xl border border-yellow-200 p-4 shadow-sm">
            <p className="text-xs text-yellow-600 uppercase tracking-wide">Mild Risk</p>
            <p className="text-2xl font-bold text-yellow-700 mt-1">{stats.by_risk?.mild || 0}</p>
          </div>
          <div className="bg-white rounded-xl border border-orange-200 p-4 shadow-sm">
            <p className="text-xs text-orange-600 uppercase tracking-wide">Moderate Risk</p>
            <p className="text-2xl font-bold text-orange-700 mt-1">{stats.by_risk?.moderate || 0}</p>
          </div>
          <div className="bg-white rounded-xl border border-red-200 p-4 shadow-sm">
            <p className="text-xs text-red-600 uppercase tracking-wide">High Risk</p>
            <p className="text-2xl font-bold text-red-700 mt-1">{stats.by_risk?.high || 0}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, code, or affiliation..."
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filters.risk_level}
              onChange={(e) => setFilters((f) => ({ ...f, risk_level: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            >
              <option value="">All Risk Levels</option>
              <option value="low">Low</option>
              <option value="mild">Mild</option>
              <option value="moderate">Moderate</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">No</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Member</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Affiliation</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Mood</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Score</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Risk Level</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    Loading...
                  </td>
                </tr>
              ) : filteredSurveys.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400">
                    No survey data found.
                  </td>
                </tr>
              ) : (
                filteredSurveys.map((survey, idx) => {
                  const MoodIcon = MOOD_ICONS[survey.mood]?.icon || HelpCircle;
                  const moodColor = MOOD_ICONS[survey.mood]?.color || "text-gray-400";
                  return (
                    <tr key={survey.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-500">
                        {(pagination.current_page - 1) * 15 + idx + 1}
                      </td>
                      <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                        {formatDate(survey.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{survey.member_name || "Anonymous"}</div>
                        <div className="text-xs text-gray-400">{survey.member_code || "-"}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {survey.affiliation?.name || survey.affiliation_code || "-"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center" title={survey.mood}>
                          <MoodIcon className={`w-5 h-5 ${moodColor}`} />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center font-semibold text-gray-700">
                        {survey.mental_health_score ?? "-"}/5
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${RISK_COLORS[survey.risk_level] || "bg-gray-100 text-gray-600"}`}>
                          {survey.risk_level || "-"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => setSelectedSurvey(survey)}
                          className="text-primary hover:text-primary/80 text-xs font-medium underline"
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.last_page > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-500">
              Showing {(pagination.current_page - 1) * 15 + 1}–{Math.min(pagination.current_page * 15, pagination.total)} of {pagination.total}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchSurveys(pagination.current_page - 1)}
                disabled={pagination.current_page <= 1}
                className="p-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-600 font-medium">
                {pagination.current_page} / {pagination.last_page}
              </span>
              <button
                onClick={() => fetchSurveys(pagination.current_page + 1)}
                disabled={pagination.current_page >= pagination.last_page}
                className="p-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedSurvey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setSelectedSurvey(null)}>
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Survey Detail</h3>
                <button onClick={() => setSelectedSurvey(null)} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-400 text-xs">Member</p>
                    <p className="font-medium">{selectedSurvey.member_name || "Anonymous"}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Member Code</p>
                    <p className="font-medium">{selectedSurvey.member_code || "-"}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Date</p>
                    <p className="font-medium">{formatDate(selectedSurvey.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Affiliation</p>
                    <p className="font-medium">{selectedSurvey.affiliation?.name || "-"}</p>
                  </div>
                </div>

                <hr />

                <div>
                  <p className="text-gray-400 text-xs mb-2">Mood</p>
                  <span className="capitalize font-semibold text-gray-700">{selectedSurvey.mood || "-"}</span>
                </div>

                <div>
                  <p className="text-gray-400 text-xs mb-2">Questionnaire Responses</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {["burnout", "emotional_hardening", "depressed", "sleep_issue", "bullying", "discomfort"].map((field) => (
                      <div key={field} className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${selectedSurvey[field] ? "bg-red-500" : "bg-green-500"}`}></span>
                        <span className="capitalize text-gray-700">{field.replace(/_/g, " ")}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedSurvey.discomfort_note && (
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Discomfort Note</p>
                    <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{selectedSurvey.discomfort_note}</p>
                  </div>
                )}

                <hr />

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-400 text-xs">Mental Health Score</p>
                    <p className="text-xl font-bold text-gray-900">{selectedSurvey.mental_health_score ?? "-"}/5</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Risk Level</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold capitalize mt-1 ${RISK_COLORS[selectedSurvey.risk_level] || "bg-gray-100 text-gray-600"}`}>
                      {selectedSurvey.risk_level || "-"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CmsIndex() {
  return (
    <DashboardLayout>
      <WellbeingSurveyCms />
    </DashboardLayout>
  );
}
