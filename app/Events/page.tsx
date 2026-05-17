'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContent';
import { fetchEvents } from '@/services/api';
import EventCard from '@/components/shared/EventCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';

interface Event {
  _id: string;
  title: string;
  description?: string;
  date: string;
  type: string;
  imageUrl?: string;
  host?: {
    fullname?: string;
  };
}

const EventsPage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const eventsData = await fetchEvents();
        setEvents(eventsData);
      } catch (err: any) {
        setError(err.message || 'Failed to load events.');
      } finally {
        setIsLoading(false);
      }
    };
    loadEvents();
  }, []);

  return (
    <section className="page-shell">
      <div className="wrapper space-y-8">
        <div className="section-header">
          <div className="section-copy">
            <p className="eyebrow">Programming calendar</p>
            <h1 className="h2-bold mt-2">Upcoming Events</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6b7280]">
              A curated view of planned celebrations, team moments, and internal gatherings.
            </p>
          </div>
          {user?.role === 'admin' && (
            <Button asChild size="lg" className="w-full md:w-auto">
              <Link href="/Events/Create">
                <Plus className="mr-2 h-4 w-4" />
                New Event
              </Link>
            </Button>
          )}
        </div>

        {isLoading && <div className="surface p-10 text-center text-sm text-[#6b7280]">Loading events...</div>}
        {error && <div className="surface p-10 text-center text-sm text-red-600">{error}</div>}

        {!isLoading && !error && events.length > 0 && (
          <div className="grid-fit-320">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}

        {!isLoading && !error && events.length === 0 && (
          <div className="empty-state">
            <h3 className="text-lg font-semibold text-[#1f2933]">No events scheduled</h3>
            <p className="mt-2 text-sm">New events will appear here after an admin publishes them.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default EventsPage;
