/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LiveCamera from "./LiveCamera"
import FaceSwapPreview from "./FaceSwapPreview"
import BackgroundMajorSelection from "./BackgroundMajorSelection"
import { Header } from "./Headers"
import { Footer } from "./Footer"

export default function UserDashboard() {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [taskId, setTaskId] = useState<string | null>(null)
  const [taskStatus, setTaskStatus] = useState<string | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)

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

    const raw = JSON.stringify({
      model: "Qubico/image-toolkit",
      task_type: "face-swap",
      input: {
        target_image: selectedBackground
          ? `https://face-swap.unismuh.ac.id/images/selectBackrgound/${selectedBackground.split("/").pop()}`
          : "",
        swap_image: `https://face-swap.unismuh.ac.id/${capturedImage}`,
      },
    })

    console.log(raw)

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow" as RequestRedirect,
    }

    try {
      const response = await fetch("https://api.piapi.ai/api/v1/task", requestOptions)
      const result = await response.json()
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
      setTaskStatus(result.data.status)

      if (result.data.status === "completed" && result.data.output && result.data.output.image) {
        setGeneratedImage(result.data.output.image)
        setIsLoading(false)
      } else if (result.data.status === "failed") {
        setError("Face swap task failed. Please try again.")
        setIsLoading(false)
      } else {
        setTimeout(() => checkTaskStatus(id), 2000)
      }
    } catch (error) {
      console.error("error", error)
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
            <CardTitle>Live Face Swap</CardTitle>
            <CardDescription className="text-[#4682B4]">Ubah penampilan Anda secara real-time!</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="camera">
              <TabsList className="grid w-full grid-cols-2 bg-[#F0F8FF] sm:grid-cols-1 mb-6">
                <TabsTrigger value="camera" className="data-[state=active]:bg-[#00008B] data-[state=active]:text-white">
                  Live Camera
                </TabsTrigger>
                <TabsTrigger
                  value="result"
                  disabled={!generatedImage}
                  className="data-[state=active]:bg-[#00008B] data-[state=active]:text-white"
                >
                  Result
                </TabsTrigger>
              </TabsList>
              <TabsContent value="camera">
                <div className="space-y-6">
                  <LiveCamera onCapture={(filepath) => {
                    console.log(filepath, "TEst")
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
                    onDownload={() => console.log("Downloading...")}
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

