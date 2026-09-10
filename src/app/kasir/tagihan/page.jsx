import { prisma } from "@/lib/prisma"
import TagihanClientWrapper from "./TagihanClientWrapper"

export default async function TagihanPage() {
  // Query kunjungan selesai (baik yang sudah maupun belum punya tagihan)
  const kunjunganSelesai = await prisma.kunjungan.findMany({
    where: {
      status: "selesai",
    },
    include: {
      Pasien: true,
      Dokter: true,
      Tagihan: true, // Sertakan tagihan untuk mengecek status "Sudah Dibuat"
    },
    orderBy: {
      tanggal: "desc",
    },
  })

  // Serialize dates for client component
  const serialized = kunjunganSelesai.map((k) => ({
    ...k,
    tanggal: k.tanggal.toISOString(),
    Pasien: {
      ...k.Pasien,
      tanggal_lahir: k.Pasien.tanggal_lahir.toISOString(),
    },
  }))

  return <TagihanClientWrapper kunjunganList={serialized} />
}
