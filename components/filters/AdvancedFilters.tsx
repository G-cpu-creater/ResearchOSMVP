'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Filter, X, Calendar, Tag } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export interface FilterCriteria {
  dateRange?: { start: string; end: string }
  technique?: string[]
  instrument?: string[]
  tags?: string[]
  status?: string[]
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

interface AdvancedFiltersProps {
  onFilterChange: (filters: FilterCriteria) => void
  activeFilters: FilterCriteria
}

export function AdvancedFilters({ onFilterChange, activeFilters }: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [localFilters, setLocalFilters] = useState<FilterCriteria>(activeFilters)

  const techniques = ['CV', 'EIS', 'CA', 'CP', 'Battery Cycling', 'Tafel']
  const instruments = ['BioLogic', 'Gamry', 'Neware', 'Autolab', 'Other']
  const statuses = ['Active', 'Completed', 'Archived', 'Draft']

  const applyFilters = () => {
    onFilterChange(localFilters)
    setIsOpen(false)
  }

  const clearFilters = () => {
    const empty: FilterCriteria = {}
    setLocalFilters(empty)
    onFilterChange(empty)
  }

  const activeFilterCount = Object.keys(activeFilters).filter(key => {
    const value = activeFilters[key as keyof FilterCriteria]
    return Array.isArray(value) ? value.length > 0 : !!value
  }).length

  const toggleArrayFilter = (key: keyof FilterCriteria, value: string) => {
    setLocalFilters(prev => {
      const current = (prev[key] as string[]) || []
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value]
      return { ...prev, [key]: updated }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="relative">
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {activeFilterCount > 0 && (
            <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Advanced Filters</DialogTitle>
          <DialogDescription>
            Refine your search with multiple criteria
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Date Range */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Date Range
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate" className="text-xs text-gray-500">From</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={localFilters.dateRange?.start || ''}
                  onChange={(e) => setLocalFilters(prev => ({
                    ...prev,
                    dateRange: { ...prev.dateRange, start: e.target.value } as any
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="endDate" className="text-xs text-gray-500">To</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={localFilters.dateRange?.end || ''}
                  onChange={(e) => setLocalFilters(prev => ({
                    ...prev,
                    dateRange: { ...prev.dateRange, end: e.target.value } as any
                  }))}
                />
              </div>
            </div>
          </div>

          {/* Technique */}
          <div className="space-y-2">
            <Label>Electrochemical Technique</Label>
            <div className="flex flex-wrap gap-2">
              {techniques.map(tech => (
                <button
                  key={tech}
                  onClick={() => toggleArrayFilter('technique', tech)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    localFilters.technique?.includes(tech)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tech}
                </button>
              ))}
            </div>
          </div>

          {/* Instrument */}
          <div className="space-y-2">
            <Label>Instrument</Label>
            <div className="flex flex-wrap gap-2">
              {instruments.map(inst => (
                <button
                  key={inst}
                  onClick={() => toggleArrayFilter('instrument', inst)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    localFilters.instrument?.includes(inst)
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {inst}
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Project Status</Label>
            <div className="flex flex-wrap gap-2">
              {statuses.map(status => (
                <button
                  key={status}
                  onClick={() => toggleArrayFilter('status', status)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    localFilters.status?.includes(status)
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div className="space-y-2">
            <Label>Sort By</Label>
            <div className="grid grid-cols-2 gap-4">
              <select
                className="px-3 py-2 border rounded-md"
                value={localFilters.sortBy || 'createdAt'}
                onChange={(e) => setLocalFilters(prev => ({ ...prev, sortBy: e.target.value }))}
              >
                <option value="createdAt">Date Created</option>
                <option value="updatedAt">Last Modified</option>
                <option value="title">Name (A-Z)</option>
                <option value="size">File Size</option>
              </select>
              <select
                className="px-3 py-2 border rounded-md"
                value={localFilters.sortOrder || 'desc'}
                onChange={(e) => setLocalFilters(prev => ({ ...prev, sortOrder: e.target.value as 'asc' | 'desc' }))}
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-4 border-t">
          <Button variant="ghost" onClick={clearFilters}>
            Clear All
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={applyFilters}>
              Apply Filters
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

/**
 * Active filters display
 */
export function ActiveFiltersDisplay({ filters, onRemoveFilter }: {
  filters: FilterCriteria
  onRemoveFilter: (key: keyof FilterCriteria, value?: string) => void
}) {
  const filterTags: { key: keyof FilterCriteria; label: string; value?: string }[] = []

  if (filters.technique) {
    filters.technique.forEach(t => filterTags.push({ key: 'technique', label: `Technique: ${t}`, value: t }))
  }
  if (filters.instrument) {
    filters.instrument.forEach(i => filterTags.push({ key: 'instrument', label: `Instrument: ${i}`, value: i }))
  }
  if (filters.status) {
    filters.status.forEach(s => filterTags.push({ key: 'status', label: `Status: ${s}`, value: s }))
  }
  if (filters.dateRange) {
    filterTags.push({ key: 'dateRange', label: `Date: ${filters.dateRange.start} to ${filters.dateRange.end}` })
  }

  if (filterTags.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg">
      <span className="text-sm text-gray-600">Active filters:</span>
      {filterTags.map((tag, index) => (
        <Badge key={index} variant="secondary" className="flex items-center gap-1">
          {tag.label}
          <button
            onClick={() => onRemoveFilter(tag.key, tag.value)}
            className="ml-1 hover:text-red-600"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
    </div>
  )
}
