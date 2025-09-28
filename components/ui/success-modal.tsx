"use client"

import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  actionText?: string
  onAction?: () => void
}

export default function SuccessModal({
  isOpen,
  onClose,
  title,
  message,
  actionText = "Continue",
  onAction
}: SuccessModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-800 p-8 shadow-2xl">
              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4 text-white/70 hover:text-white hover:bg-white/10"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>

              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5, type: "spring", bounce: 0.4 }}
                className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20"
              >
                <CheckCircle className="h-8 w-8 text-green-500" />
              </motion.div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="text-center"
              >
                <h3 className="mb-3 text-xl font-bold text-white">{title}</h3>
                <p className="mb-6 text-white/70">{message}</p>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 border-zinc-700 text-white hover:bg-zinc-800"
                    onClick={onClose}
                  >
                    Close
                  </Button>
                  {onAction && (
                    <Button
                      className="flex-1 bg-gold text-black hover:bg-gold/90"
                      onClick={() => {
                        onAction()
                        onClose()
                      }}
                    >
                      {actionText}
                    </Button>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
