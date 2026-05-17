export interface PersonalCalendarEvent {
  title: string;
  date: string;
  type: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const fetchDashboardData = async () => {
  try {
    const apiUrl = `${API_URL}/dashboard/user`;
    const response = await fetch(apiUrl, {
      credentials: 'include', 
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dashboard data');
    }

    const result = await response.json();
    return result.data; 

  } catch (error) {
    console.error("Error in fetchDashboardData:", error);
    throw error;
  }
};
export const fetchAdminDashboardData = async () => {
  try {
    const apiUrl = `${API_URL}/dashboard/admin`;
    
    const response = await fetch(apiUrl, {
      credentials: 'include', 
    });

    if (!response.ok) {
      throw new Error('Failed to fetch admin dashboard data');
    }

    const result = await response.json();
    return result.data;

  } catch (error) {
    console.error("Error in fetchAdminDashboardData:", error);
    throw error;
  }
};

export const approveImageApi = async (imageId: string) => {
  const response = await fetch(`${API_URL}/gallery/${imageId}/approve`, {
    method: 'PATCH',
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to approve image');
  return response.json();
};

export const rejectImageApi = async (imageId: string) => {
  const response = await fetch(`${API_URL}/gallery/${imageId}/reject`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to reject image');
  return response.json();
};

export const fetchEvents = async (): Promise<any[]> => {
  const response = await fetch(`${API_URL}/events`, {
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch events');
  }
  const data = await response.json();
  return data.data.docs || []; // Return the docs array, or an empty array as a fallback
};

export const createEvent = async (eventData: {
  title: string;
  description: string;
  date: string;
  type: string;
  hostName: string;
  imageUrl?: string;
}) => {
  const apiUrl = `${API_URL}/events`;
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important: sends cookies
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create event');
    }

    const data = await response.json();
    return data.data; 
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};

export const fetchEventById = async (eventId: string) => {
  const apiUrl = `${API_URL}/events/${eventId}`;
  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      credentials: 'include', 
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch event details');
    }

    const data = await response.json();
    return data.data; // Return the event data
  } catch (error) {
    console.error(`Error fetching event ${eventId}:`, error);
    throw error;
  }
};

export const fetchPolls = async (): Promise<any[]> => {
  const response = await fetch(`${API_URL}/polls`, {
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch polls');
  }
  const data = await response.json();
  return data.data || []; // The polls endpoint already returns an array
};

export const voteOnPoll = async (pollId: string, optionIndex: number) => {
  const response = await fetch(`${API_URL}/polls/${pollId}/vote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      optionIndex
    }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to submit vote');
  }
  return response.json();
};

export const createPoll = async (pollData: any) => {
  const response = await fetch(`${API_URL}/polls`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(pollData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create poll');
  }
  return response.json();
};

export const fetchPollResults = async (pollId: string) => {
  const response = await fetch(`${API_URL}/polls/${pollId}/results`, {
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch poll results');
  }
  const data = await response.json();
  return data.data; 
};

export const fetchGalleryImages = async (): Promise<any[]> => {
  const response = await fetch(`${API_URL}/gallery`, {
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch gallery images');
  }
  const data = await response.json();
  return data.data.docs || []; // Return the docs array, or an empty array
};

export const uploadImage = async (formData: FormData): Promise<any> => {
  const response = await fetch(`${API_URL}/gallery`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Failed to upload image');
  }
  return result.data;
};

export const fetchPersonalCalendarEvents = async (year: number, month: number): Promise<PersonalCalendarEvent[]> => {
  const response = await fetch(`${API_URL}/calendar/personal?year=${year}&month=${month}`, {
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch calendar events');
  }
  const data = await response.json();
  return data.data;
};

export const deleteImage = async (imageId: string): Promise<void> => {
  const response = await fetch(`${API_URL}/gallery/${imageId}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.message || 'Failed to delete image');
  }
};




