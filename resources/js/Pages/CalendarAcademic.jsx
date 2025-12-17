import { useEffect, useMemo, useState } from "react";
import { Link } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { ChevronLeft, ChevronRight, Calendar, X, Trash2, MapPin } from "lucide-react";
import HomepageLayout from "../Layouts/HomepageLayout";
import api from "@/api/axios";

export default function CalendarAcademic() {
  const [currentMonth, setCurrentMonth] = useState(1); // February (0-indexed)
  const [currentYear, setCurrentYear] = useState(2026);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [tempMonth, setTempMonth] = useState(1);
  const [tempYear, setTempYear] = useState(2026);
  const [events, setEvents] = useState([]);

  // Stats data
  const stats = useMemo(() => {
    return [
      {
        title: "Academic Year",
        value: academicYear.label,
        icon: "mdi:calendar",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
      },
      {
        title: "Examination Day",
        value: String(academicYearCounts.exams),
        icon: "mdi:briefcase",
        iconBg: "bg-orange-100",
        iconColor: "text-orange-600",
      },
      {
        title: "Event Day",
        value: String(academicYearCounts.agendaEvents),
        icon: "mdi:calendar-check",
        iconBg: "bg-red-100",
        iconColor: "text-red-600",
      },
    ];
  }, [academicYear.label, academicYearCounts.agendaEvents, academicYearCounts.exams]);

  // Event types with colors
  const eventTypes = [
    { id: "ujian_lokal", name: "Ujian Lokal", color: "bg-red-500", textColor: "text-red-700" },
    { id: "ujian_nasional", name: "Ujian Nasional", color: "bg-blue-500", textColor: "text-blue-700" },
    { id: "event_lokal", name: "Event Lokal", color: "bg-green-500", textColor: "text-green-700" },
    { id: "event_nasional", name: "Event Nasional", color: "bg-orange-500", textColor: "text-orange-700" },
    { id: "event_peer_group", name: "Event Peer Group", color: "bg-purple-500", textColor: "text-purple-700" }
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
    const today = new Date();

    // Previous month days
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const prevMonthDays = daysInMonth(prevMonth, prevYear);
    
    for (let i = firstDay - 1; i >= 0; i--) {
      calendar.push({
        day: prevMonthDays - i,
        isCurrentMonth: false,
        month: prevMonth,
        year: prevYear,
        isToday: false,
        events: getEventsForDate(prevMonthDays - i, prevMonth, prevYear)
      });
    }

    // Current month days
    for (let i = 1; i <= days; i++) {
      const isToday = today.getDate() === i && 
                     today.getMonth() === currentMonth && 
                     today.getFullYear() === currentYear;
      
      calendar.push({
        day: i,
        isCurrentMonth: true,
        month: currentMonth,
        year: currentYear,
        isToday,
        events: getEventsForDate(i, currentMonth, currentYear)
      });
    }

    // Next month days
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    const remaining = 42 - calendar.length;
    
    for (let i = 1; i <= remaining; i++) {
      calendar.push({
        day: i,
        isCurrentMonth: false,
        month: nextMonth,
        year: nextYear,
        isToday: false,
        events: getEventsForDate(i, nextMonth, nextYear)
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

  const getEventsForDate = (day, month, year) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === day && 
             eventDate.getMonth() === month && 
             eventDate.getFullYear() === year;
    });
  };

  const getEventColor = (eventType) => {
    const type = eventTypes.find(t => t.id === eventType);
    return type || eventTypes[0];
  };

  const handleDateClick = (day, isCurrentMonth) => {
    if (!isCurrentMonth) return;
    setSelectedDate({ day, month: currentMonth, year: currentYear });
    setShowEventModal(true);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowDetailModal(true);
  };

  const handleAddEvent = (newEvent) => {
    setEvents([...events, newEvent]);
    setShowEventModal(false);
  };

  const handleDeleteClick = (event) => {
    setEventToDelete(event);
    setShowDetailModal(false);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    setEvents(events.filter(e => e !== eventToDelete));
    setShowDeleteModal(false);
    setEventToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setEventToDelete(null);
  };

  const handleOpenDatePicker = () => {
    setTempMonth(currentMonth);
    setTempYear(currentYear);
    setShowDatePickerModal(true);
  };

  const handleApplyDatePicker = () => {
    setCurrentMonth(tempMonth);
    setCurrentYear(tempYear);
    setShowDatePickerModal(false);
  };

  const generateYearRange = () => {
    const currentYearNow = new Date().getFullYear();
    const years = [];
    for (let i = currentYearNow - 5; i <= currentYearNow + 10; i++) {
      years.push(i);
    }
    return years;
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
            Calender Academic {academicYear.label}
          </h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">{stat.title}</p>
                    <p className="text-3xl font-bold text-blue-700">{stat.value}</p>
                  </div>
                  <div className={`w-16 h-16 ${stat.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <Icon icon={stat.icon} className={`w-8 h-8 ${stat.iconColor}`} />
                  </div>
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
            <h2 className="text-2xl font-bold text-blue-600 mb-6">Calender Academic</h2>
            
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={handlePrevMonth}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>
                  {monthNames[currentMonth === 0 ? 11 : currentMonth - 1]}, {currentMonth === 0 ? currentYear - 1 : currentYear}
                </span>
              </button>

              <h3 
                className="text-2xl font-bold text-red-700 cursor-pointer hover:text-red-800 transition-colors"
                onClick={handleOpenDatePicker}
                title="Click to change month/year"
              >
                {monthNames[currentMonth]}, {currentYear}
              </h3>

              <button
                onClick={handleNextMonth}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                <span>
                  {monthNames[currentMonth === 11 ? 0 : currentMonth + 1]}, {currentMonth === 11 ? currentYear + 1 : currentYear}
                </span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="border border-gray-300">
              {/* Day Headers */}
              <div className="grid grid-cols-7 border-b border-gray-300">
                {["SUN", "MON", "TUE", "WED", "THUR", "FRI", "SAT"].map((day) => (
                  <div key={day} className="text-center text-sm font-semibold text-gray-600 py-3 border-r border-gray-300 last:border-r-0 bg-gray-50">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7">
                {generateCalendar().map((item, index) => (
                  <div
                    key={index}
                    className={`min-h-[120px] border-r border-b border-gray-300 p-2 cursor-pointer hover:bg-gray-50 transition-colors last:border-r-0 ${
                      !item.isCurrentMonth ? "bg-gray-50" : "bg-white"
                    } ${item.isToday ? "bg-blue-50" : ""}`}
                    onClick={() => handleDateClick(item.day, item.isCurrentMonth)}
                  >
                    <div className={`text-sm font-medium mb-1 ${
                      !item.isCurrentMonth ? "text-gray-400" : "text-gray-900"
                    } ${item.isToday ? "text-blue-600 font-bold" : ""}`}>
                      {item.day}
                    </div>
                    {item.isToday && (
                      <div className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded mb-1 inline-block">
                        Today
                      </div>
                    )}
                    <div className="space-y-1">
                      {item.events.map((event, eventIndex) => {
                        const eventColor = getEventColor(event.type);
                        return (
                          <div
                            key={eventIndex}
                            className={`text-xs p-1 rounded ${eventColor.color} bg-opacity-20 ${eventColor.textColor} cursor-pointer hover:bg-opacity-30 transition-colors`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEventClick(event, true);
                            }}
                          >
                            {event.title}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-gray-200">
              {eventTypes.map((type) => (
                <div key={type.id} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${type.color}`}></div>
                  <span className="text-sm text-gray-700">{type.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Add Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Add Event</h3>
              <button
                onClick={() => setShowEventModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const newEvent = {
                  date: new Date(selectedDate.year, selectedDate.month, selectedDate.day),
                  title: formData.get('title'),
                  type: formData.get('type'),
                  description: formData.get('description')
                };
                handleAddEvent(newEvent);
                e.target.reset();
              }}
              className="p-6 space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="text"
                  value={selectedDate ? `${selectedDate.day} ${monthNames[selectedDate.month]} ${selectedDate.year}` : ''}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="Enter event title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Type *
                </label>
                <select
                  name="type"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {eventTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  rows="3"
                  placeholder="Enter event description (optional)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                ></textarea>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Add Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Event Detail Modal */}
      {showDetailModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className={`p-6 rounded-t-xl ${getEventColor(selectedEvent.type).color}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-white" />
                  <span className="text-white font-medium text-sm">
                    {selectedEventStartDate
                      ? `${selectedEventStartDate.getDate()} ${monthNames[selectedEventStartDate.getMonth()]} ${selectedEventStartDate.getFullYear()}`
                      : String(selectedEvent.date || "")}
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
              {selectedEvent.image ? (
                <div className="mb-4 overflow-hidden rounded-lg border border-gray-200">
                  <img
                    src={selectedEvent.image}
                    alt={selectedEvent.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              ) : null}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-500 mb-1">Event Type</label>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getEventColor(selectedEvent.type).color}`}></div>
                  <span className="text-gray-900 font-medium">{getEventColor(selectedEvent.type).name}</span>
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
                  >
                    {selectedEvent.registration}
                  </a>
                </div>
              )}
              <div className="flex gap-3">
                {!selectedEvent.viewOnly && (
                  <button
                    onClick={() => handleDeleteClick(selectedEvent)}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                )}
                <button
                  onClick={() => setShowDetailModal(false)}
                  className={`${selectedEvent.viewOnly ? 'w-full' : 'flex-1'} px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium`}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Month/Year Picker Modal */}
      {showDatePickerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Select Month & Year</h3>
              <button
                onClick={() => setShowDatePickerModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Month
                </label>
                <select
                  value={tempMonth}
                  onChange={(e) => setTempMonth(parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium"
                >
                  {monthNames.map((month, index) => (
                    <option key={index} value={index}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year
                </label>
                <select
                  value={tempYear}
                  onChange={(e) => setTempYear(parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium"
                >
                  {generateYearRange().map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowDatePickerModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplyDatePicker}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && eventToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Delete Event</h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to delete "<span className="font-semibold text-gray-900">{eventToDelete.title}</span>"? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleCancelDelete}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </HomepageLayout>
  );
}
