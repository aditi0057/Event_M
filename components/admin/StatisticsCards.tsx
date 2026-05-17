import { BarChart2, Calendar, Users } from 'lucide-react';

interface Stats {
  totalUsers: number;
  totalEvents: number;
  activePolls: number;
}

const StatCard = ({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) => (
  <div className="surface flex items-center gap-4 p-5">
    <div className="flex h-11 w-11 items-center justify-center bg-[#eef6f1] text-[#214f3a]">
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-[#6b7280]">{title}</p>
      <p className="mt-1 text-2xl font-semibold text-[#1f2933]">{value}</p>
    </div>
  </div>
);

export const StatsCards = ({ stats }: { stats: Stats }) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <StatCard title="Total Users" value={stats.totalUsers} icon={<Users size={22} />} />
      <StatCard title="Total Events" value={stats.totalEvents} icon={<Calendar size={22} />} />
      <StatCard title="Active Polls" value={stats.activePolls} icon={<BarChart2 size={22} />} />
    </div>
  );
};
