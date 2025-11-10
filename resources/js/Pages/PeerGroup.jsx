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
    { name: "Dr. H. Djapar A.L. Tadjudin, Sp.OT(K)" },
    { name: "Prof. Dr. Zairin Noor, Sp.OT(K)" },
    { name: "Dr. Heri Suroto, Sp.OT(K)" },
    { name: "Dr. Lukito Budiono, Sp.OT(K)" },
    { name: "Dr. Wieke Suciawati, Sp.OT(K)" },
    { name: "Dr. Riana Wardany Pribadi, Sp.OT(K)" }
  ];

  const fellowships = [
    { no: 1, name: "Dr. Surya Darma", organizer: "RSUP Dr. Sardjito Yogya", semester: "Semester 2", specialty: "Spine Surgery", badge: "Active", badgeColor: "bg-blue-500" },
    { no: 2, name: "Dr. M. Mahfuz Yasin", organizer: "RSUP Dr. Hasan Sadikin Bdg", semester: "Semester 2", specialty: "Sports Medicine", badge: "Active", badgeColor: "bg-green-500" },
    { no: 3, name: "Dr. Yogi Prabowo", organizer: "RSUP Dr. Wahidin Sudiro", semester: "Semester 1", specialty: "Hand Surgery", badge: "Active", badgeColor: "bg-blue-500" }
  ];

  return (
    <HomepageLayout>
      {/* Breadcrumb */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-white text-sm">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <span>Peer Group</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title */}
          <h1 className="text-3xl font-bold text-blue-700 mb-8">
            {peerGroupInfo.name} - {peerGroupInfo.fullName}
          </h1>

          {/* Hero Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Left: Image */}
              <div className="relative h-72 lg:h-auto">
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
              <div className="p-8 lg:p-10 flex flex-col justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                <div className="flex items-start gap-4 mb-6">
                  {/* Logo */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-white flex items-center justify-center shadow-md border-4 border-yellow-400">
                      <img 
                        src="/assets/images/logo-univ/FK-UI.png" 
                        alt="Logo"
                        className="w-16 h-16 object-contain p-1"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = '<svg class="w-12 h-12 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"></path></svg>';
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Text Info */}
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 font-medium mb-1">Peer Group</p>
                    <h2 className="text-2xl font-bold text-blue-700 mb-1">{peerGroupInfo.name}</h2>
                    <p className="text-sm text-blue-900 font-semibold leading-tight">{peerGroupInfo.fullName}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-3xl font-bold text-blue-700 mb-1">{peerGroupInfo.members}</div>
                    <div className="text-xs text-gray-600 font-medium">Members</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-3xl font-bold text-blue-700 mb-1">{peerGroupInfo.activeMembers}</div>
                    <div className="text-xs text-gray-600 font-medium">Teaching Staff</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile & Agenda */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-blue-700 mb-4">Brief Profile</h2>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                The Orthopaedic and Traumatology Study Program at FKUI has been organizing specialist doctor education programs that are nationally and internationally accredited. This program was established in 1965 and has produced more than 500 orthopedic specialists spread throughout Indonesia.
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                With a comprehensive 5-year curriculum, residents will gain clinical experience in various main teaching hospitals and networks, as well as opportunities to be involved in research and international exchange programs.
              </p>
            </div>
            <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-blue-700 mb-4">Agenda</h2>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <p className="text-xs text-gray-600 mb-3 font-medium">Upcoming Events</p>
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Annual Meeting 2025</p>
                    <p className="text-xs text-gray-600">December 15, 2025</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Board Members */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
              <Icon icon="mdi:account-group" className="w-6 h-6" />
              Advisory Board
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {boardMembers.map((member, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="font-medium text-gray-900 text-sm">{member.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fellowship Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-blue-700">Clinical Fellowship Members</h2>
              <p className="text-sm text-gray-600 mt-1">Showing {fellowships.length} members</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">No</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Institution</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Semester</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Specialty</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {fellowships.map((fellow, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{fellow.no}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{fellow.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{fellow.organizer}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{fellow.semester}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{fellow.specialty}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
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
