const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // 1. Seed Users
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      nama: 'Administrator',
      username: 'admin',
      password: 'password123', // In real app, this should be hashed
      role: 'ADMIN',
    },
  })

  const petugas = await prisma.user.upsert({
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
  const dokter1 = await prisma.dokter.create({
    data: {
      nama: 'dr. Andi Sp.PD',
      spesialisasi: 'Penyakit Dalam',
      jadwal_praktik: 'Senin - Rabu (08:00 - 12:00)',
    }
  })
  const dokter2 = await prisma.dokter.create({
    data: {
      nama: 'dr. Budi Sp.A',
      spesialisasi: 'Anak',
      jadwal_praktik: 'Selasa - Kamis (10:00 - 14:00)',
    }
  })
  const dokter3 = await prisma.dokter.create({
    data: {
      nama: 'dr. Citra Umum',
      spesialisasi: 'Umum',
      jadwal_praktik: 'Jumat - Sabtu (08:00 - 16:00)',
    }
  })

  console.log('✅ Dokters seeded')

  // 3. Seed Pasien
  const dummyPasiens = [
    { no_rm: 'RM001', nama: 'Eka', nik: '35700000001', tanggal_lahir: new Date('1990-01-01'), jenis_kelamin: 'L', alamat: 'Jl. Merdeka 1', no_telp: '081234567891' },
    { no_rm: 'RM002', nama: 'Dwi', nik: '35700000002', tanggal_lahir: new Date('1992-02-02'), jenis_kelamin: 'P', alamat: 'Jl. Kemerdekaan 2', no_telp: '081234567892' },
    { no_rm: 'RM003', nama: 'Tri', nik: '35700000003', tanggal_lahir: new Date('1985-03-03'), jenis_kelamin: 'L', alamat: 'Jl. Pahlawan 3', no_telp: '081234567893' },
    { no_rm: 'RM004', nama: 'Catur', nik: '35700000004', tanggal_lahir: new Date('1978-04-04'), jenis_kelamin: 'P', alamat: 'Jl. Sudirman 4', no_telp: '081234567894' },
    { no_rm: 'RM005', nama: 'Panca', nik: '35700000005', tanggal_lahir: new Date('2000-05-05'), jenis_kelamin: 'L', alamat: 'Jl. Diponegoro 5', no_telp: '081234567895' },
  ]

  for (const pasien of dummyPasiens) {
    await prisma.pasien.upsert({
      where: { nik: pasien.nik },
      update: {},
      create: pasien,
    })
  }
  
  console.log('✅ Pasiens seeded')
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
