'use client'

import { useState } from 'react'
import { tambahAntrianBaru } from './actions'

export default function TambahAntrianModal({ listPasien = [], listDokter = [] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedPoli, setSelectedPoli] = useState('Poli Umum')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const poliList = [
    'Poli Umum',
    'Poli Anak',
    'Poli Penyakit Dalam',
    'Poli Gigi & Mulut',
    'Poli Mata',
    'Poli THT',
  ]

  const handleSubmit = async (e) => {
    setIsSubmitting(true)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm shadow-md shadow-blue-200 transition active:scale-95"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
        + Tambah ke Antrian (Demo)
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-100 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Daftarkan Pasien ke Antrian</h3>
                <p className="text-xs text-slate-500 mt-0.5">Tambah kunjungan baru dengan status "menunggu"</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form action={tambahAntrianBaru} onSubmit={handleSubmit} className="mt-4 space-y-4">
              {/* Pilih Pasien */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pilih Pasien <span className="text-red-500">*</span>
                </label>
                <select
                  name="pasien_id"
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">-- Pilih Pasien Terdaftar --</option>
                  {listPasien.map((p) => (
                    <option key={p.id} value={p.id}>
                      [{p.no_rm}] {p.nama} ({p.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Pilih Poli */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Poli Tujuan <span className="text-red-500">*</span>
                </label>
                <select
                  name="poli"
                  value={selectedPoli}
                  onChange={(e) => setSelectedPoli(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {poliList.map((poli) => (
                    <option key={poli} value={poli}>
                      {poli}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pilih Dokter */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Dokter Pemeriksa <span className="text-red-500">*</span>
                </label>
                <select
                  name="dokter_id"
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">-- Pilih Dokter Bertugas --</option>
                  {listDokter.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.nama} ({d.spesialisasi})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-200 transition disabled:opacity-50"
                >
                  {isSubmitting ? 'Mendaftarkan...' : 'Daftarkan ke Antrian'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
