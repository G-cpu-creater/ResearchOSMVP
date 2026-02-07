'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Editor } from '@tiptap/react'

interface NotesContextType {
  activeEditor: Editor | null
  setActiveEditor: (editor: Editor | null) => void
}

const NotesContext = createContext<NotesContextType | undefined>(undefined)

interface NotesProviderProps {
  children: ReactNode
}

export function NotesProvider({ children }: NotesProviderProps) {
  const [activeEditor, setActiveEditor] = useState<Editor | null>(null)

  return (
    <NotesContext.Provider value={{ activeEditor, setActiveEditor }}>
      {children}
    </NotesContext.Provider>
  )
}

export function useNotes() {
  const context = useContext(NotesContext)
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider')
  }
  return context
}
