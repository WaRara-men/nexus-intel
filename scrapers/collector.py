import feedparser
import sqlite3
import datetime
import requests
from bs4 import BeautifulSoup

SOURCES = {
    'AI/IT': [
        {'url': 'https://arxiv.org/rss/cs.AI', 'type': 'rss', 'name': 'Arxiv AI'},
        {'url': 'https://techcrunch.com/feed/', 'type': 'rss', 'name': 'TechCrunch'},
    ],
    'Mechanical': [
        {'url': 'https://spectrum.ieee.org/rss/robotics/fulltext', 'type': 'rss', 'name': 'IEEE Robotics'},
    ],
    'Product': [
        {'url': 'https://www.producthunt.com/feed', 'type': 'rss', 'name': 'Product Hunt'},
        {'url': 'https://www.gizmodo.jp/index.xml', 'type': 'rss', 'name': 'Gizmodo JP'},
    ],
    'Global': [
        {'url': 'https://news.google.com/rss/search?q=world+news&hl=en-US&gl=US&ceid=US:en', 'type': 'rss', 'name': 'Google News World'},
    ],
    'News': [
        {'url': 'https://news.google.com/rss?hl=ja&gl=JP&ceid=JP:ja', 'type': 'rss', 'name': 'Google News JP'},
    ]
}

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

def score_importance(title, summary):
    score = 1
    keywords = {
        'AI': 2, 'GPT': 2, 'Robot': 2, 'New': 1, 'Launch': 2, 
        'Crisis': 2, 'Breakthrough': 3, 'Quantum': 2, 'Apple': 1, 'Tesla': 1,
        '戦争': 2, '危機': 2, '発表': 1, '世界初': 3
    }
    text = (str(title) + " " + str(summary)).upper()
    for kw, s in keywords.items():
        if kw.upper() in text:
            score += s
    return min(score, 5)

import json
import os

def collect_intel():
    init_db()
    conn = sqlite3.connect('data/nexus.db')
    c = conn.cursor()
    
    # ... (既存の収集ロジック) ...
    # 最後に JSON として書き出し
    conn.row_factory = sqlite3.Row
    c.execute("SELECT * FROM intel ORDER BY published_at DESC LIMIT 100")
    rows = [dict(row) for row in c.fetchall()]
    
    with open('data/intel.json', 'w', encoding='utf-8') as f:
        json.dump(rows, f, ensure_ascii=False, indent=2)
    
    conn.close()
    print("Collection & JSON export completed.")

if __name__ == "__main__":
    collect_intel()
