"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getDaftarObat() {
  try {
    const obat = await prisma.obat.findMany({
      orderBy: {
        nama_obat: 'asc'
      }
    })
    return obat
  } catch (error) {
    console.error("Gagal mengambil data obat:", error)
    throw new Error("Gagal mengambil data obat")
  }
}

export async function tambahObat(data) {
  try {
    await prisma.obat.create({
      data: {
        nama_obat: data.nama_obat,
        stok: parseInt(data.stok),
        satuan: data.satuan,
        harga: parseFloat(data.harga),
      }
    })
    revalidatePath("/farmasi")
    return { success: true }
  } catch (error) {
    console.error("Gagal menambah obat:", error)
    return { success: false, error: "Gagal menyimpan data obat" }
  }
}

export async function editObat(id, data) {
  try {
    await prisma.obat.update({
      where: { id: parseInt(id) },
      data: {
        nama_obat: data.nama_obat,
        stok: parseInt(data.stok),
        satuan: data.satuan,
        harga: parseFloat(data.harga),
      }
    })
    revalidatePath("/farmasi")
    return { success: true }
  } catch (error) {
    console.error("Gagal mengubah obat:", error)
    return { success: false, error: "Gagal mengubah data obat" }
  }
}
