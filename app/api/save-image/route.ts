import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

const saveImage = (imageData: string) => {
  const filePath = path.join(process.cwd(), 'public', 'images', 'ss', 'captured-image.jpg')

  const base64Data = imageData.replace(/^data:image\/jpeg;base64,/, '')
  fs.writeFileSync(filePath, base64Data, 'base64')

  return filePath
}

export async function POST(req: Request) {
  try {
    const { imageData } = await req.json()
    if (!imageData) {
      return NextResponse.json({ message: 'No image data provided.' }, { status: 400 })
    }

    const filePath = saveImage(imageData)
    return NextResponse.json({ message: 'Image saved successfully.', filePath })
  } catch (error) {

    return NextResponse.json({ message: 'Failed to save image.', error }, { status: 400 })
  }
}
