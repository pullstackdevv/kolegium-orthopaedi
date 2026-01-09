import { useState } from "react";
import { Link } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import HomepageLayout from "../Layouts/HomepageLayout";

export default function Resident() {
  const [filters, setFilters] = useState({
    programStudi: "all",
    semester: "all",
    status: "all",
    search: ""
  });

  const [currentPage, setCurrentPage] = useState(1);

  // Stats data
  const stats = [
    {
      label: "Total Residen",
      value: 80,
      icon: "mdi:account-group",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      label: "Aktif Semester Ini",
      value: 80,
      icon: "mdi:account-check",
      iconBg: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      label: "Achievements",
      value: 80,
      icon: "mdi:trophy",
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600"
    }
  ];

  // Resident data
  const residents = [
    {
      id: 1,
      name: "Dr. Reza Rahmat",
      prodi: "FK UI",
      semester: "Semester 8",
      gender: "L",
      status: "Lulus",
      statusColor: "bg-blue-500",
      achievement: "1st Place - Outstanding Achievement in Orthopaedic and Traumatology Medicine Case"
    },
    {
      id: 2,
      name: "Dr. M. Mulky Yasin",
      prodi: "FK UNAIR",
      semester: "Semester 4",
      gender: "L",
      status: "Aktif",
      statusColor: "bg-green-500",
      achievement: ""
    },
    {
      id: 3,
      name: "Dr. Rizki Safriadi",
      prodi: "FK UNPAD",
      semester: "Semester 4",
      gender: "L",
      status: "Cuti",
      statusColor: "bg-yellow-500",
      achievement: ""
    }
  ];

  const totalPages = 3;

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <HomepageLayout>
      {/* Breadcrumb Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-white text-sm">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <span>Residen</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title */}
          <h1 className="text-3xl font-bold text-blue-700 mb-8">
            Data Residen PPDS1 Orthopaedi dan Traumatology
          </h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
                    <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-16 h-16 ${stat.iconBg} rounded-full flex items-center justify-center`}>
                    <Icon icon={stat.icon} className={`w-8 h-8 ${stat.iconColor}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Program Studi Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Program Studi
                </label>
                <select
                  value={filters.programStudi}
                  onChange={(e) => handleFilterChange('programStudi', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Semua Prodi</option>
                  <option value="fkui">FK UI</option>
                  <option value="fkunair">FK UNAIR</option>
                  <option value="fkunpad">FK UNPAD</option>
                </select>
              </div>

              {/* Semester Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Semester
                </label>
                <select
                  value={filters.semester}
                  onChange={(e) => handleFilterChange('semester', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Semua</option>
                  <option value="1">Semester 1</option>
                  <option value="2">Semester 2</option>
                  <option value="3">Semester 3</option>
                  <option value="4">Semester 4</option>
                  <option value="8">Semester 8</option>
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Semua</option>
                  <option value="aktif">Aktif</option>
                  <option value="lulus">Lulus</option>
                  <option value="cuti">Cuti</option>
                </select>
              </div>

              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cari Residen
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    placeholder="Cari nama..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-blue-700">Daftar Residen</h2>
                <p className="text-sm text-gray-600">Menampilkan 3 dari 58 residen</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">No</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Residen</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Prodi</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Semester</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Gender</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Achievements</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {residents.map((resident, index) => (
                    <tr key={resident.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {resident.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {resident.prodi}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {resident.semester}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {resident.gender}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`${resident.statusColor} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
                          {resident.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 max-w-md">
                        {resident.achievement || "-"}
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
      </section>
    </HomepageLayout>
  );
}
