import Link from 'next/link'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-blue-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-200 group-hover:bg-blue-700 transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m-8-8h16" />
                </svg>
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-800">
                  SIMRS <span className="text-blue-600">Medika</span>
                </span>
                <span className="block text-[11px] font-medium text-slate-400">
                  Sistem Informasi Rumah Sakit
                </span>
              </div>
            </Link>

            {/* Modul Tag */}
            <div className="hidden md:flex items-center pl-4 border-l border-slate-200">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                🏥 Modul Rawat Jalan
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-2 sm:space-x-4">
            <Link
              href="/"
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50/60 transition"
            >
              Beranda
            </Link>
            <Link
              href="/rawat-jalan"
              className="px-3 py-2 rounded-lg text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 transition flex items-center space-x-1.5"
            >
              <span>Antrian Rawat Jalan</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </Link>
          </nav>

          {/* Active User / Petugas Info */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-semibold text-slate-800">Petugas Rawat Jalan</span>
              <span className="text-[11px] text-slate-500">Poli Klinik Aktif</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-semibold text-sm">
              RJ
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
