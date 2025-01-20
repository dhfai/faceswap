"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Share2, RotateCcw, Send } from "lucide-react"

interface FaceSwapPreviewProps {
  image: string
  onShare: (phoneNumber: string) => void
  onReset: () => void
}

export default function FaceSwapPreview({ image, onShare, onReset }: FaceSwapPreviewProps) {
  const [phoneNumber, setPhoneNumber] = useState("")

  const handleShare = () => {
    if (phoneNumber) {
      onShare(phoneNumber)
    }
  }

  return (
    <Card className="bg-gradient-to-br from-blue-100 to-purple-100 shadow-lg">
      <CardContent className="p-6 space-y-6">
        <img
          src={image || "/placeholder.svg?height=300&width=300"}
          alt="Face Swap Result"
          className="w-full rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
        />
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              type="tel"
              placeholder="Enter WhatsApp number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="flex-grow"
            />
            <Button
              onClick={handleShare}
              className="bg-green-500 text-white hover:bg-green-600 transition-colors duration-300"
            >
              <Send className="mr-2 h-4 w-4" /> Send
            </Button>
          </div>
          <div className="flex justify-between">
            <Button
              onClick={() => onShare(phoneNumber)}
              variant="outline"
              className="flex-1 mr-2 border-blue-300 text-blue-600 hover:bg-blue-50 transition-colors duration-300"
            >
              <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
            <Button
              onClick={onReset}
              variant="ghost"
              className="flex-1 ml-2 text-purple-600 hover:bg-purple-50 transition-colors duration-300"
            >
              <RotateCcw className="mr-2 h-4 w-4" /> Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

