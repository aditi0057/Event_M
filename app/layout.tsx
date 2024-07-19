import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import "./globals.css";
import Link from "next/link";
import Image from "next/image"
import NavItems from "@/components/shared/NavItems";
import MobileNav from "@/components/shared/MobileNav";
import Footer from "@/components/shared/Footer";

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ['400','500','600','700'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: "Event_Management",
  description: "For Event management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={poppins.className}>
          <header className="w-full border-b">
            <div className="wrapper flex items-center justify-between">
              <Link href="/" className="w-36">
                <Image 
                  src="/assets/images/logo1.svg" 
                  width={128} 
                  height={38}
                  alt="Event_M" 
                />
              </Link>

              <nav className="md:flex-between hidden w-full max-w-xs">
                <NavItems />
              </nav>

              <div className="flex w-32 justify-end gap-3">
                <UserButton afterSignOutUrl="/" />
                <MobileNav />
              </div>
            </div>
          </header>

          {children}
          <Footer/>
        </body>
      </html>
    </ClerkProvider>
  );
}
