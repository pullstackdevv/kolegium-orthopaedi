import { useState } from "react";
import { Link } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import HomepageLayout from "../Layouts/HomepageLayout";

export default function CalendarAcademic() {
  const [currentMonth, setCurrentMonth] = useState(10); // November (0-indexed)
  const [currentYear, setCurrentYear] = useState(2025);

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
      date: "5 Nov 2025",
      type: "CRT",
      title: "Ujian Tulis Nasional ICBT (Session I)",
      image: "/assets/images/national-congress.jpg",
      eventTitle: "23 National Congres"
    }
  ];

  // Upcoming tests
  const upcomingTests = [
    {
      date: "5 Nov 2025",
      type: "CRT",
      title: "Ujian Tulis Nasional ICBT (Session I)"
    }
  ];

  // Upcoming events
  const upcomingEvents = [
    {
      date: "5 Nov 2025",
      title: "23 National Congres",
      image: "/assets/images/national-congress.jpg"
    },
    {
      date: "5 Nov 2025",
      title: "23 National Congres",
      image: "/assets/images/national-congress.jpg"
    },
    {
      date: "5 Nov 2025",
      title: "23 National Congres",
      image: "/assets/images/national-congress.jpg"
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
              Ongoing Today <span className="text-gray-600 font-normal">05 November 2025</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ongoingEvents.map((event, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-gray-600">{event.date}</span>
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">{event.type}</span>
                    </div>
                    <h3 className="font-bold text-gray-900">{event.title}</h3>
                  </div>
                  <div className="relative bg-gradient-to-br from-red-700 to-red-900 h-48">
                    <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-r from-red-800 via-green-600 to-blue-600 opacity-80"></div>
                    <div className="relative h-full flex flex-col items-center justify-center p-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-lg mb-3 flex items-center justify-center border-4 border-yellow-500">
                        <Icon icon="mdi:medical-bag" className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white text-center">NATIONAL<br/>CONGRESS</h3>
                      <div className="bg-yellow-500 text-gray-900 px-3 py-1 rounded-full text-xs font-bold mt-2">
                        INDONESIAN ORTHOPAEDIC ASSOCIATION
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-gray-900">{event.eventTitle}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Test */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-blue-700 mb-4">
              Upcoming Test <span className="text-gray-600 font-normal">05 Nov 2025 - 11 Nov 2025</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingTests.map((test, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-gray-600">{test.date}</span>
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">{test.type}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">{test.title}</h3>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Event */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-blue-700 mb-4">
              Upcoming Event <span className="text-gray-600 font-normal">05 Nov 2025 - 11 Nov 2025</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="relative bg-gradient-to-br from-red-700 to-red-900 h-48">
                    <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-r from-red-800 via-green-600 to-blue-600 opacity-80"></div>
                    <div className="relative h-full flex flex-col items-center justify-center p-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-lg mb-3 flex items-center justify-center border-4 border-yellow-500">
                        <Icon icon="mdi:medical-bag" className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white text-center">NATIONAL<br/>CONGRESS</h3>
                      <div className="bg-yellow-500 text-gray-900 px-3 py-1 rounded-full text-xs font-bold mt-2">
                        INDONESIAN ORTHOPAEDIC ASSOCIATION
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 bg-white rounded-lg px-3 py-2 text-center">
                      <div className="text-xs text-gray-600 font-semibold">5 NOV</div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-gray-900">{event.title}</h4>
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
