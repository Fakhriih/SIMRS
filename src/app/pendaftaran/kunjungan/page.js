"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { getPasiens, getDokters, createKunjunganAction } from "@/app/actions/pendaftaran"

function BuatKunjunganContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedPasienId = searchParams.get("pasien_id") || ""

  const [pasiens, setPasiens] = useState([])
  const [dokters, setDokters] = useState([])
  const [selectedPasienId, setSelectedPasienId] = useState(preselectedPasienId)
  const [selectedPoli, setSelectedPoli] = useState("Poli Umum")
  const [selectedDokterId, setSelectedDokterId] = useState("")
  
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [errorMsg, setErrorMsg] = useState("")

  const poliList = [
    "Poli Umum",
    "Poli Penyakit Dalam",
    "Poli Anak",
    "Poli Gigi & Mulut",
    "Poli Mata",
    "Poli Bedah",
    "Poli THT",
    "Poli Saraf",
  ]

  useEffect(() => {
    async function loadInitialData() {
      setFetching(true)
      const resPasien = await getPasiens()
      const resDokter = await getDokters()

      if (resPasien.success) setPasiens(resPasien.data)
      if (resDokter.success) {
        setDokters(resDokter.data)
        if (resDokter.data.length > 0) {
          setSelectedDokterId(String(resDokter.data[0].id))
        }
      }
      setFetching(false)
    }
    loadInitialData()
  }, [])

  // Filter dokter sesuai poli (opsional, namun user bisa memilih dokter mana saja)
  const filteredDokters = dokters.filter((d) => {
    if (!selectedPoli) return true
    if (selectedPoli.includes("Penyakit Dalam") && d.spesialisasi.includes("Penyakit Dalam")) return true
    if (selectedPoli.includes("Anak") && d.spesialisasi.includes("Anak")) return true
    if (selectedPoli.includes("Umum") && d.spesialisasi.includes("Umum")) return true
    return true
  })

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setErrorMsg("")

    const formData = new FormData(e.target)
    const result = await createKunjunganAction(formData)

    setLoading(false)
    if (result.success) {
      router.push(`/pendaftaran?msg=${encodeURIComponent(result.message)}`)
    } else {
      setErrorMsg(result.error || "Gagal membuat kunjungan.")
    }
  }

  const activePasien = pasiens.find((p) => String(p.id) === String(selectedPasienId))

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Form Buat Kunjungan Baru</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Daftarkan antrean pasien ke poliklinik dan dokter tujuan. Status otomatis: <span className="font-semibold text-amber-700">"menunggu"</span>.
          </p>
        </div>
        <Link
          href="/pendaftaran"
          className="text-slate-500 hover:text-slate-800 text-sm font-semibold flex items-center gap-1"
        >
          ← Kembali
        </Link>
      </div>

      {/* Alert Error */}
      {errorMsg && (
        <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-lg shadow-sm flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-rose-600 font-bold">⚠️</span>
            <p className="text-rose-700 text-sm font-medium">{errorMsg}</p>
          </div>
          <button 
            onClick={() => setErrorMsg("")}
            className="text-rose-400 hover:text-rose-600 text-sm font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {fetching ? (
        <div className="p-12 text-center text-slate-400">
          Memuat data pasien dan dokter...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5 bg-slate-50/50 p-6 rounded-xl border border-slate-200">
          {/* Pilih Pasien */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Pilih Pasien Terdaftar <span className="text-rose-500">*</span>
            </label>
            <select
              name="pasien_id"
              required
              value={selectedPasienId}
              onChange={(e) => setSelectedPasienId(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 font-medium"
            >
              <option value="">-- Pilih Pasien --</option>
              {pasiens.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.no_rm} - {p.nama} (NIK: {p.nik})
                </option>
              ))}
            </select>
            {pasiens.length === 0 && (
              <p className="text-xs text-rose-500 mt-1">
                Belum ada pasien terdaftar. Silakan <Link href="/pendaftaran/tambah" className="underline font-semibold">tambah pasien baru</Link> terlebih dahulu.
              </p>
            )}
          </div>

          {/* Info Pasien terpilih */}
          {activePasien && (
            <div className="bg-white p-4 rounded-lg border border-slate-200 text-xs space-y-1 text-slate-600">
              <div className="font-semibold text-slate-800 text-sm">{activePasien.nama} ({activePasien.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'})</div>
              <div><span className="font-medium text-slate-500">No. RM:</span> <span className="font-mono text-teal-700 font-bold">{activePasien.no_rm}</span> | <span className="font-medium text-slate-500">NIK:</span> {activePasien.nik}</div>
              <div><span className="font-medium text-slate-500">No. Telp:</span> {activePasien.no_telp} | <span className="font-medium text-slate-500">Alamat:</span> {activePasien.alamat}</div>
            </div>
          )}

          {/* Poli Tujuan & Dokter */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Poliklinik Tujuan <span className="text-rose-500">*</span>
              </label>
              <select
                name="poli"
                required
                value={selectedPoli}
                onChange={(e) => setSelectedPoli(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
              >
                {poliList.map((poli) => (
                  <option key={poli} value={poli}>
                    {poli}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Dokter Pemeriksa <span className="text-rose-500">*</span>
              </label>
              <select
                name="dokter_id"
                required
                value={selectedDokterId}
                onChange={(e) => setSelectedDokterId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
              >
                {filteredDokters.length === 0 ? (
                  <option value="">Tidak ada dokter untuk poli ini</option>
                ) : (
                  filteredDokters.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.nama} ({d.spesialisasi})
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {/* Status Antrean (Fixed Information) */}
          <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider block">
                Status Kunjungan Awal
              </span>
              <span className="text-sm font-bold text-amber-900 mt-0.5 block">
                MENUNGGU (Antrean Poli)
              </span>
            </div>
            <span className="text-xs bg-amber-200 text-amber-900 px-3 py-1 rounded-full font-bold">
              Status: menunggu
            </span>
          </div>

          {/* Tombol Simpan & Batal */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
            <Link
              href="/pendaftaran"
              className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={loading || !selectedPasienId || !selectedDokterId}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? "Menyimpan..." : "Daftarkan Kunjungan Baru"}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default function BuatKunjunganPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Memuat form kunjungan...</div>}>
      <BuatKunjunganContent />
    </Suspense>
  )
}
