export interface PersonalCalendarEvent {
  _id?: string;
  title: string;
  date: string;
  type: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const parseResponse = async (response: Response) => {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.error?.message || payload?.message || 'Request failed');
  }
  return payload.data ?? payload;
};

export const fetchDashboardData = async () => {
  try {
    const apiUrl = `${API_URL}/dashboard/user`;
    const response = await fetch(apiUrl, {
      credentials: 'include', 
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dashboard data');
    }

    return parseResponse(response); 

  } catch (error) {
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

    return parseResponse(response);

  } catch (error) {
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

export const fetchEvents = async (params = ''): Promise<any[]> => {
  const response = await fetch(`${API_URL}/events${params}`, {
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch events');
  }
  const data = await response.json();
  return data.data?.docs || data.data || [];
};

export const deleteEvent = async (eventId: string) => {
  const response = await fetch(`${API_URL}/events/${eventId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  return parseResponse(response);
};

export const updateEvent = async (eventId: string, eventData: any) => {
  const response = await fetch(`${API_URL}/events/${eventId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(eventData),
  });
  return parseResponse(response);
};

export const createEvent = async (eventData: {
  title: string;
  description: string;
  date: string;
  type: string;
  hostName: string;
  imageUrl?: string;
  time?: string;
  location?: string;
  visibility?: string;
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

    return parseResponse(response); 
  } catch (error) {
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

    return parseResponse(response);
  } catch (error) {
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
  return data.data || [];
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
  return parseResponse(response);
};

export const changePollVote = async (pollId: string, optionIndex: number) => {
  const response = await fetch(`${API_URL}/polls/${pollId}/vote`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ optionIndex }),
  });
  return parseResponse(response);
};

export const closePoll = async (pollId: string) => {
  const response = await fetch(`${API_URL}/polls/${pollId}/close`, { method: 'PATCH', credentials: 'include' });
  return parseResponse(response);
};

export const deletePoll = async (pollId: string) => {
  const response = await fetch(`${API_URL}/polls/${pollId}`, { method: 'DELETE', credentials: 'include' });
  return parseResponse(response);
};

export const updatePoll = async (pollId: string, pollData: any) => {
  const response = await fetch(`${API_URL}/polls/${pollId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(pollData),
  });
  return parseResponse(response);
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
  return parseResponse(response);
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
  const response = await fetch(`${API_URL}/gallery?limit=12`, {
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch gallery images');
  }
  const data = await response.json();
  return data.data?.docs || data.data || [];
};

export const rsvpEvent = async (eventId: string, status: 'going' | 'maybe' | 'not_going') => {
  const response = await fetch(`${API_URL}/events/${eventId}/rsvp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ status }),
  });
  return parseResponse(response);
};

export const fetchCelebrations = async () => {
  const [birthdays, anniversaries] = await Promise.all([
    fetch(`${API_URL}/users/birthdays?days=14`, { credentials: 'include' }).then(parseResponse).catch(() => []),
    fetch(`${API_URL}/users/anniversaries?days=14`, { credentials: 'include' }).then(parseResponse).catch(() => []),
  ]);
  return { birthdays, anniversaries };
};

export const fetchNotifications = async () => {
  const response = await fetch(`${API_URL}/notifications`, { credentials: 'include' });
  return parseResponse(response);
};

export const markNotificationRead = async (id: string) => {
  const response = await fetch(`${API_URL}/notifications/${id}/read`, { method: 'PATCH', credentials: 'include' });
  return parseResponse(response);
};

export const markAllNotificationsRead = async () => {
  const response = await fetch(`${API_URL}/notifications/read-all`, { method: 'PATCH', credentials: 'include' });
  return parseResponse(response);
};

export const fetchAnnouncements = async () => {
  const response = await fetch(`${API_URL}/announcements`, { credentials: 'include' });
  return parseResponse(response);
};

export const createAnnouncement = async (payload: { body?: string; message?: string; sendTo?: string; audience?: string; priority?: string; scheduledFor?: string; scheduledAt?: string }) => {
  const response = await fetch(`${API_URL}/announcements`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  return parseResponse(response);
};

export const fetchAdminStats = async () => {
  const response = await fetch(`${API_URL}/admin/stats`, { credentials: 'include' });
  return parseResponse(response);
};

export const fetchAdminUsers = async (params = '') => {
  const response = await fetch(`${API_URL}/admin/users${params}`, { credentials: 'include' });
  return parseResponse(response);
};

export const updateAdminUserRole = async (id: string, role: string) => {
  const response = await fetch(`${API_URL}/admin/users/${id}/role`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ role }),
  });
  return parseResponse(response);
};

export const updateAdminUserStatus = async (id: string, isActive: boolean) => {
  const response = await fetch(`${API_URL}/admin/users/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ isActive }),
  });
  return parseResponse(response);
};

export const fetchUserSettings = async () => {
  const response = await fetch(`${API_URL}/users/settings`, { credentials: 'include' });
  return parseResponse(response);
};

export const updateUserSettings = async (settings: Record<string, boolean>) => {
  const response = await fetch(`${API_URL}/users/settings`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(settings),
  });
  return parseResponse(response);
};

export const changePassword = async (payload: { currentPassword: string; newPassword: string }) => {
  const response = await fetch(`${API_URL}/users/change-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  return parseResponse(response);
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




