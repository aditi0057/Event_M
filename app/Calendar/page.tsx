


"use client";
import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const events = {
  '2024-7-17': { type: 'Birthday', name: 'Rajat' },
  '2024-7-13': { type: 'Anniversary', name: 'Ajay' },
  '2024-7-2': { type: 'Birthday', name: 'Simran' },
  '2024-7-21': { type: 'Anniversary', name: 'Nidhi' },
  // Add more events here
};

const getDaysInMonth = (month, year) => {
  return new Date(year, month + 1, 0).getDate();
};

const renderDays = (month, year, events) => {
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

  if (week.length > 0) {
    weeks.push(week.concat(Array(7 - week.length).fill(null)));
  }

  return weeks.map((week, index) => (
    <div key={index} className="grid grid-cols-7 gap-1">
      {week.map((day, i) => {
        const event = events[`${year}-${month + 1}-${day}`];
        return (
          <div
            key={i}
            className={`h-16  w-78 mb-2  flex flex-col items-center justify-center border ${
              day ? 'bg-white' : 'bg-gray-100'
            } ${event ? 'bg-blue-100' : ''}`}
          >
            {day}
            {event && (
              <div className="text-xs text-gray-700 mt-1 text-center ">
                <div className="font-bold">{event.type}</div>
                <div>{event.name}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  ));
};

const CalendarPage = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);

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
    <div className="min-h-screen bg-white bg-dotted-pattern bg-contain ">
     <h1 className="text-4xl text-center font-extrabold mb-9 mt-7 text-transparent  bg-clip-text bg-gradient-to-r from-pink-500 via-blue-500 to-indigo-500 ">Calendar</h1>

      <div className="container mx-auto p-4 bg-white shadow-lg rounded-lg">
        <div className="flex justify-between mb-4">
          <button
            onClick={handlePrevMonth}
            className="bg-indigo-500 text-white px-4 py-2 rounded-full hover:bg-indigo-700 flex items-center"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <h2 className="text-2xl font-bold">{months[month]} {year}</h2>
          <button
            onClick={handleNextMonth}
            className="bg-indigo-500 text-white px-4 py-2 rounded-full hover:bg-indigo-700 flex items-center"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2 text-center font-semibold">
          {days.map((day) => (
            <div key={day} className="text-blue-700">
              {day}
            </div>
          ))}
        </div>
        {renderDays(month, year, events)}
      </div>
    </div>
  );
};

export default CalendarPage;
