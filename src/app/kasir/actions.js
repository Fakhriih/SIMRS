"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

/**
 * Server Action: Buat tagihan baru untuk kunjungan yang sudah selesai.
 * Dipanggil dari form di halaman /kasir/tagihan.
 */
export async function buatTagihan(formData) {
  const kunjungan_id = parseInt(formData.get("kunjungan_id"))
  const rincian = formData.get("rincian")
  const total = parseFloat(formData.get("total"))

  if (!kunjungan_id || !rincian || isNaN(total) || total <= 0) {
    return { error: "Semua field harus diisi dengan benar." }
  }

  try {
    // Pastikan kunjungan ada dan belum punya tagihan
    const kunjungan = await prisma.kunjungan.findUnique({
      where: { id: kunjungan_id },
      include: { Tagihan: true },
    })

    if (!kunjungan) {
      return { error: "Kunjungan tidak ditemukan." }
    }

    if (kunjungan.Tagihan.length > 0) {
      return { error: "Kunjungan ini sudah memiliki tagihan." }
    }

    await prisma.tagihan.create({
      data: {
        kunjungan_id,
        rincian,
        total,
        status_bayar: "belum_bayar",
      },
    })

    revalidatePath("/kasir/tagihan")
    revalidatePath("/kasir/pembayaran")
    revalidatePath("/dashboard")

    return { success: true }
  } catch (error) {
    console.error("Error membuat tagihan:", error)
    return { error: "Gagal membuat tagihan. Silakan coba lagi." }
  }
}

/**
 * Server Action: Bayar tagihan — ubah status_bayar menjadi "lunas".
 * Dipanggil dari tombol Bayar di halaman /kasir/pembayaran.
 */
export async function bayarTagihan(formData) {
  const tagihan_id = parseInt(formData.get("tagihan_id"))

  if (!tagihan_id) {
    return { error: "ID tagihan tidak valid." }
  }

  try {
    const tagihan = await prisma.tagihan.findUnique({
      where: { id: tagihan_id },
    })

    if (!tagihan) {
      return { error: "Tagihan tidak ditemukan." }
    }

    if (tagihan.status_bayar === "lunas") {
      return { error: "Tagihan ini sudah lunas." }
    }

    await prisma.tagihan.update({
      where: { id: tagihan_id },
      data: { status_bayar: "lunas" },
    })

    revalidatePath("/kasir/pembayaran")
    revalidatePath("/kasir/tagihan")
    revalidatePath("/dashboard")

    return { success: true }
  } catch (error) {
    console.error("Error membayar tagihan:", error)
    return { error: "Gagal memproses pembayaran. Silakan coba lagi." }
  }
}
