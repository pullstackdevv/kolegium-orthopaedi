import { useEffect, useMemo, useState } from "react";
import { Link } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { MapPin, Phone, Mail, Globe } from "lucide-react";
import HomepageLayout from "../../Layouts/HomepageLayout";
import DonutChart from "../../components/DonutChart";
import api from "@/api/axios";

export default function UniversityDetail({ university, type }) {
  // Sample data - akan diganti dengan data dari props/API
  const universityData = university || {
    id: "fk-ui",
    name: "FK-UI",
    fullName: "Fakultas Kedokteran Universitas Indonesia",
    description: "PPDS I Orthopaedi & Traumatologi",
    image: "/assets/images/university-building.jpg",
    stats: {
      activeResidents: 80,
      faculty: 30,
      teachingHospitals: 6
    },
    profileResident: {
      name: "Dr. Ihsan Oesman, SpOT(K)",
      position: "Kepala Program Studi",
      image: "/assets/images/profile-placeholder.jpg",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    contact: {
      address: "Jl. Salemba Raya No. 6, Jakarta Pusat",
      email: "ortopedi@ui.ac.id",
      phone: "+62 21 391 0123",
      website: "www.ortopedi-fkui.com"
    },
    information: {
      accreditation: "A",
      established: "1960",
      duration: "8 Semester",
      capacity: "20 per tahun"
    },
    staffList: [
      {
        name: "Prof. Dr. Ahmad Jabir, SpOT(K)",
        specialization: "Spine Surgery",
        image: "/assets/images/staff-placeholder.jpg"
      },
      {
        name: "Dr. Budi Santoso, SpOT(K)",
        specialization: "Sports Medicine",
        image: "/assets/images/staff-placeholder.jpg"
      },
      {
        name: "Dr. Chandra Wijaya, SpOT(K)",
        specialization: "Hand Surgery",
        image: "/assets/images/staff-placeholder.jpg"
      },
      {
        name: "Dr. Dian Permata, SpOT(K)",
        specialization: "Pediatric Ortho",
        image: "/assets/images/staff-placeholder.jpg"
      },
      {
        name: "Dr. Eko Prasetyo, SpOT(K)",
        specialization: "Trauma",
        image: "/assets/images/staff-placeholder.jpg"
      },
      {
        name: "Dr. Fajar Rahman, SpOT(K)",
        specialization: "Joint Replacement",
        image: "/assets/images/staff-placeholder.jpg"
      }
    ],
    residents: {
      year1: [
        { name: "Dr. Andi Wijaya", image: "/assets/images/resident-placeholder.jpg" },
        { name: "Dr. Budi Hartono", image: "/assets/images/resident-placeholder.jpg" },
        { name: "Dr. Citra Dewi", image: "/assets/images/resident-placeholder.jpg" },
        { name: "Dr. Dedi Suryanto", image: "/assets/images/resident-placeholder.jpg" },
        { name: "Dr. Eka Putri", image: "/assets/images/resident-placeholder.jpg" },
        { name: "Dr. Fajar Ramadhan", image: "/assets/images/resident-placeholder.jpg" }
      ],
      year2: [
        { name: "Dr. Gilang Pratama", image: "/assets/images/resident-placeholder.jpg" },
        { name: "Dr. Hani Safitri", image: "/assets/images/resident-placeholder.jpg" },
        { name: "Dr. Irfan Hakim", image: "/assets/images/resident-placeholder.jpg" },
        { name: "Dr. Joko Susilo", image: "/assets/images/resident-placeholder.jpg" }
      ]
    },
    gallery: [
      { image: "/assets/images/gallery-1.jpg", title: "Kegiatan Pembelajaran" },
      { image: "/assets/images/gallery-2.jpg", title: "Workshop Orthopaedi" },
      { image: "/assets/images/gallery-3.jpg", title: "Seminar Nasional" },
      { image: "/assets/images/gallery-4.jpg", title: "Praktik Klinik" }
    ]
  };

  const agendaSection = useMemo(() => {
    if (type === "ppds1") return "resident";
    if (type === "subspesialis") return "trainee";
    return null;
  }, [type]);

  const [academicActivities, setAcademicActivities] = useState([]);
  const [academicActivitiesLoading, setAcademicActivitiesLoading] = useState(true);

  const toYmd = (date) => {
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return "";
    d.setHours(12, 0, 0, 0);
    return d.toISOString().slice(0, 10);
  };

  const formatDayMonth = (dateStr) => {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) {
      return { day: "-", month: "-" };
    }

    const day = String(d.getDate());
    const month = d.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
    return { day, month };
  };

  useEffect(() => {
    const fetchAcademicActivities = async () => {
      try {
        setAcademicActivitiesLoading(true);

        const start = new Date();
        start.setHours(12, 0, 0, 0);
        const end = new Date(start);
        end.setDate(start.getDate() + 14);
        end.setHours(12, 0, 0, 0);

        const params = {
          scope: "study_program",
          from: toYmd(start),
          to: toYmd(end),
        };

        if (agendaSection) {
          params.section = agendaSection;
        }

        const response = await api.get("/public/agenda-events", { params });

        if (response.data?.status !== "success") {
          setAcademicActivities([]);
          return;
        }

        const items = Array.isArray(response.data?.data) ? response.data.data : [];
        const mapped = items
          .filter((ev) => String(ev?.type || "").startsWith("event_"))
          .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
          .slice(0, 2)
          .map((ev) => {
            const meta = formatDayMonth(ev.start_date);
            return {
              id: ev.id,
              day: meta.day,
              month: meta.month,
              title: ev.title,
              location: ev.location,
            };
          });

        setAcademicActivities(mapped);
      } catch (e) {
        setAcademicActivities([]);
      } finally {
        setAcademicActivitiesLoading(false);
      }
    };

    fetchAcademicActivities();
  }, [agendaSection]);

  return (
    <HomepageLayout>
      {/* Breadcrumb */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-white text-sm">
            <Link href="/" className="hover:underline">Beranda</Link>
            <span>/</span>
            <Link href="/profile-study-program/ppds1" className="hover:underline">PPDS 1</Link>
            <span>/</span>
            <span>{universityData.name}</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Card with Image and Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="flex flex-col md:flex-row">
              {/* Left: Image */}
              <div className="md:w-48 h-48 md:h-auto bg-gradient-to-br from-blue-100 to-blue-200 flex-shrink-0">
                <img
                  src={universityData.image}
                  alt={universityData.fullName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
              
              {/* Right: Info */}
              <div className="flex-1 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon icon="mdi:school" className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 mb-1">{universityData.description}</p>
                    <h1 className="text-xl md:text-2xl font-bold text-blue-700 mb-3">
                      {universityData.fullName}
                    </h1>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{universityData.stats.activeResidents}</div>
                        <div className="text-xs text-gray-600">Residen Aktif</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{universityData.stats.faculty}</div>
                        <div className="text-xs text-gray-600">Staf Pengajar</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{universityData.stats.teachingHospitals}</div>
                        <div className="text-xs text-gray-600">Specialist center</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">

              {/* Profil Singkat */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <h2 className="text-lg font-bold text-blue-700 mb-4 flex items-center gap-2">
                  <Icon icon="mdi:information-outline" className="w-5 h-5" />
                  Profil Singkat
                </h2>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {universityData.profileResident.description}
                </p>
              </div>

              {/* Educational Dashboard FK-UI */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <h2 className="text-lg font-bold text-blue-700 mb-4 flex items-center gap-2">
                  <Icon icon="mdi:chart-donut" className="w-5 h-5" />
                  Educational Dashboard FK-UI
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {/* Residen Chart */}
                  <div className="text-center">
                    <div className="flex justify-center mb-2">
                      <DonutChart
                        data={[
                          { name: 'Residen Aktif', value: 65 },
                          { name: 'Lainnya', value: 35 }
                        ]}
                        colors={['#3B82F6', '#E5E7EB']}
                        centerText="65"
                        size={120}
                      />
                    </div>
                    <p className="text-xs font-semibold text-gray-900">Residen</p>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="text-[10px] text-gray-600">Aktif: 65</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                        <span className="text-[10px] text-gray-600">Total: 100</span>
                      </div>
                    </div>
                  </div>

                  {/* Alumni Chart */}
                  <div className="text-center">
                    <div className="flex justify-center mb-2">
                      <DonutChart
                        data={[
                          { name: 'Alumni', value: 450 },
                          { name: 'Lainnya', value: 50 }
                        ]}
                        colors={['#EC4899', '#E5E7EB']}
                        centerText="450"
                        size={120}
                      />
                    </div>
                    <p className="text-xs font-semibold text-gray-900">Alumni</p>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                        <span className="text-[10px] text-gray-600">Alumni: 450</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                        <span className="text-[10px] text-gray-600">Total: 500</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Residen */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <h2 className="text-lg font-bold text-blue-700 mb-4 flex items-center gap-2">
                  <Icon icon="mdi:chart-box-outline" className="w-5 h-5" />
                  Data Residen
                </h2>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-700">Total Residen Aktif</span>
                  <span className="text-2xl font-bold text-blue-600">{universityData.stats.activeResidents}</span>
                </div>
                <Link href={`/profile-study-program/${type}/${universityData.id}/database`} className="text-sm text-blue-600 hover:underline">Lihat Detail Data Base</Link>
              </div>

              {/* Kontak Sekretariat */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <h2 className="text-lg font-bold text-blue-700 mb-4 flex items-center gap-2">
                  <Icon icon="mdi:map-marker" className="w-5 h-5" />
                  Kontak Sekretariat
                </h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-gray-900">Alamat</div>
                      <div className="text-xs text-gray-700">{universityData.contact.address}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Mail className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-gray-900">Email</div>
                      <a href={`mailto:${universityData.contact.email}`} className="text-xs text-blue-600 hover:underline">
                        {universityData.contact.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-gray-900">Telepon</div>
                      <a href={`tel:${universityData.contact.phone}`} className="text-xs text-blue-600 hover:underline">
                        {universityData.contact.phone}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Globe className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-gray-900">Website</div>
                      <a href={`https://${universityData.contact.website}`} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                        {universityData.contact.website}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fakultas Kedokteran Universitas Indonesia */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <h2 className="text-lg font-bold text-blue-700 mb-4 flex items-center gap-2">
                  <Icon icon="mdi:school-outline" className="w-5 h-5" />
                  Fakultas Kedokteran Universitas Indonesia
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {universityData.staffList.slice(0, 4).map((staff, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Icon icon="mdi:account" className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold text-gray-900">
                            {staff.name}
                          </h4>
                          <p className="text-xs text-gray-600">{staff.specialization}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="#" className="text-sm text-blue-600 hover:underline mt-4 inline-block">Lihat Semua Staf</Link>
              </div>

              {/* Staf Pengajar */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <h2 className="text-lg font-bold text-blue-700 mb-4 flex items-center gap-2">
                  <Icon icon="mdi:account-group" className="w-5 h-5" />
                  Staf Pengajar
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {universityData.staffList.map((staff, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-200 text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Icon icon="mdi:account" className="w-7 h-7 text-blue-600" />
                      </div>
                      <p className="text-[10px] text-gray-900 font-medium leading-tight">{staff.name.split(' ').slice(0, 2).join(' ')}</p>
                      <p className="text-[9px] text-gray-600 mt-1">{staff.specialization}</p>
                    </div>
                  ))}
                </div>
                <Link href="#" className="text-sm text-blue-600 hover:underline mt-4 inline-block">Lihat Semua Staf Pengajar</Link>
              </div>

              {/* Kegiatan Akademik */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <h2 className="text-lg font-bold text-blue-700 mb-4 flex items-center gap-2">
                  <Icon icon="mdi:calendar-check" className="w-5 h-5" />
                  Kegiatan Akademik
                </h2>
                <div className="space-y-3">
                  {academicActivitiesLoading ? (
                    <div className="text-xs text-gray-600">Memuat kegiatan...</div>
                  ) : academicActivities.length === 0 ? (
                    <div className="text-xs text-gray-600">Belum ada kegiatan.</div>
                  ) : (
                    academicActivities.map((item, index) => (
                      <div
                        key={item.id || index}
                        className={`flex items-start gap-3 pb-3 ${index !== academicActivities.length - 1 ? "border-b border-gray-100" : ""}`}
                      >
                        <div className="bg-blue-100 rounded px-2 py-1 text-center flex-shrink-0">
                          <div className="text-xs font-bold text-blue-600">{item.day}</div>
                          <div className="text-[10px] text-gray-600">{item.month}</div>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900">{item.title}</h4>
                          <p className="text-xs text-gray-600">{item.location || "-"}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <Link href="/calendar-academic" className="text-sm text-blue-600 hover:underline mt-3 inline-block">Lihat Semua Kegiatan</Link>
              </div>

              {/* Galeri */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <h2 className="text-lg font-bold text-blue-700 mb-4 flex items-center gap-2">
                  <Icon icon="mdi:image-multiple" className="w-5 h-5" />
                  Galeri
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {universityData.gallery.map((item, index) => (
                    <div key={index} className="relative rounded-lg overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200 h-32">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2">
                        <p className="text-white text-xs font-semibold">{item.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              {/* Data Residen */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-sm font-bold text-blue-700 mb-3">
                  Data Residen
                </h3>
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {universityData.stats.activeResidents}
                  </div>
                  <p className="text-xs text-gray-600">Total Residen Aktif</p>
                </div>
              </div>

              {/* Rumah Sakit Pendidikan */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-sm font-bold text-blue-700 mb-3 flex items-center gap-2">
                  <Icon icon="mdi:hospital-building" className="w-4 h-4" />
                  Rumah Sakit Pendidikan
                </h3>
                <ul className="space-y-2 text-xs text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>RSCM Kencana</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>RS Fatmawati</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>RS Persahabatan</span>
                  </li>
                </ul>
              </div>

              {/* Informasi System Guides */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-sm font-bold text-blue-700 mb-3">
                  Informasi System Guides
                </h3>
                <p className="text-xs text-gray-700 mb-3">
                  Panduan lengkap sistem akademik dan administrasi
                </p>
                <Link href="#" className="text-xs text-blue-600 hover:underline">Download Panduan</Link>
              </div>

              {/* Well-Being Survey */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-sm font-bold text-blue-700 mb-3 flex items-center gap-2">
                  <Icon icon="mdi:clipboard-text" className="w-4 h-4" />
                  Well-Being Survey
                </h3>
                <div className="bg-red-50 rounded-lg p-3 mb-3">
                  <Icon icon="mdi:youtube" className="w-8 h-8 text-red-600 mx-auto mb-2" />
                  <p className="text-xs text-center text-gray-700">Survey Kesejahteraan Residen</p>
                </div>
                <Link href="#" className="text-xs text-blue-600 hover:underline block text-center">Isi Survey</Link>
              </div>

              {/* Promo/Forum */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-sm font-bold text-blue-700 mb-3">
                  Promo/Forum
                </h3>
                <div className="space-y-2 text-xs text-gray-700">
                  <p>• Diskusi Kasus Orthopaedi</p>
                  <p>• Workshop Gratis</p>
                  <p>• Seminar Nasional 2025</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </HomepageLayout>
  );
}
