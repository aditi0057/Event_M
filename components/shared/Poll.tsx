'use client';


import { useState } from 'react';
import CreatePoll from './CreatePoll';
import PollList from './PollList';

interface Poll {
  question: string;
  options: string[];
  votes: number[];
}

const PollPage: React.FC = () => {
  const [polls, setPolls] = useState<Poll[]>([]);

  const handleCreatePoll = (poll: { question: string; options: string[] }) => {
    setPolls([...polls, { ...poll, votes: Array(poll.options.length).fill(0) }]);
  };

  const handleVote = (pollIndex: number, optionIndex: number) => {
    const newPolls = [...polls];
    const currentVotes = newPolls[pollIndex].votes;

    const votedPolls = localStorage.getItem('votedPolls');
    const votedPollsObj = votedPolls ? JSON.parse(votedPolls) : {};

    if (votedPollsObj[pollIndex] !== undefined && votedPollsObj[pollIndex] !== optionIndex) {
      currentVotes[votedPollsObj[pollIndex]]--;
      currentVotes[optionIndex]++;
    } else if (votedPollsObj[pollIndex] === undefined) {
      currentVotes[optionIndex]++;
    }

    newPolls[pollIndex].votes = currentVotes;
    setPolls(newPolls);
  };

  const handleDeletePoll = (pollIndex: number) => {
    const newPolls = polls.filter((_, index) => index !== pollIndex);
    setPolls(newPolls);
  };

  return (
    <div className="container mx-auto p-6">
      <CreatePoll onCreate={handleCreatePoll} />
      <PollList polls={polls} onVote={handleVote} onDeletePoll={handleDeletePoll} />
    </div>
  );
};

export default PollPage;