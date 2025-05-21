import Link from "next/link"
import Image from "next/image"

export function MainNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center gap-2 mr-4">
          <Image src="/images/sankey-logo.png" alt="Sankey Logo" width={40} height={40} className="h-10 w-auto" />
          <span className="text-xl font-bold text-primary hidden sm:inline-block">SANKEY</span>
        </div>
        <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
            License Generator
          </Link>
          <Link
            href="/settings"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Settings
          </Link>
        </nav>
        <div className="ml-auto flex items-center space-x-4">{/* Light/Dark mode toggle removed as requested */}</div>
      </div>
    </header>
  )
}
