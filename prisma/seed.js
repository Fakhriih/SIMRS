const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Memulai proses seeding database SIMRS...')

  // 1. Seed Users
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      nama: 'Administrator',
      username: 'admin',
      password: 'password123',
      role: 'ADMIN',
    },
  })

  await prisma.user.upsert({
    where: { username: 'petugas' },
    update: {},
    create: {
      nama: 'Petugas Rawat Jalan',
      username: 'petugas',
      password: 'password123',
      role: 'PETUGAS',
    },
  })
  console.log('✅ Users seeded')

  // 2. Seed Dokter
  let dokter1 = await prisma.dokter.findFirst({ where: { nama: 'dr. Andi Sp.PD' } })
  if (!dokter1) {
    dokter1 = await prisma.dokter.create({
      data: {
        nama: 'dr. Andi Sp.PD',
        spesialisasi: 'Penyakit Dalam',
        jadwal_praktik: 'Senin - Rabu (08:00 - 12:00)',
      }
    })
  }

  let dokter2 = await prisma.dokter.findFirst({ where: { nama: 'dr. Budi Sp.A' } })
  if (!dokter2) {
    dokter2 = await prisma.dokter.create({
      data: {
        nama: 'dr. Budi Sp.A',
        spesialisasi: 'Anak',
        jadwal_praktik: 'Selasa - Kamis (10:00 - 14:00)',
      }
    })
  }

  let dokter3 = await prisma.dokter.findFirst({ where: { nama: 'dr. Citra Umum' } })
  if (!dokter3) {
    dokter3 = await prisma.dokter.create({
      data: {
        nama: 'dr. Citra Umum',
        spesialisasi: 'Umum',
        jadwal_praktik: 'Jumat - Sabtu (08:00 - 16:00)',
      }
    })
  }
  console.log('✅ Dokters seeded')

  // 3. Seed Pasien
  const dummyPasiens = [
    { no_rm: 'RM001', nama: 'Eka Kurniawan', nik: '35700000001', tanggal_lahir: new Date('1990-01-01'), jenis_kelamin: 'L', alamat: 'Jl. Merdeka No. 1, Malang', no_telp: '081234567891' },
    { no_rm: 'RM002', nama: 'Dwi Rahayu', nik: '35700000002', tanggal_lahir: new Date('2018-05-12'), jenis_kelamin: 'P', alamat: 'Jl. Kemerdekaan No. 2, Malang', no_telp: '081234567892' },
    { no_rm: 'RM003', nama: 'Tri Santoso', nik: '35700000003', tanggal_lahir: new Date('1985-03-03'), jenis_kelamin: 'L', alamat: 'Jl. Pahlawan No. 3, Malang', no_telp: '081234567893' },
    { no_rm: 'RM004', nama: 'Catur Lestari', nik: '35700000004', tanggal_lahir: new Date('1978-04-04'), jenis_kelamin: 'P', alamat: 'Jl. Sudirman No. 4, Malang', no_telp: '081234567894' },
    { no_rm: 'RM005', nama: 'Panca Pratama', nik: '35700000005', tanggal_lahir: new Date('2000-08-15'), jenis_kelamin: 'L', alamat: 'Jl. Diponegoro No. 5, Malang', no_telp: '081234567895' },
  ]

  const savedPasiens = []
  for (const pasien of dummyPasiens) {
    const saved = await prisma.pasien.upsert({
      where: { nik: pasien.nik },
      update: {
        nama: pasien.nama,
        alamat: pasien.alamat,
        tanggal_lahir: pasien.tanggal_lahir,
      },
      create: pasien,
    })
    savedPasiens.push(saved)
  }
  console.log('✅ Pasiens seeded')

  // 4. Seed Obat
  const dummyObat = [
    { nama_obat: 'Paracetamol 500mg', stok: 100, satuan: 'Tablet', harga: 5000 },
    { nama_obat: 'Amoxicillin 500mg', stok: 80, satuan: 'Kapsul', harga: 12000 },
    { nama_obat: 'Cetirizine 10mg', stok: 60, satuan: 'Tablet', harga: 8000 },
    { nama_obat: 'Antasida Doen', stok: 50, satuan: 'Tablet Kunyah', harga: 4000 },
    { nama_obat: 'Vitamin C 500mg', stok: 150, satuan: 'Tablet', harga: 6000 },
    { nama_obat: 'Ambroxol 30mg', stok: 75, satuan: 'Tablet', harga: 7000 },
  ]

  for (const obat of dummyObat) {
    const exists = await prisma.obat.findFirst({ where: { nama_obat: obat.nama_obat } })
    if (!exists) {
      await prisma.obat.create({ data: obat })
    }
  }
  console.log('✅ Obat seeded')

  // 5. Seed Kunjungan & Antrian Rawat Jalan
  const kunjunganCount = await prisma.kunjungan.count()
  if (kunjunganCount === 0) {
    const now = new Date()

    // Antrian Menunggu 1: Pasien Eka di Poli Penyakit Dalam
    await prisma.kunjungan.create({
      data: {
        pasien_id: savedPasiens[0].id,
        dokter_id: dokter1.id,
        tanggal: new Date(now.getTime() - 40 * 60000), // 40 menit lalu
        poli: 'Poli Penyakit Dalam',
        status: 'menunggu',
      }
    })

    // Antrian Menunggu 2: Pasien Dwi (Anak) di Poli Anak
    await prisma.kunjungan.create({
      data: {
        pasien_id: savedPasiens[1].id,
        dokter_id: dokter2.id,
        tanggal: new Date(now.getTime() - 25 * 60000), // 25 menit lalu
        poli: 'Poli Anak',
        status: 'menunggu',
      }
    })

    // Antrian Menunggu 3: Pasien Tri di Poli Umum
    await prisma.kunjungan.create({
      data: {
        pasien_id: savedPasiens[2].id,
        dokter_id: dokter3.id,
        tanggal: new Date(now.getTime() - 15 * 60000), // 15 menit lalu
        poli: 'Poli Umum',
        status: 'menunggu',
      }
    })

    // Antrian Menunggu 4: Pasien Catur di Poli Penyakit Dalam
    await prisma.kunjungan.create({
      data: {
        pasien_id: savedPasiens[3].id,
        dokter_id: dokter1.id,
        tanggal: new Date(now.getTime() - 5 * 60000), // 5 menit lalu
        poli: 'Poli Penyakit Dalam',
        status: 'menunggu',
      }
    })

    // Kunjungan 5 (Selesai): Pasien Panca di Poli Umum dengan Rekam Medis
    const kunjunganSelesai = await prisma.kunjungan.create({
      data: {
        pasien_id: savedPasiens[4].id,
        dokter_id: dokter3.id,
        tanggal: new Date(now.getTime() - 120 * 60000), // 2 jam lalu
        poli: 'Poli Umum',
        status: 'selesai',
      }
    })

    const rm = await prisma.rekamMedis.create({
      data: {
        kunjungan_id: kunjunganSelesai.id,
        keluhan: 'Demam tinggi selama 2 hari, sakit kepala, dan lemas',
        diagnosis: 'Febris Akut susp. Common Cold',
        tindakan: 'Istirahat tirah baring, kompres hangat, perbanyak minum air putih',
      }
    })

    await prisma.resepObat.create({
      data: {
        rekam_medis_id: rm.id,
        nama_obat: 'Paracetamol 500mg',
        dosis: '3 x 1 tablet sesudah makan',
        jumlah: 10,
      }
    })

    await prisma.resepObat.create({
      data: {
        rekam_medis_id: rm.id,
        nama_obat: 'Vitamin C 500mg',
        dosis: '1 x 1 tablet pagi',
        jumlah: 10,
      }
    })

    console.log('✅ Kunjungan & Rekam Medis seeded')
  } else {
    console.log(`ℹ️ Data kunjungan sudah ada (${kunjunganCount} data), melewati seeding kunjungan`)
  }

  console.log('🎉 Seeding selesai dengan sukses!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error saat seeding:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
