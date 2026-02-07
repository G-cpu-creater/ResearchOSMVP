'use client'

import React, { useRef, useEffect, useState } from 'react'
import { HotTable } from '@handsontable/react'
import { registerAllModules } from 'handsontable/registry'
import 'handsontable/dist/handsontable.full.min.css'
import { Button } from '@/components/ui/button'
import { Save, Download } from 'lucide-react'

// Register Handsontable modules
registerAllModules()

interface SpreadsheetEditorProps {
    data: any[]
    columns: string[]
    onSave: (newData: any[]) => void
    onSelectionChange?: (startRow: number, endRow: number) => void
}

export function SpreadsheetEditor({ data, columns, onSave, onSelectionChange }: SpreadsheetEditorProps) {
    const hotRef = useRef<any>(null)
    const [hotData, setHotData] = useState<any[]>(data)

    useEffect(() => {
        setHotData(data)
    }, [data])

    const handleSave = () => {
        if (hotRef.current) {
            const hot = hotRef.current.hotInstance
            const newData = hot.getSourceData()
            onSave(newData)
        }
    }

    const handleAfterSelectionEnd = (row: number, col: number, row2: number, col2: number) => {
        if (onSelectionChange) {
            const startRow = Math.min(row, row2)
            const endRow = Math.max(row, row2)
            onSelectionChange(startRow, endRow)
        }
    }

    return (
        <div className="flex flex-col h-full space-y-2">
            <div className="flex justify-between items-center p-2 bg-gray-50 border rounded-md">
                <div className="text-sm text-gray-500">
                    Select rows to analyze specific data points
                </div>
                <Button size="sm" onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                </Button>
            </div>

            <div className="flex-1 overflow-hidden border rounded-md">
                <HotTable
                    ref={hotRef}
                    data={hotData}
                    colHeaders={columns}
                    rowHeaders={true}
                    width="100%"
                    height="100%"
                    licenseKey="non-commercial-and-evaluation"
                    contextMenu={true}
                    manualColumnResize={true}
                    manualRowResize={true}
                    filters={true}
                    dropdownMenu={true}
                    afterSelectionEnd={handleAfterSelectionEnd}
                    stretchH="all"
                />
            </div>
        </div>
    )
}
