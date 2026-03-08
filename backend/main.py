from fastapi import FastAPI
from pydantic import BaseModel
import sqlite3
from typing import List, Optional
import datetime

app = FastAPI()

# Database Setup
def init_db():
    conn = sqlite3.connect('data/nexus.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS intel (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT,
        title TEXT,
        summary TEXT,
        url TEXT UNIQUE,
        published_at TIMESTAMP,
        importance INTEGER DEFAULT 1,
        source_name TEXT
    )''')
    conn.commit()
    conn.close()

init_db()

class IntelItem(BaseModel):
    category: str
    title: str
    summary: str
    url: str
    published_at: datetime.datetime
    importance: int
    source_name: str

@app.get("/")
def read_root():
    return {"message": "Nexus Intel API is running"}

@app.get("/intel", response_model=List[IntelItem])
def get_intel(category: Optional[str] = None):
    conn = sqlite3.connect('data/nexus.db')
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    if category:
        c.execute("SELECT * FROM intel WHERE category = ? ORDER BY published_at DESC", (category,))
    else:
        c.execute("SELECT * FROM intel ORDER BY published_at DESC")
    
    rows = c.fetchall()
    conn.close()
    return [dict(row) for row in rows]
