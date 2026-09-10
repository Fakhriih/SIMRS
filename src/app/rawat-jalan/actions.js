'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

/**
 * Menyimpan hasil pemeriksaan dokter ke tabel RekamMedis,
 * menyimpan resep obat (opsional), dan mengubah status kunjungan menjadi 'selesai' / 'diperiksa'.
 */
export async function simpanPemeriksaan(formData) {
  const kunjunganId = formData.get('kunjungan_id')
  const keluhan = formData.get('keluhan')
  const diagnosis = formData.get('diagnosis')
  const tindakan = formData.get('tindakan')
  const statusKunjungan = formData.get('status_kunjungan') || 'selesai'

  // Data resep obat (opsional)
  const namaObat = formData.get('nama_obat')
  const dosis = formData.get('dosis')
  const jumlah = formData.get('jumlah')

  if (!kunjunganId || !keluhan || !diagnosis || !tindakan) {
    throw new Error('Semua data pemeriksaan (keluhan, diagnosis, tindakan) wajib diisi.')
  }

  const idKunjungan = parseInt(kunjunganId, 10)

  // 1. Simpan Rekam Medis
  const rekamMedis = await prisma.rekamMedis.create({
    data: {
      kunjungan_id: idKunjungan,
      keluhan: keluhan.toString().trim(),
      diagnosis: diagnosis.toString().trim(),
      tindakan: tindakan.toString().trim(),
    },
  })

  // 2. Simpan Resep Obat jika dokter meresepkan
  if (namaObat && namaObat.toString().trim() !== '') {
    const qty = parseInt(jumlah, 10) || 1
    const namaObatStr = namaObat.toString().trim()
    const dosisStr = dosis ? dosis.toString().trim() : 'Sesuai anjuran dokter'

    await prisma.resepObat.create({
      data: {
        rekam_medis_id: rekamMedis.id,
        nama_obat: namaObatStr,
        dosis: dosisStr,
        jumlah: qty,
      },
    })

    // Kurangi stok obat jika ada di database
    const obatTerdaftar = await prisma.obat.findFirst({
      where: { nama_obat: namaObatStr },
    })

    if (obatTerdaftar && obatTerdaftar.stok >= qty) {
      await prisma.obat.update({
        where: { id: obatTerdaftar.id },
        data: { stok: obatTerdaftar.stok - qty },
      })
    }
  }

  // 3. Ubah status Kunjungan menjadi 'selesai' atau 'diperiksa'
  await prisma.kunjungan.update({
    where: { id: idKunjungan },
    data: {
      status: statusKunjungan.toString().trim().toLowerCase(),
    },
  })

  // 4. Refresh cache halaman antrian
  revalidatePath('/rawat-jalan')
  revalidatePath(`/rawat-jalan/periksa/${idKunjungan}`)
  revalidatePath('/')

  // 5. Kembali ke antrian dengan notifikasi sukses
  redirect('/rawat-jalan?status=sukses')
}

/**
 * Menambahkan antrian kunjungan baru (berguna untuk demo ke dosen).
 */
export async function tambahAntrianBaru(formData) {
  const pasienId = formData.get('pasien_id')
  const dokterId = formData.get('dokter_id')
  const poli = formData.get('poli')

  if (!pasienId || !dokterId || !poli) {
    throw new Error('Pasien, Dokter, dan Poli wajib dipilih.')
  }

  await prisma.kunjungan.create({
    data: {
      pasien_id: parseInt(pasienId, 10),
      dokter_id: parseInt(dokterId, 10),
      poli: poli.toString().trim(),
      status: 'menunggu',
      tanggal: new Date(),
    },
  })

  revalidatePath('/rawat-jalan')
  revalidatePath('/')
  redirect('/rawat-jalan?status=antrian_baru')
}

/**
 * Mengubah status kunjungan secara cepat (misal: panggil pasien -> status jadi 'diperiksa')
 */
export async function ubahStatusKunjungan(kunjunganId, statusBaru) {
  await prisma.kunjungan.update({
    where: { id: parseInt(kunjunganId, 10) },
    data: { status: statusBaru.toLowerCase() },
  })

  revalidatePath('/rawat-jalan')
}
