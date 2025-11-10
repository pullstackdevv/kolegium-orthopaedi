import { useState } from "react";
import { Link } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { Users, Calendar, ChevronRight, ChevronLeft } from "lucide-react";
import HomepageLayout from "../Layouts/HomepageLayout";

export default function PeerGroup() {
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

  const boardMembers = [
    { name: "Dr. H. Djapar A.L. Tadjudin, Sp.OT(K)" },
    { name: "Prof. Dr. Zairin Noor, Sp.OT(K)" },
    { name: "Dr. Heri Suroto, Sp.OT(K)" },
    { name: "Dr. Lukito Budiono, Sp.OT(K)" },
    { name: "Dr. Wieke Suciawati, Sp.OT(K)" },
    { name: "Dr. Riana Wardany Pribadi, Sp.OT(K)" }
  ];

  const allFellowships = [
    // RSUD Dr. Saiful Anwar Malang
    { no: 1, organizer: "RSUD Dr. Saiful Anwar Malang", name: "dr. Hamzah, SpOT", specialty: "Spine", year: "Desember 2023", status: "LULUS", statusColor: "bg-green-500" },
    { no: 2, organizer: "RSUD Dr. Saiful Anwar Malang", name: "dr. Aditya Jaya Manggala, SpOT", specialty: "Spine", year: "Desember 2023", status: "LULUS", statusColor: "bg-green-500" },
    { no: 3, organizer: "RSUD Dr. Saiful Anwar Malang", name: "dr. Hidayat, SpOT", specialty: "Spine", year: "Februari 2024", status: "LULUS", statusColor: "bg-green-500" },
    { no: 4, organizer: "RSUD Dr. Saiful Anwar Malang", name: "dr. Teuku Arief Dian, SpOT", specialty: "Spine", year: "Februari 2024", status: "LULUS", statusColor: "bg-green-500" },
    { no: 5, organizer: "RSUD Dr. Saiful Anwar Malang", name: "dr. Rudy, SpOT", specialty: "Spine", year: "Agustus 2024", status: "LULUS", statusColor: "bg-green-500" },
    { no: 6, organizer: "RSUD Dr. Saiful Anwar Malang", name: "dr. Andi Firman Mubarak, SpOT", specialty: "Spine", year: "Agustus 2024", status: "LULUS", statusColor: "bg-green-500" },
    { no: 7, organizer: "RSUD Dr. Saiful Anwar Malang", name: "dr. Paul Jonathan, SpOT", specialty: "Spine", year: "Agustus 2024", status: "LULUS", statusColor: "bg-green-500" },
    { no: 8, organizer: "RSUD Dr. Saiful Anwar Malang", name: "dr. Abdul Waris Imran, SpOT", specialty: "Spine", year: "Februari 2025", status: "-", statusColor: "bg-blue-500" },
    { no: 9, organizer: "RSUD Dr. Saiful Anwar Malang", name: "dr. Hendar Nugrahadi Priambodo, SpOT", specialty: "Spine", year: "Februari 2025", status: "-", statusColor: "bg-blue-500" },
    { no: 10, organizer: "RSUD Dr. Saiful Anwar Malang", name: "dr. Umar Kharisma Islami, SpOT", specialty: "Spine", year: "Februari 2025", status: "-", statusColor: "bg-blue-500" },
    { no: 11, organizer: "RSUD Dr. Saiful Anwar Malang", name: "dr. Pradana Wijayanta, SpOT", specialty: "Spine", year: "Februari 2025", status: "-", statusColor: "bg-blue-500" },
    { no: 12, organizer: "RSUD Dr. Saiful Anwar Malang", name: "dr. Adimas Nofrianto Bayuadji, SpOT", specialty: "Spine", year: "Agustus 2025", status: "-", statusColor: "bg-blue-500" },
    { no: 13, organizer: "RSUD Dr. Saiful Anwar Malang", name: "dr. David Kalim, SpOT", specialty: "Spine", year: "Agustus 2025", status: "-", statusColor: "bg-blue-500" },
    
    // RSUP Dr. Sardjito Yogyakarta
    { no: 14, organizer: "RSUP Dr. Sardjito Yogyakarta", name: "dr. Adrianto Prasetyo Perbowo, SpOT", specialty: "Spine", year: "Februari 2025", status: "-", statusColor: "bg-blue-500" },
    { no: 15, organizer: "RSUP Dr. Sardjito Yogyakarta", name: "dr. Aryo Budiyogo Andryanto, SpOT", specialty: "Spine", year: "Februari 2025", status: "-", statusColor: "bg-blue-500" },
    { no: 16, organizer: "RSUP Dr. Sardjito Yogyakarta", name: "dr. Jodhy Mayangkoro M., SpOT", specialty: "Hip Knee", year: "Februari 2025", status: "-", statusColor: "bg-blue-500" },
    { no: 17, organizer: "RSUP Dr. Sardjito Yogyakarta", name: "dr. Ainun Naim Sp.OT", specialty: "Spine", year: "Agustus 2025", status: "-", statusColor: "bg-blue-500" },
    { no: 18, organizer: "RSUP Dr. Sardjito Yogyakarta", name: "dr. Haris Dwi Khoirur Rofiq, Sp.OT., Mked.Klin", specialty: "Oncology", year: "Agustus 2025", status: "-", statusColor: "bg-blue-500" },
    { no: 19, organizer: "RSUP Dr. Sardjito Yogyakarta", name: "dr. Sinung Bawono, Sp.OT, M.Biomed", specialty: "Hip Knee", year: "Agustus 2025", status: "-", statusColor: "bg-blue-500" },
    
    // RSUD Dr. Moewardi Solo
    { no: 20, organizer: "RSUD Dr. Moewardi Solo", name: "dr. Gana Adyaksa, Sp.O.T", specialty: "Orthopaedic Oncology & Reconstruction", year: "Februari 2025", status: "-", statusColor: "bg-blue-500" },
    
    // RSUP Dr. Hasan Sadikin Bandung
    { no: 21, organizer: "RSUP Dr. Hasan Sadikin Bandung", name: "dr. Ida Bagus Gede Darma W, M. Biomed, SpOT", specialty: "Sports Injury", year: "Des 23", status: "-", statusColor: "bg-blue-500" },
    { no: 22, organizer: "RSUP Dr. Hasan Sadikin Bandung", name: "dr. Muhammad Pandu Nugraha, SpOT", specialty: "Shoulder & Elbow", year: "Des 23", status: "-", statusColor: "bg-blue-500" },
    { no: 23, organizer: "RSUP Dr. Hasan Sadikin Bandung", name: "dr. Priscilla, SpOT", specialty: "Advanced Orthopaedic Trauma", year: "Des 23", status: "-", statusColor: "bg-blue-500" },
    { no: 24, organizer: "RSUP Dr. Hasan Sadikin Bandung", name: "dr. Dionysius Bramta Putra M., SpOT", specialty: "Hand, Upper Limb and Microsurgery", year: "24-Feb", status: "-", statusColor: "bg-blue-500" },
    { no: 25, organizer: "RSUP Dr. Hasan Sadikin Bandung", name: "dr. Alam Rahmat Kusnadi, SpOT", specialty: "Hand, Upper Limb and Microsurgery", year: "24-Feb", status: "-", statusColor: "bg-blue-500" },
    { no: 26, organizer: "RSUP Dr. Hasan Sadikin Bandung", name: "dr. Ameria Pribadi, SpOT", specialty: "Hand, Upper Limb and Microsurgery", year: "24-Feb", status: "-", statusColor: "bg-blue-500" },
    { no: 27, organizer: "RSUP Dr. Hasan Sadikin Bandung", name: "dr. Mirna Phandu, SpOT", specialty: "Pediatric Orthopaedic", year: "24-Feb", status: "-", statusColor: "bg-blue-500" },
    { no: 28, organizer: "RSUP Dr. Hasan Sadikin Bandung", name: "dr. Ricky Wibowo, SpOT", specialty: "Sports Injury", year: "24-Feb", status: "-", statusColor: "bg-blue-500" },
    { no: 29, organizer: "RSUP Dr. Hasan Sadikin Bandung", name: "dr. Bagus Iman Brilianto, SpOT", specialty: "Foot and Ankle", year: "24-Feb", status: "-", statusColor: "bg-blue-500" },
    { no: 30, organizer: "RSUP Dr. Hasan Sadikin Bandung", name: "dr. Charles Apulta Meliala, SpOT", specialty: "Foot and Ankle", year: "24-Feb", status: "-", statusColor: "bg-blue-500" },
    { no: 31, organizer: "RSUP Dr. Hasan Sadikin Bandung", name: "dr. Amir Purnama Sidi, SpOT", specialty: "Shoulder and Elbow", year: "24-Feb", status: "-", statusColor: "bg-blue-500" },
    { no: 32, organizer: "RSUP Dr. Hasan Sadikin Bandung", name: "dr. Dadan Gardea Gandadikusumah, SpOT", specialty: "Advanced Orthopaedic Trauma", year: "24-Feb", status: "Tidak lanjut pendidikan", statusColor: "bg-red-500" },
    { no: 33, organizer: "RSUP Dr. Hasan Sadikin Bandung", name: "dr. Daffodilone Cahyadi, SpOT", specialty: "Sports Injury", year: "Ags 24", status: "-", statusColor: "bg-blue-500" },
    { no: 34, organizer: "RSUP Dr. Hasan Sadikin Bandung", name: "dr. Aldico Sapardan, SpOT", specialty: "Sports Injury", year: "Ags 24", status: "-", statusColor: "bg-blue-500" },
    { no: 35, organizer: "RSUP Dr. Hasan Sadikin Bandung", name: "dr. Zuwanda, SpOT", specialty: "Spine", year: "25-Feb", status: "-", statusColor: "bg-blue-500" },
    { no: 36, organizer: "RSUP Dr. Hasan Sadikin Bandung", name: "dr. I Wayan Agus Darmawan, SpOT", specialty: "Spine", year: "25-Feb", status: "-", statusColor: "bg-blue-500" },
    { no: 37, organizer: "RSUP Dr. Hasan Sadikin Bandung", name: "dr. Kemas Abdul Mutholib Luthfi, SpOT", specialty: "Spine", year: "25-Feb", status: "-", statusColor: "bg-blue-500" },
    { no: 38, organizer: "RSUP Dr. Hasan Sadikin Bandung", name: "dr. Rizky Priambodo Wisnubaroto, SpOT", specialty: "Sports Injury", year: "25-Feb", status: "-", statusColor: "bg-blue-500" },
    { no: 39, organizer: "RSUP Dr. Hasan Sadikin Bandung", name: "dr. Faisal Rahman, SpOT", specialty: "Foot and Ankle", year: "25-Feb", status: "-", statusColor: "bg-blue-500" },
    { no: 40, organizer: "RSUP Dr. Hasan Sadikin Bandung", name: "dr. Felais Hediyanto Pradana, SpOT", specialty: "Shoulder & Elbow", year: "25-Feb", status: "-", statusColor: "bg-blue-500" },
    { no: 41, organizer: "RSUP Dr. Hasan Sadikin Bandung", name: "dr. Zainarda, SpOT", specialty: "Hand, Upper Limb and Microsurgery", year: "25-Feb", status: "-", statusColor: "bg-blue-500" },
    { no: 42, organizer: "RSUP Dr. Hasan Sadikin Bandung", name: "dr. Claudia Santosa, SpOT", specialty: "Hand, Upper Limb and Microsurgery", year: "25-Feb", status: "-", statusColor: "bg-blue-500" },
    { no: 43, organizer: "RSUP Dr. Hasan Sadikin Bandung", name: "dr. Anak Agung Gede Putra Prameswara, SpOT", specialty: "Advanced Orthopaedic Trauma", year: "25-Feb", status: "-", statusColor: "bg-blue-500" },
    { no: 44, organizer: "RSUP Dr. Hasan Sadikin Bandung", name: "dr. Erich Svante Subagio, SpOT", specialty: "Foot and Ankle", year: "Ags 25", status: "-", statusColor: "bg-blue-500" },
    { no: 45, organizer: "RSUP Dr. Hasan Sadikin Bandung", name: "dr. Sagitha Indryana, M.Biomed, SpOT", specialty: "Sports Injury", year: "Ags 25", status: "-", statusColor: "bg-blue-500" },
    { no: 46, organizer: "RSUP Dr. Hasan Sadikin Bandung", name: "dr. Venansius Hery Perdana Suryanta, SpOT", specialty: "Sports Injury", year: "Ags 25", status: "-", statusColor: "bg-blue-500" },
    { no: 47, organizer: "RSUP Dr. Hasan Sadikin Bandung", name: "dr. Sudaryanto, SpOT", specialty: "Pediatric Orthopaedic", year: "Ags 25", status: "-", statusColor: "bg-blue-500" },
    { no: 48, organizer: "RSUP Dr. Hasan Sadikin Bandung", name: "dr. Wendy Yolanda Rosa, SpOT", specialty: "Advanced Orthopaedic Trauma", year: "Ags 25", status: "-", statusColor: "bg-blue-500" },
    { no: 49, organizer: "RSUP Dr. Hasan Sadikin Bandung", name: "dr. Yanuar Kristianto, SpOT", specialty: "Spine", year: "Ags 25", status: "-", statusColor: "bg-blue-500" },
    { no: 50, organizer: "RSUP Dr. Hasan Sadikin Bandung", name: "dr. Hendra, M.Ked(Surg), SpOT", specialty: "Spine", year: "Ags 25", status: "-", statusColor: "bg-blue-500" }
  ];

  // Pagination logic
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
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-blue-700">Clinical Fellowship Members</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} members
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Show:</label>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <span className="text-sm text-gray-600">entries</span>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">No</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Penyelenggara</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Nama</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Peminatan</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Tahun Masuk</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Ket</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {fellowships.map((fellow, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{fellow.no}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{fellow.organizer}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{fellow.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{fellow.specialty}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{fellow.year}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`${fellow.statusColor} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
                          {fellow.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} entries
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      // Show first page, last page, current page, and pages around current
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                              currentPage === page
                                ? "bg-blue-600 text-white"
                                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {page}
                          </button>
                        );
                      } else if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return (
                          <span key={page} className="px-2 text-gray-500">
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </HomepageLayout>
  );
}
