import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = "http://64.227.23.153:3000"

type RouteParams = Promise<{ path: string[] }>

export const runtime = 'edge'

export async function GET(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  try {
    // Join the path segments and add any query parameters
    const { path } = await params
    const pathSegments = path.join("/")
    const url = `${BACKEND_URL}/${pathSegments}${request.nextUrl.search}`

    console.log("Proxying GET request to:", url)

    const response = await fetch(url)
    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("Proxy error:", error)
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  try {
    const { path } = await params
    const pathSegments = path.join("/")
    const url = `${BACKEND_URL}/${pathSegments}`

    console.log("Proxying POST request to:", url)

    const body = await request.json()
    
    // Set longer timeout and streaming response
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(180000),
    })

    // Check if the response is ok before trying to parse JSON
    if (!response.ok) {
      console.error(`Backend responded with status ${response.status}`);
      const errorText = await response.text();
      console.error('Backend error:', errorText);
      return NextResponse.json(
        { error: `Backend error: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    // Handle streaming response
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Detailed proxy error:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: error.cause
    })

    if (error instanceof Error && error.name === 'TimeoutError') {
      return NextResponse.json(
        { error: "Request timed out", details: error.message },
        { status: 504 }
      )
    }

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON response from backend", details: error.message },
        { status: 502 }
      )
    }

    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json(
        { error: "Network error", details: error.message },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { 
        error: "Failed to process request",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

