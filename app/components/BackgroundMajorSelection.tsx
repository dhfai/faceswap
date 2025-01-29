"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Card, CardContent } from "@/components/ui/card"
import { Syringe, Book, Moon, Briefcase, Wrench, Globe, Leaf, Scale, School, Loader2 } from "lucide-react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Faculty {
  id: string
  name: string
  icon: React.ReactNode
}

const faculties: Faculty[] = [
  { id: "fkik", name: "KEDOKTERAN DAN ILMU KESEHATAN", icon: <Syringe className="h-8 w-8" /> },
  { id: "fkip", name: "KEGURUAN DAN ILMU PENDIDIKAN", icon: <Book className="h-8 w-8" /> },
  { id: "agama", name: "AGAMA ISLAM", icon: <Moon className="h-8 w-8" /> },
  { id: "ekonomi", name: "EKONOMI DAN BISNIS", icon: <Briefcase className="h-8 w-8" /> },
  { id: "teknik", name: "TEKNIK", icon: <Wrench className="h-8 w-8" /> },
  { id: "sosial", name: "ILMU SOSIAL DAN ILMU POLITIK", icon: <Globe className="h-8 w-8" /> },
  { id: "pertanian", name: "PERTANIAN", icon: <Leaf className="h-8 w-8" /> },
  { id: "hukum", name: "HUKUM", icon: <Scale className="h-8 w-8" /> },
  { id: "pascasarjana", name: "PASCASARJANA", icon: <School className="h-8 w-8" /> },
]

interface BackgroundFacultySelectionProps {
  onGenerate: (selectedFaculty: Faculty, selectedBackground: string | null) => void
  isLoading: boolean
  capturedImage: string | null
}

export default function BackgroundFacultySelection({
  onGenerate,
  isLoading,
  capturedImage,
}: BackgroundFacultySelectionProps) {
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null)
  const [selectedBackground, setSelectedBackground] = useState<number | null>(null)
  const [images, setImages] = useState<string[]>([])
  const [isLoadingImages, setIsLoadingImages] = useState(false)

  useEffect(() => {
    const loadImages = async () => {
      if (selectedFaculty) {
        try {
          setIsLoadingImages(true)
          const response = await axios.post("/api/images", { facultyId: selectedFaculty.id })
          setImages(response.data.images)
        } catch (err) {
          console.error("Error loading images:", err)
          setImages([])
        } finally {
          setIsLoadingImages(false)
        }
      }
    }

    loadImages()
  }, [selectedFaculty])

  const handleFacultySelect = (faculty: Faculty) => {
    setSelectedFaculty(faculty)
    setSelectedBackground(null)
  }

  const handleBackgroundSelect = (index: number) => {
    setSelectedBackground(index)
  }

  const handleGenerateClick = () => {
    if (selectedFaculty && selectedBackground !== null) {
      const selectedBg = images[selectedBackground]
      onGenerate(selectedFaculty, selectedBg)
    }
  }

  return (
    <div className="space-y-8 p-4 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg shadow-lg">
      <ScrollArea className="w-full whitespace-nowrap rounded-md">
        <div className="flex space-x-4 p-4">
          {faculties.map((faculty, index) => (
            <motion.div
              key={faculty.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex-shrink-0 w-44 h-44"
            >
              <Card
                className={`cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 w-44 h-44 flex flex-col items-center justify-center ${
                  selectedFaculty?.id === faculty.id ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => handleFacultySelect(faculty)}
              >
                <CardContent className="flex flex-col items-center justify-center p-2 text-center h-full w-full overflow-hidden">
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="mb-2">
                    {faculty.icon}
                  </motion.div>
                  <p className="text-[9px] leading-tight max-h-12 overflow-hidden break-words w-full px-1">
                    {faculty.name}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <AnimatePresence>
        {selectedFaculty && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
            className="overflow-hidden"
          >
            <ScrollArea className="w-full whitespace-nowrap rounded-md border border-gray-300 bg-white">
              {isLoadingImages ? (
                <div className="flex items-center justify-center p-8 w-full">
                  <div className="flex flex-col items-center space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    <p className="text-sm text-gray-500">Loading background images...</p>
                  </div>
                </div>
              ) : (
                <div className="flex w-max space-x-4 p-4">
                  {images.length > 0 ? (
                    images.map((bg, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Card
                          className={`flex-shrink-0 cursor-pointer transition-all ${
                            selectedBackground === index ? "ring-2 ring-blue-500" : ""
                          }`}
                          onClick={() => handleBackgroundSelect(index)}
                        >
                          <CardContent className="p-0">
                            <div className="relative w-48 h-32 sm:w-36 sm:h-24">
                              <img
                                src={bg || "/placeholder.svg?height=128&width=192"}
                                alt={`Background ${index + 1}`}
                                className="w-full h-full object-cover rounded-lg"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-lg" />
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  ) : (
                    <div className="flex items-center justify-center p-8 w-full min-w-[300px]">
                          <p className="text-sm text-gray-500 text-center w-full">Belum ada background yang tersedia</p>
                    </div>
                  )}
                </div>
              )}
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <Button
          onClick={handleGenerateClick}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
          disabled={!selectedFaculty || selectedBackground === null || isLoading || !capturedImage}
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="mr-2"
            >
              ⏳
            </motion.div>
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          {isLoading ? "Processing..." : "Generate Face Swap"}
        </Button>
      </motion.div>
    </div>
  )
}

