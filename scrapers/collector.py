import feedparser
import sqlite3
import datetime
import requests
from bs4 import BeautifulSoup
import json
import os
import re
from collections import Counter
from deep_translator import GoogleTranslator

# 翻訳エンジン
translator = GoogleTranslator(source='auto', target='ja')

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
        source_name TEXT,
        translated_title TEXT
    )''')
    conn.commit()
    conn.close()

def score_importance(title, summary):
    score = 1
    keywords = {'AI': 2, 'GPT': 2, 'Robot': 2, 'Launch': 2, 'Crisis': 2, 'Breakthrough': 3, '戦争': 2, '危機': 2, '世界初': 3}
    text = (str(title) + " " + str(summary)).upper()
    for kw, s in keywords.items():
        if kw.upper() in text: score += s
    return min(score, 5)

def extract_trends(items):
    stopwords = {'a', 'an', 'the', 'is', 'are', 'was', 'were', 'to', 'for', 'of', 'in', 'on', 'with', 'by', 'and', 'or', 'but', 'if', 'then', 'else', 'at', 'it', 'its', 'from', 'this', 'that', 'into', 'new', 'no', 'up', 'out', 'us', 'why', 'how', 'about', 'after', 'all', 'any', 'back', 'before', 'being', 'between', 'both', 'could', 'did', 'do', 'does', 'each', 'even', 'first', 'get', 'had', 'has', 'have', 'he', 'her', 'him', 'his', 'how', 'if', 'just', 'know', 'like', 'many', 'me', 'most', 'my', 'now', 'of', 'off', 'on', 'only', 'or', 'other', 'our', 'out', 'over', 'own', 'same', 'she', 'some', 'than', 'that', 'the', 'their', 'them', 'then', 'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'we', 'well', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'will', 'with', 'would', 'you', 'your', 'ours', 'yours', 'himself', 'herself', 'itself', 'themselves'}
    words = []
    for item in items:
        text = f"{item['title']} {item['translated_title'] or ''}"
        tokens = re.findall(r'[a-zA-Z]{3,}', text.lower())
        katakana = re.findall(r'[\u30A1-\u30F4]{2,}', text)
        words.extend([w for w in tokens if w not in stopwords])
        words.extend(katakana)
    return [word for word, count in Counter(words).most_common(12)]

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
                        c.execute("SELECT 1 FROM intel WHERE url = ?", (entry.link,))
                        if c.fetchone(): continue
                        summary_text = entry.get('summary', '')[:500]
                        importance = score_importance(entry.title, summary_text)
                        try:
                            trans = translator.translate(entry.title) if category != 'News' else entry.title
                        except:
                            trans = entry.title
                        c.execute('''INSERT OR IGNORE INTO intel 
                            (category, title, summary, url, published_at, source_name, importance, translated_title) 
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?)''', 
                            (category, entry.title, summary_text[:200], entry.link, 
                             entry.get('published', datetime.datetime.now().isoformat()), src['name'], importance, trans))
                    except Exception as e:
                        print(f"Error processing {entry.title}: {e}")
            except Exception as e:
                print(f"Error fetching from {src['name']}: {e}")
    conn.commit()
    conn.row_factory = sqlite3.Row
    cursor_json = conn.cursor()
    cursor_json.execute("SELECT * FROM intel ORDER BY published_at DESC LIMIT 100")
    rows = [dict(row) for row in cursor_json.fetchall()]
    
    trends = extract_trends(rows)
    output_data = {
        "last_updated": datetime.datetime.now().isoformat(),
        "items": rows,
        "trends": trends
    }
    with open('data/intel.json', 'w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)
    conn.close()
    print("Collection & JSON export completed with trends.")

if __name__ == "__main__":
    collect_intel()
