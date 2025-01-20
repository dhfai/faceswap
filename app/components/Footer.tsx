import Image from "next/image"
import { Facebook, Instagram, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[#00008B] text-white py-6 mt-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center mb-4 md:mb-0">
            <Image src="/images/logo-campus.jpg" alt="Campus Logo" width={40} height={40} className="w-8 h-8 mr-2" />
            <span className="font-semibold">Universitas Muhammadiyah Makassar</span>
          </div>
          <div className="text-sm mb-4 md:mb-0 text-center md:text-left">
            <p>JL. SULTAN ALAUDDIN NO. 259, Kota Makassar, 90221</p>
            <p>Email: teknik@unismuh.ac.id</p>
          </div>
          <div className="flex space-x-4">
            <a href="https://www.facebook.com/profile.php?id=100086247710385" className="text-white hover:text-[#4682B4] transition-colors">
              <Facebook size={24} />
            </a>
            <a href="#" className="text-white hover:text-[#4682B4] transition-colors">
              <Instagram size={24} />
            </a>
            <a href="#" className="text-white hover:text-[#4682B4] transition-colors">
              <Youtube size={24} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

