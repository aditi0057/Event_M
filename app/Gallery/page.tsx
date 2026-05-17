'use client';

import { useEffect, useState } from 'react';
import { deleteImage, fetchGalleryImages } from '@/services/api';
import ImageCard from '@/components/shared/ImageCard';
import UploadModal from '@/components/shared/UploadModel';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface Image {
  _id: string;
  image_url: string;
  uploaded_by: {
    _id: string;
    fullname: string;
  };
  event_id: {
    title: string;
  };
}

const GalleryPage = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewedImage, setViewedImage] = useState<string | null>(null);

  useEffect(() => {
    const loadImages = async () => {
      setIsLoading(true);
      try {
        const imageData = await fetchGalleryImages();
        setImages(imageData);
      } catch (err: any) {
        setError(err.message || 'Failed to load gallery.');
      } finally {
        setIsLoading(false);
      }
    };
    loadImages();
  }, []);

  const handleUploadSuccess = (newImage: Image) => {
    setImages((prevImages) => [newImage, ...prevImages]);
  };

  const handleDelete = async (imageId: string) => {
    const originalImages = images;
    setImages((prevImages) => prevImages.filter((img) => img._id !== imageId));

    try {
      await deleteImage(imageId);
    } catch {
      setError('Failed to delete image. Please try again.');
      setImages(originalImages);
    }
  };

  return (
    <section className="page-shell">
      <div className="wrapper space-y-8">
        <div className="section-header">
          <div className="section-copy">
            <p className="eyebrow">Curated memories</p>
            <h1 className="h2-bold mt-2">Event Gallery</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6b7280]">
              Approved moments from team gatherings, celebrations, and internal programs.
            </p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} size="lg" className="w-full md:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" />
            Upload Photo
          </Button>
        </div>

        {isLoading && <div className="surface p-10 text-center text-sm text-[#6b7280]">Loading gallery...</div>}
        {error && <div className="surface p-10 text-center text-sm text-red-600">{error}</div>}

        {!isLoading && !error && images.length > 0 && (
          <div className="grid-fit-260">
            {images.map((image) => (
              <ImageCard
                key={image._id}
                image={image}
                onDelete={handleDelete}
                onView={setViewedImage}
              />
            ))}
          </div>
        )}

        {!isLoading && !error && images.length === 0 && (
          <div className="empty-state">
            <h3 className="text-lg font-semibold text-[#1f2933]">No photos yet</h3>
            <p className="mt-2 text-sm">Approved gallery uploads will appear here.</p>
          </div>
        )}
      </div>

      <UploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />

      {viewedImage && (
        <div
          onClick={() => setViewedImage(null)}
          className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center bg-black/88 p-4"
        >
          <img src={viewedImage} alt="Fullscreen view" className="max-h-full max-w-full" />
        </div>
      )}
    </section>
  );
};

export default GalleryPage;
