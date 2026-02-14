import { useState, useEffect, useCallback } from "react";
import { Link } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { MapPin, Phone, Mail, Globe, ChevronRight, ChevronLeft, Search } from "lucide-react";
import HomepageLayout from "../../Layouts/HomepageLayout";
import api from "@/api/axios";

const STATUS_COLORS = {
  active: "bg-red-500",
  graduated: "bg-green-500",
  leave: "bg-yellow-500",
};

export default function PeerGroupDetail({ peerGroup }) {
  const peerGroupData = {
    id: null,
    name: "",
    fullName: "",
    code: "",
    description: "",
    image: null,
    logo: null,
    subTitle: "Peer Group",
    stats: {
      members: 0,
      activeMembers: 0,
    },
    contact: {
      address: "",
      email: "",
      phone: "",
      website: "",
    },
    registrationInfo: "",
    registrationUrl: "",
    orgStructure: [],
    ...peerGroup,
    orgStructure: peerGroup?.orgStructure || [],
  };

  const DEFAULT_LOGO = "/assets/images/logo-univ/FK-UI.png";
  const DEFAULT_PHOTO = "/assets/images/university/FK-UI.png";

  const resolvedLogo = peerGroupData.logo || DEFAULT_LOGO;
  const resolvedPhoto = peerGroupData.image || DEFAULT_PHOTO;

  // Dynamic members state
  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0, per_page: 10 });
  const [filters, setFilters] = useState({ status: "", search: "" });

  const fetchMembers = useCallback(async (page = 1) => {
    if (!peerGroupData.id) return;
    setMembersLoading(true);
    try {
      const params = {
        organization_type: "peer_group",
        affiliation_id: peerGroupData.id,
        per_page: pagination.per_page,
        page,
      };
      if (filters.status) params.status = filters.status;
      if (filters.search) params.search = filters.search;

      const response = await api.get("/public/database-members", {
        params,
        headers: { "X-Skip-Auth-Redirect": "1" },
      });

      if (response.data?.status === "success") {
        const d = response.data.data;
        setMembers(d.data || []);
        setPagination({
          current_page: d.current_page || 1,
          last_page: d.last_page || 1,
          total: d.total || 0,
          per_page: d.per_page || 10,
        });
      }
    } catch (e) {
      console.error("Failed to fetch peer group members", e);
    } finally {
      setMembersLoading(false);
    }
  }, [filters, pagination.per_page, peerGroupData.id]);

  useEffect(() => {
    if (peerGroupData.id) fetchMembers(1);
  }, [filters, peerGroupData.id]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handlePageChange = (page) => {
    fetchMembers(page);
    window.scrollTo({ top: document.getElementById("members-table")?.offsetTop - 100, behavior: "smooth" });
  };

  const startIndex = (pagination.current_page - 1) * pagination.per_page;

  return (
    <HomepageLayout>
      {/* Breadcrumb */}
      <section className="bg-gradient-to-r from-primary to-secondary py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-white text-sm">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <Link href="/peer-group" className="hover:underline">Peer Group</Link>
            <span>/</span>
            <span>{peerGroupData.name}</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Card with Image and Info */}
          <div className=" p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Left: Image */}
              <div className="w-full md:w-1/3 h-64 flex-shrink-0 overflow-hidden rounded-2xl">
                <img
                  src={resolvedPhoto}
                  alt={peerGroupData.fullName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    if (e.target.src !== DEFAULT_PHOTO) {
                      e.target.src = DEFAULT_PHOTO;
                    }
                  }}
                />
              </div>

              {/* Right: Info */}
              <div className="flex-1">
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-24 h-24 rounded-full bg-white border-8 border-primary flex items-center justify-center flex-shrink-0 overflow-hidden shadow-md">
                    <img
                      src={resolvedLogo}
                      alt={`${peerGroupData.name} logo`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        if (e.target.src !== DEFAULT_LOGO) {
                          e.target.src = DEFAULT_LOGO;
                        }
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-semibold text-primary mb-1">{peerGroupData.subTitle}</p>
                    <h1 className="text-2xl md:text-4xl font-bold text-primary leading-tight">
                      {peerGroupData.fullName}
                    </h1>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-8 ms-32">
                  <div className="text-center md:text-left">
                    <div className="text-3xl font-bold text-primary">{peerGroupData.stats.members}</div>
                    <div className="text-lg text-gray-600 mt-1">Total Members</div>
                  </div>
                  <div className="text-center md:text-left">
                    <div className="text-3xl font-bold text-primary">{peerGroupData.stats.activeMembers}</div>
                    <div className="text-lg text-gray-600 mt-1">Active Members</div>
                  </div>
                  <div className="text-center md:text-left">
                    <div className="text-3xl font-bold text-primary">{pagination.total}</div>
                    <div className="text-lg text-gray-600 mt-1">Registered</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">

              {/* Short Profile */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-primary mb-6">
                  Short Profile
                </h2>
                {peerGroupData.description ? (
                  <div className="space-y-4 mb-6">
                    <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                      {peerGroupData.description}
                    </div>
                  </div>
                ) : (
                  <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center text-sm text-gray-500 mb-6">
                    No profile description available yet.
                  </div>
                )}
              </div>

              {/* Struktur Organisasi */}
              {peerGroupData.orgStructure?.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                  <Icon icon="mdi:school-outline" className="w-5 h-5" />
                  Organizational Structure
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {peerGroupData.orgStructure.slice(0, 2).map((member) => (
                    <div key={member.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-start gap-3 mb-3">
                        {member.photo ? (
                          <img
                            src={member.photo}
                            alt={member.name}
                            className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                          />
                        ) : null}
                        <div className={`w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 ${member.photo ? 'hidden' : ''}`}>
                          <Icon icon="mdi:account" className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900 leading-tight">
                            {member.name}
                          </h4>
                          {member.position && (
                            <p className="text-xs text-gray-600 mt-1">{member.position}</p>
                          )}
                        </div>
                      </div>
                      {member.email && (
                        <div className="flex items-center gap-1 text-xs text-primary">
                          <Icon icon="mdi:email-outline" className="w-3 h-3" />
                          <a href={`mailto:${member.email}`} className="hover:underline">{member.email}</a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {peerGroupData.orgStructure.length > 2 && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-primary mb-3">All Members</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {peerGroupData.orgStructure.slice(2).map((member) => (
                      <div key={member.id} className="bg-white rounded-xl py-5 px-3 border border-gray-200 text-center flex flex-col items-center">
                        {member.photo ? (
                          <img
                            src={member.photo}
                            alt={member.name}
                            className="w-16 h-16 rounded-full object-cover mb-3"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextElementSibling && (e.target.nextElementSibling.style.display = 'flex');
                            }}
                          />
                        ) : null}
                        {!member.photo && (
                          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-3">
                            <Icon icon="mdi:account" className="w-9 h-9 text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold text-gray-900 leading-tight">
                            {member.name}
                          </h4>
                          {member.position && (
                            <p className="text-[10px] text-gray-600 mt-1">{member.position}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                )}
              </div>
              )}

            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1 space-y-4">

              {/* Member Data */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-0">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-primary">
                    Member Data
                  </h2>
                </div>

                <div className="p-6 space-y-4">
                  <div className="bg-primary/5 border-2 border-primary/15 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-primary">Active Members</h3>
                      <div className="text-4xl font-bold text-primary">
                        {peerGroupData.stats.activeMembers}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Total active members in this peer group
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact */}
              {(peerGroupData.contact?.address || peerGroupData.contact?.phone || peerGroupData.contact?.email) && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-0">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-primary">
                    Contact
                  </h2>
                </div>

                <div className="p-6 space-y-4">
                  {peerGroupData.contact.address && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-primary mb-1">Address</h3>
                      <p className="text-xs text-gray-600">{peerGroupData.contact.address}</p>
                    </div>
                  </div>
                  )}

                  {peerGroupData.contact.phone && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-primary mb-1">Phone</h3>
                      <a href={`tel:${peerGroupData.contact.phone}`} className="text-xs text-primary hover:text-secondary">
                        {peerGroupData.contact.phone}
                      </a>
                    </div>
                  </div>
                  )}

                  {peerGroupData.contact.email && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-primary mb-1">E-mail</h3>
                      <a href={`mailto:${peerGroupData.contact.email}`} className="text-xs text-primary hover:text-secondary">
                        {peerGroupData.contact.email}
                      </a>
                    </div>
                  </div>
                  )}

                  {peerGroupData.contact.website && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Globe className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-primary mb-1">Website</h3>
                      <a href={peerGroupData.contact.website} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:text-secondary break-all">
                        {peerGroupData.contact.website}
                      </a>
                    </div>
                  </div>
                  )}
                </div>
              </div>
              )}

              {/* Registration */}
              {peerGroupData.registrationInfo && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <h2 className="text-xl font-bold text-primary mb-6">
                  Registration
                </h2>

                <div className="space-y-4">
                  <div className="text-base text-gray-700 leading-relaxed whitespace-pre-line">
                    {peerGroupData.registrationInfo}
                  </div>
                  {peerGroupData.registrationUrl && (
                    <div className="mt-4">
                      <span className="text-sm text-gray-600">Registration Link: </span>
                      <a
                        href={peerGroupData.registrationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline break-all"
                      >
                        {peerGroupData.registrationUrl}
                      </a>
                    </div>
                  )}
                </div>
              </div>
              )}
            </div>
          </div>

          {/* Members Table Section - Full Width */}
          <div className="mt-8">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
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

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search Member</label>
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

            {/* Table */}
            <div id="members-table" className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-primary">Peer Group Members</h2>
                  <p className="text-sm text-gray-600">
                    Showing {members.length > 0 ? startIndex + 1 : 0}-{startIndex + members.length} of {pagination.total} members
                  </p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">No</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Name</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Specialization</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Gender</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {membersLoading ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500">Loading...</td>
                      </tr>
                    ) : members.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500">No member data found.</td>
                      </tr>
                    ) : (
                      members.map((member, index) => (
                        <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{startIndex + index + 1}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{member.specialization || "-"}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{member.gender || "-"}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`${STATUS_COLORS[member.status] || "bg-gray-400"} text-white px-3 py-1 rounded-full text-xs font-semibold capitalize`}>
                              {member.status}
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
        </div>
      </section>
    </HomepageLayout>
  );
}
