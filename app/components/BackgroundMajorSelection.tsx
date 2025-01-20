/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Building2, Cpu, Home, BookOpen, MapPin } from "lucide-react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { motion } from "framer-motion"

interface Major {
  id: string
  name: string
  icon: React.ReactNode
}

const majors: Major[] = [
  { id: "SIPIL", name: "Teknik Sipil", icon: <Building2 className="h-8 w-8" /> },
  { id: "ELEKTRO", name: "Elektro", icon: <Cpu className="h-8 w-8" /> },
  { id: "ARSITEKTUR", name: "Arsitektur", icon: <Home className="h-8 w-8" /> },
  { id: "IF", name: "Informatika", icon: <BookOpen className="h-8 w-8" /> },
  { id: "PW", name: "Perencanaan Wilayah", icon: <MapPin className="h-8 w-8" /> },
]

const backgrounds = [
  { url: "/images/sipil-1.jpg", category: "Lab" },
  { url: "/images/sipil-2.jpg", category: "Classroom" },
  { url: "/images/sipil-3.JPG", category: "Outdoors" },
  { url: "/images/sipil-4.jpg", category: "Lab" },
  { url: "/images/sipil-5.jpg", category: "Classroom" },
]

interface BackgroundMajorSelectionProps {
  onGenerate: (selectedMajor: Major, selectedBackground: string | null) => void
  isLoading: boolean
  capturedImage: string | null
}

export default function BackgroundMajorSelection({
  onGenerate,
  isLoading,
  capturedImage,
}: BackgroundMajorSelectionProps) {
  const [selectedMajor, setSelectedMajor] = useState<Major | null>(null)
  const [selectedBackground, setSelectedBackground] = useState<number | null>(null)
  const [category] = useState<string | null>(null)

  const handleMajorSelect = (major: Major) => {
    setSelectedMajor(major)
  }

  const handleBackgroundSelect = (index: number) => {
    setSelectedBackground(index)
  }

  const filteredBackgrounds = category ? backgrounds.filter((bg) => bg.category === category) : backgrounds

  const handleGenerateClick = () => {
    if (selectedMajor && selectedBackground !== null) {

      onGenerate(selectedMajor, backgrounds[selectedBackground].url)
    }
  }

  console.log(selectedMajor, selectedBackground, isLoading, capturedImage)

  return (
    <div className="space-y-8">
      <div className="flex justify-center space-x-4 overflow-x-auto pb-4">
        {majors.map((major, index) => (
          <motion.div
            key={major.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card
              className={`cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 sm:w-28 sm:h-28 md:w-40 md:h-40 flex items-center justify-center ${selectedMajor?.id === major.id ? "ring-2 ring-[#00008B]" : ""
                }`}
              onClick={() => handleMajorSelect(major)}
            >
              <CardContent className="flex flex-col items-center justify-center p-4 text-center h-full">
                {major.icon}
                <p className="mt-2 text-sm">{major.name}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      {selectedMajor && (
        <div className="relative">
          <ScrollArea className="w-full whitespace-nowrap rounded-md border border-gray-300">
            <div className="flex w-max space-x-4 p-4">
              {filteredBackgrounds.map((bg, index) => (
                <Card
                  key={index}
                  className={`flex-shrink-0 cursor-pointer transition-all ${selectedBackground === index ? "ring-2 ring-[#00008B]" : ""
                    }`}
                  onClick={() => handleBackgroundSelect(index)}
                >
                  <CardContent className="p-0">
                    <img
                      src={bg.url || "/placeholder.svg"}
                      alt={`Background ${index + 1}`}
                      className="w-48 h-32 sm:w-36 sm:h-24 object-cover rounded-lg"
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      )}
      
      <Button
        onClick={handleGenerateClick}
        className="w-full bg-[#00008B] text-white hover:bg-[#0000CD] transition-colors duration-300"
        disabled={!selectedMajor || selectedBackground === null || isLoading || !capturedImage}
      >
        {isLoading ? (
          <>
            <span className="animate-spin mr-2">⏳</span> Processing...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" /> Generate Face Swap
          </>
        )}
      </Button>
    </div>
  )
}

