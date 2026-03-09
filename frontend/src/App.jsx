import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { 
  Cpu, Settings, Globe, Newspaper, ExternalLink, Star, 
  Package, Languages, Search, Bookmark, BookmarkCheck, 
  Sun, Moon, Share2, Clock 
} from 'lucide-react';
import './style.css';

const DATA_URL = './data/intel.json';

const I18N = {
  ja: {
    title: "Nexus Intel", subtitle: "世界情報キャッチアップ・システム",
    intro: "世界中のAI、ロボティクス、ニュース、新プロダクトを1時間ごとに自動収集。重要度をAIが判定し、あなたの知的キャッチアップを加速させます。",
    all: "すべて", ai: "AI/IT", mech: "機械工学", prod: "プロダクト", global: "世界情勢", news: "時事ニュース", saved: "保存済み",
    readMore: "詳しく読む", loading: "世界の知性を集約中...", search: "キーワードで検索...", readTime: "約{t}分で読めます", share: "共有"
  },
  en: {
    title: "Nexus Intel", subtitle: "Global Intelligence Hub",
    intro: "Automatically gathers AI, Robotics, News, and Products from around the world every hour.",
    all: "All", ai: "AI/IT", mech: "Mechanical", prod: "Product", global: "Global", news: "News", saved: "Saved",
    readMore: "Read More", loading: "Gathering Intelligence...", search: "Search intelligence...", readTime: "{t} min read", share: "Share"
  },
  zh: {
    title: "Nexus Intel", subtitle: "全球情报中心",
    intro: "每小时自动从全球获取 AI、机器人、新闻和产品信息。",
    all: "全部", ai: "人工智能", mech: "机械工程", prod: "新产品", global: "全球动态", news: "时事新闻", saved: "已保存",
    readMore: "阅读全文", loading: "正在汇集全球情报...", search: "搜索...", readTime: "阅读需 {t} 分钟", share: "分享"
  }
};

// 背景のパーティクル・コンポーネント
const Particles = () => {
  return (
    <div className="particles-container">
      {[...Array(20)].map((_, i) => (
        <div key={i} className="particle" style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${10 + Math.random() * 20}s`
        }}></div>
      ))}
    </div>
  );
};

function App() {
  const [intel, setIntel] = useState([]);
  const [category, setCategory] = useState('');
  const [lang, setLang] = useState('ja');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarks, setBookmarks] = useState(() => JSON.parse(localStorage.getItem('nexus_bookmarks') || '[]'));
  const [theme, setTheme] = useState(() => localStorage.getItem('nexus_theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));

  const t = I18N[lang];

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('nexus_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('nexus_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const fetchIntel = async () => {
    setLoading(true);
    try {
      const res = await axios.get(DATA_URL);
      setIntel(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchIntel(); }, []);

  const toggleBookmark = (id) => {
    setBookmarks(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]);
  };

  const handleShare = async (item) => {
    if (navigator.share) {
      try {
        await navigator.share({ title: item.title, text: item.summary, url: item.url });
      } catch (err) { console.log('Share failed', err); }
    } else {
      navigator.clipboard.writeText(item.url);
      alert('URL copied to clipboard!');
    }
  };

  // フィルタリング＆検索ロジック
  const filteredIntel = useMemo(() => {
    return intel.filter(item => {
      const matchCat = category === 'saved' ? bookmarks.includes(item.id) : (category === '' || item.category === category);
      const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || (item.summary && item.summary.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [intel, category, searchQuery, bookmarks]);

  const categories = [
    { name: t.all, icon: <Globe size={18} />, value: '' },
    { name: t.saved, icon: <Bookmark size={18} />, value: 'saved' },
    { name: t.ai, icon: <Cpu size={18} />, value: 'AI/IT' },
    { name: t.mech, icon: <Settings size={18} />, value: 'Mechanical' },
    { name: t.prod, icon: <Package size={18} />, value: 'Product' },
    { name: t.global, icon: <Globe size={18} />, value: 'Global' },
    { name: t.news, icon: <Newspaper size={18} />, value: 'News' },
  ];

  const calcReadTime = (text) => Math.max(1, Math.ceil((text?.length || 0) / 400));

  return (
    <div className={`app-container lang-${lang}`}>
      <Particles />
      
      <nav className="top-nav">
        <div className="logo">NEXUS <span>INTEL</span></div>
        <div className="nav-controls">
          <div className="search-bar">
            <Search size={16} />
            <input 
              type="text" 
              placeholder={t.search} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="icon-btn">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button onClick={() => setLang(lang === 'ja' ? 'en' : lang === 'en' ? 'zh' : 'ja')} className="icon-btn text-btn">
            <Languages size={18} /> {lang.toUpperCase()}
          </button>
        </div>
      </nav>

      <header>
        <div className="category-tabs">
          {categories.map((cat) => (
            <button
              key={cat.value}
              className={category === cat.value ? 'active' : ''}
              onClick={() => setCategory(cat.value)}
            >
              {cat.icon}
              <span className="tab-label">{cat.name}</span>
            </button>
          ))}
        </div>
      </header>

      <main>
        {loading ? (
          <div className="loading">{t.loading}</div>
        ) : filteredIntel.length === 0 ? (
          <div className="no-results">No intelligence found.</div>
        ) : (
          <div className="masonry-grid">
            {filteredIntel.map((item) => (
              <div className={`card importance-${item.importance} ${item.importance >= 4 ? 'featured' : ''}`} key={item.id}>
                
                <div className="card-header">
                  <span className="source-tag">{item.source_name}</span>
                  <div className="header-actions">
                    <div className="importance-badge">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} fill={i < item.importance ? "var(--gold)" : "none"} color={i < item.importance ? "var(--gold)" : "var(--border)"} />
                      ))}
                    </div>
                    <button className="action-btn" onClick={() => toggleBookmark(item.id)}>
                      {bookmarks.includes(item.id) ? <BookmarkCheck size={18} color="var(--accent)" /> : <Bookmark size={18} />}
                    </button>
                  </div>
                </div>

                <h3>{item.title}</h3>
                <p className="summary">{item.summary}...</p>
                
                <div className="card-meta">
                  <span className="read-time"><Clock size={12}/> {t.readTime.replace('{t}', calcReadTime(item.summary))}</span>
                </div>

                <div className="card-footer">
                  <span className="date">{new Date(item.published_at).toLocaleDateString()}</span>
                  <div className="footer-actions">
                    <button className="action-btn share-btn" onClick={() => handleShare(item)}>
                      <Share2 size={16} />
                    </button>
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="read-btn">
                      {t.readMore} <ExternalLink size={14} />
                    </a>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
