/* eslint-disable @next/next/no-img-element */
"use client"

import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Building2, Cpu, Home, Code, Map } from 'lucide-react'
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Sparkles } from 'lucide-react'

interface Major {
  id: string
  name: string
  icon: React.ReactNode
}

const majors: Major[] = [
  { id: 'SIPIL', name: 'Teknik Sipil', icon: <Building2 className="h-8 w-8" /> },
  { id: 'ELEKTRO', name: 'Elektro', icon: <Cpu className="h-8 w-8" /> },
  { id: 'ARSITEKTUR', name: 'Arsitektur', icon: <Home className="h-8 w-8" /> },
  { id: 'IF', name: 'Informatika', icon: <Code className="h-8 w-8" /> },
  { id: 'PW', name: 'Perencanaan Wilayah', icon: <Map className="h-8 w-8" /> },
]

const backgrounds = [
  { url: '/images/sipil-1.jpg', category: 'Lab' },
  { url: '/images/sipil-2.jpg', category: 'Classroom' },
  { url: '/images/sipil-3.JPG', category: 'Outdoors' },
  { url: '/images/sipil-4.jpg', category: 'Lab' },
  { url: '/images/sipil-5.jpg', category: 'Classroom' },
]

interface BackgroundMajorSelectionProps {
  onGenerate: (selectedMajor: Major, selectedBackground: string | null, userFaceImage: string) => void
}

export default function BackgroundMajorSelection({ onGenerate }: BackgroundMajorSelectionProps) {
  const [selectedMajor, setSelectedMajor] = useState<Major | null>(null)
  const [selectedBackground, setSelectedBackground] = useState<number | null>(null)
  const [category] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleMajorSelect = (major: Major) => {
    setSelectedMajor(major)
  }

  const handleBackgroundSelect = (index: number) => {
    setSelectedBackground(index)
  }

  const filteredBackgrounds = category
    ? backgrounds.filter(bg => bg.category === category)
    : backgrounds

  const handleGenerateClick = () => {
    if (selectedMajor && selectedBackground !== null) {
      setIsLoading(true)
      const userFaceImage = "https://i.ibb.co/m9BFL9J/ad61a39afd9079e57a5908c0bd9dd995.jpg" // Replace with actual user face image URL
      onGenerate(selectedMajor, backgrounds[selectedBackground].url, userFaceImage)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {majors.map((major) => (
          <Card
            key={major.id}
            className={`cursor-pointer transition-all ${selectedMajor?.id === major.id ? 'ring-2 ring-[#1E90FF]' : ''
              }`}
            onClick={() => handleMajorSelect(major)}
          >
            <CardContent className="flex flex-col items-center p-4">
              {major.icon}
              <p className="mt-2 text-center text-sm">{major.name}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      {selectedMajor && (
        <div className="relative">
          <ScrollArea className="w-full whitespace-nowrap rounded-md border border-gray-300">
            <div className="flex w-max space-x-4 p-4">
              {filteredBackgrounds.map((bg, index) => (
                <Card
                  key={index}
                  className={`flex-shrink-0 cursor-pointer transition-all ${selectedBackground === index ? 'ring-2 ring-[#1E90FF]' : ''
                    }`}
                  onClick={() => handleBackgroundSelect(index)}
                >
                  <CardContent className="p-0">
                    <img src={bg.url} alt={`Background ${index + 1}`} className="w-48 h-32 object-cover rounded-lg" />
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
        className="w-full bg-[#1E90FF] text-white hover:bg-[#4682B4]"
        disabled={!selectedMajor || selectedBackground === null || isLoading}
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

