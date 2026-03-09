import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { 
  Cpu, Settings, Globe, Newspaper, ExternalLink, Star, 
  Package, Languages, Search, Bookmark, BookmarkCheck, 
  Sun, Moon, Share2, Clock, TrendingUp
} from 'lucide-react';
import './style.css';

const DATA_URL = './data/intel.json';

const I18N = {
  ja: {
    title: "NEXUS", subtitle: "INTELLIGENCE",
    all: "ALL", saved: "SAVED", ai: "AI/IT", mech: "MECH", prod: "PROD", global: "WORLD", news: "NEWS",
    search: "探索を開始...", loading: "NEURAL LINK ESTABLISHING...", readMore: "OPEN"
  },
  en: {
    title: "NEXUS", subtitle: "INTELLIGENCE",
    all: "ALL", saved: "SAVED", ai: "AI/IT", mech: "MECH", prod: "PROD", global: "WORLD", news: "NEWS",
    search: "Search Nexus...", loading: "ESTABLISHING LINK...", readMore: "OPEN"
  },
  zh: {
    title: "NEXUS", subtitle: "INTELLIGENCE",
    all: "全部", saved: "收藏", ai: "AI", mech: "机械", prod: "产品", global: "全球", news: "新闻",
    search: "搜索情报...", loading: "正在连接神经网络...", readMore: "打开"
  }
};

const Particles = () => (
  <div className="bg-glow">
    <div className="glow-1"></div>
    <div className="glow-2"></div>
    <div className="glow-3"></div>
  </div>
);

function App() {
  const [intel, setIntel] = useState([]);
  const [category, setCategory] = useState('');
  const [lang, setLang] = useState('ja');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarks, setBookmarks] = useState(() => JSON.parse(localStorage.getItem('nexus_bookmarks') || '[]'));
  const [theme, setTheme] = useState('dark');

  const t = I18N[lang];

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const fetchIntel = async () => {
    setLoading(true);
    try {
      const res = await axios.get(DATA_URL);
      setIntel(res.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetchIntel(); }, []);

  const toggleBookmark = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setBookmarks(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]);
  };

  const filteredIntel = useMemo(() => {
    return intel.filter(item => {
      const matchCat = category === 'saved' ? bookmarks.includes(item.id) : (category === '' || item.category === category);
      const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [intel, category, searchQuery, bookmarks]);

  const categories = [
    { name: t.all, icon: <Globe size={16} />, value: '' },
    { name: t.saved, icon: <Bookmark size={16} />, value: 'saved' },
    { name: t.ai, icon: <Cpu size={16} />, value: 'AI/IT' },
    { name: t.mech, icon: <Settings size={16} />, value: 'Mechanical' },
    { name: t.prod, icon: <Package size={16} />, value: 'Product' },
    { name: t.global, icon: <Globe size={16} />, value: 'Global' },
    { name: t.news, icon: <Newspaper size={16} />, value: 'News' },
  ];

  return (
    <div className="app-container">
      <Particles />
      
      <nav className="glass-nav">
        <div className="logo-area">
          <div className="nexus-logo"></div>
          <h1 className="brand">{t.title}<span>{t.subtitle}</span></h1>
        </div>
        
        <div className="nav-main">
          <div className="cyber-search">
            <Search size={16} />
            <input type="text" placeholder={t.search} value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} />
          </div>
          <div className="lang-selector">
            <button onClick={() => setLang(lang === 'ja' ? 'en' : lang === 'en' ? 'zh' : 'ja')}>
              {lang.toUpperCase()}
            </button>
          </div>
        </div>
      </nav>

      <div className="category-bar">
        {categories.map((cat) => (
          <button 
            key={cat.value} 
            className={category === cat.value ? 'active' : ''} 
            onClick={() => setCategory(cat.value)}
          >
            {cat.icon} <span>{cat.name}</span>
          </button>
        ))}
      </div>

      <main className="bento-grid">
        {loading ? (
          <div className="cyber-loader">{t.loading}</div>
        ) : (
          filteredIntel.map((item, idx) => (
            <div 
              className={`bento-card importance-${item.importance} ${idx === 0 ? 'hero-card' : ''}`} 
              key={item.id}
              onClick={() => window.open(item.url, '_blank')}
            >
              <div className="card-bg-text">{item.category}</div>
              <div className="card-overlay"></div>
              
              <div className="card-top">
                <span className="source">{item.source_name}</span>
                <button className="bookmark-btn" onClick={(e) => toggleBookmark(e, item.id)}>
                  {bookmarks.includes(item.id) ? <BookmarkCheck size={20} fill="var(--neon-blue)" /> : <Bookmark size={20} />}
                </button>
              </div>

              <div className="card-body">
                <h3 className="title">{item.title}</h3>
                <p className="description">{item.summary}</p>
              </div>

              <div className="card-bottom">
                <div className="meta">
                  <Clock size={14} /> <span>{new Date(item.published_at).toLocaleDateString()}</span>
                </div>
                <div className="read-action">
                  {t.readMore} <ExternalLink size={14} />
                </div>
              </div>

              {item.importance >= 4 && <div className="hot-tag"><TrendingUp size={12}/> HOT</div>}
            </div>
          ))
        )}
      </main>
    </div>
  );
}

export default App;
