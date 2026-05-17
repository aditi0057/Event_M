'use client';

import { useEffect, useState } from 'react';
import { fetchAdminDashboardData } from '@/services/api';
import { StatsCards } from '@/components/admin/StatisticsCards';
import { ModerationQueue } from '@/components/admin/ModerationQueue';

interface AdminDashboardData {
  stats: {
    totalUsers: number;
    totalEvents: number;
    activePolls: number;
  };
  moderationQueue: {
    pendingApprovals: any[];
  };
}

export default function AdminDashboardPage() {
  const [adminData, setAdminData] = useState<AdminDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAdminDashboardData();
        setAdminData(data);
      } catch {
        setError('Could not load admin data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <section className="page-shell">
      <div className="wrapper space-y-8">
        <div className="section-header">
          <div className="section-copy">
            <p className="eyebrow">Admin workspace</p>
            <h1 className="h2-bold mt-2">Dashboard</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6b7280]">
              Monitor participation, active programming, and gallery moderation.
            </p>
          </div>
        </div>

        {isLoading && <div className="surface p-10 text-center text-sm text-[#6b7280]">Loading admin dashboard...</div>}
        {error && <div className="surface p-10 text-center text-sm text-red-600">{error}</div>}
        {!isLoading && !error && adminData && (
          <div className="space-y-6">
            <StatsCards stats={adminData.stats} />
            <ModerationQueue initialApprovals={adminData.moderationQueue.pendingApprovals} />
          </div>
        )}
      </div>
    </section>
  );
}
