"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchNotifications, markAllNotificationsRead, markNotificationRead } from "@/services/api";
import { Button } from "@/components/ui/button";
import { EmptyState, ErrorState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";

export default function NotificationsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const load = () => {
    setLoading(true);
    setError("");
    fetchNotifications()
      .then((data) => setItems(data.docs || data || []))
      .catch((err) => setError(err.message || "Could not load notifications."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const markAll = async () => {
    setItems((current) => current.map((item) => ({ ...item, read: true })));
    await markAllNotificationsRead();
    toast("Notifications marked read.", "success");
  };

  const markOne = async (item: any) => {
    setItems((current) => current.map((notification) => notification._id === item._id ? { ...notification, read: true } : notification));
    await markNotificationRead(item._id).catch(() => undefined);
  };

  return (
    <section className="page-shell">
      <div className="wrapper max-w-4xl space-y-8 py-10">
        <div className="section-header">
          <div>
            <p className="eyebrow">Inbox</p>
            <h1 className="mt-2 text-3xl font-semibold">Notifications</h1>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">Updates about events, polls, gallery approvals, and announcements.</p>
          </div>
          <Button variant="secondary" onClick={markAll}>Mark all read</Button>
        </div>
        {loading && <div className="space-y-3">{Array.from({ length: 5 }).map((_, index) => <Skeleton key={index} height={72} />)}</div>}
        {error && <ErrorState message={error} onRetry={load} />}
        {!loading && !error && items.length === 0 && <EmptyState title="You're all caught up" description="New notifications will appear here." />}
        {!loading && !error && items.length > 0 && (
          <div className="surface divide-y divide-[var(--color-border)] overflow-hidden">
            {items.map((item) => (
              <Link key={item._id} href={item.link || "#"} onClick={() => markOne(item)} className={`block p-4 transition hover:bg-[var(--color-bg-hover)] ${!item.read ? "border-l-[3px] border-[var(--color-accent)] bg-[var(--color-accent-light)]" : ""}`}>
                <p className="text-sm font-medium text-[var(--color-text-primary)]">{item.message}</p>
                <p className="mt-1 text-xs text-[var(--color-text-secondary)]">{new Date(item.createdAt).toLocaleString()}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
