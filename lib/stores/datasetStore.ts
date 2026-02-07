import { create } from 'zustand'
import { Dataset } from '@/types/analysis'

interface DatasetStore {
  dataset: Dataset | null
  setDataset: (dataset: Dataset) => void
  clearDataset: () => void
}

export const useDatasetStore = create<DatasetStore>((set) => ({
  dataset: null,
  
  setDataset: (dataset) => set({ dataset }),
  
  clearDataset: () => set({ dataset: null }),
}))
