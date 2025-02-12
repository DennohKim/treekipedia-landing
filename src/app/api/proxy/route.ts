import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'http://64.227.23.153:3000';

export async function GET(request: NextRequest) {
  try {
    // Get the path from the request URL
    const path = request.nextUrl.pathname.replace('/api/proxy', '');
    const url = `${BACKEND_URL}${path}${request.nextUrl.search}`;

    const response = await fetch(url);
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the path from the request URL
    const path = request.nextUrl.pathname.replace('/api/proxy', '');
    const url = `${BACKEND_URL}${path}`;

    const body = await request.json();
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
} 