'use client';

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContent";
import NavItems from "./NavItems";
import MobileNav from "./MobileNav";
import { Button } from "../ui/button";
import { UserCircle } from "lucide-react"; // Import the profile icon

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const Header = () => {
  const { user, isLoading, logout } = useAuth();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/users/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error("Failed to logout on backend:", error);
    } finally {
      logout();
      window.location.href = '/';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#d9dde3] bg-white/95 backdrop-blur">
      <div className="wrapper flex min-h-[72px] items-center justify-between gap-4 py-3">
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/assets/images/logo.png"
            width={104}
            height={34}
            alt="EventM Logo"
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
              <p className="hidden whitespace-nowrap text-sm text-[#4b5563] lg:block">
                Hi, {user.fullname.split(' ')[0]}
              </p>
              <Link
                href={user.role === 'admin' ? '/AdminDashboard' : '/UserDashboard'}
                title="Profile"
                className="flex h-10 w-10 items-center justify-center rounded-md border border-[#d9dde3] bg-white"
              >
                <UserCircle className="h-5 w-5 text-[#4b5563] transition-colors hover:text-[#1f2933]" />
              </Link>
              <Button onClick={handleLogout} size="sm" variant="outline" className="hidden sm:flex">
                Logout
              </Button>
              <div className="md:hidden">
                 <MobileNav />
              </div>
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
    </header>
  );
};

export default Header;

