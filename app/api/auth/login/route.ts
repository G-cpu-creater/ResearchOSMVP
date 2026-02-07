import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, setAuthCookie } from '@/lib/auth'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export async function POST(request: NextRequest) {
  try {
    // Test database connection first
    try {
      await prisma.$connect()
    } catch (dbError: any) {
      console.error('Database connection error:', dbError)
      return NextResponse.json(
        { error: 'Database connection failed. Please check your database configuration.' },
        { status: 503 }
      )
    }

    const body = await request.json()
    console.log('Login attempt for email:', body.email)

    // Validate input
    const { email, password } = loginSchema.parse(body)

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      console.log('User not found:', email)
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    console.log('User found:', user.email)

    // Verify password
    const isValid = await verifyPassword(password, user.passwordHash)

    if (!isValid) {
      console.log('Invalid password for user:', email)
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    console.log('Password verified, setting auth cookie')

    // Set auth cookie
    await setAuthCookie(user.id)

    console.log('Login successful for user:', email)

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error: any) {
    console.error('Login error:', error)
    console.error('Error stack:', error.stack)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    // Provide more specific error messages
    if (error.code === 'P1001') {
      return NextResponse.json(
        { error: 'Cannot reach database server. Please check your DATABASE_URL.' },
        { status: 503 }
      )
    }

    if (error.code === 'P1003') {
      return NextResponse.json(
        { error: 'Database does not exist. Please run migrations.' },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: `Login failed: ${error.message || 'Unknown error'}` },
      { status: 500 }
    )
  }
}
