"use client"

import { useState } from "react"
import { tambahObat, editObat } from "@/app/actions/farmasi"

export default function DaftarObat({ initialObat }) {
  const [obatList, setObatList] = useState(initialObat)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  
  // Form State
  const [formData, setFormData] = useState({
    nama_obat: "",
    stok: "",
    satuan: "",
    harga: "",
  })
  const [message, setMessage] = useState({ type: "", text: "" })
  const [isLoading, setIsLoading] = useState(false)

  const handleOpenModal = (obat = null) => {
    setMessage({ type: "", text: "" })
    if (obat) {
      setEditingId(obat.id)
      setFormData({
        nama_obat: obat.nama_obat,
        stok: obat.stok,
        satuan: obat.satuan,
        harga: obat.harga,
      })
    } else {
      setEditingId(null)
      setFormData({
        nama_obat: "",
        stok: "",
        satuan: "",
        harga: "",
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingId(null)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    if (!formData.nama_obat.trim()) {
      setMessage({ type: "error", text: "Nama obat wajib diisi" })
      return false
    }
    if (formData.stok === "" || parseInt(formData.stok) < 0) {
      setMessage({ type: "error", text: "Stok tidak boleh negatif" })
      return false
    }
    if (formData.harga === "" || parseFloat(formData.harga) < 0) {
      setMessage({ type: "error", text: "Harga tidak boleh negatif" })
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    setMessage({ type: "", text: "" })

    let result;
    if (editingId) {
      result = await editObat(editingId, formData)
    } else {
      result = await tambahObat(formData)
    }

    setIsLoading(false)

    if (result?.success) {
      setMessage({ type: "success", text: editingId ? "Berhasil mengubah obat!" : "Berhasil menambah obat!" })
      // Since revalidatePath is used, we wait a bit before closing or just rely on Next.js hydration
      // For immediate UI update, we can also update local state temporarily if needed, but Next.js Server Actions usually triggers a re-render.
      setTimeout(() => {
        handleCloseModal()
        // Force a hard refresh if revalidatePath isn't picking up fast enough, though App Router handles it.
        window.location.reload(); 
      }, 1000)
    } else {
      setMessage({ type: "error", text: result?.error || "Terjadi kesalahan" })
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Daftar Stok Obat</h2>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-sm"
        >
          + Tambah Obat
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-slate-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm">
              <th className="p-4 font-semibold">Nama Obat</th>
              <th className="p-4 font-semibold">Stok</th>
              <th className="p-4 font-semibold">Satuan</th>
              <th className="p-4 font-semibold">Harga (Rp)</th>
              <th className="p-4 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {obatList.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-500">
                  Belum ada data obat.
                </td>
              </tr>
            ) : (
              obatList.map((obat) => (
                <tr key={obat.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium">{obat.nama_obat}</td>
                  <td className="p-4">{obat.stok}</td>
                  <td className="p-4">{obat.satuan}</td>
                  <td className="p-4">{obat.harga.toLocaleString('id-ID')}</td>
                  <td className="p-4">
                    <button
                      onClick={() => handleOpenModal(obat)}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm px-3 py-1 bg-blue-50 hover:bg-blue-100 rounded-md transition"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800">
                {editingId ? "Edit Obat" : "Tambah Obat Baru"}
              </h3>
              <button 
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              {message.text && (
                <div className={`p-3 rounded-lg mb-4 text-sm font-medium ${
                  message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-600 border border-green-200'
                }`}>
                  {message.text}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nama Obat *</label>
                  <input
                    type="text"
                    name="nama_obat"
                    value={formData.nama_obat}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="Contoh: Paracetamol 500mg"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Stok *</label>
                    <input
                      type="number"
                      name="stok"
                      value={formData.stok}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Satuan</label>
                    <input
                      type="text"
                      name="satuan"
                      value={formData.satuan}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="Contoh: Strip, Botol"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Harga (Rp) *</label>
                  <input
                    type="number"
                    name="harga"
                    value={formData.harga}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
