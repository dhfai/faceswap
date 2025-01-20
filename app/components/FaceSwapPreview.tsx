/* eslint-disable @next/next/no-img-element */
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, Share2, RotateCcw } from 'lucide-react'

interface FaceSwapPreviewProps {
  image: string
  onDownload: () => void
  onShare: () => void
  onReset: () => void
}

export default function FaceSwapPreview({ image, onDownload, onShare, onReset }: FaceSwapPreviewProps) {
  return (
    <Card className="bg-white">
      <CardContent className="p-6 space-y-4">
        <img src={image || "/placeholder.svg"} alt="Face Swap Result" className="w-full rounded-lg" />
        <div className="flex flex-col sm:flex-row justify-between">
          <Button onClick={onDownload} className="bg-[#1E90FF] text-white hover:bg-[#4682B4]">
            <Download className="mr-2 h-4 w-4" /> Download
          </Button>
          <Button onClick={onShare} variant="outline" className="border-gray-300 text-[#2F4F4F] hover:bg-gray-100">
            <Share2 className="mr-2 h-4 w-4" /> Share
          </Button>
          <Button onClick={onReset} variant="ghost" className="text-[#2F4F4F] hover:bg-gray-100">
            <RotateCcw className="mr-2 h-4 w-4" /> Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

