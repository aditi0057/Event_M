'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { fetchUserDetails, fetchUpcomingEvents, fetchPollResults, fetchGalleryContributions, createEvent } from '../services/api.js';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [pollResults, setPollResults] = useState([]);
  const [galleryContributions, setGalleryContributions] = useState([]);
  const [newEvent, setNewEvent] = useState({ date: '', title: '', type: '', host: '' });
  const [loading, setLoading] = useState(false); // Add a loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await fetchUserDetails();
        const eventsData = await fetchUpcomingEvents();
        const pollResultsData = await fetchPollResults();
        const galleryContributionsData = await fetchGalleryContributions();

        setUser(userData);
        setEvents(eventsData);
        setPollResults(pollResultsData);
        setGalleryContributions(galleryContributionsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const addEvent = async () => {
    if (loading) return; // Prevent if already loading
    setLoading(true); // Set loading to true

    try {
      const updatedEvents = await createEvent(newEvent);
      setEvents(prevEvents => [...prevEvents, updatedEvents]); // Update the state correctly
      setNewEvent({ date: '', title: '', type: '', host: '' }); // Reset the form
    } catch (error) {
      console.error('Error adding event:', error);
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="container mx-auto p-6 bg-white max-w-5xl">
      <div className="bg-white rounded-lg shadow-lg p-6 flex items-center mb-8">
        <Image
          src={user.avatar}
          alt={user.fullname}
          width={100}
          height={100}
          className="w-24 h-24 rounded-full object-cover border-4 border-primary"
        />
        <div className="ml-6">
          <h1 className="text-4xl font-bold text-primary mb-2">{user.fullname}</h1>
          <div className="text-lg text-gray-600 mb-1">
            <span className="font-semibold">Username:</span> {user.username}
          </div>
          <div className="text-lg text-gray-600 mb-1">
            <span className="font-semibold">Email:</span> {user.email}
          </div>
          <div className="text-lg text-gray-600 mb-1">
            <span className="font-semibold">Mobile:</span> {user.mobileNumber}
          </div>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4 text-center text-primary">Manage Events</h2>
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="calendar max-w-7xl w-full bg-white py-8 px-6 border-black shadow-lg rounded-lg overflow-hidden">
            <h2 className="text-2xl font-bold text-blue-700 mb-6 flex justify-center">Add New Event</h2>
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
                disabled={loading} // Disable the button while loading
                className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {loading ? 'Adding...' : 'Add Event'} {/* Show loading state */}
              </button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105"
            >
              <Image
                src={event.imageUrl}
                alt={event.title}
                width={500}
                height={300}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-primary">{event.title}</h3>
                <p className="text-gray-600">{event.date}</p>
                <p className="text-gray-600">Host: {event.host}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4 text-center text-primary">Poll Results</h2>
        <div className="bg-white rounded-lg shadow-md p-4">
          {pollResults.length > 0 ? (
            pollResults.map((poll) => (
              <div key={poll.id} className="mb-4">
                <h3 className="text-lg font-semibold text-primary">{poll.title}</h3>
                <ul className="list-disc pl-5 mt-2">
                  {poll.options.map((option, index) => (
                    <li key={index} className="text-gray-700">
                      {option.text}: {option.votes} votes
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p>No poll results available.</p>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-4 text-center text-primary">Gallery Contributions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryContributions.map((image) => (
            <div
              key={image.id}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105"
            >
              <Image
                src={image.url}
                alt={image.description}
                width={500}
                height={300}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <p className="text-gray-600">{image.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
