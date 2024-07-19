// 'use client';


// import { useState } from 'react';
// import CreatePoll from './CreatePoll';
// import PollList from './PollList';

// interface Poll {
//   question: string;
//   options: string[];
//   votes: number[];
// }

// const PollPage: React.FC = () => {
//   const [polls, setPolls] = useState<Poll[]>([]);

//   const handleCreatePoll = (poll: { question: string; options: string[] }) => {
//     setPolls([...polls, { ...poll, votes: Array(poll.options.length).fill(0) }]);
//   };

//   const handleVote = (pollIndex: number, optionIndex: number) => {
//     const newPolls = [...polls];
//     const currentVotes = newPolls[pollIndex].votes;

//     const votedPolls = localStorage.getItem('votedPolls');
//     const votedPollsObj = votedPolls ? JSON.parse(votedPolls) : {};

//     if (votedPollsObj[pollIndex] !== undefined && votedPollsObj[pollIndex] !== optionIndex) {
//       // User changes their vote
//       currentVotes[votedPollsObj[pollIndex]]--;
//       currentVotes[optionIndex]++;
//     } else if (votedPollsObj[pollIndex] === undefined) {
//       // User votes for the first time
//       currentVotes[optionIndex]++;
//     }

//     newPolls[pollIndex].votes = currentVotes;
//     setPolls(newPolls);
//   };

//   const handleDeletePoll = (pollIndex: number) => {
//     const newPolls = polls.filter((_, index) => index !== pollIndex);
//     setPolls(newPolls);
//   };

//   return (
//     <div className="container mx-auto p-6">
//     <h1 className="text-3xl font-bold mb-6">Active Polls </h1>
//     <div className="container mx-auto p-6">
//       <CreatePoll onCreate={handleCreatePoll} />
//       <PollList polls={polls} onVote={handleVote} onDeletePoll={handleDeletePoll} />
//     </div> 
//      </div>
//   );
// };

// export default PollPage;
'use client';
import { useState } from 'react';

const PollManager = () => {
  const [polls, setPolls] = useState([{ question: '', options: ['', ''], votes: [0, 0] }]);

  const handleChange = (e, pollIndex, optionIndex) => {
    const newPolls = [...polls];
    newPolls[pollIndex].options[optionIndex] = e.target.value;
    setPolls(newPolls);
  };

  const handleVote = (pollIndex, optionIndex) => {
    const newPolls = [...polls];
    newPolls[pollIndex].votes[optionIndex] += 1;
    setPolls(newPolls);
  };

  const handleQuestionChange = (e, pollIndex) => {
    const newPolls = [...polls];
    newPolls[pollIndex].question = e.target.value;
    setPolls(newPolls);
  };

  const addOption = (pollIndex) => {
    const newPolls = [...polls];
    newPolls[pollIndex].options.push('');
    newPolls[pollIndex].votes.push(0);
    setPolls(newPolls);
  };

  const addPoll = () => {
    setPolls([...polls, { question: '', options: ['', ''], votes: [0, 0] }]);
  };

  return (
    <div className="relative min-h-screen bg-white bg-dotted-pattern bg-contain py-8">
      <h1 className="text-3xl font-bold text-center text-purple-500 mb-8">Event Planner Polls</h1>
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Create Your Polls</h1>
        {polls.map((poll, pollIndex) => (
          <div key={pollIndex} className="mb-8">
            <input
              type="text"
              placeholder="Enter your poll question"
              value={poll.question}
              onChange={(e) => handleQuestionChange(e, pollIndex)}
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
            {poll.options.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center mb-2">
                <input
                  type="text"
                  placeholder={`Option ${optionIndex + 1}`}
                  value={option}
                  onChange={(e) => handleChange(e, pollIndex, optionIndex)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            ))}
            <button
              className="w-full py-2 mt-4 text-white bg-purple-500 rounded hover:bg-purple-600"
              onClick={() => addOption(pollIndex)}
            >
              Add Option
            </button>
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">{poll.question}</h2>
              {poll.options.map((option, optionIndex) => (
                <div key={optionIndex} className="mb-2">
                  <button
                    className="w-full py-2 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={() => handleVote(pollIndex, optionIndex)}
                  >
                    {option}
                  </button>
                  {poll.votes.reduce((acc, vote) => acc + vote, 0) > 0 && (
                    <div className="mt-1 text-gray-700">
                      {((poll.votes[optionIndex] / poll.votes.reduce((acc, vote) => acc + vote, 0)) * 100).toFixed(1)}%
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        <button
          className="fixed right-8 bottom-8 py-2 px-4 text-white bg-purple-500 rounded-full hover:bg-purple-600 shadow-lg"
          onClick={addPoll}
        >
          Add Poll
        </button>
      </div>
    </div>
  );
};

export default PollManager;
