import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContent"; 
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { ToastProvider } from "@/components/ui/toast";

export const metadata: Metadata = {
  title: {
    default: "EventM",
    template: "%s — EventM",
  },
  description: "Corporate Event Management",
  icons: {
    icon: "/assets/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `(()=>{try{const s=localStorage.getItem('theme');const m=window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.setAttribute('data-theme',s||(m?'dark':'light'));}catch(e){}})();`,
          }}
        />
        <AuthProvider>
          <ToastProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

