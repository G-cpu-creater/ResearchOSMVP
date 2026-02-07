import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const email = process.argv[2] || 'test@example.com'
  const password = process.argv[3] || 'password123'
  const name = process.argv[4] || 'Test User'

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      console.log(`User with email ${email} already exists!`)
      console.log(`User ID: ${existingUser.id}`)
      console.log(`Name: ${existingUser.name}`)
      return
    }

    // Hash password
    const passwordHash = await hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
      },
    })

    console.log('✅ Test user created successfully!')
    console.log(`Email: ${user.email}`)
    console.log(`Password: ${password}`)
    console.log(`Name: ${user.name}`)
    console.log(`User ID: ${user.id}`)
  } catch (error) {
    console.error('Error creating test user:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
