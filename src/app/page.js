"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { loginAction } from "./actions/auth"

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // BYPASS LOGIN UNTUK DEMO
  // Langsung arahkan ke dashboard saat halaman dimuat
  useEffect(() => {
    router.push("/dashboard")
  }, [router])

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const result = await loginAction(formData)

    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    } else if (result?.success) {
      router.push("/dashboard")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white p-10 rounded-xl shadow-sm border border-slate-200">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-800 mb-3">SIMRS</h1>
          <p className="text-slate-500 text-sm">Sistem Informasi Manajemen Rumah Sakit</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none transition-all text-slate-800"
              placeholder="Masukkan username"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none transition-all text-slate-800"
              placeholder="Masukkan password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-primary-gradient hover:opacity-90 text-white font-semibold py-3 rounded-lg transition-opacity disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
          >
            {isLoading ? "Memproses..." : "Masuk"}
          </button>
        </form>
        
        <div className="mt-8 text-center text-sm text-slate-400">
          Gunakan username: <strong className="text-slate-600">admin</strong> / password: <strong className="text-slate-600">password123</strong>
        </div>
      </div>
    </div>
  )
}
