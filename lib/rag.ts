import { prisma } from './prisma'

export interface RetrievalResult {
  content: string
  category: string
  source: string
  score: number
}

export async function retrieveRelevantKnowledge(
  query: string,
  limit: number = 5
): Promise<RetrievalResult[]> {
  // Simple keyword-based retrieval (can be enhanced with vector embeddings)
  const queryLower = query.toLowerCase()
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2)
  
  // Get all knowledge items
  const allKnowledge = await prisma.knowledge.findMany()
  
  // Score each knowledge item
  const scored: RetrievalResult[] = allKnowledge.map(item => {
    const contentLower = (item.answer + ' ' + (item.question || '')).toLowerCase()
    
    // Calculate relevance score
    let score = 0
    for (const word of queryWords) {
      const wordCount = (contentLower.match(new RegExp(word, 'g')) || []).length
      score += wordCount * 2
      
      // Bonus for exact phrase match
      if (contentLower.includes(queryLower)) {
        score += 10
      }
      
      // Bonus for category match
      if (item.category.toLowerCase().includes(word)) {
        score += 5
      }
    }
    
    return {
      content: item.answer,
      category: item.category,
      source: item.source,
      score
    }
  })
  
  // Sort by score and return top results
  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

export function formatContextForLLM(results: RetrievalResult[]): string {
  if (results.length === 0) {
    return 'No relevant information found in the knowledge base.'
  }
  
  let context = 'Relevant information from Kenmark ITan Solutions knowledge base:\n\n'
  
  results.forEach((result, index) => {
    context += `[${index + 1}] Category: ${result.category}\n`
    context += `Content: ${result.content}\n\n`
  })
  
  return context
}

