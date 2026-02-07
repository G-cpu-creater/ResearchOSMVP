import { prisma } from './prisma'

/**
 * Validate if a user has access to a project
 */
export async function validateProjectAccess(
  userId: string,
  projectId: string
): Promise<boolean> {
  try {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: userId
      }
    })

    return !!project
  } catch (error) {
    console.error('Project access validation error:', error)
    return false
  }
}

/**
 * Get user ID from session (placeholder - adjust based on your auth setup)
 */
export async function getUserIdFromRequest(): Promise<string | null> {
  // This is a placeholder - implement based on your authentication
  // For example, using next-auth:
  // const session = await getServerSession()
  // return session?.user?.id || null
  
  // For now, returning null - you'll need to integrate with your auth
  return null
}
