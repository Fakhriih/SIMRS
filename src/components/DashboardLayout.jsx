"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { logoutAction } from "@/app/actions/auth"

export default function DashboardLayout({ children }) {
  const pathname = usePathname()
  const router = useRouter()

  const menus = [
    { name: "Dashboard", path: "/dashboard", icon: "❖" },
    { name: "Pendaftaran Pasien", path: "/pendaftaran", icon: "👥" },
    {
      name: "Kasir & Pembayaran",
      path: "/kasir",
      icon: "💳",
      children: [
        { name: "Tagihan", path: "/kasir/tagihan", icon: "📋" },
        { name: "Pembayaran", path: "/kasir/pembayaran", icon: "💵" },
      ],
    },
    { name: "Rawat Inap", path: "/rawat-inap", icon: "🛏️" },
    { name: "Farmasi & Obat", path: "/farmasi", icon: "🔗" },
    { name: "Laboratorium", path: "/laboratorium", icon: "🧪" },
    { name: "Laporan", path: "/laporan", icon: "📊" },
    { name: "Pengaturan", path: "/pengaturan", icon: "⚙" },
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
    <div className="min-h-screen bg-[#F3F4F6] flex">
      {/* Sidebar */}
      <aside className="w-[280px] bg-[#1e293b] text-white flex flex-col flex-shrink-0">
        <div className="p-6 pb-4">
          <h2 className="text-xl font-bold tracking-wide">SIM RS</h2>
          <p className="text-slate-400 text-xs mt-1">SIMRS v3.2</p>
        </div>
        
        <nav className="flex-1 space-y-1 mt-4 overflow-y-auto pb-4">
          {menus.map((menu) => {
            const isActive = pathname === menu.path || pathname.startsWith(menu.path + "/")
            return (
              <div key={menu.path}>
                <Link
                  href={menu.children ? menu.children[0].path : menu.path}
                  className={`flex items-center space-x-3 px-6 py-3 transition-colors ${
                    isActive 
                      ? "bg-[#334155] text-white border-l-4 border-emerald-500 font-medium" 
                      : "text-slate-400 hover:bg-[#334155]/50 border-l-4 border-transparent"
                  }`}
                >
                  <span className="w-5 text-center">{menu.icon}</span>
                  <span className="text-sm">{menu.name}</span>
                </Link>

                {/* Sub-menu items (Hanya ditampilkan jika punya anak, tidak dropdown di sidebar desain ini, 
                    tapi kita biarkan ada sub-menu jika diperlukan, atau hanya biarkan menu utama aktif) */}
              </div>
            )
          })}
        </nav>

        {/* User Profile at Bottom Sidebar */}
        <div className="p-5 border-t border-slate-700/50 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold overflow-hidden border border-slate-600">
            {/* Foto profil dummy */}
            <img src="https://ui-avatars.com/api/?name=Anisa+Putri&background=0D8ABC&color=fff" alt="User" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">dr. Anisa Putri</p>
            <p className="text-xs text-slate-400 truncate">Admin Kasir</p>
          </div>
          <button 
            onClick={handleLogout}
            title="Keluar"
            className="text-slate-400 hover:text-white transition-colors"
          >
            🚪
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white px-8 py-4 flex justify-between items-center z-10">
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
        
        <div className="flex-1 overflow-auto p-8 bg-[#f8f9fa]">
          {/* Wrapper content putih dengan border radius dan bayangan tipis */}
          <div className="bg-white rounded-[16px] border border-slate-200 shadow-sm p-8 min-h-[calc(100vh-140px)]">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
