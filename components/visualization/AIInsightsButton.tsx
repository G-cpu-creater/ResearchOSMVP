'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'

interface AIInsightsButtonProps {
    onClick: () => void
    disabled?: boolean
}

export function AIInsightsButton({ onClick, disabled }: AIInsightsButtonProps) {
    return (
        <Button
            onClick={onClick}
            disabled={disabled}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
        >
            <Sparkles className="mr-2 h-4 w-4" />
            AI Insights
        </Button>
    )
}
