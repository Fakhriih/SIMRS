"use client"

import { usePathname } from "next/navigation"
import DashboardLayout from "@/components/DashboardLayout"

export default function ClientLayoutWrapper({ children }) {
  const pathname = usePathname()
  
  // Jika di halaman login (root), tidak usah pakai DashboardLayout
  if (pathname === "/") {
    return <>{children}</>
  }
  
  // Untuk halaman lainnya, bungkus dengan DashboardLayout
  return <DashboardLayout>{children}</DashboardLayout>
}
