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

  const leadership = {
    president: { name: "Dr. dr. I Gusti Lanang Ngurah Agung Artha Wiguna, Sp.OT(K)" },
    vicePresident: { name: "dr. Yudha Mathan Sakti, Sp.OT(K)" },
    secretary: { name: "dr. Heka Priyamurti, Sp.OT(K)" }
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
          {/* Hero Section */}
          <div className="overflow-hidden mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Left: Image */}
              <div className="relative h-80 lg:h-auto p-12">
                <img 
                  src="/assets/images/peergroup/peergroup.png" 
                  alt="Peer Group Team"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/20 flex items-center justify-center"><svg class="w-24 h-24 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg></div>';
                  }}
                />
              </div>

              {/* Right: Info */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-start gap-6 mb-8">
                  {/* Logo */}
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-8 border-primary bg-white flex items-center justify-center">
                      <img 
                        src="/assets/images/logo-univ/FK-UI.png" 
                        alt="FK UI Logo"
                        className="w-16 h-16 object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = '<svg class="w-16 h-16 text-primary" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"></path></svg>';
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Text Info */}
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 font-medium mb-1">Peer Group</p>
                    <h1 className="text-4xl font-bold text-primary mb-2">{peerGroupInfo.name}</h1>
                    <p className="text-2xl text-primary/90 font-semibold leading-tight">{peerGroupInfo.fullName}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex gap-12">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-primary mb-1">{peerGroupInfo.members}</div>
                    <div className="text-sm text-gray-700 font-medium">Anggota</div>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl font-bold text-primary mb-1">{peerGroupInfo.activeMembers}</div>
                    <div className="text-sm text-gray-700 font-medium">Staff Pendidik</div>
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

          {/* Leadership Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* President */}
              <div>
                <h3 className="text-lg font-bold text-blue-700 mb-4 flex items-center gap-2">
                  <Icon icon="mdi:office-building" className="w-5 h-5" />
                  President
                </h3>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-gray-600" />
                    </div>
                    <p className="font-medium text-gray-900 text-sm">{leadership.president.name}</p>
                  </div>
                </div>
              </div>

              {/* Vice President */}
              <div>
                <h3 className="text-lg font-bold text-blue-700 mb-4 flex items-center gap-2">
                  <Icon icon="mdi:office-building" className="w-5 h-5" />
                  Vice President
                </h3>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-gray-600" />
                    </div>
                    <p className="font-medium text-gray-900 text-sm">{leadership.vicePresident.name}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Secretary General */}
            <div className="mt-6">
              <h3 className="text-lg font-bold text-blue-700 mb-4 flex items-center gap-2">
                <Icon icon="mdi:office-building" className="w-5 h-5" />
                Secretary General (Sekjen)
              </h3>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 max-w-md">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-gray-600" />
                  </div>
                  <p className="font-medium text-gray-900 text-sm">{leadership.secretary.name}</p>
                </div>
              </div>
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
