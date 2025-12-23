import { NextRequest, NextResponse } from 'next/server'
import { generateResponse } from '@/lib/ollama-client'
import { prisma } from '@/lib/prisma'
import { randomUUID } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId } = await request.json()
    
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }
    
    // Generate or use existing session ID
    const currentSessionId = sessionId || randomUUID()
    
    // Save user message
    await prisma.chatMessage.create({
      data: {
        sessionId: currentSessionId,
        role: 'user',
        content: message
      }
    })
    
    // Track analytics
    const existing = await prisma.analytics.findFirst({
      where: { question: message }
    })

    if (existing) {
      await prisma.analytics.update({
        where: { id: existing.id },
        data: {
          count: { increment: 1 },
          lastAsked: new Date()
        }
      })
    } else {
      await prisma.analytics.create({
        data: {
          question: message,
          count: 1
        }
      })
    }
    
    // Generate AI response
    const response = await generateResponse(message, currentSessionId)
    
    // Save assistant message
    await prisma.chatMessage.create({
      data: {
        sessionId: currentSessionId,
        role: 'assistant',
        content: response
      }
    })
    
    return NextResponse.json({
      response,
      sessionId: currentSessionId
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }
    
    const messages = await prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' }
    })
    
    return NextResponse.json({ messages })
  } catch (error) {
    console.error('Get messages error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve messages' },
      { status: 500 }
    )
  }
}

