"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { logoutAction } from "@/app/actions/auth"

export default function DashboardLayout({ children }) {
  const pathname = usePathname()
  const router = useRouter()

  const menus = [
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
    { name: "Pendaftaran", path: "/pendaftaran", icon: "📝" },
    { name: "Rawat Jalan", path: "/rawat-jalan", icon: "🩺" },
    { name: "Farmasi", path: "/farmasi", icon: "💊" },
    { name: "Kasir", path: "/kasir", icon: "💰" },
  ]

  async function handleLogout() {
    await logoutAction()
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-800 text-white flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-bold tracking-wider">SIMRS</h2>
          <p className="text-blue-200 text-sm mt-1">Sistem Terpadu</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menus.map((menu) => {
            const isActive = pathname === menu.path || pathname.startsWith(menu.path + "/")
            return (
              <Link
                key={menu.path}
                href={menu.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? "bg-blue-700 text-white font-medium shadow-sm" 
                    : "text-blue-100 hover:bg-blue-700/50"
                }`}
              >
                <span>{menu.icon}</span>
                <span>{menu.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-blue-700">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 w-full text-left text-blue-100 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
          >
            <span>🚪</span>
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b border-slate-200 px-8 py-4 flex justify-between items-center z-10">
          <h1 className="text-xl font-semibold text-slate-800">
            {menus.find(m => pathname === m.path || pathname.startsWith(m.path + "/"))?.name || "Halaman"}
          </h1>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold">
              U
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 min-h-[500px]">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
