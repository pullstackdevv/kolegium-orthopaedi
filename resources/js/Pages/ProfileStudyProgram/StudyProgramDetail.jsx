import { useEffect, useMemo, useState } from "react";
import { Link } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { MapPin, Phone, Mail, Globe, Calendar, X, ChevronDown, ChevronUp, Heart } from "lucide-react";
import HomepageLayout from "../../Layouts/HomepageLayout";
import DonutChart from "../../components/DonutChart";
import api from "@/api/axios";

const DEFAULT_STAFF_LIST = [
  { name: "Prof. Dr. Ahmad Jabir, SpOT(K)", specialization: "Spine Surgery", image: "/assets/images/staff-placeholder.jpg" },
  { name: "Dr. Budi Santoso, SpOT(K)", specialization: "Sports Medicine", image: "/assets/images/staff-placeholder.jpg" },
  { name: "Dr. Chandra Wijaya, SpOT(K)", specialization: "Hand Surgery", image: "/assets/images/staff-placeholder.jpg" },
  { name: "Dr. Dian Permata, SpOT(K)", specialization: "Pediatric Ortho", image: "/assets/images/staff-placeholder.jpg" },
  { name: "Dr. Eko Prasetyo, SpOT(K)", specialization: "Trauma", image: "/assets/images/staff-placeholder.jpg" },
  { name: "Dr. Fajar Rahman, SpOT(K)", specialization: "Joint Replacement", image: "/assets/images/staff-placeholder.jpg" }
];

const DEFAULT_EVENT_IMAGE =
  "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='1200'%20height='600'%20viewBox='0%200%201200%20600'%3E%3Cdefs%3E%3ClinearGradient%20id='g'%20x1='0'%20y1='0'%20x2='1'%20y2='1'%3E%3Cstop%20offset='0'%20stop-color='%23DBEAFE'/%3E%3Cstop%20offset='1'%20stop-color='%23BFDBFE'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20width='1200'%20height='600'%20fill='url(%23g)'/%3E%3Ccircle%20cx='600'%20cy='300'%20r='120'%20fill='%2393C5FD'/%3E%3Cpath%20d='M520%20320l60-60a25%2025%200%200%201%2035%200l45%2045%2065-65a25%2025%200%200%201%2035%200l80%2080v90H520z'%20fill='%2360A5FA'/%3E%3Ctext%20x='600'%20y='470'%20text-anchor='middle'%20font-family='Arial'%20font-size='28'%20fill='%231E3A8A'%20opacity='0.85'%3ENo%20Image%3C/text%3E%3C/svg%3E";


const DEFAULT_RESIDENTS = {
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
};

const DEFAULT_GALLERY = [
  { image: "/assets/images/gallery-1.jpg", title: "Kegiatan Pembelajaran" },
  { image: "/assets/images/gallery-2.jpg", title: "Workshop Orthopaedi" },
  { image: "/assets/images/gallery-3.jpg", title: "Seminar Nasional" },
  { image: "/assets/images/gallery-4.jpg", title: "Praktik Klinik" }
];

export default function StudyProgramDetail({ university, type }) {
  // Data from backend (loaded from affiliation_profiles table)
  const universityData = {
    id: null,
    name: "",
    fullName: "",
    description: "",
    image: null,
    logo: null,
    stats: {
      activeResidents: 0,
      faculty: 0,
      teachingHospitals: 0
    },
    contact: {
      address: "",
      email: "",
      phone: "",
      website: ""
    },
    information: {
      accreditation: "",
      established: "",
      duration: "",
      capacity: ""
    },
    registrationInfo: "",
    orgStructure: [],
    residents: DEFAULT_RESIDENTS,
    gallery: DEFAULT_GALLERY,
    ...university,
    orgStructure: university?.orgStructure || [],
    teacherStaff: university?.teacherStaff || [],
    teachingHospitals: university?.teachingHospitals || [],
    specializations: university?.specializations || [],
    educationalDashboard: university?.educationalDashboard || null,
    residents: university?.residents || DEFAULT_RESIDENTS,
    gallery: university?.gallery?.length ? university.gallery : DEFAULT_GALLERY,
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
  const [achievements, setAchievements] = useState([]);

  // Gallery state
  const [galleryItems, setGalleryItems] = useState([]);
  const [galleryPage, setGalleryPage] = useState(1);
  const [galleryLastPage, setGalleryLastPage] = useState(1);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [galleryDetailItem, setGalleryDetailItem] = useState(null);

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

    const fetchAchievements = async () => {
      if (!universityData.id) return;
      try {
        const res = await api.get("/public/member-achievements", {
          params: { affiliation_id: universityData.id, organization_type: agendaSection },
          headers: { "X-Skip-Auth-Redirect": "1" },
        });
        if (res.data?.status === "success") {
          setAchievements(Array.isArray(res.data.data) ? res.data.data : []);
        }
      } catch (e) {
        console.error("Failed to fetch achievements", e);
      }
    };
    fetchAchievements();
  }, [agendaSection, universityData.id]);

  // Fetch gallery dynamically
  const fetchGallery = async (page = 1) => {
    if (!universityData.id) return;
    setGalleryLoading(true);
    try {
      const res = await api.get("/public/galleries", {
        params: { affiliation_id: universityData.id, per_page: 4, page },
        headers: { "X-Skip-Auth-Redirect": "1" },
      });
      if (res.data?.status === "success") {
        const pg = res.data.data;
        setGalleryItems(pg.data || []);
        setGalleryPage(pg.current_page || 1);
        setGalleryLastPage(pg.last_page || 1);
      }
    } catch (e) {
      console.error("Failed to fetch gallery", e);
    } finally {
      setGalleryLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery(1);
  }, [universityData.id]);

  const DEFAULT_LOGO = "/assets/images/logo-univ/FK-UI.png";
  const DEFAULT_PHOTO = "/assets/images/university/FK-UI.png";

  const resolvedLogo = universityData.logo || DEFAULT_LOGO;
  const resolvedPhoto = universityData.image || DEFAULT_PHOTO;

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
          <div className=" p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Left: Image */}
              <div className="w-full md:w-1/3 h-64 flex-shrink-0 overflow-hidden rounded-2xl">
                <img
                  src={resolvedPhoto}
                  alt={universityData.fullName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    if (e.target.src !== DEFAULT_PHOTO) {
                      e.target.src = DEFAULT_PHOTO;
                    }
                  }}
                />
              </div>

              {/* Right: Info */}
              <div className="flex-1">
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-24 h-24 rounded-full bg-white border-8 border-primary flex items-center justify-center flex-shrink-0 overflow-hidden shadow-md">
                    <img
                      src={resolvedLogo}
                      alt={`${universityData.name} logo`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        if (e.target.src !== DEFAULT_LOGO) {
                          e.target.src = DEFAULT_LOGO;
                        }
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-semibold text-primary mb-1">{universityData.subTitle}</p>
                    <h1 className="text-2xl md:text-4xl font-bold text-primary leading-tight">
                      {universityData.fullName}
                    </h1>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-8 ms-32">
                  <div className="text-center md:text-left">
                    <div className="text-3xl font-bold text-primary">{universityData.stats.activeResidents}</div>
                    <div className="text-lg text-gray-600 mt-1">Active Residents</div>
                  </div>
                  <div className="text-center md:text-left">
                    <div className="text-3xl font-bold text-primary">{universityData.stats.faculty}</div>
                    <div className="text-lg text-gray-600 mt-1">Teaching Staff</div>
                  </div>
                  <div className="text-center md:text-left">
                    <div className="text-3xl font-bold text-primary">{universityData.stats.teachingHospitals}</div>
                    <div className="text-lg text-gray-600 mt-1">Teaching Hospitals</div>
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
                {universityData.description ? (
                  <div className="space-y-4 mb-6">
                    <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                      {universityData.description}
                    </div>
                  </div>
                ) : (
                  <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center text-sm text-gray-500 mb-6">
                    No profile description available yet.
                  </div>
                )}

                <div className="grid grid-cols-2 gap-6">
                  {universityData.information?.duration && (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon icon="mdi:calendar-outline" className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Program Duration</p>
                      <p className="text-sm font-semibold text-gray-900">{universityData.information.duration}</p>
                    </div>
                  </div>
                  )}
                  {universityData.information?.degree && type !== 'subspesialis' && (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon icon="mdi:graduation-cap" className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Degree</p>
                      <p className="text-sm font-semibold text-gray-900">{universityData.information.degree}</p>
                    </div>
                  </div>
                  )}
                  {universityData.information?.accreditation && (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon icon="mdi:medal-outline" className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Accreditation</p>
                      <p className="text-sm font-semibold text-gray-900">{universityData.information.accreditation}</p>
                    </div>
                  </div>
                  )}
                </div>
              </div>

              {/* Educational Dashboard */}
              {(() => {
                const db = universityData.educationalDashboard;
                const resActive = db?.resident?.active ?? 65;
                const resTotal = db?.resident?.total ?? 100;
                const resOther = Math.max(resTotal - resActive, 0);
                const alumniCount = db?.alumni?.count ?? 450;
                const alumniTotal = db?.alumni?.total ?? 500;
                const alumniOther = Math.max(alumniTotal - alumniCount, 0);

                return (
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
                              { name: 'Active Residents', value: resActive || 1 },
                              { name: 'Others', value: resOther || (resActive ? 0 : 1) }
                            ]}
                            colors={["#254D95", "#E5E7EB"]}
                            centerText={String(resActive)}
                            size={120}
                          />
                        </div>
                        <p className="text-xs font-semibold text-gray-900">Resident</p>
                        <div className="flex items-center justify-center gap-2 mt-2">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                            <span className="text-[10px] text-gray-600">Active: {resActive}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                            <span className="text-[10px] text-gray-600">Total: {resTotal}</span>
                          </div>
                        </div>
                      </div>

                      {/* Alumni Chart */}
                      <div className="text-center">
                        <div className="flex justify-center mb-2">
                          <DonutChart
                            data={[
                              { name: 'Alumni', value: alumniCount || 1 },
                              { name: 'Others', value: alumniOther || (alumniCount ? 0 : 1) }
                            ]}
                            colors={['#EC4899', '#E5E7EB']}
                            centerText={String(alumniCount)}
                            size={120}
                          />
                        </div>
                        <p className="text-xs font-semibold text-gray-900">Alumni</p>
                        <div className="flex items-center justify-center gap-2 mt-2">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                            <span className="text-[10px] text-gray-600">Alumni: {alumniCount}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                            <span className="text-[10px] text-gray-600">Total: {alumniTotal}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Struktur Organisasi - Dynamic or Default Fallback */}
              {universityData.orgStructure?.length > 0 ? (
              <>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                  <Icon icon="mdi:school-outline" className="w-5 h-5" />
                  Organizational Structure
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {universityData.orgStructure.slice(0, 2).map((member) => (
                    <div key={member.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-start gap-3 mb-3">
                        {member.photo ? (
                          <img
                            src={member.photo}
                            alt={member.name}
                            className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                          />
                        ) : null}
                        <div className={`w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 ${member.photo ? 'hidden' : ''}`}>
                          <Icon icon="mdi:account" className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900 leading-tight">
                            {member.name}
                          </h4>
                          {member.position && (
                            <p className="text-xs text-gray-600 mt-1">{member.position}</p>
                          )}
                        </div>
                      </div>
                      {member.email && (
                        <div className="flex items-center gap-1 text-xs text-primary">
                          <Icon icon="mdi:email-outline" className="w-3 h-3" />
                          <a href={`mailto:${member.email}`} className="hover:underline">{member.email}</a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              </>
              ) : (
              <>
              {/* Default Faculty of Medicine (when no orgStructure data) */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                  <Icon icon="mdi:school-outline" className="w-5 h-5" />
                  Faculty of Medicine, {universityData.fullName || 'University of Indonesia'}
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {DEFAULT_STAFF_LIST.slice(0, 2).map((staff, index) => (
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

              {/* Default Teaching Staff - hidden when dynamic teacherStaff data exists */}
              {!(universityData.teacherStaff?.length > 0) && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                  <Icon icon="mdi:account-group" className="w-5 h-5" />
                  Teaching Staff
                </h2>
                <div className="grid grid-cols-3 gap-3">
                  {DEFAULT_STAFF_LIST.map((staff, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-center">
                      <div className="w-14 h-14 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Icon icon="mdi:account" className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-sm font-semibold text-gray-900 leading-tight">
                        {staff.name.split(',')[0]}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">{staff.specialization}</p>
                    </div>
                  ))}
                </div>
              </div>
              )}
              </>
              )}

              {/* Teacher Staff - independent from orgStructure */}
              {universityData.teacherStaff?.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-3">
                  <Icon icon="mdi:account-group" className="w-7 h-7 text-primary" />
                  Teaching Staff
                </h2>
                <hr className="border-gray-200 mb-6" />
                {(() => {
                  const grouped = {};
                  universityData.teacherStaff.forEach((m) => {
                    const div = m.division || "Others";
                    if (!grouped[div]) grouped[div] = [];
                    grouped[div].push(m);
                  });
                  return Object.entries(grouped).map(([divName, members]) => (
                    <div key={divName} className="mb-8 last:mb-0">
                      <h3 className="text-sm font-semibold text-primary mb-4">{divName}</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {members.map((member) => (
                          <div key={member.id} className="bg-white rounded-xl py-5 px-3 border border-gray-200 text-center flex flex-col items-center">
                            {member.photo ? (
                              <img
                                src={member.photo}
                                alt={member.name}
                                className="w-16 h-16 rounded-full object-cover mb-3"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextElementSibling && (e.target.nextElementSibling.style.display = 'flex');
                                }}
                              />
                            ) : null}
                            {!member.photo && (
                              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-3">
                                <Icon icon="mdi:account" className="w-9 h-9 text-gray-400" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-gray-900 leading-tight">
                                {member.name}
                              </h4>
                              {/* <p className="text-[10px] text-gray-600 mt-1">
                                {member.institution_origin ? `${member.institution_origin}` : "-"}
                              </p> */}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ));
                })()}
              </div>
              )}

              {/* Gallery */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                  <Icon icon="mdi:image-multiple" className="w-5 h-5" />
                  Gallery
                </h2>
                {galleryLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : galleryItems.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-6">No gallery items yet</p>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      {galleryItems.map((item) => (
                        <div
                          key={item.id}
                          className="relative rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/10 to-white h-32 cursor-pointer group"
                          onClick={() => setGalleryDetailItem(item)}
                        >
                          <img
                            src={item.photo?.startsWith("http") ? item.photo : `/storage/${item.photo}`}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2">
                            <p className="text-white text-xs font-semibold line-clamp-2">{item.title}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {galleryLastPage > 1 && (
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                        <button
                          className="text-xs text-primary hover:underline disabled:text-gray-300 disabled:no-underline"
                          disabled={galleryPage <= 1}
                          onClick={() => fetchGallery(galleryPage - 1)}
                        >
                          ← Previous
                        </button>
                        <span className="text-xs text-gray-400">{galleryPage} / {galleryLastPage}</span>
                        <button
                          className="text-xs text-primary hover:underline disabled:text-gray-300 disabled:no-underline"
                          disabled={galleryPage >= galleryLastPage}
                          onClick={() => fetchGallery(galleryPage + 1)}
                        >
                          Next →
                        </button>
                      </div>
                    )}
                  </>
                )}
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
                    href={`/profile-study-program/${type}/${universityData.code}/database`}
                    className="w-full bg-primary/10 hover:bg-secondary/10 text-primary hover:text-secondary font-semibold py-3 px-4 rounded-lg transition-colors border-2 border-primary/20 text-center block"
                  >
                    View Resident Details
                  </Link>
                </div>
              </div>

              {/* Achievements */}
              {/* {achievements.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-0">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                    <Icon icon="mdi:trophy" className="w-5 h-5 text-yellow-500" />
                    Achievements
                  </h2>
                </div>
                <div className="p-4 space-y-3 max-h-72 overflow-y-auto">
                  {achievements.map((ach) => (
                    <div key={ach.id} className="flex items-start gap-3 p-3 bg-yellow-50/50 border border-yellow-100 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon icon="mdi:medal" className="w-4 h-4 text-yellow-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-900">{ach.title}</p>
                        {ach.description ? (
                          <p className="text-xs text-gray-600 mt-0.5">{ach.description}</p>
                        ) : null}
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          {ach.database_member ? (
                            <span>{ach.database_member.name}</span>
                          ) : null}
                          {ach.category ? (
                            <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-[10px]">{ach.category}</span>
                          ) : null}
                          {ach.date ? (
                            <span>{new Date(ach.date).toLocaleDateString("id-ID", { year: "numeric", month: "short" })}</span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              )} */}

              {/* Contact */}
              {(universityData.contact?.address || universityData.contact?.phone || universityData.contact?.email) && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-0">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-primary">
                    Contact
                  </h2>
                </div>

                <div className="p-6 space-y-4">
                  {universityData.contact.address && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-primary mb-1">Address</h3>
                      <p className="text-xs text-gray-600">{universityData.contact.address}</p>
                    </div>
                  </div>
                  )}

                  {universityData.contact.phone && (
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
                  )}

                  {universityData.contact.email && (
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
                  )}
                </div>
              </div>
              )}

              {/* Teaching Hospital - Dynamic */}
              {universityData.teachingHospitals?.length > 0 && (() => {
                const mainHospitals = universityData.teachingHospitals.filter(h => h.category === 'main');
                const satelliteHospitals = universityData.teachingHospitals.filter(h => h.category === 'satellite');
                const internationalHospitals = universityData.teachingHospitals.filter(h => h.category === 'international');
                const sections = [
                  { key: 'main', label: 'Main Teaching Hospital', items: mainHospitals, bg: 'bg-green-50', border: 'border-green-200', dot: 'bg-blue-600', titleColor: 'text-primary' },
                  { key: 'satellite', label: 'Satellite Network Teaching Hospital', items: satelliteHospitals, bg: 'bg-gray-50', border: 'border-gray-200', dot: 'bg-green-500', titleColor: 'text-secondary' },
                  { key: 'international', label: 'International Cooperation', items: internationalHospitals, bg: 'bg-red-50', border: 'border-red-200', dot: 'bg-red-500', titleColor: 'text-orange-500' },
                ].filter(s => s.items.length > 0);

                return (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <Icon icon="mdi:hospital-building" className="w-6 h-6 text-primary" />
                      Teaching Hospital
                    </h2>
                    <div className="space-y-6">
                      {sections.map((sec, sIdx) => (
                        <div key={sec.key}>
                          {sIdx > 0 && <hr className="border-gray-200 mb-6" />}
                          <h3 className={`text-sm font-semibold ${sec.titleColor} mb-3`}>{sec.label}</h3>
                          <div className={`${sec.bg} rounded-lg p-4 border ${sec.border} space-y-3`}>
                            {sec.items.map((hospital) => (
                              <div key={hospital.id} className="flex items-start gap-2">
                                <span className={`w-2 h-2 ${sec.dot} rounded-full mt-1.5 flex-shrink-0`}></span>
                                <div>
                                  <p className="text-sm font-semibold text-gray-900">{hospital.name}</p>
                                  {hospital.location && <p className="text-xs text-gray-500">{hospital.location}</p>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Peminatan - Show for subspesialis: dynamic data or default fallback */}
              {type === 'subspesialis' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-primary mb-6 flex items-center gap-2">
                  <Icon icon="mdi:office-building" className="w-5 h-5" />
                  Specialization
                </h2>
                <div className="space-y-3">
                  {(universityData.specializations?.length > 0
                    ? universityData.specializations
                    : [
                        { id: 'default-1', name: 'Spine' },
                        { id: 'default-2', name: 'Hip and Knee' },
                        { id: 'default-3', name: 'Oncology Orthopaedics and Reconstructions' },
                        { id: 'default-4', name: 'Sport Injury' },
                        { id: 'default-5', name: 'Paediatric Orthopaedics' },
                        { id: 'default-6', name: 'Foot and Ankle' },
                        { id: 'default-7', name: 'Shoulder and Elbow Orthopaedics' },
                        { id: 'default-8', name: 'Advanced Orthopaedics' },
                        { id: 'default-9', name: 'Hand, Arm and Microsurgery' },
                      ]
                  ).map((spec) => (
                    <div key={spec.id} className="bg-gray-50 rounded-xl px-5 py-4 border border-blue-200 flex items-center gap-3">
                      <span className="w-2.5 h-2.5 bg-primary rounded-full flex-shrink-0"></span>
                      <p className="text-sm font-semibold text-gray-900">{spec.name}</p>
                    </div>
                  ))}
                </div>
              </div>
              )}


              {/* Specialization - Only show for PPDS1 */}
              {type === 'ppds1' && (
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
              )}

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
              {universityData.registrationInfo && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <h2 className="text-xl font-bold text-primary mb-6">
                  Registration
                </h2>

                <div className="space-y-4">
                  <div className="text-base text-gray-700 leading-relaxed whitespace-pre-line">
                    {universityData.registrationInfo}
                  </div>
                  {universityData.registrationUrl && (
                    <div className="mt-4">
                      <span className="text-sm text-gray-600">Registration Link: </span>
                      <a
                        href={universityData.registrationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline break-all"
                      >
                        {universityData.registrationUrl}
                      </a>
                    </div>
                  )}
                </div>
              </div>
              )}
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

      {/* Gallery Detail Modal */}
      {galleryDetailItem && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setGalleryDetailItem(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img
                src={galleryDetailItem.photo?.startsWith("http") ? galleryDetailItem.photo : `/storage/${galleryDetailItem.photo}`}
                alt={galleryDetailItem.title}
                className="w-full h-64 object-cover"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <button
                onClick={() => setGalleryDetailItem(null)}
                className="absolute top-3 right-3 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 transition-colors"
                type="button"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{galleryDetailItem.title}</h3>
              {galleryDetailItem.gallery_date && (
                <p className="text-sm text-gray-500 mb-3 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {new Date(galleryDetailItem.gallery_date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              )}
              {galleryDetailItem.description && (
                <p className="text-sm text-gray-700 leading-relaxed">{galleryDetailItem.description}</p>
              )}
            </div>
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={() => setGalleryDetailItem(null)}
                className="w-full px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm"
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