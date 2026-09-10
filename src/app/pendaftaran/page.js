"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { getPasiens, getKunjungans } from "@/app/actions/pendaftaran"

function PendaftaranContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [pasiens, setPasiens] = useState([])
  const [kunjungans, setKunjungans] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("pasien") // 'pasien' | 'kunjungan'

  // Notifikasi Toast
  const [toastMessage, setToastMessage] = useState("")

  useEffect(() => {
    const msg = searchParams.get("msg")
    if (msg) {
      setToastMessage(decodeURIComponent(msg))
      const timer = setTimeout(() => {
        setToastMessage("")
        router.replace("/pendaftaran")
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [searchParams, router])

  // Fetch data pasien
  async function fetchPasiens(query = "") {
    setLoading(true)
    const res = await getPasiens(query)
    if (res.success) {
      setPasiens(res.data)
    }
    setLoading(false)
  }

  // Fetch data kunjungan
  async function fetchKunjungans() {
    const res = await getKunjungans()
    if (res.success) {
      setKunjungans(res.data)
    }
  }

  useEffect(() => {
    fetchPasiens(searchQuery)
    fetchKunjungans()
  }, [searchQuery])

  return (
    <div className="space-y-6">
      {/* Toast Notifikasi Sukses */}
      {toastMessage && (
        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-lg shadow-sm flex justify-between items-center transition-all animate-fadeIn">
          <div className="flex items-center space-x-3">
            <span className="text-emerald-600 text-xl font-bold">✓</span>
            <div>
              <p className="text-emerald-800 font-semibold text-sm">Berhasil!</p>
              <p className="text-emerald-700 text-xs mt-0.5">{toastMessage}</p>
            </div>
          </div>
          <button 
            onClick={() => setToastMessage("")} 
            className="text-emerald-400 hover:text-emerald-600 font-bold text-sm px-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header & Akses Cepat */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Modul Pendaftaran Pasien</h2>
          <p className="text-slate-500 text-sm mt-1">
            Kelola pendaftaran pasien baru dan buat antrean kunjungan poliklinik.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/pendaftaran/tambah"
            className="px-4 py-2.5 bg-primary-gradient text-white rounded-lg font-semibold text-sm shadow-sm hover:opacity-90 transition-all flex items-center gap-2"
          >
            <span className="text-lg leading-none">+</span>
            <span>Tambah Pasien Baru</span>
          </Link>
          <Link
            href="/pendaftaran/kunjungan"
            className="px-4 py-2.5 bg-slate-800 text-white rounded-lg font-semibold text-sm shadow-sm hover:bg-slate-700 transition-all flex items-center gap-2"
          >
            <span className="text-lg leading-none">+</span>
            <span>Buat Kunjungan Baru</span>
          </Link>
        </div>
      </div>

      {/* Tab Navigasi & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab("pasien")}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${
              activeTab === "pasien"
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Daftar Pasien ({pasiens.length})
          </button>
          <button
            onClick={() => setActiveTab("kunjungan")}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${
              activeTab === "kunjungan"
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Antrean Kunjungan ({kunjungans.length})
          </button>
        </div>

        {/* Pencarian (Khusus tab pasien) */}
        {activeTab === "pasien" && (
          <div className="relative min-w-[280px]">
            <input
              type="text"
              placeholder="Cari Nama, NIK, atau No. RM..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-slate-800 placeholder-slate-400"
            />
            <span className="absolute left-3 top-3 text-slate-400 text-sm">🔍</span>
          </div>
        )}
      </div>

      {/* Konten Tab 1: Tabel Daftar Pasien */}
      {activeTab === "pasien" && (
        <div className="overflow-x-auto border border-slate-200 rounded-lg shadow-sm">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3.5">No. RM</th>
                <th className="px-5 py-3.5">Nama Pasien</th>
                <th className="px-5 py-3.5">NIK</th>
                <th className="px-5 py-3.5">L/P</th>
                <th className="px-5 py-3.5">Tgl Lahir</th>
                <th className="px-5 py-3.5">No. Telp</th>
                <th className="px-5 py-3.5">Alamat</th>
                <th className="px-5 py-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-slate-400">
                    Memuat data pasien...
                  </td>
                </tr>
              ) : pasiens.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-slate-400">
                    Data pasien tidak ditemukan.
                  </td>
                </tr>
              ) : (
                pasiens.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-4 font-mono font-semibold text-teal-600">
                      {p.no_rm}
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-800">
                      {p.nama}
                    </td>
                    <td className="px-5 py-4 font-mono text-slate-500 text-xs">
                      {p.nik}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded ${
                        p.jenis_kelamin === 'L' ? 'bg-blue-50 text-blue-700' : 'bg-pink-50 text-pink-700'
                      }`}>
                        {p.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-600 text-xs">
                      {new Date(p.tanggal_lahir).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {p.no_telp}
                    </td>
                    <td className="px-5 py-4 text-slate-500 text-xs max-w-[180px] truncate" title={p.alamat}>
                      {p.alamat}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <Link
                        href={`/pendaftaran/kunjungan?pasien_id=${p.id}`}
                        className="inline-flex items-center px-3 py-1.5 bg-teal-50 text-teal-700 hover:bg-teal-100 rounded-md font-medium text-xs transition-colors"
                      >
                        + Buat Kunjungan
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Konten Tab 2: Tabel Antrean Kunjungan */}
      {activeTab === "kunjungan" && (
        <div className="overflow-x-auto border border-slate-200 rounded-lg shadow-sm">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3.5">ID Kunjungan</th>
                <th className="px-5 py-3.5">Tanggal</th>
                <th className="px-5 py-3.5">No. RM / Pasien</th>
                <th className="px-5 py-3.5">Poli Tujuan</th>
                <th className="px-5 py-3.5">Dokter</th>
                <th className="px-5 py-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {kunjungans.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                    Belum ada antrean kunjungan terdaftar.
                  </td>
                </tr>
              ) : (
                kunjungans.map((k) => (
                  <tr key={k.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-4 font-mono font-semibold text-slate-500">
                      #{k.id}
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-500">
                      {new Date(k.tanggal).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-800">{k.Pasien?.nama}</div>
                      <div className="text-xs font-mono text-teal-600">{k.Pasien?.no_rm}</div>
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-700">
                      {k.poli}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {k.Dokter?.nama}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                        k.status === 'menunggu' 
                          ? 'bg-amber-100 text-amber-800'
                          : k.status === 'selesai'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {k.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default function PendaftaranPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Memuat halaman pendaftaran...</div>}>
      <PendaftaranContent />
    </Suspense>
  )
}
