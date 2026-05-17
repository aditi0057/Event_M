'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContent';
import { fetchPolls } from '@/services/api';
import PollCard from '@/components/shared/PollCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';

interface PollResult {
  option: string;
  count: number;
}

interface Poll {
  _id: string;
  question: string;
  options: string[];
  end_time: string;
  tab: 'Venue' | 'Schedule' | 'Others';
  userHasVoted: boolean;
  results: PollResult[];
  totalVotes: number;
}

const tabs = ['Venue', 'Schedule', 'Others'] as const;

const PollsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>('Venue');
  const [polls, setPolls] = useState<Poll[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPolls = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const pollsData = await fetchPolls();
        setPolls(pollsData);
      } catch (err: any) {
        setError(err.message || 'Failed to load polls.');
      } finally {
        setIsLoading(false);
      }
    };
    loadPolls();
  }, []);

  const filteredPolls = polls.filter((poll) => poll.tab === activeTab);

  return (
    <section className="page-shell">
      <div className="wrapper space-y-8">
        <div className="section-header">
          <div className="section-copy">
            <p className="eyebrow">Team decisions</p>
            <h1 className="h2-bold mt-2">Community Polls</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6b7280]">
              Vote on event details with clear categories and live result visibility.
            </p>
          </div>
          {user?.role === 'admin' && (
            <Button asChild size="lg" className="w-full md:w-auto">
              <Link href="/Poll/Create">
                <Plus className="mr-2 h-4 w-4" />
                New Poll
              </Link>
            </Button>
          )}
        </div>

        <div className="flex w-full flex-wrap gap-1 border border-[#d9dde3] bg-white p-1 sm:w-fit">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-4 py-2 text-sm font-semibold transition sm:flex-none ${
                activeTab === tab
                  ? 'bg-[#1f2933] text-white'
                  : 'text-[#6b7280] hover:bg-[#eef1f4] hover:text-[#1f2933]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {isLoading && <div className="surface p-10 text-center text-sm text-[#6b7280]">Loading polls...</div>}
        {error && <div className="surface p-10 text-center text-sm text-red-600">{error}</div>}

        {!isLoading && !error && filteredPolls.length > 0 && (
          <div className="space-y-4">
            {filteredPolls.map((poll) => <PollCard key={poll._id} poll={poll} />)}
          </div>
        )}

        {!isLoading && !error && filteredPolls.length === 0 && (
          <div className="empty-state">
            <h3 className="text-lg font-semibold text-[#1f2933]">No active polls</h3>
            <p className="mt-2 text-sm">There are no active polls in {activeTab} right now.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default PollsPage;
