import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X, MapPin, GraduationCap, ClipboardCheck, Sparkles } from "lucide-react";
import DashboardLayout from "../../Layouts/dashboard/DashboardLayout";
import api from "@/api/axios";

export default function Calendar() {
  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [tempMonth, setTempMonth] = useState(now.getMonth());
  const [tempYear, setTempYear] = useState(now.getFullYear());
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
        const response = await api.get("/public/agenda-events");

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

  const stats = useMemo(() => {
    return [
      {
        title: "Academic Year",
        value: academicYear.label,
        icon: GraduationCap,
        bgColor: "bg-gray-100",
        iconColor: "text-gray-700",
      },
      {
        title: "Examination Days",
        value: String(academicYearCounts.exams),
        icon: ClipboardCheck,
        bgColor: "bg-gray-100",
        iconColor: "text-gray-700",
      },
      {
        title: "Event Days",
        value: String(academicYearCounts.agendaEvents),
        icon: Sparkles,
        bgColor: "bg-gray-100",
        iconColor: "text-gray-700",
      },
    ];
  }, [academicYear.label, academicYearCounts.agendaEvents, academicYearCounts.exams]);

  const eventTypes = [
    { id: "ujian_lokal", name: "Local Exam", color: "bg-red-400", textColor: "text-red-700" },
    { id: "ujian_nasional", name: "National Exam", color: "bg-blue-400", textColor: "text-blue-700" },
    { id: "event_lokal", name: "Local Event", color: "bg-green-400", textColor: "text-green-700" },
    { id: "event_nasional", name: "National Event", color: "bg-orange-400", textColor: "text-orange-700" },
    { id: "event_peer_group", name: "Peer Group Event International", color: "bg-purple-400", textColor: "text-purple-700" },
    { id: "event_peer_group_nasional", name: "Peer Group Event National", color: "bg-indigo-400", textColor: "text-indigo-700" }
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

  const handleDateClick = (day, isCurrentMonth) => {
    if (!isCurrentMonth) return;
    const dayEvents = getEventsForDate(day, currentMonth, currentYear);
    if (dayEvents.length > 0) {
      handleEventClick(dayEvents[0]);
    }
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
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
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-600 mt-1">View all events and examinations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div 
                key={index} 
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-2">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <IconComponent className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 p-2 rounded-lg">
                  <CalendarIcon className="w-6 h-6 text-gray-700" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Academic Calendar</h2>
                  <p className="text-gray-500 text-sm">{academicYear.label}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={handlePrevMonth}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-all hover:scale-105"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="hidden sm:inline">
                  {monthNames[currentMonth === 0 ? 11 : currentMonth - 1]}
                </span>
              </button>

              <button
                onClick={handleOpenDatePicker}
                className="group flex items-center gap-2 px-6 py-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-white font-bold transition-all hover:scale-105 shadow-sm"
                title="Click to change month/year"
              >
                <CalendarIcon className="w-5 h-5" />
                <span className="text-lg">{monthNames[currentMonth]}, {currentYear}</span>
              </button>

              <button
                onClick={handleNextMonth}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-all hover:scale-105"
              >
                <span className="hidden sm:inline">
                  {monthNames[currentMonth === 11 ? 0 : currentMonth + 1]}
                </span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="grid grid-cols-7 bg-gray-50">
                {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day, idx) => (
                  <div 
                    key={day} 
                    className={`text-center text-xs font-bold py-4 border-r border-gray-200 last:border-r-0 ${
                      idx === 0 || idx === 6 ? 'text-gray-500' : 'text-gray-600'
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 bg-white">
                {generateCalendar().map((item, index) => {
                  const isWeekend = index % 7 === 0 || index % 7 === 6;
                  return (
                    <div
                      key={index}
                      className={`min-h-[130px] border-r border-b border-gray-200 p-3 cursor-pointer transition-all duration-200 last:border-r-0 group ${
                        !item.isCurrentMonth ? "bg-gray-50/50" : "bg-white hover:bg-slate-50/50"
                      } ${item.isToday ? "bg-gray-50 ring-2 ring-gray-300 ring-inset" : ""} ${
                        isWeekend && item.isCurrentMonth ? "bg-gray-50/50" : ""
                      }`}
                      onClick={() => handleDateClick(item.day, item.isCurrentMonth)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className={`text-sm font-semibold ${
                          !item.isCurrentMonth ? "text-gray-400" : isWeekend ? "text-gray-500" : "text-gray-700"
                        } ${item.isToday ? "text-gray-900 font-bold" : ""}`}>
                          {item.day}
                        </div>
                        {item.isToday && (
                          <div className="flex items-center gap-1 text-xs bg-gray-900 text-white px-2 py-0.5 rounded-full font-medium shadow-sm">
                            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                            Today
                          </div>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        {item.events.slice(0, 3).map((event, eventIndex) => {
                          const eventColor = getEventColor(event.type);
                          return (
                            <div
                              key={eventIndex}
                              className={`text-xs p-1.5 rounded-md ${eventColor.color} bg-opacity-20 ${eventColor.textColor} cursor-pointer hover:bg-opacity-30 transition-all font-medium border border-transparent hover:border-current hover:shadow-sm`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEventClick(event);
                              }}
                            >
                              <div className="line-clamp-2">{event.title}</div>
                            </div>
                          );
                        })}
                        {item.events.length > 3 && (
                          <div className="text-xs text-gray-500 font-medium pl-1.5">
                            +{item.events.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 bg-gray-900 rounded-full"></div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Event Types</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {eventTypes.map((type) => (
                  <div 
                    key={type.id} 
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200"
                  >
                    <div className={`w-3 h-3 rounded-full ${type.color} shadow-sm`}></div>
                    <span className="text-xs font-medium text-gray-700">{type.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDatePickerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Select Month & Year</h3>
              <button
                onClick={() => setShowDatePickerModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                <select
                  value={tempMonth}
                  onChange={(e) => setTempMonth(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-transparent"
                >
                  {monthNames.map((month, index) => (
                    <option key={index} value={index}>{month}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                <select
                  value={tempYear}
                  onChange={(e) => setTempYear(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-transparent"
                >
                  {generateYearRange().map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowDatePickerModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyDatePicker}
                className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {showDetailModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {selectedEvent.image && (
              <div className="relative h-64 bg-gray-100">
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-3 py-1 rounded font-medium ${getEventColor(selectedEvent.type).color} bg-opacity-20 ${getEventColor(selectedEvent.type).textColor}`}>
                      {getEventColor(selectedEvent.type).name}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedEvent.title}</h3>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-500">
                  <CalendarIcon className="w-5 h-5" />
                  <span>
                    {selectedEventStartDate && (
                      <>
                        {selectedEventStartDate.getDate()} {monthNames[selectedEventStartDate.getMonth()]} {selectedEventStartDate.getFullYear()}
                        {selectedEvent.endDate && selectedEvent.endDate.getTime() !== selectedEventStartDate.getTime() && (
                          <>
                            {" - "}
                            {selectedEvent.endDate.getDate()} {monthNames[selectedEvent.endDate.getMonth()]} {selectedEvent.endDate.getFullYear()}
                          </>
                        )}
                      </>
                    )}
                  </span>
                </div>

                {selectedEvent.location && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <MapPin className="w-5 h-5" />
                    <span>{selectedEvent.location}</span>
                  </div>
                )}

                {selectedEvent.description && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                    <p className="text-gray-600 whitespace-pre-wrap">{selectedEvent.description}</p>
                  </div>
                )}

                {selectedEvent.registration && (
                  <div className="mt-6">
                    <a
                      href={selectedEvent.registration}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <span>Registration Link</span>
                      <ChevronRight className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
