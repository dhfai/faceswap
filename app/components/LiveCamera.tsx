/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useCallback } from 'react'
import Webcam from 'react-webcam'
import { Button } from "@/components/ui/button"
import { Camera, CameraOff, RefreshCw } from 'lucide-react'


const LiveCamera: React.FC<{
  onCapture: (filepath : string) => void
 }> = ({onCapture}) => {
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user')
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const webcamRef = useRef<Webcam>(null)

  const videoConstraints = {
    width: 1080,
    height: 768,
    facingMode: facingMode,
  }

  const handleCameraToggle = useCallback(() => {
    if (isCameraActive) {
      setIsCameraActive(false)
      setError(null)
    } else {
      setIsCameraActive(true)
      setError(null)
    }
  }, [isCameraActive])

  const handleCameraError = useCallback((error: string | DOMException) => {
    // console.error('Camera error:', error)
    setError('Tidak dapat mengakses kamera. Mohon periksa izin atau sambungkan kamera.')
    setIsCameraActive(false)
  }, [])

  const switchCamera = useCallback(() => {
    setFacingMode((prevMode) => (prevMode === 'user' ? 'environment' : 'user'))
  }, [])

  const captureImage = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot()
      setCapturedImage(imageSrc)

      // Send the captured image to the server
      if (imageSrc) {
        (
          async () => {
            try {

              const feting =  await fetch('/api/save-image', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ imageData: imageSrc }),
              })

              if(feting.status >= 500) {
                throw new Error("Ada Masalah gan")
              }

              const response : {filePath : string, message : string} = await feting.json()

              if(feting.status >= 400) {
                throw new Error(response.message)
              }

              onCapture(response.filePath)

            }catch(err) {
              alert("Ada Masalah Gan")
            }
            
          }
        )()
        setIsCameraActive(false) // <-- Tambahkan ini agar kamera langsung berhenti
      }
    }
  }, [webcamRef])

  const retakePhoto = useCallback(() => {
    setCapturedImage(null)
    setIsCameraActive(true)
    setError(null)
  }, [])

  return (
    <div className="w-full max-w-3xl mx-auto bg-[#F0F8FF] p-4 rounded-lg shadow-md">
      {!capturedImage ? (
        <>
          <div className="mb-4 flex justify-center items-center">
            <Button
              onClick={handleCameraToggle}
              className={`${isCameraActive ? 'bg-[#4682B4]' : 'bg-[#1E90FF]'
                } text-white hover:bg-[#4682B4] transition-colors`}
            >
              {isCameraActive ? (
                <>
                  <CameraOff className="mr-2 h-4 w-4" /> Nonaktifkan Kamera
                </>
              ) : (
                <>
                  <Camera className="mr-2 h-4 w-4" /> Aktifkan Kamera
                </>
              )}
            </Button>
          </div>
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            {isCameraActive ? (
              <Webcam
                audio={false}
                ref={webcamRef}
                videoConstraints={videoConstraints}
                onUserMediaError={handleCameraError}
                className="w-full h-full object-cover"
                mirrored={true} 
                screenshotFormat="image/jpeg" 
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-white text-center p-4">
                <p className="text-[#2F4F4F]">
                  {error || "Kamera sedang tidak aktif. Klik tombol untuk mengaktifkan."}
                </p>
              </div>
            )}
            {isCameraActive && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="w-full h-full grid grid-cols-3 grid-rows-3">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="border border-white opacity-30"></div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {isCameraActive && (
            <div className="mt-4 flex justify-center items-center">
              <Button onClick={captureImage} className="bg-[#4682B4] text-white hover:bg-[#1E90FF] transition-colors">
                Tangkap Foto
              </Button>
            </div>
          )}
        </>
      ) : (
        <>
          <img
            src={capturedImage}
            alt="Captured"
            className="w-full h-auto mt-2 rounded-lg shadow-md"
          />
          <div className="mt-4 flex justify-center items-center">
            <Button
              onClick={retakePhoto}
              className="bg-[#4682B4] text-white hover:bg-[#1E90FF] transition-colors"
            >
              Ambil Ulang {/* Ganti dari "Retake" */}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

export default LiveCamera
