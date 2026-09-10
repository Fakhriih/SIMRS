import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import Header from '@/components/Header'
import TambahAntrianModal from './TambahAntrianModal'

function hitungUsia(tanggalLahir) {
  if (!tanggalLahir) return '-'
  const today = new Date()
  const birth = new Date(tanggalLahir)
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return `${age} thn`
}

function formatWaktu(date) {
  if (!date) return '-'
  const d = new Date(date)
  return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
}

export default async function RawatJalanPage({ searchParams }) {
  const resolvedParams = await searchParams
  const statusTab = (resolvedParams?.status_tab || 'menunggu').toLowerCase()
  const filterPoli = resolvedParams?.poli || 'semua'
  const notif = resolvedParams?.status

  // Hitung antrian
  const [countMenunggu, countDiperiksa, countSelesai] = await Promise.all([
    prisma.kunjungan.count({ where: { status: 'menunggu' } }),
    prisma.kunjungan.count({ where: { status: 'diperiksa' } }),
    prisma.kunjungan.count({ where: { status: 'selesai' } }),
  ])

  const whereCondition = { status: statusTab }
  if (filterPoli && filterPoli !== 'semua') {
    whereCondition.poli = filterPoli
  }

  // Ambil antrian diurutkan berdasarkan POLI & DOKTER
  const antrianList = await prisma.kunjungan.findMany({
    where: whereCondition,
    include: {
      Pasien: true,
      Dokter: true,
      RekamMedis: {
        include: { ResepObat: true },
      },
    },
    orderBy: [
      { poli: 'asc' },
      { Dokter: { nama: 'asc' } },
      { tanggal: 'asc' },
    ],
  })

  const [listPasien, listDokter, listSemuaPoli] = await Promise.all([
    prisma.pasien.findMany({ orderBy: { nama: 'asc' } }),
    prisma.dokter.findMany({ orderBy: { nama: 'asc' } }),
    prisma.kunjungan.findMany({
      select: { poli: true },
      distinct: ['poli'],
    }),
  ])

  const daftarPoli = ['semua', ...new Set(listSemuaPoli.map((k) => k.poli))]

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Rawat Jalan" />

      <main className="flex-1 p-6 sm:p-8 space-y-6">
        {/* Notifikasi Sukses */}
        {notif === 'sukses' && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between shadow-xs">
            <div className="flex items-center space-x-3">
              <span className="text-xl">✅</span>
              <div>
                <p className="font-bold text-sm">Pemeriksaan Pasien Berhasil Disimpan!</p>
                <p className="text-xs text-emerald-600">
                  Rekam medis telah dicatat dan status kunjungan otomatis berubah menjadi "selesai".
                </p>
              </div>
            </div>
            <Link
              href="/rawat-jalan"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 transition"
            >
              Tutup
            </Link>
          </div>
        )}

        {notif === 'antrian_baru' && (
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 flex items-center justify-between shadow-xs">
            <div className="flex items-center space-x-3">
              <span className="text-xl">📋</span>
              <div>
                <p className="font-bold text-sm">Pasien Berhasil Masuk Antrian!</p>
                <p className="text-xs text-blue-600">
                  Kunjungan baru berstatus "menunggu" telah ditambahkan ke antrian.
                </p>
              </div>
            </div>
            <Link
              href="/rawat-jalan"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-800 transition"
            >
              Tutup
            </Link>
          </div>
        )}

        {/* Kartu Utama Antrian */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          {/* Header Card */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Antrian Pasien Rawat Jalan
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Daftar antrian poli klinik yang menunggu dan sedang diperiksa oleh dokter.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <TambahAntrianModal listPasien={listPasien} listDokter={listDokter} />
            </div>
          </div>

          {/* Filter Bar: Status Tabs & Filter Poli */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Tabs Status */}
            <div className="flex items-center space-x-1.5 p-1 bg-slate-100 rounded-xl">
              <Link
                href={`/rawat-jalan?status_tab=menunggu&poli=${filterPoli}`}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-2 ${
                  statusTab === 'menunggu'
                    ? 'bg-white text-slate-800 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>Menunggu</span>
                <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px]">
                  {countMenunggu}
                </span>
              </Link>

              <Link
                href={`/rawat-jalan?status_tab=diperiksa&poli=${filterPoli}`}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-2 ${
                  statusTab === 'diperiksa'
                    ? 'bg-white text-slate-800 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>Sedang Diperiksa</span>
                <span className="px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px]">
                  {countDiperiksa}
                </span>
              </Link>

              <Link
                href={`/rawat-jalan?status_tab=selesai&poli=${filterPoli}`}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-2 ${
                  statusTab === 'selesai'
                    ? 'bg-white text-slate-800 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>Selesai</span>
                <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px]">
                  {countSelesai}
                </span>
              </Link>
            </div>

            {/* Filter Poli */}
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-slate-400">Poli:</span>
              <div className="flex flex-wrap gap-1.5">
                {daftarPoli.map((poliName) => {
                  const isActive = filterPoli === poliName
                  return (
                    <Link
                      key={poliName}
                      href={`/rawat-jalan?status_tab=${statusTab}&poli=${poliName}`}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                        isActive
                          ? 'bg-[#1d4ed8] text-white shadow-xs font-semibold'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {poliName === 'semua' ? 'Semua Poli' : poliName}
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>

          {/* List Antrian */}
          {antrianList.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-slate-200 rounded-2xl">
              <div className="text-3xl mb-2">📋</div>
              <h4 className="text-sm font-bold text-slate-700">Tidak ada data antrian</h4>
              <p className="text-xs text-slate-400 mt-1">
                Tidak ada kunjungan dengan status "{statusTab}" untuk poli ini.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                    <th className="py-3 px-4">No. Antrian</th>
                    <th className="py-3 px-4">Pasien</th>
                    <th className="py-3 px-4">Poli Tujuan</th>
                    <th className="py-3 px-4">Dokter Pemeriksa</th>
                    <th className="py-3 px-4">Waktu</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {antrianList.map((item, index) => {
                    const isMenunggu = item.status === 'menunggu'
                    const isDiperiksa = item.status === 'diperiksa'
                    const isSelesai = item.status === 'selesai'

                    return (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-4 px-4 font-mono font-bold text-blue-700">
                          #{String(index + 1).padStart(2, '0')}
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-bold text-slate-900 text-sm">{item.Pasien.nama}</div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {item.Pasien.no_rm} • {item.Pasien.jenis_kelamin === 'L' ? 'L' : 'P'},{' '}
                            {hitungUsia(item.Pasien.tanggal_lahir)}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-block px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                            {item.poli}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-semibold text-slate-800">{item.Dokter.nama}</div>
                          <div className="text-[11px] text-slate-400">{item.Dokter.spesialisasi}</div>
                        </td>
                        <td className="py-4 px-4 text-slate-500 font-medium">
                          {formatWaktu(item.tanggal)}
                        </td>
                        <td className="py-4 px-4">
                          {isMenunggu && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                              Menunggu
                            </span>
                          )}
                          {isDiperiksa && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">
                              Sedang Diperiksa
                            </span>
                          )}
                          {isSelesai && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                              Selesai
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-right">
                          {isMenunggu ? (
                            <Link
                              href={`/rawat-jalan/periksa/${item.id}`}
                              className="inline-flex items-center px-3 py-1.5 rounded-lg bg-[#1d4ed8] hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition"
                            >
                              Periksa Pasien →
                            </Link>
                          ) : isDiperiksa ? (
                            <Link
                              href={`/rawat-jalan/periksa/${item.id}`}
                              className="inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition"
                            >
                              Lanjutkan →
                            </Link>
                          ) : (
                            <Link
                              href={`/rawat-jalan/periksa/${item.id}`}
                              className="inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition"
                            >
                              Rekam Medis
                            </Link>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
