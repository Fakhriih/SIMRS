const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // ── Bersihkan data lama (urutan: child → parent) ──
  await prisma.resepObat.deleteMany()
  await prisma.rekamMedis.deleteMany()
  await prisma.tagihan.deleteMany()
  await prisma.kunjungan.deleteMany()
  await prisma.pasien.deleteMany()
  await prisma.dokter.deleteMany()
  // User di-upsert, jadi tidak perlu delete

  // ══════════════════════════════════════════════════
  // 1. USERS
  // ══════════════════════════════════════════════════
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
      nama: 'Petugas Pendaftaran',
      username: 'petugas',
      password: 'password123',
      role: 'PETUGAS',
    },
  })

  await prisma.user.upsert({
    where: { username: 'kasir' },
    update: {},
    create: {
      nama: 'Kasir RS',
      username: 'kasir',
      password: 'password123',
      role: 'KASIR',
    },
  })

  console.log('✅ Users seeded')

  // ══════════════════════════════════════════════════
  // 2. DOKTER
  // ══════════════════════════════════════════════════
  const dokter1 = await prisma.dokter.create({
    data: {
      nama: 'dr. Andi Sp.PD',
      spesialisasi: 'Penyakit Dalam',
      jadwal_praktik: 'Senin - Rabu (08:00 - 12:00)',
    },
  })
  const dokter2 = await prisma.dokter.create({
    data: {
      nama: 'dr. Budi Sp.A',
      spesialisasi: 'Anak',
      jadwal_praktik: 'Selasa - Kamis (10:00 - 14:00)',
    },
  })
  const dokter3 = await prisma.dokter.create({
    data: {
      nama: 'dr. Citra Umum',
      spesialisasi: 'Umum',
      jadwal_praktik: 'Jumat - Sabtu (08:00 - 16:00)',
    },
  })

  console.log('✅ Dokter seeded')

  // ══════════════════════════════════════════════════
  // 3. PASIEN
  // ══════════════════════════════════════════════════
  const dummyPasiens = [
    { no_rm: 'RM001', nama: 'Eka Prasetya',    nik: '35700000001', tanggal_lahir: new Date('1990-01-15'), jenis_kelamin: 'L', alamat: 'Jl. Merdeka 1, Surabaya',     no_telp: '081234567891' },
    { no_rm: 'RM002', nama: 'Dwi Lestari',     nik: '35700000002', tanggal_lahir: new Date('1992-02-20'), jenis_kelamin: 'P', alamat: 'Jl. Kemerdekaan 2, Malang',    no_telp: '081234567892' },
    { no_rm: 'RM003', nama: 'Tri Wahyudi',     nik: '35700000003', tanggal_lahir: new Date('1985-03-10'), jenis_kelamin: 'L', alamat: 'Jl. Pahlawan 3, Sidoarjo',     no_telp: '081234567893' },
    { no_rm: 'RM004', nama: 'Catur Wulandari', nik: '35700000004', tanggal_lahir: new Date('1978-04-25'), jenis_kelamin: 'P', alamat: 'Jl. Sudirman 4, Gresik',       no_telp: '081234567894' },
    { no_rm: 'RM005', nama: 'Panca Nugroho',   nik: '35700000005', tanggal_lahir: new Date('2000-05-05'), jenis_kelamin: 'L', alamat: 'Jl. Diponegoro 5, Mojokerto',  no_telp: '081234567895' },
    { no_rm: 'RM006', nama: 'Sari Indah',      nik: '35700000006', tanggal_lahir: new Date('1995-06-12'), jenis_kelamin: 'P', alamat: 'Jl. Ahmad Yani 6, Surabaya',   no_telp: '081234567896' },
  ]

  const pasiens = []
  for (const p of dummyPasiens) {
    const created = await prisma.pasien.create({ data: p })
    pasiens.push(created)
  }

  console.log('✅ Pasien seeded')

  // ══════════════════════════════════════════════════
  // 4. OBAT
  // ══════════════════════════════════════════════════
  await prisma.obat.deleteMany()
  const obats = [
    { nama_obat: 'Paracetamol 500mg',  stok: 200, satuan: 'Tablet', harga: 1500 },
    { nama_obat: 'Amoxicillin 500mg',  stok: 150, satuan: 'Kapsul', harga: 3500 },
    { nama_obat: 'Omeprazole 20mg',    stok: 100, satuan: 'Kapsul', harga: 5000 },
    { nama_obat: 'Antasida Sirup',     stok: 80,  satuan: 'Botol',  harga: 15000 },
    { nama_obat: 'Vitamin C 1000mg',   stok: 300, satuan: 'Tablet', harga: 2000 },
  ]
  for (const o of obats) {
    await prisma.obat.create({ data: o })
  }

  console.log('✅ Obat seeded')

  // ══════════════════════════════════════════════════
  // 5. KUNJUNGAN HARI INI
  //    Menggunakan tanggal hari ini supaya dashboard langsung terisi
  // ══════════════════════════════════════════════════
  const today = new Date()
  today.setHours(8, 0, 0, 0) // jam 08:00 pagi

  // ── Kunjungan 1 & 2 → status "menunggu" (belum diperiksa)
  const kunj1 = await prisma.kunjungan.create({
    data: {
      pasien_id: pasiens[0].id,
      dokter_id: dokter1.id,
      tanggal: new Date(today.getTime()),
      poli: 'Penyakit Dalam',
      status: 'menunggu',
    },
  })
  const kunj2 = await prisma.kunjungan.create({
    data: {
      pasien_id: pasiens[1].id,
      dokter_id: dokter2.id,
      tanggal: new Date(today.getTime() + 30 * 60000),
      poli: 'Anak',
      status: 'menunggu',
    },
  })

  // ── Kunjungan 3 & 4 → status "selesai" TANPA tagihan (siap dibuat tagihan oleh kasir)
  const kunj3 = await prisma.kunjungan.create({
    data: {
      pasien_id: pasiens[2].id,
      dokter_id: dokter1.id,
      tanggal: new Date(today.getTime() + 60 * 60000),
      poli: 'Penyakit Dalam',
      status: 'selesai',
    },
  })
  const kunj4 = await prisma.kunjungan.create({
    data: {
      pasien_id: pasiens[3].id,
      dokter_id: dokter3.id,
      tanggal: new Date(today.getTime() + 90 * 60000),
      poli: 'Umum',
      status: 'selesai',
    },
  })

  // ── Kunjungan 5 & 6 → status "selesai" DENGAN tagihan (sudah diproses)
  const kunj5 = await prisma.kunjungan.create({
    data: {
      pasien_id: pasiens[4].id,
      dokter_id: dokter2.id,
      tanggal: new Date(today.getTime() + 120 * 60000),
      poli: 'Anak',
      status: 'selesai',
    },
  })
  const kunj6 = await prisma.kunjungan.create({
    data: {
      pasien_id: pasiens[5].id,
      dokter_id: dokter3.id,
      tanggal: new Date(today.getTime() + 150 * 60000),
      poli: 'Umum',
      status: 'selesai',
    },
  })

  console.log('✅ Kunjungan seeded')

  // ══════════════════════════════════════════════════
  // 6. REKAM MEDIS (untuk kunjungan yang "selesai")
  // ══════════════════════════════════════════════════
  await prisma.rekamMedis.create({
    data: {
      kunjungan_id: kunj3.id,
      keluhan: 'Nyeri lambung dan mual',
      diagnosis: 'Gastritis akut',
      tindakan: 'Pemeriksaan fisik, resep obat',
    },
  })
  await prisma.rekamMedis.create({
    data: {
      kunjungan_id: kunj4.id,
      keluhan: 'Demam 3 hari, batuk pilek',
      diagnosis: 'ISPA (Infeksi Saluran Pernapasan Atas)',
      tindakan: 'Pemeriksaan fisik, resep obat',
    },
  })
  await prisma.rekamMedis.create({
    data: {
      kunjungan_id: kunj5.id,
      keluhan: 'Anak rewel, demam tinggi',
      diagnosis: 'Demam Dengue',
      tindakan: 'Pemeriksaan darah, infus, resep obat',
    },
  })
  await prisma.rekamMedis.create({
    data: {
      kunjungan_id: kunj6.id,
      keluhan: 'Pusing dan lemas',
      diagnosis: 'Anemia ringan',
      tindakan: 'Pemeriksaan lab, suplemen zat besi',
    },
  })

  console.log('✅ Rekam Medis seeded')

  // ══════════════════════════════════════════════════
  // 7. TAGIHAN (untuk kunjungan 5 & 6 — sudah diproses kasir)
  //    + 2 tagihan dari kunjungan lama untuk demo pembayaran
  // ══════════════════════════════════════════════════

  // Tagihan LUNAS (muncul di pendapatan dashboard)
  await prisma.tagihan.create({
    data: {
      kunjungan_id: kunj5.id,
      rincian: 'Konsultasi dokter anak: Rp 150.000\nPemeriksaan darah: Rp 85.000\nInfus: Rp 120.000\nObat: Rp 45.000',
      total: 400000,
      status_bayar: 'lunas',
    },
  })
  await prisma.tagihan.create({
    data: {
      kunjungan_id: kunj6.id,
      rincian: 'Konsultasi dokter umum: Rp 100.000\nPemeriksaan lab: Rp 75.000\nSuplemen: Rp 25.000',
      total: 200000,
      status_bayar: 'lunas',
    },
  })

  // Tagihan BELUM BAYAR (muncul di halaman pembayaran)
  // Buat kunjungan kemarin untuk ini
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  yesterday.setHours(10, 0, 0, 0)

  const kunjYesterday1 = await prisma.kunjungan.create({
    data: {
      pasien_id: pasiens[0].id,
      dokter_id: dokter3.id,
      tanggal: yesterday,
      poli: 'Umum',
      status: 'selesai',
    },
  })
  const kunjYesterday2 = await prisma.kunjungan.create({
    data: {
      pasien_id: pasiens[4].id,
      dokter_id: dokter1.id,
      tanggal: yesterday,
      poli: 'Penyakit Dalam',
      status: 'selesai',
    },
  })

  await prisma.rekamMedis.create({
    data: {
      kunjungan_id: kunjYesterday1.id,
      keluhan: 'Sakit kepala berkepanjangan',
      diagnosis: 'Tension headache',
      tindakan: 'Resep analgesik',
    },
  })
  await prisma.rekamMedis.create({
    data: {
      kunjungan_id: kunjYesterday2.id,
      keluhan: 'Nyeri dada saat beraktivitas',
      diagnosis: 'Suspek angina pektoris',
      tindakan: 'EKG, rujuk kardiologi',
    },
  })

  await prisma.tagihan.create({
    data: {
      kunjungan_id: kunjYesterday1.id,
      rincian: 'Konsultasi dokter umum: Rp 100.000\nObat analgesik: Rp 35.000',
      total: 135000,
      status_bayar: 'belum_bayar',
    },
  })
  await prisma.tagihan.create({
    data: {
      kunjungan_id: kunjYesterday2.id,
      rincian: 'Konsultasi dokter spesialis: Rp 200.000\nEKG: Rp 150.000\nSurat rujukan: Rp 25.000',
      total: 375000,
      status_bayar: 'belum_bayar',
    },
  })

  console.log('✅ Tagihan seeded')
  console.log('')
  console.log('🎉 Semua data demo berhasil di-seed!')
  console.log('   Login: admin / password123')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
