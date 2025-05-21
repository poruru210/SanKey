"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface SimpleDatePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  className?: string
}

export function SimpleDatePicker({ date, setDate, className }: SimpleDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [year, setYear] = useState(date ? date.getFullYear() : new Date().getFullYear())
  const [month, setMonth] = useState(date ? date.getMonth() + 1 : new Date().getMonth() + 1)
  const [day, setDay] = useState(date ? date.getDate() : new Date().getDate())

  const formatDate = (date: Date) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
  }

  const handleApply = () => {
    const newDate = new Date(year, month - 1, day, 23, 59, 59)
    setDate(newDate)
    setIsOpen(false)
  }

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value) && value >= 2000 && value <= 2100) {
      setYear(value)
    }
  }

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value) && value >= 1 && value <= 12) {
      setMonth(value)
    }
  }

  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    const daysInMonth = new Date(year, month, 0).getDate()
    if (!isNaN(value) && value >= 1 && value <= daysInMonth) {
      setDay(value)
    }
  }

  return (
    <div className="relative">
      <Button
        variant={"outline"}
        className={cn("w-full justify-start text-left font-normal h-11", !date && "text-muted-foreground", className)}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {date ? formatDate(date) : <span>Pick a date</span>}
      </Button>

      {isOpen && (
        <div className="absolute z-50 mt-2 p-4 bg-background border rounded-md shadow-md w-full">
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Year</label>
              <Input type="number" min="2000" max="2100" value={year} onChange={handleYearChange} className="h-9" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Month</label>
              <Input type="number" min="1" max="12" value={month} onChange={handleMonthChange} className="h-9" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Day</label>
              <Input type="number" min="1" max="31" value={day} onChange={handleDayChange} className="h-9" />
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleApply}>
              Apply
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
