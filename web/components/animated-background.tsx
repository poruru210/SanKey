"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

export function AnimatedBackground() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isDarkTheme = theme === "dark"
  const primaryColor = isDarkTheme ? "rgba(255, 255, 255, 0.05)" : "rgba(10, 93, 38, 0.05)"
  const secondaryColor = isDarkTheme ? "rgba(255, 255, 255, 0.03)" : "rgba(10, 93, 38, 0.03)"

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Animated grid pattern */}
      <div
        className="absolute inset-0 animate-pulse-slow"
        style={{
          backgroundImage: `
            linear-gradient(${primaryColor} 1px, transparent 1px),
            linear-gradient(to right, ${primaryColor} 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Animated circles */}
      <div className="absolute inset-0">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
        <div className="circle circle-4"></div>
      </div>

      {/* Diagonal lines with animation */}
      <div
        className="absolute inset-0 animate-slide-slow"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            ${secondaryColor} 0px,
            ${secondaryColor} 1px,
            transparent 1px,
            transparent 30px
          )`,
        }}
      />

      {/* Hexagon pattern with animation */}
      <div
        className="absolute inset-0 animate-float-slow opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 L55 20 L55 50 L30 65 L5 50 L5 20 Z' fill='none' stroke='${
            isDarkTheme ? "%23ffffff" : "%230a5d26"
          }' strokeOpacity='0.05' strokeWidth='1'/%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  )
}
