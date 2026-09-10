"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { logoutAction } from "@/app/actions/auth"

export default function DashboardLayout({ children }) {
  const pathname = usePathname()
  const router = useRouter()

  const menus = [
    {
      name: "Kasir & Pembayaran",
      path: "/kasir",
      icon: "💳",
      children: [
        { name: "Tagihan", path: "/kasir/tagihan", icon: "📋" },
        { name: "Pembayaran", path: "/kasir/pembayaran", icon: "💵" },
      ],
    },
  ]

  async function handleLogout() {
    await logoutAction()
    router.push("/")
  }

  // Helper untuk mendapatkan Breadcrumb berdasarkan path
  let breadcrumb = "Halaman"
  if (pathname === "/dashboard") breadcrumb = "Dashboard > Ringkasan Kasir"
  else if (pathname.includes("/kasir/tagihan")) breadcrumb = "Kasir & Pembayaran > Daftar Tagihan"
  else if (pathname.includes("/kasir/pembayaran")) breadcrumb = "Kasir & Pembayaran > Pembayaran"

  // Helper tanggal
  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-[280px] bg-white border-r border-slate-200 flex flex-col flex-shrink-0 z-20 shadow-sm">
        <div className="p-8 pb-4">
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">SIM RS</h2>
          <p className="text-slate-500 text-sm mt-1">SIMRS v3.2</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 mt-6 overflow-y-auto pb-4">
          {menus.map((menu) => {
            const isActive = pathname === menu.path || pathname.startsWith(menu.path + "/")
            return (
              <div key={menu.path}>
                <Link
                  href={menu.children ? menu.children[0].path : menu.path}
                  className={`flex items-center space-x-3 px-5 py-3 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? "bg-primary-gradient text-white font-semibold shadow-sm" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium"
                  }`}
                >
                  <span className="w-5 text-center text-lg">{menu.icon}</span>
                  <span className="text-sm">{menu.name}</span>
                </Link>
              </div>
            )
          })}
        </nav>

        {/* User Profile at Bottom Sidebar */}
        <div className="p-5 border-t border-slate-100 flex items-center gap-3 mb-2 mx-2">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold overflow-hidden border border-slate-200">
            {/* Foto profil dummy */}
            <img src="https://ui-avatars.com/api/?name=Anisa+Putri&background=0D8ABC&color=fff" alt="User" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">dr. Anisa Putri</p>
            <p className="text-xs text-slate-500 truncate">Admin Kasir</p>
          </div>
          <button 
            onClick={handleLogout}
            title="Keluar"
            className="text-slate-400 hover:text-red-600 transition-colors p-2 rounded-md hover:bg-slate-50"
          >
            🚪
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-slate-50">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-slate-200 px-10 py-5 flex justify-between items-center z-10">
          <div className="text-[13px] font-medium text-slate-500 flex items-center gap-2">
            {breadcrumb.split(" > ").map((part, index, arr) => (
              <span key={index} className="flex items-center gap-2">
                <span className={index === arr.length - 1 ? "text-slate-800 font-semibold" : ""}>{part}</span>
                {index < arr.length - 1 && <span className="text-slate-300">›</span>}
              </span>
            ))}
          </div>
          <div className="flex items-center space-x-6 text-sm text-slate-600 font-medium">
            <span>{today}</span>
            <button className="text-slate-400 hover:text-slate-600 transition">
              🔔
            </button>
            <div className="flex items-center space-x-3 border-l border-slate-200 pl-6">
              <div className="w-8 h-8 rounded-full bg-blue-800 flex items-center justify-center text-white font-bold text-xs">
                AP
              </div>
              <span className="text-slate-800">dr. Anisa Putri</span>
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-10">
          {/* Wrapper content putih dengan border radius dan bayangan tipis */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 min-h-[calc(100vh-140px)]">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
