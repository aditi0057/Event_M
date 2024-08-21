
// 'use client';
// import { useState } from 'react';

// const PollManager = () => {
//   const [activeTab, setActiveTab] = useState('Create Polls');
//   const [activeSubTab, setActiveSubTab] = useState('Venue');
//   const [polls, setPolls] = useState({
//     Venue: [],
//     Schedule: [],
//     Others: []
//   });

//   const [newPoll, setNewPoll] = useState({
//     question: '',
//     options: ['', ''],
//     startTime: '',
//     endTime: '',
//     votes: []
//   });

//   const [alertMessage, setAlertMessage] = useState(''); // State for alert message

//   const handleChange = (e, tab, pollIndex, optionIndex) => {
//     const newPolls = { ...polls };

//     if (newPolls[tab] && newPolls[tab][pollIndex]) {
//       const updatedPoll = { ...newPolls[tab][pollIndex] };
//       updatedPoll.options[optionIndex] = e.target.value; // Update option text

//       // Ensure options are unique
//       const uniqueOptions = [...new Set(updatedPoll.options)];
//       if (uniqueOptions.length === updatedPoll.options.length) {
//         newPolls[tab][pollIndex] = updatedPoll;
//         setPolls(newPolls);
//       } else {
//         console.error("Duplicate options found.");
//       }
//     } else {
//       console.error("Poll or options not found.");
//     }
//   };

//   const handleVote = (tab, pollIndex, optionIndex) => {
//     const currentPoll = polls[tab][pollIndex];
//     const now = new Date();
//     const startTime = new Date(currentPoll.startTime);
//     const endTime = new Date(currentPoll.endTime);

//     if (now >= startTime && now <= endTime) {
//       const newPolls = { ...polls };
//       newPolls[tab][pollIndex].votes[optionIndex] += 1;
//       setPolls(newPolls);
//     } else {
//       alert("Voting is not allowed outside the poll's active period.");
//     }
//   };

//   const handleQuestionChange = (e) => {
//     setNewPoll({ ...newPoll, question: e.target.value });
//   };

//   const handleTimeChange = (e, timeType) => {
//     setNewPoll({ ...newPoll, [timeType]: e.target.value });
//   };

//   const addOption = () => {
//     setNewPoll(prevPoll => {
//       const newOptions = [...prevPoll.options, ''];
//       const newVotes = [...prevPoll.votes, 0];

//       // Ensure options are unique
//       const uniqueOptions = [...new Set(newOptions)];
//       return {
//         ...prevPoll,
//         options: uniqueOptions,
//         votes: newVotes.slice(0, uniqueOptions.length)  // Adjust votes array length
//       };
//     });
//   };

//   const addPoll = (tab) => {
//     // Validate poll input
//     if (!newPoll.question.trim()) {
//       setAlertMessage('Error: Question is required.');
//     } else if (!newPoll.startTime) {
//       setAlertMessage('Error: Start time is required.');
//     } else if (!newPoll.endTime) {
//       setAlertMessage('Error: End time is required.');
//     } else if (newPoll.options.length < 2 || newPoll.options.some(option => !option.trim())) {
//       setAlertMessage('Error: At least two options are required.');
//     } else {
//       // Check for duplicate options
//       const uniqueOptions = [...new Set(newPoll.options)];
//       if (uniqueOptions.length !== newPoll.options.length) {
//         setAlertMessage('Error: Duplicate options are not allowed.');
//       } else {
//         const newPolls = { ...polls };
//         newPolls[tab].push({ ...newPoll, options: uniqueOptions, votes: new Array(uniqueOptions.length).fill(0) });
//         setPolls(newPolls);
//         setNewPoll({
//           question: '',
//           options: ['', ''],
//           startTime: '',
//           endTime: '',
//           votes: []  // Reset votes for the next poll creation
//         });
//         setAlertMessage(''); // Clear alert message on successful poll addition
//       }
//     }
//   };

//   const isPollActive = (tab, pollIndex) => {
//     const now = new Date();
//     const poll = polls[tab][pollIndex];
//     return poll && now >= new Date(poll.startTime) && now <= new Date(poll.endTime);
//   };

//   // Helper function to calculate percentage
//   const getPercentage = (votes, optionIndex) => {
//     const totalVotes = votes.reduce((acc, vote) => acc + vote, 0);
//     return totalVotes > 0 ? (votes[optionIndex] / totalVotes) * 100 : 0;
//   };

//   return (
//     <div className="relative min-h-screen bg-white bg-dotted-pattern bg-contain py-8">
//       <h1 className="text-3xl font-bold text-center text-purple-500 mb-8">Event Planner Polls</h1>
//       <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
//         <div className="flex justify-between mb-8 space-x-4">
//           {['Create Polls', 'Active Polls'].map((tab) => (
//             <button
//               key={tab}
//               className={`w-full py-2 text-white rounded ${activeTab === tab ? 'bg-purple-500' : 'bg-gray-300'} hover:bg-purple-600`}
//               onClick={() => setActiveTab(tab)}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>

//         {activeTab === 'Create Polls' && (
//           <div>
//             <div className="flex justify-between mb-8 space-x-4">
//               {['Venue', 'Schedule', 'Others'].map((tab) => (
//                 <button
//                   key={tab}
//                   className={`w-full py-2 text-white rounded ${activeSubTab === tab ? 'bg-purple-500' : 'bg-gray-300'} hover:bg-purple-600`}
//                   onClick={() => setActiveSubTab(tab)}
//                 >
//                   {tab}
//                 </button>
//               ))}
//             </div>
//             <h1 className="text-2xl font-bold mb-4">Create Poll - {activeSubTab}</h1>
//             <div className="mb-8">
//               <input
//                 type="text"
//                 placeholder="Enter your poll question"
//                 value={newPoll.question}
//                 onChange={handleQuestionChange}
//                 className="w-full p-4 mb-4 border border-gray-300 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//               />
//               {alertMessage && (
//                 <p className="text-red-500 mb-4">{alertMessage}</p>
//               )}
//               <div className="grid grid-cols-2 gap-6 mb-4">
//                 <div className="flex flex-col">
//                   <label htmlFor="start-time" className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
//                   <input
//                     id="start-time"
//                     type="datetime-local"
//                     value={newPoll.startTime}
//                     onChange={(e) => handleTimeChange(e, 'startTime')}
//                     className="p-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   />
//                 </div>
//                 <div className="flex flex-col">
//                   <label htmlFor="end-time" className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
//                   <input
//                     id="end-time"
//                     type="datetime-local"
//                     value={newPoll.endTime}
//                     onChange={(e) => handleTimeChange(e, 'endTime')}
//                     className="p-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   />
//                 </div>
//               </div>
//               {newPoll.options.map((option, index) => (
//                 <div key={index} className="flex items-center mb-2">
//                   <input
//                     type="text"
//                     placeholder={`Option ${index + 1}`}
//                     value={option}
//                     onChange={(e) => {
//                       const updatedOptions = [...newPoll.options];
//                       updatedOptions[index] = e.target.value;
//                       setNewPoll(prevPoll => ({
//                         ...prevPoll,
//                         options: updatedOptions
//                       }));
//                     }}
//                     className="w-full p-4 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   />
//                 </div>
//               ))}
//             <div className="flex space-x-4">
//   <button
//     className="flex-1 py-2 text-white bg-purple-500 rounded-lg shadow-lg hover:bg-purple-600"
//     onClick={addOption}
//   >
//     Add Option
//   </button>
//   <button
//     className="flex-1 py-2 text-white bg-purple-500 rounded-lg shadow-lg hover:bg-purple-600"
//     onClick={() => addPoll(activeSubTab)}
//   >
//     Add Poll
//   </button>
// </div>

//             </div>
//           </div>
//         )}

//         {activeTab === 'Active Polls' && (
//           <div>
//             <div className="flex justify-between mb-8 space-x-4">
//               {['Venue', 'Schedule', 'Others'].map((tab) => (
//                 <button
//                   key={tab}
//                   className={`w-full py-2 text-white rounded ${activeSubTab === tab ? 'bg-purple-500' : 'bg-gray-300'} hover:bg-purple-600`}
//                   onClick={() => setActiveSubTab(tab)}
//                 >
//                   {tab}
//                 </button>
//               ))}
//             </div>
//             <h1 className="text-2xl font-bold mb-4">Active Polls - {activeSubTab}</h1>
//             {polls[activeSubTab].map((poll, pollIndex) => (
//               <div key={pollIndex} className="mb-8 p-4 border border-gray-300 rounded-lg shadow-md bg-white">
//                 <input
//                   type="text"
//                   placeholder="Enter your poll question"
//                   value={poll.question}
//                   readOnly
//                   className="w-full p-4 mb-4 border border-gray-300 rounded-lg shadow-lg bg-gray-100"
//                 />
//                 <div className="grid grid-cols-2 gap-6 mb-4">
//                   <div className="flex flex-col">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
//                     <input
//                       type="text"
//                       value={new Date(poll.startTime).toLocaleString()}
//                       readOnly
//                       className="p-3 border border-gray-300 rounded-lg shadow-md bg-gray-100"
//                     />
//                   </div>
//                   <div className="flex flex-col">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
//                     <input
//                       type="text"
//                       value={new Date(poll.endTime).toLocaleString()}
//                       readOnly
//                       className="p-3 border border-gray-300 rounded-lg shadow-md bg-gray-100"
//                     />
//                   </div>
//                 </div>
//                 {poll.options.map((option, optionIndex) => {
//                   const percentage = getPercentage(poll.votes, optionIndex);
//                   const color = `hsl(${(percentage * 1.2) % 360}, 70%, 50%)`;
//                   return (
//                     <div key={optionIndex} className="mb-4">
//                       <button
//                         className="w-full py-2 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200"
//                         onClick={() => handleVote(activeSubTab, pollIndex, optionIndex)}
//                       >
//                         {option}
//                       </button>
//                       {poll.votes.reduce((acc, vote) => acc + vote, 0) > 0 && (
//                         <div className="mt-2 flex items-center">
//                           <div className="w-full h-2 bg-gray-300 rounded">
//                             <div
//                               className="h-full rounded"
//                               style={{ width: `${percentage}%`, backgroundColor: color }}
//                             />
//                           </div>
//                           <span className="ml-2 text-gray-700">
//                             {percentage.toFixed(1)}%
//                           </span>
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PollManager;


'use client';
import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance'; // Import your Axios instance

const PollManager = () => {
  const [activeTab, setActiveTab] = useState('Create Polls');
  const [activeSubTab, setActiveSubTab] = useState('Venue');
  const [polls, setPolls] = useState({
    Venue: [],
    Schedule: [],
    Others: []
  });
  const [newPoll, setNewPoll] = useState({
    question: '',
    options: ['', ''],
    startTime: '',
    endTime: '',
    votes: []
  });
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    // Fetch polls from the backend when the component mounts
    const fetchPolls = async () => {
      try {
        const response = await axiosInstance.get('/api/polls');
        setPolls(response.data);
      } catch (error) {
        console.error('Error fetching polls:', error);
      }
    };
    fetchPolls();
  }, []);

  const handleChange = (e, tab, pollIndex, optionIndex) => {
    const newPolls = { ...polls };

    if (newPolls[tab] && newPolls[tab][pollIndex]) {
      const updatedPoll = { ...newPolls[tab][pollIndex] };
      updatedPoll.options[optionIndex] = e.target.value;

      const uniqueOptions = [...new Set(updatedPoll.options)];
      if (uniqueOptions.length === updatedPoll.options.length) {
        newPolls[tab][pollIndex] = updatedPoll;
        setPolls(newPolls);
      } else {
        console.error("Duplicate options found.");
      }
    } else {
      console.error("Poll or options not found.");
    }
  };

  const handleVote = async (tab, pollIndex, optionIndex) => {
    const currentPoll = polls[tab][pollIndex];
    const now = new Date();
    const startTime = new Date(currentPoll.startTime);
    const endTime = new Date(currentPoll.endTime);

    if (now >= startTime && now <= endTime) {
      try {
        await axiosInstance.post('/api/vote', {
          pollId: currentPoll._id,
          optionIndex
        });
        const newPolls = { ...polls };
        newPolls[tab][pollIndex].votes[optionIndex] += 1;
        setPolls(newPolls);
      } catch (error) {
        console.error('Error submitting vote:', error);
      }
    } else {
      alert("Voting is not allowed outside the poll's active period.");
    }
  };

  const handleQuestionChange = (e) => {
    setNewPoll({ ...newPoll, question: e.target.value });
  };

  const handleTimeChange = (e, timeType) => {
    setNewPoll({ ...newPoll, [timeType]: e.target.value });
  };

  const addOption = () => {
    setNewPoll(prevPoll => {
      const newOptions = [...prevPoll.options, ''];
      const newVotes = [...prevPoll.votes];

      const uniqueOptions = [...new Set(newOptions)];
      return {
        ...prevPoll,
        options: uniqueOptions,
        votes: newVotes.slice(0, uniqueOptions.length)
      };
    });
  };

  const addPoll = async (tab) => {
    if (!newPoll.question.trim()) {
      setAlertMessage('Error: Question is required.');
    } else if (!newPoll.startTime) {
      setAlertMessage('Error: Start time is required.');
    } else if (!newPoll.endTime) {
      setAlertMessage('Error: End time is required.');
    } else if (newPoll.options.length < 2 || newPoll.options.some(option => !option.trim())) {
      setAlertMessage('Error: At least two options are required.');
    } else {
      const uniqueOptions = [...new Set(newPoll.options)];
      if (uniqueOptions.length !== newPoll.options.length) {
        setAlertMessage('Error: Duplicate options are not allowed.');
      } else {
        try {
          await axiosInstance.post('/api/polls', {
            ...newPoll,
            options: uniqueOptions
          });
          setNewPoll({
            question: '',
            options: ['', ''],
            startTime: '',
            endTime: '',
            votes: []
          });
          setAlertMessage('');
          // Fetch updated polls
          const response = await axiosInstance.get('/api/polls');
          setPolls(response.data);
        } catch (error) {
          console.error('Error adding poll:', error);
          setAlertMessage('Error adding poll.');
        }
      }
    }
  };

  const isPollActive = (tab, pollIndex) => {
    const now = new Date();
    const poll = polls[tab][pollIndex];
    return poll && now >= new Date(poll.startTime) && now <= new Date(poll.endTime);
  };

  const getPercentage = (votes, optionIndex) => {
    const totalVotes = votes.reduce((acc, vote) => acc + vote, 0);
    return totalVotes > 0 ? (votes[optionIndex] / totalVotes) * 100 : 0;
  };

  return (
    <div className="relative min-h-screen bg-white bg-dotted-pattern bg-contain py-8">
      <h1 className="text-3xl font-bold text-center text-purple-500 mb-8">Event Planner Polls</h1>
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
        <div className="flex justify-between mb-8 space-x-4">
          {['Create Polls', 'Active Polls'].map((tab) => (
            <button
              key={tab}
              className={`w-full py-2 text-white rounded ${activeTab === tab ? 'bg-purple-500' : 'bg-gray-300'} hover:bg-purple-600`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'Create Polls' && (
          <div>
            <div className="flex justify-between mb-8 space-x-4">
              {['Venue', 'Schedule', 'Others'].map((tab) => (
                <button
                  key={tab}
                  className={`w-full py-2 text-white rounded ${activeSubTab === tab ? 'bg-purple-500' : 'bg-gray-300'} hover:bg-purple-600`}
                  onClick={() => setActiveSubTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
            <h1 className="text-2xl font-bold mb-4">Create Poll - {activeSubTab}</h1>
            <div className="mb-8">
              <input
                type="text"
                placeholder="Enter your poll question"
                value={newPoll.question}
                onChange={handleQuestionChange}
                className="w-full p-4 mb-4 border border-gray-300 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {alertMessage && (
                <p className="text-red-500 mb-4">{alertMessage}</p>
              )}
              <div className="grid grid-cols-2 gap-6 mb-4">
                <div className="flex flex-col">
                  <label htmlFor="start-time" className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                  <input
                    id="start-time"
                    type="datetime-local"
                    value={newPoll.startTime}
                    onChange={(e) => handleTimeChange(e, 'startTime')}
                    className="p-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="end-time" className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                  <input
                    id="end-time"
                    type="datetime-local"
                    value={newPoll.endTime}
                    onChange={(e) => handleTimeChange(e, 'endTime')}
                    className="p-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              {newPoll.options.map((option, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => {
                      const updatedOptions = [...newPoll.options];
                      updatedOptions[index] = e.target.value;
                      setNewPoll(prevPoll => ({
                        ...prevPoll,
                        options: updatedOptions
                      }));
                    }}
                    className="w-full p-4 border border-gray-300 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              ))}
              <button
                onClick={addOption}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg shadow-md hover:bg-purple-600"
              >
                Add Option
              </button>
              <button
                onClick={() => addPoll(activeSubTab)}
                className="ml-4 px-4 py-2 bg-purple-500 text-white rounded-lg shadow-md hover:bg-purple-600"
              >
                Add Poll
              </button>
            </div>
          </div>
        )}

        {activeTab === 'Active Polls' && (
          <div>
            {polls[activeSubTab].length > 0 ? (
              polls[activeSubTab].map((poll, index) => (
                <div key={poll._id} className="border border-gray-300 rounded-lg p-4 mb-4">
                  <h2 className="text-xl font-bold mb-2">{poll.question}</h2>
                  {poll.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="mb-2">
                      <button
                        onClick={() => handleVote(activeSubTab, index, optionIndex)}
                        className="w-full py-2 text-white bg-purple-500 rounded-lg hover:bg-purple-600"
                        disabled={!isPollActive(activeSubTab, index)}
                      >
                        {option} ({getPercentage(poll.votes, optionIndex).toFixed(2)}%)
                      </button>
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <p>No active polls available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PollManager;
