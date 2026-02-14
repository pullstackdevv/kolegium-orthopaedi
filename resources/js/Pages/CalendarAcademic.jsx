import { useEffect, useMemo, useState } from "react";
import { Link } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { ChevronLeft, ChevronRight, Calendar, X, Trash2, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import HomepageLayout from "../Layouts/HomepageLayout";
import api from "@/api/axios";

const DEFAULT_EVENT_IMAGE =
  "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='1200'%20height='600'%20viewBox='0%200%201200%20600'%3E%3Cdefs%3E%3ClinearGradient%20id='g'%20x1='0'%20y1='0'%20x2='1'%20y2='1'%3E%3Cstop%20offset='0'%20stop-color='%23DBEAFE'/%3E%3Cstop%20offset='1'%20stop-color='%23BFDBFE'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20width='1200'%20height='600'%20fill='url(%23g)'/%3E%3Ccircle%20cx='600'%20cy='300'%20r='120'%20fill='%2393C5FD'/%3E%3Cpath%20d='M520%20320l60-60a25%2025%200%200%201%2035%200l45%2045%2065-65a25%2025%200%200%201%2035%200l80%2080v90H520z'%20fill='%2360A5FA'/%3E%3Ctext%20x='600'%20y='470'%20text-anchor='middle'%20font-family='Arial'%20font-size='28'%20fill='%231E3A8A'%20opacity='0.85'%3ENo%20Image%3C/text%3E%3C/svg%3E";

export default function CalendarAcademic() {
  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [showEventModal, setShowEventModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [tempMonth, setTempMonth] = useState(now.getMonth());
  const [tempYear, setTempYear] = useState(now.getFullYear());
  const [showFullDescription, setShowFullDescription] = useState(false);
  // Set default date to today for demo purposes
  const todayDate = new Date();
  todayDate.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues
  
  // Create dates for upcoming events
  const tomorrow = new Date(todayDate);
  tomorrow.setDate(todayDate.getDate() + 1);
  
  const nextWeekDate = new Date(todayDate);
  nextWeekDate.setDate(todayDate.getDate() + 7);
  
  const [events, setEvents] = useState([]);

  const academicYear = useMemo(() => {
    const d = new Date();
    const year = d.getFullYear();
    const startYear = d.getMonth() >= 6 ? year : year - 1;

    const start = new Date(startYear, 6, 1);
    start.setHours(12, 0, 0, 0);
    const end = new Date(startYear + 1, 5, 30);
    end.setHours(12, 0, 0, 0);

    return {
      start,
      end,
      label: `${startYear}/${startYear + 1}`,
    };
  }, []);

  const academicYearCounts = useMemo(() => {
    const inRange = events.filter((event) => {
      const evStart = event.startDate ? new Date(event.startDate) : new Date(event.date);
      const evEnd = event.endDate ? new Date(event.endDate) : evStart;
      evStart.setHours(12, 0, 0, 0);
      evEnd.setHours(12, 0, 0, 0);
      return evStart <= academicYear.end && evEnd >= academicYear.start;
    });

    const exams = inRange.filter((e) => String(e.type || "").startsWith("ujian_")).length;
    const agendaEvents = inRange.filter((e) => String(e.type || "").startsWith("event_")).length;

    return { exams, agendaEvents };
  }, [academicYear.end, academicYear.start, events]);

  useEffect(() => {
    const fetchAgendaEvents = async () => {
      try {
        let scopeParam = null;
        if (typeof window !== "undefined") {
          scopeParam = new URLSearchParams(window.location.search).get("scope");
        }

        const params = {};
        if (scopeParam) {
          params.scope = scopeParam;
        }

        const response = await api.get("/public/agenda-events", { params });

        if (response.data?.status !== "success") {
          setEvents([]);
          return;
        }

        const mapped = (response.data?.data || []).map((ev) => {
          const start = new Date(ev.start_date);
          start.setHours(12, 0, 0, 0);

          const end = ev.end_date ? new Date(ev.end_date) : new Date(ev.start_date);
          end.setHours(12, 0, 0, 0);

          return {
            id: ev.id,
            date: start,
            startDate: start,
            endDate: end,
            title: ev.title,
            type: ev.type,
            description: ev.description,
            location: ev.location,
            registration: ev.registration_url,
            image: ev.image_url,
          };
        });

        setEvents(mapped);
      } catch (e) {
        setEvents([]);
      }
    };

    fetchAgendaEvents();
  }, []);

  // Stats data
  const stats = useMemo(() => {
    return [
      {
        title: "Academic Year",
        value: academicYear.label,
        icon: "mdi:calendar",
        iconBg: "bg-primary/10",
        iconColor: "text-primary",
      },
      {
        title: "Examination Day",
        value: String(academicYearCounts.exams),
        icon: "mdi:briefcase",
        iconBg: "bg-secondary/10",
        iconColor: "text-secondary",
      },
      {
        title: "Event Day",
        value: String(academicYearCounts.agendaEvents),
        icon: "mdi:calendar-check",
        iconBg: "bg-primary/5",
        iconColor: "text-primary",
      },
    ];
  }, [academicYear.label, academicYearCounts.agendaEvents, academicYearCounts.exams]);

  // Event types with colors
  const eventTypes = [
    { id: "ujian_lokal", name: "Local Exam", color: "bg-red-500", textColor: "text-red-700" },
    { id: "ujian_nasional", name: "National Exam", color: "bg-blue-500", textColor: "text-blue-700" },
    { id: "event_lokal", name: "Local Event", color: "bg-green-500", textColor: "text-green-700" },
    { id: "event_nasional", name: "National Event", color: "bg-orange-500", textColor: "text-orange-700" },
    { id: "event_peer_group_nasional", name: "National Event", color: "bg-orange-500", textColor: "text-orange-700" },
    { id: "event_internasional", name: "International Event", color: "bg-purple-500", textColor: "text-purple-700" },
    { id: "event_peer_group", name: "International Event", color: "bg-purple-500", textColor: "text-purple-700" },
  ];

  const getEventColor = (type) => {
    const eventType = eventTypes.find(t => t.id === type);
    return eventType || eventTypes[0];
  };

  const getEventsForDate = (day, month, year) => {
    const target = new Date(year, month, day);
    target.setHours(12, 0, 0, 0);

    return events.filter(event => {
      const start = event.startDate ? new Date(event.startDate) : new Date(event.date);
      const end = event.endDate ? new Date(event.endDate) : new Date(event.date);
      start.setHours(12, 0, 0, 0);
      end.setHours(12, 0, 0, 0);

      return target >= start && target <= end;
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
    const dayEvents = getEventsForDate(day, currentMonth, currentYear);
    if (dayEvents.length > 0) {
      handleEventClick(dayEvents[0], true);
    }
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
      const start = event.startDate ? new Date(event.startDate) : new Date(event.date);
      const end = event.endDate ? new Date(event.endDate) : new Date(event.date);
      start.setHours(12, 0, 0, 0);
      end.setHours(12, 0, 0, 0);

      const t = new Date(today);
      t.setHours(12, 0, 0, 0);

      return t >= start && t <= end;
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
    const todayStart = new Date();
    todayStart.setHours(12, 0, 0, 0);
    const start = new Date(todayStart);
    start.setDate(todayStart.getDate() + 1);
    start.setHours(12, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 14);
    end.setHours(12, 0, 0, 0);

    return events
      .filter((event) => {
        const evStart = event.startDate ? new Date(event.startDate) : new Date(event.date);
        const evEnd = event.endDate ? new Date(event.endDate) : evStart;
        evStart.setHours(12, 0, 0, 0);
        evEnd.setHours(12, 0, 0, 0);

        const isOngoingToday = todayStart >= evStart && todayStart <= evEnd;
        if (isOngoingToday) return false;

        const isFuture = evStart >= start;
        if (!isFuture) return false;

        const isTest = String(event.type || "").startsWith("ujian_");
        const overlaps = evStart <= end && evEnd >= start;
        return isTest && overlaps;
      })
      .sort((a, b) => {
        const aStart = a.startDate ? new Date(a.startDate) : new Date(a.date);
        const bStart = b.startDate ? new Date(b.startDate) : new Date(b.date);
        return aStart.getTime() - bStart.getTime();
      });
  };
  
  // Format date range for upcoming tests
  const getUpcomingTestDateRange = () => {
    const todayStart = new Date();
    todayStart.setHours(12, 0, 0, 0);
    const start = new Date(todayStart);
    start.setDate(todayStart.getDate() + 1);
    start.setHours(12, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 14);
    end.setHours(12, 0, 0, 0);
    
    return `${start.getDate()} ${monthNames[start.getMonth()].slice(0, 3)} ${start.getFullYear()} - ${end.getDate()} ${monthNames[end.getMonth()].slice(0, 3)} ${end.getFullYear()}`;
  };

  // Get upcoming events (next 7 days, excluding tests)
  const getUpcomingEvents = () => {
    const todayStart = new Date();
    todayStart.setHours(12, 0, 0, 0);
    const start = new Date(todayStart);
    start.setDate(todayStart.getDate() + 1);
    start.setHours(12, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 14);
    end.setHours(12, 0, 0, 0);

    const isEventType = (type) => String(type || "").startsWith("event_");

    return events
      .filter((event) => {
        const evStart = event.startDate ? new Date(event.startDate) : new Date(event.date);
        const evEnd = event.endDate ? new Date(event.endDate) : evStart;
        evStart.setHours(12, 0, 0, 0);
        evEnd.setHours(12, 0, 0, 0);

        const isOngoingToday = todayStart >= evStart && todayStart <= evEnd;
        if (isOngoingToday) return false;

        const isFuture = evStart >= start;
        if (!isFuture) return false;

        const overlaps = evStart <= end && evEnd >= start;
        return isEventType(event.type) && overlaps;
      })
      .sort((a, b) => {
        const aStart = a.startDate ? new Date(a.startDate) : new Date(a.date);
        const bStart = b.startDate ? new Date(b.startDate) : new Date(b.date);
        return aStart.getTime() - bStart.getTime();
      })
      .map((event) => {
        const startDate = event.startDate ? new Date(event.startDate) : new Date(event.date);
        const endDate = event.endDate ? new Date(event.endDate) : startDate;

        const startLabel = `${startDate.getDate()} ${monthNames[startDate.getMonth()].slice(0, 3)} ${startDate.getFullYear()}`;
        const endLabel = `${endDate.getDate()} ${monthNames[endDate.getMonth()].slice(0, 3)} ${endDate.getFullYear()}`;

        return {
          ...event,
          dateLabel: startLabel === endLabel ? startLabel : `${startLabel} - ${endLabel}`,
        };
      });
  };

  
  // Format date range for upcoming events
  const getUpcomingEventDateRange = () => {
    const todayStart = new Date();
    todayStart.setHours(12, 0, 0, 0);
    const start = new Date(todayStart);
    start.setDate(todayStart.getDate() + 1);
    start.setHours(12, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 14);
    end.setHours(12, 0, 0, 0);
    
    return `${start.getDate()} ${monthNames[start.getMonth()].slice(0, 3)} ${start.getFullYear()} - ${end.getDate()} ${monthNames[end.getMonth()].slice(0, 3)} ${end.getFullYear()}`;
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

  const selectedEventStartDate = (() => {
    if (!selectedEvent) return null;
    const raw = selectedEvent.startDate ?? selectedEvent.date;
    const d = raw instanceof Date ? raw : new Date(raw);
    if (Number.isNaN(d.getTime())) return null;
    return d;
  })();

  return (
    <HomepageLayout>
      {/* Breadcrumb Section */}
      <section className="bg-gradient-to-r from-primary to-secondary py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-white text-sm">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
              <span>Academic Calendar</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title */}
          <h1 className="text-3xl font-bold text-primary mb-8">
            Academic Calendar {academicYear.label}
          </h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">{stat.title}</p>
                    <p className="text-3xl font-bold text-primary">{stat.value}</p>
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
              <h2 className="text-xl font-bold text-primary">Ongoing Today</h2>
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
                  <div className="flex items-start gap-4 pb-2" style={{ minWidth: 'min-content' }}>
                    {/* Tests */}
                    {tests.map((test, index) => {
                      const eventColor = getEventColor(test.type);
                      const startDate = test.startDate ? new Date(test.startDate) : new Date(test.date);
                      const endDate = test.endDate ? new Date(test.endDate) : startDate;
                      const startLabel = `${startDate.getDate()} ${monthNames[startDate.getMonth()].slice(0, 3)} ${startDate.getFullYear()}`;
                      const endLabel = `${endDate.getDate()} ${monthNames[endDate.getMonth()].slice(0, 3)} ${endDate.getFullYear()}`;

                      return (
                        <div
                          key={`test-${index}`}
                          className="flex-shrink-0 w-64 bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => handleEventClick(test, true)}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm text-gray-600">
                              {startLabel === endLabel ? startLabel : `${startLabel} - ${endLabel}`}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded font-medium ${eventColor.color} bg-opacity-20 ${eventColor.textColor}`}>
                              {eventColor.name}
                            </span>
                          </div>
                          <h3 className="font-bold text-gray-900">{test.title}</h3>
                        </div>
                      );
                    })}
                    
                    {/* Events with Image */}
                    {eventsList.map((event, index) => {
                      const eventColor = getEventColor(event.type);
                      const startDate = event.startDate ? new Date(event.startDate) : new Date(event.date);
                      const endDate = event.endDate ? new Date(event.endDate) : startDate;
                      const startLabel = `${startDate.getDate()} ${monthNames[startDate.getMonth()].slice(0, 3)} ${startDate.getFullYear()}`;
                      const endLabel = `${endDate.getDate()} ${monthNames[endDate.getMonth()].slice(0, 3)} ${endDate.getFullYear()}`;
                      return (
                        <div 
                          key={`event-${index}`} 
                          className="flex-shrink-0 w-80 bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => handleEventClick(event, true)}
                        >
                          <div className="relative h-40 bg-gray-100">
                            {event.image ? (
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
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200" />
                            )}
                          </div>
                          <div className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm text-gray-600">
                                {startLabel === endLabel ? startLabel : `${startLabel} - ${endLabel}`}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded font-medium ${eventColor.color} bg-opacity-20 ${eventColor.textColor}`}>
                                {eventColor.name}
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
              <h2 className="text-xl font-bold text-primary">Upcoming Examination</h2>
              <span className="text-gray-600 font-normal">{getUpcomingTestDateRange()}</span>
            </div>
            
            {(() => {
              const upcomingTests = getUpcomingTests();
              
              if (upcomingTests.length === 0) {
                return (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>No upcoming tests in the next 14 days</p>
                  </div>
                );
              }
              
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {upcomingTests.map((test, index) => {
                    const eventColor = getEventColor(test.type);
                    const startDate = test.startDate ? new Date(test.startDate) : new Date(test.date);
                    const endDate = test.endDate ? new Date(test.endDate) : startDate;
                    const startLabel = `${startDate.getDate()} ${monthNames[startDate.getMonth()].slice(0, 3)} ${startDate.getFullYear()}`;
                    const endLabel = `${endDate.getDate()} ${monthNames[endDate.getMonth()].slice(0, 3)} ${endDate.getFullYear()}`;
                    return (
                      <div 
                        key={index} 
                        className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleEventClick(test, true)}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm text-gray-600">
                            {startLabel === endLabel ? startLabel : `${startLabel} - ${endLabel}`}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded font-medium ${eventColor.color} bg-opacity-20 ${eventColor.textColor}`}>
                            {eventColor.name}
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
              <h2 className="text-xl font-bold text-primary">Upcoming Event</h2>
              <span className="text-gray-600 font-normal">{getUpcomingEventDateRange()}</span>
            </div>
            
            {(() => {
              const upcomingEvents = getUpcomingEvents();
              
              if (upcomingEvents.length === 0) {
                return (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>No upcoming events in the next 14 days</p>
                  </div>
                );
              }
              
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingEvents.map((event, index) => {
                    const eventColor = getEventColor(event.type);
                    const dateLabel = event.dateLabel
                      ? event.dateLabel
                      : (() => {
                          const startDate = event.startDate ? new Date(event.startDate) : new Date(event.date);
                          const endDate = event.endDate ? new Date(event.endDate) : startDate;
                          const startLabel = `${startDate.getDate()} ${monthNames[startDate.getMonth()].slice(0, 3)} ${startDate.getFullYear()}`;
                          const endLabel = `${endDate.getDate()} ${monthNames[endDate.getMonth()].slice(0, 3)} ${endDate.getFullYear()}`;
                          return startLabel === endLabel ? startLabel : `${startLabel} - ${endLabel}`;
                        })();
                    return (
                      <div
                        key={index}
                        className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                        onClick={() => handleEventClick(event, true)}
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
                          <span className="text-sm font-medium text-gray-700">{dateLabel}</span>
                          <span className="text-gray-400">•</span>
                          <span className={`${eventColor.color} bg-opacity-20 ${eventColor.textColor} text-xs font-semibold px-3 py-1 rounded`}>
                            {eventColor.name}
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
                    );
                  })}
                </div>
              );
            })()}
          </div>

          {/* Calendar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-primary mb-6">Academic Calendar</h2>
            
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={handlePrevMonth}
                className="flex items-center gap-2 text-primary hover:text-secondary font-medium transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>
                  {monthNames[currentMonth === 0 ? 11 : currentMonth - 1]}, {currentMonth === 0 ? currentYear - 1 : currentYear}
                </span>
              </button>

              <h3 
                className="text-2xl font-bold text-primary cursor-pointer hover:text-secondary transition-colors"
                onClick={handleOpenDatePicker}
                title="Click to change month/year"
              >
                {monthNames[currentMonth]}, {currentYear}
              </h3>

              <button
                onClick={handleNextMonth}
                className="flex items-center gap-2 text-primary hover:text-secondary font-medium transition-colors"
              >
                <span>
                  {monthNames[currentMonth === 11 ? 0 : currentMonth + 1]}, {currentMonth === 11 ? currentYear + 1 : currentYear}
                </span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="overflow-auto max-h-[70vh] sm:max-h-none border border-gray-300">
              <div className="min-w-[720px] bg-white">
                {/* Day Headers */}
                <div className="sticky top-0 z-20 grid grid-cols-7 border-b border-gray-300 bg-gray-50">
                  {["SUN", "MON", "TUE", "WED", "THUR", "FRI", "SAT"].map((day) => (
                    <div key={day} className="text-center text-[10px] sm:text-sm font-semibold text-gray-600 py-2 sm:py-3 border-r border-gray-300 last:border-r-0">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7">
                  {generateCalendar().map((item, index) => (
                    <div
                      key={index}
                      className={`min-h-[96px] sm:min-h-[120px] border-r border-b border-gray-300 p-2 cursor-pointer hover:bg-gray-50 transition-colors last:border-r-0 ${
                        !item.isCurrentMonth ? "bg-gray-50" : "bg-white"
                      } ${item.isToday ? "bg-blue-50" : ""}`}
                      onClick={() => handleDateClick(item.day, item.isCurrentMonth)}
                    >
                      <div className={`text-xs sm:text-sm font-medium mb-1 ${
                        !item.isCurrentMonth ? "text-gray-400" : "text-gray-900"
                      } ${item.isToday ? "text-blue-600 font-bold" : ""}`}>
                        {item.day}
                      </div>
                      {item.isToday && (
                        <div className="hidden sm:inline-block text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded mb-1">
                          Today
                        </div>
                      )}
                      <div className="space-y-1">
                        {item.events.map((event, eventIndex) => {
                          const eventColor = getEventColor(event.type);
                          return (
                            <div
                              key={eventIndex}
                              className={`text-[10px] sm:text-xs p-1 rounded ${eventColor.color} bg-opacity-20 ${eventColor.textColor} cursor-pointer hover:bg-opacity-30 transition-colors`}
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
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-gray-200">
              {eventTypes.filter(type => !type.id.includes('peer_group')).map((type) => (
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowEventModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowDetailModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
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
            <div className="p-6 overflow-y-auto flex-1">
              {selectedEvent.image ? (
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
                  <div className="text-gray-700">
                    <p className={`${!showFullDescription && selectedEvent.description.length > 200 ? 'line-clamp-3' : ''}`}>
                      {selectedEvent.description}
                    </p>
                    {selectedEvent.description.length > 200 && (
                      <button
                        onClick={() => setShowFullDescription(!showFullDescription)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2 flex items-center gap-1"
                      >
                        {showFullDescription ? (
                          <>
                            Show Less <ChevronUp className="w-4 h-4" />
                          </>
                        ) : (
                          <>
                            Show More <ChevronDown className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowDatePickerModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={handleCancelDelete}>
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
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
