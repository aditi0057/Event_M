'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContent';
import { createPoll } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

const CreatePollPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [question, setQuestion] = useState('');
  const [tab, setTab] = useState<'Venue' | 'Schedule' | 'Others'>('Venue');
  const [options, setOptions] = useState(['', '']);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (user && user.role !== 'admin') {
    router.push('/Poll');
    return null;
  }

  const handleAddOption = () => setOptions([...options, '']);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) return;
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await createPoll({
        question,
        tab,
        options,
        start_time: startTime,
        end_time: endTime,
      });
      router.push('/Poll');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="page-shell">
      <div className="wrapper max-w-4xl space-y-8">
        <div className="section-header">
          <div>
            <p className="eyebrow">Admin publishing</p>
            <h1 className="h2-bold mt-2">Create Poll</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6b7280]">
              Create a time-bound decision point for event planning and team preferences.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="surface grid gap-6 p-6">
          <div className="grid gap-2">
            <label htmlFor="question" className="text-sm font-semibold text-[#374151]">Poll Question</label>
            <Input id="question" name="question" value={question} onChange={(e) => setQuestion(e.target.value)} required />
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div className="grid gap-2">
              <label htmlFor="tab" className="text-sm font-semibold text-[#374151]">Category</label>
              <select
                id="tab"
                name="tab"
                value={tab}
                onChange={(e) => setTab(e.target.value as any)}
                className="h-11 border border-[#cfd6dd] bg-white px-3 text-sm text-[#1f2933] focus:outline-none focus:ring-2 focus:ring-[#1f2933]"
              >
                <option value="Venue">Venue</option>
                <option value="Schedule">Schedule</option>
                <option value="Others">Others</option>
              </select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="startTime" className="text-sm font-semibold text-[#374151]">Voting Starts</label>
              <Input id="startTime" name="startTime" type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <label htmlFor="endTime" className="text-sm font-semibold text-[#374151]">Voting Ends</label>
              <Input id="endTime" name="endTime" type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
            </div>
          </div>

          <div>
            <label className="mb-3 block text-sm font-semibold text-[#374151]">Options</label>
            <div className="space-y-3">
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    required
                  />
                  {options.length > 2 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveOption(index)} aria-label="Remove option">
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button type="button" variant="outline" onClick={handleAddOption} className="mt-4">
              Add Option
            </Button>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-3 border-t border-[#e8ecef] pt-5">
            <Button type="button" variant="outline" onClick={() => router.push('/Poll')}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>{isLoading ? 'Creating...' : 'Create Poll'}</Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CreatePollPage;
