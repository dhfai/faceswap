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
    width: 1920,
    height: 1080,
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
    setError('Unable to access camera. Please check permissions or connect a camera.')
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

              if(!feting.ok) {
                throw new Error('Failed to save image')
              }

              const response : {filePath : string} = await feting.json()

              onCapture(response.filePath)

            }catch(err) {
              alert("Ada Masalah Gan")
            }
            
          }
        )()
        
       
      }
    }
  }, [webcamRef])

  return (
    <div className="w-full max-w-3xl mx-auto bg-[#F0F8FF] p-4 rounded-lg shadow-md">
      <div className="mb-4 flex justify-between items-center">
        <Button
          onClick={handleCameraToggle}
          className={`${isCameraActive ? 'bg-[#4682B4]' : 'bg-[#1E90FF]'
            } text-white hover:bg-[#4682B4] transition-colors`}
        >
          {isCameraActive ? (
            <>
              <CameraOff className="mr-2 h-4 w-4" /> Deactivate Camera
            </>
          ) : (
            <>
              <Camera className="mr-2 h-4 w-4" /> Activate Camera
            </>
          )}
        </Button>
        {isCameraActive && (
          <>
            <Button onClick={switchCamera} className="bg-[#4682B4] text-white hover:bg-[#1E90FF] transition-colors">
              <RefreshCw className="mr-2 h-4 w-4" /> Switch Camera
            </Button>
            <Button onClick={captureImage} className="bg-[#4682B4] text-white hover:bg-[#1E90FF] transition-colors">
              Capture Image
            </Button>
          </>
        )}
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
              {error || "Camera is inactive. Click the button to activate."}
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
      {capturedImage && (
        <div className="mt-4">
          <h3 className="text-[#2F4F4F]">Captured Image:</h3>
          <img src={capturedImage} alt="Captured" className="w-full h-auto mt-2 rounded-lg shadow-md" />
        </div>
      )}
    </div>
  )
}

export default LiveCamera