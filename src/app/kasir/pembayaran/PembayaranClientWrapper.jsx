"use client"

import { useState } from "react"
import { bayarTagihan } from "../actions"

export default function PembayaranClientWrapper({ tagihanList }) {
  const [confirmId, setConfirmId] = useState(null)
  const [loading, setLoading] = useState(null)
  const [error, setError] = useState("")

  const formatRupiah = (num) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num)
  }

  async function handleBayar(tagihanId) {
    setLoading(tagihanId)
    setError("")

    const formData = new FormData()
    formData.set("tagihan_id", tagihanId.toString())

    const result = await bayarTagihan(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(null)
    } else {
      setConfirmId(null)
      setLoading(null)
    }
  }

  // Hitung total belum bayar
  const totalBelumBayar = tagihanList.reduce((sum, t) => sum + t.total, 0)

  return (
    <div className="flex flex-col h-full">
      {/* Error global */}
      {error && (
        <div className="mb-4 bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl border border-red-100">
          {error}
        </div>
      )}

      {/* Summary Box */}
      <div className="border border-slate-200 rounded-2xl p-6 mb-8 flex items-center justify-between">
        <div>
          <p className="text-slate-500 font-medium mb-1">Total Tagihan Belum Dibayar</p>
          <p className="text-4xl font-bold text-red-500 tracking-tight">
            {formatRupiah(totalBelumBayar)}
          </p>
        </div>
        <div className="bg-red-50 text-red-600 border border-red-100 px-4 py-1.5 rounded-full font-semibold text-sm">
          {tagihanList.length} Tagihan
        </div>
      </div>

      <h3 className="text-[17px] font-bold text-slate-800 mb-5">Tagihan Menunggu Pembayaran</h3>

      {/* Content */}
      {tagihanList.length === 0 ? (
        <div className="text-center py-16 text-slate-400 border border-slate-100 rounded-2xl bg-slate-50">
          <p className="text-lg font-medium text-slate-500">Semua tagihan sudah lunas!</p>
          <p className="text-sm mt-1">Tidak ada tagihan yang perlu dibayar saat ini.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="text-left px-4 py-4 font-semibold uppercase tracking-wider w-12">No.</th>
                <th className="text-left px-4 py-4 font-semibold uppercase tracking-wider">ID Tagihan</th>
                <th className="text-left px-4 py-4 font-semibold uppercase tracking-wider">Nama Pasien</th>
                <th className="text-left px-4 py-4 font-semibold uppercase tracking-wider">Poliklinik</th>
                <th className="text-left px-4 py-4 font-semibold uppercase tracking-wider">Rincian Layanan</th>
                <th className="text-left px-4 py-4 font-semibold uppercase tracking-wider">Total</th>
                <th className="text-center px-4 py-4 font-semibold uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {tagihanList.map((t, index) => {
                const invoiceId = `INV-2026-${String(t.id).padStart(4, "0")}`
                const rincianItems = t.rincian.split("\n")

                return (
                  <tr
                    key={t.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-4 py-5 text-slate-500">{index + 1}</td>
                    <td className="px-4 py-5">
                      <span className="font-semibold text-emerald-600">
                        {invoiceId}
                      </span>
                    </td>
                    <td className="px-4 py-5 font-bold text-slate-800">
                      {t.Kunjungan.Pasien.nama}
                    </td>
                    <td className="px-4 py-5">
                      <span className="font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                        {t.Kunjungan.poli}
                      </span>
                    </td>
                    <td className="px-4 py-5 text-slate-600">
                      <ul className="list-disc pl-4 space-y-1">
                        {rincianItems.map((item, i) => {
                          const parts = item.split(":")
                          const namaLayanan = parts[0]
                          const hargaLayanan = parts[1] ? parseInt(parts[1].replace(/\D/g, ""), 10) : null
                          
                          return (
                            <li key={i}>
                              <div className="flex justify-between w-64 gap-4">
                                <span>{namaLayanan}</span>
                                {hargaLayanan !== null && !isNaN(hargaLayanan) && (
                                  <span className="text-slate-500 whitespace-nowrap">
                                    {formatRupiah(hargaLayanan)}
                                  </span>
                                )}
                              </div>
                            </li>
                          )
                        })}
                      </ul>
                    </td>
                    <td className="px-4 py-5 font-bold text-slate-800 text-[15px]">
                      {formatRupiah(t.total)}
                    </td>
                    <td className="px-4 py-5 text-center">
                      {confirmId === t.id ? (
                        <div className="flex items-center gap-2 justify-center">
                          <button
                            onClick={() => handleBayar(t.id)}
                            disabled={loading === t.id}
                            className="inline-flex items-center justify-center px-4 py-2 bg-emerald-500 text-white font-medium rounded-md hover:bg-emerald-600 transition-colors disabled:opacity-60"
                          >
                            {loading === t.id ? "⏳" : "Ya"}
                          </button>
                          <button
                            onClick={() => setConfirmId(null)}
                            className="inline-flex items-center justify-center px-3 py-2 border border-slate-300 text-slate-600 font-medium rounded-md hover:bg-slate-50 transition-colors"
                          >
                            Batal
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmId(t.id)}
                          className="inline-flex items-center justify-center px-6 py-2 bg-[#22c55e] text-white font-semibold rounded-md hover:bg-[#16a34a] transition-colors shadow-sm"
                        >
                          Bayar
                        </button>
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
  )
}
