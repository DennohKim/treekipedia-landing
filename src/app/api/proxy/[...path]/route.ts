import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = "http://64.227.23.153:3000"

type RouteParams = Promise<{ path: string[] }>

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
    // Join the path segments
    const { path } = await params
    const pathSegments = path.join("/")
    const url = `${BACKEND_URL}/${pathSegments}`

    console.log("Proxying POST request to:", url)

    const body = await request.json()
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Proxy error:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}

