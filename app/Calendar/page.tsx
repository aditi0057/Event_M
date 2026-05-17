'use client';

import { useEffect, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { fetchPersonalCalendarEvents } from '@/services/api';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface FormattedEvents {
  [key: string]: { type: string; name: string };
}

const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();

const renderDays = (month: number, year: number, events: FormattedEvents) => {
  const daysInMonth = getDaysInMonth(month, year);
  const firstDay = new Date(year, month, 1).getDay();
  const weeks = [];
  let week = Array(firstDay).fill(null);

  for (let day = 1; day <= daysInMonth; day++) {
    week.push(day);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }

  if (week.length > 0) weeks.push(week.concat(Array(7 - week.length).fill(null)));

  return weeks.map((week, index) => (
    <div key={index} className="grid grid-cols-7 border-t border-[#e8ecef]">
      {week.map((day, i) => {
        const event = events[`${year}-${month + 1}-${day}`];
        return (
          <div
            key={i}
            className={`min-h-[104px] border-r border-[#e8ecef] p-3 last:border-r-0 ${
              day ? 'bg-white' : 'bg-[#f9fafb]'
            }`}
          >
            {day && <span className="text-sm font-semibold text-[#1f2933]">{day}</span>}
            {event && (
              <div className="mt-3 border-l-2 border-[#214f3a] bg-[#eef6f1] px-2 py-1.5">
                <div className="text-[11px] font-semibold uppercase text-[#214f3a]">{event.type}</div>
                <div className="mt-1 truncate text-xs text-[#374151]">{event.name}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  ));
};

const CalendarPage = () => {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [events, setEvents] = useState<FormattedEvents>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCalendarData = async () => {
      setIsLoading(true);
      try {
        const eventsData = await fetchPersonalCalendarEvents(year, month + 1);
        const formatted: FormattedEvents = {};
        eventsData.forEach((event) => {
          const eventDate = new Date(event.date);
          const key = `${eventDate.getFullYear()}-${eventDate.getMonth() + 1}-${eventDate.getDate()}`;
          formatted[key] = { type: event.type, name: event.title };
        });
        setEvents(formatted);
      } catch (error) {
        console.error("Failed to load calendar events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCalendarData();
  }, [month, year]);

  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  return (
    <section className="page-shell">
      <div className="wrapper space-y-8">
        <div className="section-header">
          <div className="section-copy">
            <p className="eyebrow">People calendar</p>
            <h1 className="h2-bold mt-2">Team Calendar</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6b7280]">
              Birthdays, anniversaries, work milestones, and team celebrations by month.
            </p>
          </div>
        </div>

        <div className="surface overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-[#d9dde3] px-4 py-4 sm:px-6">
            <button
              onClick={handlePrevMonth}
              className="border border-[#cfd6dd] bg-white p-2 text-[#1f2933] transition hover:bg-[#eef1f4]"
              aria-label="Previous month"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <h2 className="text-center text-base font-semibold text-[#1f2933] sm:text-xl">{months[month]} {year}</h2>
            <button
              onClick={handleNextMonth}
              className="border border-[#cfd6dd] bg-white p-2 text-[#1f2933] transition hover:bg-[#eef1f4]"
              aria-label="Next month"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[700px]">
              <div className="grid grid-cols-7 bg-[#f9fafb] text-center text-xs font-semibold uppercase text-[#667085]">
                {daysOfWeek.map((day) => (
                  <div key={day} className="border-r border-[#e8ecef] px-2 py-3 last:border-r-0">
                    {day}
                  </div>
                ))}
              </div>
              {isLoading ? (
                <div className="flex h-96 items-center justify-center text-sm text-[#6b7280]">Loading calendar...</div>
              ) : (
                renderDays(month, year, events)
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CalendarPage;
