import { NextRequest, NextResponse } from 'next/server';

// Specify that this route uses the Edge Runtime
export const runtime = 'edge';

const BACKEND_URL = 'http://64.227.23.153:3000';

interface RouteContext {
  params: {
    path: string[];
  };
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // Join the path segments and add any query parameters
    const pathSegments = context.params.path.join('/');
    const url = `${BACKEND_URL}/${pathSegments}${request.nextUrl.search}`;

    console.log('Proxying GET request to:', url);

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
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

export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // Join the path segments
    const pathSegments = context.params.path.join('/');
    const url = `${BACKEND_URL}/${pathSegments}`;

    console.log('Proxying POST request to:', url);

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