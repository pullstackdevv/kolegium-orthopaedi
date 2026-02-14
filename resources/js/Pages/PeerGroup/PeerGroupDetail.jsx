import { useState, useEffect, useCallback } from "react";
import { Link } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { Users, Calendar, ChevronRight, ChevronLeft, Search, X, MapPin, Phone, Mail, Globe } from "lucide-react";
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
    members: 0,
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

  const DEFAULT_LOGO = "/assets/images/peergroup/master-logo.png";
  const DEFAULT_PHOTO = "/assets/images/peergroup/master-banner.png";

  const resolvedLogo = peerGroupData.logo || DEFAULT_LOGO;
  const resolvedPhoto = peerGroupData.image || DEFAULT_PHOTO;

  // Academic activities
  const [academicActivities, setAcademicActivities] = useState([]);
  const [academicActivitiesLoading, setAcademicActivitiesLoading] = useState(true);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const formatFullDate = (dateStr) => {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return "-";
    d.setHours(12, 0, 0, 0);
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  };

  const formatDateLabel = (startStr, endStr) => {
    const startLabel = formatFullDate(startStr);
    const endLabel = endStr ? formatFullDate(endStr) : startLabel;
    return startLabel === endLabel ? startLabel : `${startLabel} - ${endLabel}`;
  };

  const getEventBadgeMeta = (typeStr) => {
    const type = String(typeStr || "");
    const KNOWN = {
      ujian_lokal: { label: "Ujian Lokal", className: "bg-red-500 text-white" },
      ujian_nasional: { label: "Ujian Nasional", className: "bg-primary text-white" },
      event_lokal: { label: "Event Lokal", className: "bg-green-500 text-white" },
      event_nasional: { label: "Event Nasional", className: "bg-orange-500 text-white" },
      event_peer_group: { label: "Peer Group International", className: "bg-purple-500 text-white" },
      event_peer_group_nasional: { label: "Peer Group National", className: "bg-indigo-500 text-white" },
    };
    if (KNOWN[type]) return { ...KNOWN[type], dotClass: KNOWN[type].className.split(" ")[0] };
    const raw = type.replace(/^(event_|ujian_)/, "");
    const key = raw || "event";
    const label = key.split("_").filter(Boolean).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    if (key.includes("nasional")) return { label, className: "bg-emerald-500 text-white", dotClass: "bg-emerald-500" };
    if (type.startsWith("ujian_")) return { label, className: "bg-red-500 text-white", dotClass: "bg-red-500" };
    return { label, className: "bg-primary text-white", dotClass: "bg-primary" };
  };

  const openDetailModal = (ev) => { setSelectedEvent(ev); setShowDetailModal(true); };

  useEffect(() => {
    const fetchAcademicActivities = async () => {
      setAcademicActivitiesLoading(true);
      try {
        const { data } = await api.get("/public/agenda-events", {
          params: { affiliation_id: peerGroupData.id },
        });
        if (data?.status !== "success") { setAcademicActivities([]); return; }
        const items = (data?.data ?? [])
          .filter((event) => /^(event|ujian)_/.test(String(event?.type ?? "")))
          .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
          .slice(0, 2)
          .map((event) => {
            const badgeMeta = getEventBadgeMeta(event.type);
            return {
              id: event.id,
              dateLabel: formatDateLabel(event.start_date, event.end_date),
              title: event.title,
              location: event.location,
              badge: badgeMeta.label,
              badgeClass: badgeMeta.className,
              dotClass: badgeMeta.dotClass,
              type: event.type,
              description: event.description,
              registration: event.registration_url,
              image: event.image_url,
            };
          });
        setAcademicActivities(items);
      } catch (error) {
        setAcademicActivities([]);
      } finally {
        setAcademicActivitiesLoading(false);
      }
    };
    if (peerGroupData.id) fetchAcademicActivities();
  }, [peerGroupData.id]);

  // Dynamic members state
  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0, per_page: 10 });
  const [filters, setFilters] = useState({ search: "" });

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

  // Gallery state
  const [galleryItems, setGalleryItems] = useState([]);
  const [galleryPage, setGalleryPage] = useState(1);
  const [galleryLastPage, setGalleryLastPage] = useState(1);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [galleryDetailItem, setGalleryDetailItem] = useState(null);

  const fetchGallery = async (page = 1) => {
    if (!peerGroupData.id) return;
    setGalleryLoading(true);
    try {
      const res = await api.get("/public/galleries", {
        params: { affiliation_id: peerGroupData.id, per_page: 4, page },
        headers: { "X-Skip-Auth-Redirect": "1" },
      });
      if (res.data?.status === "success") {
        const pg = res.data.data;
        setGalleryItems(pg.data || []);
        setGalleryPage(pg.current_page || 1);
        setGalleryLastPage(pg.last_page || 1);
      }
    } catch (e) {
      console.error("Failed to fetch gallery", e);
    } finally {
      setGalleryLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery(1);
  }, [peerGroupData.id]);

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
                <div className="flex items-start gap-6 mb-6">
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
                    <p className="text-lg font-semibold text-primary mb-1">Peer Group</p>
                    <h1 className="text-2xl md:text-3xl font-bold text-primary leading-tight">
                      {peerGroupData.name}
                    </h1>
                    <h2 className="text-xl md:text-2xl font-bold text-primary leading-tight mt-1">
                      {peerGroupData.fullName}
                    </h2>
                    <div className="mt-4 text-left">
                      <div className="text-3xl font-bold text-primary">{peerGroupData.members}</div>
                      <div className="text-base text-gray-600 underline">Members</div>
                    </div>
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

              {/* Advisory Council */}
              {peerGroupData.orgStructure?.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                  <Icon icon="mdi:account-group" className="w-5 h-5" />
                  Advisory Council
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {peerGroupData.orgStructure.map((member) => (
                    <div key={member.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                        {member.photo ? (
                          <img
                            src={member.photo}
                            alt={member.name}
                            className="w-10 h-10 rounded-full object-cover"
                            onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>'; }}
                          />
                        ) : (
                          <Icon icon="mdi:account" className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 leading-tight">
                          {member.name}
                        </h4>
                        {member.position && (
                          <p className="text-xs text-gray-500 mt-0.5">{member.position}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              )}

            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1 space-y-6">

              {/* Event */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-primary mb-4">Event</h2>
                <div className="bg-green-50 rounded-lg p-8 min-h-[120px] border border-green-100">
                </div>
              </div>

              {/* Registration */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-primary mb-4">
                  Registration
                </h2>
                {peerGroupData.registrationInfo ? (
                  <div className="space-y-4">
                    <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
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
                ) : (
                  <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center text-sm text-gray-500">
                    No registration information available.
                  </div>
                )}
              </div>

              {/* Academic Activities */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-primary mb-4">
                  Academic Activities
                </h2>
                {academicActivities.length === 0 ? (
                  <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center text-sm text-gray-600">
                    No upcoming academic activities.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {academicActivities.map((item) => (
                      <div key={item.id} className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-xs text-gray-600">{item.dateLabel}</span>
                            <span className="text-gray-300">•</span>
                            <span className={`${item.badgeClass} text-[10px] font-semibold px-2 py-0.5 rounded`}>
                              {item.badge}
                            </span>
                          </div>
                          <button
                            type="button"
                            className="text-xs text-primary hover:text-secondary flex-shrink-0"
                            onClick={() => openDetailModal(item)}
                          >
                            Detail
                          </button>
                        </div>
                        <h4 className="text-sm font-bold text-gray-900 leading-snug">{item.title}</h4>
                        {item.location && <p className="text-xs text-gray-500 mt-1">{item.location}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
                  <h2 className="text-lg font-bold text-primary">Member Name</h2>
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
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Photo</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Name</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Graduation Year</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Placement District</th>
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
                          <td className="px-6 py-4 whitespace-nowrap">
                            {member.photo ? (
                              <img src={member.photo} alt={member.name} className="w-10 h-10 rounded-full object-cover" />
                            ) : (
                              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                <Icon icon="mdi:account" className="w-5 h-5 text-gray-400" />
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {member.graduated_at ? member.graduated_at.split("-")[0] : "-"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {member.regency?.name || "-"}
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

          {/* Gallery Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-8">
            <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
              <Icon icon="mdi:image-multiple" className="w-5 h-5" />
              Gallery
            </h2>
            {galleryLoading ? (
              <div className="flex justify-center py-8">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : galleryItems.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">No gallery items yet</p>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {galleryItems.map((item) => (
                    <div
                      key={item.id}
                      className="relative rounded-lg overflow-hidden bg-gray-100 h-40 cursor-pointer group"
                      onClick={() => setGalleryDetailItem(item)}
                    >
                      <img
                        src={item.photo?.startsWith("http") ? item.photo : `/storage/${item.photo}`}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                        <p className="text-white text-sm font-semibold line-clamp-2">{item.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {galleryLastPage > 1 && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <button
                      className="text-sm text-primary hover:underline disabled:text-gray-300 disabled:no-underline"
                      disabled={galleryPage <= 1}
                      onClick={() => fetchGallery(galleryPage - 1)}
                    >
                      ← Previous
                    </button>
                    <span className="text-sm text-gray-400">{galleryPage} / {galleryLastPage}</span>
                    <button
                      className="text-sm text-primary hover:underline disabled:text-gray-300 disabled:no-underline"
                      disabled={galleryPage >= galleryLastPage}
                      onClick={() => fetchGallery(galleryPage + 1)}
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

        </div>
      </section>

      {/* Gallery Detail Modal */}
      {galleryDetailItem && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setGalleryDetailItem(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img
                src={galleryDetailItem.photo?.startsWith("http") ? galleryDetailItem.photo : `/storage/${galleryDetailItem.photo}`}
                alt={galleryDetailItem.title}
                className="w-full h-64 object-cover"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <button
                onClick={() => setGalleryDetailItem(null)}
                className="absolute top-3 right-3 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 transition-colors"
                type="button"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{galleryDetailItem.title}</h3>
              {galleryDetailItem.gallery_date && (
                <p className="text-sm text-gray-500 mb-3 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {new Date(galleryDetailItem.gallery_date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              )}
              {galleryDetailItem.description && (
                <p className="text-sm text-gray-700 leading-relaxed">{galleryDetailItem.description}</p>
              )}
            </div>
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={() => setGalleryDetailItem(null)}
                className="w-full px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm"
                type="button"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {showDetailModal && selectedEvent && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowDetailModal(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`p-6 rounded-t-xl ${selectedEvent.dotClass || "bg-primary"}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-white" />
                  <span className="text-white font-medium text-sm">
                    {selectedEvent.dateLabel || "-"}
                  </span>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                  type="button"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <h3 className="text-xl font-bold text-white">{selectedEvent.title}</h3>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="text-sm text-gray-700">
                <p>{selectedEvent.description || "No description available"}</p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowDetailModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                type="button"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </HomepageLayout>
  );
}
