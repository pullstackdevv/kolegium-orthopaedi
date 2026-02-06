import { useEffect, useMemo, useState } from "react";
import { Link } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { MapPin, Phone, Mail, Globe, Calendar, X, ChevronDown, ChevronUp, Heart } from "lucide-react";
import HomepageLayout from "../../Layouts/HomepageLayout";
import DonutChart from "../../components/DonutChart";
import api from "@/api/axios";

const DEFAULT_EVENT_IMAGE =
  "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='1200'%20height='600'%20viewBox='0%200%201200%20600'%3E%3Cdefs%3E%3ClinearGradient%20id='g'%20x1='0'%20y1='0'%20x2='1'%20y2='1'%3E%3Cstop%20offset='0'%20stop-color='%23DBEAFE'/%3E%3Cstop%20offset='1'%20stop-color='%23BFDBFE'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20width='1200'%20height='600'%20fill='url(%23g)'/%3E%3Ccircle%20cx='600'%20cy='300'%20r='120'%20fill='%2393C5FD'/%3E%3Cpath%20d='M520%20320l60-60a25%2025%200%200%201%2035%200l45%2045%2065-65a25%2025%200%200%201%2035%200l80%2080v90H520z'%20fill='%2360A5FA'/%3E%3Ctext%20x='600'%20y='470'%20text-anchor='middle'%20font-family='Arial'%20font-size='28'%20fill='%231E3A8A'%20opacity='0.85'%3ENo%20Image%3C/text%3E%3C/svg%3E";

export default function StudyProgramDetail({ university, type }) {
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
        name: "Dr. dr. Ihsan Oesman, SpOT(K)",
        specialization: "Subsp.K.P",
        image: "/assets/images/staff-placeholder.jpg"
      },
      {
        name: "dr. Muhammad Rizqi Adhi Primaputra, SpOT(K)",
        specialization: "@orthopaedi.id",
        image: "/assets/images/staff-placeholder.jpg"
      },
      {
        name: "dr. Ifran Saleh, SpOT(K)",
        specialization: "Spine Surgery",
        image: "/assets/images/staff-placeholder.jpg"
      },
      {
        name: "Prof. Dr. dr. Ismail Hadisoebroto Dilogo, SpO.T(K), Subsp.P.L",
        specialization: "Pediatric Ortho",
        image: "/assets/images/staff-placeholder.jpg"
      },
      {
        name: "Prof. Dr. dr. Andri MT Lubis, SpO.T(K) , Subsp.C.O",
        specialization: "Trauma",
        image: "/assets/images/staff-placeholder.jpg"
      },
      {
        name: "Dr. dr. Aryadi Kurniawan, SpO.T(K), Subsp.A",
        specialization: "Joint Replacement",
        image: "/assets/images/staff-placeholder.jpg"
      },
      {
        name: "Prof. Dr. dr. Achmad Fauzi Kamal, SpOT(K)",
        specialization: "Hand Surgery",
        image: "/assets/images/staff-placeholder.jpg"
      },
      {
        name: "Dr. dr. Rahyussalim, SpO.T(K) , Subsp.O. T.B",
        specialization: "Sports Medicine",
        image: "/assets/images/staff-placeholder.jpg"
      },
      {
        name: "Dr. dr. Ihsan Oesman, SpO.T(K), Subsp.K.P",
        specialization: "Spine Surgery",
        image: "/assets/images/staff-placeholder.jpg"
      },
      {
        name: "Dr. dr. Yogi Prabowo, SpO.T(K), Subsp.Onk. Ort.R",
        specialization: "Oncology",
        image: "/assets/images/staff-placeholder.jpg"
      },
      {
        name: "Dr. dr. Wahyu Widodo, SpO.T(K) , Subsp.T.L. B.M",
        specialization: "Trauma",
        image: "/assets/images/staff-placeholder.jpg"
      },
      {
        name: "Dr. dr. Ludwig Andribert Powantia Pontoh, SpO.T(K), Subsp.P.L",
        specialization: "Pediatric Ortho",
        image: "/assets/images/staff-placeholder.jpg"
      },
      {
        name: "Dr. dr. Didik Librianto, SpOT(K)",
        specialization: "Hand Surgery",
        image: "/assets/images/staff-placeholder.jpg"
      },
      {
        name: "dr. Muhammad Rizqi Adhi Primaputra, SpOT(K)",
        specialization: "Joint Replacement",
        image: "/assets/images/staff-placeholder.jpg"
      },
      {
        name: "dr. Wildan Latief, SpO.T(K), Subsp.T.L. B.M",
        specialization: "Trauma",
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
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const formatFullDate = (dateStr) => {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return "-";
    d.setHours(12, 0, 0, 0);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateLabel = (startStr, endStr) => {
    const startLabel = formatFullDate(startStr);
    const endLabel = endStr ? formatFullDate(endStr) : startLabel;
    return startLabel === endLabel ? startLabel : `${startLabel} - ${endLabel}`;
  };

  const getEventBadgeMeta = (typeStr) => {
    const type = String(typeStr || "");
    const KNOWN = {
      ujian_lokal: { label: "Ujian Lokal", className: "bg-red-500 text-white" },
      ujian_nasional: { label: "Ujian Nasional", className: "bg-primary text-white" },
      event_lokal: { label: "Event Lokal", className: "bg-green-500 text-white" },
      event_nasional: { label: "Event Nasional", className: "bg-orange-500 text-white" },
      event_peer_group: { label: "Peer Group International", className: "bg-purple-500 text-white" },
      event_peer_group_nasional: { label: "Peer Group National", className: "bg-indigo-500 text-white" },
    };

    if (KNOWN[type]) {
      return { ...KNOWN[type], dotClass: KNOWN[type].className.split(" ")[0] };
    }

    const raw = type.replace(/^(event_|ujian_)/, "");
    const key = raw || "event";
    const label = key
      .split("_")
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    if (key.includes("nasional")) return { label, className: "bg-emerald-500 text-white", dotClass: "bg-emerald-500" };
    if (key.includes("seminar")) return { label, className: "bg-indigo-500 text-white", dotClass: "bg-indigo-500" };
    if (type.startsWith("ujian_")) return { label, className: "bg-red-500 text-white", dotClass: "bg-red-500" };
    return { label, className: "bg-primary text-white", dotClass: "bg-primary" };
  };

  const openDetailModal = (ev) => {
    setSelectedEvent(ev);
    setShowDetailModal(true);
  };

  useEffect(() => {
    const fetchAcademicActivities = async () => {
      setAcademicActivitiesLoading(true);

      try {
        const { data } = await api.get("/public/agenda-events", {
          params: { affiliation_id: universityData.id },
        });

        if (data?.status !== "success") {
          setAcademicActivities([]);
          return;
        }

        const items = (data?.data ?? [])
          .filter((event) => /^(event|ujian)_/.test(String(event?.type ?? "")))
          .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
          .slice(0, 2)
          .map((event) => {
            const badgeMeta = getEventBadgeMeta(event.type);
            return {
              id: event.id,
              dateLabel: formatDateLabel(event.start_date, event.end_date),
              startDate: event.start_date,
              endDate: event.end_date,
              title: event.title,
              location: event.location,
              badge: badgeMeta.label,
              badgeClass: badgeMeta.className,
              dotClass: badgeMeta.dotClass,
              type: event.type,
              description: event.description,
              registration: event.registration_url,
              image: event.image_url,
            };
          });

        setAcademicActivities(items);
      } catch (error) {
        setAcademicActivities([]);
      } finally {
        setAcademicActivitiesLoading(false);
      }
    };

    fetchAcademicActivities();
  }, [agendaSection, universityData.id]);

  return (
    <HomepageLayout>
      {/* Breadcrumb */}
      <section className="bg-gradient-to-r from-primary to-secondary py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-white text-sm">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <Link href="/profile-study-program/ppds1" className="hover:underline">Study Program Profile</Link>
            <span>/</span>
            <span>{universityData.name}</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-gray-50 py-8" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Card with Image and Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="flex flex-col md:flex-row">
              {/* Left: Image */}
              <div className="md:w-48 h-48 md:h-auto bg-gradient-to-br from-primary/10 via-secondary/10 to-white flex-shrink-0">
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
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon icon="mdi:school" className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 mb-1">{universityData.description}</p>
                    <h1 className="text-xl md:text-2xl font-bold text-primary mb-3">
                      {universityData.fullName}
                    </h1>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-xl font-bold text-primary">{universityData.stats.activeResidents}</div>
                        <div className="text-xs text-gray-600">Residen Aktif</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-primary">{universityData.stats.faculty}</div>
                        <div className="text-xs text-gray-600">Staf Pengajar</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-primary">{universityData.stats.teachingHospitals}</div>
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

              {/* Short Profile */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-primary mb-6">
                  Short Profile
                </h2>
                <div className="space-y-4 mb-6">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    The Orthopedics and Traumatology Subspecialty Doctor Education Program (Sp-2) aims to train Orthopedic and Traumatology Specialists with balanced academic and clinical skills, enabling them to address various orthopedic and traumatology issues in the community.
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    The Sp2 Orthopedic and Traumatology Study Program at the Faculty of Medicine, University of Indonesia (FKUI) is the highest level of professional academic education, a continuation of the Orthopedic and Traumatology Specialist Education.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon icon="mdi:calendar-outline" className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Program Duration</p>
                      <p className="text-sm font-semibold text-gray-900">8 Semester</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon icon="mdi:medal-outline" className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Accreditation</p>
                      <p className="text-sm font-semibold text-gray-900">A - LAM PT Kes</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Educational Dashboard */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                  <Icon icon="mdi:chart-donut" className="w-5 h-5" />
                  Educational Dashboard
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
                        colors={["#254D95", "#E5E7EB"]}
                        centerText="65"
                        size={120}
                      />
                    </div>
                    <p className="text-xs font-semibold text-gray-900">Resident</p>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <span className="text-[10px] text-gray-600">Active: 65</span>
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

              {/* Faculty of Medicine */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                  <Icon icon="mdi:school-outline" className="w-5 h-5" />
                  Faculty of Medicine, University of Indonesia
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {universityData.staffList.slice(0, 2).map((staff, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <Icon icon="mdi:account" className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900 leading-tight">
                            {staff.name}
                          </h4>
                          <p className="text-xs text-gray-600 mt-1">
                            {index === 0 ? "Head of Study Program" : "Secretary of Study Program"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-primary">
                        <Icon icon="mdi:email-outline" className="w-3 h-3" />
                        <span>{index === 0 ? "ihsan@orthopaedi.id" : "@orthopaedi.id"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Teaching Staff */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                  <Icon icon="mdi:account-group" className="w-5 h-5" />
                  Teaching Staff
                </h2>
                <div className="grid grid-cols-3 gap-3">
                  {universityData.staffList.map((staff, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-center">
                      <div className="w-14 h-14 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Icon icon="mdi:account" className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-xs font-semibold text-gray-900 leading-tight">
                        {staff.name.split(',')[0]}
                      </p>
                      <p className="text-[10px] text-gray-600 mt-1">{staff.specialization}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gallery */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                  <Icon icon="mdi:image-multiple" className="w-5 h-5" />
                  Gallery
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {(universityData.gallery || []).map((item, index) => (
                    <div key={index} className="relative rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/10 to-white h-32">
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
              {/* Resident Data */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-0">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-primary">
                    Resident Data
                  </h2>
                </div>

                <div className="p-6 space-y-4">
                  <div className="bg-primary/5 border-2 border-primary/15 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-primary">Active Resident</h3>
                      <div className="text-4xl font-bold text-primary">
                        {universityData.stats.activeResidents}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Total residents currently undergoing education
                    </p>
                  </div>

                  <Link
                    href={`/profile-study-program/${type}/${universityData.id}/database`}
                    className="w-full bg-primary/10 hover:bg-secondary/10 text-primary hover:text-secondary font-semibold py-3 px-4 rounded-lg transition-colors border-2 border-primary/20 text-center block"
                  >
                    View Resident Details
                  </Link>
                </div>
              </div>

              {/* Contact */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-0">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-primary">
                    Contact
                  </h2>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-primary mb-1">Address</h3>
                      <p className="text-xs text-gray-600">{universityData.contact.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-primary mb-1">Phone</h3>
                      <a href={`tel:${universityData.contact.phone}`} className="text-xs text-primary hover:text-secondary">
                        {universityData.contact.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-primary mb-1">E-mail</h3>
                      <a href={`mailto:${universityData.contact.email}`} className="text-xs text-primary hover:text-secondary">
                        {universityData.contact.email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Specialization */}
              <div className="bg-white rounded-lg shadow-sm border-2 border-gray-200 p-6">
                <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                  <Icon icon="mdi:school-outline" className="w-5 h-5" />
                  Specialization
                </h2>
                <div className="space-y-3">
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></span>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Spine</p>
                        <p className="text-xs text-gray-600">Title: Sp.O.T., Subsp.O.T.B</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></span>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Hip and Knee</p>
                        <p className="text-xs text-gray-600">Title: Sp.O.T., Subsp.P.L</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></span>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Oncology Orthopaedics and Reconstructions</p>
                        <p className="text-xs text-gray-600">Title: Sp.O.T., Subsp.Onk.Ort.R</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></span>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Sport Injury</p>
                        <p className="text-xs text-gray-600">Title: Sp.O.T., Subsp.C.O</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></span>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Paediatric Orthopaedics</p>
                        <p className="text-xs text-gray-600">Title: Sp.O.T., Subsp.A</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></span>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Foot and Ankle</p>
                        <p className="text-xs text-gray-600">Title: Sp.O.T., Subsp.K.P</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></span>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Shoulder and Elbow Orthopaedics</p>
                        <p className="text-xs text-gray-600">Title: Sp.O.T., Subsp.O.B.S</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></span>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Advanced Orthopaedics</p>
                        <p className="text-xs text-gray-600">Title: Sp.O.T., Subsp.T.L</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></span>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Hand, Arm and Microsurgery</p>
                        <p className="text-xs text-gray-600">Title: Sp.O.T., Subsp.T.L.B.M</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Academic Activities */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-primary mb-4">
                  Academic Activities
                </h2>
                {academicActivities.length === 0 ? (
                  <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center text-sm text-gray-600">
                    No upcoming academic activities for this program.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {academicActivities.map((item) => (
                      <div key={item.id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-sm text-gray-700">{item.dateLabel}</span>
                            <span className="text-gray-400">•</span>
                            <span className={`${item.badgeClass} text-xs font-semibold px-3 py-1 rounded`}>
                              {item.badge}
                            </span>
                          </div>
                          <button
                            type="button"
                            className="text-sm text-primary hover:text-secondary"
                            onClick={() => openDetailModal(item)}
                          >
                            Detail
                          </button>
                        </div>
                        <h4 className="text-base font-bold text-gray-900 leading-snug">{item.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{item.location}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Well-Being Survey */}
              <Link
                href={`/wellbeing-survey?code=${universityData.code}`}
                className="block"
              >
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow duration-300">
                  <h2 className="text-xl font-bold text-primary mb-8 text-center">
                    Well-Being Survey
                  </h2>

                  <div className="flex flex-col items-center text-center mb-8">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                      <Heart className="w-10 h-10 text-red-700" />
                    </div>
                    <h3 className="text-lg font-bold text-primary mb-2">Resident Welfare Assessment</h3>
                    <p className="text-base text-gray-600">Complete surveys to track student well-being</p>
                  </div>

                  <div className="bg-red-50 rounded-lg p-6 mb-6 border border-red-200 hover:bg-red-100 transition-colors duration-300">
                    <p className="text-center font-bold text-red-700 text-md">Fill Out the Survey Now</p>
                  </div>

                  <p className="text-center text-sm text-gray-500">Duration: ± 10 minutes</p>
                </div>
              </Link>

              {/* Registration */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <h2 className="text-xl font-bold text-primary mb-6">
                  Registration
                </h2>

                <div className="space-y-4">
                  <p className="text-base text-gray-700 leading-relaxed">
                    Registration is opened 2 (two) times a year (January and July Period) via SIMAK UI:
                  </p>

                  <p className="text-sm text-gray-600 mt-4">
                    <span className="font-semibold">Link: </span> 
                    <a href="https://simak.ui.ac.id/spesialiskedokteran.html" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://simak.ui.ac.id/spesialiskedokteran.html</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {showDetailModal && selectedEvent && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowDetailModal(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`p-6 rounded-t-xl ${selectedEvent.dotClass || "bg-primary"}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-white" />
                  <span className="text-white font-medium text-sm">
                    {selectedEvent.dateLabel || "-"}
                  </span>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                  type="button"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <h3 className="text-xl font-bold text-white">{selectedEvent.title}</h3>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="text-sm text-gray-700">
                <p>{selectedEvent.description || "No description available"}</p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowDetailModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                type="button"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </HomepageLayout>
  );
}