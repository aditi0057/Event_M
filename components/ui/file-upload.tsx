"use client"

import { useRef, useState } from "react"
import { Upload } from "lucide-react"

export function FileUpload({ multiple = false, accept = "image/*", maxFiles = 1, onUpload, preview = true }: { multiple?: boolean; accept?: string; maxFiles?: number; onUpload: (files: File[]) => void; preview?: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<File[]>([])
  const commit = (incoming: FileList | File[]) => {
    const next = Array.from(incoming).slice(0, maxFiles)
    setFiles(next)
    onUpload(next)
  }
  return (
    <div className="grid gap-3">
      <button type="button" onClick={() => inputRef.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); commit(event.dataTransfer.files) }} className="flex min-h-32 flex-col items-center justify-center gap-3 rounded-[var(--radius-md)] border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface-1)] p-6 text-center text-sm text-[var(--color-text-secondary)] focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]">
        <Upload className="h-5 w-5 text-[var(--color-accent)]" />
        <span>Drag files here or click to upload</span>
      </button>
      <input ref={inputRef} type="file" multiple={multiple} accept={accept} className="hidden" onChange={(event) => event.target.files && commit(event.target.files)} />
      {preview && files.length > 0 && <div className="grid grid-cols-5 gap-2">{files.map((file) => <img key={file.name} src={URL.createObjectURL(file)} alt={file.name} className="aspect-square rounded-[var(--radius-sm)] object-cover" />)}</div>}
    </div>
  )
}
