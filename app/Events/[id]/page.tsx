"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { CalendarPlus, Check, Copy, MapPin, Save, Users, X } from "lucide-react"
import { deleteEvent, fetchEventById, rsvpEvent, updateEvent } from "@/services/api"
import { useAuth } from "@/context/AuthContent"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarGroup } from "@/components/ui/avatar"
import { EmptyState, ErrorState } from "@/components/ui/empty-state"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/toast"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export default function EventDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rsvp, setRsvp] = useState<string>("")
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ title: "", date: "", type: "Other", location: "", description: "", imageUrl: "" })

  const load = () => {
    setLoading(true)
    setError(null)
    fetchEventById(id).then((data) => {
      setEvent(data)
      setForm({
        title: data.title || "",
        date: data.date ? new Date(data.date).toISOString().slice(0, 16) : "",
        type: data.type || "Other",
        location: data.location || "",
        description: data.description || "",
        imageUrl: data.imageUrl || "",
      })
      const own = data.rsvps?.find((item: any) => (item.user?._id || item.user)?.toString() === user?._id)
      if (own?.status) setRsvp(own.status)
    }).catch((err) => setError(err.message || "Failed to load event details.")).finally(() => setLoading(false))
  }
  useEffect(() => { if (id) load() }, [id, user?._id])

  const downloadIcs = () => {
    if (!event) return
    const start = new Date(event.date).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
    const body = ["BEGIN:VCALENDAR", "VERSION:2.0", "BEGIN:VEVENT", `SUMMARY:${event.title}`, `DTSTART:${start}`, `DESCRIPTION:${event.description || ""}`, `LOCATION:${event.location || ""}`, "END:VEVENT", "END:VCALENDAR"].join("\n")
    const url = URL.createObjectURL(new Blob([body], { type: "text/calendar" }))
    const link = document.createElement("a")
    link.href = url
    link.download = `${event.title}.ics`
    link.click()
    URL.revokeObjectURL(url)
  }

  const share = async () => {
    await navigator.clipboard.writeText(window.location.href)
    toast("Link copied!", "success")
  }

  const chooseRsvp = async (status: "going" | "maybe" | "not_going") => {
    setRsvp(status)
    try { await rsvpEvent(id, status); toast("RSVP confirmed.", "success") } catch { toast("Saved locally. Server RSVP endpoint is unavailable.", "warning") }
  }

  const confirmDelete = async () => {
    try {
      await deleteEvent(id)
      toast("Event deleted.", "success")
      router.push("/Events")
    } catch (error: any) {
      toast(error.message || "Could not delete event.", "error")
    }
  }

  const cancelEdit = () => {
    setForm({
      title: event.title || "",
      date: event.date ? new Date(event.date).toISOString().slice(0, 16) : "",
      type: event.type || "Other",
      location: event.location || "",
      description: event.description || "",
      imageUrl: event.imageUrl || "",
    })
    setEditing(false)
  }

  const saveEdit = async (submitEvent: React.FormEvent<HTMLFormElement>) => {
    submitEvent.preventDefault()
    if (!form.title.trim() || !form.date) {
      toast("Event title and date are required.", "error")
      return
    }
    setSaving(true)
    try {
      const payload = { ...form, date: new Date(form.date).toISOString() }
      const updated = await updateEvent(id, payload)
      setEvent(updated)
      setEditing(false)
      toast("Event updated.", "success")
      router.refresh()
    } catch (error: any) {
      toast(error.message || "Could not update event.", "error")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <section className="page-shell"><div className="wrapper space-y-5"><Skeleton height={360} /><Skeleton height={240} /></div></section>
  if (error) return <section className="page-shell"><div className="wrapper"><ErrorState message={error} onRetry={load} /></div></section>
  if (!event) return <section className="page-shell"><div className="wrapper"><EmptyState title="Event not found" /></div></section>

  const eventDate = new Date(event.date)
  const canManageEvent = user?.role === "admin"

  return (
    <section className="page-shell">
      <div className="relative h-[200px] overflow-hidden bg-[linear-gradient(135deg,var(--color-accent-light),var(--color-surface-2))] md:h-[400px]">
        {event.imageUrl && <img src={event.imageUrl} alt={event.title} className="h-full w-full object-cover" />}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/65 to-transparent" />
      </div>
      <div className="wrapper grid gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_35%]">
        <aside className="h-fit space-y-4 lg:sticky lg:top-24 lg:order-2">
          <div className="surface p-5">
            <h2 className="text-lg font-semibold">Are you going?</h2>
            <div className="mt-4 grid gap-2">
              <Button variant={rsvp === "going" ? "primary" : "secondary"} onClick={() => chooseRsvp("going")}><Check className="mr-2 h-4 w-4" /> Going</Button>
              <Button variant={rsvp === "maybe" ? "primary" : "secondary"} onClick={() => chooseRsvp("maybe")}>? Maybe</Button>
              <Button variant={rsvp === "not_going" ? "danger" : "secondary"} onClick={() => chooseRsvp("not_going")}><X className="mr-2 h-4 w-4" /> Can't make it</Button>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs text-[var(--color-text-secondary)]">
              <span><strong className="block text-base text-[var(--color-text-primary)]">{event.rsvpCounts?.going || 0}</strong>Going</span>
              <span><strong className="block text-base text-[var(--color-text-primary)]">{event.rsvpCounts?.maybe || 0}</strong>Maybe</span>
              <span><strong className="block text-base text-[var(--color-text-primary)]">{event.rsvpCounts?.not_going || 0}</strong>No</span>
            </div>
          </div>
          <Button variant="secondary" className="w-full" onClick={downloadIcs}><CalendarPlus className="mr-2 h-4 w-4" /> Add to calendar</Button>
          <Button variant="secondary" className="w-full" onClick={share}><Copy className="mr-2 h-4 w-4" /> Share</Button>
          {canManageEvent && <div className="surface grid gap-2 p-4"><Button variant="secondary" onClick={() => setEditing(true)}>Edit Event</Button><Button variant="danger" onClick={() => setConfirmOpen(true)}>Delete Event</Button></div>}
        </aside>
        {editing ? (
          <form onSubmit={saveEdit} className="surface grid gap-5 p-6">
            <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">Edit Event</h1>
            <Input label="Event title" value={form.title} onChange={(e) => setForm((current) => ({ ...current, title: e.target.value }))} required />
            <Input label="Date and time" type="datetime-local" value={form.date} onChange={(e) => setForm((current) => ({ ...current, date: e.target.value }))} required />
            <Select label="Category" value={form.type} onChange={(value) => setForm((current) => ({ ...current, type: value }))} options={["Festival", "Birthday", "Work", "Sports", "Other"].map((value) => ({ label: value, value }))} />
            <Input label="Location / venue" value={form.location} onChange={(e) => setForm((current) => ({ ...current, location: e.target.value }))} />
            <Input label="Cover image URL" value={form.imageUrl} onChange={(e) => setForm((current) => ({ ...current, imageUrl: e.target.value }))} />
            <Textarea label="About this event" value={form.description} onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))} />
            <div className="flex flex-col-reverse gap-3 border-t border-[var(--color-border)] pt-5 sm:flex-row sm:justify-end">
              <Button type="button" variant="secondary" onClick={cancelEdit}>Cancel</Button>
              <Button type="submit" disabled={saving}><Save className="mr-2 h-4 w-4" /> {saving ? "Saving..." : "Save Changes"}</Button>
            </div>
          </form>
        ) : <article className="space-y-8">
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <Badge color={event.type}>{event.type}</Badge>
              <span className="text-sm font-medium text-[var(--color-text-secondary)]">{eventDate.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" })} at {eventDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
            </div>
            <h1 className="text-4xl font-semibold leading-tight text-[var(--color-text-primary)]">{event.title}</h1>
            <div className="mt-5 flex items-center gap-3 text-sm text-[var(--color-text-secondary)]">
              <Avatar src={event.host?.avatar} name={event.host?.fullname || event.hostName} />
              <span>Hosted by <strong className="font-semibold text-[var(--color-text-primary)]">{event.host?.fullname || event.hostName || "Host to be confirmed"}</strong></span>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
              <MapPin className="h-4 w-4" />
              {event.location?.startsWith("http") ? <a className="text-[var(--color-accent)]" href={event.location}>{event.location}</a> : <span>{event.location || "Location to be announced"}</span>}
            </div>
          </div>

          <section className="surface p-6">
            <h2 className="text-xl font-semibold">About this event</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[var(--color-text-secondary)]">{event.description || "No description provided."}</p>
          </section>

          <section className="surface p-6">
            <div className="mb-4 flex items-center gap-2"><Users className="h-5 w-5" /><h2 className="text-xl font-semibold">Who's coming</h2></div>
            <AvatarGroup users={event.attendees || []} max={8} />
            <p className="mt-3 text-sm text-[var(--color-text-secondary)]">{event.attendees?.length || 0} people attending</p>
          </section>
        </article>}
      </div>
      <ConfirmDialog open={confirmOpen} title="Delete event" description={`This will permanently delete "${event.title}" and cannot be undone.`} dangerous onCancel={() => setConfirmOpen(false)} onConfirm={confirmDelete} />
    </section>
  )
}
