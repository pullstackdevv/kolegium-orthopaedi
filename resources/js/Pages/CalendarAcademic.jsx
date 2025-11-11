import { useState } from "react";
import { Link } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { ChevronLeft, ChevronRight, Calendar, X, Plus, Trash2, MapPin } from "lucide-react";
import HomepageLayout from "../Layouts/HomepageLayout";

export default function CalendarAcademic() {
  const [currentMonth, setCurrentMonth] = useState(10); // November (0-indexed)
  const [currentYear, setCurrentYear] = useState(2025);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [tempMonth, setTempMonth] = useState(10);
  const [tempYear, setTempYear] = useState(2025);
  // Set default date to today for demo purposes
  const todayDate = new Date();
  todayDate.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues
  
  // Create dates for upcoming events
  const tomorrow = new Date(todayDate);
  tomorrow.setDate(todayDate.getDate() + 1);
  
  const nextWeekDate = new Date(todayDate);
  nextWeekDate.setDate(todayDate.getDate() + 5);
  
  const [events, setEvents] = useState([
    {
      id: 1,
      date: new Date(2025, 11, 6), // December 6, 2025
      title: "National Board Examination (Session 2)",
      type: "ujian_nasional",
      description: "National board examination for PPDS 1"
    },
    {
      id: 2,
      date: new Date(todayDate),
      title: "23 National Congress",
      type: "event_nasional",
      description: "Indonesian Orthopaedic Association National Congress"
    },
    {
      id: 3,
      date: new Date(nextWeekDate),
      title: "Presentasi Final Paper Kandidat",
      type: "event_peer_group",
      description: "Presentasi akhir paper untuk kandidat"
    },
    {
      id: 4,
      date: new Date(2026, 1, 6), // February 6, 2026
      title: "SRS Asia Pacific Meeting 2026",
      type: "event_nasional",
      description: "Scoliosis Research Society – Asia Pacific Meeting 2026. Location: Fukuoka, Japan",
      location: "Fukuoka, Japan",
      registration: "https://www.srs.org/Meetings-Conferences/Regional-Scientific-Meeting/RSM-2026"
    },
    {
      id: 5,
      date: new Date(2026, 2, 11), // March 11, 2026
      title: "CSRS-AP 2026",
      type: "event_nasional",
      description: "16th Annual Meeting of Cervical Spine Research Society – Asia Pacific. Location: Shanghai International Convention Center, China",
      location: "Shanghai International Convention Center, China",
      registration: "https://www.csrs-ap2026.org/"
    },
    {
      id: 6,
      date: new Date(2026, 4, 20), // May 20, 2026
      title: "KSSS 2026",
      type: "event_nasional",
      description: "The 43rd International Congress of Korean Society of Spine Surgery. Location: Lotte Hotel Seoul, South Korea",
      location: "Lotte Hotel Seoul, South Korea",
      registration: "https://ksss2026.org/ksss/contents/01_06.php"
    },
    {
      id: 7,
      date: new Date(2026, 5, 3), // June 3, 2026
      title: "APSS Congress 2026",
      type: "event_nasional",
      description: "Asia Pacific Spine Society 32nd Annual Scientific Meeting and Philippine Spine Society Annual Meeting. Location: Shangri-La Mactan, Cebu, Philippines",
      location: "Shangri-La Mactan, Cebu, Philippines",
      registration: "www.apss2026ph.org"
    },
    {
      id: 8,
      date: new Date(2026, 5, 18), // June 18, 2026
      title: "Asia Spine 2026",
      type: "event_nasional",
      description: "The 17th Annual Meeting of Asia Spine. Location: Osaka International Convention Center, Osaka, Japan",
      location: "Osaka International Convention Center, Osaka, Japan",
      registration: "https://cs-oto3.com/nsj2026-17amoas/en-greeting.html"
    },
    {
      id: 9,
      date: new Date(2026, 6, 16), // July 16, 2026
      title: "SMISS-ASEAN MISST-SSS Combine Meeting 2026",
      type: "event_nasional",
      description: "Combine Meeting of Society for Minimally Invasive Spine Surgery – Asia Pacific (SMISS-AP), 6th Meeting - Singapore Spine Society (SSS), 9th Meeting. Location: Shangri-La Hotel, Singapore",
      location: "Shangri-La Hotel, Singapore",
      registration: "https://www.smiss-aseanmisst-sss2026.org/"
    }
  ]);

  // Stats data
  const stats = [
    {
      title: "Academic Year",
      value: "2024/2025",
      icon: "mdi:calendar",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      title: "Examination Day",
      value: "82",
      icon: "mdi:briefcase",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600"
    },
    {
      title: "Event Day",
      value: "6",
      icon: "mdi:calendar-check",
      iconBg: "bg-red-100",
      iconColor: "text-red-600"
    }
  ];

  // Event types with colors
  const eventTypes = [
    { id: "ujian_lokal", name: "Ujian Lokal", color: "bg-red-500", textColor: "text-red-700" },
    { id: "ujian_nasional", name: "Ujian Nasional", color: "bg-blue-500", textColor: "text-blue-700" },
    { id: "event_lokal", name: "Event Lokal", color: "bg-green-500", textColor: "text-green-700" },
    { id: "event_nasional", name: "Event Nasional", color: "bg-orange-500", textColor: "text-orange-700" },
    { id: "event_peer_group", name: "Event Peer Group", color: "bg-purple-500", textColor: "text-purple-700" }
  ];

  const new_events = [
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

  const getEventColor = (type) => {
    const eventType = eventTypes.find(t => t.id === type);
    return eventType || eventTypes[0];
  };

  const getEventsForDate = (day, month, year) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === day && 
             eventDate.getMonth() === month && 
             eventDate.getFullYear() === year;
    });
  };

  const handleAddEvent = (newEvent) => {
    setEvents([...events, { ...newEvent, id: Date.now() }]);
    setShowEventModal(false);
  };

  const handleDeleteClick = (event) => {
    setEventToDelete(event);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (eventToDelete) {
      setEvents(events.filter(event => event.id !== eventToDelete.id));
      setShowDeleteModal(false);
      setShowDetailModal(false);
      setEventToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setEventToDelete(null);
  };

  const handleDateClick = (day, isCurrentMonth) => {
    if (!isCurrentMonth) return;
    setSelectedDate({ day, month: currentMonth, year: currentYear });
    setShowEventModal(true);
  };

  const handleEventClick = (event, viewOnly = false) => {
    setSelectedEvent({ ...event, viewOnly });
    setShowDetailModal(true);
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
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 10; i <= currentYear + 10; i++) {
      years.push(i);
    }
    return years;
  };

  // Get today's date
  const today = new Date();
  
  // Get ongoing events (events happening today)
  const getOngoingEvents = () => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === today.getDate() &&
             eventDate.getMonth() === today.getMonth() &&
             eventDate.getFullYear() === today.getFullYear();
    });
  };
  
  // Categorize ongoing events
  const categorizeOngoingEvents = () => {
    const ongoing = getOngoingEvents();
    const tests = ongoing.filter(e => e.type === 'ujian_lokal' || e.type === 'ujian_nasional');
    const eventsList = ongoing.filter(e => e.type !== 'ujian_lokal' && e.type !== 'ujian_nasional');
    return { tests, events: eventsList };
  };

  // Get upcoming tests (next 7 days)
  const getUpcomingTests = () => {
    const today = new Date(2025, 11, 6);
    today.setHours(0, 0, 0, 0); // Reset to start of day
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    nextWeek.setHours(23, 59, 59, 999); // End of day
    
    return events.filter(event => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0); // Reset to start of day for comparison
      const isTest = event.type === 'ujian_lokal' || event.type === 'ujian_nasional';
      return isTest && eventDate >= today && eventDate <= nextWeek;
    });
  };
  
  // Format date range for upcoming tests
  const getUpcomingTestDateRange = () => {
    const today = new Date(2025, 11, 6);
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 1);
    
    return `${today.getDate()} ${monthNames[today.getMonth()].slice(0, 3)} ${today.getFullYear()} - ${nextWeek.getDate()} ${monthNames[nextWeek.getMonth()].slice(0, 3)} ${nextWeek.getFullYear()}`;
  };

  // Get upcoming events (next 7 days, excluding tests)
  const getUpcomingEvents = () => {
    // const today = new Date();
    // today.setHours(0, 0, 0, 0);
    // const nextWeek = new Date(today);
    // nextWeek.setDate(today.getDate() + 7);
    // nextWeek.setHours(23, 59, 59, 999);
    
    // return events.filter(event => {
    //   const eventDate = new Date(event.date);
    //   eventDate.setHours(0, 0, 0, 0);
    //   const isEvent = event.type !== 'ujian_lokal' && event.type !== 'ujian_nasional';
    //   return isEvent && eventDate >= today && eventDate <= nextWeek;
    // });

    return  new_events;
  };

  
  // Format date range for upcoming events
  const getUpcomingEventDateRange = () => {
    const today = new Date(2026, 1, 6);
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 162);
    
    return `${today.getDate()} ${monthNames[today.getMonth()].slice(0, 3)} ${today.getFullYear()} - ${nextWeek.getDate()} ${monthNames[nextWeek.getMonth()].slice(0, 3)} ${nextWeek.getFullYear()}`;
  };

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
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-green-600">Ongoing Today</h2>
              <span className="text-gray-600 font-normal">
                {today.getDate()} {monthNames[today.getMonth()]} {today.getFullYear()}
              </span>
            </div>
            
            {(() => {
              const { tests, events: eventsList } = categorizeOngoingEvents();
              const allOngoing = [...tests, ...eventsList];
              
              if (allOngoing.length === 0) {
                return (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>No events scheduled for today</p>
                  </div>
                );
              }
              
              return (
                <div className="overflow-x-auto -mx-6 px-6">
                  <div className="flex gap-4 pb-2" style={{ minWidth: 'min-content' }}>
                    {/* Tests */}
                    {/* {tests.map((test, index) => {
                      const eventColor = getEventColor(test.type);
                      const testDate = new Date(test.date);
                      return (
                        <div 
                          key={`test-${index}`} 
                          className="flex-shrink-0 w-64 bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => handleEventClick(test)}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm text-gray-600">
                              {testDate.getDate()} {monthNames[testDate.getMonth()].slice(0, 3)} {testDate.getFullYear()}
                            </span>
                            <span className="text-xs px-2 py-1 rounded font-medium bg-red-100 text-red-700">
                              Test
                            </span>
                          </div>
                          <h3 className="font-bold text-gray-900 line-clamp-2">{test.title}</h3>
                        </div>
                      );
                    })} */}
                    
                    {/* Events with Image */}
                    {eventsList.map((event, index) => {
                      const eventColor = getEventColor(event.type);
                      const eventDate = new Date(event.date);
                      return (
                        <div 
                          key={`event-${index}`} 
                          className="flex-shrink-0 w-80 bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => handleEventClick(event)}
                        >
                          <div className="relative bg-gradient-to-br from-red-700 to-red-900 h-40">
                            <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-r from-red-800 via-green-600 to-blue-600 opacity-80"></div>
                            <div className="relative h-full flex flex-col items-center justify-center p-4">
                              <div className="w-14 h-14 bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-lg mb-2 flex items-center justify-center border-4 border-yellow-500">
                                <Icon icon="mdi:medical-bag" className="w-8 h-8 text-white" />
                              </div>
                              <h3 className="text-xl font-bold text-white text-center">NATIONAL<br/>CONGRESS</h3>
                              <div className="bg-yellow-500 text-gray-900 px-2 py-1 rounded-full text-xs font-bold mt-1">
                                INDONESIAN ORTHOPAEDIC ASSOCIATION
                              </div>
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm text-gray-600">
                                {eventDate.getDate()} {monthNames[eventDate.getMonth()].slice(0, 3)} {eventDate.getFullYear()}
                              </span>
                              <span className="text-xs px-2 py-1 rounded font-medium bg-purple-100 text-purple-700">
                                Event
                              </span>
                            </div>
                            <h4 className="font-bold text-gray-900 line-clamp-2">{event.title}</h4>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Upcoming Test */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-blue-600">Upcoming Examination</h2>
              <span className="text-gray-600 font-normal">{getUpcomingTestDateRange()}</span>
            </div>
            
            {(() => {
              const upcomingTests = getUpcomingTests();
              
              if (upcomingTests.length === 0) {
                return (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>No upcoming tests in the next 7 days</p>
                  </div>
                );
              }
              
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {upcomingTests.map((test, index) => {
                    const testDate = new Date(test.date);
                    const eventColor = getEventColor(test.type);
                    return (
                      <div 
                        key={index} 
                        className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleEventClick(test)}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm text-gray-600">
                            {testDate.getDate()} {monthNames[testDate.getMonth()].slice(0, 3)} {testDate.getFullYear()}
                          </span>
                          <span className="text-xs px-2 py-1 rounded font-medium bg-red-100 text-red-700">
                            Test
                          </span>
                        </div>
                        <h3 className="font-bold text-gray-900">{test.title}</h3>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>

          {/* Upcoming Event */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-blue-600">Upcoming Event</h2>
              <span className="text-gray-600 font-normal">{getUpcomingEventDateRange()}</span>
            </div>
            
            {(() => {
              const upcomingEvents = getUpcomingEvents();
              
              if (upcomingEvents.length === 0) {
                return (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>No upcoming events in the next 7 days</p>
                  </div>
                );
              }
              
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingEvents.map((event, index) => {
                    // const eventDate = new Date(event.date);
                    const eventDate = event.date;
                    const eventColor = getEventColor(event.type);
                    return (
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
                    );
                  })}
                </div>
              );
            })()}
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
                              handleEventClick(event);
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
                    {new Date(selectedEvent.date).getDate()} {monthNames[new Date(selectedEvent.date).getMonth()]} {new Date(selectedEvent.date).getFullYear()}
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
