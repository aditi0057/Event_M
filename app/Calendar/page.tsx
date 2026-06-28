"use client"

import { useEffect, useMemo, useState } from "react"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import Link from "next/link"
import { fetchPersonalCalendarEvents } from "@/services/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarSkeleton } from "@/components/ui/skeleton"

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const categories = ["Festival", "Birthday", "Work", "Sports", "Other"]

export default function CalendarPage() {
  const today = new Date()
  const [month, setMonth] = useState(today.getMonth())
  const [year, setYear] = useState(today.getFullYear())
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [listView, setListView] = useState(false)
  const [popover, setPopover] = useState<any>(null)

  useEffect(() => {
    setLoading(true)
    fetchPersonalCalendarEvents(year, month + 1).then(setEvents).catch(() => setEvents([])).finally(() => setLoading(false))
  }, [month, year])

  const weeks = useMemo(() => {
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDay = new Date(year, month, 1).getDay()
    const days: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]
    while (days.length < 42) days.push(null)
    return Array.from({ length: 6 }, (_, i) => days.slice(i * 7, i * 7 + 7))
  }, [month, year])

  const eventsForDay = (day: number | null) => !day ? [] : events.filter((event) => {
    const date = new Date(event.date)
    return date.getFullYear() === year && date.getMonth() === month && date.getDate() === day
  })

  const shift = (direction: number) => {
    const next = new Date(year, month + direction, 1)
    setMonth(next.getMonth())
    setYear(next.getFullYear())
  }

  return (
    <section className="flex h-[calc(100vh-64px)] flex-col overflow-hidden bg-[var(--color-bg-page)]">
      <div className="mx-auto flex min-h-0 w-full max-w-[var(--content-width)] flex-1 flex-col gap-2 px-[clamp(12px,3vw,32px)] py-2">
        <div className="section-header max-h-[60px] shrink-0 overflow-hidden">
          <div className="section-copy"><p className="eyebrow">People calendar</p><h1 className="mt-1 text-2xl font-semibold md:text-3xl">Team Calendar</h1></div>
        </div>

        <div className="surface flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="shrink-0 flex flex-col gap-4 border-b border-[var(--color-border)] p-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center justify-between gap-3">
              <Button variant="secondary" size="icon" onClick={() => shift(-1)}><ChevronLeft className="h-4 w-4" /></Button>
              <h2 className="min-w-48 text-center text-xl font-semibold">{months[month]} {year}</h2>
              <Button variant="secondary" size="icon" onClick={() => shift(1)}><ChevronRight className="h-4 w-4" /></Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={() => { setMonth(today.getMonth()); setYear(today.getFullYear()) }}>Today</Button>
              <Button variant="secondary" onClick={() => setListView((value) => !value)}>{listView ? "Grid view" : "List view"}</Button>
            </div>
          </div>
          <div className="hidden shrink-0 flex-wrap gap-2 border-b border-[var(--color-border)] p-2 md:flex">{categories.map((category) => <Badge key={category} color={category}>{category}</Badge>)}</div>

          {loading ? <div className="min-h-0 flex-1 p-4"><CalendarSkeleton /></div> : listView ? (
            <div className="min-h-0 flex-1 divide-y divide-[var(--color-border)] overflow-y-auto">
              {events.length ? events.map((event) => <Link href={`/Events/${event._id || event.id}`} key={`${event.title}-${event.date}`} className="flex items-center justify-between gap-4 p-4 hover:bg-[var(--color-surface-1)]"><div><p className="font-semibold">{event.title}</p><p className="text-sm text-[var(--color-text-secondary)]">{new Date(event.date).toLocaleString()}</p></div><Badge color={event.type}>{event.type}</Badge></Link>) : <p className="p-8 text-center text-sm text-[var(--color-text-secondary)]">No events this month.</p>}
            </div>
          ) : (
            <div className="min-h-0 flex-1 overflow-hidden">
              <div className="flex h-full min-w-0 flex-col">
                <div className="grid shrink-0 grid-cols-7 bg-[var(--color-surface-1)] text-center text-[11px] font-semibold uppercase text-[var(--color-text-secondary)]">{daysOfWeek.map((day) => <div key={day} className="border-r border-[var(--color-border)] px-1 py-1.5 last:border-r-0"><span className="md:hidden">{day[0]}</span><span className="hidden md:inline">{day}</span></div>)}</div>
                <div className="grid min-h-0 flex-1 grid-cols-7 grid-rows-6">
                {weeks.flatMap((week, i) => week.map((day, index) => {
                  const dayEvents = eventsForDay(day)
                  return <div key={`${i}-${day || "blank"}-${index}`} className="min-h-0 overflow-hidden border-r border-t border-[var(--color-border)] bg-[var(--color-card-bg)] p-1 text-xs md:p-1">
                    <div className="flex items-center justify-between">{day && <span className="font-semibold">{day}</span>}{day && <Link href={`/Events/Create?date=${year}-${month + 1}-${day}`} className="opacity-0 hover:opacity-100"><Plus className="h-3 w-3" /></Link>}</div>
                    <div className="mt-1 hidden space-y-1 overflow-hidden md:block">{dayEvents.slice(0, 2).map((event) => <button key={`${event._id || event.id || event.title}-${event.date}`} onClick={() => setPopover(event)} title={`${event.title} ${new Date(event.date).toLocaleTimeString()}`} className="block w-full truncate rounded-full bg-[var(--color-accent-light)] px-1.5 py-0.5 text-left text-[10px] leading-4 text-[var(--color-accent)]">{event.title}</button>)}{dayEvents.length > 2 && <span className="block truncate text-[10px] text-[var(--color-text-secondary)]">+{dayEvents.length - 2} more</span>}</div>
                    <div className="mt-1 flex flex-wrap gap-0.5 md:hidden">{dayEvents.slice(0, 4).map((event) => <button key={`${event._id || event.id || event.title}-${event.date}-dot`} onClick={() => setPopover(event)} className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" title={event.title} />)}</div>
                  </div>
                }))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {popover && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={() => setPopover(null)}><div className="surface max-w-sm p-5" onClick={(event) => event.stopPropagation()}><Badge color={popover.type}>{popover.type}</Badge><h3 className="mt-3 text-xl font-semibold">{popover.title}</h3><p className="mt-2 text-sm text-[var(--color-text-secondary)]">{new Date(popover.date).toLocaleString()}</p><Button asChild className="mt-5"><Link href={`/Events/${popover._id || popover.id}`}>View full event &rarr;</Link></Button></div></div>}
    </section>
  )
}
