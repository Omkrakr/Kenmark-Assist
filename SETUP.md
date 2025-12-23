# Quick Setup Guide

## Step-by-Step Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up MongoDB Database ⚠️ REQUIRED FIRST

**You MUST set up MongoDB before running Prisma commands!**

Choose one option:

#### Option A: MongoDB Atlas (Cloud) - ⭐ RECOMMENDED

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a free cluster (M0)
4. Set up database user and network access
5. Get connection string
6. See [MONGODB_SETUP.md](./MONGODB_SETUP.md) for detailed steps

#### Option B: Local MongoDB

1. Install MongoDB Community Server
2. Start MongoDB service
3. See [MONGODB_SETUP.md](./MONGODB_SETUP.md) for installation steps

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

**For MongoDB Atlas:**
```env
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/kenmark-bot?retryWrites=true&w=majority"
OLLAMA_HOST="http://localhost:11434"
OLLAMA_MODEL="llama3.2"
```

**For Local MongoDB:**
```env
DATABASE_URL="mongodb://localhost:27017/kenmark-bot"
OLLAMA_HOST="http://localhost:11434"
OLLAMA_MODEL="llama3.2"
```

### 4. Set Up Database

```bash
# Generate Prisma Client
npm run prisma:generate

# Push schema to database
npm run prisma:push
```

### 5. Install Ollama (Optional but Recommended)

**Windows:**
1. Download from [ollama.ai](https://ollama.ai)
2. Install and run
3. Pull a model:
```bash
ollama pull llama3.2
```

**macOS/Linux:**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
ollama pull llama3.2
```

### 6. Initialize Knowledge Base

**Option A: Automatic (Recommended)**
```bash
npm run init-knowledge
```

**Option B: Manual via Admin Panel**
1. Start the dev server: `npm run dev`
2. Visit `http://localhost:3000/admin`
3. Click "Scrape Website"
4. Upload Excel file (convert CSV first if needed)

### 7. Convert CSV to Excel (Optional)

If you want to upload the sample knowledge base:

**Using Python:**
```bash
pip install pandas openpyxl
python scripts/convert-csv-to-excel.py
```

**Or manually:**
1. Open `data/knowledge-base.csv` in Excel
2. Save as `.xlsx` format
3. Upload via admin panel

### 8. Run the Application

```bash
npm run dev
```

Visit `http://localhost:3000` and start chatting! 🎉

## Troubleshooting

### "Cannot connect to database" / "Connection refused"
- ⚠️ **MongoDB is not running or not accessible**
- **For Local MongoDB:**
  - Ensure MongoDB service is running (`Get-Service MongoDB` on Windows)
  - Check if port 27017 is accessible
- **For MongoDB Atlas:**
  - Ensure your IP is whitelisted in Network Access
  - Verify connection string has correct username/password
  - Check if cluster is running (not paused)
- See [MONGODB_SETUP.md](./MONGODB_SETUP.md) for detailed setup instructions

### "Ollama not available"
- Install Ollama from [ollama.ai](https://ollama.ai)
- Run `ollama pull llama3.2`
- Check `OLLAMA_HOST` in `.env`
- The chatbot will work with fallback mode if Ollama is unavailable

### "Prisma Client not generated"
```bash
npm run prisma:generate
```

### Excel upload fails
- Ensure file is `.xlsx` or `.xls`
- Check column names: Category, Question, Answer
- File size should be reasonable (< 10MB)

## Next Steps

1. ✅ Test the chat functionality
2. ✅ Visit admin panel and explore analytics
3. ✅ Customize the knowledge base with your own data
4. ✅ Deploy to Vercel/Netlify for production

## Production Deployment

### Vercel
1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy!

### Environment Variables for Production
- `DATABASE_URL` - MongoDB connection string
- `OLLAMA_HOST` - (Optional) External Ollama instance
- `OLLAMA_MODEL` - Model name

---

**Need Help?** Check the main [README.md](./README.md) for detailed documentation.

