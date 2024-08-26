'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { fetchUserDetails, fetchUpcomingEvents, fetchPollResults, fetchGalleryContributions } from '../services/api.js';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [pollResults, setPollResults] = useState([]);
  const [galleryContributions, setGalleryContributions] = useState([]);

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
            className="w-24 h-24 rounded-full object-cover border-4 "
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
            <div className="text-lg text-gray-600 mb-1">
              <span className="font-semibold">Date of Birth:</span> {new Date(user.dateOfBirth).toLocaleDateString()}
            </div>
            <div className="text-lg text-gray-600 mb-1">
              <span className="font-semibold">Marital Status:</span> {user.maritalStatus}
            </div>
            {user.maritalStatus === 'Married' && (
              <div className="text-lg text-gray-600 mb-1">
                <span className="font-semibold">Anniversary Date:</span> {new Date(user.anniversaryDate).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4 text-primary text-center">Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105"
              >
                <Image
                  src={event.imageUrl}
                  alt={event.name}
                  width={500}
                  height={300}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-primary">{event.name}</h3>
                  <p className="text-gray-600">{event.date}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4 text-primary text-center">Poll Results</h2>
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
          <h2 className="text-3xl font-semibold mb-4 text-primary text-center">Gallery Contributions</h2>
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

export default Dashboard;
