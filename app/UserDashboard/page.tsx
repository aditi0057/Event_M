"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Camera, CalendarDays, ImageIcon, Vote } from "lucide-react";
import { fetchDashboardData } from "@/services/api";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { EmptyState, ErrorState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";

function DateSelects({ label }: { label: string }) {
  return (
    <div className="grid gap-2">
      <label className="text-sm font-semibold text-[var(--color-text-primary)]">{label}</label>
      <div className="grid grid-cols-3 gap-2">
        <Select value="" onChange={() => undefined} options={[{ label: "Day", value: "" }, ...Array.from({ length: 31 }, (_, i) => ({ label: `${i + 1}`, value: `${i + 1}` }))]} />
        <Select value="" onChange={() => undefined} options={[{ label: "Month", value: "" }, ...Array.from({ length: 12 }, (_, i) => ({ label: new Date(2025, i, 1).toLocaleString("en", { month: "short" }), value: `${i + 1}` }))]} />
        <Select value="" onChange={() => undefined} options={[{ label: "Year", value: "" }, ...Array.from({ length: 70 }, (_, i) => ({ label: `${new Date().getFullYear() - i}`, value: `${new Date().getFullYear() - i}` }))]} />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => { fetchDashboardData().then(setData).catch(() => setError("Could not load dashboard data.")).finally(() => setLoading(false)); }, []);
  if (loading) return <section className="page-shell"><div className="wrapper space-y-5"><Skeleton height={260} /><Skeleton height={180} /></div></section>;
  if (error) return <section className="page-shell"><div className="wrapper"><ErrorState message={error} /></div></section>;
  const user = data?.userDetails || {};
  const upcomingEvents = data?.upcomingEvents || [];
  const activePolls = data?.activePolls || [];
  const galleryContributions = data?.galleryContributions || [];
  const avatarSrc = avatarPreview || user.avatar;

  const chooseAvatar = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return toast("Avatar must be under 5MB.", "error");
    setAvatarPreview(URL.createObjectURL(file));
    toast("Avatar preview updated. Save profile to persist it.", "info");
  };

  return (
    <section className="page-shell">
      <div className="wrapper space-y-8 py-10">
        <div className="surface mx-auto max-w-[640px] p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar src={avatarSrc} name={user.fullname} className="h-[72px] w-[72px]" />
                <button onClick={() => fileRef.current?.click()} className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-white text-[var(--color-text-primary)] shadow-[var(--shadow-sm)]">
                  <Camera className="h-3.5 w-3.5" />
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(event) => chooseAvatar(event.target.files)} />
              </div>
              <div>
                <h1 className="text-2xl font-semibold">{user.fullname}</h1>
                <p className="mt-1 text-sm text-[var(--color-text-secondary)]">@{user.username} · {user.email}</p>
              </div>
            </div>
            <Button size="sm" variant="secondary" onClick={() => setEditOpen(true)}>Edit Profile</Button>
          </div>
          <div className="my-6 h-px bg-[var(--color-border)]" />
          <div className="grid grid-cols-3 gap-3 text-center">
            {[{ icon: CalendarDays, label: "Events Created", value: upcomingEvents.length }, { icon: Vote, label: "Polls Voted", value: activePolls.length }, { icon: ImageIcon, label: "Photos Uploaded", value: galleryContributions.length }].map((stat) => <div key={stat.label}><stat.icon className="mx-auto h-5 w-5 text-[var(--color-text-secondary)]" /><p className="mt-2 text-2xl font-semibold">{stat.value}</p><p className="text-xs text-[var(--color-text-secondary)]">{stat.label}</p></div>)}
          </div>
        </div>
        <section className="mx-auto grid max-w-[900px] gap-6 lg:grid-cols-2">
          <div className="surface p-5"><h2 className="text-xl font-semibold">Your upcoming events</h2>{upcomingEvents.length ? <div className="mt-4 divide-y divide-[var(--color-border)]">{upcomingEvents.map((event: any) => <Link className="block py-3 hover:text-[var(--color-accent)]" href={`/Events/${event._id}`} key={event._id}>{event.title}</Link>)}</div> : <EmptyState title="No upcoming events" />}</div>
          <div className="surface p-5"><h2 className="text-xl font-semibold">Your active polls</h2>{activePolls.length ? <div className="mt-4 divide-y divide-[var(--color-border)]">{activePolls.map((poll: any) => <p className="py-3" key={poll._id}>{poll.question}</p>)}</div> : <EmptyState title="No active polls" />}</div>
        </section>
      </div>
      <Modal title="Edit Profile" open={editOpen} onClose={() => setEditOpen(false)}>
        <div className="grid gap-4">
          <Input label="Full Name" defaultValue={user.fullname} />
          <Input label="Username" defaultValue={user.username} />
          <Input label="Mobile Number" defaultValue={user.mobileNumber} />
          <DateSelects label="Date of Birth" />
          <DateSelects label="Work Joining Date" />
          <Select label="Marital Status" value={user.maritalStatus || "Prefer not to say"} onChange={() => undefined} options={["Prefer not to say", "Single", "Married", "Other"].map((value) => ({ label: value, value }))} />
          <Button onClick={() => { setEditOpen(false); toast("Profile changes saved locally.", "success"); }}>Save Changes</Button>
        </div>
      </Modal>
    </section>
  );
}
