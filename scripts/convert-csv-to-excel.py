#!/usr/bin/env python3
"""
Convert knowledge-base.csv to knowledge-base.xlsx
Requires: pip install pandas openpyxl
"""

import pandas as pd
import os
import sys

def convert_csv_to_excel():
    csv_path = os.path.join('data', 'knowledge-base.csv')
    excel_path = os.path.join('data', 'knowledge-base.xlsx')
    
    if not os.path.exists(csv_path):
        print(f"Error: {csv_path} not found!")
        sys.exit(1)
    
    try:
        # Read CSV
        df = pd.read_csv(csv_path)
        
        # Write to Excel
        df.to_excel(excel_path, index=False, engine='openpyxl')
        
        print(f"✅ Successfully converted {csv_path} to {excel_path}")
        print(f"📊 Total rows: {len(df)}")
    except ImportError:
        print("Error: Required packages not installed.")
        print("Please run: pip install pandas openpyxl")
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == '__main__':
    convert_csv_to_excel()

