// // services/api.js

// // Function to create a new event (Admin only)
// export const createEvent = async (eventData) => {
//   try {
//     const response = await fetch('/api/admin/events', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(eventData),
//     });
//     if (!response.ok) throw new Error('Failed to create event');
//     return await response.json();
//   } catch (error) {
//     console.error('Error creating event:', error);
//     throw error;
//   }
// };

// // Function to update an existing event (Admin only)
// export const updateEvent = async (eventId, eventData) => {
//   try {
//     const response = await fetch(`/api/admin/events/${eventId}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(eventData),
//     });
//     if (!response.ok) throw new Error('Failed to update event');
//     return await response.json();
//   } catch (error) {
//     console.error('Error updating event:', error);
//     throw error;
//   }
// };

// // Function to delete an event (Admin only)
// export const deleteEvent = async (eventId) => {
//   try {
//     const response = await fetch(`/api/admin/events/${eventId}`, {
//       method: 'DELETE',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//     if (!response.ok) throw new Error('Failed to delete event');
//     return await response.json();
//   } catch (error) {
//     console.error('Error deleting event:', error);
//     throw error;
//   }
// };

// // Existing functions...

// // Mock user data
// export const fetchUserDetails = async () => {
//   return {
//     _id: 'user123',
//     username: 'johndoe',
//     email: 'john.doe@example.com',
//     fullname: 'John Doe',
//     avatar: '/assets/images/avatar.jpeg',
//     mobileNumber: '123-456-7890',
//     dateOfBirth: '1990-01-01',
//     maritalStatus: 'Single',
//     anniversaryDate: null,
//     workJoiningDate: '2021-06-01',
//     role: 'user',
//     children: [],
//     parents: []
//   };
// };

// // Mock upcoming events
// export const fetchUpcomingEvents = async () => {
//   return [
//     { id: 1, name: 'Summer Bash', date: '2024-07-01', imageUrl: '/assets/images/event1/img1.avif' },
//     { id: 2, name: 'Corporate Meet', date: '2024-07-02', imageUrl: '/assets/images/event2/img1.avif' }
//   ];
// };

// // Mock poll results
// export const fetchPollResults = async () => {
//   return [
//     { id: 1, title: 'Favorite Color', options: [{ text: 'Blue', votes: 120 }, { text: 'Red', votes: 90 }] },
//     { id: 2, title: 'Preferred Genre', options: [{ text: 'Rock', votes: 150 }, { text: 'Pop', votes: 130 }] }
//   ];
// };

// // Mock gallery contributions
// export const fetchGalleryContributions = async () => {
//   return [
//     { id: 1, url: '/assets/images/vacation.jpeg', description: 'Vacation' },
//     { id: 2, url: '/assets/images/birthday.jpeg', description: 'BirthDay' }
//   ];
// };

// services/api.js

// Mock user data
// Mock user details
export const fetchUserDetails = async () => {
  return {
    _id: 'user123',
    username: 'johndoe',
    email: 'john.doe@example.com',
    fullname: 'John Doe',
    avatar: '/assets/images/avatar.jpeg',
    mobileNumber: '123-456-7890',
    dateOfBirth: '1990-01-01',
    maritalStatus: 'Single',
    anniversaryDate: null,
    workJoiningDate: '2021-06-01',
    role: 'admin', // Mock user as admin
    children: [],
    parents: []
  };
};

// Mock upcoming events data
let events = [
  { id: 1, title: 'Summer Bash', date: '2024-07-01', type: 'Party', host: 'John Doe', imageUrl: '/assets/images/event1/img1.avif' },
  { id: 2, title: 'Corporate Meet', date: '2024-07-02', type: 'Meeting', host: 'Jane Smith', imageUrl: '/assets/images/event2/img1.avif' },
];

// Function to fetch upcoming events
export const fetchUpcomingEvents = async () => {
  return events;
};

// Function to create a new event (Admin only)
export const createEvent = async (eventData) => {
  try {
    // Ensure all required fields are provided
    if (!eventData.date || !eventData.title || !eventData.type || !eventData.host) {
      throw new Error('Missing required fields');
    }

    // Check for duplicate event titles
    if (events.some(event => event.title === eventData.title && event.date === eventData.date)) {
      throw new Error('Event with the same title and date already exists');
    }

    const newEvent = {
      id: events.length + 1,
      ...eventData,
    };
    events.push(newEvent);
    return newEvent;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

// Function to update an existing event (Admin only)
export const updateEvent = async (eventId, eventData) => {
  try {
    const eventIndex = events.findIndex(event => event.id === eventId);
    if (eventIndex === -1) throw new Error('Event not found');

    // Update the event
    events[eventIndex] = { ...events[eventIndex], ...eventData };
    return events[eventIndex];
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

// Function to delete an event (Admin only)
export const deleteEvent = async (eventId) => {
  try {
    // Remove the event
    events = events.filter(event => event.id !== eventId);
    return { success: true };
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

// Mock poll results data
export const fetchPollResults = async () => {
  return [
    { id: 1, title: 'Favorite Color', options: [{ text: 'Blue', votes: 120 }, { text: 'Red', votes: 90 }] },
    { id: 2, title: 'Preferred Genre', options: [{ text: 'Rock', votes: 150 }, { text: 'Pop', votes: 130 }] }
  ];
};

// Mock gallery contributions data
export const fetchGalleryContributions = async () => {
  return [
    { id: 1, url: '/assets/images/vacation.jpeg', description: 'Vacation' },
    { id: 2, url: '/assets/images/birthday.jpeg', description: 'Birthday' }
  ];
};
