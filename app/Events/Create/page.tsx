'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContent';
import { createEvent } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const CreateEventPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    date: '',
    type: '',
    hostName: '',
    imageUrl: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (user && user.role !== 'admin') {
    router.push('/Events');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await createEvent(eventData);
      router.push('/Events');
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
            <h1 className="h2-bold mt-2">Create Event</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6b7280]">
              Add a polished event entry with clear timing, ownership, and optional imagery.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="surface grid gap-6 p-6">
          <div className="grid gap-2">
            <label htmlFor="title" className="text-sm font-semibold text-[#374151]">Event Title</label>
            <Input id="title" name="title" value={eventData.title} onChange={handleChange} required />
          </div>

          <div className="grid gap-2">
            <label htmlFor="description" className="text-sm font-semibold text-[#374151]">Description</label>
            <Textarea id="description" name="description" value={eventData.description} onChange={handleChange} />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="grid gap-2">
              <label htmlFor="type" className="text-sm font-semibold text-[#374151]">Category</label>
              <Input id="type" name="type" placeholder="Team Building, Birthday" value={eventData.type} onChange={handleChange} required />
            </div>
            <div className="grid gap-2">
              <label htmlFor="date" className="text-sm font-semibold text-[#374151]">Date & Time</label>
              <Input id="date" name="date" type="datetime-local" value={eventData.date} onChange={handleChange} required />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="grid gap-2">
              <label htmlFor="hostName" className="text-sm font-semibold text-[#374151]">Host Name</label>
              <Input id="hostName" name="hostName" value={eventData.hostName} onChange={handleChange} placeholder="Aditi Sharma" required />
            </div>
            <div className="grid gap-2">
              <label htmlFor="image" className="text-sm font-semibold text-[#374151]">Image URL</label>
              <Input id="image" name="imageUrl" value={eventData.imageUrl} onChange={handleChange} placeholder="https://..." />
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-3 border-t border-[#e8ecef] pt-5">
            <Button type="button" variant="outline" onClick={() => router.push('/Events')}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>{isLoading ? 'Creating...' : 'Create Event'}</Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CreateEventPage;
