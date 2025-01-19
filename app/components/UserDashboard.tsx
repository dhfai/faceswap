/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LiveCamera from './LiveCamera'
import FaceSwapPreview from './FaceSwapPreview'
import BackgroundMajorSelection from './BackgroundMajorSelection'

export default function UserDashboard() {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [taskId, setTaskId] = useState<string | null>(null)
  const [taskStatus, setTaskStatus] = useState<string | null>(null)

  const handleGenerate = async (selectedMajor: any, selectedBackground: string | null, userFaceImage: string) => {
    setIsLoading(true)
    setError(null)

    const myHeaders = new Headers();
    myHeaders.append("x-api-key", process.env.NEXT_PUBLIC_API_KEY as string);
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "model": "Qubico/image-toolkit",
      "task_type": "face-swap",
      "input": {
        "target_image": selectedBackground,
        "swap_image": userFaceImage // This should be the user's face image
      }
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow' as RequestRedirect
    };

    try {
      const response = await fetch("https://api.piapi.ai/api/v1/task", requestOptions)
      const result = await response.json()
      if (result.data && result.data.task_id) {
        setTaskId(result.data.task_id)
        checkTaskStatus(result.data.task_id)
      } else {
        throw new Error('No task ID in the response')
      }
    } catch (error) {
      console.error('error', error)
      setError('Failed to start face swap task. Please try again.')
      setIsLoading(false)
    }
  }

  const checkTaskStatus = async (id: string) => {
    const myHeaders = new Headers();
    myHeaders.append("x-api-key", process.env.NEXT_PUBLIC_API_KEY as string);

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow' as RequestRedirect
    };

    try {
      const response = await fetch(`https://api.piapi.ai/api/v1/task/${id}`, requestOptions)
      const result = await response.json()
      setTaskStatus(result.data.status)

      if (result.data.status === 'completed' && result.data.output && result.data.output.image) {
        setGeneratedImage(result.data.output.image)
        setIsLoading(false)
      } else if (result.data.status === 'failed') {
        setError('Face swap task failed. Please try again.')
        setIsLoading(false)
      } else {
        setTimeout(() => checkTaskStatus(id), 2000)
      }
    } catch (error) {
      console.error('error', error)
      setError('Failed to check task status. Please try again.')
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setGeneratedImage(null)
    setTaskId(null)
    setTaskStatus(null)
  }

  return (
    <Card className="w-full bg-white">
      <CardHeader className="bg-[#F0F8FF] text-[#2F4F4F]">
        <CardTitle>Live Face Swap</CardTitle>
        <CardDescription className="text-[#4682B4]">Transform your look in real-time!</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="camera">
          <TabsList className="grid w-full grid-cols-2 bg-[#F0F8FF] sm:grid-cols-1">
            <TabsTrigger value="camera" className="data-[state=active]:bg-[#1E90FF] data-[state=active]:text-white">Live Camera</TabsTrigger>
            <TabsTrigger value="result" disabled={!generatedImage} className="data-[state=active]:bg-[#1E90FF] data-[state=active]:text-white">Result</TabsTrigger>
          </TabsList>
          <TabsContent value="camera">
            <div className="space-y-4">
              <LiveCamera />
              <div className="space-y-4">
                <BackgroundMajorSelection 
                  onGenerate={handleGenerate}
                />
              </div>
              {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
              )}
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
  )
}

