import Link from 'next/link'
import Header from '@/components/Header'

export default function PendaftaranPlaceholderPage() {
  return (
    <div className="flex-1 flex flex-col">
      <Header title="Pendaftaran" />

      <main className="flex-1 p-6 sm:p-8">
        <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Modul Pendaftaran Pasien
            </h1>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Selamat datang di Modul Pendaftaran. Halaman ini masih kosong (placeholder) dan sedang dikerjakan oleh anggota tim lain.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center space-x-3">
            <Link
              href="/rawat-jalan"
              className="inline-flex items-center px-4 py-2 rounded-xl bg-[#1d4ed8] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition"
            >
              ← Buka Modul Rawat Jalan (Aktif)
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
