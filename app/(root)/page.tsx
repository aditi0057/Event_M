"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CalendarDays, Vote } from "lucide-react"
import { Button } from "@/components/ui/button"
import EventCard from "@/components/shared/EventCard"
import { Avatar } from "@/components/ui/avatar"
import { EmptyState } from "@/components/ui/empty-state"
import { Badge } from "@/components/ui/badge"
import { EventCardSkeleton, Skeleton } from "@/components/ui/skeleton"
import { fetchAnnouncements, fetchCelebrations, fetchEvents, fetchPolls } from "@/services/api"
import { useAuth } from "@/context/AuthContent"

export default function Home() {
  const [events, setEvents] = useState<any[]>([])
  const [polls, setPolls] = useState<any[]>([])
  const [celebrations, setCelebrations] = useState<any[]>([])
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    Promise.all([
      fetchEvents("?sort=oldest&limit=3").catch(() => []),
      fetchPolls().catch(() => []),
      fetchCelebrations().catch(() => ({ birthdays: [], anniversaries: [] })),
      user ? fetchAnnouncements().catch(() => []) : Promise.resolve([]),
    ]).then(([eventData, pollData, celebrationData, announcementData]) => {
      setEvents(eventData.slice(0, 3))
      setPolls(pollData.filter((poll: any) => poll.isActive !== false && new Date(poll.end_time) > new Date()).slice(0, 2))
      setCelebrations([...(celebrationData.birthdays || []).map((user: any) => ({ ...user, kind: "Birthday" })), ...(celebrationData.anniversaries || []).map((user: any) => ({ ...user, kind: "Work anniversary" }))].slice(0, 10))
      setAnnouncements((announcementData.docs || announcementData || []).filter((item: any) => !item.read).slice(0, 3))
    }).finally(() => setLoading(false))
  }, [user])

  const celebrationText = (item: any) => {
    const source = item.kind === "Birthday" ? item.dateOfBirth : item.workJoiningDate
    const date = new Date(source)
    const today = new Date()
    const next = new Date(today.getFullYear(), date.getMonth(), date.getDate())
    if (next < today) next.setFullYear(today.getFullYear() + 1)
    const days = Math.max(0, Math.ceil((+next - +today) / 86400000))
    if (item.kind === "Birthday") return days === 0 ? "Birthday today!" : days === 1 ? "Birthday tomorrow!" : `Birthday in ${days} days`
    const years = Math.max(1, next.getFullYear() - new Date(source).getFullYear())
    return days === 0 ? `${years}-year anniversary today!` : days === 1 ? `${years}-year anniversary tomorrow!` : `${years}-year anniversary in ${days} days`
  }

  return (
    <div className="page-shell">
      <section data-hero className="hero-premium relative flex min-h-[calc(100vh-var(--navbar-height))] max-h-[680px] items-center overflow-hidden text-white">
        <div className="absolute inset-0 before:absolute before:inset-0 before:content-['']" />
        <svg className="absolute right-[8vw] top-1/2 hidden h-80 w-80 -translate-y-1/2 text-[rgba(108,99,255,0.15)] lg:block" viewBox="0 0 320 320" fill="none" aria-hidden="true">
          <path d="M82 96L158 62L240 112L210 216L114 238L82 96Z" stroke="currentColor" strokeWidth="2" />
          <path d="M158 62L114 238M240 112L82 96M210 216L158 62" stroke="currentColor" strokeWidth="1" opacity=".55" />
          {[["82","96"],["158","62"],["240","112"],["210","216"],["114","238"]].map(([cx, cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="16" fill="currentColor" />)}
        </svg>
        <div className="wrapper relative z-10 py-16">
          <div className="max-w-[760px]">
            <h1 className="max-w-[720px] text-[clamp(28px,7vw,48px)] font-semibold leading-[1.05] tracking-[-0.02em] md:text-[clamp(32px,5vw,52px)] lg:text-[clamp(36px,4.5vw,64px)]">
              Your team's moments,<br />beautifully organized.
            </h1>
            <p className="mt-5 max-w-[480px] text-[clamp(14px,1.5vw,17px)] leading-[1.75] text-white/55">
              Events, birthdays, polls, and memories — all in one refined workspace built for teams.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild className="h-12 rounded-lg border-0 bg-white px-6 text-sm font-medium text-[#0A0A14] transition hover:-translate-y-px hover:bg-white hover:shadow-[0_10px_24px_rgba(0,0,0,0.18)] max-sm:w-full">
                <Link href="/Events">Browse Events</Link>
              </Button>
              <Button asChild variant="outline" className="h-12 rounded-lg border-white/25 bg-transparent px-6 text-sm font-medium text-white transition hover:-translate-y-px hover:bg-white/10 hover:shadow-[0_10px_24px_rgba(0,0,0,0.18)] max-sm:w-full">
                <Link href="/Calendar">View Calendar</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-surface-0)]">
        <div className="wrapper space-y-12 py-14">
          <div>
            <div className="mb-5 flex items-end justify-between gap-4">
              <div><p className="eyebrow">What's happening</p><h2 className="mt-2 text-2xl font-semibold">Celebrating Soon</h2></div>
            </div>
            {celebrations.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {celebrations.map((user) => (
                  <div key={`${user._id}-${user.kind}`} className="flex min-w-[260px] items-center gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-card-bg)] p-4">
                    <Avatar src={user.avatar} name={user.fullname} className="h-12 w-12" />
                    <div>
                      <h3 className="text-sm font-semibold">{user.fullname}</h3>
                      <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{celebrationText(user)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-[var(--color-text-secondary)]">No celebrations in the next 2 weeks</p>}
          </div>

          {user && announcements.length > 0 && (
            <div>
              <div className="mb-5 flex items-center justify-between gap-4">
                <div><p className="eyebrow">Announcements</p><h2 className="mt-2 text-2xl font-semibold">Latest from Admin</h2></div>
                <Link href="/notifications" className="text-sm font-semibold text-[var(--color-accent)]">See all announcements -&gt;</Link>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {announcements.map((announcement) => {
                  const priority = announcement.priority || "Normal"
                  const tone = priority === "Urgent" ? "border-[var(--color-danger)]" : priority === "High" ? "border-[var(--color-warning)]" : "border-[var(--color-accent)]"
                  return (
                    <article key={announcement._id} className={`surface border-l-4 ${tone} p-4`}>
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <Badge color={priority === "Urgent" ? "danger" : priority === "High" ? "warning" : "info"}>{priority}</Badge>
                        <span className="text-xs text-[var(--color-text-secondary)]">{announcement.createdAt ? new Date(announcement.createdAt).toLocaleString() : "Just now"}</span>
                      </div>
                      <p className="text-sm leading-6 text-[var(--color-text-primary)]">{announcement.message || announcement.body}</p>
                      <p className="mt-3 text-xs font-semibold text-[var(--color-text-secondary)]">From: {announcement.sender?.fullname || "Admin"}</p>
                    </article>
                  )
                })}
              </div>
            </div>
          )}

          <div>
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold">Upcoming Events</h2>
              <Link href="/Events" className="text-sm font-semibold text-[var(--color-accent)]">View all &rarr;</Link>
            </div>
            {loading ? <div className="grid-fit-320"><EventCardSkeleton /><EventCardSkeleton /><EventCardSkeleton /></div> : events.length > 0 ? <div className="grid-fit-320">{events.map((event) => <EventCard key={event._id} event={event} />)}</div> : <EmptyState icon={<CalendarDays />} title="No events yet. Be the first to create one!" action={{ label: "+ New Event", href: "/Events/Create" }} />}
          </div>

          <div>
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold">Polls closing soon</h2>
              <Link href="/Poll" className="text-sm font-semibold text-[var(--color-accent)]">See all &rarr;</Link>
            </div>
            {loading ? <div className="space-y-3"><Skeleton height={72} /><Skeleton height={72} /></div> : polls.length > 0 ? (
              <div className="space-y-3">
                {polls.map((poll) => (
                  <div key={poll._id} className="surface flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{poll.question}</p>
                      <div className="mt-2 flex items-center gap-2"><Badge color="info">{poll.tab || "Others"}</Badge><span className="text-xs text-[var(--color-text-secondary)]">{poll.totalVotes || 0} {(poll.totalVotes || 0) === 1 ? "vote" : "votes"}</span></div>
                    </div>
                    <Button asChild variant="secondary" size="sm"><Link href="/Poll">Vote →</Link></Button>
                  </div>
                ))}
              </div>
            ) : <EmptyState icon={<Vote />} title="No active polls" description="Team polls will appear here when published." />}
          </div>
        </div>
      </section>
    </div>
  )
}
