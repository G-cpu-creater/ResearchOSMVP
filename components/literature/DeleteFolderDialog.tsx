'use client'

import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

interface DeleteFolderDialogProps {
    folder: any
    open: boolean
    onClose: () => void
    onConfirm: (option: 'moveUp' | 'uncategorized' | 'cascade') => void
}

export function DeleteFolderDialog({ folder, open, onClose, onConfirm }: DeleteFolderDialogProps) {
    const [option, setOption] = useState<'moveUp' | 'uncategorized' | 'cascade'>('moveUp')

    if (!folder) return null

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Delete Folder: {folder.name}</DialogTitle>
                    <DialogDescription>
                        This folder contains {folder.papers?.length || 0} papers and {folder.children?.length || 0} subfolders.
                        What should happen to them?
                    </DialogDescription>
                </DialogHeader>

                <RadioGroup value={option} onValueChange={(val: any) => setOption(val)} className="py-4">
                    <div className="flex items-center space-x-2 mb-2">
                        <RadioGroupItem value="moveUp" id="moveUp" />
                        <Label htmlFor="moveUp" className="cursor-pointer">
                            Move to parent folder (safe option)
                        </Label>
                    </div>

                    <div className="flex items-center space-x-2 mb-2">
                        <RadioGroupItem value="uncategorized" id="uncategorized" />
                        <Label htmlFor="uncategorized" className="cursor-pointer">
                            Move to "Uncategorized"
                        </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="cascade" id="cascade" />
                        <Label htmlFor="cascade" className="cursor-pointer text-red-600 font-medium">
                            Delete everything (cannot be undone)
                        </Label>
                    </div>
                </RadioGroup>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button
                        variant={option === 'cascade' ? 'destructive' : 'default'}
                        onClick={() => onConfirm(option)}
                    >
                        {option === 'cascade' ? 'Delete All' : 'Delete Folder'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
