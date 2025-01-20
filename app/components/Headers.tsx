import Image from "next/image"
import { Card } from "@/components/ui/card"

export function Header() {
  return (
    <Card className="w-full bg-[#00008B] text-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <Image src="/images/logo-campus.jpg" alt="Campus Logo" width={60} height={60} className="w-15 h-15" />
          <div>
            <h1 className="text-2xl font-bold">Universitas Muhammadiyah Makassar</h1>
            <p className="text-sm italic">Integrated Green Islamic Futuristic</p>
          </div>
        </div>
      </div>
    </Card>
  )
}

