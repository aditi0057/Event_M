
import { useState, ChangeEvent, FormEvent } from 'react';

interface Poll {
  question: string;
  options: string[];
}

interface CreatePollProps {
  onCreate: (poll: Poll) => void;
}

const CreatePoll: React.FC<CreatePollProps> = ({ onCreate }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => setOptions([...options, '']);

  const deleteOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (options.filter(option => option.trim() !== '').length >= 2) {
      onCreate({ question, options: options.filter(option => option.trim() !== '') });
      setQuestion('');
      setOptions(['', '']);
    } else {
      alert('Please provide at least two options.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Create a New Poll</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Question
          </label>
          <input
            type="text"
            value={question}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setQuestion(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          {options.map((option, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                value={option}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleOptionChange(index, e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <button
                type="button"
                onClick={() => deleteOption(index)}
                className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Delete
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addOption}
            className="mt-2 bg-primary-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add Option
          </button>
        </div>
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Create Poll
        </button>
      </form>
    </div>
  );
};

export default CreatePoll;
