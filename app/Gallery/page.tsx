'use client';
import { useState } from 'react';
import Image from 'next/image';
import Modal from '@/components/shared/Model';

interface Event {
  date: string;
  name: string;
  images: (string | File)[];
}

const initialEvents: Event[] = [
  {
    date: '2024-07-01',
    name: 'Summer Bash',
    images: [
      '/assets/images/event1/img1.avif',
      '/assets/images/event1/img2.avif',
      '/assets/images/event1/img3.avif',
    ],
  },
  {
    date: '2024-07-02',
    name: 'Corporate Meet',
    images: [
      '/assets/images/event2/img1.avif',
      '/assets/images/event2/img2.avif',
      '/assets/images/event2/img3.avif',
    ],
  },
  {
    date: '2024-07-03',
    name: 'Family Reunion',
    images: [
      '/assets/images/event1/img1.avif',
      '/assets/images/event1/img2.avif',
      '/assets/images/event1/img3.avif',
      '/assets/images/event2/img1.avif',
    ],
  },
  {
    date: '2024-07-04',
    name: 'Birthday Party',
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
    name: 'Wedding Celebration',
    images: [
      '/assets/images/event1/img1.avif',
      '/assets/images/event1/img2.avif',
      '/assets/images/event1/img3.avif',
      '/assets/images/event2/img1.avif',
      '/assets/images/event2/img2.avif',
      '/assets/images/event2/img3.avif',
    ],
  },
  {
    date: '2024-07-04',
    name: 'Birthday Party',
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
    name: 'Wedding Celebration',
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
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [newEvent, setNewEvent] = useState({ date: '', name: '' });
  const [newImages, setNewImages] = useState<FileList | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; eventDate: string; imageIndex: number }>({
    isOpen: false,
    eventDate: '',
    imageIndex: -1,
  });

  const addNewEvent = () => {
    if (newEvent.date && newEvent.name) {
      setEvents([...events, { ...newEvent, images: [] }]);
      setNewEvent({ date: '', name: '' });
    }
  };

  const addImagesToEvent = (date: string, images: FileList | null) => {
    if (images) {
      setEvents(events.map(event =>
        event.date === date ? { ...event, images: [...event.images, ...Array.from(images)] } : event
      ));
      setNewImages(null);
    }
  };

  const removeImageFromEvent = (date: string, imageIndex: number) => {
    setEvents(events.map(event =>
      event.date === date
        ? { ...event, images: event.images.filter((_, index) => index !== imageIndex) }
        : event
    ));
    setConfirmDelete({ isOpen: false, eventDate: '', imageIndex: -1 });
  };

  const openModal = (image: string) => {
    setModalImage(image);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalImage(null);
  };

  const openDeleteConfirmation = (date: string, imageIndex: number) => {
    setConfirmDelete({ isOpen: true, eventDate: date, imageIndex });
  };

  const closeDeleteConfirmation = () => {
    setConfirmDelete({ isOpen: false, eventDate: '', imageIndex: -1 });
  };

  const handleDeleteImageConfirmed = () => {
    if (confirmDelete.eventDate !== '' && confirmDelete.imageIndex !== -1) {
      removeImageFromEvent(confirmDelete.eventDate, confirmDelete.imageIndex);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white bg-dotted-pattern bg-contain">
     <h1 className="text-4xl text-center font-extrabold mb-9 mt-7 text-transparent  bg-clip-text bg-gradient-to-r from-pink-500 via-blue-500 to-indigo-500 ">Event Gallery</h1>
     <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Add New Event</h2>
        <div className="flex gap-4 mb-4">
          <input
            type="date"
            value={newEvent.date}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
            className="px-4 py-2 border rounded-md w-48 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <input
            type="text"
            placeholder="Event name"
            value={newEvent.name}
            onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
            className="px-4 py-2 border rounded-md w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addNewEvent}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Add Event
          </button>
        </div>
      </div>
      <div className="flex flex-wrap -mx-2">
        <div className="w-full md:w-1/3 px-2">
          <ul className="space-y-4">
            {events.map((event, index) => (
              <li key={index}>
                <button
                  onClick={() => setSelectedEvent(event)}
                  className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                  {event.date} - {event.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-full md:w-2/3 px-2">
          {selectedEvent && (
            <div>
              <h2 className="text-xl font-bold mb-4">
                Images from {selectedEvent.date} - {selectedEvent.name}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {selectedEvent.images.map((image, index) => (
                  <div key={index} className="relative group w-full h-48">
                    <Image
                      src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                      alt={`Event ${selectedEvent.date} Image ${index + 1}`}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg cursor-pointer"
                      onClick={() => openModal(typeof image === 'string' ? image : URL.createObjectURL(image))}
                    />
                    <button
                      onClick={() => openDeleteConfirmation(selectedEvent.date, index)}
                      className="absolute top-2 right-2 bg-white text-red-500 rounded-full w-8 h-8 flex items-center justify-center"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
              <Modal isOpen={modalIsOpen} onClose={closeModal}>
                {modalImage && (
                  <Image
                    src={modalImage}
                    alt="Modal Image"
                    layout="responsive"
                    width={700}
                    height={1000}
                    className="rounded-lg"
                  />
                )}
              </Modal>
              <div className="mt-4 flex gap-4">
                <input
                  type="file"
                  multiple
                  onChange={(e) => setNewImages(e.target.files)}
                  className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => {
                    if (newImages) {
                      addImagesToEvent(selectedEvent.date, newImages);
                      setSelectedEvent({
                        ...selectedEvent,
                        images: [...selectedEvent.images, ...Array.from(newImages)],
                      });
                      (document.querySelector('input[type="file"]') as HTMLInputElement).value = '';
                    }
                  }}
                  className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  Add Images
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {confirmDelete.isOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-md shadow-lg max-w-md">
            <p              > Are you sure you want to delete this image?</p>
            <div className="flex justify-end mt-4 space-x-4">
              <button
                onClick={() => {
                  handleDeleteImageConfirmed();
                  closeDeleteConfirmation();
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                Delete
              </button>
              <button
                onClick={closeDeleteConfirmation}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;

