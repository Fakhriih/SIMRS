import { prisma } from "@/lib/prisma"

export default async function DashboardPage() {
  // ── Hitung range hari ini ──
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
  const tomorrowStart = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000)

  // ── Query paralel untuk performa ──
  const [jumlahPasienHariIni, jumlahMenunggu, pendapatanAggregate, kunjunganTerbaru] =
    await Promise.all([
      prisma.kunjungan.count({
        where: {
          tanggal: { gte: todayStart, lt: tomorrowStart },
        },
      }),
      prisma.kunjungan.count({
        where: { status: "menunggu" },
      }),
      prisma.tagihan.aggregate({
        _sum: { total: true },
        where: {
          status_bayar: "lunas",
          Kunjungan: {
            tanggal: { gte: todayStart, lt: tomorrowStart },
          },
        },
      }),
      prisma.kunjungan.findMany({
        where: {
          tanggal: { gte: todayStart, lt: tomorrowStart },
        },
        include: {
          Pasien: true,
          Dokter: true,
        },
        orderBy: {
          tanggal: "desc",
        },
        take: 10,
      }),
    ])

  const pendapatanHariIni = pendapatanAggregate._sum.total || 0

  const formatRupiah = (num) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num)
  }

  const formatWaktu = (date) => {
    return new Date(date).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const cards = [
    {
      title: "Kunjungan Hari Ini",
      value: jumlahPasienHariIni,
      icon: "👥",
      desc: "↑ +12% dari kemarin",
      bgLight: "bg-blue-50/60",
      textAccent: "text-blue-600",
      textColor: "text-slate-800"
    },
    {
      title: "Antrian Menunggu",
      value: jumlahMenunggu,
      icon: "🕒",
      desc: "5 prioritas tinggi",
      bgLight: "bg-teal-50/60",
      textAccent: "text-teal-600",
      textColor: "text-slate-800"
    },
    {
      title: "Pendapatan Hari Ini",
      value: formatRupiah(pendapatanHariIni),
      icon: "💳",
      desc: "↑ +8.5% dari kemarin",
      bgLight: "bg-emerald-50/60",
      textAccent: "text-emerald-600",
      textColor: "text-slate-800"
    },
  ]

  const statusBadge = (status) => {
    switch (status) {
      case "menunggu":
        return "bg-amber-50 text-amber-600 border border-amber-200"
      case "diperiksa":
      case "dalam proses":
        return "bg-blue-50 text-blue-600 border border-blue-200"
      case "selesai":
        return "bg-emerald-50 text-emerald-600 border border-emerald-200"
      default:
        return "bg-slate-50 text-slate-600 border border-slate-200"
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[22px] font-bold text-slate-800">Ringkasan Hari Ini</h2>
        <div className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          LIVE UPDATE
        </div>
      </div>

      {/* ═══ Cards ═══ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-2xl bg-white border border-slate-200 p-6 flex flex-col relative shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]"
          >
            {/* Dot top right */}
            <div className="absolute top-6 right-6 w-3 h-3 rounded-full bg-slate-100"></div>

            <div
              className={`w-12 h-12 rounded-xl ${card.bgLight} flex items-center justify-center text-[22px] mb-4 ${card.textAccent}`}
            >
              {card.icon}
            </div>
            
            <p className="text-sm font-medium text-slate-500 mb-1">{card.title}</p>
            <p className="text-[32px] font-bold text-slate-800 leading-none mb-3">{card.value}</p>
            <p className="text-xs font-semibold text-slate-600">{card.desc}</p>
          </div>
        ))}
      </div>

      {/* ═══ Tabel Kunjungan Terbaru ═══ */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100">
          <h3 className="text-[17px] font-bold text-slate-800">Kunjungan Terbaru</h3>
          <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">
            Lihat Semua →
          </button>
        </div>

        {kunjunganTerbaru.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <p className="font-medium">Belum ada kunjungan hari ini</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400">
                  <th className="text-left px-6 py-4 font-semibold uppercase tracking-wider">NO.</th>
                  <th className="text-left px-6 py-4 font-semibold uppercase tracking-wider">WAKTU</th>
                  <th className="text-left px-6 py-4 font-semibold uppercase tracking-wider">ID PASIEN</th>
                  <th className="text-left px-6 py-4 font-semibold uppercase tracking-wider">NAMA PASIEN</th>
                  <th className="text-left px-6 py-4 font-semibold uppercase tracking-wider">POLIKLINIK</th>
                  <th className="text-left px-6 py-4 font-semibold uppercase tracking-wider">DOKTER</th>
                  <th className="text-left px-6 py-4 font-semibold uppercase tracking-wider">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {kunjunganTerbaru.map((k, index) => (
                  <tr
                    key={k.id}
                    className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-slate-500">{index + 1}</td>
                    <td className="px-6 py-4 font-medium text-slate-600">
                      {formatWaktu(k.tanggal)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                        {k.Pasien.no_rm}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800">{k.Pasien.nama}</td>
                    <td className="px-6 py-4 text-slate-600">{k.poli}</td>
                    <td className="px-6 py-4 text-slate-600">{k.Dokter.nama}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold capitalize tracking-wide ${statusBadge(k.status)}`}
                      >
                        {k.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
