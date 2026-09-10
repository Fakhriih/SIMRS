"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { logoutAction } from "@/app/actions/auth"

export default function DashboardLayout({ children }) {
  const pathname = usePathname()
  const router = useRouter()

  const menus = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Pendaftaran", path: "/pendaftaran" },
    { name: "Rawat Jalan", path: "/rawat-jalan" },
    { name: "Farmasi", path: "/farmasi" },
    { name: "Kasir", path: "/kasir" },
  ]

  async function handleLogout() {
    await logoutAction()
    router.push("/")
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col z-20 shadow-sm">
        <div className="p-8 pb-4">
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">SIMRS</h2>
          <p className="text-slate-500 text-sm mt-1">Sistem Terpadu</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 mt-6">
          {menus.map((menu) => {
            const isActive = pathname === menu.path || pathname.startsWith(menu.path + "/")
            return (
              <Link
                key={menu.path}
                href={menu.path}
                className={`block px-5 py-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? "bg-primary-gradient text-white font-semibold shadow-sm" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium"
                }`}
              >
                {menu.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 mt-auto mb-4 border-t border-slate-100">
          <button 
            onClick={handleLogout}
            className="block px-5 py-3 w-full text-left text-slate-600 font-medium hover:bg-slate-50 hover:text-red-600 rounded-lg transition-colors"
          >
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-slate-50">
        <header className="bg-white shadow-sm border-b border-slate-200 px-10 py-5 flex justify-between items-center z-10">
          <h1 className="text-xl font-bold text-slate-800">
            {menus.find(m => pathname === m.path || pathname.startsWith(m.path + "/"))?.name || "Halaman"}
          </h1>
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm">
              AD
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-10">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 min-h-[500px]">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
