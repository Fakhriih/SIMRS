"use client"

export default function DetailTagihanModal({ kunjungan, onClose }) {
  const tagihan = kunjungan.Tagihan && kunjungan.Tagihan[0];

  if (!tagihan) return null;

  const invoiceId = `INV-2026-${String(tagihan.id).padStart(4, "0")}`
  
  const formatRupiah = (num) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num)
  }

  const isLunas = tagihan.status_bayar === "lunas"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-[fadeIn_0.2s_ease-out]">
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-100 px-6 py-5 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Detail Tagihan</h3>
            <p className="text-sm text-slate-500 font-mono mt-0.5">{invoiceId}</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              isLunas ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
            }`}
          >
            {isLunas ? "LUNAS" : "BELUM LUNAS"}
          </span>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Info Pasien */}
          <div className="flex flex-col gap-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Informasi Pasien</span>
            <div className="font-medium text-slate-800 text-sm">
              {kunjungan.Pasien.nama} <span className="text-slate-400 font-normal">({kunjungan.Pasien.no_rm})</span>
            </div>
            <div className="text-sm text-slate-500">
              Poli: <span className="text-slate-700">{kunjungan.poli}</span> — Dokter: <span className="text-slate-700">{kunjungan.Dokter.nama}</span>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Rincian Biaya */}
          <div className="flex flex-col gap-2">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Rincian Layanan</span>
            <div className="bg-slate-50 rounded-xl p-4 text-sm border border-slate-100">
              <ul className="space-y-2 text-slate-600">
                {tagihan.rincian.split("\n").map((item, i) => {
                  const parts = item.split(":")
                  return (
                    <li key={i} className="flex justify-between items-center border-b border-slate-200/60 pb-2 last:border-0 last:pb-0">
                      <span>{parts[0]}</span>
                      {parts[1] && <span className="font-medium text-slate-800">{parts[1]}</span>}
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-end bg-slate-800 text-white p-4 rounded-xl">
            <span className="text-sm text-slate-300 font-medium">Total Tagihan</span>
            <span className="text-2xl font-bold font-mono tracking-tight">{formatRupiah(tagihan.total)}</span>
          </div>

          {/* Actions */}
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors font-semibold text-sm"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}
