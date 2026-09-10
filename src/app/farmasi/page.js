import { getDaftarObat } from "@/app/actions/farmasi"
import DaftarObat from "./components/DaftarObat"

export const dynamic = 'force-dynamic'

export default async function FarmasiPage() {
  const obatList = await getDaftarObat()

  return (
    <div>
      <DaftarObat initialObat={obatList} />
    </div>
  )
}
