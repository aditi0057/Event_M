'use client';

import Image from 'next/image';
import { Expand, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContent';

interface ImageItem {
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

interface ImageCardProps {
  image: ImageItem;
  onDelete: (imageId: string) => void;
  onView: (imageUrl: string) => void;
}

const ImageCard = ({ image, onDelete, onView }: ImageCardProps) => {
  const { user } = useAuth();
  const canDelete = user?.role === 'admin' || user?._id === image.uploaded_by._id;

  return (
    <figure className="group relative aspect-[4/5] overflow-hidden border border-[#d9dde3] bg-[#e8ecef]">
      <Image
        src={image.image_url}
        alt={`Image for ${image.event_id?.title || 'event'}`}
        fill
        className="object-cover transition duration-500 group-hover:scale-[1.03]"
        sizes="(max-width: 768px) 100vw, 25vw"
      />
      <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/72 via-black/10 to-black/20 p-4 opacity-0 transition duration-200 group-hover:opacity-100">
        <div className="flex justify-end gap-2">
          <button
            onClick={() => onView(image.image_url)}
            className="bg-white/90 p-2 text-[#1f2933] transition hover:bg-white"
            aria-label="View image"
          >
            <Expand size={18} />
          </button>
          {canDelete && (
            <button
              onClick={() => onDelete(image._id)}
              className="bg-[#8f2d2d] p-2 text-white transition hover:bg-[#742424]"
              aria-label="Delete image"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>

        <figcaption className="text-white">
          <p className="text-sm font-semibold">{image.event_id?.title || 'General'}</p>
          <p className="mt-1 text-xs text-white/75">by {image.uploaded_by.fullname}</p>
        </figcaption>
      </div>
    </figure>
  );
};

export default ImageCard;
