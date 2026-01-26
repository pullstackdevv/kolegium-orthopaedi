import { useState } from "react";
import { Link } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { Users, Calendar, ChevronRight, ChevronLeft } from "lucide-react";
import HomepageLayout from "../Layouts/HomepageLayout";

export default function PeerGroupDetail() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const peerGroupInfo = {
    name: "IOSSA",
    fullName: "Indonesian Orthopaedic Spine Surgeon Association",
    members: 80,
    activeMembers: 30
  };

  const leadership = {
    president: { name: "Dr. dr. I Gusti Lanang Ngurah Agung Artha Wiguna, Sp.OT(K)" },
    vicePresident: { name: "dr. Yudha Mathan Sakti, Sp.OT(K)" },
    secretary: { name: "dr. Heka Priyamurti, Sp.OT(K)" }
  };

  const allFellowships = [
    { no: 1, organizer: "RSUD Dr. Saiful Anwar Malang", name: "dr. Hamzah, SpOT", specialty: "Spine", year: "Desember 2023", status: "LULUS", statusColor: "bg-green-500" },
    { no: 2, organizer: "RSUD Dr. Saiful Anwar Malang", name: "dr. Aditya Jaya Manggala, SpOT", specialty: "Spine", year: "Desember 2023", status: "LULUS", statusColor: "bg-green-500" },
    { no: 3, organizer: "RSUD Dr. Saiful Anwar Malang", name: "dr. Hidayat, SpOT", specialty: "Spine", year: "Februari 2024", status: "LULUS", statusColor: "bg-green-500" },
    { no: 4, organizer: "RSUD Dr. Saiful Anwar Malang", name: "dr. Teuku Arief Dian, SpOT", specialty: "Spine", year: "Februari 2024", status: "LULUS", statusColor: "bg-green-500" },
    { no: 5, organizer: "RSUD Dr. Saiful Anwar Malang", name: "dr. Rudy, SpOT", specialty: "Spine", year: "Agustus 2024", status: "LULUS", statusColor: "bg-green-500" }
  ];

  const totalItems = allFellowships.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const fellowships = allFellowships.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  return (
    <HomepageLayout>
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-6">
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
                <img src="/assets/images/peergroup/peergroup.png" alt="Peer Group" className="w-full h-full object-cover" />
              </div>
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-start gap-6 mb-8">
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-8 border-primary bg-white flex items-center justify-center">
                      <img src="/assets/images/logo-univ/FK-UI.png" alt="Logo" className="w-16 h-16 object-contain" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 font-medium mb-1">Peer Group</p>
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
              <h2 className="text-xl font-bold text-blue-700 mb-4">Short Profile</h2>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                The Indonesian Orthopaedic Spine Surgeon Association (IOSSA) is a professional organization dedicated to advancing the field of spine surgery in Indonesia.
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                Through collaborative programs, scientific meetings, and training initiatives, IOSSA aims to enhance patient care and uphold the highest standards.
              </p>
            </div>
            <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-blue-700 mb-4">Agenda</h2>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <p className="text-xs text-gray-600 mb-3 font-medium">Upcoming Events</p>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Annual Meeting 2025</p>
                  <p className="text-xs text-gray-600">December 15, 2025</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-bold text-blue-700 mb-4 flex items-center gap-2">
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
              <div>
                <h3 className="text-lg font-bold text-blue-700 mb-4 flex items-center gap-2">
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
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-bold text-blue-700 mb-4 flex items-center gap-2">
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
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-blue-700">Peer Group Members</h2>
              <p className="text-sm text-gray-600 mt-1">Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} members</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">No</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Penyelenggara</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Nama</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Peminatan</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Tahun Masuk</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Ket</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {fellowships.map((fellow, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{fellow.no}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{fellow.organizer}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{fellow.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{fellow.specialty}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{fellow.year}</td>
                      <td className="px-6 py-4">
                        <span className={`${fellow.statusColor} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
                          {fellow.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </HomepageLayout>
  );
}