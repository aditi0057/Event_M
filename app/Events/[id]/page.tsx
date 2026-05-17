'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchEventById } from '@/services/api';
import { CalendarDays, UserCircle } from 'lucide-react';

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  type: string;
  imageUrl?: string;
  host?: {
    _id: string;
    fullname: string;
  };
}

const EventDetailsPage = () => {
  const params = useParams();
  const id = params.id as string;
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const loadEventDetails = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const eventData = await fetchEventById(id);
          setEvent(eventData);
        } catch (err: any) {
          setError(err.message || 'Failed to load event details.');
        } finally {
          setIsLoading(false);
        }
      };
      loadEventDetails();
    }
  }, [id]);

  if (isLoading) {
    return <section className="page-shell"><div className="wrapper"><div className="surface p-10 text-center text-sm text-[#6b7280]">Loading event...</div></div></section>;
  }

  if (error) {
    return <section className="page-shell"><div className="wrapper"><div className="surface p-10 text-center text-sm text-red-600">{error}</div></div></section>;
  }

  if (!event) {
    return <section className="page-shell"><div className="wrapper"><div className="surface p-10 text-center text-sm text-[#6b7280]">Event not found.</div></div></section>;
  }

  const eventDate = new Date(event.date);
  const fallbackImage = `https://placehold.co/1200x760/e7f0ea/1f2933?text=${encodeURIComponent(event.type)}`;
  const imageSrc = event.imageUrl || fallbackImage;

  return (
    <section className="page-shell">
      <div className="wrapper space-y-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative aspect-[16/10] overflow-hidden border border-[#d9dde3] bg-[#e8ecef]">
            <img
              src={imageSrc}
              alt={event.title}
              className="h-full w-full object-cover"
              onError={(image) => {
                image.currentTarget.src = fallbackImage;
              }}
            />
          </div>

          <div className="surface flex flex-col justify-center p-6">
            <p className="eyebrow">{event.type}</p>
            <h1 className="mt-3 text-3xl font-semibold leading-10 text-[#1f2933]">{event.title}</h1>

            <div className="mt-6 grid gap-3 border-y border-[#e8ecef] py-5 text-sm text-[#4b5563]">
              <div className="flex items-center gap-3">
                <CalendarDays className="h-4 w-4 text-[#667085]" />
                <span>
                  {eventDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  {' at '}
                  {eventDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <UserCircle className="h-4 w-4 text-[#667085]" />
                <span>Hosted by <strong className="font-semibold text-[#1f2933]">{event.host?.fullname || 'Host to be confirmed'}</strong></span>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-sm font-semibold uppercase text-[#667085]">About</h2>
              <p className="mt-3 text-sm leading-7 text-[#4b5563]">{event.description || 'No description provided.'}</p>
            </div>
          </div>
        </div>

        <div className="empty-state">
          <h3 className="text-lg font-semibold text-[#1f2933]">Gallery and polls coming soon</h3>
          <p className="mt-2 text-sm">Event-specific participation modules will appear here when connected.</p>
        </div>
      </div>
    </section>
  );
};

export default EventDetailsPage;
