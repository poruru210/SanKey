"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { generateLicense } from "@/app/actions"
import { MainNav } from "@/components/main-nav"
import { Download, Send, AlertTriangle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ParticlesBackground } from "@/components/particles-background"
import { SimpleDatePicker } from "@/components/simple-date-picker"
import Link from "next/link"

export default function ApiCallerPage() {
  const [eaName, setEaName] = useState("MyEA")
  const [accountId, setAccountId] = useState("1234")
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(new Date(2025, 11, 31, 23, 59, 59))
  const [response, setResponse] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [apiConfigured, setApiConfigured] = useState(false)
  const [tab, setTab] = useState("generator");

  useEffect(() => {
    // Check if API settings are configured
    const endpoint = localStorage.getItem("apiEndpoint")
    const apiKey = localStorage.getItem("apiKey")
    setApiConfigured(!!(endpoint && apiKey))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!expiryDate) {
      setError("Please select an expiry date")
      setIsLoading(false)
      return
    }

    const apiEndpoint = localStorage.getItem("apiEndpoint")
    const apiKey = localStorage.getItem("apiKey")

    if (!apiEndpoint || !apiKey) {
      setError("API settings not configured. Please go to settings first.")
      setIsLoading(false)
      return
    }

    // Format the date to ISO string
    const formattedExpiry = expiryDate.toISOString()

    try {
      // Option 1: Use the server action (preferred)
      const result = await generateLicense({
        eaName,
        accountId,
        expiry: formattedExpiry,
        apiEndpoint,
        apiKey,
      })

      setResponse(JSON.stringify(result, null, 2))
      setTab("response");
    } catch (err) {
      console.error("Error details:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = () => {
    if (!response) return

    try {
      const parsed = JSON.parse(response);
      const licenseText = parsed.license;

      if (!licenseText || typeof licenseText !== "string") {
        alert("License key not found in the response.");
        return;
      }

      const blob = new Blob([licenseText], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "sankey-license.txt";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to generate the license file.");
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ParticlesBackground />
      <MainNav />
      <main className="flex-1 container py-10">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-primary">SANKEY License Generator</h1>
          </div>

          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="generator">License Details</TabsTrigger>
              <TabsTrigger value="response">Generated License</TabsTrigger>
            </TabsList>
            <TabsContent value="generator">
              <Card className="border-2 shadow-lg backdrop-blur-sm bg-background/80">
                <CardContent className="pt-6">
                  {!apiConfigured && (
                    <Alert className="mb-6 border-2 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/30 p-4">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-500 flex-shrink-0" />
                        <AlertDescription className="text-base font-medium text-yellow-800 dark:text-yellow-300">
                          API settings not configured!
                          <Link
                            href="/settings"
                            className="underline ml-1 font-semibold hover:text-yellow-600 dark:hover:text-yellow-200"
                          >
                            Go to settings page to configure your API endpoint and key.
                          </Link>
                        </AlertDescription>
                      </div>
                    </Alert>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="eaName" className="text-base">
                          Product Name
                        </Label>
                        <Input
                          id="eaName"
                          value={eaName}
                          onChange={(e) => setEaName(e.target.value)}
                          className="h-11"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="accountId" className="text-base">
                          Account ID
                        </Label>
                        <Input
                          id="accountId"
                          value={accountId}
                          onChange={(e) => setAccountId(e.target.value)}
                          className="h-11"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expiry" className="text-base">
                        Expiry Date
                      </Label>
                      <SimpleDatePicker date={expiryDate} setDate={setExpiryDate} />
                    </div>
                    <div className="pt-4">
                      <Button type="submit" disabled={isLoading || !apiConfigured} className="w-full h-11" size="lg">
                        {isLoading ? "Processing..." : "Generate License"}
                        {!isLoading && <Send className="ml-2 h-4 w-4" />}
                      </Button>
                    </div>
                  </form>

                  {error && (
                    <Alert variant="destructive" className="mt-6">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="response">
              <Card className="border-2 shadow-lg backdrop-blur-sm bg-background/80">
                <CardContent className="pt-6">
                  {response ? (
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">License Key</h3>
                        <Button onClick={handleDownload} variant="outline" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          Download License
                        </Button>
                      </div>
                      <div className="p-4 bg-muted rounded-md overflow-auto max-h-[500px] border">
                        <pre className="text-sm whitespace-pre-wrap">{response}</pre>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <p>No license generated yet. Use the License Details tab to create a license.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} SANKEY. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
