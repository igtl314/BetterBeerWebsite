import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  const backendUrl = process.env.BACKEND_URL ?? 'http://localhost:3005';
  const response = await fetch(`${backendUrl}/images/${filename}`);

  if (!response.ok) {
    return new NextResponse('Not found', { status: 404 });
  }

  const buffer = await response.arrayBuffer();
  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'image/webp',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
