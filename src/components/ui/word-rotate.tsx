"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion, MotionProps } from "motion/react"

import { cn } from "@/lib/utils"

interface WordRotateProps {
    words: string[]
    duration?: number
    motionProps?: MotionProps
    className?: string
    as?: "h1" | "span"
}

export function WordRotate({
    words,
    duration = 2500,
    motionProps = {
        initial: { opacity: 0, y: -50 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 50 },
        transition: { duration: 0.25, ease: "easeOut" },
    },
    className,
    as = "h1",
}: WordRotateProps) {
    const [index, setIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % words.length)
        }, duration)

        // Clean up interval on unmount
        return () => clearInterval(interval)
    }, [words, duration])

    const MotionTag = as === "span" ? motion.span : motion.h1

    return (
        <span className={cn("overflow-hidden inline-block align-bottom", as === "h1" && "py-2")}>
            <AnimatePresence mode="wait">
                <MotionTag
                    key={words[index]}
                    className={cn(className)}
                    {...motionProps}
                >
                    {words[index]}
                </MotionTag>
            </AnimatePresence>
        </span>
    )
}
