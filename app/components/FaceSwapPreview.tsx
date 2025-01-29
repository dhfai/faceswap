"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Share2, RotateCcw, Send, Loader } from "lucide-react"

interface FaceSwapPreviewProps {
  image: string
  onShare: (phoneNumber: string) => void
  onReset: () => void
}

export default function FaceSwapPreview({ image, onShare, onReset }: FaceSwapPreviewProps) {
  const [phoneNumber, setPhoneNumber] = useState("")
  
  const [isLoading, setIsLoading] = useState(false)

  const handleShare = async (event: React.FormEvent) => {
     event.preventDefault()
     console.log('share');
     
    if (phoneNumber) {
      setIsLoading(true)
      try {
        const response = await fetch("https://whatsapp.devnolife.site/send-media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            number: phoneNumber,
            caption: "Hasil Face Swap Unismuh Makasssar - Fakultas Teknik , created by @devnolife",
            url: image
          })
        })
        const data = await response.json()
        console.log(data , 'data');
        if (data.status === "success"){
          
        }
        onShare(phoneNumber)
      } catch (error) {
        console.error("Error sharing image:", error)
      } finally {
        setIsLoading(false)
      }
  }
}

  return (
    <Card className="bg-gradient-to-br from-blue-100 to-purple-100 shadow-lg">
      <CardContent className="p-6 space-y-6">
        <img
          src={image || "/placeholder.svg?height=300&width=300"}
          alt="Hasil Face Swap"
          className="w-full rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
        />
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              type="tel"
              placeholder="Masukkan Nomor WhatsApp"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="flex-grow"
            />
            <Button
              onClick={(e) => handleShare(e)}
              className="bg-green-500 text-white hover:bg-green-600 transition-colors duration-300"
              disabled={isLoading}
            >
              {isLoading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              {isLoading ? "Mengirim..." : "Kirim"}
            </Button>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={onReset}
              variant="ghost"
              className="flex-1 ml-2 text-purple-600 hover:bg-purple-50 transition-colors duration-300"
            >
              <RotateCcw className="mr-2 h-4 w-4" /> Atur Ulang
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

