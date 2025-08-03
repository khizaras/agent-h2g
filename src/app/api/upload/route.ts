import { NextRequest, NextResponse } from "next/server";

// Simple redirect to the image upload endpoint for backward compatibility
export async function POST(request: NextRequest) {
  // Forward the request to the actual image upload endpoint
  const response = await fetch(`${request.nextUrl.origin}/api/upload/image`, {
    method: 'POST',
    body: request.body,
    headers: {
      'Authorization': request.headers.get('Authorization') || '',
      'Cookie': request.headers.get('Cookie') || '',
    },
  });
  
  return response;
}