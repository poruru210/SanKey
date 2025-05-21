"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function GeometricBackground() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isDarkTheme = theme === "dark"

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Large shield shape */}
      <svg
        className="absolute top-0 right-0 w-[800px] h-[800px] opacity-[0.03] transform translate-x-1/3 -translate-y-1/4"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        fill={isDarkTheme ? "#ffffff" : "#0a5d26"}
      >
        <path d="M100 0 L200 40 L200 100 Q200 200 100 200 Q0 200 0 100 L0 40 Z" />
      </svg>

      {/* Leaf pattern */}
      <svg
        className="absolute bottom-0 left-0 w-[600px] h-[600px] opacity-[0.04] transform -translate-x-1/4 translate-y-1/4"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        fill={isDarkTheme ? "#ffffff" : "#0a5d26"}
      >
        <path d="M50,0 Q80,40 50,80 Q20,40 50,0 Z" />
      </svg>

      {/* Grid pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, ${
            isDarkTheme ? "rgba(255, 255, 255, 0.03)" : "rgba(10, 93, 38, 0.03)"
          } 1px, transparent 1px)`,
          backgroundSize: "30px 30px",
        }}
      ></div>

      {/* Diagonal lines */}
      <svg className="absolute top-0 left-0 w-full h-full opacity-[0.02]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="diagonalLines"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line x1="0" y1="0" x2="0" y2="40" stroke={isDarkTheme ? "#ffffff" : "#0a5d26"} strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#diagonalLines)" />
      </svg>

      {/* Hexagon pattern */}
      <div className="absolute top-1/2 right-1/4 transform -translate-y-1/2">
        <svg
          width="400"
          height="400"
          viewBox="0 0 100 100"
          className="opacity-[0.03]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="hexagons" width="50" height="43.4" patternUnits="userSpaceOnUse" patternTransform="scale(0.5)">
              <polygon
                points="25,0 50,0 75,25 75,75 50,100 25,100 0,75 0,25"
                fill="none"
                stroke={isDarkTheme ? "#ffffff" : "#0a5d26"}
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hexagons)" />
        </svg>
      </div>

      {/* Circles */}
      <div className="absolute bottom-1/4 left-1/4">
        <svg
          width="300"
          height="300"
          viewBox="0 0 100 100"
          className="opacity-[0.03]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="50" cy="50" r="40" fill="none" stroke={isDarkTheme ? "#ffffff" : "#0a5d26"} strokeWidth="1" />
          <circle cx="50" cy="50" r="30" fill="none" stroke={isDarkTheme ? "#ffffff" : "#0a5d26"} strokeWidth="1" />
          <circle cx="50" cy="50" r="20" fill="none" stroke={isDarkTheme ? "#ffffff" : "#0a5d26"} strokeWidth="1" />
        </svg>
      </div>

      {/* Growth chart */}
      <svg
        className="absolute top-1/3 left-2/3 w-[400px] h-[200px] opacity-[0.03] transform -translate-x-1/2"
        viewBox="0 0 100 50"
        xmlns="http://www.w3.org/2000/svg"
        stroke={isDarkTheme ? "#ffffff" : "#0a5d26"}
        fill="none"
        strokeWidth="1"
      >
        <polyline points="0,40 20,35 40,25 60,30 80,15 100,5" />
        <line x1="0" y1="45" x2="100" y2="45" />
        <line x1="0" y1="0" x2="0" y2="45" />
      </svg>
    </div>
  )
}
