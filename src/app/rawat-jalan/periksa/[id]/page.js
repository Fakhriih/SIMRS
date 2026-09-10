import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Header from '@/components/Header'
import { simpanPemeriksaan } from '../../actions'

function hitungUsia(tanggalLahir) {
  if (!tanggalLahir) return '-'
  const today = new Date()
  const birth = new Date(tanggalLahir)
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return `${age} tahun`
}

function formatTanggal(date) {
  if (!date) return '-'
  const d = new Date(date)
  return d.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatWaktu(date) {
  if (!date) return '-'
  const d = new Date(date)
  return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
}

export default async function PeriksaPasienPage({ params }) {
  const resolvedParams = await params
  const kunjunganId = parseInt(resolvedParams.id, 10)

  if (isNaN(kunjunganId)) {
    notFound()
  }

  const kunjungan = await prisma.kunjungan.findUnique({
    where: { id: kunjunganId },
    include: {
      Pasien: true,
      Dokter: true,
      RekamMedis: {
        include: { ResepObat: true },
      },
    },
  })

  if (!kunjungan) {
    notFound()
  }

  const listObat = await prisma.obat.findMany({
    orderBy: { nama_obat: 'asc' },
  })

  const rekamMedisSaatIni = kunjungan.RekamMedis && kunjungan.RekamMedis[0]

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Pemeriksaan Pasien" />

      <main className="flex-1 p-6 sm:p-8 space-y-6">
        {/* Tombol Navigasi Kembali */}
        <div className="flex items-center justify-between">
          <Link
            href="/rawat-jalan"
            className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-blue-700 transition"
          >
            ← Kembali ke Antrian Rawat Jalan
          </Link>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-medium">Status:</span>
            {kunjungan.status === 'menunggu' && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                Menunggu
              </span>
            )}
            {kunjungan.status === 'diperiksa' && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                Sedang Diperiksa
              </span>
            )}
            {kunjungan.status === 'selesai' && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                Selesai
              </span>
            )}
          </div>
        </div>

        {/* Kartu Profil Pasien */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-[#1d4ed8] text-white font-bold flex items-center justify-center text-lg shadow-sm">
                {kunjungan.Pasien.nama.charAt(0)}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl font-bold text-slate-900">{kunjungan.Pasien.nama}</h1>
                  <span className="px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    {kunjungan.Pasien.no_rm}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {kunjungan.Pasien.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'} • Usia:{' '}
                  {hitungUsia(kunjungan.Pasien.tanggal_lahir)} (Lahir:{' '}
                  {formatTanggal(kunjungan.Pasien.tanggal_lahir)})
                </p>
              </div>
            </div>

            <div className="text-left md:text-right">
              <span className="inline-block px-3 py-1 rounded-lg text-xs font-bold bg-blue-100 text-blue-800">
                {kunjungan.poli}
              </span>
              <p className="text-xs text-slate-500 font-medium mt-1">Dokter: {kunjungan.Dokter.nama}</p>
              <p className="text-[11px] text-slate-400">{kunjungan.Dokter.spesialisasi}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div>
              <span className="text-slate-400 block font-medium">NIK:</span>
              <span className="font-semibold text-slate-700">{kunjungan.Pasien.nik}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">No. Telepon:</span>
              <span className="font-semibold text-slate-700">{kunjungan.Pasien.no_telp}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Alamat:</span>
              <span className="font-semibold text-slate-700 block truncate">{kunjungan.Pasien.alamat}</span>
            </div>
          </div>

          {/* Form Dokter */}
          <form action={simpanPemeriksaan} className="space-y-6 pt-2">
            <input type="hidden" name="kunjungan_id" value={kunjungan.id} />

            <div>
              <h2 className="text-base font-bold text-slate-900 mb-1">Formulir Anamnesa & Pemeriksaan</h2>
              <p className="text-xs text-slate-500">
                Data akan tersimpan ke tabel <strong>RekamMedis</strong> dan status kunjungan otomatis diperbarui.
              </p>
            </div>

            {/* 1. Keluhan */}
            <div>
              <label htmlFor="keluhan" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Keluhan Utama Pasien <span className="text-red-500">*</span>
              </label>
              <textarea
                id="keluhan"
                name="keluhan"
                rows={3}
                required
                defaultValue={rekamMedisSaatIni?.keluhan || ''}
                placeholder="Contoh: Pasien mengeluh demam dan sakit kepala selama 2 hari..."
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white placeholder:text-slate-400"
              ></textarea>
            </div>

            {/* 2. Diagnosis */}
            <div>
              <label htmlFor="diagnosis" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Diagnosis Medis <span className="text-red-500">*</span>
              </label>
              <textarea
                id="diagnosis"
                name="diagnosis"
                rows={2}
                required
                defaultValue={rekamMedisSaatIni?.diagnosis || ''}
                placeholder="Contoh: Febris Akut susp. Common Cold..."
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white placeholder:text-slate-400"
              ></textarea>
            </div>

            {/* 3. Tindakan */}
            <div>
              <label htmlFor="tindakan" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Tindakan & Saran Medis <span className="text-red-500">*</span>
              </label>
              <textarea
                id="tindakan"
                name="tindakan"
                rows={2}
                required
                defaultValue={rekamMedisSaatIni?.tindakan || ''}
                placeholder="Contoh: Tirah baring, perbanyak cairan, edukasi minum obat teratur..."
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white placeholder:text-slate-400"
              ></textarea>
            </div>

            {/* 4. Resep Obat (Opsional) */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  💊 Resep Obat (Opsional)
                </label>
                <span className="text-[11px] text-slate-400">Data masuk ke tabel ResepObat</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="nama_obat" className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Pilih Obat:
                  </label>
                  <select
                    id="nama_obat"
                    name="nama_obat"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">-- Tanpa Resep / Pilih Obat --</option>
                    {listObat.map((obat) => (
                      <option key={obat.id} value={obat.nama_obat}>
                        {obat.nama_obat} (Stok: {obat.stok})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="dosis" className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Aturan / Dosis:
                  </label>
                  <input
                    type="text"
                    id="dosis"
                    name="dosis"
                    placeholder="Contoh: 3 x 1 tablet sesudah makan"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>

                <div>
                  <label htmlFor="jumlah" className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Jumlah:
                  </label>
                  <input
                    type="number"
                    id="jumlah"
                    name="jumlah"
                    min="1"
                    defaultValue="10"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* 5. Status Akhir Kunjungan */}
            <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Status Kunjungan Setelah Disimpan <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap items-center gap-4">
                <label className="inline-flex items-center space-x-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="status_kunjungan"
                    value="selesai"
                    defaultChecked
                    className="text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <span>
                    <strong>Selesai</strong> (Pemeriksaan selesai, pasien dapat mengambil obat / pulang)
                  </span>
                </label>

                <label className="inline-flex items-center space-x-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="status_kunjungan"
                    value="diperiksa"
                    className="text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <span>
                    <strong>Diperiksa</strong> (Sedang observasi / menunggu tes penunjang)
                  </span>
                </label>
              </div>
            </div>

            {/* Tombol Aksi */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <Link
                href="/rawat-jalan"
                className="w-full sm:w-auto px-5 py-2.5 text-center text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200 transition"
              >
                Batal / Kembali ke Antrian
              </Link>

              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#1d4ed8] hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition active:scale-95"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
                Simpan Rekam Medis & Selesaikan Kunjungan
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
