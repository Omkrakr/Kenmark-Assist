import axios from 'axios'
import * as cheerio from 'cheerio'
import { prisma } from './prisma'

export interface ScrapedContent {
  title: string
  content: string
  url: string
  category: string
}

export async function scrapeWebsite(url: string): Promise<ScrapedContent[]> {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    
    const $ = cheerio.load(response.data)
    const contents: ScrapedContent[] = []
    
    // Extract main content
    const title = $('title').text() || 'Kenmark ITan Solutions'
    const mainContent = $('main, article, .content, #content').text() || $('body').text()
    
    // Extract navigation links to scrape additional pages
    const links: string[] = []
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href')
      if (href && (href.startsWith('/') || href.includes('kenmarkitan.com'))) {
        const fullUrl = href.startsWith('http') ? href : `${url}${href}`
        if (!links.includes(fullUrl) && fullUrl.includes('kenmarkitan.com')) {
          links.push(fullUrl)
        }
      }
    })
    
    // Main page content
    contents.push({
      title: title,
      content: cleanText(mainContent),
      url: url,
      category: 'About'
    })
    
    // Scrape key pages
    const keyPages = ['/about-us', '/services', '/contact-us', '/hosting', '/development']
    for (const page of keyPages) {
      try {
        const pageUrl = `${url}${page}`
        const pageResponse = await axios.get(pageUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          },
          timeout: 5000
        })
        const page$ = cheerio.load(pageResponse.data)
        const pageTitle = page$('title').text() || page
        const pageContent =
          page$('main, article, .content').text() || page$('body').text()
        
        let category = 'About'
        if (page.includes('services')) category = 'Services'
        else if (page.includes('contact')) category = 'Contact'
        else if (page.includes('hosting')) category = 'Services'
        else if (page.includes('development')) category = 'Services'
        
        contents.push({
          title: pageTitle,
          content: cleanText(pageContent),
          url: pageUrl,
          category: category
        })
      } catch (err) {
        console.log(`Failed to scrape ${page}:`, err)
      }
    }
    
    return contents
  } catch (error) {
    console.error('Error scraping website:', error)
    throw error
  }
}

function cleanText(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .replace(/\n+/g, '\n')
    .trim()
    .substring(0, 10000) // Limit content length
}

export async function saveScrapedContent(contents: ScrapedContent[]) {
  for (const content of contents) {
    // Split content into chunks for better retrieval
    const chunks = chunkText(content.content, 500)
    
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i]
      await prisma.knowledge.create({
        data: {
          answer: chunk,
          category: content.category,
          source: 'website',
          question: `${content.title} - Part ${i + 1}`,
          metadata: {
            title: content.title,
            url: content.url,
            chunkIndex: i
          }
        }
      })
    }
  }
}

function chunkText(text: string, chunkSize: number): string[] {
  const chunks: string[] = []
  const words = text.split(' ')
  
  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize).join(' '))
  }
  
  return chunks
}

