"use client"

import { useState } from "react"
import FormTagihanModal from "./FormTagihanModal"
import DetailTagihanModal from "./DetailTagihanModal"

export default function TagihanClientWrapper({ kunjunganList }) {
  const [selectedKunjungan, setSelectedKunjungan] = useState(null)
  const [viewKunjungan, setViewKunjungan] = useState(null)

  const waitingCount = kunjunganList.filter((k) => !k.Tagihan || k.Tagihan.length === 0).length

  // Helper tanggal
  const todayDate = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <div className="flex flex-col h-full">
      {/* Alert Box */}
      {waitingCount > 0 && (
        <div className="mb-6 bg-[#FEF9C3] border border-[#FEF08A] rounded-xl px-5 py-3 flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs">
            ?
          </div>
          <p className="text-amber-800 font-medium text-sm">
            {waitingCount} Kunjungan menunggu pembuatan tagihan
          </p>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Daftar Tagihan</h2>
        <p className="text-slate-500 text-sm mt-1">{todayDate}</p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="text-left px-4 py-4 font-semibold w-12">No.</th>
              <th className="text-left px-4 py-4 font-semibold">No. RM</th>
              <th className="text-left px-4 py-4 font-semibold">Nama Pasien</th>
              <th className="text-left px-4 py-4 font-semibold">Poliklinik</th>
              <th className="text-left px-4 py-4 font-semibold">Dokter</th>
              <th className="text-center px-4 py-4 font-semibold">Status Tagihan</th>
              <th className="text-center px-4 py-4 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {kunjunganList.map((k, index) => {
              const isSudahDibuat = k.Tagihan && k.Tagihan.length > 0
              return (
                <tr
                  key={k.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-4 py-4 text-slate-500">{index + 1}</td>
                  <td className="px-4 py-4">
                    <span className="font-semibold text-slate-700">
                      {k.Pasien.no_rm}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-bold text-slate-800">{k.Pasien.nama}</td>
                  <td className="px-4 py-4 text-slate-600">{k.poli}</td>
                  <td className="px-4 py-4 text-slate-600">{k.Dokter.nama}</td>
                  <td className="px-4 py-4 text-center">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold ${
                        isSudahDibuat
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          : "bg-amber-50 text-amber-600 border border-amber-100"
                      }`}
                    >
                      {isSudahDibuat ? "Sudah Dibuat" : "Belum Dibuat"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    {isSudahDibuat ? (
                      <button 
                        onClick={() => setViewKunjungan(k)}
                        className="inline-flex items-center justify-center px-4 py-1.5 border border-slate-300 text-slate-600 hover:text-blue-600 hover:border-blue-300 text-xs font-bold rounded-lg transition-colors"
                      >
                        Lihat
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedKunjungan(k)}
                        className="inline-flex items-center justify-center px-4 py-1.5 bg-[#1e293b] text-white hover:bg-slate-700 text-xs font-bold rounded-lg transition-colors shadow-sm"
                      >
                        Buat Tagihan
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="mt-auto pt-6 flex items-center justify-between text-sm text-slate-500">
        <p>Menampilkan 1-{kunjunganList.length} dari {kunjunganList.length} data</p>
        <div className="flex items-center gap-1">
          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1e293b] text-white font-medium">1</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 font-medium disabled:opacity-50" disabled>&gt;</button>
        </div>
      </div>

      {/* Modals */}
      {selectedKunjungan && (
        <FormTagihanModal
          kunjungan={selectedKunjungan}
          onClose={() => setSelectedKunjungan(null)}
        />
      )}
      
      {viewKunjungan && (
        <DetailTagihanModal
          kunjungan={viewKunjungan}
          onClose={() => setViewKunjungan(null)}
        />
      )}
    </div>
  )
}
