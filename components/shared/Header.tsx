'use client';

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContent";
import NavItems from "./NavItems";
import { Button } from "../ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Drawer } from "@/components/ui/drawer";
import { useToast } from "@/components/ui/toast";
import { fetchNotifications, markAllNotificationsRead, markNotificationRead } from "@/services/api";
import { Bell, ChevronDown, LogOut, Menu, Moon, Settings, UserCircle } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const Header = () => {
  const { user, isLoading, logout } = useAuth();
  const pathname = usePathname();
  const { toast } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [heroVisible, setHeroVisible] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || savedTheme === "light") {
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  useEffect(() => {
    const hero = document.querySelector("[data-hero]");
    if (!hero) return setHeroVisible(false);
    const observer = new IntersectionObserver(([entry]) => setHeroVisible(entry.isIntersecting), { threshold: 0.1 });
    observer.observe(hero);
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    if (!user) return;
    fetchNotifications()
      .then((data) => setNotifications(data.docs || data || []))
      .catch(() => setNotifications([]));
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (userMenuRef.current && !userMenuRef.current.contains(target)) setProfileOpen(false);
      if (notificationsRef.current && !notificationsRef.current.contains(target)) setNotificationsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = useMemo(() => notifications.filter((item) => !(item.read || item.isRead)).length, [notifications]);

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/users/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      toast("Could not reach the server while signing out.", "warning");
    } finally {
      logout();
      window.location.href = '/';
    }
  };

  const toggleTheme = () => {
    const current = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", current);
    localStorage.setItem("theme", current);
  };

  const toggleNotifications = () => {
    setNotificationsOpen((open) => !open);
    setProfileOpen(false);
  };

  const toggleProfile = () => {
    setProfileOpen((open) => !open);
    setNotificationsOpen(false);
  };

  const markAllRead = async () => {
    setNotifications((items) => items.map((item) => ({ ...item, read: true })));
    await markAllNotificationsRead().catch(() => undefined);
  };

  const openNotification = async (item: any) => {
    setNotifications((items) => items.map((notification) => notification._id === item._id ? { ...notification, read: true } : notification));
    await markNotificationRead(item._id).catch(() => undefined);
    if (item.link) window.location.href = item.link;
  };

  return (
    <header className={`sticky top-0 z-[100] h-[var(--navbar-height)] w-full transition duration-200 ${heroVisible ? "border-b border-transparent bg-transparent" : "border-b border-black/[0.06] bg-[var(--color-navbar-bg)] backdrop-blur-md"}`}>
      <div className="mx-auto flex h-full w-full max-w-[var(--content-width)] items-center justify-between gap-4 px-[clamp(16px,4vw,48px)]">
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/assets/images/logo.png"
            width={104}
            height={34}
            alt="EventM Logo"
            className="eventm-logo h-auto w-[104px]"
            priority
          />
        </Link>

        {user && (
          <nav className="hidden flex-1 md:flex md:justify-center">
            <NavItems />
          </nav>
        )}

        <div className="flex shrink-0 items-center justify-end gap-3">
          {isLoading ? (
            <div className="h-10 w-24 animate-pulse rounded-md bg-gray-200"></div>
          ) : user ? (
            <>
              <div className="relative block" ref={notificationsRef}>
                <button onClick={toggleNotifications} className="relative flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text-primary)] focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]">
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && <span className="absolute right-0 top-0 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-danger)] px-1 text-[10px] font-semibold text-white">{unreadCount}</span>}
                </button>
                {notificationsOpen && (
                  <div className="absolute right-0 top-[calc(100%+8px)] z-[120] w-96 max-w-[calc(100vw-32px)] rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2 shadow-[var(--shadow-lg)]">
                    <div className="flex items-center justify-between px-3 py-2">
                      <p className="text-sm font-semibold text-[var(--color-text-primary)]">Notifications</p>
                      <button onClick={markAllRead} className="text-xs font-semibold text-[var(--color-accent)]">Mark all read</button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="px-3 py-8 text-center text-sm text-[var(--color-text-secondary)]">You're all caught up ✓</p>
                      ) : notifications.slice(0, 5).map((item) => {
                        const icon = item.type === "poll" ? "Poll" : item.type === "approval" ? "OK" : item.type === "announcement" ? "Note" : "Event";
                        return (
                          <button key={item._id} onClick={() => openNotification(item)} className={`flex w-full gap-3 rounded-[var(--radius-md)] px-3 py-3 text-left transition hover:bg-[var(--color-bg-hover)] ${!(item.read || item.isRead) ? "border-l-[3px] border-[var(--color-accent)] bg-[var(--color-accent-light)]" : ""}`}>
                            <span className="w-10 shrink-0 text-[11px] font-semibold text-[var(--color-accent)]">{icon}</span>
                            <span className="min-w-0">
                              <span className="block text-[13px] leading-5 text-[var(--color-text-primary)]">{item.message}</span>
                              <span className="mt-1 block text-[11px] text-[var(--color-text-secondary)]">{new Date(item.createdAt).toLocaleString()}</span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    <Link href="/notifications" className="mt-1 block rounded-[var(--radius-md)] px-3 py-2 text-center text-sm font-semibold text-[var(--color-accent)] hover:bg-[var(--color-bg-hover)]">View all notifications →</Link>
                  </div>
                )}
              </div>
              <div className="relative block" ref={userMenuRef}>
                <button onClick={toggleProfile} className="flex items-center gap-2 rounded-full p-1 pr-2 hover:bg-[var(--color-surface-2)] focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]">
                  <Avatar src={user.avatar} name={user.fullname} size="md" />
                  <ChevronDown className="h-4 w-4 text-[var(--color-text-secondary)]" />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 top-[calc(100%+8px)] z-[120] min-w-[220px] rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2 shadow-[var(--shadow-lg)]">
                    <div className="mb-1 flex items-center gap-3 rounded-[var(--radius-md)] px-2 py-2">
                      <Avatar src={user.avatar} name={user.fullname} size="md" />
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-semibold text-[var(--color-text-primary)]">{user.fullname}</p>
                        <p className="truncate text-[11px] text-[var(--color-text-secondary)]">{user.email}</p>
                      </div>
                    </div>
                    <Link href={user.role === 'admin' ? '/admin' : '/UserDashboard'} className="flex items-center gap-2 rounded-[var(--radius-md)] px-3 py-2 text-[13px] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]"><UserCircle className="h-[18px] w-[18px] text-[var(--color-text-secondary)]" /> My Profile</Link>
                    <Link href="/settings" className="flex items-center gap-2 rounded-[var(--radius-md)] px-3 py-2 text-[13px] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]"><Settings className="h-[18px] w-[18px] text-[var(--color-text-secondary)]" /> Settings</Link>
                    <button onClick={toggleTheme} className="flex w-full items-center gap-2 rounded-[var(--radius-md)] px-3 py-2 text-left text-[13px] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]"><Moon className="h-[18px] w-[18px] text-[var(--color-text-secondary)]" /> Dark Mode</button>
                    <div className="my-2 h-px bg-[var(--color-border)]" />
                    <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-[var(--radius-md)] px-3 py-2 text-left text-[13px] text-[var(--color-danger)] hover:bg-[var(--color-danger-bg)]"><LogOut className="h-[18px] w-[18px] text-[var(--color-danger)]" /> Sign Out</button>
                  </div>
                )}
              </div>
              <button onClick={() => setMenuOpen(true)} className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] md:hidden">
                <Menu className="h-5 w-5" />
              </button>
            </>
          ) : (
            <>
              {pathname === '/sign-in' ? (
                <Button asChild size="lg">
                  <Link href="/sign-up">Register</Link>
                </Button>
              ) : (
                <Button asChild size="lg">
                  <Link href="/sign-in">Login</Link>
                </Button>
              )}
            </>
          )}
        </div>
      </div>
      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)} side="right">
        <div className="flex h-full flex-col">
          <div className="mb-6 flex items-center gap-3 border-b border-[var(--color-border)] pb-5">
            <Avatar src={user?.avatar} name={user?.fullname} size="lg" />
            <div>
              <p className="font-semibold text-[var(--color-text-primary)]">{user?.fullname}</p>
              <p className="text-sm text-[var(--color-text-secondary)]">{user?.email}</p>
            </div>
          </div>
          <NavItems />
          <div className="mt-auto grid gap-2 border-t border-[var(--color-border)] pt-5">
            <Link href={user?.role === 'admin' ? '/admin' : '/UserDashboard'} className="px-3 py-2 text-sm font-semibold">My Profile</Link>
            <Link href="/settings" className="px-3 py-2 text-sm font-semibold">Settings</Link>
            <Button onClick={handleLogout} variant="danger" className="mt-3">Sign Out</Button>
          </div>
        </div>
      </Drawer>
    </header>
  );
};

export default Header;

