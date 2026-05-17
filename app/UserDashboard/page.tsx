'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { fetchDashboardData } from '@/services/api';
import { CalendarDays, ImageIcon, Vote } from 'lucide-react';

interface UserDetails {
  _id: string;
  fullname: string;
  username: string;
  email: string;
  mobileNumber: string;
  avatar: string;
  dateOfBirth: string;
  maritalStatus: string;
  anniversaryDate?: string;
}

interface Event {
  _id: string;
  title: string;
  date: string;
}

interface DashboardData {
  userDetails: UserDetails;
  upcomingEvents: Event[];
  activePolls: any[];
  galleryContributions: any[];
}

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchDashboardData();
        setDashboardData(data);
      } catch {
        setError('Could not load dashboard data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading) {
    return <section className="page-shell"><div className="wrapper"><div className="surface p-10 text-center text-sm text-[#6b7280]">Loading your dashboard...</div></div></section>;
  }

  if (error) {
    return <section className="page-shell"><div className="wrapper"><div className="surface p-10 text-center text-sm text-red-600">{error}</div></div></section>;
  }

  if (!dashboardData) {
    return <section className="page-shell"><div className="wrapper"><div className="surface p-10 text-center text-sm text-[#6b7280]">No data available.</div></div></section>;
  }

  const { userDetails, upcomingEvents, activePolls, galleryContributions } = dashboardData;

  return (
    <section className="page-shell">
      <div className="wrapper space-y-8">
        <div className="surface flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:text-left">
            <Image
              src={userDetails.avatar || '/assets/images/placeholder.png'}
              alt={userDetails.fullname}
              width={96}
              height={96}
              className="h-24 w-24 rounded-md object-cover"
            />
            <div className="text-center sm:text-left">
              <p className="eyebrow">Personal workspace</p>
              <h1 className="mt-2 text-2xl font-semibold text-[#1f2933]">{userDetails.fullname}</h1>
              <p className="mt-1 text-sm text-[#6b7280]">@{userDetails.username} · {userDetails.email}</p>
            </div>
          </div>

          <div className="grid w-full grid-cols-3 border border-[#d9dde3] bg-[#f9fafb] text-center lg:w-auto lg:min-w-[320px]">
            <div className="px-4 py-3">
              <CalendarDays className="mx-auto h-4 w-4 text-[#667085]" />
              <p className="mt-1 text-lg font-semibold">{upcomingEvents.length}</p>
            </div>
            <div className="border-x border-[#d9dde3] px-4 py-3">
              <Vote className="mx-auto h-4 w-4 text-[#667085]" />
              <p className="mt-1 text-lg font-semibold">{activePolls.length}</p>
            </div>
            <div className="px-4 py-3">
              <ImageIcon className="mx-auto h-4 w-4 text-[#667085]" />
              <p className="mt-1 text-lg font-semibold">{galleryContributions.length}</p>
            </div>
          </div>
        </div>

        <section className="space-y-4">
          <div className="section-header">
            <div className="section-copy">
              <p className="eyebrow">Your schedule</p>
              <h2 className="h3-bold mt-1">Upcoming Events</h2>
            </div>
          </div>

          {upcomingEvents.length > 0 ? (
            <div className="grid-fit-320">
              {upcomingEvents.map((event) => (
                <div key={event._id} className="surface overflow-hidden">
                  <Image
                    src={`https://placehold.co/900x540/e7f0ea/1f2933?text=${encodeURIComponent(event.title.split(' ')[0])}`}
                    alt={event.title}
                    width={900}
                    height={540}
                    className="h-40 w-full object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-base font-semibold text-[#1f2933]">{event.title}</h3>
                    <p className="mt-2 text-sm text-[#6b7280]">{new Date(event.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p className="text-sm">No upcoming events assigned to you.</p>
            </div>
          )}
        </section>
      </div>
    </section>
  );
}
