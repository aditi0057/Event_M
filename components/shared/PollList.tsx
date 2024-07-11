
import { useEffect, useState } from 'react';

interface Poll {
  question: string;
  options: string[];
  votes: number[];
}

interface PollListProps {
  polls: Poll[];
  onVote: (pollIndex: number, optionIndex: number) => void;
  onDeletePoll: (pollIndex: number) => void;
}

const PollList: React.FC<PollListProps> = ({ polls, onVote, onDeletePoll }) => {
  const [votedPolls, setVotedPolls] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    const savedVotes = localStorage.getItem('votedPolls');
    if (savedVotes) {
      setVotedPolls(JSON.parse(savedVotes));
    }
  }, []);

  const handleVote = (pollIndex: number, optionIndex: number) => {
    if (votedPolls[pollIndex] !== optionIndex) {
      const newVotedPolls = { ...votedPolls, [pollIndex]: optionIndex };
      setVotedPolls(newVotedPolls);
      localStorage.setItem('votedPolls', JSON.stringify(newVotedPolls));
      onVote(pollIndex, optionIndex);
    }
  };

  return (
    <div className="mt-6">
      {polls.map((poll, pollIndex) => (
        <div key={pollIndex} className="bg-white p-6 rounded-lg shadow-lg mb-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold mb-2">{poll.question}</h3>
            <button
              onClick={() => onDeletePoll(pollIndex)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Delete Poll
            </button>
          </div>
          {poll.options.map((option, optionIndex) => (
            <button
              key={optionIndex}
              onClick={() => handleVote(pollIndex, optionIndex)}
              className={`block text-left bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2 w-full ${votedPolls[pollIndex] === optionIndex ? 'bg-green-500' : 'bg-blue-500'}`}
            >
              {option} ({poll.votes[optionIndex]} votes)
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default PollList;
