"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2 } from "lucide-react"
import { Button, ButtonProps } from "./button"
import { cn } from "@/lib/utils"

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean
  loadingText?: string
  loadingDelay?: number // Delay in milliseconds before showing loading state
  children: React.ReactNode
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ 
    className, 
    loading = false, 
    loadingText, 
    loadingDelay = 300,
    children, 
    disabled,
    onClick,
    ...props 
  }, ref) => {
    const [showLoading, setShowLoading] = React.useState(false)
    const [isClicked, setIsClicked] = React.useState(false)
    const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)

    React.useEffect(() => {
      if (loading) {
        // Clear any existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        
        // Set timeout for loading delay
        timeoutRef.current = setTimeout(() => {
          setShowLoading(true)
        }, loadingDelay)
      } else {
        // Clear timeout and hide loading immediately when loading stops
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        setShowLoading(false)
        setIsClicked(false)
      }

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }, [loading, loadingDelay])

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!loading && !disabled) {
        setIsClicked(true)
        onClick?.(e)
      }
    }

    return (
      <Button
        ref={ref}
        className={cn(
          "relative overflow-hidden transition-all duration-200",
          (loading || showLoading) && "cursor-not-allowed",
          isClicked && "scale-95",
          className
        )}
        disabled={disabled || loading || showLoading}
        onClick={handleClick}
        {...props}
      >
        <AnimatePresence mode="wait">
          {showLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <Loader2 className="h-4 w-4" />
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ripple effect on click */}
        {isClicked && (
          <motion.div
            className="absolute inset-0 bg-white/20 rounded-md"
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        )}
      </Button>
    )
  }
)

LoadingButton.displayName = "LoadingButton"

export { LoadingButton }
export type { LoadingButtonProps }
