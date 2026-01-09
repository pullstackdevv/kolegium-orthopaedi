import { Link } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  Users, 
  BookOpen, 
  Award,
  Calendar,
  MapPin,
  X,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import HomepageLayout from "../Layouts/HomepageLayout";
import DonutChart from "../components/DonutChart";
import api from "@/api/axios";

const DEFAULT_EVENT_IMAGE =
  "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='1200'%20height='600'%20viewBox='0%200%201200%20600'%3E%3Cdefs%3E%3ClinearGradient%20id='g'%20x1='0'%20y1='0'%20x2='1'%20y2='1'%3E%3Cstop%20offset='0'%20stop-color='%23DBEAFE'/%3E%3Cstop%20offset='1'%20stop-color='%23BFDBFE'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20width='1200'%20height='600'%20fill='url(%23g)'/%3E%3Ccircle%20cx='600'%20cy='300'%20r='120'%20fill='%2393C5FD'/%3E%3Cpath%20d='M520%20320l60-60a25%2025%200%200%201%2035%200l45%2045%2065-65a25%2025%200%200%201%2035%200l80%2080v90H520z'%20fill='%2360A5FA'/%3E%3Ctext%20x='600'%20y='470'%20text-anchor='middle'%20font-family='Arial'%20font-size='28'%20fill='%231E3A8A'%20opacity='0.85'%3ENo%20Image%3C/text%3E%3C/svg%3E";

// Program Card Component
const ProgramCard = ({ program }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden">
      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Program Info - Left Side */}
          <ProgramInfo program={program} />
          
          {/* Charts Grid - Right Side (2 columns) */}
          <div className="lg:col-span-2">
            <ChartsGrid charts={program.charts} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Program Info Component
const ProgramInfo = ({ program }) => {
  // Determine label based on program ID
  const getStudentLabel = () => {
    if (program.id === "P1") return "Active Resident:";
    if (program.id === "CF") return "Active Fellow:";
    if (program.id === "SP") return "Active Trainee:";
    return "Active Students:";
  };

  return (
    <div className="flex flex-col justify-center">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 h-full flex flex-col justify-center">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="bg-blue-600 text-white px-4 py-2 rounded-lg text-2xl font-bold">
              {program.id}
            </span>
            <span className="text-2xl font-bold text-gray-900">{program.badge}</span>
          </div>
          <p className="text-base text-gray-700 leading-relaxed">
            {program.description}
          </p>
          <div className="pt-4 border-t border-blue-200">
            <p className="text-sm text-gray-600 mb-1">{getStudentLabel()}</p>
            <p className="text-3xl font-bold text-blue-600">{program.students}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Charts Grid Component
const ChartsGrid = ({ charts }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {charts.map((chart, chartIdx) => (
        <ChartCard key={chartIdx} chart={chart} />
      ))}
    </div>
  );
};

// Chart Card Component
const ChartCard = ({ chart }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-all duration-300">
      <div className="flex justify-center mb-6">
        <DonutChart 
          data={chart.data}
          colors={chart.colors}
          centerText={chart.title}
          size={180}
        />
      </div>
      <ChartLegends chart={chart} />
    </div>
  );
};

// Chart Legends Component
const ChartLegends = ({ chart }) => {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
      {/* Left column legends */}
      <LegendColumn legends={chart.legends} colors={chart.colors} startIndex={0} />
      
      {/* Right column legends */}
      {chart.legendsRight && (
        <LegendColumn 
          legends={chart.legendsRight} 
          colors={chart.colors} 
          startIndex={chart.legends.length} 
        />
      )}
    </div>
  );
};

// Legend Column Component
const LegendColumn = ({ legends, colors, startIndex }) => {
  return (
    <div className="space-y-2">
      {legends.map((legend, legIdx) => (
        <div key={legIdx} className="flex items-start text-xs">
          <div className="flex items-center gap-1.5 flex-1">
            <div 
              className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1" 
              style={{ backgroundColor: colors[(startIndex + legIdx) % colors.length] }}
            />
            <span className="text-gray-700 leading-tight">{legend.label}</span>
          </div>
          <span className="font-medium text-gray-900 ml-2 flex-shrink-0">: {legend.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function Homepage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [agendaEvents, setAgendaEvents] = useState([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  const heroImages = [
    {
      src: "/assets/images/homepage/banner.png",
      alt: "Indonesian Orthopaedic Team - Image 1"
    },
    {
      src: "/assets/images/homepage/slide-2.png",
      alt: "Indonesian Orthopaedic Team - Image 2"
    }
  ];

  const handleImageSwitch = () => {
    setIsFlipped(!isFlipped);
  };

  const eventTypes = [
    {
      id: "ujian_lokal",
      examLabel: "Local Exam",
      name: "Ujian Lokal",
      solidBg: "bg-red-600",
      softBg: "bg-red-100",
      softText: "text-red-700",
    },
    {
      id: "ujian_nasional",
      examLabel: "National Exam",
      name: "Ujian Nasional",
      solidBg: "bg-blue-600",
      softBg: "bg-blue-100",
      softText: "text-blue-700",
    },
    {
      id: "event_lokal",
      examLabel: "Local Event",
      name: "Event Lokal",
      solidBg: "bg-green-600",
      softBg: "bg-green-100",
      softText: "text-green-700",
    },
    {
      id: "event_nasional",
      examLabel: "National Event",
      name: "Event Nasional",
      solidBg: "bg-orange-600",
      softBg: "bg-orange-100",
      softText: "text-orange-700",
    },
    {
      id: "event_peer_group",
      examLabel: "Peer Group International",
      name: "Event Peer Group International",
      solidBg: "bg-purple-600",
      softBg: "bg-purple-100",
      softText: "text-purple-700",
    },
    {
      id: "event_peer_group_nasional",
      examLabel: "Peer Group National",
      name: "Event Peer Group National",
      solidBg: "bg-indigo-600",
      softBg: "bg-indigo-100",
      softText: "text-indigo-700",
    },
  ];

  const getTypeMeta = (type) => {
    return (
      eventTypes.find((t) => t.id === type) || {
        id: String(type || ""),
        examLabel: "Event",
        name: "Event",
        solidBg: "bg-blue-600",
        softBg: "bg-blue-100",
        softText: "text-blue-700",
      }
    );
  };

  const openDetailModal = (ev) => {
    setSelectedEvent(ev);
    setShowDetailModal(true);
  };

  const monthShortId = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const monthLongEn = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const formatIsoDate = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const isValidDate = (d) => d instanceof Date && !Number.isNaN(d.getTime());

  const parseLocalNoon = (value) => {
    if (!value) return null;

    if (value instanceof Date) {
      const d = new Date(value);
      d.setHours(12, 0, 0, 0);
      return isValidDate(d) ? d : null;
    }

    const str = String(value);

    if (str.includes("T") || str.includes(" ")) {
      const d = new Date(str);
      d.setHours(12, 0, 0, 0);
      return isValidDate(d) ? d : null;
    }

    const d = new Date(`${str}T12:00:00`);
    return isValidDate(d) ? d : null;
  };

  const formatExamDateLabel = (start, end) => {
    if (!isValidDate(start) || !isValidDate(end)) return "-";
    const sameDay = start.toDateString() === end.toDateString();
    if (sameDay) {
      const day = String(start.getDate()).padStart(2, "0");
      return `${day} ${monthShortId[start.getMonth()]} ${start.getFullYear()}`;
    }

    if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
      return `${start.getDate()}-${end.getDate()} ${monthShortId[start.getMonth()]} ${start.getFullYear()}`;
    }

    return `${start.getDate()} ${monthShortId[start.getMonth()]} ${start.getFullYear()}-${end.getDate()} ${monthShortId[end.getMonth()]} ${end.getFullYear()}`;
  };

  const formatEventDateLabel = (start, end) => {
    if (!isValidDate(start) || !isValidDate(end)) return "-";
    const sameDay = start.toDateString() === end.toDateString();
    if (sameDay) {
      return `${start.getDate()} ${monthLongEn[start.getMonth()]} ${start.getFullYear()}`;
    }

    if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
      return `${start.getDate()}-${end.getDate()} ${monthLongEn[start.getMonth()]} ${start.getFullYear()}`;
    }

    return `${start.getDate()} ${monthLongEn[start.getMonth()]} ${start.getFullYear()}-${end.getDate()} ${monthLongEn[end.getMonth()]} ${end.getFullYear()}`;
  };

  useEffect(() => {
    const fetchAgendaEvents = async () => {
      try {
        const from = new Date();
        from.setHours(12, 0, 0, 0);

        const to = new Date(from);
        to.setDate(to.getDate() + 365);

        const response = await api.get("/public/agenda-events", {
          params: {
            from: formatIsoDate(from),
            to: formatIsoDate(to),
          },
        });

        if (response.data?.status !== "success") {
          setAgendaEvents([]);
          return;
        }

        const data = Array.isArray(response.data?.data) ? response.data.data : [];
        const sorted = [...data].sort((a, b) => {
          const aDate = parseLocalNoon(a.start_date) ?? new Date(0);
          const bDate = parseLocalNoon(b.start_date) ?? new Date(0);
          return aDate - bDate;
        });
        setAgendaEvents(sorted);
      } catch (e) {
        setAgendaEvents([]);
      }
    };

    fetchAgendaEvents();
  }, []);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };
  // Stats data
  const stats = [
    { icon: "mdi:school", value: "720", label: "Active Resident", subtitle: "14 study program" },
    { icon: "mdi:school", value: "42", label: "Active Fellow", subtitle: "14 study program" },
    { icon: "mdi:school", value: "64", label: "Active Trainee", subtitle: "14 study program" },
  ];

  const examinations = useMemo(() => {
    const list = agendaEvents
      .filter((ev) => String(ev.type || "").startsWith("ujian_"))
      .slice(0, 3)
      .map((ev) => {
        const start = parseLocalNoon(ev.start_date);
        const end = parseLocalNoon(ev.end_date) ?? start;
        const meta = getTypeMeta(ev.type);

        return {
          id: ev.id,
          date: start && end ? formatExamDateLabel(start, end) : "-",
          dateLabel: start && end ? formatExamDateLabel(start, end) : "-",
          startDate: start,
          endDate: end,
          type: ev.type,
          status: meta.examLabel || "Exam",
          statusColor: meta.solidBg || "bg-blue-600",
          title: ev.title,
          location: ev.location || "",
          description: ev.description,
          registration: ev.registration_url,
          image: ev.image_url,
        };
      });

    return list;
  }, [agendaEvents]);

  const events = useMemo(() => {
    const list = agendaEvents
      .filter((ev) => String(ev.type || "").startsWith("event_"))
      .slice(0, 6)
      .map((ev) => {
        const start = parseLocalNoon(ev.start_date);
        const end = parseLocalNoon(ev.end_date) ?? start;
        const meta = getTypeMeta(ev.type);

        return {
          id: ev.id,
          date: start && end ? formatEventDateLabel(start, end) : "-",
          dateLabel: start && end ? formatEventDateLabel(start, end) : "-",
          startDate: start,
          endDate: end,
          type: ev.type,
          title: ev.title,
          description: ev.description,
          location: ev.location || "",
          image: ev.image_url,
          registration: ev.registration_url,
          badge: meta.examLabel || "Event",
          badgeClass: `${meta.softBg || "bg-purple-100"} ${meta.softText || "text-purple-700"}`,
        };
      });

    return list;
  }, [agendaEvents]);

  // Educational Dashboard Programs
  const programs = [
    {
      id: "P1",
      badge: "PPDS 1",
      description: "The first specialist medical education program for Orthopedics — focusing on general orthopedic surgery & trauma.",
      students: "720",
      charts: [
        {
          title: "Study Programs",
          data: [
            { name: 'FK UI', value: 79 },
            { name: 'FK UNAIR', value: 66 },
            { name: 'FK UNPAD', value: 59 },
            { name: 'FK UNHAS', value: 76 },
            { name: 'FK UNS', value: 79 },
            { name: 'FK UGM', value: 76 },
            { name: 'FK UDAYANA', value: 78 },
            { name: 'FK USU', value: 57 },
            { name: 'FK UBRA', value: 69 },
            { name: 'FK USRI', value: 40 },
            { name: 'FK UNAN', value: 51 },
            { name: 'FK UPK', value: 33 },
            { name: 'FK ULM', value: 27 },
            { name: 'RS SOEHARSSO', value: 9 }
          ],
          colors: ['#dc2626', '#3b82f6', '#ec4899', '#8b5cf6', '#f59e0b', '#10b981', '#6b7280', '#06b6d4', '#84cc16', '#f97316', '#a855f7', '#14b8a6', '#64748b'],
          legends: [
            { label: 'FK UI', value: 79 },
            { label: 'FK UNAIR', value: 66 },
            { label: 'FK UNPAD', value: 59 },
            { label: 'FK UNHAS', value: 76 },
            { label: 'FK UNS', value: 79 },
            { label: 'FK UGM', value: 76 },
            { label: 'FK UDAYANA', value: 78 },
            { label: 'FK USU', value: 57 }
          ],
          legendsRight: [
            { label: 'FK UBRA', value: 69 },
            { label: 'FK USRI', value: 40 },
            { label: 'FK UNAN', value: 51 },
            { label: 'FK UPK', value: 33 },
            { label: 'FK ULM', value: 27 },
            { label: 'RS SOEHARSSO', value: 9 }
          ],
          total: 720
        },
        {
          title: "Semester",
          data: [
            { name: 'Semester 1', value: 69 },
            { name: 'Semester 2', value: 80 },
            { name: 'Semester 3', value: 79 },
            { name: 'Semester 4', value: 71 },
            { name: 'Semester 5', value: 66 },
            { name: 'Semester 6', value: 80 },
            { name: 'Semester 7', value: 63 },
            { name: 'Semester 8', value: 56 },
            { name: 'Semester 9', value: 55 }
          ],
          colors: ['#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#84cc16', '#f97316'],
          legends: [
            { label: 'Semester 1', value: 69 },
            { label: 'Semester 2', value: 80 },
            { label: 'Semester 3', value: 79 },
            { label: 'Semester 4', value: 71 },
            { label: 'Semester 5', value: 66 }
          ],
          legendsRight: [
            { label: 'Semester 6', value: 80 },
            { label: 'Semester 7', value: 63 },
            { label: 'Semester 8', value: 56 },
            { label: 'Semester 9', value: 55 }
          ],
          total: 619
        },
        {
          title: "Gender",
          data: [
            { name: 'Male', value: 628 },
            { name: 'Female', value: 46 }
          ],
          colors: ['#3b82f6', '#93c5fd'],
          legends: [
            { label: 'Male', value: 628 },
            { label: 'Female', value: 46 }
          ],
          total: 674
        },
        {
          title: "Members",
          data: [
            { name: 'Graduated', value: 1157 },
            { name: 'Active Students', value: 678 }
          ],
          colors: ['#10b981', '#86efac'],
          legends: [
            { label: 'Graduated', value: 1157 },
            { label: 'Active Students', value: 678 }
          ],
          total: 1835
        }
      ]
    },
    {
      id: "CF",
      badge: "Clinical Fellowship",
      description: "Fellowship programs for subspecialization & continuing education.",
      students: "42",
      charts: [
        {
          title: "Organizer",
          data: [
            { name: 'RSUD Dr. Saiful Anwar Malang', value: 6 },
            { name: 'RSUP Dr. Hasan Sadikin Bandung', value: 10 },
            { name: 'RSUP Dr. Sardjito Yogyakarta', value: 6 },
            { name: 'RSUD Dr. Moewardi Solo', value: 1 }
          ],
          colors: ['#10b981', '#86efac', '#34d399', '#6ee7b7'],
          legends: [
            { label: 'RSUD Dr. Saiful Anwar Malang', value: 6 },
            { label: 'RSUP Dr. Hasan Sadikin Bandung', value: 10 },
            { label: 'RSUP Dr. Sardjito Yogyakarta', value: 6 },
            { label: 'RSUD Dr. Moewardi Solo', value: 1 }
          ],
          total: 23
        },
        {
          title: "specialization",
          data: [
            { name: 'Spine', value: 21 },
            { name: 'Hip And Knee', value: 2 },
            { name: 'Hand, Upper Limb and Microsurgery', value: 5 },
            { name: 'Oncology and Reconstruction', value: 2 },
            { name: 'Orthopaedic', value: 2 },
            { name: 'Foot and Ankle', value: 3 },
            { name: 'Shoulder and Elbow', value: 2 },
            { name: 'Advanced Orthopaedic Trauma', value: 4 },
            { name: 'Sport Injury', value: 7 }
          ],
          colors: ['#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#10b981', '#6b7280', '#06b6d4', '#84cc16'],
          legends: [
            { label: 'Spine', value: 21 },
            { label: 'Hip And Knee', value: 2 },
            { label: 'Hand, Upper Limb and Microsurgery', value: 5 },
            { label: 'Oncology and Reconstruction', value: 2 },
            { label: 'Orthopaedic', value: 2 }
          ],
          legendsRight: [
            { label: 'Shoulder and Elbow', value: 2 },
            { label: 'Advanced Orthopaedic Trauma', value: 4 },
            { label: 'Sport Injury', value: 7 },
            { label: 'Foot and Ankle', value: 3 }
          ],
          total: 48
        },
        {
          title: "Gender",
          data: [
            { name: 'Male', value: 2 },
            { name: 'Female', value: 39 }
          ],
          colors: ['#3b82f6', '#93c5fd'],
          legends: [
            { label: 'Male', value: 2 },
            { label: 'Female', value: 39 }
          ],
          total: 41
        },
        {
          title: "Members",
          data: [
            { name: 'Graduated', value: 21 },
            { name: 'Active Students', value: 21 }
          ],
          colors: ['#10b981', '#86efac'],
          legends: [
            { label: 'Graduated', value: 21 },
            { label: 'Active Students', value: 21 }
          ],
          total: 42
        }
      ]
    },
    {
      id: "SP",
      badge: "Subspesialis",
      description: "Advanced program for Traumatology — trauma management & reconstruction.",
      students: "64",
      charts: [
        {
          title: "Study Program",
          data: [
            { name: 'FK UI', value: 20 },
            { name: 'FK UNAIR', value: 20 }
          ],
          colors: ['#dc2626', '#fca5a5'],
          legends: [
            { label: 'FK UI', value: 20 },
            { label: 'FK UNAIR', value: 20 }
          ],
          total: 40
        },
        {
          title: "specialization",
          data: [
            { name: 'Spine', value: 21 },
            { name: 'Hip And Knee', value: 2 },
            { name: 'Hand, Upper Limb and Microsurgery', value: 5 },
            { name: 'Oncology and Reconstruction', value: 2 },
            { name: 'Orthopaedic', value: 2 },
            { name: 'Foot and Ankle', value: 3 },
            { name: 'Shoulder and Elbow', value: 2 },
            { name: 'Advanced Orthopaedic Trauma', value: 4 },
            { name: 'Sport Injury', value: 7 }
          ],
          colors: ['#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#10b981', '#6b7280', '#06b6d4', '#84cc16'],
          legends: [
            { label: 'Spine', value: 21 },
            { label: 'Hip And Knee', value: 2 },
            { label: 'Hand, Upper Limb and Microsurgery', value: 5 },
            { label: 'Oncology and Reconstruction', value: 2 },
            { label: 'Orthopaedic', value: 2 }
          ],
          legendsRight: [
            { label: 'Shoulder and Elbow', value: 2 },
            { label: 'Advanced Orthopaedic Trauma', value: 4 },
            { label: 'Sport Injury', value: 7 },
            { label: 'Foot and Ankle', value: 3 }
          ],
          total: 48
        },
        {
          title: "Gender",
          data: [
            { name: 'Male', value: 5 },
            { name: 'Female', value: 59 }
          ],
          colors: ['#3b82f6', '#93c5fd'],
          legends: [
            { label: 'Male', value: 5 },
            { label: 'Female', value: 59 }
          ],
          total: 64
        },
        {
          title: "Members",
          data: [
            { name: 'Grad', value: 35 },
            { name: 'Active', value: 64 }
          ],
          colors: ['#10b981', '#86efac'],
          legends: [
            { label: 'Grad', value: 35 },
            { label: 'Active', value: 64 }
          ],
          total: 99
        }
      ]
    }
  ];


  const chartColors = ['#3b82f6', '#ef4444', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6'];

  return (
    <HomepageLayout>
      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-32 pb-32 sm:pb-40 overflow-hidden">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/assets/images/homepage/banner.png" 
            alt="Background Banner"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-700/80 to-blue-600/70"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-white">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                E-Dashboard Indonesian Orthopaedic and Traumatology Education
              </h1>
              <p className="text-base sm:text-lg leading-relaxed max-w-xl opacity-95">
                Providing open, current, and accurate information. Enhancing integration of academic information & scientific activities through a single gateway.
              </p>
            </div>
            <div className="relative flex justify-end">
              {/* Stacked Images Effect with Click to Switch */}
              <div className="relative h-[300px] w-full max-w-[500px] cursor-pointer" onClick={handleImageSwitch}>
                <AnimatePresence mode="wait">
                  {/* Back Image */}
                  <motion.div
                    key={`back-${isFlipped}`}
                    initial={{ opacity: 0, scale: 0.8, rotate: isFlipped ? 2 : -2 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1, 
                      rotate: isFlipped ? 2 : -2,
                      x: isFlipped ? 16 : -16,
                      y: 16
                    }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute w-full h-full bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-xl z-0"
                  >
                    <div className="w-full h-full overflow-hidden rounded-lg">
                      <img 
                        src={isFlipped ? heroImages[0].src : heroImages[1].src}
                        alt={isFlipped ? heroImages[0].alt : heroImages[1].alt}
                        className="w-full h-full object-cover opacity-60"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  </motion.div>

                  {/* Front Image */}
                  <motion.div
                    key={`front-${isFlipped}`}
                    initial={{ opacity: 0, scale: 0.9, rotate: 0 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1, 
                      rotate: 0
                    }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    whileHover={{ scale: 1.02 }}
                    className="relative w-full h-full bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-2xl z-10"
                  >
                    <div className="relative w-full h-full overflow-hidden rounded-lg">
                      <img 
                        src={isFlipped ? heroImages[1].src : heroImages[0].src}
                        alt={isFlipped ? heroImages[1].alt : heroImages[0].alt}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = '<div class="bg-gradient-to-br from-blue-50 to-blue-100 w-full h-full flex items-center justify-center rounded-lg"><svg class="w-32 h-32 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg></div>';
                        }}
                      />
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-16 -mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon icon={stat.icon} className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {stat.value}
                    </div>
                    <p className="text-2xl font-semibold text-gray-900 mb-0.5">
                      {stat.label}
                    </p>
                    <p className="text-lg text-gray-500">
                      {stat.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Examination Section */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Upcoming Examination</h2>
            <Link
              href="/calendar-academic"
              className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              aria-label="Show more upcoming examinations in Academic Calendar"
            >
              Show More
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          {examinations.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">No upcoming examinations</h3>
              <p className="mt-1 text-sm text-gray-600">Check the academic calendar to see the full schedule and the latest updates.</p>
              <div className="mt-5">
                <Link
                  href="/calendar-academic"
                  className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                >
                  View Calendar
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {examinations.map((exam, index) => (
                <div
                  key={exam.id ?? index}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-300 cursor-pointer"
                  onClick={() => openDetailModal(exam)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-700">{exam.date}</span>
                      <span className="text-gray-400">•</span>
                      <span className={`${exam.statusColor} text-white text-xs font-semibold px-3 py-1 rounded`}>
                        {exam.status}
                      </span>
                    </div>
                    {exam.registration ? (
                      <a
                        href={exam.registration}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium transition"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Detail
                      </a>
                    ) : (
                      <button
                        type="button"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDetailModal(exam);
                        }}
                      >
                        Detail
                      </button>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {exam.title}
                  </h3>
                  <p className="text-sm text-gray-600">{exam.location}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Event Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Upcoming Event</h2>
            <Link
              href="/calendar-academic"
              className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              aria-label="Show more upcoming events in Academic Calendar"
            >
              Show More
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          {events.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-50">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">No upcoming events</h3>
              <p className="mt-1 text-sm text-gray-600">Check the academic calendar for upcoming events and registration details.</p>
              <div className="mt-5">
                <Link
                  href="/calendar-academic"
                  className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                >
                  View Calendar
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, index) => (
                <div
                  key={event.id ?? index}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => openDetailModal(event)}
                >
                  {/* Event Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={event.image || DEFAULT_EVENT_IMAGE}
                      alt={event.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        if (e.currentTarget.dataset.fallbackApplied === "1") return;
                        e.currentTarget.dataset.fallbackApplied = "1";
                        e.currentTarget.src = DEFAULT_EVENT_IMAGE;
                      }}
                    />
                  </div>
                  
                  {/* Event Details */}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-medium text-gray-700">{event.date}</span>
                      <span className="text-gray-400">•</span>
                      <span className={`${event.badgeClass || "bg-purple-100 text-purple-700"} text-xs font-semibold px-3 py-1 rounded`}>
                        {event.badge}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                      {event.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">{event.location}</p>
                    {event.registration && (
                      <a 
                        href={event.registration}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Registration <ChevronRight className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Educational Dashboard Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Educational Dashboard</h2>
          
          <div className="space-y-6">
            {programs.map((program, index) => (
              <ProgramCard key={index} program={program} />
            ))}
          </div>
        </div>
      </section>

      {showDetailModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className={`p-6 rounded-t-xl ${getTypeMeta(selectedEvent.type).solidBg}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-white" />
                  <span className="text-white font-medium text-sm">
                    {selectedEvent.dateLabel || selectedEvent.date || "-"}
                  </span>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <h3 className="text-xl font-bold text-white">{selectedEvent.title}</h3>
            </div>
            <div className="p-6">
              <div className="mb-4 overflow-hidden rounded-lg border border-gray-200">
                <img
                  src={selectedEvent.image || DEFAULT_EVENT_IMAGE}
                  alt={selectedEvent.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    if (e.currentTarget.dataset.fallbackApplied === "1") return;
                    e.currentTarget.dataset.fallbackApplied = "1";
                    e.currentTarget.src = DEFAULT_EVENT_IMAGE;
                  }}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-500 mb-1">Event Type</label>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getTypeMeta(selectedEvent.type).solidBg}`}></div>
                  <span className="text-gray-900 font-medium">{getTypeMeta(selectedEvent.type).name}</span>
                </div>
              </div>
              {selectedEvent.description && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Description</label>
                  <p className="text-gray-700">{selectedEvent.description}</p>
                </div>
              )}
              {selectedEvent.location && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Location</label>
                  <p className="text-gray-700 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    {selectedEvent.location}
                  </p>
                </div>
              )}
              {selectedEvent.registration && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Registration</label>
                  <a
                    href={selectedEvent.registration}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 hover:underline break-all"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {selectedEvent.registration}
                  </a>
                </div>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </HomepageLayout>
  );
}