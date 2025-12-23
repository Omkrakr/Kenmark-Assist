# 🤖 Kenmark ITan Solutions - AI Chatbot

A production-ready, full-stack AI-powered chatbot for Kenmark ITan Solutions website. This chatbot uses Retrieval-Augmented Generation (RAG) to provide intelligent, context-aware responses based on company information, services, and FAQs.

## 🌟 Features

- **AI-Powered Chat Interface**: Beautiful, responsive chat widget with dark/light mode
- **RAG System**: Retrieval-Augmented Generation for accurate, non-hallucinatory responses
- **Website Content Extraction**: Automatically scrapes and indexes website content
- **Excel Knowledge Base**: Upload Excel files with FAQs, services, and company information
- **Session Persistence**: Chat history persists during user sessions
- **Analytics Dashboard**: Track most asked questions and user interactions
- **Admin Panel**: Manage knowledge base, upload Excel files, and view analytics
- **Local LLM Support**: Uses Ollama for local AI processing (with fallback)
- **Modern Tech Stack**: Next.js 16, TypeScript, Tailwind CSS 4, MongoDB, Prisma

## 🛠️ Tech Stack

### Frontend
- **Next.js 16.x** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4.x**
- **Radix UI** (Dialog components)
- **Lucide React** (Icons)

### Backend
- **Next.js API Routes**
- **Prisma ORM**
- **MongoDB**
- **Ollama** (Local LLM - LLaMA/Mistral/Phi models)

### Libraries
- **Cheerio** (Web scraping)
- **XLSX** (Excel parsing)
- **Axios** (HTTP requests)

## 📋 Prerequisites

- **Node.js** 18+ and npm
- **MongoDB** database (local or cloud like MongoDB Atlas)
- **Ollama** (optional, for local LLM - install from [ollama.ai](https://ollama.ai))

## 🚀 Setup & Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd kenmark-bot
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="mongodb://localhost:27017/kenmark-bot"
# Or use MongoDB Atlas:
# DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/kenmark-bot"

# Ollama (optional - defaults to localhost:11434)
OLLAMA_HOST="http://localhost:11434"
OLLAMA_MODEL="llama3.2"
# Alternative models: "mistral", "phi3", "llama2"
```

### 4. Set Up Database ⚠️ IMPORTANT

**Before running Prisma commands, ensure MongoDB is set up!**

#### Step 1: Test MongoDB Connection
```bash
npm run test:db
```

If connection fails, see [MONGODB_SETUP.md](./MONGODB_SETUP.md) for detailed setup instructions.

#### Step 2: Generate Prisma Client & Push Schema
```bash
# Generate Prisma Client
npm run prisma:generate

# Push schema to database (MongoDB doesn't use migrations)
npm run prisma:push
```

### 5. Initialize Knowledge Base

#### Option A: Use the Script (Recommended)

```bash
# Make sure MongoDB is running and DATABASE_URL is set
npm run init-knowledge
```

#### Option B: Manual Setup

1. **Scrape Website**: Visit `/admin` and click "Scrape Website"
2. **Upload Excel**: Upload `knowledge-base.xlsx` from the `data` folder

### 6. Start Ollama (Optional but Recommended)

If using local LLM:

```bash
# Install Ollama from https://ollama.ai
# Then pull a model:
ollama pull llama3.2
# Or: ollama pull mistral
```

### 7. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
kenmark-bot/
├── app/
│   ├── api/
│   │   ├── chat/          # Chat API endpoints
│   │   ├── scrape/         # Website scraping endpoint
│   │   ├── admin/          # Admin upload endpoint
│   │   └── analytics/      # Analytics endpoint
│   ├── admin/              # Admin panel page
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/
│   └── chat/               # Chat UI components
│       ├── ChatWidget.tsx
│       ├── ChatMessages.tsx
│       └── ChatInput.tsx
├── lib/
│   ├── prisma.ts           # Prisma client
│   ├── utils.ts            # Utility functions
│   ├── scraper.ts          # Website scraping logic
│   ├── excel-parser.ts     # Excel file parsing
│   ├── rag.ts              # RAG retrieval system
│   └── ollama-client.ts    # Ollama LLM integration
├── prisma/
│   └── schema.prisma       # Database schema
├── scripts/
│   └── init-knowledge.ts   # Knowledge base initialization
├── data/
│   └── knowledge-base.xlsx # Sample Excel knowledge file
└── README.md
```

## 📊 Excel Knowledge File Format

The chatbot supports Excel files (`.xlsx`) with the following structure:

| Category | Question | Answer |
|----------|----------|--------|
| About | What is Kenmark ITan Solutions? | Kenmark ITan Solutions is a technology company... |
| Services | What services are offered? | We offer web hosting, development, design... |
| Contact | How can I contact the company? | Visit our contact page or email info@kenmarkitan.com |

**Required Columns:**
- `Category` (or `category`)
- `Question` (or `question`) - Optional
- `Answer` (or `answer`)

## 🎯 Usage

### For Users

1. Visit the homepage
2. Click the chat button (bottom-right)
3. Ask questions about Kenmark ITan Solutions
4. The chatbot will respond based on the knowledge base

### For Admins

1. Visit `/admin`
2. **Scrape Website**: Extract content from kenmarkitan.com
3. **Upload Excel**: Upload knowledge files in the specified format
4. **View Analytics**: See most asked questions and statistics

## 🔧 Configuration

### Using Different LLM Models

Edit `.env`:

```env
OLLAMA_MODEL="mistral"  # or "phi3", "llama2", etc.
```

### Fallback Behavior

If Ollama is not available, the chatbot uses a keyword-based fallback system that still provides relevant responses from the knowledge base.

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `DATABASE_URL`
   - `OLLAMA_HOST` (if using external Ollama)
   - `OLLAMA_MODEL`
4. Deploy!

### Deploy to Netlify

1. Build the project: `npm run build`
2. Deploy the `.next` folder
3. Configure environment variables

### Database Setup

For production, use **MongoDB Atlas** (free tier available):
1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Update `DATABASE_URL` in environment variables

## 🧪 Testing

```bash
# Run development server
npm run dev

# Test chat functionality
# Open browser and interact with the chat widget

# Test admin panel
# Visit http://localhost:3000/admin
```

## 📝 API Endpoints

### POST `/api/chat`
Send a chat message and get AI response.

**Request:**
```json
{
  "message": "What services do you offer?",
  "sessionId": "optional-session-id"
}
```

**Response:**
```json
{
  "response": "We offer web hosting, development...",
  "sessionId": "session-id"
}
```

### GET `/api/chat?sessionId=<id>`
Retrieve chat history for a session.

### POST `/api/scrape`
Scrape website content.

**Request:**
```json
{
  "url": "https://kenmarkitan.com"
}
```

### POST `/api/admin/upload`
Upload Excel knowledge file.

**Request:** FormData with `file` field

### GET `/api/analytics`
Get analytics data (top questions, stats).

## 🐛 Troubleshooting

### Ollama Connection Issues

If you see "Ollama not available" messages:
1. Ensure Ollama is installed and running
2. Check `OLLAMA_HOST` in `.env`
3. Verify model is pulled: `ollama list`
4. The chatbot will use fallback mode automatically

### Database Connection Issues

1. Verify MongoDB is running
2. Check `DATABASE_URL` in `.env`
3. Run `npx prisma db push` to sync schema

### Excel Upload Fails

1. Ensure file is `.xlsx` or `.xls` format
2. Check column names match (Category, Question, Answer)
3. Verify file is not corrupted

## 🎨 Customization

### Styling

Edit `components/chat/ChatWidget.tsx` to customize chat appearance.

### System Prompt

Modify `lib/ollama-client.ts` to change the AI's behavior and tone.

### RAG Retrieval

Adjust `lib/rag.ts` to change how knowledge is retrieved and scored.

## 📄 License

This project is created as an intern assignment for Kenmark ITan Solutions.

## 👨‍💻 Developer

Built with ❤️ as a standout intern project demonstrating:
- Full-stack development skills
- AI/ML integration
- Modern web technologies
- Production-ready architecture

## 🙏 Acknowledgments

- Kenmark ITan Solutions for the opportunity
- Next.js team for the amazing framework
- Ollama for local LLM capabilities
- Open source community for excellent libraries

---

**Note**: This chatbot is designed to only answer questions within its knowledge base. For questions outside the scope, it politely directs users to contact the company directly.
