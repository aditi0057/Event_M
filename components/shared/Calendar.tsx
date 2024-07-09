'use client'
import React, { useState } from 'react';

const Calendar = () => {
  const [events, setEvents] = useState([
    { date: '2024-07-10', title: 'Birthday Party', type: 'birthday' },
    { date: '2024-07-15', title: 'Work Anniversary', type: 'anniversary' },
    { date: '2024-07-20', title: 'New Car Purchase', type: 'purchase' },
  ]);

  // State for new event input
  const [newEvent, setNewEvent] = useState({ date: '', title: '', type: '' });

  // Function to add a new event
  const addEvent = () => {
    if (newEvent.date && newEvent.title && newEvent.type) {
      setEvents([...events, newEvent]);
      setNewEvent({ date: '', title: '', type: '' }); // Clear input fields
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-14 py-14 bg-white ">
      <div className="calendar max-w-6xl   bg-white py-10 px-8 -mt-14  border-black shadow-lg rounded-lg overflow-hidden">
        <div className="calendar-header bg-gray-200 py-10 px-8 flex items-center justify-between ">
          <h2 className="text-3xl font-bold text-gray-800">Imp Dates</h2>
          <div className="flex gap-4">
            <input
              type="date"
              value={newEvent.date}
              onChange={(e) =>
                setNewEvent({ ...newEvent, date: e.target.value }) 
              }
              className="px-6 py-3 border rounded-md w-48 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <input
              type="text"
              placeholder="Event title"
              value={newEvent.title}
              onChange={(e) =>
                setNewEvent({ ...newEvent, title: e.target.value })
              }
              className="px-6 py-3 border rounded-md w-48 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <input
              type="text"
              placeholder="Event type"
              value={newEvent.type}
              onChange={(e) =>
                setNewEvent({ ...newEvent, type: e.target.value })
              }
              className="px-6 py-3 border rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              onClick={addEvent}
              className="px-6 py-3 bg-primary-500 text-white rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              Add Event
            </button>
          </div>
        </div>

        <div className="calendar-grid grid grid-cols-7 gap-5 mt-7 m-4">
          {events.map((event) => (
            <div
              key={event.date}
              className={`day bg-gray-200 rounded-md p-6 w-40 ${
                event.type === 'birthday'
                  ? 'bg-yellow-200'
                  : event.type === 'anniversary'
                  ? 'bg-orange-200'
                  : event.type === 'purchase'
                  ? 'bg-green-200'
                  : ''
              }`}
            >
              <div className="font-semibold  text-xl mb-6">{event.title}</div>
              <div className="text-lg  px-19 text-gray-600">{event.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
