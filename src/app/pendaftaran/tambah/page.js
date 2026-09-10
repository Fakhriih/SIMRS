"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createPasienAction, generateNoRm } from "@/app/actions/pendaftaran"

export default function TambahPasienPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [nextNoRm, setNextNoRm] = useState("Memuat...")

  useEffect(() => {
    async function loadNoRm() {
      const rm = await generateNoRm()
      setNextNoRm(rm)
    }
    loadNoRm()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setErrorMsg("")

    const formData = new FormData(e.target)
    const result = await createPasienAction(formData)

    setLoading(false)
    if (result.success) {
      // Redirect kembali ke halaman pendaftaran dengan pesan sukses
      router.push(`/pendaftaran?msg=${encodeURIComponent(result.message)}`)
    } else {
      setErrorMsg(result.error || "Gagal mendaftarkan pasien.")
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Form Pendaftaran Pasien Baru</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Isi formulir data diri pasien dengan benar untuk diterbitkan Nomor Rekam Medis.
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

      {/* Form Pendaftaran */}
      <form onSubmit={handleSubmit} className="space-y-5 bg-slate-50/50 p-6 rounded-xl border border-slate-200">
        {/* No. Rekam Medis (Auto Preview) */}
        <div className="bg-teal-50 border border-teal-200 p-4 rounded-lg flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider block">
              Nomor Rekam Medis (Otomatis)
            </span>
            <span className="text-xl font-bold font-mono text-teal-900 mt-1 block">
              {nextNoRm}
            </span>
          </div>
          <span className="text-xs bg-teal-200 text-teal-800 px-2.5 py-1 rounded font-medium">
            Sistem Auto-Generate
          </span>
        </div>

        {/* Nama Pasien */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Nama Lengkap Pasien <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="nama"
            required
            placeholder="Contoh: Ahmad Subagyo"
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
          />
        </div>

        {/* NIK & Telepon */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              NIK (Nomor Induk Kependudukan) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="nik"
              required
              minLength={10}
              maxLength={16}
              placeholder="Contoh: 3571023901920001"
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono text-slate-800"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              No. Telepon / WhatsApp <span className="text-rose-500">*</span>
            </label>
            <input
              type="tel"
              name="no_telp"
              required
              placeholder="Contoh: 081234567890"
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
            />
          </div>
        </div>

        {/* Tanggal Lahir & Jenis Kelamin */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Tanggal Lahir <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              name="tanggal_lahir"
              required
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Jenis Kelamin <span className="text-rose-500">*</span>
            </label>
            <select
              name="jenis_kelamin"
              required
              defaultValue="L"
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
            >
              <option value="L">Laki-laki (L)</option>
              <option value="P">Perempuan (P)</option>
            </select>
          </div>
        </div>

        {/* Alamat */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Alamat Lengkap <span className="text-rose-500">*</span>
          </label>
          <textarea
            name="alamat"
            required
            rows={3}
            placeholder="Alamat domisili pasien saat ini..."
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
          ></textarea>
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
            disabled={loading}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-primary-gradient rounded-lg shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? "Menyimpan..." : "Simpan Pasien Baru"}
          </button>
        </div>
      </form>
    </div>
  )
}
