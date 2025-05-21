import { type NextRequest, NextResponse } from "next/server"

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { eaName, accountId, expiry, apiEndpoint, apiKey } = body

    // Use provided API endpoint or fall back to default
    const endpoint = apiEndpoint || "https://zk4krfrw30.execute-api.ap-northeast-1.amazonaws.com/prod"
    // Use provided API key or fall back to default
    const key = apiKey || "YeMomYdzPJ69mbHvjoJnW3AvJXPDtYx43ASDzo9t"

    // Make the request from the server side to avoid CORS issues
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
      },
      body: JSON.stringify({
        eaName,
        accountId,
        expiry,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("API Error Response:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      })
      return NextResponse.json(
        { error: `API request failed: ${response.status} ${response.statusText}` },
        { status: response.status },
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in license API route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
