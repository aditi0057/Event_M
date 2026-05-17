'use client';

import Link from 'next/link';
import { CalendarDays, UserCircle } from 'lucide-react';

type EventCardProps = {
  event: {
    _id: string;
    title: string;
    description?: string;
    date: string;
    type: string;
    imageUrl?: string;
    host?: {
      _id?: string;
      fullname?: string;
    };
  };
};

const EventCard = ({ event }: EventCardProps) => {
  const eventDate = new Date(event.date);
  const fallbackImage = `https://placehold.co/900x600/e7f0ea/1f2933?text=${encodeURIComponent(event.type)}`;
  const imageSrc = event.imageUrl || fallbackImage;

  return (
    <Link
      href={`/Events/${event._id}`}
      className="group flex h-full flex-col overflow-hidden border border-[#d9dde3] bg-white transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(31,41,51,0.10)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[#e8ecef]">
        <img
          src={imageSrc}
          alt={event.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          onError={(event) => {
            event.currentTarget.src = fallbackImage;
          }}
        />
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="border border-[#c9ddd1] bg-[#eef6f1] px-3 py-1 text-xs font-semibold text-[#214f3a]">
            {event.type}
          </span>
          <span className="text-xs text-[#667085]">
            {eventDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        <div className="space-y-2">
          <h3 className="line-clamp-2 text-lg font-semibold leading-6 text-[#1f2933]">{event.title}</h3>
          {event.description && (
            <p className="line-clamp-2 text-sm leading-6 text-[#6b7280]">{event.description}</p>
          )}
        </div>

        <div className="mt-auto grid gap-2 border-t border-[#e8ecef] pt-4 text-sm text-[#4b5563]">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-[#667085]" />
            <span>{eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2">
            <UserCircle className="h-4 w-4 text-[#667085]" />
            <span>{event.host?.fullname || 'Host to be confirmed'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
