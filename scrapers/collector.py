import feedparser
import sqlite3
import datetime
import requests
from bs4 import BeautifulSoup
import json
import os

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
    if not os.path.exists('data'):
        os.makedirs('data')
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

def collect_intel():
    init_db()
    conn = sqlite3.connect('data/nexus.db')
    c = conn.cursor()
    
    for category, sources in SOURCES.items():
        for src in sources:
            print(f"Collecting from {src['name']}...")
            try:
                feed = feedparser.parse(src['url'])
                for entry in feed.entries:
                    try:
                        summary_text = entry.get('summary', '')[:500]
                        importance = score_importance(entry.title, summary_text)
                        
                        c.execute('''INSERT OR REPLACE INTO intel 
                            (category, title, summary, url, published_at, source_name, importance) 
                            VALUES (?, ?, ?, ?, ?, ?, ?)''', 
                            (category, entry.title, summary_text[:200], entry.link, 
                             entry.get('published', datetime.datetime.now()), src['name'], importance))
                    except Exception as e:
                        print(f"Error processing {entry.title}: {e}")
            except Exception as e:
                print(f"Error fetching from {src['name']}: {e}")
    
    conn.commit()
    
    # JSON 出力用のカーソルを再作成
    conn.row_factory = sqlite3.Row
    cursor_json = conn.cursor()
    cursor_json.execute("SELECT * FROM intel ORDER BY published_at DESC LIMIT 100")
    rows = [dict(row) for row in cursor_json.fetchall()]
    
    with open('data/intel.json', 'w', encoding='utf-8') as f:
        json.dump(rows, f, ensure_ascii=False, indent=2)
    
    conn.close()
    print("Collection & JSON export completed.")

if __name__ == "__main__":
    collect_intel()
