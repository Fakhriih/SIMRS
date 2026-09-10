"use client"

import { useState, useRef } from "react"
import { buatTagihan } from "../actions"

export default function FormTagihanModal({ kunjungan, onClose }) {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const formRef = useRef(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const result = await buatTagihan(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else if (result?.success) {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-[fadeIn_0.2s_ease-out]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <h3 className="text-lg font-semibold text-white">Buat Tagihan Baru</h3>
          <p className="text-blue-100 text-sm mt-0.5">
            Pasien: <span className="font-medium text-white">{kunjungan.Pasien.nama}</span>
            {" · "}
            <span className="text-blue-200">{kunjungan.Pasien.no_rm}</span>
          </p>
        </div>

        {/* Body */}
        <form ref={formRef} onSubmit={handleSubmit} className="p-6 space-y-5">
          <input type="hidden" name="kunjungan_id" value={kunjungan.id} />

          {/* Info kunjungan */}
          <div className="bg-slate-50 rounded-xl p-4 text-sm space-y-1.5 border border-slate-100">
            <div className="flex justify-between">
              <span className="text-slate-500">Poli</span>
              <span className="font-medium text-slate-700">{kunjungan.poli}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Dokter</span>
              <span className="font-medium text-slate-700">{kunjungan.Dokter.nama}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Tanggal</span>
              <span className="font-medium text-slate-700">
                {new Date(kunjungan.tanggal).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* Rincian biaya */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Rincian Biaya
            </label>
            <textarea
              name="rincian"
              rows={4}
              required
              placeholder={"Konsultasi dokter: Rp 150.000\nObat: Rp 50.000\nTindakan: Rp 100.000"}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm resize-none placeholder:text-slate-400"
            />
          </div>

          {/* Total */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Total Biaya (Rp)
            </label>
            <input
              name="total"
              type="number"
              min="1"
              required
              placeholder="300000"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm font-mono"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl border border-red-100">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium text-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-medium text-sm disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
            >
              {loading ? "Menyimpan..." : "Simpan Tagihan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
