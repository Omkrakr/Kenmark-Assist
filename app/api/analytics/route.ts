import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Ensure Node.js runtime (needed for Prisma)
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    
    // Get most asked questions
    const topQuestions = await prisma.analytics.findMany({
      orderBy: { count: 'desc' },
      take: limit,
      select: {
        question: true,
        count: true,
        lastAsked: true
      }
    })
    
    // Get total stats
    const totalQuestions = await prisma.analytics.aggregate({
      _sum: { count: true }
    })
    
    const uniqueQuestions = await prisma.analytics.count()
    
    return NextResponse.json({
      topQuestions,
      stats: {
        totalQuestions: totalQuestions._sum.count || 0,
        uniqueQuestions
      }
    })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve analytics' },
      { status: 500 }
    )
  }
}

