import { Link } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  Users, 
  BookOpen, 
  Award,
  Calendar,
  MapPin,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import HomepageLayout from "../Layouts/HomepageLayout";
import DonutChart from "../components/DonutChart";

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
        <div key={legIdx} className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <div 
              className="w-1.5 h-1.5 rounded-full" 
              style={{ backgroundColor: colors[(startIndex + legIdx) % colors.length] }}
            />
            <span className="text-gray-700">{legend.label}</span>
          </div>
          <span className="font-medium text-gray-900">: {legend.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function Homepage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
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

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };
  // Stats data
  const stats = [
    { icon: "mdi:school", value: "720", label: "Active Resident" },
    { icon: "mdi:school", value: "42", label: "Active Fellow" },
    { icon: "mdi:school", value: "64", label: "Active Trainee" },
    { icon: "mdi:bank", value: "20", label: "Study Program" }
  ];

  // Upcoming Examination
  const examinations = [
    { 
      date: "04 Des 2025", 
      status: "National Exam", 
      statusColor: "bg-blue-600",
      title: "Pre-exam PPDS 1", 
      location: "Jakarta" 
    },
    { 
      date: "6-7 Des 2025", 
      status: "National Exam", 
      statusColor: "bg-blue-600",
      title: "National Board Examination (Session 2)", 
      location: "Jakarta" 
    },
    { 
      date: "17 Jan 2026", 
      status: "National Exam", 
      statusColor: "bg-blue-600",
      title: "Fellowship Admission Test", 
      location: "Jakarta" 
    }
  ];

  // Upcoming Event
  const events = [
    { 
      date: "6-7 February 2026", 
      title: "SRS Asia Pacific Meeting 2026",
      description: "Scoliosis Research Society – Asia Pacific Meeting 2026",
      location: "Fukuoka, Japan",
      image: "/assets/images/event/srs.jpeg",
      registration: "https://www.srs.org/Meetings-Conferences/Regional-Scientific-Meeting/RSM-2026",
      badge: "Event"
    },
    { 
      date: "11-13 March 2026", 
      title: "CSRS-AP 2026",
      description: "16th Annual Meeting of Cervical Spine Research Society – Asia Pacific",
      location: "Shanghai International Convention Center, China",
      image: "/assets/images/event/csrs-ap.jpeg",
      registration: "https://www.csrs-ap2026.org/",
      badge: "Event"
    },
    { 
      date: "20-22 May 2026", 
      title: "KSSS 2026",
      description: "The 43rd International Congress of Korean Society of Spine Surgery",
      location: "Lotte Hotel Seoul, South Korea",
      image: "/assets/images/event/ksss.jpeg",
      registration: "https://ksss2026.org/ksss/contents/01_06.php",
      badge: "Event"
    },
    { 
      date: "3-6 June 2026", 
      title: "APSS Congress 2026",
      description: "Asia Pacific Spine Society 32nd Annual Scientific Meeting and Philippine Spine Society Annual Meeting",
      location: "Shangri-La Mactan, Cebu, Philippines",
      image: "/assets/images/event/apss.jpeg",
      registration: "https://www.apss2026ph.org",
      badge: "Event"
    },
    { 
      date: "18-20 June 2026", 
      title: "Asia Spine 2026",
      description: "The 17th Annual Meeting of Asia Spine",
      location: "Osaka International Convention Center, Osaka, Japan",
      image: "/assets/images/event/asia-spine.jpeg",
      registration: "https://cs-oto3.com/nsj2026-17amoas/en-greeting.html",
      badge: "Event"
    },
    { 
      date: "16-18 July 2026", 
      title: "SMISS-ASEAN MISST-SSS Combine Meeting 2026",
      description: "Combine Meeting of Society for Minimally Invasive Spine Surgery – Asia Pacific (SMISS-AP), 6th Meeting - Singapore Spine Society (SSS), 9th Meeting",
      location: "Shangri-La Hotel, Singapore",
      image: "/assets/images/event/smiss.jpeg",
      registration: "https://www.smiss-aseanmisst-sss2026.org/",
      badge: "Event"
    }
  ];

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
              >
                <div className="flex items-center justify-center gap-4">
                  <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon icon={stat.icon} className="w-7 h-7 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-4xl font-bold text-gray-900 mb-0.5">
                      {stat.value}
                    </div>
                    <p className="text-sm font-semibold text-gray-700">
                      {stat.label}
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
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Upcoming Examination</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {examinations.map((exam, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-300">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">{exam.date}</span>
                    <span className="text-gray-400">•</span>
                    <span className={`${exam.statusColor} text-white text-xs font-semibold px-3 py-1 rounded`}>
                      {exam.status}
                    </span>
                  </div>
                  <Link 
                    href="#" 
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium transition"
                  >
                    Detail
                  </Link>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {exam.title}
                </h3>
                <p className="text-sm text-gray-600">{exam.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Event Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Upcoming Event</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
                {/* Event Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center"><svg class="w-16 h-16 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>';
                    }}
                  />
                </div>
                
                {/* Event Details */}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-medium text-gray-700">{event.date}</span>
                    <span className="text-gray-400">•</span>
                    <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded">
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
                    >
                      Registration <ChevronRight className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
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

    </HomepageLayout>
  );
}