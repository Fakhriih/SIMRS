"use server"

import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"

export async function loginAction(formData) {
  const username = formData.get("username")
  const password = formData.get("password")

  if (!username || !password) {
    return { error: "Username dan Password harus diisi" }
  }

  try {
    const user = await prisma.user.findUnique({
      where: { username }
    })

    if (!user || user.password !== password) {
      return { error: "Username atau Password salah" }
    }

    // Set simple cookie for session (since this is just local demo)
    const cookieStore = await cookies()
    cookieStore.set("user_session", user.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    })

    return { success: true }
  } catch (error) {
    console.error("Login error:", error)
    return { error: "Terjadi kesalahan pada server" }
  }
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete("user_session")
}
