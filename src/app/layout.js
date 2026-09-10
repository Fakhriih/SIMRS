import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SIMRS - Sistem Terpadu",
  description: "Sistem Informasi Manajemen Rumah Sakit Terpadu",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex bg-[#f8fafc] text-slate-800 font-sans">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-y-auto">
          {children}
        </div>
      </body>
    </html>
  );
}
