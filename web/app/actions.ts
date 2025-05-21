"use server"

interface LicenseRequestBody {
  eaName: string
  accountId: string
  expiry: string
  apiEndpoint?: string
  apiKey?: string
}

export async function generateLicense(data: LicenseRequestBody) {
  const { eaName, accountId, expiry, apiEndpoint, apiKey } = data

  // Use provided API endpoint or fall back to default
  const endpoint = apiEndpoint || "https://zk4krfrw30.execute-api.ap-northeast-1.amazonaws.com/prod"
  // Use provided API key or fall back to default
  const key = apiKey || "YeMomYdzPJ69mbHvjoJnW3AvJXPDtYx43ASDzo9t"

  try {
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
      // This ensures the request is made from the server, not the client
      cache: "no-store",
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("API Error Response:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      })
      throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error calling API:", error)
    throw error
  }
}
