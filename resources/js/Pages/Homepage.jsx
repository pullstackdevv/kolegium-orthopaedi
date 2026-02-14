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
    if (program.id === "SP") return "Active Trainees:";
    return "Active Students:";
  };

  return (
    <div className="flex flex-col justify-center">
      <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-white rounded-2xl p-8 h-full flex flex-col justify-center">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="bg-primary text-white px-4 py-2 rounded-lg text-2xl font-bold">
              {program.id}
            </span>
            <span className="text-2xl font-bold text-gray-900">{program.badge}</span>
          </div>
          <p className="text-base text-gray-700 leading-relaxed">
            {program.description}
          </p>
          <div className="pt-4 border-t border-primary/20">
            <p className="text-sm text-gray-600 mb-1">{getStudentLabel()}</p>
            <p className="text-3xl font-bold text-primary">{program.students}</p>
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
  const hasData = chart.data && chart.data.length > 0;
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
      {hasData ? (
        <ChartLegends chart={chart} />
      ) : (
        <p className="text-center text-sm text-gray-400">No data available</p>
      )}
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
  const [dashboardStats, setDashboardStats] = useState([]);
  const [wbsStats, setWbsStats] = useState(null);
  
  const heroImages = [
    {
      src: "/assets/images/homepage/banner-00.png",
      alt: "Indonesian Orthopaedic Team - Image 1"
    },
    {
      src: "/assets/images/homepage/banner-01.png",
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
      solidBg: "bg-primary",
      softBg: "bg-primary/10",
      softText: "text-primary",
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
        solidBg: "bg-primary",
        softBg: "bg-primary/10",
        softText: "text-primary",
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
  // Stats data (dynamic from dashboard stats)
  const stats = useMemo(() => {
    const find = (type) => dashboardStats.find((s) => s.organization_type === type);
    const r = find("resident");
    const f = find("fellow");
    const t = find("trainee");
    return [
      { icon: "mdi:school", value: String(r?.active_count ?? 0), label: "Residency", subtitle: `${r?.by_affiliation?.length ?? 0} study programs`, unit: "active residents" },
      { icon: "mdi:school", value: String(f?.active_count ?? 0), label: "Clinical Fellowship", subtitle: `${f?.by_affiliation?.length ?? 0} study programs`, unit: "active fellows" },
      { icon: "mdi:school", value: String(t?.active_count ?? 0), label: "Subspecialist", subtitle: `${t?.by_affiliation?.length ?? 0} study programs`, unit: "active trainees" },
    ];
  }, [dashboardStats]);

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
          statusColor: meta.solidBg || "bg-primary",
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

  // Educational Dashboard – fetch dynamic data
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await api.get("/public/database-members/dashboard-stats", {
          headers: { "X-Skip-Auth-Redirect": "1" },
        });
        if (res.data?.status === "success") {
          setDashboardStats(Array.isArray(res.data.data) ? res.data.data : []);
        }
      } catch (e) {
        console.error("Failed to fetch dashboard stats", e);
      }
    };
    fetchDashboardStats();
  }, []);

  // WBS stats – fetch
  useEffect(() => {
    const fetchWbsStats = async () => {
      try {
        const res = await api.get("/public/wellbeing-surveys/stats");
        if (res.data?.status === "success") {
          setWbsStats(res.data.data);
        }
      } catch (e) {
        console.error("Failed to fetch WBS stats", e);
      }
    };
    fetchWbsStats();
  }, []);

  const CHART_PALETTE = [
    '#dc2626', '#3b82f6', '#ec4899', '#8b5cf6', '#f59e0b', '#10b981',
    '#6b7280', '#06b6d4', '#84cc16', '#f97316', '#a855f7', '#14b8a6',
    '#64748b', '#ef4444', '#0ea5e9', '#d946ef',
  ];
  const GENDER_COLORS = ['#3b82f6', '#ec4899'];
  const STATUS_COLORS_CHART = ['#10b981', '#f59e0b', '#ef4444'];

  const buildChart = (title, items, colors) => {
    const data = items.map((i) => ({ name: i.name, value: i.value }));
    const total = data.reduce((s, d) => s + d.value, 0);
    const half = Math.ceil(data.length / 2);
    const legends = data.slice(0, half).map((d) => ({ label: d.name, value: d.value }));
    const legendsRight = data.length > half ? data.slice(half).map((d) => ({ label: d.name, value: d.value })) : undefined;
    return { title, data, colors: colors.slice(0, data.length), legends, ...(legendsRight ? { legendsRight } : {}), total };
  };

  const MOOD_COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#f97316', '#ef4444'];
  const RISK_COLORS_CHART = ['#22c55e', '#facc15', '#f97316', '#ef4444'];
  const QUESTIONNAIRE_COLORS = ['#ef4444', '#f97316', '#8b5cf6', '#3b82f6', '#ec4899', '#06b6d4'];

  const wbsCharts = useMemo(() => {
    if (!wbsStats) return [];
    const charts = [];

    // Mood Distribution
    const moodMap = { happy: 'Happy', normal: 'Normal', worry: 'Worry', depressed: 'Depressed', help_me: 'Help Me' };
    const moodItems = Object.entries(moodMap).map(([key, label]) => ({
      name: label, value: wbsStats.by_mood?.[key] || 0,
    })).filter(i => i.value > 0);
    if (moodItems.length > 0) {
      charts.push(buildChart('Mood', moodItems, MOOD_COLORS));
    }

    // Risk Distribution
    const riskMap = { low: 'Low', mild: 'Mild', moderate: 'Moderate', high: 'High' };
    const riskItems = Object.entries(riskMap).map(([key, label]) => ({
      name: label, value: wbsStats.by_risk?.[key] || 0,
    })).filter(i => i.value > 0);
    if (riskItems.length > 0) {
      charts.push(buildChart('Risk Level', riskItems, RISK_COLORS_CHART));
    }

    // Questionnaire Issues
    const qMap = {
      burnout: 'Burnout', emotional_hardening: 'Emotional Hardening',
      depressed: 'Depressed', sleep_issue: 'Sleep Issue',
      bullying: 'Bullying', discomfort: 'Discomfort',
    };
    const qItems = Object.entries(qMap).map(([key, label]) => ({
      name: label, value: wbsStats.questionnaire?.[key] || 0,
    })).filter(i => i.value > 0);
    if (qItems.length > 0) {
      charts.push(buildChart('Issues Reported', qItems, QUESTIONNAIRE_COLORS));
    }

    return charts;
  }, [wbsStats]);

  const PROGRAM_META = {
    resident: { id: "P1", badge: "PPDS 1", description: "The first specialist medical education program for Orthopedics — focusing on general orthopedic surgery & trauma." },
    fellow: { id: "CF", badge: "Clinical Fellowship", description: "Fellowship programs for subspecialization & continuing education." },
    trainee: { id: "SP", badge: "Subspecialist", description: "Advanced program for Traumatology — trauma management & reconstruction." },
  };

  const programs = useMemo(() => {
    const orgTypes = ["resident", "fellow", "trainee"];
    return orgTypes.map((orgType) => {
      const stat = dashboardStats.find((s) => s.organization_type === orgType) || {};
      const meta = PROGRAM_META[orgType];
      const charts = [];

      // Chart 1: Study Programs (by affiliation)
      charts.push(buildChart("Study Programs", stat.by_affiliation || [], CHART_PALETTE));

      // Chart 2: Semester (resident) or Subspecialty (fellow/trainee)
      if (orgType === "resident") {
        charts.push(buildChart("Semester", stat.by_semester || [], CHART_PALETTE));
      } else {
        charts.push(buildChart("Subspecialty", stat.by_specialization || [], CHART_PALETTE));
      }

      // Chart 3: Gender
      charts.push(buildChart("Gender", stat.by_gender || [], GENDER_COLORS));

      // Chart 4: Status
      charts.push(buildChart("Status", stat.by_status || [], STATUS_COLORS_CHART));

      return {
        ...meta,
        students: String(stat.active_count || 0),
        charts,
      };
    });
  }, [dashboardStats]);

  return (
    <HomepageLayout>
      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-32 pb-32 sm:pb-40 overflow-hidden">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/assets/images/homepage/banner-00.png" 
            alt="Background Banner"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-secondary/70"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-white">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                E-Dashboard Indonesian for Orthopaedic and Traumatology Education
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
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon icon={stat.icon} className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 flex items-baseline gap-2">
                      <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-sm font-semibold text-gray-500 whitespace-nowrap">{stat.unit || ""}</div>
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
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-secondary transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              aria-label="Show more upcoming examinations in Academic Calendar"
            >
              Show More
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          {examinations.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">No upcoming examinations</h3>
              <p className="mt-1 text-sm text-gray-600">Check the academic calendar to see the full schedule and the latest updates.</p>
              <div className="mt-5">
                <Link
                  href="/calendar-academic"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-secondary transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
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
                        className="text-primary hover:text-secondary text-sm font-medium transition"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Detail
                      </a>
                    ) : (
                      <button
                        type="button"
                        className="text-primary hover:text-secondary text-sm font-medium transition"
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
                        className="text-primary hover:text-secondary text-sm font-medium inline-flex items-center gap-1"
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

      {/* {wbsStats && wbsStats.total > 0 && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl overflow-hidden">
              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="flex flex-col justify-center">
                    <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-white rounded-2xl p-8 h-full flex flex-col justify-center">
                      <div className="space-y-6">
                        <div className="flex items-center gap-3">
                          <span className="bg-primary text-white px-4 py-2 rounded-lg text-2xl font-bold">WBS</span>
                          <span className="text-2xl font-bold text-gray-900">Well-Being Survey</span>
                        </div>
                        <p className="text-base text-gray-700 leading-relaxed">
                          Monitoring the mental health and well-being of orthopaedic education participants across all programs.
                        </p>
                        <div className="pt-4 border-t border-primary/20">
                          <p className="text-sm text-gray-600 mb-1">Total Responses:</p>
                          <p className="text-3xl font-bold text-primary">{wbsStats.total}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {wbsCharts.map((chart, idx) => (
                        <ChartCard key={idx} chart={chart} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )} */}

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
                    className="text-primary hover:text-secondary hover:underline break-all"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {selectedEvent.registration}
                  </a>
                </div>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors font-medium"
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