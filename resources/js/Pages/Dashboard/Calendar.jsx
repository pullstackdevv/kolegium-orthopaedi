import { useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X, MapPin } from "lucide-react";
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

  const eventTypes = [
    { id: "ujian_lokal", name: "Local Exam", color: "bg-red-500", textColor: "text-red-700" },
    { id: "ujian_nasional", name: "National Exam", color: "bg-blue-500", textColor: "text-blue-700" },
    { id: "event_lokal", name: "Local Event", color: "bg-green-500", textColor: "text-green-700" },
    { id: "event_nasional", name: "National Event", color: "bg-orange-500", textColor: "text-orange-700" },
    { id: "event_peer_group", name: "Peer Group Event International", color: "bg-purple-500", textColor: "text-purple-700" },
    { id: "event_peer_group_nasional", name: "Peer Group Event National", color: "bg-indigo-500", textColor: "text-indigo-700" }
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

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-blue-600 mb-6">Academic Calendar {academicYear.label}</h2>
          
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

          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <div className="grid grid-cols-7 border-b border-gray-300">
              {["SUN", "MON", "TUE", "WED", "THUR", "FRI", "SAT"].map((day) => (
                <div key={day} className="text-center text-sm font-semibold text-gray-600 py-3 border-r border-gray-300 last:border-r-0 bg-gray-50">
                  {day}
                </div>
              ))}
            </div>

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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
                <div className="flex items-center gap-2 text-gray-600">
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
                  <div className="flex items-center gap-2 text-gray-600">
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
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
