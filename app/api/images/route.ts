import fs from "fs";
import path from "path";
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { facultyId } = await req.json();

  if (!facultyId) {
    return NextResponse.json("Faculty ID is required");
  }

  const imagesDir = path.join(process.cwd(), "public/images", facultyId as string);

  try {
    const files = fs.readdirSync(imagesDir);
    const images = files.map((file) => `/images/${facultyId}/${file}`);
    return NextResponse.json({ images });
  } catch (err) {
    return NextResponse.json("Error loading images");
  }
}
