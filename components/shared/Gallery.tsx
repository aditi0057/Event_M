'use client';
import { useState } from 'react';
import Image from 'next/image';


interface Event {
  date: string;
  images: string[];
}

const events: Event[] = [
  {
    date: '2024-07-01',
    images: [
      '/assets/images/event1/img1.avif',
      '/assets/images/event1/img2.avif',
      '/assets/images/event1/img3.avif',
    ],
  },
  {
    date: '2024-07-02',
    images: [
      '/assets/images/event2/img1.avif',
      '/assets/images/event2/img2.avif',
      '/assets/images/event2/img3.avif',
    ],
  },
  {
    date: '2024-07-03',
    images: [
      '/assets/images/event1/img1.avif',
      '/assets/images/event1/img2.avif',
      '/assets/images/event1/img3.avif',
      '/assets/images/event2/img1.avif',
    ],
  },
  {
    date: '2024-07-04',
    images: [
      '/assets/images/event2/img1.avif',
      '/assets/images/event2/img2.avif',
      '/assets/images/event2/img3.avif',
      '/assets/images/event1/img3.avif',
      '/assets/images/event2/img1.avif',
    ],
  },
  {
    date: '2024-07-05',
    images: [
      '/assets/images/event1/img1.avif',
      '/assets/images/event1/img2.avif',
      '/assets/images/event1/img3.avif',
      '/assets/images/event2/img1.avif',
      '/assets/images/event2/img2.avif',
      '/assets/images/event2/img3.avif',
    ],
  },
];

const Gallery: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Event Gallery</h1>
      <div className="flex flex-wrap -mx-2">
        <div className="w-full md:w-1/3 px-2">
          <ul className="space-y-4">
            {events.map((event, index) => (
              <li key={index}>
                <button
                  onClick={() => setSelectedEvent(event)}
                  className="block w-full bg-primary-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  {event.date}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-full md:w-2/3 px-2">
          {selectedEvent && (
            <div>
              <h2 className="text-2xl font-bold mb-4">
                Images from {selectedEvent.date}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {selectedEvent.images.map((image, index) => (
                  <div key={index} className="w-full h-48 relative">
                    <Image
                      src={image}
                      alt={`Event ${selectedEvent.date} Image ${index + 1}`}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
