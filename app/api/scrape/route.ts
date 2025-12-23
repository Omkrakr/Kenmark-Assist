import { NextRequest, NextResponse } from 'next/server'
import { scrapeWebsite, saveScrapedContent } from '@/lib/scraper'

// Ensure Node.js runtime (needed for axios, cheerio, Prisma)
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()
    const targetUrl = url || 'https://kenmarkitan.com'
    
    // Scrape website
    const contents = await scrapeWebsite(targetUrl)
    
    // Save to database
    await saveScrapedContent(contents)
    
    return NextResponse.json({
      success: true,
      message: `Successfully scraped ${contents.length} pages`,
      pages: contents.map(c => ({ title: c.title, url: c.url, category: c.category }))
    })
  } catch (error: any) {
    console.error('Scrape error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to scrape website' },
      { status: 500 }
    )
  }
}

