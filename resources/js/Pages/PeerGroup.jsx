import { Link } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { Users, Calendar, ChevronRight, Search } from "lucide-react";
import HomepageLayout from "../Layouts/HomepageLayout";

export default function PeerGroup() {
  const peerGroupInfo = {
    name: "IOSSA",
    fullName: "Indonesian Orthopaedic Spine Surgeon Association",
    members: 80,
    activeMembers: 30
  };

  const boardMembers = [
    { name: "dr. H. Djapar A.L. Tadjudin, Sp.OT(K)" },
    { name: "Prof. dr. dr. Zairin Noor, Sp.OT(K)" },
    { name: "dr. dr. Heri Suroto, Sp.OT(K)" },
    { name: "dr. dr. Lukito Budiono, Sp.OT(K)" },
    { name: "dr. dr. Wieke Suciawati, Sp.OT(K)" },
    { name: "dr. dr. Riana Wardany Pribadi, Sp.OT(K)" }
  ];

  const fellowships = [
    { no: 1, name: "Dr. Surya Darma", organizer: "RSUP Dr. Sardjito Yogya", semester: "Semester 2", status: "Pre-post Ankle", badge: "Active", badgeColor: "bg-blue-500" },
    { no: 2, name: "Dr. M. Mahfuz Yasin", organizer: "RSUP Dr. Hasan Sadikin Bdg", semester: "Semester 2", status: "Post-post Ankle", badge: "Active", badgeColor: "bg-green-500" },
    { no: 3, name: "Dr. Yogi Prabowo", organizer: "RSUP Dr. Wahidin Sudiro", semester: "Semester 1", status: "Spine", badge: "Active", badgeColor: "bg-teal-500" }
  ];

  return (
    <HomepageLayout>
      {/* Breadcrumb */}
      <div className="bg-blue-500 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-white text-sm">
            <Link href="/" className="hover:underline">Beranda</Link>
            <ChevronRight className="w-4 h-4" />
            <span>Profile Study (PPDS 1)</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-200">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Left: Image */}
              <div className="relative h-80 lg:h-auto">
                <img 
                  src="/assets/images/peergroup/peergroup.png" 
                  alt="Peer Group Team"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center"><svg class="w-24 h-24 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg></div>';
                  }}
                />
              </div>

              {/* Right: Info */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-start gap-6 mb-8">
                  {/* Logo */}
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-600 bg-white flex items-center justify-center">
                      <img 
                        src="/assets/images/logo-univ/FK-UI.png" 
                        alt="FK UI Logo"
                        className="w-20 h-20 object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = '<svg class="w-16 h-16 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"></path></svg>';
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Text Info */}
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 font-medium mb-1">Peer Group</p>
                    <h1 className="text-4xl font-bold text-blue-700 mb-2">{peerGroupInfo.name}</h1>
                    <p className="text-lg text-blue-900 font-semibold leading-tight">{peerGroupInfo.fullName}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex gap-12">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-blue-700 mb-1">{peerGroupInfo.members}</div>
                    <div className="text-sm text-gray-700 font-medium">Anggota</div>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl font-bold text-blue-700 mb-1">{peerGroupInfo.activeMembers}</div>
                    <div className="text-sm text-gray-700 font-medium">Staff Pendidik</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Profile & Agenda */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Icon icon="mdi:file-document-outline" className="w-6 h-6 text-blue-600" />
                Profile Singkat
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Program studi Orthopaedi dan Traumatologi FKUI menyelenggarakan program pendidikan dokter spesialis Orthopaedi dan Traumatologi sejak tahun 1952.
              </p>
            </div>
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Icon icon="mdi:calendar-outline" className="w-6 h-6 text-blue-600" />
                Agenda
              </h2>
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 space-y-3">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900">Annual Meeting 2025</p>
                      <p className="text-sm text-gray-600">15 December 2025</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dewan Pembimbing */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Icon icon="mdi:account-group" className="w-6 h-6 text-blue-600" />
            Dewan Pembimbing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {boardMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-gray-600" />
                  </div>
                  <p className="font-semibold text-gray-900 text-sm">{member.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fellowship Table */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Daftar Mahasiswa Clinical Fellowship</h2>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">No</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Resident</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Penyelenggara</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Semester</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {fellowships.map((fellow, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{fellow.no}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{fellow.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{fellow.organizer}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{fellow.semester}</td>
                      <td className="px-6 py-4">
                        <span className={`${fellow.badgeColor} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
                          {fellow.badge}
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
