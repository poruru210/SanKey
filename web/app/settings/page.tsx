"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { Save, ArrowLeft } from "lucide-react"
import { ParticlesBackground } from "@/components/particles-background"

export default function SettingsPage() {
  const [apiEndpoint, setApiEndpoint] = useState("")
  const [apiKey, setApiKey] = useState("")
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    // Load saved settings when component mounts
    const savedEndpoint = localStorage.getItem("apiEndpoint")
    const savedApiKey = localStorage.getItem("apiKey")

    if (savedEndpoint) setApiEndpoint(savedEndpoint)
    if (savedApiKey) setApiKey(savedApiKey)
  }, [])

  const handleSave = () => {
    // Validate inputs
    if (!apiEndpoint.trim()) {
      toast({
        title: "Validation Error",
        description: "API Endpoint URL is required",
        variant: "destructive",
      })
      return
    }

    if (!apiKey.trim()) {
      toast({
        title: "Validation Error",
        description: "API Key is required",
        variant: "destructive",
      })
      return
    }

    // Save settings to localStorage
    localStorage.setItem("apiEndpoint", apiEndpoint)
    localStorage.setItem("apiKey", apiKey)

    toast({
      title: "Settings saved",
      description: "Your API configuration has been saved successfully.",
    })

    router.push("/")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ParticlesBackground />
      <MainNav />
      <main className="flex-1 container py-10">
        <div className="max-w-2xl mx-auto">
          <Button variant="ghost" onClick={() => router.push("/")} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to License Generator
          </Button>

          <Card className="border-2 shadow-lg backdrop-blur-sm bg-background/80">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl text-primary">License Server Settings</CardTitle>
              <CardDescription>Configure your license server connection settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="apiEndpoint" className="text-base">
                  License Server URL
                </Label>
                <Input
                  id="apiEndpoint"
                  value={apiEndpoint}
                  onChange={(e) => setApiEndpoint(e.target.value)}
                  placeholder="https://example.execute-api.region.amazonaws.com/prod/endpoint"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apiKey" className="text-base">
                  License Server API Key
                </Label>
                <Input
                  id="apiKey"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  type="password"
                  placeholder="Your API key"
                  className="h-11"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end pt-4">
              <Button onClick={handleSave} size="lg" className="px-8">
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </Button>
            </CardFooter>
          </Card>
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
