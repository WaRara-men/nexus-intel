import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { 
  Cpu, Settings, Globe, Newspaper, ExternalLink, Star, 
  Package, Search, Bookmark, BookmarkCheck, 
  Clock, TrendingUp, Zap, BarChart3
} from 'lucide-react';
import './style.css';

const DATA_URL = './data/intel.json';

const I18N = {
  ja: {
    title: "NEXUS", subtitle: "INTEL", search: "知性を検索...", loading: "データを同期中...", 
    lastUpdate: "最終更新: {t}", nextUpdate: "次回巡回まで: {m}分", readMore: "開く", trends: "トレンド"
  },
  en: {
    title: "NEXUS", subtitle: "INTEL", search: "Search Intelligence...", loading: "Syncing Neural Data...",
    lastUpdate: "Updated: {t}", nextUpdate: "Next crawl in {m}m", readMore: "OPEN", trends: "TRENDS"
  }
};

const getRelativeTime = (dateStr) => {
  const now = new Date();
  const date = new Date(dateStr);
  const diffInMinutes = Math.floor((now - date) / (1000 * 60));
  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return `${Math.floor(diffInMinutes / 1440)}d ago`;
};

const Particles = () => (
  <div className="bg-glow">
    <div className="glow-1"></div>
    <div className="glow-2"></div>
  </div>
);

function App() {
  const [intel, setIntel] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [trends, setTrends] = useState([]);
  const [category, setCategory] = useState('');
  const [lang, setLang] = useState('ja');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarks, setBookmarks] = useState(() => JSON.parse(localStorage.getItem('nexus_bookmarks') || '[]'));

  const t = I18N[lang];

  const fetchIntel = async () => {
    setLoading(true);
    try {
      const res = await axios.get(DATA_URL);
      setIntel(res.data.items || []);
      setLastUpdated(res.data.last_updated);
      setTrends(res.data.trends || []);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetchIntel(); }, []);

  const toggleBookmark = (e, id) => {
    e.preventDefault(); e.stopPropagation();
    setBookmarks(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]);
  };

  const filteredIntel = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return intel.filter(item => {
      const matchCat = category === 'saved' ? bookmarks.includes(item.id) : (category === '' || item.category === category);
      const matchSearch = 
        item.title.toLowerCase().includes(query) || 
        (item.translated_title && item.translated_title.toLowerCase().includes(query)) ||
        (item.summary && item.summary.toLowerCase().includes(query));
      return matchCat && matchSearch;
    });
  }, [intel, category, searchQuery, bookmarks]);

  const nextUpdateMin = lastUpdated ? Math.max(0, 60 - Math.floor((new Date() - new Date(lastUpdated)) / (1000 * 60))) : 0;

  return (
    <div className="app-container">
      <Particles />
      
      <nav className="glass-nav">
        <div className="nav-top">
          <div className="logo-area">
            <h1 className="brand">{t.title}<span>{t.subtitle}</span></h1>
          </div>
          <div className="status-bar">
            <span><Zap size={12} fill="var(--neon-cyan)"/> {t.lastUpdate.replace('{t}', getRelativeTime(lastUpdated))}</span>
            <span>{t.nextUpdate.replace('{m}', nextUpdateMin)}</span>
          </div>
          <div className="nav-actions">
            <button onClick={() => setLang(lang === 'ja' ? 'en' : 'ja')} className="lang-toggle">
              {lang.toUpperCase()}
            </button>
          </div>
        </div>
        
        <div className="cyber-search">
          <Search size={16} />
          <input type="text" placeholder={t.search} value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} />
        </div>

        {trends.length > 0 && (
          <div className="trends-bar">
            <BarChart3 size={14} />
            <span className="trend-label">{t.trends}:</span>
            <div className="trend-tags">
              {trends.map(word => (
                <button key={word} onClick={() => setSearchQuery(word)} className="trend-tag">#{word}</button>
              ))}
            </div>
          </div>
        )}
      </nav>

      <div className="category-bar">
        {['', 'saved', 'AI/IT', 'Mechanical', 'Product', 'Global', 'News'].map((cat) => (
          <button key={cat} className={category === cat ? 'active' : ''} onClick={() => setCategory(cat)}>
            {cat === '' ? 'ALL' : cat.toUpperCase()}
          </button>
        ))}
      </div>

      <main className="bento-grid">
        {loading ? (
          <div className="cyber-loader">{t.loading}</div>
        ) : filteredIntel.length === 0 ? (
          <div className="no-results">SYSTEM SCAN COMPLETE: NO DATA MATCHING CRITERIA.</div>
        ) : (
          filteredIntel.map((item, idx) => (
            <div className={`bento-card importance-${item.importance} ${idx === 0 && !searchQuery ? 'hero-card' : ''}`} key={item.id} onClick={() => window.open(item.url, '_blank')}>
              <div className="card-bg-text">{item.category}</div>
              
              <div className="card-top">
                <span className="source">{item.source_name}</span>
                <button className="bookmark-btn" onClick={(e) => toggleBookmark(e, item.id)}>
                  {bookmarks.includes(item.id) ? <BookmarkCheck size={18} color="var(--neon-blue)" /> : <Bookmark size={18} />}
                </button>
              </div>

              <div className="card-body">
                <h3 className="title">
                  {lang === 'ja' && item.translated_title ? item.translated_title : item.title}
                </h3>
                <p className="description">{item.summary}</p>
              </div>

              <div className="card-bottom">
                <div className="meta">
                  <Clock size={12} /> <span>{getRelativeTime(item.published_at)}</span>
                </div>
                <div className="read-action">{t.readMore} <ExternalLink size={12} /></div>
              </div>

              {item.importance >= 4 && <div className="hot-tag"><TrendingUp size={10}/> HOT</div>}
            </div>
          ))
        )}
      </main>
    </div>
  );
}

export default App;
