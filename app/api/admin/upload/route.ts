import { NextRequest, NextResponse } from 'next/server'
import { parseExcelBuffer, saveExcelKnowledge } from '@/lib/excel-parser'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }
    
    // Check file type
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload an Excel file (.xlsx or .xls)' },
        { status: 400 }
      )
    }
    
    // Read file buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // Parse Excel
    const knowledge = await parseExcelBuffer(buffer)
    
    // Save to database
    await saveExcelKnowledge(knowledge)
    
    return NextResponse.json({
      success: true,
      message: `Successfully imported ${knowledge.length} knowledge items`,
      count: knowledge.length
    })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to upload file' },
      { status: 500 }
    )
  }
}

