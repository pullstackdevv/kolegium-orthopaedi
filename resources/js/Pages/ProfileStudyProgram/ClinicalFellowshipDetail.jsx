import { useState } from "react";
import { Link } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { MapPin, Phone, Globe, Search, ChevronLeft, ChevronRight } from "lucide-react";
import HomepageLayout from "../../Layouts/HomepageLayout";

export default function ClinicalFellowshipDetail({ fellowship }) {
  const [filters, setFilters] = useState({
    clinicalFellowship: "all",
    penyelenggara: "all",
    status: "all",
    search: ""
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Data from backend (loaded from affiliation_profiles table)
  const fellowshipData = fellowship || {
    id: null,
    code: "",
    name: "",
    title: "Clinical Fellowship",
    logo: null,
    image: null,
    stats: {
      fellowActive: 0,
      staffPendidik: 0,
      rsPendidikan: 0
    },
    profileSingkat: "",
    contact: {
      address: "",
      phone: "",
      website: ""
    },
    registration: {
      info: ""
    },
    staff: [],
    students: []
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const totalPages = 3;

  return (
    <HomepageLayout>
      {/* Breadcrumb */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-white text-sm">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <Link href="/profile-study-program/clinical-fellowship" className="hover:underline">Profile Prodi</Link>
            <span>/</span>
            <span>PPDS 1</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header Card with Image */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="relative h-48 bg-gradient-to-br from-blue-100 to-blue-200">
                  <img
                    src={fellowshipData.image}
                    alt={fellowshipData.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
                <div className="p-6">
                  <p className="text-sm text-blue-600 font-semibold mb-2">{fellowshipData.title}</p>
                  <h1 className="text-2xl font-bold text-gray-900 mb-6">
                    {fellowshipData.name}
                  </h1>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-1">
                        {fellowshipData.stats.fellowActive}
                      </div>
                      <div className="text-sm text-gray-600">Fellow Active</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-1">
                        {fellowshipData.stats.staffPendidik}
                      </div>
                      <div className="text-sm text-gray-600">Staff Pendidik</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-1">
                        {fellowshipData.stats.rsPendidikan}
                      </div>
                      <div className="text-sm text-gray-600">RS Pendidikan</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Singkat */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
                  <Icon icon="mdi:file-document-outline" className="w-6 h-6" />
                  Profile Singkat
                </h2>
                {fellowshipData.profileSingkat ? (
                  <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    {fellowshipData.profileSingkat}
                  </div>
                ) : (
                  <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center text-sm text-gray-500">
                    No profile description available yet.
                  </div>
                )}
              </div>

              {/* Clinical Fellowship Staff */}
              {fellowshipData.staff?.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-blue-700 mb-6 flex items-center gap-2">
                  <Icon icon="mdi:hospital-building" className="w-6 h-6" />
                  Clinical Fellowship {fellowshipData.name}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {fellowshipData.staff.map((staff, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Icon icon="mdi:account" className="w-8 h-8 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-gray-900 mb-1">
                          {staff.name}
                        </h3>
                        <p className="text-xs text-blue-600 mb-1">{staff.specialization}</p>
                        <p className="text-xs text-gray-600">{staff.program}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              )}

              {/* Filters */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Clinical Fellowship Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Clinical Fellowship
                    </label>
                    <select
                      value={filters.clinicalFellowship}
                      onChange={(e) => handleFilterChange('clinicalFellowship', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="all">Semua</option>
                      <option value="hip-knee">Hip and Knee</option>
                      <option value="foot-ankle">Foot and Ankle</option>
                      <option value="spine">Spine</option>
                    </select>
                  </div>

                  {/* Penyelenggara Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Penyelenggara
                    </label>
                    <select
                      value={filters.penyelenggara}
                      onChange={(e) => handleFilterChange('penyelenggara', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="all">Semua</option>
                      <option value="sardjito">RSUP Dr. Sardjito</option>
                      <option value="saiful">RSUD Dr. Saiful Anwar</option>
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="all">Semua</option>
                      <option value="aktif">Aktif</option>
                      <option value="lulus">Lulus</option>
                    </select>
                  </div>

                  {/* Search */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cari Residen
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        placeholder="Cari..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Student Table */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-blue-700">
                      Daftar Mahasiswa Clinical Fellowship
                    </h2>
                    <p className="text-sm text-gray-600">Menampilkan 3 dari 58 residen</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">No</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Residen</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Penyelenggara</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Semester</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Clinical Fellowship</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Gender</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {fellowshipData.students.map((student, index) => (
                        <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {student.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {student.penyelenggara}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {student.semester}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {student.clinicalFellowship}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {student.gender}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`${student.statusColor} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
                              {student.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    {[1, 2, 3].map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Struktur Organisasi */}
              {fellowshipData.orgStructure?.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-blue-700 mb-4">
                  Struktur Organisasi
                </h3>
                <div className="space-y-4">
                  {fellowshipData.orgStructure.map((member) => (
                    <div key={member.id} className="flex items-start gap-3">
                      {member.photo ? (
                        <img
                          src={member.photo}
                          alt={member.name}
                          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Icon icon="mdi:account" className="w-5 h-5 text-blue-600" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 leading-tight">{member.name}</p>
                        {member.position && (
                          <p className="text-xs text-gray-600 mt-0.5">{member.position}</p>
                        )}
                        {member.email && (
                          <a href={`mailto:${member.email}`} className="text-xs text-blue-600 hover:underline">{member.email}</a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              )}

              {/* Kontak Sekretariat */}
              {(fellowshipData.contact?.address || fellowshipData.contact?.phone || fellowshipData.contact?.website) && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-blue-700 mb-4">
                  Kontak Sekretariat
                </h3>
                <div className="space-y-4">
                  {fellowshipData.contact.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-sm text-gray-700">{fellowshipData.contact.address}</div>
                    </div>
                  </div>
                  )}
                  {fellowshipData.contact.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-xs text-gray-600 mb-1">Telepon</div>
                      <a href={`tel:${fellowshipData.contact.phone}`} className="text-sm text-blue-600 hover:underline">
                        {fellowshipData.contact.phone}
                      </a>
                    </div>
                  </div>
                  )}
                  {fellowshipData.contact.website && (
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <a href={fellowshipData.contact.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline break-all">
                        {fellowshipData.contact.website}
                      </a>
                    </div>
                  </div>
                  )}
                </div>
              </div>
              )}

              {/* Pendaftaran */}
              {fellowshipData.registration?.info && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-blue-700 mb-4">
                  Pendaftaran
                </h3>
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {fellowshipData.registration.info}
                </div>
                {fellowshipData.registration?.url && (
                  <div className="mt-4">
                    <span className="text-sm text-gray-600">Link Pendaftaran: </span>
                    <a
                      href={fellowshipData.registration.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all text-sm"
                    >
                      {fellowshipData.registration.url}
                    </a>
                  </div>
                )}
              </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </HomepageLayout>
  );
}
