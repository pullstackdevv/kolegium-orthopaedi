import { Link } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { MapPin, Phone, Mail, Globe } from "lucide-react";
import HomepageLayout from "../../Layouts/HomepageLayout";

export default function UniversityDetail({ university }) {
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
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* University Header Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="relative h-64 bg-gradient-to-br from-blue-100 to-blue-200">
                  <img
                    src={universityData.image}
                    alt={universityData.fullName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 text-white">
                    <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-4 border-4 border-white">
                      <Icon icon="mdi:school" className="w-10 h-10" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {universityData.fullName}
                  </h1>
                  <p className="text-lg text-blue-600 font-semibold mb-4">
                    {universityData.description}
                  </p>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">
                        {universityData.stats.activeResidents}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">Residen Aktif</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">
                        {universityData.stats.faculty}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">Staf Pengajar</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">
                        {universityData.stats.teachingHospitals}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">RS Pendidikan</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profil Residen */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-blue-700 mb-6 flex items-center gap-2">
                  <Icon icon="mdi:account-circle" className="w-6 h-6" />
                  Profil Residen
                </h2>
                <div className="flex items-start gap-6">
                  <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon icon="mdi:account" className="w-16 h-16 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {universityData.profileResident.name}
                    </h3>
                    <p className="text-sm text-blue-600 mb-3">
                      {universityData.profileResident.position}
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {universityData.profileResident.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Kontak Sekretariat */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-blue-700 mb-6 flex items-center gap-2">
                  <Icon icon="mdi:map-marker" className="w-6 h-6" />
                  Kontak Sekretariat
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-semibold text-gray-900">Alamat</div>
                      <div className="text-sm text-gray-700">{universityData.contact.address}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-semibold text-gray-900">Email</div>
                      <a href={`mailto:${universityData.contact.email}`} className="text-sm text-blue-600 hover:underline">
                        {universityData.contact.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-semibold text-gray-900">Telepon</div>
                      <a href={`tel:${universityData.contact.phone}`} className="text-sm text-blue-600 hover:underline">
                        {universityData.contact.phone}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-semibold text-gray-900">Website</div>
                      <a href={`https://${universityData.contact.website}`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                        {universityData.contact.website}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Staff Pengajar */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-blue-700 mb-6 flex items-center gap-2">
                  <Icon icon="mdi:account-group" className="w-6 h-6" />
                  Staf Pengajar
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {universityData.staffList.map((staff, index) => (
                    <div key={index} className="text-center">
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Icon icon="mdi:account" className="w-12 h-12 text-blue-600" />
                      </div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">
                        {staff.name}
                      </h4>
                      <p className="text-xs text-gray-600">{staff.specialization}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Residen Tahun Pertama */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-blue-700 mb-6">
                  Residen Tahun Pertama
                </h2>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                  {universityData.residents.year1.map((resident, index) => (
                    <div key={index} className="text-center">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Icon icon="mdi:account" className="w-10 h-10 text-gray-400" />
                      </div>
                      <p className="text-xs text-gray-700">{resident.name}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Residen Tahun Kedua */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-blue-700 mb-6">
                  Residen Tahun Kedua
                </h2>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                  {universityData.residents.year2.map((resident, index) => (
                    <div key={index} className="text-center">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Icon icon="mdi:account" className="w-10 h-10 text-gray-400" />
                      </div>
                      <p className="text-xs text-gray-700">{resident.name}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Galeri */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-blue-700 mb-6 flex items-center gap-2">
                  <Icon icon="mdi:image-multiple" className="w-6 h-6" />
                  Galeri
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {universityData.gallery.map((item, index) => (
                    <div key={index} className="relative rounded-lg overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200 h-48">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                        <p className="text-white text-sm font-semibold">{item.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Informasi Fakultas */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-blue-700 mb-4">
                  Informasi Fakultas Kedokteran
                </h2>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Akreditasi</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {universityData.information.accreditation}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Tahun Berdiri</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {universityData.information.established}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Lama Studi</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {universityData.information.duration}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Kapasitas</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {universityData.information.capacity}
                    </div>
                  </div>
                </div>
              </div>

              {/* Residen Tahun Pertama (Summary) */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-sm font-bold text-blue-700 mb-3">
                  Residen Tahun Pertama
                </h3>
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {universityData.residents.year1.length}
                </div>
                <p className="text-xs text-gray-600">Total Residen</p>
              </div>

              {/* Kegiatan Mendatang */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-sm font-bold text-blue-700 mb-4">
                  Kegiatan Mendatang
                </h3>
                <div className="space-y-3">
                  <div className="pb-3 border-b border-gray-200">
                    <div className="text-xs text-gray-600 mb-1">15 Nov 2025</div>
                    <div className="text-sm font-semibold text-gray-900">Workshop Trauma</div>
                  </div>
                  <div className="pb-3 border-b border-gray-200">
                    <div className="text-xs text-gray-600 mb-1">20 Nov 2025</div>
                    <div className="text-sm font-semibold text-gray-900">Seminar Nasional</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">25 Nov 2025</div>
                    <div className="text-sm font-semibold text-gray-900">Ujian OSCE</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </HomepageLayout>
  );
}
