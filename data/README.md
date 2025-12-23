# Knowledge Base Data

This directory contains sample knowledge base files for the chatbot.

## Files

- `knowledge-base.csv` - Sample knowledge base in CSV format

## Converting CSV to Excel

To convert the CSV file to Excel format (.xlsx) for upload:

### Option 1: Using Excel/Google Sheets
1. Open `knowledge-base.csv` in Excel or Google Sheets
2. Save as `.xlsx` format
3. Upload via the admin panel

### Option 2: Using Python (if you have it installed)
```bash
pip install pandas openpyxl
python -c "import pandas as pd; pd.read_csv('knowledge-base.csv').to_excel('knowledge-base.xlsx', index=False)"
```

### Option 3: Online Converter
Use an online CSV to Excel converter like:
- https://convertio.co/csv-xlsx/
- https://www.zamzar.com/convert/csv-to-xlsx/

## File Format

The Excel file should have the following columns:
- **Category** - Category of the knowledge (About, Services, Contact, FAQ, etc.)
- **Question** - The question (optional but recommended)
- **Answer** - The answer to the question

Example:
| Category | Question | Answer |
|----------|----------|--------|
| About | What is Kenmark ITan Solutions? | Kenmark ITan Solutions is a technology company... |

