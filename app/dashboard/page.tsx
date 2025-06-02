"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Car, Calendar, Settings, Bell, LogOut, Plus, Eye, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import LanguageSwitcher from "@/components/language-switcher"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const { t, isRTL } = useLanguage()

  const userCars = [
    {
      id: 1,
      name: "Phantom Spectre",
      model: "2024",
      status: "Active",
      nextService: "2024-02-15",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 2,
      name: "Celestial GT",
      model: "2023",
      status: "In Service",
      nextService: "2024-01-20",
      image: "/placeholder.svg?height=200&width=300",
    },
  ]

  const recentBookings = [
    {
      id: 1,
      service: t.services.premiumMaintenance,
      date: "2024-01-15",
      status: "Completed",
      car: "Phantom Spectre",
    },
    {
      id: 2,
      service: t.services.customPersonalization,
      date: "2024-01-20",
      status: "In Progress",
      car: "Celestial GT",
    },
    {
      id: 3,
      service: t.services.expressService,
      date: "2024-01-25",
      status: "Scheduled",
      car: "Phantom Spectre",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "In Progress":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "Scheduled":
        return <Calendar className="h-4 w-4 text-blue-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "In Progress":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "Scheduled":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="text-xl font-bold text-gold">
              LUXURY CARS
            </Link>
            <div className={`flex items-center ${isRTL ? "space-x-reverse space-x-4" : "space-x-4"}`}>
              <LanguageSwitcher />
              <Button variant="ghost" size="icon" className="text-white hover:text-gold">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:text-gold">
                <Settings className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-gold"
                onClick={() => (window.location.href = "/")}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">{t.dashboard.welcomeBack}</h1>
            <p className="text-white/70">{t.dashboard.manageCollection}</p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-4 mb-8">
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardContent className="p-6">
                <div className={`flex items-center ${isRTL ? "justify-start" : "justify-between"}`}>
                  <div>
                    <p className="text-sm text-white/70">{t.dashboard.totalCars}</p>
                    <p className="text-2xl font-bold text-white">2</p>
                  </div>
                  <Car className={`h-8 w-8 text-gold ${isRTL ? "mr-auto" : ""}`} />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardContent className="p-6">
                <div className={`flex items-center ${isRTL ? "justify-start" : "justify-between"}`}>
                  <div>
                    <p className="text-sm text-white/70">{t.dashboard.activeServices}</p>
                    <p className="text-2xl font-bold text-white">1</p>
                  </div>
                  <Clock className={`h-8 w-8 text-gold ${isRTL ? "mr-auto" : ""}`} />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardContent className="p-6">
                <div className={`flex items-center ${isRTL ? "justify-start" : "justify-between"}`}>
                  <div>
                    <p className="text-sm text-white/70">{t.dashboard.completed}</p>
                    <p className="text-2xl font-bold text-white">5</p>
                  </div>
                  <CheckCircle className={`h-8 w-8 text-gold ${isRTL ? "mr-auto" : ""}`} />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardContent className="p-6">
                <div className={`flex items-center ${isRTL ? "justify-start" : "justify-between"}`}>
                  <div>
                    <p className="text-sm text-white/70">{t.dashboard.nextService}</p>
                    <p className="text-2xl font-bold text-white">5 days</p>
                  </div>
                  <Calendar className={`h-8 w-8 text-gold ${isRTL ? "mr-auto" : ""}`} />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* My Cars */}
            <div className="lg:col-span-2">
              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                  <div className={`flex items-center ${isRTL ? "justify-start" : "justify-between"}`}>
                    <CardTitle className="text-white">{t.dashboard.myCars}</CardTitle>
                    <Button size="sm" className="bg-gold hover:bg-gold/90 text-black">
                      <Plus className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                      {t.dashboard.addCar}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userCars.map((car) => (
                      <div
                        key={car.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-zinc-800/50 border border-zinc-700"
                      >
                        <div className={`flex items-center ${isRTL ? "space-x-reverse space-x-4" : "space-x-4"}`}>
                          <div className="h-16 w-24 rounded-lg bg-zinc-700 overflow-hidden">
                            <img
                              src={car.image || "/placeholder.svg"}
                              alt={car.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium text-white">{car.name}</h3>
                            <p className="text-sm text-white/70">{car.model}</p>
                            <Badge
                              variant="outline"
                              className={
                                car.status === "Active"
                                  ? "border-green-500/20 text-green-500"
                                  : "border-yellow-500/20 text-yellow-500"
                              }
                            >
                              {car.status === "Active" ? t.dashboard.active : t.dashboard.inService}
                            </Badge>
                          </div>
                        </div>
                        <div className={isRTL ? "text-left" : "text-right"}>
                          <p className="text-sm text-white/70">{t.dashboard.nextService}</p>
                          <p className="text-sm text-white">{car.nextService}</p>
                          <Button variant="ghost" size="sm" className="text-gold hover:text-gold/80 mt-2">
                            <Eye className={`h-4 w-4 ${isRTL ? "ml-1" : "mr-1"}`} />
                            {t.dashboard.viewCar}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Bookings */}
            <div>
              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white">{t.dashboard.recentBookings}</CardTitle>
                  <CardDescription className="text-white/70">{t.dashboard.latestAppointments}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className={`flex items-start p-3 rounded-lg bg-zinc-800/30 ${isRTL ? "space-x-reverse space-x-3" : "space-x-3"}`}
                      >
                        {getStatusIcon(booking.status)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white">{booking.service}</p>
                          <p className="text-xs text-white/70">{booking.car}</p>
                          <p className="text-xs text-white/60">{booking.date}</p>
                        </div>
                        <Badge variant="outline" className={`text-xs ${getStatusColor(booking.status)}`}>
                          {booking.status === "Completed"
                            ? t.dashboard.completed
                            : booking.status === "In Progress"
                              ? t.dashboard.inProgress
                              : t.dashboard.scheduled}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-4 border-zinc-700 text-white hover:bg-zinc-800"
                    onClick={() => (window.location.href = "/services/booking")}
                  >
                    {t.dashboard.bookNewService}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
