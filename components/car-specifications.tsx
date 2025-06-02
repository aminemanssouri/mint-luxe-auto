"use client"

import { motion } from "framer-motion"
import { Fuel, Gauge, Clock, Calendar, Users, Power, Zap, Sliders, BarChart, Ruler, Weight, Cog } from "lucide-react"

interface CarSpecificationsProps {
  specifications: Record<string, string>
}

export default function CarSpecifications({ specifications }: CarSpecificationsProps) {
  // Map specification keys to icons
  const getIcon = (key: string) => {
    switch (key) {
      case "engine":
        return <Power className="h-5 w-5 text-gold" />
      case "power":
        return <Zap className="h-5 w-5 text-gold" />
      case "torque":
        return <BarChart className="h-5 w-5 text-gold" />
      case "acceleration":
        return <Clock className="h-5 w-5 text-gold" />
      case "topSpeed":
        return <Gauge className="h-5 w-5 text-gold" />
      case "transmission":
        return <Cog className="h-5 w-5 text-gold" />
      case "fuelEconomy":
        return <Fuel className="h-5 w-5 text-gold" />
      case "fuelTank":
        return <Fuel className="h-5 w-5 text-gold" />
      case "range":
        return <Sliders className="h-5 w-5 text-gold" />
      case "seating":
        return <Users className="h-5 w-5 text-gold" />
      case "dimensions":
        return <Ruler className="h-5 w-5 text-gold" />
      case "weight":
        return <Weight className="h-5 w-5 text-gold" />
      case "year":
        return <Calendar className="h-5 w-5 text-gold" />
      default:
        return <Sliders className="h-5 w-5 text-gold" />
    }
  }

  // Format specification keys for display
  const formatKey = (key: string) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim()
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {Object.entries(specifications).map(([key, value]) => (
        <motion.div
          key={key}
          variants={item}
          className="flex items-center justify-between rounded-lg bg-zinc-900/30 p-4"
        >
          <div className="flex items-center">
            <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800">
              {getIcon(key)}
            </div>
            <span className="text-white/70">{formatKey(key)}</span>
          </div>
          <span className="font-medium text-white">{value}</span>
        </motion.div>
      ))}
    </motion.div>
  )
}
