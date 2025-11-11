import { useState } from "react";
import { Link } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import HomepageLayout from "../Layouts/HomepageLayout";

export default function CalendarAcademic() {
  const [currentMonth, setCurrentMonth] = useState(1); // February (0-indexed)
  const [currentYear, setCurrentYear] = useState(2026);

  // Stats data
  const stats = [
    {
      label: "Tahun Akademik 2024/2025",
      icon: "mdi:calendar",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      label: "Semester A419 Ganjil",
      icon: "mdi:play",
      iconBg: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      label: "Unit Akademik B2",
      icon: "mdi:school",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600"
    },
    {
      label: "Biro Senin 6",
      icon: "mdi:map-marker",
      iconBg: "bg-red-100",
      iconColor: "text-red-600"
    }
  ];

  // Event types with colors
  const eventTypes = [
    { name: "Blue Link", color: "bg-blue-500" },
    { name: "Ujian Nasional", color: "bg-cyan-400" },
    { name: "Event Lainbe", color: "bg-green-500" },
    { name: "Semua Nasional", color: "bg-orange-500" },
    { name: "Exam Peer Group", color: "bg-red-500" }
  ];

  // Ongoing events
  const ongoingEvents = [
    {
      date: "6-7 February 2026",
      type: "Event",
      title: "SRS Asia Pacific Meeting 2026",
      location: "Fukuoka, Japan",
      image: "/assets/images/event/srs.jpeg",
      eventTitle: "Scoliosis Research Society – Asia Pacific Meeting 2026"
    }
  ];

  // Upcoming tests
  const upcomingTests = [
    {
      date: "7 Dec 2025",
      type: "LOKAL",
      title: "Pre-exam PPDS 1",
      location: "Auditorium RSUP"
    },
    {
      date: "7 Dec 2025",
      type: "NASIONAL",
      title: "Fellowship Admission Test",
      location: "Jakarta Convention Center"
    },
    {
      date: "7 Dec 2025",
      type: "LOKAL",
      title: "Subspec Board Examination (Traumatology)",
      location: "RS Pendidikan"
    }
  ];

  // Upcoming events - All 6 spine surgery conferences
  const upcomingEvents = [
    {
      date: "6-7 February 2026",
      title: "SRS Asia Pacific Meeting 2026",
      description: "Scoliosis Research Society – Asia Pacific Meeting 2026",
      location: "Fukuoka, Japan",
      image: "/assets/images/event/srs.jpeg"
    },
    {
      date: "11-13 March 2026",
      title: "CSRS-AP 2026",
      description: "16th Annual Meeting of Cervical Spine Research Society – Asia Pacific",
      location: "Shanghai, China",
      image: "/assets/images/event/csrs-ap.jpeg"
    },
    {
      date: "20-22 May 2026",
      title: "KSSS 2026",
      description: "The 43rd International Congress of Korean Society of Spine Surgery",
      location: "Seoul, South Korea",
      image: "/assets/images/event/ksss.jpeg"
    },
    {
      date: "3-6 June 2026",
      title: "APSS Congress 2026",
      description: "Asia Pacific Spine Society 32nd Annual Meeting",
      location: "Cebu, Philippines",
      image: "/assets/images/event/apss.jpeg"
    },
    {
      date: "18-20 June 2026",
      title: "Asia Spine 2026",
      description: "The 17th Annual Meeting of Asia Spine",
      location: "Osaka, Japan",
      image: "/assets/images/event/asia-spine.jpeg"
    },
    {
      date: "16-18 July 2026",
      title: "SMISS-ASEAN MISST-SSS Combine Meeting 2026",
      description: "Combine Meeting of Society for Minimally Invasive Spine Surgery",
      location: "Singapore",
      image: "/assets/images/event/smiss.jpeg"
    }
  ];

  // Calendar data
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const firstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendar = () => {
    const days = daysInMonth(currentMonth, currentYear);
    const firstDay = firstDayOfMonth(currentMonth, currentYear);
    const calendar = [];

    // Previous month days
    const prevMonthDays = daysInMonth(currentMonth - 1, currentYear);
    for (let i = firstDay - 1; i >= 0; i--) {
      calendar.push({
        day: prevMonthDays - i,
        isCurrentMonth: false,
        events: []
      });
    }

    // Current month days
    for (let i = 1; i <= days; i++) {
      const events = [];
      
      // Add sample events
      if (i === 5) {
        events.push({ title: "Ujian Tulis Nasional ICBT (Session I)", color: "bg-cyan-200" });
      }
      
      calendar.push({
        day: i,
        isCurrentMonth: true,
        events
      });
    }

    // Next month days
    const remaining = 42 - calendar.length; // 6 weeks
    for (let i = 1; i <= remaining; i++) {
      calendar.push({
        day: i,
        isCurrentMonth: false,
        events: []
      });
    }

    return calendar;
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <HomepageLayout>
      {/* Breadcrumb Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-white text-sm">
            <Link href="/" className="hover:underline">Beranda</Link>
            <span>/</span>
            <span>Calendar Academic</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title */}
          <h1 className="text-3xl font-bold text-blue-700 mb-8">
            Calender Academic 2024/2025
          </h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 ${stat.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon icon={stat.icon} className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Ongoing Today */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-blue-700 mb-4">
              Ongoing Today <span className="text-gray-600 font-normal">06 February 2026</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ongoingEvents.map((event, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-medium text-gray-700">{event.date}</span>
                      <span className="text-gray-400">•</span>
                      <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded">{event.type}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{event.eventTitle}</p>
                    <p className="text-sm text-gray-500">{event.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Test */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-blue-700 mb-4">
              Upcoming Examination <span className="text-gray-600 font-normal">December 2025</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingTests.map((test, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-medium text-gray-700">{test.date}</span>
                    <span className="text-gray-400">•</span>
                    <span className={`${test.type === 'NASIONAL' ? 'bg-blue-600' : test.type === 'LOKAL' ? 'bg-purple-600' : 'bg-red-600'} text-white text-xs font-bold px-3 py-1 rounded`}>
                      {test.type}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{test.title}</h3>
                  <p className="text-sm text-gray-600">{test.location}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Event */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-blue-700 mb-4">
              Upcoming Event <span className="text-gray-600 font-normal">February - July 2026</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
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
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-medium text-gray-700">{event.date}</span>
                      <span className="text-gray-400">•</span>
                      <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded">Event</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{event.title}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{event.description}</p>
                    <p className="text-sm text-gray-500">{event.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calendar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-blue-700 mb-4">Calender Academic</h2>
              
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">
                  {monthNames[currentMonth]}, {currentYear}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Februari, 2025</span>
                  <button
                    onClick={handlePrevMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={handleNextMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {/* Day Headers */}
                {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
                  <div key={day} className="text-center text-xs font-semibold text-gray-600 py-2">
                    {day}
                  </div>
                ))}

                {/* Calendar Days */}
                {generateCalendar().map((item, index) => (
                  <div
                    key={index}
                    className={`min-h-24 border border-gray-200 p-2 ${
                      !item.isCurrentMonth ? "bg-gray-50 text-gray-400" : "bg-white"
                    }`}
                  >
                    <div className="text-sm font-medium mb-1">{item.day}</div>
                    {item.events.map((event, eventIndex) => (
                      <div
                        key={eventIndex}
                        className={`text-xs p-1 rounded ${event.color} text-gray-800 mb-1`}
                      >
                        {event.title}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center gap-4 mt-6 pt-6 border-t border-gray-200">
                {eventTypes.map((type, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${type.color}`}></div>
                    <span className="text-sm text-gray-700">{type.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </HomepageLayout>
  );
}
