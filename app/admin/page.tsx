"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Megaphone, Settings, Users, CalendarDays, Vote, Images, Trash2 } from "lucide-react";
import { approveImageApi, closePoll, createAnnouncement, deleteEvent, deleteImage, deletePoll, fetchAdminStats, fetchAdminUsers, fetchAnnouncements, fetchEvents, fetchGalleryImages, fetchPolls, rejectImageApi, updateAdminUserRole, updateAdminUserStatus } from "@/services/api";
import { useAuth } from "@/context/AuthContent";
import { Button } from "@/components/ui/button";
import { EmptyState, ErrorState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

const nav = [{ label: "Overview", icon: CalendarDays }, { label: "Users", icon: Users }, { label: "Events", icon: CalendarDays }, { label: "Polls", icon: Vote }, { label: "Gallery moderation", icon: Images }, { label: "Announcements", icon: Megaphone }, { label: "Settings", icon: Settings }];

export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [section, setSection] = useState("Overview");
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any>({ docs: [], total: 0 });
  const [events, setEvents] = useState<any[]>([]);
  const [polls, setPolls] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [confirm, setConfirm] = useState<{ title: string; description: string; action: () => Promise<void> } | null>(null);
  const [announcement, setAnnouncement] = useState({ message: "", audience: "All users", priority: "Normal", scheduledAt: "" });

  const isAdmin = user?.role === "admin";

  const load = () => {
    setLoading(true);
    setError("");
    Promise.all([
      fetchAdminStats().catch(() => null),
      fetchAdminUsers(query ? `?q=${encodeURIComponent(query)}` : "").catch(() => ({ docs: [], total: 0 })),
      fetchEvents("?limit=50").catch(() => []),
      fetchPolls().catch(() => []),
      fetchGalleryImages().catch(() => []),
      fetchAnnouncements().then((data) => data.docs || data || []).catch(() => []),
    ]).then(([statsData, userData, eventData, pollData, galleryData, announcementData]) => {
      setStats(statsData);
      setUsers(userData);
      setEvents(eventData);
      setPolls(pollData);
      setGallery(galleryData);
      setAnnouncements(announcementData);
    }).catch((err) => setError(err.message || "Could not load admin data.")).finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!isLoading && user && !isAdmin) { toast("Access denied.", "error"); window.location.href = "/"; }
  }, [isLoading, isAdmin, user, toast]);
  useEffect(() => { if (isAdmin) load(); }, [isAdmin, query]);

  const statRows = useMemo(() => [
    ["Total Users", stats?.totalUsers || 0],
    ["Total Events", stats?.totalEvents || 0],
    ["Active Polls", stats?.activePolls || 0],
    ["Pending Gallery", stats?.pendingGallery || 0],
    ["This month's events", stats?.thisMonthEvents || 0],
  ], [stats]);

  const sendAnnouncement = async () => {
    if (announcement.message.trim().length < 10) return toast("Announcement must be at least 10 characters.", "error");
    try {
      await createAnnouncement({ body: announcement.message, sendTo: announcement.audience, priority: announcement.priority, scheduledFor: announcement.scheduledAt });
      toast("Announcement sent!", "success");
      setAnnouncement({ message: "", audience: "All users", priority: "Normal", scheduledAt: "" });
      load();
    } catch (error: any) {
      toast(error.message || "Could not send announcement.", "error");
    }
  };

  if (loading || isLoading) return <section className="page-shell"><div className="wrapper"><Skeleton height={420} /></div></section>;
  if (error) return <section className="page-shell"><div className="wrapper"><ErrorState message={error} onRetry={load} /></div></section>;

  return (
    <section className="page-shell">
      <div className="wrapper grid gap-6 py-10 md:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="hidden border-r border-[var(--color-border)] bg-[var(--color-bg-surface)] p-2 md:block">
          {nav.map((item) => <button key={item.label} onClick={() => setSection(item.label)} className={`flex w-full items-center gap-2 rounded-[var(--radius-sm)] px-3 py-2 text-left text-sm font-semibold ${section === item.label ? "bg-[var(--color-accent-light)] text-[var(--color-accent)]" : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]"}`}><item.icon className="h-4 w-4" />{item.label}</button>)}
        </aside>
        <div className="space-y-6">
          <div className="flex gap-2 overflow-x-auto md:hidden">{nav.map((item) => <Button key={item.label} variant={section === item.label ? "primary" : "secondary"} onClick={() => setSection(item.label)}>{item.label}</Button>)}</div>
          <div className="section-header"><div><p className="eyebrow">Admin</p><h1 className="mt-2 text-3xl font-semibold">{section}</h1></div></div>

          {section === "Overview" && <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">{statRows.map(([label, value]) => <div key={label} className="surface p-4"><p className="text-sm text-[var(--color-text-secondary)]">{label}</p><p className="mt-2 text-3xl font-semibold">{value}</p></div>)}</div>}

          {section === "Users" && <div className="space-y-4"><Input placeholder="Search users..." value={query} onChange={(e) => setQuery(e.target.value)} /><div className="surface overflow-x-auto"><table className="w-full min-w-[760px] text-sm"><thead><tr className="text-left text-[var(--color-text-secondary)]"><th className="p-3">User</th><th>Username</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead><tbody>{users.docs.map((item: any) => <tr key={item._id} className="border-t border-[var(--color-border)]"><td className="p-3"><div className="flex items-center gap-2"><Avatar src={item.avatar} name={item.fullname} size="sm" />{item.fullname}</div></td><td>{item.username}</td><td>{item.email}</td><td>{item.role}</td><td>{item.isActive === false ? "Inactive" : "Active"}</td><td className="space-x-2"><Button size="sm" variant="secondary" asChild><Link href={`/UserDashboard?id=${item._id}`}>View</Link></Button><Button size="sm" variant="secondary" onClick={() => updateAdminUserRole(item._id, item.role === "admin" ? "user" : "admin").then(load)}>{item.role === "admin" ? "Remove Admin" : "Make Admin"}</Button><Button size="sm" variant="danger" onClick={() => updateAdminUserStatus(item._id, item.isActive === false).then(load)}>{item.isActive === false ? "Reactivate" : "Deactivate"}</Button></td></tr>)}</tbody></table></div><p className="text-sm text-[var(--color-text-secondary)]">Showing {users.docs.length ? 1 : 0}-{users.docs.length} of {users.total || users.docs.length} users</p></div>}

          {section === "Events" && <div className="surface overflow-x-auto"><table className="w-full min-w-[760px] text-sm"><thead><tr className="text-left text-[var(--color-text-secondary)]"><th className="p-3">Title</th><th>Host</th><th>Date</th><th>Category</th><th>Created</th><th>Actions</th></tr></thead><tbody>{events.map((item) => <tr key={item._id} className="border-t border-[var(--color-border)]"><td className="p-3 font-semibold">{item.title}</td><td>{item.host?.fullname || item.hostName}</td><td>{new Date(item.date).toLocaleDateString()}</td><td><Badge color={item.type}>{item.type}</Badge></td><td>{new Date(item.createdAt || item.date).toLocaleDateString()}</td><td className="space-x-2"><Button size="sm" variant="secondary" asChild><Link href={`/Events/${item._id}`}>Edit</Link></Button><Button size="sm" variant="danger" onClick={() => setConfirm({ title: "Delete event", description: `Delete "${item.title}" permanently?`, action: async () => { await deleteEvent(item._id); toast("Event deleted.", "success"); load(); } })}><Trash2 className="h-4 w-4" /></Button></td></tr>)}</tbody></table></div>}

          {section === "Polls" && <div className="surface overflow-x-auto"><table className="w-full min-w-[760px] text-sm"><thead><tr className="text-left text-[var(--color-text-secondary)]"><th className="p-3">Question</th><th>Category</th><th>Votes</th><th>Status</th><th>Created</th><th>Actions</th></tr></thead><tbody>{polls.map((item) => <tr key={item._id} className="border-t border-[var(--color-border)]"><td className="p-3 font-semibold">{item.question}</td><td>{item.tab}</td><td>{item.totalVotes || 0}</td><td>{item.isActive === false || new Date(item.end_time) < new Date() ? "Closed" : "Open"}</td><td>{new Date(item.createdAt || item.start_time).toLocaleDateString()}</td><td className="space-x-2"><Button size="sm" variant="secondary" onClick={() => closePoll(item._id).then(load)}>Close</Button><Button size="sm" variant="danger" onClick={() => setConfirm({ title: "Delete poll", description: `Delete "${item.question}" permanently?`, action: async () => { await deletePoll(item._id); toast("Poll deleted.", "success"); load(); } })}>Delete</Button></td></tr>)}</tbody></table></div>}

          {section === "Gallery moderation" && <div className="space-y-4"><div className="flex justify-between"><h2 className="text-lg font-semibold">Pending photos</h2><Button variant="secondary" onClick={() => Promise.all(gallery.filter((i) => !i.isApproved).map((i) => approveImageApi(i._id))).then(load)}>Approve All</Button></div><div className="gallery-grid">{gallery.map((image) => <div key={image._id} className="gallery-item relative overflow-hidden rounded-[10px]"><img src={image.image_url} alt="Gallery moderation item" className="w-full rounded-[10px]" /><div className="absolute inset-x-0 bottom-0 flex gap-2 bg-black/65 p-2">{!image.isApproved && <Button size="sm" onClick={() => approveImageApi(image._id).then(load)}>Approve</Button>}<Button size="sm" variant="danger" onClick={() => (image.isApproved ? deleteImage(image._id) : rejectImageApi(image._id)).then(load)}>{image.isApproved ? "Remove" : "Reject"}</Button></div></div>)}</div></div>}

          {section === "Announcements" && <div className="space-y-5"><div className="surface grid gap-4 p-5"><textarea value={announcement.message} onChange={(e) => setAnnouncement((current) => ({ ...current, message: e.target.value }))} className="min-h-40 rounded-[var(--radius-md)] border border-[var(--color-input-border)] bg-[var(--color-input-bg)] p-3 text-sm" placeholder="Write announcement..." /><div className="grid gap-3 sm:grid-cols-3"><Select value={announcement.audience} onChange={(value) => setAnnouncement((c) => ({ ...c, audience: value }))} options={[{ label: "All users", value: "All users" }, { label: "Select departments", value: "Select departments" }]} /><Select value={announcement.priority} onChange={(value) => setAnnouncement((c) => ({ ...c, priority: value }))} options={[{ label: "Normal", value: "Normal" }, { label: "Urgent", value: "Urgent" }]} /><Input type="datetime-local" value={announcement.scheduledAt} onChange={(e) => setAnnouncement((c) => ({ ...c, scheduledAt: e.target.value }))} /></div><Button onClick={sendAnnouncement}>Send announcement</Button></div><div className="surface divide-y divide-[var(--color-border)]">{announcements.length ? announcements.map((item) => <div key={item._id} className="p-4 text-sm"><p className="font-semibold">{item.body}</p><p className="mt-1 text-[var(--color-text-secondary)]">{item.sendTo} · {item.priority} · {new Date(item.createdAt).toLocaleString()}</p></div>) : <EmptyState title="No announcements yet" />}</div></div>}

          {section === "Settings" && <div className="surface grid gap-4 p-5"><label className="flex justify-between gap-4 text-sm font-semibold">Require admin approval for new events <input type="checkbox" /></label><label className="flex justify-between gap-4 text-sm font-semibold">Allow users to create events <input type="checkbox" /></label><label className="flex justify-between gap-4 text-sm font-semibold">Require admin approval for gallery uploads <input type="checkbox" defaultChecked /></label><Input label="Birthday reminder days in advance" type="number" defaultValue="1" /><Button variant="danger">Clear all pending gallery items</Button></div>}
        </div>
      </div>
      <ConfirmDialog open={Boolean(confirm)} title={confirm?.title || ""} description={confirm?.description || ""} dangerous onCancel={() => setConfirm(null)} onConfirm={() => confirm?.action().finally(() => setConfirm(null))} />
    </section>
  );
}
