import * as XLSX from 'xlsx'
import { prisma } from './prisma'

export interface ExcelKnowledge {
  category: string
  question: string
  answer: string
}

export async function parseExcelFile(filePath: string): Promise<ExcelKnowledge[]> {
  try {
    const workbook = XLSX.readFile(filePath)
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const data = XLSX.utils.sheet_to_json(worksheet) as any[]
    
    const knowledge: ExcelKnowledge[] = []
    
    for (const row of data) {
      const category = row.Category || row.category || 'General'
      const question = row.Question || row.question || ''
      const answer = row.Answer || row.answer || ''
      
      if (answer) {
        knowledge.push({
          category: String(category),
          question: String(question),
          answer: String(answer)
        })
      }
    }
    
    return knowledge
  } catch (error) {
    console.error('Error parsing Excel file:', error)
    throw error
  }
}

export async function parseExcelBuffer(buffer: Buffer): Promise<ExcelKnowledge[]> {
  try {
    const workbook = XLSX.read(buffer, { type: 'buffer' })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const data = XLSX.utils.sheet_to_json(worksheet) as any[]
    
    const knowledge: ExcelKnowledge[] = []
    
    for (const row of data) {
      const category = row.Category || row.category || 'General'
      const question = row.Question || row.question || ''
      const answer = row.Answer || row.answer || ''
      
      if (answer) {
        knowledge.push({
          category: String(category),
          question: String(question),
          answer: String(answer)
        })
      }
    }
    
    return knowledge
  } catch (error) {
    console.error('Error parsing Excel buffer:', error)
    throw error
  }
}

export async function saveExcelKnowledge(knowledge: ExcelKnowledge[]) {
  for (const item of knowledge) {
    // Check if similar knowledge exists
    const existing = await prisma.knowledge.findFirst({
      where: {
        category: item.category,
        question: item.question,
        source: 'excel'
      }
    })

    if (existing) {
      await prisma.knowledge.update({
        where: { id: existing.id },
        data: {
          answer: item.answer,
          updatedAt: new Date()
        }
      })
    } else {
      await prisma.knowledge.create({
        data: {
          category: item.category,
          question: item.question,
          answer: item.answer,
          source: 'excel'
        }
      })
    }
  }
}

