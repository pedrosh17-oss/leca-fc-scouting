import { NextResponse } from 'next/server';
import { list } from '@vercel/blob';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';


export const runtime = 'nodejs';

export async function GET() {
  try {
    const { blobs } = await list({ prefix: 'algo-data.xlsx' });
    if (!blobs || blobs.length === 0) return NextResponse.json({ url: null });
    return NextResponse.json({ url: blobs[0].url });
  } catch (error) {
    return NextResponse.json({ url: null });
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        return {
          allowedContentTypes: [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel',
            'application/octet-stream',
          ],
        };
      },
      onUploadCompleted: async () => {},
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 },
    );
  }
}