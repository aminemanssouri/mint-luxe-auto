"use client"

import { motion } from "framer-motion"
import LoadingSpinner from "./loading-spinner"

interface PageLoaderProps {
  message?: string
}

export default function PageLoader({ message = "Loading..." }: PageLoaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-black flex flex-col items-center justify-center"
    >
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-3"
        >
          <LoadingSpinner size="md" />
          <h2 className="text-xl font-semibold text-white">{message}</h2>
        </motion.div>
      </div>
    </motion.div>
  )
}
