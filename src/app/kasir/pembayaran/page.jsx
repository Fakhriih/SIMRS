import { prisma } from "@/lib/prisma"
import PembayaranClientWrapper from "./PembayaranClientWrapper"

export default async function PembayaranPage() {
  // Query tagihan yang belum bayar
  const tagihanBelumBayar = await prisma.tagihan.findMany({
    where: {
      status_bayar: "belum_bayar",
    },
    include: {
      Kunjungan: {
        include: {
          Pasien: true,
        },
      },
    },
    orderBy: {
      id: "desc",
    },
  })

  // Serialize dates for client component
  const serialized = tagihanBelumBayar.map((t) => ({
    ...t,
    Kunjungan: {
      ...t.Kunjungan,
      tanggal: t.Kunjungan.tanggal.toISOString(),
      Pasien: {
        ...t.Kunjungan.Pasien,
        tanggal_lahir: t.Kunjungan.Pasien.tanggal_lahir.toISOString(),
      },
    },
  }))

  return <PembayaranClientWrapper tagihanList={serialized} />
}
