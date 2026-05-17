'use client';

import { useState, useEffect } from 'react';
import { uploadImage, fetchEvents } from '@/services/api';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface Event {
  _id: string;
  title: string;
}

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (newImage: any) => void;
}

const UploadModal = ({ isOpen, onClose, onUploadSuccess }: UploadModalProps) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const loadEvents = async () => {
        try {
          // fetchEvents now returns the array directly
          const eventsData = await fetchEvents(); 
          setEvents(eventsData); 
          if (eventsData.length > 0) {
            setSelectedEvent(eventsData[0]._id);
          }
        } catch (err) {
          console.error("Failed to fetch events for modal", err);
          setError("Could not load events. Please try again.");
        }
      };
      loadEvents();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent || !selectedFile) {
      setError('Please select an event and a file.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('event_id', selectedEvent);
    formData.append('image', selectedFile);

    try {
      const newImage = await uploadImage(formData);
      onUploadSuccess(newImage);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Upload failed.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="surface relative w-full max-w-md p-6">
        <button onClick={onClose} className="absolute right-4 top-4 text-[#6b7280] hover:text-[#1f2933]">
          <X size={22} />
        </button>
        <div className="mb-6">
          <p className="eyebrow">Gallery submission</p>
          <h2 className="mt-2 text-xl font-semibold text-[#1f2933]">Upload Photo</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="event" className="mb-2 block text-sm font-semibold text-[#374151]">Select Event</label>
            <select
              id="event"
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="h-11 w-full border border-[#cfd6dd] bg-white px-3 text-sm text-[#1f2933] focus:outline-none focus:ring-2 focus:ring-[#1f2933]"
            >
              {/* This will now work correctly */}
              {events.map(event => (
                <option key={event._id} value={event._id}>{event.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="file" className="mb-2 block text-sm font-semibold text-[#374151]">Choose Photo</label>
            <input
              id="file"
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
              className="w-full text-sm text-[#6b7280] file:mr-4 file:border-0 file:bg-[#1f2933] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#111827]"
              required
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Uploading...' : 'Upload'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;

