// 'use client'
// import React, { useState } from 'react';

// const Calendar = () => {
//   const [events, setEvents] = useState([
//     { date: '2024-07-10', title: 'Birthday Party', type: 'birthday', host: 'Alyy' },
//     { date: '2024-07-15', title: 'Work Anniversary', type: 'anniversary', host: 'Boby' },
//     { date: '2024-07-20', title: 'New Car Purchase', type: 'purchase', host: 'Ana' },
//   ]);

//   // State for new event input
//   const [newEvent, setNewEvent] = useState({ date: '', title: '', type: '', host: '' });

//   // Function to add a new event
//   const addEvent = () => {
//     if (newEvent.date && newEvent.title && newEvent.type && newEvent.host) {
//       setEvents([...events, newEvent]);
//       setNewEvent({ date: '', title: '', type: '', host: '' }); // Clear input fields
//     }
//   };

//   return (
//     <div className="wrapper">
//       <h2 className="h3-bold mb-8">My Calendar</h2>
//       <div className="flex flex-col items-center justify-center mt-16 py-14 bg-white">
//         <div className="calendar max-w-8xl w-full bg-white py-10 px-8 -mt-14 mb-12 border-black shadow-lg rounded-lg overflow-hidden">
//           <div className="calendar-header bg-gray-200 py-10 px-8 flex items-center justify-between">
//             <h2 className="text-3xl font-bold text-gray-800">Imp Dates</h2>
//             <div className="flex gap-4">
//               <input
//                 type="date"
//                 value={newEvent.date}
//                 onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
//                 className="px-6 py-3 border rounded-md w-48 focus:outline-none focus:ring-2 focus:ring-primary-500"
//               />
//               <input
//                 type="text"
//                 placeholder="Event title"
//                 value={newEvent.title}
//                 onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
//                 className="px-6 py-3 border rounded-md w-48 focus:outline-none focus:ring-2 focus:ring-primary-500"
//               />
//               <input
//                 type="text"
//                 placeholder="Event type"
//                 value={newEvent.type}
//                 onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
//                 className="px-6 py-3 border rounded-md w-48 focus:outline-none focus:ring-2 focus:ring-primary-500"
//               />
//               <input
//                 type="text"
//                 placeholder="Host"
//                 value={newEvent.host}
//                 onChange={(e) => setNewEvent({ ...newEvent, host: e.target.value })}
//                 className="px-6 py-3 border rounded-md w-48 focus:outline-none focus:ring-2 focus:ring-primary-500"
//               />
//               <button
//                 onClick={addEvent}
//                 className="px-6 py-3 bg-primary-500 text-white rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
//               >
//                 Add Event
//               </button>
//             </div>
//           </div>

//           <div className="calendar-grid grid grid-cols-7 gap-5 m-2 mt-10">
//             {events.map((event) => (
//               <div
//                 key={event.date}
//                 className={`day bg-gray-200 rounded-md p-6 ${
//                   event.type === 'birthday'
//                     ? 'bg-yellow-200'
//                     : event.type === 'anniversary'
//                     ? 'bg-orange-200'
//                     : event.type === 'purchase'
//                     ? 'bg-green-200'
//                     : ''
//                 }`}
//               >
//                 <div className="font-semibold text-xl mb-2">{event.title}</div>
//                 <div className="text-lg text-gray-600 mb-2">{event.date}</div>
//                 <div className="text-lg text-gray-600">Host: {event.host}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Calendar;

// 'use client';
// import React, { useState } from 'react';
// import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

// const months = [
//   'January', 'February', 'March', 'April', 'May', 'June',
//   'July', 'August', 'September', 'October', 'November', 'December'
// ];

// const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// const upcomingEvents = {
//   '2024-7-10': { title: 'Birthday Party', type: 'Birthday', host: 'Alice' },
//   '2024-7-15': { title: 'Work Anniversary', type: 'Anniversary', host: 'Bob' },
//   '2024-7-20': { title: 'New Car Purchase', type: 'Purchase', host: 'Charlie' },
//   // Add more events here
// };

// const getDaysInMonth = (month, year) => {
//   return new Date(year, month + 1, 0).getDate();
// };

// const renderDays = (month, year, events) => {
//   const daysInMonth = getDaysInMonth(month, year);
//   const firstDay = new Date(year, month, 1).getDay();
//   const weeks = [];
//   let week = Array(firstDay).fill(null);

//   for (let day = 1; day <= daysInMonth; day++) {
//     week.push(day);
//     if (week.length === 7) {
//       weeks.push(week);
//       week = [];
//     }
//   }

//   if (week.length > 0) {
//     weeks.push(week.concat(Array(7 - week.length).fill(null)));
//   }

//   return weeks.map((week, index) => (
//     <div key={index} className="grid grid-cols-7 gap-1">
//       {week.map((day, i) => {
//         const event = events[`${year}-${month + 1}-${day}`];
//         return (
//           <div
//             key={i}
//             className={`h-16 w-78 mb-2 flex flex-col items-center justify-center  border ${
//               day ? 'bg-white' : 'bg-gray-100'
//             } ${event ? 'bg-purple-200' : ''}`}
//           >
//             {day}
//             {event && (
//               <div className="text-xs text-gray-700 text-center -mt-2 ">
//                 <div className="font-bold">{event.type}</div>
//                 <div>{event.title}</div>
//                 <div>Host: {event.host}</div>
//               </div>
//             )}
//           </div>
//         );
//       })}
//     </div>
//   ));
// };

// const UpcomingEventsCalendar = () => {
//   const currentYear = new Date().getFullYear();
//   const currentMonth = new Date().getMonth();
//   const [month, setMonth] = useState(currentMonth);
//   const [year, setYear] = useState(currentYear);

//   const handlePrevMonth = () => {
//     if (month === 0) {
//       setMonth(11);
//       setYear(year - 1);
//     } else {
//       setMonth(month - 1);
//     }
//   };

//   const handleNextMonth = () => {
//     if (month === 11) {
//       setMonth(0);
//       setYear(year + 1);
//     } else {
//       setMonth(month + 1);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white bg-dotted-pattern bg-contain ">
//       <h1 className="text-3xl text-center font-bold mb-9 mt-7 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">Upcoming Events</h1>
//       <div className="container mx-auto p-6 bg-white shadow-xl rounded-lg">
//         <div className="flex justify-between mb-4">
//           <button
//             onClick={handlePrevMonth}
//             className="bg-purple-500 text-white px-4 py-2 rounded-full hover:bg-purple-700 flex items-center"
//           >
//             <ChevronLeftIcon className="h-6 w-6" />
//           </button>
//           <h2 className="text-2xl font-semibold">{months[month]} {year}</h2>
//           <button
//             onClick={handleNextMonth}
//             className="bg-purple-500 text-white px-4 py-2 rounded-full hover:bg-purple-700 flex items-center"
//           >
//             <ChevronRightIcon className="h-6 w-6" />
//           </button>
//         </div>
//         <div className="grid grid-cols-7 gap-4 mb-5 text-center font-semibold">
//           {days.map((day) => (
//             <div key={day} className="text-purple-700">
//               {day}
//             </div>
//           ))}
//         </div>
//         {renderDays(month, year, upcomingEvents)}
//       </div>
//     </div>
//   );
// };

// export default UpcomingEventsCalendar;


'use client';
import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const initialEvents = {
  '2024-7-10': { title: 'Birthday Party', type: 'Birthday', host: 'Alyy' },
  '2024-7-15': { title: 'Work Anniversary', type: 'Anniversary', host: 'Boby' },
  '2024-7-20': { title: 'New Car Purchase', type: 'Purchase', host: 'Ana' },
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
            className={`h-16 w-78 mb-2 flex flex-col items-center justify-center border ${
              day ? 'bg-white' : 'bg-gray-100'
            } ${event ? 'bg-pink-100' : ''}`}
          >
            {day}
            {event && (
              <div className="text-xs text-gray-700 text-center -mt-2 ">
                <div className="font-bold">{event.type}</div>
                <div>{event.title}</div>
                <div>Host: {event.host}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  ));
};

const UpcomingEventsCalendar = () => {
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

  const [events, setEvents] = useState(initialEvents);
  const [newEvent, setNewEvent] = useState({ date: '', title: '', type: '', host: '' });

  const addEvent = () => {
    const eventDate = new Date(newEvent.date);
    const formattedDate = `${eventDate.getFullYear()}-${eventDate.getMonth() + 1}-${eventDate.getDate()}`;
    if (newEvent.date && newEvent.title && newEvent.type && newEvent.host) {
      setEvents({ ...events, [formattedDate]: newEvent });
      setNewEvent({ date: '', title: '', type: '', host: '' }); 
    }
  };

  return (
    <div className="min-h-screen bg-white bg-dotted-pattern bg-contain">
      <h1 className="text-3xl text-center font-bold mb-9 mt-7 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">Events Calendar</h1>
      <div className="container mx-auto p-6 bg-white shadow-xl rounded-lg">
        <div className="flex justify-between mb-4">
          <button
            onClick={handlePrevMonth}
            className="bg-purple-500 text-white px-4 py-2 rounded-full hover:bg-purple-700 flex items-center"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
          <h2 className="text-2xl font-semibold">{months[month]} {year}</h2>
          <button
            onClick={handleNextMonth}
            className="bg-purple-500 text-white px-4 py-2 rounded-full hover:bg-purple-700 flex items-center"
          >
            <ChevronRightIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-4 mb-5 text-center font-semibold">
          {days.map((day) => (
            <div key={day} className="text-purple-700">
              {day}
            </div>
          ))}
        </div>
        {renderDays(month, year, events)}
      </div>
      <div className="flex flex-col items-center justify-center mt-16 py-12 bg-white">
        <div className="calendar max-w-7xl w-full bg-white py-8 px-6 border-black shadow-lg rounded-lg overflow-hidden">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex justify-center">Add New Event</h2>
          <div className="flex gap-4 mb-4 justify-center">
            <input
              type="date"
              value={newEvent.date}
              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              className="px-6 py-3 border rounded-md w-48 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="text"
              placeholder="Event title"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              className="px-6 py-3 border rounded-md w-48 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="text"
              placeholder="Event type"
              value={newEvent.type}
              onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
              className="px-6 py-3 border rounded-md w-48 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="text"
              placeholder="Host"
              value={newEvent.host}
              onChange={(e) => setNewEvent({ ...newEvent, host: e.target.value })}
              className="px-6 py-3 border rounded-md w-48 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={addEvent}
              className="px-6 py-3 bg-purple-500 text-white rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              Add Event
            </button>
          </div>
          <div className="calendar-grid grid grid-cols-7 gap-5 mt-6">
            {Object.entries(events).map(([date, event]) => (
              <div
                key={date}
                className={`day bg-gray-200 rounded-md p-4 ${
                  event.type === 'Birthday'
                    ? 'bg-yellow-200'
                    : event.type === 'Anniversary'
                    ? 'bg-orange-200'
                    : event.type === 'Purchase'
                    ? 'bg-green-200'
                    : ''
                }`}
              >
                <div className="font-semibold text-xl mb-2">{event.title}</div>
                <div className="text-lg text-gray-600 mb-2">{date}</div>
                <div className="text-lg text-gray-600">Host: {event.host}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpcomingEventsCalendar;
