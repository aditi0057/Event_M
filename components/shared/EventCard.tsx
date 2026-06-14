'use client';

import Link from 'next/link';
import { BriefcaseBusiness, Cake, CalendarDays, Trophy, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';

type EventCardProps = {
  event: {
    _id: string;
    title: string;
    description?: string;
    date: string;
    type: string;
    imageUrl?: string;
    location?: string;
    attendees?: { fullname?: string; avatar?: string }[];
    host?: {
      _id?: string;
      fullname?: string;
      avatar?: string;
    };
    hostName?: string;
  };
};

const EventCard = ({ event }: EventCardProps) => {
  const eventDate = new Date(event.date);
  const hasImage = Boolean(event.imageUrl);
  const Icon = event.type === "Birthday" ? Cake : event.type === "Work" ? BriefcaseBusiness : event.type === "Sports" ? Trophy : event.type === "Festival" ? Sparkles : CalendarDays;
  const gradients: Record<string, string> = {
    Festival: "from-[var(--category-festival)] to-[#A78BFA]",
    Birthday: "from-[var(--category-birthday)] to-[#F472B6]",
    Work: "from-[var(--category-work)] to-[#38BDF8]",
    Sports: "from-[var(--category-sports)] to-[#86EFAC]",
    Other: "from-[var(--category-other)] to-[#9CA3AF]",
  };

  return (
    <Link
      href={`/Events/${event._id}`}
      className="group flex h-full max-h-[330px] flex-col overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-card-border)] bg-[var(--color-card-bg)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)] focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]"
    >
      <div className={`relative h-[180px] overflow-hidden bg-gradient-to-br ${gradients[event.type] || gradients.Other}`}>
        {hasImage ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : <Icon className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 text-white/40" />}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center justify-between gap-3">
          <Badge color={event.type}>{event.type}</Badge>
          <span className="text-xs text-[var(--color-text-secondary)]">
            {eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>

        <div className="space-y-1">
          <h3 className="line-clamp-2 text-[15px] font-semibold leading-5 text-[var(--color-text-primary)]">{event.title}</h3>
          {event.description && (
            <p className="truncate text-xs leading-5 text-[var(--color-text-secondary)]">{event.description}</p>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-[var(--color-border)] pt-3 text-xs text-[var(--color-text-secondary)]">
          <div className="flex min-w-0 items-center gap-2">
            <Avatar src={event.host?.avatar} name={event.host?.fullname || event.hostName} size="sm" />
            <span className="truncate">{event.host?.fullname || event.hostName || 'Host'}</span>
          </div>
          <span className="shrink-0">{event.attendees?.length || 0} attending</span>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
