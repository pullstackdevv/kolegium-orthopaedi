import { useState, useEffect, useCallback } from "react";
import { Link } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { Users, Calendar, ChevronRight, ChevronLeft, Search, X } from "lucide-react";
import HomepageLayout from "../../Layouts/HomepageLayout";
import api from "@/api/axios";

const DEFAULT_PEER_GROUP_DETAILS = {
  IOSSA: {
    name: "IOSSA",
    fullName: "Indonesian Orthopaedic Spine Surgeon Association",
    description: "A professional organization dedicated to advancing spine surgery in Indonesia. IOSSA promotes excellence in education, research, and clinical practice through academic collaboration, training programs, and national symposia.",
    members: 80,
  },
  INAMSOS: {
    name: "INAMSOS",
    fullName: "Indonesian Musculoskeletal Oncology Society",
    description: "INAMSOS focuses on the study, research, and treatment of musculoskeletal tumors. The society supports clinical collaboration, oncologic education, and innovation in orthopaedic oncology across Indonesia.",
    members: 65,
  },
  IHKS: {
    name: "IHKS",
    fullName: "Indonesian Hip and Knee Society",
    description: "IHKS unites orthopaedic surgeons specializing in hip and knee surgery. It aims to improve patient outcomes through continuous education, joint replacement research, and professional development.",
    members: 95,
  },
  INASES: {
    name: "INASES",
    fullName: "Indonesian Shoulder and Elbow Society",
    description: "INASES brings together experts in shoulder and elbow surgery to enhance knowledge, research, and surgical skills through fellowship, workshops, and academic exchange.",
    members: 45,
  },
  IPOS: {
    name: "IPOS",
    fullName: "Indonesian Pediatric Orthopaedic Society",
    description: "IPOS is committed to improving musculoskeletal health in children through education, research, and community outreach in pediatric orthopaedics.",
    members: 72,
  },
  IOSSMA: {
    name: "IOSSMA",
    fullName: "Indonesian Orthopaedic Sports Medicine Association",
    description: "IOSSMA promotes excellence in sports medicine and injury management. It supports clinical advancement, scientific publication, and national collaboration in orthopaedic sports medicine.",
    members: 88,
  },
  INASHUM: {
    name: "INASHUM",
    fullName: "Indonesian Society for Upper Limb and Microsurgery",
    description: "INASHUM focuses on upper limb reconstruction, microsurgery, and functional restoration. The society enhances surgeon competency through education, research, and clinical innovation.",
    members: 54,
  },
  INAFAS: {
    name: "INAFAS",
    fullName: "Indonesian Foot and Ankle Society",
    description: "INAFAS develops knowledge and best practices in foot and ankle surgery. It promotes collaborative learning, research, and improved patient care in this subspecialty field.",
    members: 61,
  },
  IOTS: {
    name: "IOTS",
    fullName: "Indonesian Orthopaedic Trauma Society",
    description: "IOTS focuses on trauma management, fracture care, and post-injury reconstruction. The society advances trauma education, clinical standards, and multidisciplinary cooperation in orthopaedic trauma care.",
    members: 78,
  },
};

function isDetailComplete(data) {
  return (
    data?.name &&
    data?.fullName &&
    data?.description &&
    data?.members > 0
  );
}

export default function PeerGroupDetail({ peerGroup }) {
  // Look up default by code (name) from backend data
  const code = peerGroup?.code || peerGroup?.name || "";
  const defaultData = DEFAULT_PEER_GROUP_DETAILS[code] || null;
  const useDefault = !isDetailComplete(peerGroup) && defaultData;

  // Data from backend (loaded from affiliation_profiles table)
  const peerGroupInfo = {
    id: peerGroup?.id || null,
    name: (useDefault ? defaultData.name : peerGroup?.name) || "",
    fullName: (useDefault ? defaultData.fullName : peerGroup?.fullName) || "",
    members: (useDefault ? defaultData.members : peerGroup?.members) || 0,
    activeMembers: 0,
    logo: peerGroup?.logo || null,
    image: peerGroup?.image || null,
    subTitle: peerGroup?.subTitle || "",
    description: (useDefault ? defaultData.description : peerGroup?.description) || "",
    registrationInfo: peerGroup?.registrationInfo || "",
    registrationUrl: peerGroup?.registrationUrl || "",
    contact: peerGroup?.contact || { address: "", phone: "", email: "", website: "" },
    orgStructure: peerGroup?.orgStructure || [],
  };

  const leadership = {
    president: { name: "" },
    vicePresident: { name: "" },
    secretary: { name: "" }
  };

  // Dynamic members state
  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0, per_page: 10 });
  const [filters, setFilters] = useState({ search: "" });

  const fetchMembers = useCallback(async (page = 1) => {
    if (!peerGroupInfo.id) return;
    setMembersLoading(true);
    try {
      const params = {
        organization_type: "peer_group",
        affiliation_id: peerGroupInfo.id,
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
  }, [filters, pagination.per_page, peerGroupInfo.id]);

  useEffect(() => {
    if (peerGroupInfo.id) fetchMembers(1);
  }, [filters, peerGroupInfo.id]);

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
    if (!peerGroupInfo.id) return;
    setGalleryLoading(true);
    try {
      const res = await api.get("/public/galleries", {
        params: { affiliation_id: peerGroupInfo.id, per_page: 4, page },
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
  }, [peerGroupInfo.id]);

  return (
    <HomepageLayout>
      <section className="bg-gradient-to-r from-primary to-secondary py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-white text-sm">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <Link href="/peer-group" className="hover:underline">Peer Group</Link>
            <span>/</span>
            <span>{peerGroupInfo.name}</span>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="relative h-80 lg:h-auto p-12">
                <img src={peerGroupInfo.image || "/assets/images/peergroup/peergroup.png"} alt="Peer Group" className="w-full h-full object-cover" />
              </div>
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-start gap-6 mb-8">
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-8 border-primary bg-white flex items-center justify-center">
                      <img src={peerGroupInfo.logo || "/assets/images/logo-univ/FK-UI.png"} alt="Logo" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 font-medium mb-1">{peerGroupInfo.subTitle || 'Peer Group'}</p>
                    <h1 className="text-4xl font-bold text-primary mb-2">{peerGroupInfo.name}</h1>
                    <p className="text-2xl text-primary/90 font-semibold leading-tight">{peerGroupInfo.fullName}</p>
                  </div>
                </div>
                <div className="flex gap-12">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-primary mb-1">{peerGroupInfo.members}</div>
                    <div className="text-sm text-gray-700 font-medium">Members</div>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl font-bold text-primary mb-1">{peerGroupInfo.activeMembers}</div>
                    <div className="text-sm text-gray-700 font-medium">Faculty</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-primary mb-4">Short Profile</h2>
              {peerGroupInfo.description ? (
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {peerGroupInfo.description}
                </div>
              ) : (
                <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center text-sm text-gray-500">
                  No profile description available yet.
                </div>
              )}
            </div>
            <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-primary mb-4">Agenda</h2>
              <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                <p className="text-xs text-gray-600 mb-3 font-medium">Upcoming Events</p>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Annual Meeting 2025</p>
                  <p className="text-xs text-gray-600">December 15, 2025</p>
                </div>
              </div>
            </div>
          </div>

          {/* Registration */}
          {(peerGroupInfo.registrationInfo || peerGroupInfo.registrationUrl) && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-bold text-primary mb-4">Registration</h2>
            {peerGroupInfo.registrationInfo && (
              <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {peerGroupInfo.registrationInfo}
              </div>
            )}
            {peerGroupInfo.registrationUrl && (
              <div className="mt-4">
                <span className="text-sm text-gray-600">Registration Link: </span>
                <a
                  href={peerGroupInfo.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline break-all text-sm"
                >
                  {peerGroupInfo.registrationUrl}
                </a>
              </div>
            )}
          </div>
          )}

          {/* Struktur Organisasi */}
          {peerGroupInfo.orgStructure.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-bold text-primary mb-4">Organizational Structure</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {peerGroupInfo.orgStructure.map((member) => (
                <div key={member.id} className="flex items-start gap-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
                  {member.photo ? (
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon icon="mdi:account" className="w-6 h-6 text-primary" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 leading-tight">{member.name}</p>
                    {member.position && (
                      <p className="text-xs text-gray-600 mt-0.5">{member.position}</p>
                    )}
                    {member.email && (
                      <a href={`mailto:${member.email}`} className="text-xs text-primary hover:underline">{member.email}</a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          )}

          {(leadership.president.name || leadership.vicePresident.name || leadership.secretary.name) && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {leadership.president.name && (
              <div>
                <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                  <Icon icon="mdi:office-building" className="w-5 h-5" />
                  President
                </h3>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-gray-600" />
                    </div>
                    <p className="font-medium text-gray-900 text-sm">{leadership.president.name}</p>
                  </div>
                </div>
              </div>
              )}
              {leadership.vicePresident.name && (
              <div>
                <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                  <Icon icon="mdi:office-building" className="w-5 h-5" />
                  Vice President
                </h3>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-gray-600" />
                    </div>
                    <p className="font-medium text-gray-900 text-sm">{leadership.vicePresident.name}</p>
                  </div>
                </div>
              </div>
              )}
            </div>
            {leadership.secretary.name && (
            <div className="mt-6">
              <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                <Icon icon="mdi:office-building" className="w-5 h-5" />
                Secretary General
              </h3>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 max-w-md">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-gray-600" />
                  </div>
                  <p className="font-medium text-gray-900 text-sm">{leadership.secretary.name}</p>
                </div>
              </div>
            </div>
            )}
          </div>
          )}

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-2">
            <div>
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

          {/* Members Table */}
          <div id="members-table" className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-primary">Peer Group Members</h2>
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {membersLoading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-500">Loading...</td>
                    </tr>
                  ) : members.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-500">No member data found.</td>
                    </tr>
                  ) : (
                    members.map((member, index) => (
                      <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{startIndex + index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{member.specialization || "-"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{member.gender === "male" ? "Male" : member.gender === "female" ? "Female" : "-"}</td>
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
    </HomepageLayout>
  );
}