const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
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
      nama: 'Petugas Pendaftaran',
      username: 'petugas',
      password: 'password123',
      role: 'PETUGAS',
    },
  })

  console.log('✅ Users seeded')

  // 2. Seed Dokter
  const dokterList = [
    { nama: 'dr. Andi Sp.PD', spesialisasi: 'Penyakit Dalam', jadwal_praktik: 'Senin - Rabu (08:00 - 12:00)' },
    { nama: 'dr. Budi Sp.A', spesialisasi: 'Anak', jadwal_praktik: 'Selasa - Kamis (10:00 - 14:00)' },
    { nama: 'dr. Citra Umum', spesialisasi: 'Umum', jadwal_praktik: 'Jumat - Sabtu (08:00 - 16:00)' },
  ]

  for (const d of dokterList) {
    const exist = await prisma.dokter.findFirst({ where: { nama: d.nama } })
    if (!exist) {
      await prisma.dokter.create({ data: d })
    }
  }

  console.log('✅ Dokters seeded')

  // 3. Seed Pasien
  const dummyPasiens = [
    { no_rm: 'RM001', nama: 'Eka Pratama', nik: '35700000001', tanggal_lahir: new Date('1990-01-01'), jenis_kelamin: 'L', alamat: 'Jl. Merdeka No. 12', no_telp: '081234567891' },
    { no_rm: 'RM002', nama: 'Dwi Rahmawati', nik: '35700000002', tanggal_lahir: new Date('1992-02-02'), jenis_kelamin: 'P', alamat: 'Jl. Kemerdekaan No. 45', no_telp: '081234567892' },
    { no_rm: 'RM003', nama: 'Tri Susanto', nik: '35700000003', tanggal_lahir: new Date('1985-03-03'), jenis_kelamin: 'L', alamat: 'Jl. Pahlawan No. 8', no_telp: '081234567893' },
    { no_rm: 'RM004', nama: 'Catur Lestari', nik: '35700000004', tanggal_lahir: new Date('1978-04-04'), jenis_kelamin: 'P', alamat: 'Jl. Sudirman No. 99', no_telp: '081234567894' },
    { no_rm: 'RM005', nama: 'Panca Wijaya', nik: '35700000005', tanggal_lahir: new Date('2000-05-05'), jenis_kelamin: 'L', alamat: 'Jl. Diponegoro No. 17', no_telp: '081234567895' },
  ]

  for (const pasien of dummyPasiens) {
    await prisma.pasien.upsert({
      where: { nik: pasien.nik },
      update: {},
      create: pasien,
    })
  }
  
  console.log('✅ Pasiens seeded')

  // 4. Seed Kunjungan Dummy awal jika belum ada
  const countKunjungan = await prisma.kunjungan.count()
  if (countKunjungan === 0) {
    const p1 = await prisma.pasien.findFirst({ where: { no_rm: 'RM001' } })
    const p2 = await prisma.pasien.findFirst({ where: { no_rm: 'RM002' } })
    const d1 = await prisma.dokter.findFirst({ where: { spesialisasi: 'Penyakit Dalam' } })
    const d2 = await prisma.dokter.findFirst({ where: { spesialisasi: 'Umum' } })

    if (p1 && d1) {
      await prisma.kunjungan.create({
        data: {
          pasien_id: p1.id,
          dokter_id: d1.id,
          tanggal: new Date(),
          poli: 'Poli Penyakit Dalam',
          status: 'menunggu'
        }
      })
    }
    if (p2 && d2) {
      await prisma.kunjungan.create({
        data: {
          pasien_id: p2.id,
          dokter_id: d2.id,
          tanggal: new Date(),
          poli: 'Poli Umum',
          status: 'menunggu'
        }
      })
    }
    console.log('✅ Kunjungan seeded')
  }
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

