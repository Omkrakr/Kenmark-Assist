import { scrapeWebsite, saveScrapedContent } from '../lib/scraper'
import { parseExcelFile, saveExcelKnowledge } from '../lib/excel-parser'

async function main() {
  console.log('🚀 Initializing knowledge base...\n')

  try {
    // Scrape website
    console.log('📡 Scraping website: https://kenmarkitan.com')
    const contents = await scrapeWebsite('https://kenmarkitan.com')
    console.log(`✅ Scraped ${contents.length} pages\n`)

    // Save scraped content
    console.log('💾 Saving scraped content to database...')
    await saveScrapedContent(contents)
    console.log('✅ Saved scraped content\n')

    // Parse and save Excel file if it exists
    try {
      const excelPath = './knowledge-base.xlsx'
      console.log(`📊 Parsing Excel file: ${excelPath}`)
      const knowledge = await parseExcelFile(excelPath)
      console.log(`✅ Parsed ${knowledge.length} knowledge items\n`)

      console.log('💾 Saving Excel knowledge to database...')
      await saveExcelKnowledge(knowledge)
      console.log('✅ Saved Excel knowledge\n')
    } catch (error) {
      console.log('⚠️  Excel file not found or error parsing (this is okay)\n')
    }

    console.log('🎉 Knowledge base initialization complete!')
  } catch (error) {
    console.error('❌ Error initializing knowledge base:', error)
    process.exit(1)
  }
}

main()

