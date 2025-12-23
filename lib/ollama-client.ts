import { Ollama } from 'ollama'
import OpenAI from 'openai'
import { formatContextForLLM, retrieveRelevantKnowledge } from './rag'

const ollama = new Ollama({
  host: process.env.OLLAMA_HOST || 'http://localhost:11434'
})

const openaiApiKey = process.env.OPENAI_API_KEY
const openaiClient = openaiApiKey ? new OpenAI({ apiKey: openaiApiKey }) : null

const SMALL_TALK_KEYWORDS = [
  'hi',
  'hello',
  'hey',
  'good morning',
  'good afternoon',
  'good evening',
  'how are you',
  "what's up",
  'whats up'
]

const FORBIDDEN_KEYWORDS = [
  'fuck',
  'shit',
  'bitch',
  'bastard',
  'asshole',
  'porn',
  'sex',
  'nude',
  'naked'
]

const SYSTEM_PROMPT = `You are an AI assistant for Kenmark ITan Solutions, a technology company based in Mumbai, India.
Your role is to help users with information about the company, its services, and answer their questions.

Guidelines:
- Answer questions using ONLY the information provided in the context
- Be polite, professional, and concise
- Prefer clear bullet-pointed answers rather than long paragraphs whenever possible.
- If the information is not available in the context, politely say: "I don't have that information yet. Please contact us directly for more details."
- Do not make up or hallucinate information
- Focus on being helpful and accurate
- If asked about contact information, provide the details from the context
- If the user greets or makes small talk, respond briefly and professionally.
- If the user asks inappropriate, offensive, or vulgar questions, reply: "Sorry, I can't answer this question."

Always base your responses on the provided context.`

export async function generateResponse(
  userQuery: string,
  sessionId?: string
): Promise<string> {
  try {
    // Quick safety / small-talk handling
    const normalized = userQuery.toLowerCase()

    if (FORBIDDEN_KEYWORDS.some(word => normalized.includes(word))) {
      return "Sorry, I can't answer this question."
    }

    if (SMALL_TALK_KEYWORDS.some(word => normalized.includes(word))) {
      return "- Hello! I'm the virtual assistant for Kenmark ITan Solutions.\n- How can I help you today?"
    }

    // Retrieve relevant knowledge
    const relevantKnowledge = await retrieveRelevantKnowledge(userQuery, 5)
    const context = formatContextForLLM(relevantKnowledge)
    
    // If no relevant knowledge found, try OpenAI fallback (ChatGPT), else default
    if (relevantKnowledge.length === 0) {
      if (openaiClient) {
        return await generateOpenAIFallback(userQuery)
      }
      return formatAsBullets([
        "I don't have that information yet in my knowledge base.",
        'Please contact us directly at info@kenmarkitan.com or visit our website for more details.'
      ])
    }
    
    // Prepare the prompt
    const prompt = `${context}\n\nUser Question: ${userQuery}\n\nAssistant Response (use bullet points where appropriate):`
    
    // Try to use Ollama (local LLM)
    try {
      const model = process.env.OLLAMA_MODEL || 'llama3.2' // or 'mistral', 'phi3', etc.
      
      const response = await ollama.generate({
        model,
        prompt,
        system: SYSTEM_PROMPT,
        options: {
          temperature: 0.7,
          top_p: 0.9
        }
      })
      
      return formatTextToBullets(response.response.trim())
    } catch (ollamaError) {
      // Fallback: if Ollama is not available, try OpenAI then keyword fallback
      console.warn('Ollama not available, trying OpenAI fallback:', ollamaError)
      if (openaiClient) {
        return await generateOpenAIFallback(userQuery)
      }
      return generateFallbackResponse(userQuery, relevantKnowledge)
    }
  } catch (error) {
    console.error('Error generating response:', error)
    return formatAsBullets([
      "I'm having trouble processing your request right now.",
      'Please try again in a moment or contact us directly.'
    ])
  }
}

function generateFallbackResponse(
  query: string,
  knowledge: Array<{ content: string; category: string }>
): string {
  if (knowledge.length === 0) {
    return formatAsBullets([
      "I don't have that information yet in my knowledge base.",
      'Please contact us directly for more details.'
    ])
  }
  
  // Use the most relevant knowledge item
  const bestMatch = knowledge[0]
  
  // Try to extract a relevant portion
  const queryWords = query.toLowerCase().split(/\s+/)
  const content = bestMatch.content
  
  // Simple extraction: find sentences containing query words
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0)
  const relevantSentences = sentences.filter(sentence => {
    const sentenceLower = sentence.toLowerCase()
    return queryWords.some(word => sentenceLower.includes(word))
  })
  
  const selected =
    relevantSentences.length > 0
      ? relevantSentences.slice(0, 3)
      : sentences.slice(0, 2)

  return formatTextToBullets(selected.join('. ').trim() + '.')
}

async function generateOpenAIFallback(userQuery: string): Promise<string> {
  if (!openaiClient) {
    return formatAsBullets([
      "I don't have that information yet in my knowledge base.",
      'Please contact us directly for more details.'
    ])
  }

  const prompt = `
You are an AI assistant for Kenmark ITan Solutions. Provide a concise, professional answer in bullet points.
- Keep it short and relevant.
- If the question is inappropriate or vulgar, reply: "Sorry, I can't answer this question."
- If you truly cannot answer, say: "I don't have that information yet."

User question: ${userQuery}
`

  const completion = await openaiClient.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are a concise, professional assistant. Prefer bullet points.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.5,
    max_tokens: 300
  })

  const text = completion.choices[0]?.message?.content?.trim() || ''
  return formatTextToBullets(text)
}

function formatAsBullets(lines: string[]): string {
  return lines
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => `- ${line}`)
    .join('\n')
}

function formatTextToBullets(text: string): string {
  if (!text) return ''

  // If the model already used bullets, keep them
  if (text.trim().startsWith('- ') || text.includes('\n- ')) {
    return text
  }

  // Split into sentences and turn them into bullets
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 0)

  if (sentences.length === 1) {
    return `- ${sentences[0]}`
  }

  return sentences.map(s => `- ${s}`).join('\n')
}

