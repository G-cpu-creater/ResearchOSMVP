// Mock Database for Demo Mode
// This allows the app to run without a real database

export const mockUsers = [
  {
    id: '1',
    email: 'demo@researchos.com',
    name: 'Demo User',
    passwordHash: '$2b$10$YourHashHere', // password: demo123
  },
]

export const mockProjects = [
  {
    id: '1',
    userId: '1',
    title: 'Battery Research Project',
    description: 'Lithium-ion battery cycling analysis',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    userId: '1',
    title: 'Fuel Cell Study',
    description: 'PEMFC performance optimization',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export const mockDatasets = [
  {
    id: '1',
    projectId: '1',
    name: 'CV_Scan_001.csv',
    technique: 'Cyclic Voltammetry',
    fileType: 'csv',
    fileSize: 15420,
    uploadedAt: new Date(),
    parsedData: {
      xData: [-0.5, -0.4, -0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5],
      yData: [0, 5, 15, 25, 20, 10, 5, -5, -10, -5, 0],
    },
  },
]

export const isDemoMode = !process.env.DATABASE_URL || process.env.DATABASE_URL.includes('demo')

export async function getMockUser(email: string) {
  if (!isDemoMode) return null
  return mockUsers.find(u => u.email === email)
}

export async function getMockProjects(userId: string) {
  if (!isDemoMode) return []
  return mockProjects.filter(p => p.userId === userId)
}

export async function getMockDatasets(projectId: string) {
  if (!isDemoMode) return []
  return mockDatasets.filter(d => d.projectId === projectId)
}
