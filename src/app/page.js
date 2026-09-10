import Link from 'next/link'
import Header from '@/components/Header'
import { prisma } from '@/lib/prisma'

export default async function HomePage() {
  const [countMenunggu, countDiperiksa, countSelesai] = await Promise.all([
    prisma.kunjungan.count({ where: { status: 'menunggu' } }),
    prisma.kunjungan.count({ where: { status: 'diperiksa' } }),
    prisma.kunjungan.count({ where: { status: 'selesai' } }),
  ])

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Dashboard" />

      <main className="flex-1 p-6 sm:p-8">
        {/* Kartu Putih Utama sesuai tampilan screenshot */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Ringkasan Hari Ini
            </h1>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Selamat datang di Dashboard SIMRS. Halaman ini masih kosong (placeholder) dan akan diisi oleh tim Anda.
            </p>
          </div>

          {/* Section Modul Aktif: Rawat Jalan */}
          <div className="pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-800 flex items-center space-x-2">
                  <span>🏥</span>
                  <span>Modul Aktif: Rawat Jalan (Poli)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Modul yang sedang dikerjakan pada branch ini
                </p>
              </div>

              <Link
                href="/rawat-jalan"
                className="inline-flex items-center px-4 py-2 rounded-xl bg-[#1d4ed8] hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition"
              >
                Buka Antrian Rawat Jalan →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/80">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">
                  Menunggu Diperiksa
                </span>
                <div className="mt-2 flex items-baseline space-x-2">
                  <span className="text-2xl font-extrabold text-amber-900">{countMenunggu}</span>
                  <span className="text-xs text-amber-700 font-medium">pasien</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200/80">
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">
                  Sedang Diperiksa
                </span>
                <div className="mt-2 flex items-baseline space-x-2">
                  <span className="text-2xl font-extrabold text-blue-900">{countDiperiksa}</span>
                  <span className="text-xs text-blue-700 font-medium">pasien</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200/80">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                  Selesai Diperiksa
                </span>
                <div className="mt-2 flex items-baseline space-x-2">
                  <span className="text-2xl font-extrabold text-emerald-900">{countSelesai}</span>
                  <span className="text-xs text-emerald-700 font-medium">pasien</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
