'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sparkles, Search, BookOpen, FileText } from 'lucide-react'
import { ResearchAIChat } from '@/components/ai/ResearchAIChat'
import { Breadcrumbs } from './Breadcrumbs'

interface PaperRightPanelProps {
    paper: any
    onClose: () => void
}

export function PaperRightPanel({ paper, onClose }: PaperRightPanelProps) {
    return (
        <div className="w-96 border-l bg-white flex flex-col h-full shadow-xl">
            <div className="p-4 border-b bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="font-semibold text-gray-900 truncate max-w-[200px]" title={paper.title}>
                        {paper.title}
                    </h2>
                    <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
                </div>
                <Breadcrumbs paper={paper} />
            </div>

            <Tabs defaultValue="ai" className="flex-1 flex flex-col">
                <div className="px-4 pt-2">
                    <TabsList className="w-full grid grid-cols-3">
                        <TabsTrigger value="ai">AI Assistant</TabsTrigger>
                        <TabsTrigger value="details">Details</TabsTrigger>
                        <TabsTrigger value="notes">Notes</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="ai" className="flex-1 flex flex-col p-0 m-0 overflow-hidden">
                    <div className="flex-1 overflow-hidden">
                        <ResearchAIChat
                            context={{
                                projectInfo: `Current Paper: ${paper.title}\nAbstract: ${paper.abstract || 'No abstract available'}`
                            }}
                        />
                    </div>
                </TabsContent>

                <TabsContent value="details" className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Abstract</h3>
                            <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                                {paper.abstract || 'No abstract available.'}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Journal</h3>
                                <p className="text-sm">{paper.journal || 'N/A'}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Year</h3>
                                <p className="text-sm">{paper.year || 'N/A'}</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-gray-500">DOI</h3>
                            <a
                                href={`https://doi.org/${paper.doi}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                            >
                                {paper.doi}
                                <ExternalLink className="h-3 w-3" />
                            </a>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="notes" className="flex-1 p-4">
                    <textarea
                        className="w-full h-full p-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Add your notes here..."
                        defaultValue={paper.notes}
                    />
                </TabsContent>
            </Tabs>
        </div>
    )
}

import { ExternalLink } from 'lucide-react'
