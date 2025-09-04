"use client"

import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

function formatDate(date: Date | undefined) {
  if (!date) return ""
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

function formatRange(range: DateRange | undefined) {
  if (!range?.from && !range?.to) return ""
  const from = formatDate(range?.from)
  const to = formatDate(range?.to)
  return to ? `${from} - ${to}` : from
}

export type DateRangePickerProps = {
  label?: string
  value?: DateRange
  onChange?: (range: DateRange | undefined) => void
  disabled?: (date: Date) => boolean
  numberOfMonths?: number
  id?: string
}

export function DateRangePicker({
  label = "Rental dates",
  value,
  onChange,
  disabled,
  numberOfMonths = 2,
  id = "date-range",
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [month, setMonth] = React.useState<Date | undefined>(value?.from ?? new Date())

  const display = React.useMemo(() => formatRange(value), [value])

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor={id} className="px-1 text-white/80">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          value={display}
          readOnly
          placeholder="Select a date range"
          className="bg-zinc-900 border-zinc-800 text-white placeholder:text-white/40 pr-10"
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault()
              setOpen(true)
            }
          }}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id={`${id}-trigger`}
              variant="ghost"
              className="absolute top-1/2 right-2 size-7 -translate-y-1/2 text-white/80 hover:text-white"
            >
              <CalendarIcon className="size-4" />
              <span className="sr-only">Select date range</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0 bg-zinc-950 border-zinc-800" align="end" alignOffset={-8} sideOffset={10}>
            <Calendar
              mode="range"
              selected={value}
              captionLayout="dropdown"
              month={month}
              onMonthChange={setMonth}
              onSelect={(r) => {
                onChange?.(r)
                if (r?.from && r?.to) setOpen(false)
              }}
              numberOfMonths={numberOfMonths}
              disabled={disabled}
              className="rounded-md"
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
