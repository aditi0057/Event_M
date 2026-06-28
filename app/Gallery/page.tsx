"use client"

import { useEffect, useState } from "react"
import { Download, Heart, PlusCircle, X } from "lucide-react"
import { fetchGalleryAlbums, fetchGalleryImages, uploadImage } from "@/services/api"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { FileUpload } from "@/components/ui/file-upload"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { EmptyState, ErrorState } from "@/components/ui/empty-state"
import { GalleryItemSkeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/toast"
import { useAuth } from "@/context/AuthContent"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"
const assetBaseUrl = API_URL.replace(/\/api\/v1\/?$/, "")

const galleryImageUrl = (url?: string) => {
  if (!url) return "/assets/images/placeholder.png"
  if (url.startsWith("http://") || url.startsWith("https://")) return url
  return `${assetBaseUrl}${url.startsWith("/") ? url : `/${url}`}`
}

export default function GalleryPage() {
  const [images, setImages] = useState<any[]>([])
  const [albums, setAlbums] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [viewIndex, setViewIndex] = useState<number | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [caption, setCaption] = useState("")
  const [albumId, setAlbumId] = useState("")
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()

  const load = () => {
    setIsLoading(true)
    setError(null)
    Promise.all([fetchGalleryImages(), fetchGalleryAlbums().catch(() => [])])
      .then(([imageData, albumData]) => { setImages(Array.isArray(imageData) ? imageData : []); setAlbums(Array.isArray(albumData) ? albumData : []) })
      .catch((err) => setError(err.message || "Failed to load gallery."))
      .finally(() => setIsLoading(false))
  }
  useEffect(() => { load() }, [])
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setViewIndex(null)
      if (event.key === "ArrowRight" && viewIndex !== null && images.length > 0) setViewIndex((viewIndex + 1) % images.length)
      if (event.key === "ArrowLeft" && viewIndex !== null && images.length > 0) setViewIndex((viewIndex - 1 + images.length) % images.length)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [viewIndex, images.length])

  const viewed = viewIndex !== null ? images[viewIndex] : null

  const submitUpload = async () => {
    if (!selectedFiles.length) {
      toast("Choose at least one photo first.", "error")
      return
    }
    setUploading(true)
    try {
      const uploaded: any[] = []
      for (const file of selectedFiles) {
        const formData = new FormData()
        formData.append("file", file)
        if (caption.trim()) formData.append("caption", caption.trim())
        if (albumId) formData.append("albumId", albumId)
        const result = await uploadImage(formData)
        uploaded.push(result)
      }
      const approved = uploaded.filter((item) => item?.isApproved || item?.status === "approved")
      if (approved.length) setImages((current) => [...approved, ...current])
      setUploadOpen(false)
      setSelectedFiles([])
      setCaption("")
      setAlbumId("")
      toast(approved.length === uploaded.length ? "Photos added to the gallery." : "Your photos are pending admin approval.", "success")
    } catch (error: any) {
      toast(error.message || "Could not upload photos.", "error")
    } finally {
      setUploading(false)
    }
  }

  return (
    <section className="page-shell">
      <div className="wrapper space-y-8 py-10">
        <div className="section-header">
          <div className="section-copy">
            <p className="eyebrow">Gallery</p>
            <h1 className="mt-2 text-3xl font-semibold">Company Memories</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-text-secondary)]">Approved moments from team gatherings, celebrations, and internal programs.</p>
          </div>
          {user && <Button onClick={() => setUploadOpen(true)} size="lg" className="w-full md:w-auto"><PlusCircle className="mr-2 h-4 w-4" /> Upload Photo</Button>}
        </div>

        {albums.length > 0 && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {albums.map((album) => (
              <button key={album._id} className="surface p-4 text-left transition hover:scale-[1.02]">
                <p className="font-semibold">{album.name}</p>
                <p className="mt-1 line-clamp-2 text-sm text-[var(--color-text-secondary)]">{album.description || album.eventId?.title || "Album"}</p>
              </button>
            ))}
          </div>
        )}

        <h2 className="text-lg font-semibold">All Photos</h2>

        {isLoading && <div className="gallery-grid">{Array.from({ length: 9 }).map((_, i) => <div className="gallery-item" key={i}><GalleryItemSkeleton /></div>)}</div>}
        {error && <ErrorState message={error} onRetry={load} />}
        {!isLoading && !error && images.length > 0 && (
          <div className="gallery-grid">
            {images.map((image, index) => (
              <button key={image._id || `${image.image_url}-${index}`} onClick={() => setViewIndex(index)} className="gallery-item group relative w-full overflow-hidden rounded-[10px] bg-[var(--color-surface-2)] text-left focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]">
                <img src={galleryImageUrl(image.image_url)} alt={image.caption || image.event_id?.title || "Company gallery memory"} className="block w-full rounded-[10px] object-cover" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 rounded-b-[10px] bg-[linear-gradient(transparent,rgba(0,0,0,0.65))] p-3 opacity-0 transition duration-200 group-hover:opacity-100">
                  <div className="min-w-0 text-white">
                    <div className="flex items-center gap-2"><Avatar src={image.uploaded_by?.avatar} name={image.uploaded_by?.fullname} size="sm" /><span className="text-sm font-semibold">{image.uploaded_by?.fullname || "Team member"}</span></div>
                    <p className="mt-2 truncate text-xs text-white/75">{image.event_id?.title || "Company memory"}</p>
                  </div>
                  {(image.likes?.length || image.likes || 0) > 0 && <span className="shrink-0 text-xs text-white">♥ {image.likes?.length || image.likes}</span>}
                </div>
              </button>
            ))}
          </div>
        )}
        {!isLoading && !error && images.length === 0 && <EmptyState title="No photos yet. Upload the first memory!" action={user ? { label: "Upload Photo", onClick: () => setUploadOpen(true) } : undefined} />}
      </div>

      <Modal title="Upload Photos" open={uploadOpen} onClose={() => setUploadOpen(false)}>
        <div className="grid gap-5">
          <FileUpload multiple maxFiles={10} onUpload={setSelectedFiles} />
          <select value={albumId} onChange={(event) => setAlbumId(event.target.value)} className="h-11 rounded-[var(--radius-md)] border border-[var(--color-input-border)] bg-[var(--color-input-bg)] px-3 text-sm text-[var(--color-text-primary)]">
            <option value="">All Photos</option>
            {albums.map((album) => <option key={album._id} value={album._id}>{album.name}</option>)}
          </select>
          <input value={caption} onChange={(event) => setCaption(event.target.value)} className="h-11 rounded-[var(--radius-md)] border border-[var(--color-input-border)] bg-[var(--color-input-bg)] px-3 text-sm text-[var(--color-text-primary)]" placeholder="Caption (optional, 120 chars)" maxLength={120} />
          <Button onClick={submitUpload} disabled={uploading}>{uploading ? "Uploading..." : "Submit for approval"}</Button>
        </div>
      </Modal>

      {viewed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" onMouseDown={() => setViewIndex(null)}>
          <button className="absolute right-4 top-4 text-white" onClick={() => setViewIndex(null)}><X /></button>
          <div className="max-w-5xl" onMouseDown={(event) => event.stopPropagation()}>
            <img src={galleryImageUrl(viewed.image_url)} alt={viewed.caption || "Gallery photo"} className="max-h-[78vh] w-auto rounded-[var(--radius-md)] object-contain" />
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-white">
              <span>{viewed.uploaded_by?.fullname || "Team member"} · {viewed.event_id?.title || "Company memory"}</span>
              <div className="flex gap-2"><Button variant="secondary"><Heart className="mr-2 h-4 w-4" /> {viewed.likes?.length || viewed.likes || 0}</Button><Button variant="secondary"><Download className="mr-2 h-4 w-4" /> Download</Button></div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
