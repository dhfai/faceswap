/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LiveCamera from "./LiveCamera"
import FaceSwapPreview from "./FaceSwapPreview"
import BackgroundMajorSelection from "./BackgroundMajorSelection"
import { Header } from "./Headers"
import { Footer } from "./Footer"
import { TabsTriggerProps } from "@radix-ui/react-tabs"

export default function UserDashboard() {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [taskId, setTaskId] = useState<string | null>(null)
  const [taskStatus, setTaskStatus] = useState<string | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [tabsVal, setTabsVal] = useState("camera")

  const handleGenerate = async (selectedMajor: any, selectedBackground: string | null) => {
    if (!capturedImage) {
      setError("Please capture an image first")
      return
    }

    setIsLoading(true)
    setError(null)

    const myHeaders = new Headers()
    myHeaders.append("x-api-key", process.env.NEXT_PUBLIC_API_KEY as string)
    myHeaders.append("Content-Type", "application/json")

    console.log(selectedBackground)

    console.log(`https://faceswap.if.unismuh.ac.id${selectedBackground}`)

    const raw = JSON.stringify({
      model: "Qubico/image-toolkit",
      task_type: "face-swap",
      input: {
        "target_image": `https://faceswap.if.unismuh.ac.id${selectedBackground}`,
        "swap_image": `https://faceswap.if.unismuh.ac.id/images/ss/captured-image.jpg`    
      },
    })

    // console.log(raw)

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect : "follow" as RequestRedirect
    }

    try {
      const response = await fetch("https://api.piapi.ai/api/v1/task", requestOptions)
      const result = await response.json()
      console.log(result)
      if (result.data && result.data.task_id) {
        setTaskId(result.data.task_id)
        checkTaskStatus(result.data.task_id)
      } else {
        throw new Error("No task ID in the response")
      }
    } catch (error) {
      console.error("error", error)
      setError("Failed to start face swap task. Please try again.")
      setIsLoading(false)
    }
  }

  const checkTaskStatus = async (id: string) => {
    const myHeaders = new Headers()
    myHeaders.append("x-api-key", process.env.NEXT_PUBLIC_API_KEY as string)

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow" as RequestRedirect,
    }

    try {
      const response = await fetch(`https://api.piapi.ai/api/v1/task/${id}`, requestOptions)
      const result = await response.json()
      console.log(result)
      setTaskStatus(result.data.status)

      if (result.data.status === "completed" && result.data.output && result.data.output.image_url) {
        setGeneratedImage(result.data.output.image_url)
        setIsLoading(false)
        setTabsVal("result")
      } else if (result.data.status === "failed") {
        setError("Lagi ada masalah nih, coba lagi ya")
        setIsLoading(false)
      } else {
        setTimeout(() => checkTaskStatus(id), 2000)
      }
    } catch (error) {
      setError("Failed to check task status. Please try again.")
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setGeneratedImage(null)
    setTaskId(null)
    setTaskStatus(null)
    setCapturedImage(null)
  }

  const handleImageCapture = (image: string) => {
    setCapturedImage(image)
  }

  const getCapturedImage = async(filepath : string) => {
    const actualPath = filepath.split("public/").at(-1) as string
    
    setCapturedImage(actualPath)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <Card className="w-full bg-white">
          <CardHeader className="bg-[#F0F8FF] text-[#00008B]">
            <CardTitle>Live Face Swap by Fakultas Teknik Background</CardTitle>
            <CardDescription className="text-[#4682B4]">Ubah penampilan Anda secara real-time!</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs value={tabsVal} defaultValue="camera">
              <TabsList className="grid w-full grid-cols-2 bg-[#F0F8FF] sm:grid-cols-1 mb-6">
                <TabsTrigger 
                onClick={() => {
                  setTabsVal("camera")
                  
                }}
                value="camera" className="data-[state=active]:bg-[#00008B] data-[state=active]:text-white">
                  Live Camera
                </TabsTrigger>
                <TabsTrigger
                  onClick={() => {
                    setTabsVal("result")
                  }}
                  value="result"
                  disabled={generatedImage == null}
                  className="data-[state=active]:bg-[#00008B] data-[state=active]:text-white"
                >
                  Result
                </TabsTrigger>
              </TabsList>
              <TabsContent value="camera">
                <div className="space-y-6">
                  <LiveCamera onCapture={(filepath) => {
                    getCapturedImage(filepath)
                  }} />
                  <BackgroundMajorSelection
                    onGenerate={handleGenerate}
                    isLoading={isLoading}
                    capturedImage={capturedImage}
                  />
                  {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </div>
              </TabsContent>
              <TabsContent value="result">
                {generatedImage && (
                  <FaceSwapPreview
                    image={generatedImage}
                    onShare={() => console.log("Sharing...")}
                    onReset={handleReset}
                  />
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}

