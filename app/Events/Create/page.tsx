"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { createEvent } from "@/services/api"
import { useAuth } from "@/context/AuthContent"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { FileUpload } from "@/components/ui/file-upload"
import { useToast } from "@/components/ui/toast"

const categoryOptions = ["Festival", "Birthday", "Work", "Sports", "Other"].map((value) => ({ label: value, value }))

export default function CreateEventPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, isLoading: authLoading } = useAuth()
  const [data, setData] = useState({ title: "", description: "", date: "", time: "", type: "Work", hostName: "", location: "", imageUrl: "", visibility: "All company" })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const required = useMemo(() => ["title", "description", "date", "time", "type", "hostName", "location"], [])

  useEffect(() => {
    if (!authLoading && user?.role !== "admin") {
      toast("You don't have permission to create events.", "error")
      router.replace("/Events")
    }
  }, [authLoading, router, toast, user])

  const setField = (field: string, value: string) => {
    setData((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: "" }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors: Record<string, string> = {}
    required.forEach((field) => { if (!data[field as keyof typeof data]) nextErrors[field] = "This field is required" })
    if (Object.keys(nextErrors).length) { setErrors(nextErrors); return }

    setIsLoading(true)
    try {
      await createEvent({ ...data, date: `${data.date}T${data.time}` })
      toast("Event created successfully.", "success")
      router.push("/Events")
    } catch (error: any) {
      toast(error.message || "Could not create event.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="page-shell">
      <div className="wrapper max-w-3xl space-y-8 py-10">
        <div className="section-header">
          <div>
            <p className="eyebrow">Admin publishing</p>
            <h1 className="mt-2 text-3xl font-semibold">Create Event</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-text-secondary)]">Add timing, ownership, location, visibility, and optional imagery.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="surface grid gap-5 p-6">
          <Input label="Title" name="title" value={data.title} onChange={(e) => setField("title", e.target.value)} error={errors.title} />
          <div className="grid gap-5 sm:grid-cols-2">
            <Select label="Category" value={data.type} onChange={(value) => setField("type", value)} options={categoryOptions} error={errors.type} />
            <Input label="Host Name" name="hostName" value={data.hostName} onChange={(e) => setField("hostName", e.target.value)} error={errors.hostName} />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <DatePicker label="Date" name="date" value={data.date} onChange={(e) => setField("date", e.target.value)} error={errors.date} />
            <Input label="Time" name="time" type="time" value={data.time} onChange={(e) => setField("time", e.target.value)} error={errors.time} />
          </div>
          <Input label="Location" name="location" placeholder="Conference Room A or Zoom link" value={data.location} onChange={(e) => setField("location", e.target.value)} error={errors.location} />
          <Input label="Cover image URL" name="imageUrl" placeholder="https://..." value={data.imageUrl} onChange={(e) => setField("imageUrl", e.target.value)} helperText="Drag-and-drop upload preview is available below; paste the hosted URL here for now." />
          <FileUpload accept="image/*" onUpload={(files) => files[0] && setField("imageUrl", URL.createObjectURL(files[0]))} />
          <Textarea label="Description" name="description" value={data.description} onChange={(e) => setField("description", e.target.value)} error={errors.description} charLimit={500} />
          <Select label="Visibility" value={data.visibility} onChange={(value) => setField("visibility", value)} options={[{ label: "All company", value: "All company" }, { label: "Select departments", value: "Select departments" }]} />
          <div className="flex justify-end gap-3 border-t border-[var(--color-border)] pt-5">
            <Button type="button" variant="secondary" onClick={() => router.push("/Events")}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>{isLoading ? "Creating..." : "Create Event"}</Button>
          </div>
        </form>
      </div>
    </section>
  )
}
