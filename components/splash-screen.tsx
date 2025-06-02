"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export default function SplashScreen() {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
          delay: 0.2,
        }}
        className="relative h-32 w-64"
      >
        <Image
          src="/Gemini_Generated_Image_1vhj7r1vhj7r1vhj.png"
          alt="Luxury Cars Logo"
          fill
          className="object-contain"
          priority
        />
      </motion.div>
      <motion.div
        initial={{ width: "0%" }}
        animate={{ width: "80%" }}
        transition={{
          duration: 2.5,
          ease: "easeInOut",
          delay: 0.5,
        }}
        className="absolute bottom-20 left-[10%] h-0.5 bg-gradient-to-r from-gold/20 via-gold to-gold/20"
      />
    </motion.div>
  )
}
