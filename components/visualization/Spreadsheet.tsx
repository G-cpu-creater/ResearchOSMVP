'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'

interface SpreadsheetProps {
    data: string[][]
    headers: string[]
    selectedColumns: Set<number>
    onColumnSelect: (index: number) => void
    selectedRows: Set<number>
    onRowSelect: (index: number) => void
    onSelectAllRows: (selected: boolean) => void
}

export function Spreadsheet({
    data,
    headers,
    selectedColumns,
    onColumnSelect,
    selectedRows,
    onRowSelect,
    onSelectAllRows
}: SpreadsheetProps) {
    const allRowsSelected = data.length > 0 && selectedRows.size === data.length

    return (
        <Card className="overflow-hidden h-full flex flex-col">
            <div className="border rounded-lg overflow-auto flex-1">
                <table className="w-full border-collapse relative">
                    <thead className="bg-gray-100 sticky top-0 z-10">
                        <tr>
                            <th className="border p-2 text-xs font-semibold text-gray-600 bg-gray-200 w-10 text-center">
                                <Checkbox
                                    checked={allRowsSelected}
                                    onCheckedChange={(checked) => onSelectAllRows(checked as boolean)}
                                />
                            </th>
                            <th className="border p-2 text-xs font-semibold text-gray-600 bg-gray-200 w-10">
                                #
                            </th>
                            {headers.map((header, index) => (
                                <th
                                    key={index}
                                    onClick={() => onColumnSelect(index)}
                                    className={`border p-2 text-sm font-semibold cursor-pointer transition-colors whitespace-nowrap ${selectedColumns.has(index)
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                        }`}
                                >
                                    {header || `Column ${index + 1}`}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.slice(0, 100).map((row, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-gray-50">
                                <td className="border p-2 text-center bg-gray-50">
                                    <Checkbox
                                        checked={selectedRows.has(rowIndex)}
                                        onCheckedChange={() => onRowSelect(rowIndex)}
                                    />
                                </td>
                                <td className="border p-2 text-xs text-gray-500 bg-gray-50 font-mono text-center">
                                    {rowIndex + 1}
                                </td>
                                {row.map((cell, cellIndex) => (
                                    <td
                                        key={cellIndex}
                                        className={`border p-2 text-sm whitespace-nowrap ${selectedColumns.has(cellIndex)
                                                ? 'bg-blue-50'
                                                : ''
                                            }`}
                                    >
                                        {cell}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {data.length > 100 && (
                    <div className="p-4 text-center text-sm text-gray-600 bg-gray-50 border-t">
                        Showing first 100 rows of {data.length}
                    </div>
                )}
            </div>

            <div className="p-3 bg-gray-50 border-t flex justify-between items-center text-xs text-gray-500">
                <span>{data.length} rows</span>
                <span>
                    {selectedRows.size} rows selected • {selectedColumns.size} columns selected
                </span>
            </div>
        </Card>
    )
}
