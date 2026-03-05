"use client"

import { ComponentPropsWithoutRef, useEffect, useRef } from "react"
import { animate, useInView, useMotionValue, useSpring } from "motion/react"

import { cn } from "@/lib/utils"

interface NumberTickerProps extends ComponentPropsWithoutRef<"span"> {
  value: number
  startValue?: number
  direction?: "up" | "down"
  delay?: number
  decimalPlaces?: number
  stiffness?: number
  damping?: number
  /** Duración fija en segundos. Cuando se usa, todos los contadores terminan exactamente al mismo tiempo. */
  duration?: number
  /** Trigger externo: cuando pasa de false→true arranca la animación. Si no se pasa, usa useInView interno. */
  trigger?: boolean
}

export function NumberTicker({
  value,
  startValue = 0,
  direction = "up",
  delay = 0,
  className,
  decimalPlaces = 0,
  stiffness = 100,
  damping = 60,
  duration,
  trigger,
  ...props
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(direction === "down" ? value : startValue)
  const springValue = useSpring(motionValue, { damping, stiffness })
  const isInViewInternal = useInView(ref, { once: false, margin: "0px" })

  const isActive = trigger !== undefined ? trigger : isInViewInternal
  const targetValue = direction === "down" ? startValue : value
  const resetValue = direction === "down" ? value : startValue

  // Arranca / resetea la animación según isActive
  useEffect(() => {
    if (isActive) {
      motionValue.set(resetValue)
      const timer = setTimeout(() => {
        if (duration) {
          // Duración fija → todos terminan al mismo tiempo
          const controls = animate(motionValue, targetValue, {
            duration,
            ease: "easeOut",
          })
          return () => controls.stop()
        } else {
          // Spring clásico
          motionValue.set(targetValue)
        }
      }, delay * 1000)
      return () => clearTimeout(timer)
    } else {
      motionValue.set(resetValue)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive])

  // Escucha el valor correcto según el modo
  useEffect(() => {
    const source = duration ? motionValue : springValue
    return source.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Intl.NumberFormat("en-US", {
          minimumFractionDigits: decimalPlaces,
          maximumFractionDigits: decimalPlaces,
        }).format(Number(latest.toFixed(decimalPlaces)))
      }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, decimalPlaces])

  return (
    <span
      ref={ref}
      className={cn(
        "inline-block tracking-wider text-blue-950 tabular-nums dark:text-white",
        className
      )}
      {...props}
    >
      {startValue}
    </span>
  )
}
