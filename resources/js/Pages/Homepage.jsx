import { Link } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { 
  FileText, 
  Users, 
  BookOpen, 
  Award,
  Calendar,
  MapPin,
  ChevronRight
} from "lucide-react";
import HomepageLayout from "../Layouts/HomepageLayout";
import DonutChart from "../components/DonutChart";

export default function Homepage() {
  // Stats data
  const stats = [
    { icon: "mdi:home", value: "385", label: "Residen Active" },
    { icon: "mdi:account", value: "385", label: "Fellow Active" },
    { icon: "mdi:school", value: "385", label: "Trainee Active" },
    { icon: "mdi:bank", value: "385", label: "Study Program" }
  ];

  // Upcoming Examination
  const examinations = [
    { 
      date: "18 Nov 2025", 
      status: "Unas Lokal", 
      statusColor: "bg-red-500",
      title: "Pre-exam PPDS 1", 
      location: "Auditorium RSUP" 
    },
    { 
      date: "18 Nov 2025", 
      status: "Internasional", 
      statusColor: "bg-green-500",
      title: "Konas PABOI 2026 - Pengumuman Lokasi", 
      location: "Jakarta Convention Center" 
    },
    { 
      date: "18 Nov 2025", 
      status: "Unas Lokal", 
      statusColor: "bg-red-500",
      title: "Seminar Mikrochirurgi", 
      location: "RS Pendidikan" 
    }
  ];

  // Upcoming Event
  const events = [
    { 
      date: "11", 
      month: "NOV",
      title: "23 National Congress",
      description: "We'll get you directly seated and inside for you to enjoy the show."
    },
    { 
      date: "11", 
      month: "NOV",
      title: "23 National Congress",
      description: "We'll get you directly seated and inside for you to enjoy the show."
    },
    { 
      date: "11", 
      month: "NOV",
      title: "23 National Congress",
      description: "We'll get you directly seated and inside for you to enjoy the show."
    }
  ];

  // Educational Dashboard Programs
  const programs = [
    {
      id: "P1",
      badge: "PPDS 1",
      description: "Program pendidikan dokter spesialis pertama untuk Orthopaedi — fokus pada ortopedi umum & trauma.",
      students: "120",
      charts: [
        {
          title: "13 Prodi",
          data: [
            { name: 'Lulus', value: 20 },
            { name: 'Tidak Lulus', value: 15 },
            { name: 'Belum', value: 10 },
            { name: 'Pending', value: 8 }
          ],
          colors: ['#3b82f6', '#ef4444', '#ec4899', '#f59e0b'],
          legends: [
            { label: 'FK UI', value: 20 },
            { label: 'FK UGM', value: 20 },
            { label: 'FK UNPAD', value: 20 },
            { label: 'FK UNAIR', value: 20 },
            { label: 'FK UNAS', value: 20 },
            { label: 'FK UNDIP', value: 20 }
          ],
          legendsRight: [
            { label: 'FK UI', value: 20 },
            { label: 'FK UGM', value: 20 },
            { label: 'FK UNPAD', value: 20 },
            { label: 'FK UNAIR', value: 20 },
            { label: 'FK UNAS', value: 20 },
            { label: 'FK UNDIP', value: 20 }
          ],
          total: 120
        },
        {
          title: "Semester",
          data: [
            { name: 'Semester 1', value: 30 },
            { name: 'Semester 2', value: 25 },
            { name: 'Semester 3', value: 20 },
            { name: 'Semester 4', value: 15 }
          ],
          colors: ['#ec4899', '#8b5cf6', '#06b6d4', '#10b981'],
          legends: [
            { label: 'Semester 1', value: 30 },
            { label: 'Semester 2', value: 25 },
            { label: 'Semester 3', value: 20 },
            { label: 'Semester 4', value: 15 }
          ],
          total: 90
        },
        {
          title: "Gender",
          data: [
            { name: 'Male', value: 70 },
            { name: 'Female', value: 50 }
          ],
          colors: ['#3b82f6', '#93c5fd'],
          legends: [
            { label: 'Male', value: 70 },
            { label: 'Female', value: 50 }
          ],
          total: 120
        },
        {
          title: "Graduate",
          data: [
            { name: 'Graduate', value: 80 },
            { name: 'Non Graduate', value: 40 }
          ],
          colors: ['#10b981', '#86efac'],
          legends: [
            { label: 'Graduate', value: 80 },
            { label: 'Non Graduate', value: 40 }
          ],
          total: 120
        }
      ]
    },
    {
      id: "CF",
      badge: "Clinical Fellowship",
      description: "Program fellowship untuk subspesialisasi & pendidikan lanjutan.",
      students: "30",
      charts: [
        {
          title: "4 Penyelenggara",
          data: [
            { name: 'RSUP 1', value: 20 },
            { name: 'RSUP 2', value: 20 },
            { name: 'RSUP 3', value: 20 },
            { name: 'RSUP 4', value: 20 }
          ],
          colors: ['#10b981', '#86efac', '#34d399', '#6ee7b7'],
          legends: [
            { label: 'RSUP Dr. Sardjito', value: 20 },
            { label: 'RSUD Dr. Saiful Anwar Malang', value: 20 },
            { label: 'RSUD Dr. Moewardi Solo', value: 20 },
            { label: 'RSUP Dr. Hasan Sadikin Bandung', value: 20 }
          ],
          total: 80
        },
        {
          title: "Specialties",
          data: [
            { name: 'Spine', value: 15 },
            { name: 'Sports', value: 12 },
            { name: 'Hand', value: 10 },
            { name: 'Pediatric', value: 8 },
            { name: 'Tumor', value: 8 },
            { name: 'Foot & Ankle', value: 7 }
          ],
          colors: ['#3b82f6', '#ef4444', '#ec4899', '#f59e0b', '#8b5cf6', '#06b6d4'],
          legends: [
            { label: 'Spine', value: 15 },
            { label: 'Sports', value: 12 },
            { label: 'Hand', value: 10 },
            { label: 'Pediatric', value: 8 },
            { label: 'Tumor', value: 8 },
            { label: 'Foot & Ankle', value: 7 }
          ],
          total: 60
        },
        {
          title: "Gender",
          data: [
            { name: 'Male', value: 18 },
            { name: 'Female', value: 12 }
          ],
          colors: ['#3b82f6', '#93c5fd'],
          legends: [
            { label: 'Male', value: 18 },
            { label: 'Female', value: 12 }
          ],
          total: 30
        },
        {
          title: "Graduate",
          data: [
            { name: 'Graduate', value: 22 },
            { name: 'Non Graduate', value: 8 }
          ],
          colors: ['#10b981', '#86efac'],
          legends: [
            { label: 'Graduate', value: 22 },
            { label: 'Non Graduate', value: 8 }
          ],
          total: 30
        }
      ]
    },
    {
      id: "SP",
      badge: "Subspesialis",
      description: "Program lanjutan untuk Traumatologi — manajemen trauma & rekonstruksi.",
      students: "50",
      charts: [
        {
          title: "8 Subspesialis",
          data: [
            { name: 'Sub 1', value: 10 },
            { name: 'Sub 2', value: 10 }
          ],
          colors: ['#ef4444', '#fca5a5'],
          legends: [
            { label: 'Sp 1', value: 10 },
            { label: 'Sp 2', value: 10 }
          ],
          total: 20
        },
        {
          title: "Specialties",
          data: [
            { name: 'Type 1', value: 12 },
            { name: 'Type 2', value: 10 },
            { name: 'Type 3', value: 8 },
            { name: 'Type 4', value: 7 },
            { name: 'Type 5', value: 6 },
            { name: 'Type 6', value: 5 }
          ],
          colors: ['#3b82f6', '#ef4444', '#ec4899', '#f59e0b', '#8b5cf6', '#06b6d4'],
          legends: [
            { label: 'Adult Recon', value: 12 },
            { label: 'Spine', value: 10 },
            { label: 'Hand', value: 8 },
            { label: 'Pediatric', value: 7 },
            { label: 'Sports', value: 6 },
            { label: 'Tumor', value: 5 }
          ],
          total: 48
        },
        {
          title: "Gender",
          data: [
            { name: 'Male', value: 30 },
            { name: 'Female', value: 20 }
          ],
          colors: ['#3b82f6', '#93c5fd'],
          legends: [
            { label: 'Male', value: 30 },
            { label: 'Female', value: 20 }
          ],
          total: 50
        },
        {
          title: "Graduate",
          data: [
            { name: 'Graduate', value: 35 },
            { name: 'Non Graduate', value: 15 }
          ],
          colors: ['#10b981', '#86efac'],
          legends: [
            { label: 'Graduate', value: 35 },
            { label: 'Non Graduate', value: 15 }
          ],
          total: 50
        }
      ]
    }
  ];


  const chartColors = ['#3b82f6', '#ef4444', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6'];

  return (
    <HomepageLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 py-20 sm:py-32 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-blue-900/50 z-10"></div>
          <img 
            src="/assets/images/Rectangle 3.png" 
            alt="Background"
            className="w-full h-full object-cover opacity-30"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-white">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                E-Dashboard Indonesian Orthopaedic and Traumatology Education
              </h1>
              <p className="text-base sm:text-lg leading-relaxed max-w-xl opacity-90">
                Memberikan informasi yang terbuka, aktual, dan akurat. Meningkatkan integrasi informasi akademik & kegiatan ilmiah melalui satu pintu.
              </p>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <img 
                  src="/assets/images/Rectangle 3.png" 
                  alt="Indonesian Orthopaedic Team"
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div class="bg-gradient-to-br from-blue-100 to-blue-200 p-16 flex items-center justify-center h-80"><svg class="w-32 h-32 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg></div>';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-2 cursor-pointer group"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <Icon icon={stat.icon} className="w-10 h-10" />
                  </div>
                  <div className="text-5xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {stat.value}
                  </div>
                  <p className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Examination Section */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Upcoming Examination</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {examinations.map((exam, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 font-medium">{exam.date} •</span>
                    <span className={`${exam.statusColor} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
                      {exam.status}
                    </span>
                  </div>
                  <Link 
                    href="#" 
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm transition"
                  >
                    Detail
                  </Link>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {exam.title}
                </h3>
                <p className="text-sm text-gray-600">{exam.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Event Section */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Upcoming Event</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((event, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 group">
                {/* Event Poster */}
                <div className="relative bg-gradient-to-br from-red-700 to-red-900 h-56 overflow-hidden">
                  {/* Decorative Header */}
                  <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-r from-red-800 via-green-600 to-blue-600 opacity-80"></div>
                  
                  {/* Logo & Content */}
                  <div className="relative h-full flex flex-col items-center justify-center p-6">
                    {/* Logo Area */}
                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-lg mb-4 flex items-center justify-center border-4 border-yellow-500 shadow-lg">
                      <Icon icon="mdi:medical-bag" className="w-12 h-12 text-white" />
                    </div>
                    
                    {/* Event Title */}
                    <h3 className="text-3xl font-bold text-white text-center mb-2 tracking-wide">
                      NATIONAL<br/>CONGRESS
                    </h3>
                    
                    {/* Organization */}
                    <div className="bg-yellow-500 text-gray-900 px-4 py-1 rounded-full text-xs font-bold mt-2">
                      INDONESIAN ORTHOPAEDIC ASSOCIATION
                    </div>
                  </div>
                  
                  {/* Date Badge */}
                  <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 text-center shadow-xl">
                    <div className="text-xs text-gray-600 font-semibold uppercase">{event.month}</div>
                    <div className="text-3xl font-bold text-gray-900">{event.date}</div>
                  </div>
                </div>
                
                {/* Event Details */}
                <div className="p-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {event.title}
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Educational Dashboard Section */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Educational Dashboard</h2>
          <div className="space-y-8">
            {programs.map((program, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="p-6 lg:p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Column 1: Program Info - 3 cols */}
                    <div className="lg:col-span-3 space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-md text-base font-bold">
                          {program.id}
                        </span>
                        <span className="text-lg font-bold text-gray-900">{program.badge}</span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{program.description}</p>
                      <p className="text-sm text-gray-900">
                        <span className="text-gray-600">Mahasiswa Aktif:</span> <span className="font-bold">{program.students}</span>
                      </p>
                    </div>
                    
                    {/* Column 2-4: 4 Chart Cards in 2x2 Grid - 9 cols */}
                    <div className="lg:col-span-9">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {program.charts.map((chart, chartIdx) => (
                          <div key={chartIdx} className="bg-gray-50 border border-gray-200 rounded-xl p-5 hover:bg-white hover:shadow-md transition-all duration-300">
                            <h3 className="font-bold text-gray-900 mb-4 text-center">{chart.title}</h3>
                            <div className="flex justify-center mb-4">
                              <DonutChart 
                                data={chart.data}
                                colors={chart.colors}
                                centerText={chart.title}
                                size={140}
                              />
                            </div>
                            {/* Legend */}
                            <div className="space-y-1.5 text-xs">
                              {chart.legends.map((legend, legIdx) => (
                                <div key={legIdx} className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: chart.colors[legIdx % chart.colors.length] }}></div>
                                    <span className="text-gray-700">{legend.label}</span>
                                  </div>
                                  <span className="font-semibold text-gray-900">{legend.value}</span>
                                </div>
                              ))}
                            </div>
                            <div className="mt-3 pt-2 border-t border-gray-200 flex items-center justify-between text-xs font-bold">
                              <span className="text-gray-700">Total</span>
                              <span className="text-gray-900">{chart.total}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </HomepageLayout>
  );
}