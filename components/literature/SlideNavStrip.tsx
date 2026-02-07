'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Home, Folder, ChevronRight, Pin, PinOff } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export function SlideNavStrip() {
    const [isVisible, setIsVisible] = useState(true)
    const [isPinned, setIsPinned] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('navStripPinned') === 'true'
        }
        return false
    })
    const timeoutRef = useRef<NodeJS.Timeout>()

    useEffect(() => {
        if (isPinned) return

        // Auto-hide after 5 seconds
        timeoutRef.current = setTimeout(() => {
            setIsVisible(false)
        }, 5000)

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [isPinned])

    const handleMouseEnter = () => {
        setIsVisible(true)
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
    }

    const handleMouseLeave = () => {
        if (isPinned) return

        timeoutRef.current = setTimeout(() => {
            setIsVisible(false)
        }, 5000)
    }

    const togglePin = () => {
        const newPinned = !isPinned
        setIsPinned(newPinned)
        if (typeof window !== 'undefined') {
            localStorage.setItem('navStripPinned', String(newPinned))
        }
    }

    return (
        <>
            {/* Collapsed icon */}
            {!isVisible && (
                <button
                    onClick={() => setIsVisible(true)}
                    className="fixed left-0 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-2 rounded-r-md shadow-lg z-50 hover:bg-blue-700 transition-colors"
                    aria-label="Show navigation"
                >
                    <ChevronRight className="h-5 w-5" />
                </button>
            )}

            {/* Expanded strip */}
            <div
                className={cn(
                    "fixed left-0 top-0 h-full w-16 bg-gray-900 text-white shadow-xl z-40 transition-transform duration-350 ease-in-out",
                    isVisible ? "translate-x-0" : "-translate-x-full"
                )}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div className="flex flex-col items-center py-4 gap-4">
                    <button
                        onClick={togglePin}
                        className="p-2 hover:bg-gray-800 rounded transition-colors"
                        title={isPinned ? "Unpin navigation" : "Pin navigation"}
                    >
                        {isPinned ? <Pin className="h-5 w-5" /> : <PinOff className="h-5 w-5" />}
                    </button>

                    <Link
                        href="/dashboard"
                        className="p-2 hover:bg-gray-800 rounded transition-colors"
                        title="Dashboard"
                    >
                        <Home className="h-5 w-5" />
                    </Link>

                    <Link
                        href="/dashboard/projects"
                        className="p-2 hover:bg-gray-800 rounded transition-colors"
                        title="Projects"
                    >
                        <Folder className="h-5 w-5" />
                    </Link>
                </div>
            </div>
        </>
    )
}
