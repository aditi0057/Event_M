"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { CalendarX, Plus } from "lucide-react"
import { useAuth } from "@/context/AuthContent"
import { fetchEvents } from "@/services/api"
import EventCard from "@/components/shared/EventCard"
import { Button } from "@/components/ui/button"
import { EmptyState, ErrorState } from "@/components/ui/empty-state"
import { EventCardSkeleton } from "@/components/ui/skeleton"
import { Tabs } from "@/components/ui/tabs"
import { Select } from "@/components/ui/select"

const categories = ["All", "Festival", "Birthday", "Work", "Sports", "Other"]

export default function EventsPage() {
  const { user } = useAuth()
  const [events, setEvents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [category, setCategory] = useState("All")
  const [sort, setSort] = useState("oldest")

  const loadEvents = () => {
    setIsLoading(true)
    setError(null)
    fetchEvents(`?limit=12&sort=${sort}${category !== "All" ? `&category=${category}` : ""}`)
      .then(setEvents)
      .catch((err) => setError(err.message || "Failed to load events."))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => { loadEvents() }, [category, sort])

  const sortedEvents = useMemo(() => [...events].sort((a, b) => {
    if (sort === "alphabetical") return a.title.localeCompare(b.title)
    return sort === "newest" ? +new Date(b.date) - +new Date(a.date) : +new Date(a.date) - +new Date(b.date)
  }), [events, sort])

  return (
    <section className="page-shell">
      <div className="wrapper space-y-8 py-10">
        <div className="section-header">
          <div className="section-copy">
            <p className="eyebrow">Programming calendar</p>
            <h1 className="mt-2 text-3xl font-semibold">Upcoming Events</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-text-secondary)]">
              A curated view of planned celebrations, team moments, and internal gatherings.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <Tabs items={categories} activeTab={category} onChange={setCategory} />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Select value={sort} onChange={setSort} options={[
              { label: "Date: Oldest", value: "oldest" },
              { label: "Date: Newest", value: "newest" },
              { label: "Alphabetical", value: "alphabetical" },
            ]} />
            {user?.role === "admin" && (
              <Button asChild size="lg">
                <Link href="/Events/Create"><Plus className="mr-2 h-4 w-4" /> New Event</Link>
              </Button>
            )}
          </div>
        </div>

        {isLoading && <div className="grid-fit-320">{Array.from({ length: 6 }).map((_, i) => <EventCardSkeleton key={i} />)}</div>}
        {error && <ErrorState message={error} onRetry={loadEvents} />}
        {!isLoading && !error && sortedEvents.length > 0 && <div className="grid-fit-320">{sortedEvents.map((event) => <EventCard key={event._id} event={event} />)}</div>}
        {!isLoading && !error && sortedEvents.length === 0 && (
          <EmptyState icon={<CalendarX />} title="No events yet. Be the first to create one!" action={user?.role === "admin" ? { label: "+ New Event", href: "/Events/Create" } : undefined} />
        )}
      </div>
    </section>
  )
}
