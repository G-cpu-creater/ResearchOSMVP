import { create } from 'zustand'

export type FileNode = {
  id: string
  name: string
  type: 'file'
  extension: string
  size: number
  url: string
  parentId: string | null
  projectId: string
  isExpanded: false
}

export type FolderNode = {
  id: string
  name: string
  type: 'folder'
  extension: null
  size: null
  url: null
  parentId: string | null
  projectId: string
  isExpanded: boolean
}

export type TreeNode = FileNode | FolderNode

type FileManagerStore = {
  nodes: Record<string, TreeNode>
  selectedNodeId: string | null
  projectId: string | null
  isLoading: boolean
  
  setProjectId: (id: string) => void
  setNodes: (nodes: TreeNode[]) => void
  selectNode: (id: string | null) => void
  toggleFolder: (id: string) => void
  
  // CRUD operations
  createFolder: (name: string, parentId: string | null) => Promise<void>
  renameNode: (id: string, newName: string) => Promise<void>
  deleteNode: (id: string) => Promise<void>
  addFile: (file: TreeNode) => void
  
  // Helpers
  updateNode: (id: string, updates: Partial<TreeNode>) => void
}

export const useFileManagerStore = create<FileManagerStore>((set, get) => ({
  nodes: {},
  selectedNodeId: null,
  projectId: null,
  isLoading: false,
  
  setProjectId: (id) => set({ projectId: id }),
  
  setNodes: (nodes) => {
    const nodeMap: Record<string, TreeNode> = {}
    nodes.forEach(node => {
      nodeMap[node.id] = node
    })
    set({ nodes: nodeMap, isLoading: false })
  },
  
  selectNode: (id) => set({ selectedNodeId: id }),
  
  toggleFolder: (id) => {
    const { nodes } = get()
    const node = nodes[id]
    if (node?.type === 'folder') {
      set({
        nodes: {
          ...nodes,
          [id]: { ...node, isExpanded: !node.isExpanded }
        }
      })
    }
  },
  
  updateNode: (id, updates) => {
    const { nodes } = get()
    const node = nodes[id]
    if (node) {
      set({
        nodes: {
          ...nodes,
          [id]: { ...node, ...updates } as TreeNode
        }
      })
    }
  },
  
  createFolder: async (name, parentId) => {
    const { projectId, nodes } = get()
    if (!projectId) return
    
    try {
      const res = await fetch(`/api/projects/${projectId}/files/folders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, parentId }),
      })
      
      if (res.ok) {
        const newFolder = await res.json()
        set({
          nodes: {
            ...nodes,
            [newFolder.id]: newFolder
          }
        })
      }
    } catch (error) {
      console.error('Failed to create folder:', error)
    }
  },
  
  renameNode: async (id, newName) => {
    const { projectId, nodes } = get()
    if (!projectId) return
    
    try {
      const res = await fetch(`/api/projects/${projectId}/files/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName }),
      })
      
      if (res.ok) {
        set({
          nodes: {
            ...nodes,
            [id]: { ...nodes[id], name: newName } as TreeNode
          }
        })
      }
    } catch (error) {
      console.error('Failed to rename:', error)
    }
  },
  
  deleteNode: async (id) => {
    const { projectId, nodes, selectedNodeId } = get()
    if (!projectId) return
    
    try {
      const res = await fetch(`/api/projects/${projectId}/files/${id}`, {
        method: 'DELETE',
      })
      
      if (res.ok) {
        // Remove this node and all children recursively
        const removeNodeAndChildren = (nodeId: string, nodeMap: Record<string, TreeNode>) => {
          const newMap = { ...nodeMap }
          delete newMap[nodeId]
          
          // Find and remove children
          Object.values(nodeMap).forEach(node => {
            if (node.parentId === nodeId) {
              removeNodeAndChildren(node.id, newMap)
            }
          })
          
          return newMap
        }
        
        const newNodes = removeNodeAndChildren(id, nodes)
        set({
          nodes: newNodes,
          selectedNodeId: selectedNodeId === id ? null : selectedNodeId
        })
      }
    } catch (error) {
      console.error('Failed to delete:', error)
    }
  },
  
  addFile: (file) => {
    const { nodes } = get()
    set({
      nodes: {
        ...nodes,
        [file.id]: file
      }
    })
  },
}))
