import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
// Correct the import path from AuthContent to AuthContext
import { AuthProvider } from "@/context/AuthContent"; 
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: "EventM",
  description: "Corporate Event Management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} bg-[#f5f6f7] text-[#1f2933]`}>
        {/* The AuthProvider now correctly wraps your entire application */}
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}

