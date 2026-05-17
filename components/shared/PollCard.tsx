'use client';

import { useState } from 'react';
import { voteOnPoll } from '@/services/api';
import { XCircle } from 'lucide-react';

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
}

const PollCard = ({ poll: initialPoll }: { poll: Poll }) => {
  const [poll, setPoll] = useState(initialPoll);
  const [hasVoted, setHasVoted] = useState(initialPoll.userHasVoted);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPollActive = new Date() < new Date(poll.end_time);

  const handleVote = async (optionIndex: number) => {
    if (hasVoted || !isPollActive || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      await voteOnPoll(poll._id, optionIndex);
      setHasVoted(true);

      const newResults = poll.results.map((result, index) =>
        index === optionIndex ? { ...result, count: result.count + 1 } : result
      );
      setPoll({ ...poll, results: newResults, totalVotes: poll.totalVotes + 1 });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <article className="surface p-5">
      <div className="flex flex-col gap-2 border-b border-[#e8ecef] pb-4 sm:flex-row sm:items-start sm:justify-between">
        <h3 className="max-w-3xl text-lg font-semibold leading-7 text-[#1f2933]">{poll.question}</h3>
        <span className="w-fit bg-[#eef1f4] px-3 py-1 text-xs font-semibold text-[#667085]">
          {poll.totalVotes} votes
        </span>
      </div>

      <div className="mt-5 space-y-3">
        {!hasVoted && isPollActive && poll.options.map((option, index) => (
          <button
            key={option}
            onClick={() => handleVote(index)}
            disabled={isLoading}
            className="w-full border border-[#d8d0c4] bg-white px-4 py-3 text-left text-sm font-medium text-[#1f2933] transition hover:border-[#1f2933] hover:bg-[#f9fafb] disabled:cursor-not-allowed disabled:bg-[#eef1f4]"
          >
            {option}
          </button>
        ))}

        {(hasVoted || !isPollActive) && poll.results.map((result) => {
          const percentage = poll.totalVotes > 0 ? (result.count / poll.totalVotes) * 100 : 0;
          return (
            <div key={result.option}>
              <div className="mb-2 flex justify-between gap-4 text-sm">
                <p className="font-medium text-[#1f2933]">{result.option}</p>
                <p className="text-[#6b7280]">{result.count} ({percentage.toFixed(0)}%)</p>
              </div>
              <div className="h-2 w-full bg-[#e8ecef]">
                <div
                  className="h-2 bg-[#214f3a] transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {isLoading && <p className="mt-4 text-sm text-[#6b7280]">Submitting your vote...</p>}
      {error && <p className="mt-4 flex items-center gap-2 text-sm text-red-600"><XCircle size={18} /> {error}</p>}
    </article>
  );
};

export default PollCard;
