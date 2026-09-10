"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

/**
 * Mendapatkan daftar pasien dengan filter pencarian nama atau NIK.
 */
export async function getPasiens(searchQuery = "") {
  try {
    const query = searchQuery.trim()
    const pasiens = await prisma.pasien.findMany({
      where: query
        ? {
            OR: [
              { nama: { contains: query } },
              { nik: { contains: query } },
              { no_rm: { contains: query } },
            ],
          }
        : undefined,
      include: {
        Kunjungan: {
          orderBy: { tanggal: 'desc' },
          take: 1,
        },
      },
      orderBy: { id: 'desc' },
    })
    return { success: true, data: pasiens }
  } catch (error) {
    console.error("Error getPasiens:", error)
    return { success: false, error: "Gagal mengambil data pasien." }
  }
}

/**
 * Mendapatkan data detail pasien berdasarkan ID.
 */
export async function getPasienById(id) {
  try {
    const pasienId = parseInt(id)
    if (isNaN(pasienId)) return { success: false, error: "ID Pasien tidak valid." }

    const pasien = await prisma.pasien.findUnique({
      where: { id: pasienId },
      include: {
        Kunjungan: {
          include: { Dokter: true },
          orderBy: { tanggal: 'desc' },
        },
      },
    })
    if (!pasien) return { success: false, error: "Pasien tidak ditemukan." }
    return { success: true, data: pasien }
  } catch (error) {
    console.error("Error getPasienById:", error)
    return { success: false, error: "Gagal mengambil detail pasien." }
  }
}

/**
 * Otomatisasi generate Nomor Rekam Medis (No. RM)
 * Format: RM001, RM002, dst.
 */
export async function generateNoRm() {
  const lastPasien = await prisma.pasien.findFirst({
    orderBy: { id: 'desc' },
  })

  if (!lastPasien) {
    return 'RM001'
  }

  const lastNoRm = lastPasien.no_rm
  const match = lastNoRm.match(/\d+/)
  if (match) {
    const nextNum = parseInt(match[0], 10) + 1
    return `RM${String(nextNum).padStart(3, '0')}`
  } else {
    return `RM${String(lastPasien.id + 1).padStart(3, '0')}`
  }
}

/**
 * Menambahkan data Pasien baru ke database.
 */
export async function createPasienAction(formData) {
  try {
    const nama = formData.get("nama")?.trim()
    const nik = formData.get("nik")?.trim()
    const tanggal_lahir_str = formData.get("tanggal_lahir")
    const jenis_kelamin = formData.get("jenis_kelamin")
    const alamat = formData.get("alamat")?.trim()
    const no_telp = formData.get("no_telp")?.trim()

    // Validasi dasar
    if (!nama || !nik || !tanggal_lahir_str || !jenis_kelamin || !alamat || !no_telp) {
      return { success: false, error: "Semua kolom form wajib diisi!" }
    }

    if (nik.length < 10) {
      return { success: false, error: "NIK minimal 10-16 digit angka." }
    }

    // Cek apakah NIK sudah pernah terdaftar
    const existingNik = await prisma.pasien.findUnique({
      where: { nik },
    })
    if (existingNik) {
      return { success: false, error: `Pasien dengan NIK ${nik} sudah terdaftar (${existingNik.nama}).` }
    }

    // Generate No RM otomatis
    const no_rm = await generateNoRm()

    const newPasien = await prisma.pasien.create({
      data: {
        no_rm,
        nama,
        nik,
        tanggal_lahir: new Date(tanggal_lahir_str),
        jenis_kelamin,
        alamat,
        no_telp,
      },
    })

    revalidatePath("/pendaftaran")
    return { 
      success: true, 
      message: `Pasien ${nama} (No. RM: ${no_rm}) berhasil didaftarkan!`,
      data: newPasien 
    }
  } catch (error) {
    console.error("Error createPasienAction:", error)
    return { success: false, error: "Terjadi kesalahan saat menyimpan data pasien." }
  }
}

/**
 * Mengambil daftar dokter untuk pilihan kunjungan.
 */
export async function getDokters() {
  try {
    const dokters = await prisma.dokter.findMany({
      orderBy: { nama: 'asc' },
    })
    return { success: true, data: dokters }
  } catch (error) {
    console.error("Error getDokters:", error)
    return { success: false, error: "Gagal mengambil daftar dokter." }
  }
}

/**
 * Mengambil daftar kunjungan (untuk antrean pendaftaran).
 */
export async function getKunjungans() {
  try {
    const kunjungans = await prisma.kunjungan.findMany({
      include: {
        Pasien: true,
        Dokter: true,
      },
      orderBy: { id: 'desc' },
      take: 20,
    })
    return { success: true, data: kunjungans }
  } catch (error) {
    console.error("Error getKunjungans:", error)
    return { success: false, error: "Gagal mengambil daftar kunjungan." }
  }
}

/**
 * Membuat data Kunjungan baru dengan status "menunggu".
 */
export async function createKunjunganAction(formData) {
  try {
    const pasien_id = parseInt(formData.get("pasien_id"))
    const dokter_id = parseInt(formData.get("dokter_id"))
    const poli = formData.get("poli")?.trim()
    const tanggal_str = formData.get("tanggal")

    if (isNaN(pasien_id) || isNaN(dokter_id) || !poli) {
      return { success: false, error: "Pilih pasien, poli, dan dokter tujuan secara valid!" }
    }

    const tanggal = tanggal_str ? new Date(tanggal_str) : new Date()

    const newKunjungan = await prisma.kunjungan.create({
      data: {
        pasien_id,
        dokter_id,
        tanggal,
        poli,
        status: "menunggu",
      },
      include: {
        Pasien: true,
        Dokter: true,
      },
    })

    revalidatePath("/pendaftaran")
    return {
      success: true,
      message: `Kunjungan pasien ${newKunjungan.Pasien.nama} ke ${poli} (${newKunjungan.Dokter.nama}) berhasil dibuat! Status: Menunggu`,
      data: newKunjungan,
    }
  } catch (error) {
    console.error("Error createKunjunganAction:", error)
    return { success: false, error: "Gagal membuat data kunjungan." }
  }
}
