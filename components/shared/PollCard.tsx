'use client';

import { useState } from 'react';
import { changePollVote, voteOnPoll } from '@/services/api';
import { Check, Pencil, Trash2, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/ui/progress-bar';
import { useToast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';

interface PollResult {
  option: string;
  count: number;
}

interface Poll {
  _id: string;
  question: string;
  options: string[];
  end_time: string;
  userHasVoted: boolean;
  results: PollResult[];
  totalVotes: number;
  tab?: string;
  createdBy?: { fullname?: string };
  createdAt?: string;
  userVoteIndex?: number;
  isActive?: boolean;
}

const PollCard = ({ poll: initialPoll, isAdmin = false, onEdit, onDelete }: { poll: Poll; isAdmin?: boolean; onEdit?: (poll: any) => void; onDelete?: (poll: any) => void }) => {
  const [poll, setPoll] = useState(initialPoll);
  const [hasVoted, setHasVoted] = useState(initialPoll.userHasVoted);
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(initialPoll.userVoteIndex);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const isPollActive = poll.isActive !== false && (!poll.end_time || new Date(poll.end_time) > new Date());

  const handleVote = async (optionIndex: number) => {
    if (!isPollActive || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      hasVoted ? await changePollVote(poll._id, optionIndex) : await voteOnPoll(poll._id, optionIndex);
      setHasVoted(true);
      setSelectedIndex(optionIndex);

      const newResults = poll.results.map((result, index) => {
        if (index === optionIndex) return { ...result, count: result.count + 1 };
        if (index === selectedIndex) return { ...result, count: Math.max(0, result.count - 1) };
        return result;
      });
      setPoll({ ...poll, results: newResults, totalVotes: hasVoted ? poll.totalVotes : poll.totalVotes + 1 });
      toast(hasVoted ? 'Vote updated.' : 'Vote cast.', 'success');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <article className="surface p-5">
      <div className="flex flex-col gap-3 border-b border-[var(--color-border)] pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="max-w-3xl text-lg font-semibold leading-7 text-[var(--color-text-primary)]">{poll.question}</h3>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[var(--color-text-secondary)]">
            <Badge color="info">{poll.tab || 'Others'}</Badge>
            <span>Created by {poll.createdBy?.fullname || 'Admin'}</span>
            <span>Voting closes {new Date(poll.end_time).toLocaleDateString()}</span>
            {!isPollActive && <Badge color="warning">Voting closed</Badge>}
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <span className="w-fit rounded-full bg-[var(--color-surface-2)] px-3 py-1 text-xs font-semibold text-[var(--color-text-secondary)]">
            {poll.totalVotes} {poll.totalVotes === 1 ? "vote" : "votes"}
          </span>
          {isAdmin && (
            <div className="flex gap-2">
              <Button type="button" size="sm" variant="secondary" onClick={() => onEdit?.(poll)}><Pencil className="mr-1 h-3.5 w-3.5" /> Edit</Button>
              <Button type="button" size="sm" variant="danger" onClick={() => onDelete?.(poll)}><Trash2 className="mr-1 h-3.5 w-3.5" /> Delete</Button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {poll.options.map((option, index) => {
          const result = poll.results[index] || { option, count: 0 };
          const percentage = poll.totalVotes > 0 ? Math.min(100, Math.max(0, (result.count / poll.totalVotes) * 100)) : 0;
          const selected = selectedIndex === index;
          return (
          <button
            key={option}
            onClick={() => handleVote(index)}
            disabled={isLoading || !isPollActive}
            className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-card-bg)] px-4 py-3 text-left text-sm font-medium text-[var(--color-text-primary)] transition hover:border-[var(--color-border-strong)] hover:bg-[var(--color-bg-hover)] disabled:cursor-not-allowed disabled:opacity-80"
          >
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="flex items-center gap-2">{selected && <Check className="h-4 w-4 text-[var(--color-accent)]" />}{option}</span>
              <span className="text-[var(--color-text-secondary)]">{percentage.toFixed(0)}%</span>
            </div>
            {(hasVoted || !isPollActive) && <ProgressBar value={result.count} max={poll.totalVotes || 1} animated />}
          </button>
          )
        })}
      </div>

      {isLoading && <p className="mt-4 text-sm text-[var(--color-text-secondary)]">Submitting your vote...</p>}
      {error && <p className="mt-4 flex items-center gap-2 text-sm text-red-600"><XCircle size={18} /> {error}</p>}
    </article>
  );
};

export default PollCard;
