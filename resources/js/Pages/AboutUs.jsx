import { Link } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { Mail, Phone, MapPin, Globe } from "lucide-react";
import HomepageLayout from "../Layouts/HomepageLayout";

export default function AboutUs() {
  // Board Members Data - Top Row (5 members)
  const topBoardMembers = [
    {
      name: "Prof. Dr. dr. Bambang Prijambodo, Sp.B, Sp.OT.Subsp.OTB(K)",
      period: "1998 - 2002",
      image: "/assets/images/board/member-1.jpg"
    },
    {
      name: "Prof. Dr. dr. Bambang Prijambodo, Sp.B, Sp.OT.Subsp.OTB(K)",
      period: "1998 - 2002",
      image: "/assets/images/board/member-2.jpg"
    },
    {
      name: "Prof. Dr. dr. Bambang Prijambodo, Sp.B, Sp.OT.Subsp.OTB(K)",
      period: "1998 - 2002",
      image: "/assets/images/board/member-3.jpg"
    },
    {
      name: "Prof. Dr. dr. Bambang Prijambodo, Sp.B, Sp.OT.Subsp.OTB(K)",
      period: "1998 - 2002",
      image: "/assets/images/board/member-4.jpg"
    },
    {
      name: "Prof. Dr. dr. Bambang Prijambodo, Sp.B, Sp.OT.Subsp.OTB(K)",
      period: "1998 - 2002",
      image: "/assets/images/board/member-5.jpg"
    }
  ];

  // Board Members Data - Bottom Row (2 members)
  const bottomBoardMembers = [
    {
      name: "Prof. Dr. dr. Bambang Prijambodo, Sp.B, Sp.OT.Subsp.OTB(K)",
      period: "1998 - 2002",
      image: "/assets/images/board/member-6.jpg"
    },
    {
      name: "Prof. Dr. dr. Dwikora Novembri Utomo, Sp.OT.Subsp.PL(K)",
      period: "2022 - 2025",
      image: "/assets/images/board/member-7.jpg"
    }
  ];

  // Contact Information
  const contactInfo = {
    address: "Jl. Salemba Raya No. 6, Jakarta Pusat, DKI Jakarta 10430, Indonesia",
    email: "kolegium.orthopaedi@ui.ac.id",
    phone: "+62 21 391 0123",
    website: "www.kolegium-orthopaedi.or.id"
  };

  return (
    <HomepageLayout>
      {/* Breadcrumb */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-white text-sm">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <span>About Us</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Page Title */}
          {/* <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">College History</h1>
          </div> */}

          {/* Board Members Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-bold text-blue-700 mb-6">Board of Directors</h2>
            
            {/* Top Row - 5 Members */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 mb-6">
              {topBoardMembers.map((member, index) => (
                <div key={index} className="text-center">
                  <div className="w-24 h-32 mx-auto mb-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center overflow-hidden border-2 border-gray-300">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<div class="w-full h-full bg-blue-600 rounded-lg flex items-center justify-center"><svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg></div>';
                      }}
                    />
                  </div>
                  <p className="text-xs font-bold text-blue-600 mb-1">{member.period}</p>
                  <h3 className="text-[10px] text-gray-900 leading-tight px-1">
                    {member.name}
                  </h3>
                </div>
              ))}
            </div>
            
            {/* Bottom Row - 2 Members */}
            <div className="flex justify-center gap-6">
              {bottomBoardMembers.map((member, index) => (
                <div key={index} className="text-center">
                  <div className="w-24 h-32 mx-auto mb-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center overflow-hidden border-2 border-gray-300">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<div class="w-full h-full bg-blue-600 rounded-lg flex items-center justify-center"><svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg></div>';
                      }}
                    />
                  </div>
                  <p className="text-xs font-bold text-blue-600 mb-1">{member.period}</p>
                  <h3 className="text-[10px] text-gray-900 leading-tight px-1">
                    {member.name}
                  </h3>
                </div>
              ))}
            </div>
          </div>

          {/* Committee Formation History */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            {/* Description */}
            <div className="mb-6 p-4 border-l-4 border-blue-600 bg-blue-50">
              <p className="text-sm text-gray-700 leading-relaxed">
                Before the formation of the Indonesian Orthopaedic and Traumatology College, it was called the <strong>Permanent Committee for Qualification Examinations</strong>, where this Committee was tasked with organizing the National Board Orthopaedic Examination for Orthopaedic and Traumatology PPDS throughout Indonesia, with a list of positions as a Committee before the formation of the College, as follows:
              </p>
            </div>

            {/* Committee Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1 - Single member */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-5 border border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  <span className="text-lg font-bold text-blue-700">1988</span>
                </div>
                <h3 className="text-base font-bold text-blue-700 mb-3">
                  Standing Committee for Examination & Qualification
                </h3>
                <div className="space-y-2">
                  <div className="flex">
                    <span className="text-sm font-semibold text-gray-700 w-24">Head</span>
                    <span className="text-sm text-gray-800">dr. Soelarto Reksoprodjo, SpB, SpOT</span>
                  </div>
                </div>
              </div>

              {/* Card 2 - Two members */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-5 border border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  <span className="text-lg font-bold text-blue-700">1988</span>
                </div>
                <h3 className="text-base font-bold text-blue-700 mb-3">
                  Standing Committee for Examination & Qualification
                </h3>
                <div className="space-y-2">
                  <div className="flex">
                    <span className="text-sm font-semibold text-gray-700 w-24">Head</span>
                    <span className="text-sm text-gray-800">Dr. IP Sukarna, SpB, SpOT</span>
                  </div>
                  <div className="flex">
                    <span className="text-sm font-semibold text-gray-700 w-24">Secretary</span>
                    <span className="text-sm text-gray-800">r. Satrio, SpB, SpOT</span>
                  </div>
                </div>
              </div>

              {/* Card 3 - Two members */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-5 border border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  <span className="text-lg font-bold text-blue-700">1988</span>
                </div>
                <h3 className="text-base font-bold text-blue-700 mb-3">
                  Standing Committee for Examination & Qualification
                </h3>
                <div className="space-y-2">
                  <div className="flex">
                    <span className="text-sm font-semibold text-gray-700 w-24">Head</span>
                    <span className="text-sm text-gray-800">Dr. IP Sukarna, SpB, SpOT</span>
                  </div>
                  <div className="flex">
                    <span className="text-sm font-semibold text-gray-700 w-24">Secretary</span>
                    <span className="text-sm text-gray-800">r. Satrio, SpB, SpOT</span>
                  </div>
                </div>
              </div>

              {/* Card 4 - Two members */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-5 border border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  <span className="text-lg font-bold text-blue-700">1988</span>
                </div>
                <h3 className="text-base font-bold text-blue-700 mb-3">
                  Standing Committee for Examination & Qualification
                </h3>
                <div className="space-y-2">
                  <div className="flex">
                    <span className="text-sm font-semibold text-gray-700 w-24">Head</span>
                    <span className="text-sm text-gray-800">Dr. IP Sukarna, SpB, SpOT</span>
                  </div>
                  <div className="flex">
                    <span className="text-sm font-semibold text-gray-700 w-24">Secretary</span>
                    <span className="text-sm text-gray-800">r. Satrio, SpB, SpOT</span>
                  </div>
                </div>
              </div>

              {/* Card 5 - Two members */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-5 border border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  <span className="text-lg font-bold text-blue-700">1988</span>
                </div>
                <h3 className="text-base font-bold text-blue-700 mb-3">
                  Standing Committee for Examination & Qualification
                </h3>
                <div className="space-y-2">
                  <div className="flex">
                    <span className="text-sm font-semibold text-gray-700 w-24">Head</span>
                    <span className="text-sm text-gray-800">Dr. IP Sukarna, SpB, SpOT</span>
                  </div>
                  <div className="flex">
                    <span className="text-sm font-semibold text-gray-700 w-24">Secretary</span>
                    <span className="text-sm text-gray-800">r. Satrio, SpB, SpOT</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* College Chairs History Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            {/* Description */}
            <div className="mb-6 p-4 border-l-4 border-blue-600 bg-blue-50">
              <p className="text-sm text-gray-700 leading-relaxed">
                In 1998, the Indonesian Orthopaedic and Traumatology College was formed, with the following list of chairs:
              </p>
            </div>

            {/* Chairs Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1: 1998-2002 (2 members) */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-5 border border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  <span className="text-base font-bold text-blue-700">1998 – 2002</span>
                </div>
                <h3 className="text-sm font-bold text-blue-700 mb-3">
                  Indonesian Orthopaedic and Traumatology College
                </h3>
                <div className="space-y-1.5 text-xs">
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-28">Head</span>
                    <span className="text-gray-800">Dr. IP Sukarna, SpB, SpOT</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-28">Secretary</span>
                    <span className="text-gray-800">r. Satrio, SpB, SpOT</span>
                  </div>
                </div>
              </div>

              {/* Card 2: 1998-2002 (2 members) */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-5 border border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  <span className="text-base font-bold text-blue-700">1998 – 2002</span>
                </div>
                <h3 className="text-sm font-bold text-blue-700 mb-3">
                  Indonesian Orthopaedic and Traumatology College
                </h3>
                <div className="space-y-1.5 text-xs">
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-28">Head</span>
                    <span className="text-gray-800">Dr. IP Sukarna, SpB, SpOT</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-28">Secretary</span>
                    <span className="text-gray-800">r. Satrio, SpB, SpOT</span>
                  </div>
                </div>
              </div>

              {/* Card 3: 1998-2002 (2 members) */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-5 border border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  <span className="text-base font-bold text-blue-700">1998 – 2002</span>
                </div>
                <h3 className="text-sm font-bold text-blue-700 mb-3">
                  Indonesian Orthopaedic and Traumatology College
                </h3>
                <div className="space-y-1.5 text-xs">
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-28">Head</span>
                    <span className="text-gray-800">Dr. IP Sukarna, SpB, SpOT</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-28">Secretary</span>
                    <span className="text-gray-800">r. Satrio, SpB, SpOT</span>
                  </div>
                </div>
              </div>

              {/* Card 4: 1998-2002 (2 members) */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-5 border border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  <span className="text-base font-bold text-blue-700">1998 – 2002</span>
                </div>
                <h3 className="text-sm font-bold text-blue-700 mb-3">
                  Indonesian Orthopaedic and Traumatology College
                </h3>
                <div className="space-y-1.5 text-xs">
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-28">Head</span>
                    <span className="text-gray-800">Dr. IP Sukarna, SpB, SpOT</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-28">Secretary</span>
                    <span className="text-gray-800">r. Satrio, SpB, SpOT</span>
                  </div>
                </div>
              </div>

              {/* Card 5: 1998-2002 (3 members) */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-5 border border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  <span className="text-base font-bold text-blue-700">1998 – 2002</span>
                </div>
                <h3 className="text-sm font-bold text-blue-700 mb-3">
                  Indonesian Orthopaedic and Traumatology College
                </h3>
                <div className="space-y-1.5 text-xs">
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-28">Head</span>
                    <span className="text-gray-800">Dr. IP Sukarna, SpB, SpOT</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-28">Vice Chairman</span>
                    <span className="text-gray-800">r. Satrio, SpB, SpOT</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-28">Secretary</span>
                    <span className="text-gray-800">r. Satrio, SpB, SpOT</span>
                  </div>
                </div>
              </div>

              {/* Card 6: 1998-2002 (3 members) */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-5 border border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  <span className="text-base font-bold text-blue-700">1998 – 2002</span>
                </div>
                <h3 className="text-sm font-bold text-blue-700 mb-3">
                  Indonesian Orthopaedic and Traumatology College
                </h3>
                <div className="space-y-1.5 text-xs">
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-28">Head</span>
                    <span className="text-gray-800">Dr. IP Sukarna, SpB, SpOT</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-28">Vice Chairman</span>
                    <span className="text-gray-800">r. Satrio, SpB, SpOT</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-28">Secretary</span>
                    <span className="text-gray-800">r. Satrio, SpB, SpOT</span>
                  </div>
                </div>
              </div>

              {/* Card 7: 1998-2002 (3 members) */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-5 border border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  <span className="text-base font-bold text-blue-700">1998 – 2002</span>
                </div>
                <h3 className="text-sm font-bold text-blue-700 mb-3">
                  Indonesian Orthopaedic and Traumatology College
                </h3>
                <div className="space-y-1.5 text-xs">
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-28">Head</span>
                    <span className="text-gray-800">Dr. IP Sukarna, SpB, SpOT</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-28">Vice Chairman</span>
                    <span className="text-gray-800">r. Satrio, SpB, SpOT</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-28">Secretary</span>
                    <span className="text-gray-800">r. Satrio, SpB, SpOT</span>
                  </div>
                </div>
              </div>

              {/* Card 8: 1998-2002 (4 members) */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-5 border border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  <span className="text-base font-bold text-blue-700">1998 – 2002</span>
                </div>
                <h3 className="text-sm font-bold text-blue-700 mb-3">
                  Indonesian Orthopaedic and Traumatology College
                </h3>
                <div className="space-y-1.5 text-xs">
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-28">Head</span>
                    <span className="text-gray-800">Dr. IP Sukarna, SpB, SpOT</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-28">Vice Chairman</span>
                    <span className="text-gray-800">r. Satrio, SpB, SpOT</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-28">Secretary</span>
                    <span className="text-gray-800">r. Satrio, SpB, SpOT</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-28">Treasurer</span>
                    <span className="text-gray-800">Dr. Rizal Pohan, SpOT.Subsp.OTB(K)</span>
                  </div>
                </div>
              </div>

              {/* Card 9: Bulan Nop 2019 - Nop 2022 */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-5 border border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  <span className="text-base font-bold text-blue-700">Bulan Nop 2019 – Nop 2022</span>
                </div>
                <h3 className="text-sm font-bold text-blue-700 mb-3">
                  Indonesian Orthopaedic and Traumatology College
                </h3>
                <div className="space-y-1.5 text-xs">
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-28">Head</span>
                    <span className="text-gray-800">Prof. Dr. dr. Ferdiansyah, SpOT.Subsp.Onk.Ort.R(K)</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-28">Secretary</span>
                    <span className="text-gray-800">Dr. IshanIrmansyah, SpOT.Subsp.Onk.Ort.R(K)</span>
                  </div>
                </div>
              </div>

              {/* Card 10: Bulan Nop 2022 - Nop 2025 */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-5 border border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  <span className="text-base font-bold text-blue-700">Bulan Nop 2022 – Nop 2025</span>
                </div>
                <h3 className="text-sm font-bold text-blue-700 mb-3">
                  Indonesian Orthopaedic and Traumatology College
                </h3>
                <div className="space-y-1.5 text-xs">
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-28">Head</span>
                    <span className="text-gray-800">Prof. Dr. dr Dwikora Novembri Utomo, SpOT.Subsp.PL(K)</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-28">Vice Chairman</span>
                    <span className="text-gray-800">Dr. IshanIrmansyah, SpOT.Subsp.Onk.Ort.R(K)</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-28">Secretary</span>
                    <span className="text-gray-800">Dr. IshanIrmansyah, SpOT.Subsp.Onk.Ort.R(K)</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-28">Deputy Secretary</span>
                    <span className="text-gray-800">Dr. Yudha Mathan Sakti, SpOT.Subsp.OTB(K)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Organizational Structure Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-2">ORGANIZATIONAL STRUCTURE</h2>
              <h3 className="text-sm font-semibold text-blue-600 mb-4">
                Organizational Structure of the Indonesian Orthopaedic and Traumatology College for the 2022-2025 Period
              </h3>
            </div>

            {/* Main Structure Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
              {/* Board Column */}
              <div>
                <h4 className="text-sm font-bold text-red-600 mb-2">Board</h4>
                <p className="text-xs text-gray-700">Prof. Dr. dr. Dwikora Novembri Utomo, SpOT.Subsp.PL(K)</p>
              </div>

              {/* Deputy Board Column */}
              <div>
                <h4 className="text-sm font-bold text-red-600 mb-2">Deputy Board</h4>
                <p className="text-xs text-gray-700">Dr. dr. Asep Santoso, SpOT(K), M.Kes</p>
              </div>

              {/* General Column */}
              <div>
                <h4 className="text-sm font-bold text-red-600 mb-2">General</h4>
                <p className="text-xs text-gray-700">Dr. dr. Ismail Hadisoebroto Dilogo, SpOT(K)</p>
              </div>

              {/* Member Column */}
              <div>
                <h4 className="text-sm font-bold text-red-600 mb-2">Member</h4>
                <div className="space-y-1 text-xs text-gray-700">
                  <p>• Ketua Umum: Prof. Dr. dr. Dwikora Novembri Utomo, SpOT.Subsp.PL(K)</p>
                  <p>• Wakil Ketua Umum I: dr. Ferdiansyah, SpOT.Subsp.Onk.Ort.R(K)</p>
                  <p>• Wakil Ketua Umum II: dr. Ismail Hadisoebroto Dilogo, SpOT(K)</p>
                  <p>• Sekretaris Jenderal: dr. Ishan Irmansyah, SpOT.Subsp.Onk.Ort.R(K)</p>
                  <p>• Wakil Sekretaris Jenderal: dr. Yudha Mathan Sakti, SpOT.Subsp.OTB(K)</p>
                  <p>• Bendahara Umum: dr. Rizal Pohan, SpOT.Subsp.OTB(K)</p>
                  <p>• Wakil Bendahara Umum: dr. Achmad Fauzi Kamal, SpOT(K), M.Kes</p>
                </div>
              </div>
            </div>

            {/* Ketua/Dept/Staff Section */}
            <div className="mb-6">
              <h4 className="text-sm font-bold text-blue-700 mb-3">Ketua/Dept/Staff Orthopaedi & Traumatology & KPR/SPS</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-xs">
                <div>
                  <p className="font-semibold text-gray-900">FK - Jakarta</p>
                  <ul className="ml-4 space-y-0.5 text-gray-700">
                    <li>• Ketua Dept: Dr. dr. Ismail Hadisoebroto Dilogo, SpOT(K)</li>
                    <li>• KPS: dr. Andi Asadul Islam, SpOT(K)</li>
                    <li>• SPS: Mayun, dr. A. Sigit Maruto, SpOT.Subsp.OTB(K)</li>
                    <li>• Sekretaris: dr. Tri Kurniawati, SpOT(K), M.Biomed</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mt-2 md:mt-0">FK UNAIR - Surabaya</p>
                  <ul className="ml-4 space-y-0.5 text-gray-700">
                    <li>• Ketua Dept: Prof. Dr. dr. Ferdiansyah, SpOT.Subsp.Onk.Ort.R(K)</li>
                    <li>• KPS: Prof. Dr. dr. M. Hardian Basuki, SpOT(K)</li>
                    <li>• SPS: Dr. dr. Ishan Irmansyah, SpOT.Subsp.Onk.Ort.R(K)</li>
                    <li>• Sekretaris: dr. Yudha Mathan Sakti, SpOT.Subsp.OTB(K)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* FK Universities List */}
            <div className="mb-6">
              <h4 className="text-sm font-bold text-blue-700 mb-3">FK (Daftar) - Bandung</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1 text-xs text-gray-700">
                <div>
                  <p>• FK UNPAD - Bandung</p>
                  <p>• FK UNDIP - Semarang</p>
                  <p>• FK UNS - Solo</p>
                  <p>• FK UNIBRAW - Malang</p>
                  <p>• FK UNSRI - Palembang</p>
                  <p>• FK UNHAS - Makassar</p>
                  <p>• FK USU - Medan</p>
                </div>
                <div>
                  <p>• FK UNSYIAH - Banda Aceh</p>
                  <p>• FK UNAND - Padang</p>
                  <p>• FK UNLAM - Banjarmasin</p>
                  <p>• FK UNSRAT - Manado</p>
                  <p>• FK UNUD - Denpasar</p>
                  <p>• FK UGM - Yogyakarta</p>
                  <p>• FK UNSOED - Purwokerto</p>
                </div>
                <div>
                  <p>• FK UNISBA - Bandung</p>
                  <p>• FK UNIMUS - Semarang</p>
                  <p>• FK UNAND - Padang</p>
                  <p>• FK UNEJ - Jember</p>
                  <p>• FK UMY - Yogyakarta</p>
                  <p>• FK UMI - Makassar</p>
                  <p>• FK UMA - Medan</p>
                </div>
              </div>
            </div>

            {/* Commissions Section */}
            <div className="mb-6">
              <h4 className="text-sm font-bold text-red-600 mb-3">COMMISSIONS</h4>
              
              {/* Credentialing Commission */}
              <div className="mb-4">
                <h5 className="text-xs font-bold text-gray-900 mb-2">Credentialing Commission</h5>
                <ul className="ml-4 space-y-0.5 text-xs text-gray-700">
                  <li>• Ketua: Dr. dr. M. Hardian Basuki, SpOT(K) (Surabaya)</li>
                  <li>• Wakil: dr. A. R. Moekeni (Jakarta); dr. Achmad Fauzi Kamal, SpOT(K), M.Kes (Jakarta); dr. Lutfan</li>
                  <li>• Anggota: Prof. Dr. dr. Ferdiansyah, SpOT.Subsp.Onk.Ort.R(K) (Surabaya)</li>
                </ul>
              </div>

              {/* Quality Assurance Commission */}
              <div className="mb-4">
                <h5 className="text-xs font-bold text-gray-900 mb-2">Quality Assurance Commission</h5>
                <ul className="ml-4 space-y-0.5 text-xs text-gray-700">
                  <li>• Ketua: Prof. Dr. dr. M. Hardian Basuki, SpOT(K) (Surabaya)</li>
                  <li>• Wakil: dr. Tri Kurniawati, SpOT(K), M.Biomed (Jakarta)</li>
                  <li>• Anggota: Dr. dr. Ishan Irmansyah, SpOT.Subsp.Onk.Ort.R(K) (Surabaya)</li>
                </ul>
              </div>

              {/* National Competency Examination Commission */}
              <div className="mb-4">
                <h5 className="text-xs font-bold text-gray-900 mb-2">National Competency Examination Commission</h5>
                <ul className="ml-4 space-y-0.5 text-xs text-gray-700">
                  <li>• Ketua: Dr. dr. Ismail Hadisoebroto Dilogo, SpOT(K) (Jakarta)</li>
                  <li>• Wakil: dr. Yudha Mathan Sakti, SpOT.Subsp.OTB(K) (Surabaya)</li>
                  <li>• Anggota: Prof. Dr. dr. Ferdiansyah, SpOT.Subsp.Onk.Ort.R(K) (Surabaya)</li>
                </ul>
              </div>

              {/* Accreditation Commission */}
              <div className="mb-4">
                <h5 className="text-xs font-bold text-gray-900 mb-2">Accreditation Commission</h5>
                <ul className="ml-4 space-y-0.5 text-xs text-gray-700">
                  <li>• Ketua: Prof. Dr. dr. M. Hardian Basuki, SpOT(K) (Surabaya)</li>
                  <li>• Wakil: Dr. dr. Ismail Hadisoebroto Dilogo, SpOT(K) (Jakarta)</li>
                  <li>• Anggota: dr. Tri Kurniawati, SpOT(K), M.Biomed (Jakarta)</li>
                </ul>
              </div>

              {/* Scientific Communication Commission */}
              <div className="mb-4">
                <h5 className="text-xs font-bold text-gray-900 mb-2">Scientific Communication Commission</h5>
                <ul className="ml-4 space-y-0.5 text-xs text-gray-700">
                  <li>• Ketua: Dr. dr. Ishan Irmansyah, SpOT.Subsp.Onk.Ort.R(K) (Surabaya)</li>
                  <li>• Wakil: dr. Andi Asadul Islam, SpOT(K) (Jakarta)</li>
                  <li>• Anggota: dr. Yudha Mathan Sakti, SpOT.Subsp.OTB(K) (Surabaya)</li>
                </ul>
              </div>

              {/* Specialty Sub-training Commission */}
              <div className="mb-4">
                <h5 className="text-xs font-bold text-gray-900 mb-2">Specialty Sub-training Commission</h5>
                <ul className="ml-4 space-y-0.5 text-xs text-gray-700">
                  <li>• Ketua: Prof. Dr. dr. Ferdiansyah, SpOT.Subsp.Onk.Ort.R(K) (Surabaya)</li>
                  <li>• Wakil: Dr. dr. Ismail Hadisoebroto Dilogo, SpOT(K) (Jakarta)</li>
                  <li>• Anggota: dr. Achmad Fauzi Kamal, SpOT(K), M.Kes (Jakarta)</li>
                </ul>
              </div>

              {/* General Practitioners Education Commission */}
              <div className="mb-4">
                <h5 className="text-xs font-bold text-gray-900 mb-2">General Practitioners Education Commission</h5>
                <ul className="ml-4 space-y-0.5 text-xs text-gray-700">
                  <li>• Ketua: dr. Tri Kurniawati, SpOT(K), M.Biomed (Jakarta)</li>
                  <li>• Wakil: dr. Yudha Mathan Sakti, SpOT.Subsp.OTB(K) (Surabaya)</li>
                  <li>• Anggota: Dr. dr. Ishan Irmansyah, SpOT.Subsp.Onk.Ort.R(K) (Surabaya)</li>
                </ul>
              </div>

              {/* IT Commission */}
              <div>
                <h5 className="text-xs font-bold text-gray-900 mb-2">IT Commission – Digital Support of Education</h5>
                <ul className="ml-4 space-y-0.5 text-xs text-gray-700">
                  <li>• Ketua: dr. Andi Asadul Islam, SpOT(K) (Jakarta)</li>
                  <li>• Wakil: dr. Yudha Mathan Sakti, SpOT.Subsp.OTB(K) (Surabaya)</li>
                  <li>• Anggota: dr. Tri Kurniawati, SpOT(K), M.Biomed (Jakarta)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Organizational Structure 2024-2028 Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            {/* Title */}
            <h2 className="text-xl font-bold text-blue-700 text-center mb-8">
              ORGANIZATIONAL STRUCTURE OF THE COLLEGE OF ORTHOPAEDICS AND TRAUMATOLOGY FOR THE PERIOD 2024-2028
            </h2>

            {/* Structure Table */}
            <div className="space-y-6">
              {/* Head */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="md:col-span-2">
                  <h3 className="text-sm font-bold text-red-700">Head</h3>
                </div>
                <div className="md:col-span-3">
                  <p className="text-sm text-gray-800">dr. Yudha Mathan Sakti, Sp.OT.Subsp.OTB(K)</p>
                </div>
              </div>

              {/* Vice Chairman */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="md:col-span-2">
                  <h3 className="text-sm font-bold text-red-700">Vice Chairman</h3>
                </div>
                <div className="md:col-span-3">
                  <p className="text-sm text-gray-800">Dr. dr. R. Andri Primadhi, Sp.OT.Subsp.KP(K)</p>
                </div>
              </div>

              {/* Treasurer */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="md:col-span-2">
                  <h3 className="text-sm font-bold text-red-700">Treasurer</h3>
                </div>
                <div className="md:col-span-3">
                  <p className="text-sm text-gray-800">Dr. dr. Jainal Arifin, MKes, Sp.OT.Subsp.OTB(K)</p>
                </div>
              </div>

              {/* Head of Division 1 */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="md:col-span-2">
                  <h3 className="text-sm font-bold text-red-700">
                    Head of Division 1<br />
                    (Evaluation and Examination)
                  </h3>
                </div>
                <div className="md:col-span-3">
                  <p className="text-sm text-gray-800 mb-2">dr. M. Hardian Basuki, Sp.OT.Subsp.Onk.Ort.R(K)</p>
                  <div className="ml-4">
                    <p className="text-sm font-semibold text-red-700 mb-1">Members</p>
                    <ol className="list-decimal list-inside text-sm text-gray-800 space-y-0.5">
                      <li>dr. Teddy Heri Wardhana, Sp.OT.Subsp.TLBM(K)</li>
                      <li>dr. Teuku Nanta Aulia, Sp.OT.Subsp.OTB(K)</li>
                      <li>dr. Erwin Ardian, Sp.OT</li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Head of Division 2 */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="md:col-span-2">
                  <h3 className="text-sm font-bold text-red-700">
                    Head of Division 2<br />
                    (Curriculum)
                  </h3>
                </div>
                <div className="md:col-span-3">
                  <p className="text-sm text-gray-800 mb-2">Dr. dr. Renaldi Prasetia Hermawan Nagar Rasyid, Sp.OT.Subsp.OBS(K)</p>
                  <div className="ml-4">
                    <p className="text-sm font-semibold text-red-700 mb-1">Members</p>
                    <ol className="list-decimal list-inside text-sm text-gray-800 space-y-0.5">
                      <li>dr. Muhamad Naseh Sajadi Budi Irawan, Sp.OT.Subsp.Onk.Ort.R(K)</li>
                      <li>Dr. dr. Krisna Yuarno Phatama, SpOT.Subsp.PL(K)</li>
                      <li>dr. Pramono Ari Wibowo, SpOT.Subsp.TLBM(K)</li>
                      <li>dr. Aditya Fuad Robby Triangga, Sp.OT.Subsp.PL(K)</li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Head of Division 3 */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="md:col-span-2">
                  <h3 className="text-sm font-bold text-red-700">
                    Head of Division 3<br />
                    (Competency Development)
                  </h3>
                </div>
                <div className="md:col-span-3">
                  <p className="text-sm text-gray-800 mb-2">dr. Andhika Yudistira, Sp.OT.Subsp.OTB(K)</p>
                  <div className="ml-4">
                    <p className="text-sm font-semibold text-red-700 mb-1">Members</p>
                    <ol className="list-decimal list-inside text-sm text-gray-800 space-y-0.5">
                      <li>dr. Rhyan Darma Saputra, M.Kes, Sp.OT.Subsp.Onk.Ort.R(K)</li>
                      <li>dr. Asrafi Rizki Gatam, Sp.OT.Subsp.OTB(K)</li>
                      <li>dr. Galih Prasetya Sakadewa, Sp.OT</li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Head of Division 4 */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="md:col-span-2">
                  <h3 className="text-sm font-bold text-red-700">
                    Head of Division 4<br />
                    (Quality and Accreditation)
                  </h3>
                </div>
                <div className="md:col-span-3">
                  <p className="text-sm text-gray-800 mb-2">Dr. dr. Rizki Rahmadian, Sp.OT.Subsp.PL(K)</p>
                  <div className="ml-4">
                    <p className="text-sm font-semibold text-red-700 mb-1">Members</p>
                    <ol className="list-decimal list-inside text-sm text-gray-800 space-y-0.5">
                      <li>dr. Asep Santoso, Sp.OT.Subsp.PL(K), M.Kes</li>
                      <li>dr. Yoshi Pratama, Sp.OT.Subsp.PL(K)</li>
                      <li>dr. Yuni Artha Prabowo Putro, Sp.OT.Subsp.Onk.Ort.R(K)</li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Head of Area 5 */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="md:col-span-2">
                  <h3 className="text-sm font-bold text-red-700">
                    Head of Area 5<br />
                    (Membership and Cooperation)
                  </h3>
                </div>
                <div className="md:col-span-3">
                  <p className="text-sm text-gray-800 mb-2">Dr. dr. Ihsan Oesman, Sp.OT.Subsp.KP(K)</p>
                  <div className="ml-4">
                    <p className="text-sm font-semibold text-red-700 mb-1">Members</p>
                    <ol className="list-decimal list-inside text-sm text-gray-800 space-y-0.5">
                      <li>dr. Aga Shahri Putera Ketaren, Sp.OT.Subsp.TLBM(K)</li>
                      <li>dr. Mochammad Ridho Nur Hidayah, Sp.OT.Subsp.A(K)</li>
                      <li>dr. I Gusti Ngurah Paramartha Wijaya Putra, Sp.OT</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AD-ART Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-sm font-bold text-gray-600 mb-2">AD-ART</h2>
              <h3 className="text-lg font-bold text-blue-700">
                ART COLLEGE OF ORTHOPAEDICS & TRAUMATOLOGY INDONESIA
              </h3>
            </div>

            {/* Laws / Regulations */}
            <div className="mb-8">
              <h4 className="text-sm font-bold text-red-600 mb-3">LAWS / REGULATIONS</h4>
              <ul className="space-y-1 text-xs text-gray-700 ml-4">
                <li>• Law No. 20/2003 concerning the National Education System;</li>
                <li>• Law No. 29/2004 concerning Medical Practice Law;</li>
                <li>• Law No. 12/2012 concerning Higher Education;</li>
                <li>• Law No. 36/2014 concerning Health Workers;</li>
                <li>• Regulation of the Minister of Health No. 51/2013 concerning Basis of Structure</li>
              </ul>
            </div>

            {/* S.1 Execution Procedures */}
            <div className="mb-6">
              <h4 className="text-sm font-bold text-blue-700 mb-3">S.1 Execution Procedures/Regulations Guidelines</h4>
              
              <div className="space-y-4 ml-4">
                <div>
                  <p className="text-xs font-semibold text-gray-900">D.1.1</p>
                  <p className="text-xs text-gray-700 ml-4">The National College of Orthopaedics and Traumatology is a body formed by the Association of Indonesian Orthopaedic and Traumatology Specialist Doctors (PABOI)</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-900">D.1.2</p>
                  <p className="text-xs text-gray-700 ml-4">Orthopaedic and Traumatology Competency Standards are the standard competencies that must be achieved by an Orthopaedic Specialist in the Teaching Hospitals.</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-900">D.1.3</p>
                  <p className="text-xs text-gray-700 ml-4">The Professional Education Standards for Orthopaedic and Traumatology Specialists are the standards that must be held by the Infrastructure, Processes and Outcomes of the Professional Education Program.</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-900">D.1.4</p>
                  <p className="text-xs text-gray-700 ml-4">PPDS is an institution that implements a standard education program in Orthopaedics and Traumatology based on national curriculum policies with the education process taking place in teaching hospitals.</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-900">D.1.5</p>
                  <p className="text-xs text-gray-700 ml-4">The Orthopaedic and Traumatology National Exit Exam Collaborator is an institution appointed by the College in the PPDS National Exit Exam in collaboration with MKDKI, KKI, all Universities and Regulation from SK DIRJENDIKTI, Ministry, and Minister of Health.</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-900">D.1.6</p>
                  <p className="text-xs text-gray-700 ml-4">The College's Organizing Committee is the organizer of the Special Education Program and the Education and Training Program organized by the College of Orthopaedics and Traumatology.</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-900">D.1.7</p>
                  <p className="text-xs text-gray-700 ml-4">Accreditation of the Member as an Organizer of the Education of the Orthopaedic Specialist and Training Program based on the Ministerial Regulation of RI Orthopaedics.</p>
                </div>
              </div>
            </div>

            {/* S.1.2 Administrative Requirements */}
            <div className="mb-6">
              <h4 className="text-sm font-bold text-blue-700 mb-3">S.1.2 Administrative Requirements</h4>
              <div className="space-y-2 ml-4">
                <div>
                  <p className="text-xs font-semibold text-gray-900">S.1.2.1</p>
                  <p className="text-xs text-gray-700 ml-4">Graduates of Undergraduate Medicine and/or the equivalent Ministry may apply in accordance with the Regulation and Teaching Hospital and RI, the National Congress PABOI, and the regulations from the College.</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">S.1.2.2</p>
                  <p className="text-xs text-gray-700 ml-4">Indonesian Orthopaedic and Traumatology Specialists (PABOI) at the National Congress PABOI and the results of the vote will be changed by Decree of SK College Orthopaedics and Traumatology Indonesia.</p>
                </div>
              </div>
            </div>

            {/* S.1.3 Academic Requirements */}
            <div className="mb-6">
              <h4 className="text-sm font-bold text-blue-700 mb-3">S.1.3 Academic Requirements</h4>
              <div className="space-y-2 ml-4">
                <div>
                  <p className="text-xs font-semibold text-gray-900">S.1.3.1</p>
                  <p className="text-xs text-gray-700 ml-4">Completing curriculum education package for associated doctor and specialist consultation as referred to in Article 5 paragraph 1.</p>
                </div>
              </div>
            </div>

            {/* S.1.4 - S.1.6 */}
            <div className="mb-6 space-y-4 ml-4">
              <div>
                <p className="text-xs font-semibold text-gray-900">S.1.4</p>
                <p className="text-xs text-gray-700 ml-4">Creating accreditation regulations for Orthopedic and Traumatology educational programs including the implementation, institutional accreditation and program accreditation.</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-900">S.1.5</p>
                <p className="text-xs text-gray-700 ml-4">Provide supervision and quality assurance in the implementation of the Orthopaedic and Traumatology competencies.</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-900">S.1.5.2</p>
                <p className="text-xs text-gray-700 ml-4">Monitor and evaluate on a regular schedule or program educational institutions and reports in detail the results of the supervisory to the Board of Directors of the College of Orthopaedics and Traumatology.</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-900">S.1.5.3</p>
                <p className="text-xs text-gray-700 ml-4">Conducting Professional Development Education (PPDS).</p>
              </div>
            </div>

            {/* S.2 - S.2.3 */}
            <div className="mb-6">
              <div className="space-y-4 ml-4">
                <div>
                  <p className="text-xs font-semibold text-gray-900">S.2.1</p>
                  <p className="text-xs text-gray-700 ml-4">Helping in the preparation of Curriculum of Orthopaedics and Traumatology specialist in discrete and degree levels.</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">S.2.2</p>
                  <p className="text-xs text-gray-700 ml-4">Give rights in working out entry criteria.</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">S.2.3</p>
                  <p className="text-xs text-gray-700 ml-4">Preparing the National Competency Standards for Orthopaedic and Traumatology Curriculum Specialists.</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">S.2.3.1</p>
                  <p className="text-xs text-gray-700 ml-4">Create media on Examination on textual.</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">S.2.3.2</p>
                  <p className="text-xs text-gray-700 ml-4">Provision of a single window and education registration of the Board in College by SK/IABOI are valid according to Regulations MKDKI and KKI.</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">S.2.3.3</p>
                  <p className="text-xs text-gray-700 ml-4">Be responsible for quality information on textual.</p>
                </div>
              </div>
            </div>

            {/* S.3 - College */}
            <div className="mb-6">
              <h4 className="text-sm font-bold text-blue-700 mb-3">S.3 Board Member of The College of Orthopaedics and Traumatology College</h4>
              <div className="space-y-4 ml-4">
                <div>
                  <p className="text-xs font-semibold text-gray-900">S.3.1</p>
                  <p className="text-xs text-gray-700 ml-4">Establishing standards for competence education for specialist and degree with consultant.</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">S.3.2</p>
                  <p className="text-xs text-gray-700 ml-4">Formulating title of candidate.</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">S.3.3</p>
                  <p className="text-xs text-gray-700 ml-4">Facilitating and harmonizing the Professional education for Specialist Doctors and Consultant Specialists.</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">S.3.4</p>
                  <p className="text-xs text-gray-700 ml-4">Determining the development of re-consider, implement education.</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">S.3.5</p>
                  <p className="text-xs text-gray-700 ml-4">Prepare regulations and implement the Specialist professional education and consultant primary school and secondary.</p>
                </div>
              </div>
            </div>

            {/* S.4 Organizational Structure */}
            <div className="mb-6">
              <h4 className="text-sm font-bold text-blue-700 mb-3">S.4 Organizational Structure and Membership of the College of Orthopaedics & Traumatology</h4>
              <div className="space-y-4 ml-4">
                <div>
                  <p className="text-xs font-semibold text-gray-900">S.4.1</p>
                  <p className="text-xs text-gray-700 ml-4">The responsibilities of college consist of Jakaran area, Deputy Chairman(s), Secretary and treasurer.</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">S.4.2</p>
                  <p className="text-xs text-gray-700 ml-4">The Structure of Board Secretariat (for a period of 3 years) is formed by the Decree of Head of CONFERENCE, ratified at the time of College.</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">S.4.3</p>
                  <p className="text-xs text-gray-700 ml-4">The Board consist of those responsible for 4 areas due to the fine office of the above Board.</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">S.4.4</p>
                  <p className="text-xs text-gray-700 ml-4">The composition of the 5-Degree University of Professors based Doctors Holders, KPS, Full Time Faculty the Specialist Doctors and Consultant Specialists; Specialist Doctors who have Full Time in Educational Institutions.</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">S.4.5</p>
                  <p className="text-xs text-gray-700 ml-4">The Ministry and secretary of Ministration consisting of the field section.</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">S.4.6</p>
                  <p className="text-xs text-gray-700 ml-4">The Ministry and secretary of PPDS are part of the organizational structure.</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">S.4.7</p>
                  <p className="text-xs text-gray-700 ml-4">The board at the University level, chaired by the Head of the Governing University of Institute serving of the Department.</p>
                </div>
              </div>
            </div>

            {/* S.5 Divisional Members */}
            <div className="mb-6">
              <h4 className="text-sm font-bold text-blue-700 mb-3">S.5 Divisional of Members of the College of Orthopaedics and Traumatology</h4>
              <div className="space-y-4 ml-4">
                <div>
                  <p className="text-xs font-semibold text-gray-900">S.5.1</p>
                  <p className="text-xs text-gray-700 ml-4">The Membership of College will consist of all members of PABOI in Indonesia.</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">S.5.2</p>
                  <p className="text-xs text-gray-700 ml-4">Ex.</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">S.5.3</p>
                  <p className="text-xs text-gray-700 ml-4">Member of the College is bonded 3 (Three) elect in the first official organization.</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">S.5.3.1</p>
                  <p className="text-xs text-gray-700 ml-4">Obligation of membership in election towards one examination for the development level no.</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">S.5.4</p>
                  <p className="text-xs text-gray-700 ml-4">Duties and powers.</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">S.5.5</p>
                  <p className="text-xs text-gray-700 ml-4">Every active or relevant member of the Congress is entitled should attend a periodic meeting at the center of members (year one).</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">S.5.6</p>
                  <p className="text-xs text-gray-700 ml-4">Every active or relevant member of the Congress is entitled working to assist on line of life division in sales or other in the number of members (year one).</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">S.5.6.1</p>
                  <p className="text-xs text-gray-700 ml-4">Decisions are taken or manner of the Member exit comments. If there is no agreement, a voice will be heard.</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">S.5.6.2</p>
                  <p className="text-xs text-gray-700 ml-4">If there is no agreement each education agency institution is represented by one Voter. At the time the vote acquitted at the Chin of the College will conceal out by the Deputy Chair of the College of Collegium.</p>
                </div>
              </div>
            </div>

            {/* S.6 Financing */}
            <div className="mb-6">
              <h4 className="text-sm font-bold text-blue-700 mb-3">S.6 Financing</h4>
              <div className="space-y-2 ml-4">
                <div>
                  <p className="text-xs font-semibold text-gray-900">S.6.1</p>
                  <p className="text-xs text-gray-700 ml-4">The costs for carrying out the duties of the College are charged to the PABOI Budget.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </HomepageLayout>
  );
}
