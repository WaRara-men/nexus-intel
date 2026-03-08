import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Cpu, Settings, Globe, Newspaper, ExternalLink, Star, Package } from 'lucide-react';
import './style.css';

const DATA_URL = './data/intel.json';

function App() {
  const [intel, setIntel] = useState([]);
  const [allIntel, setAllIntel] = useState([]);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchIntel = async () => {
    setLoading(true);
    try {
      // 外部APIではなく、同一オリジンの JSON ファイルを取得
      const res = await axios.get(DATA_URL);
      setAllIntel(res.data);
      setIntel(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchIntel();
  }, []);

  useEffect(() => {
    if (category) {
      setIntel(allIntel.filter(item => item.category === category));
    } else {
      setIntel(allIntel);
    }
  }, [category, allIntel]);

  const categories = [
    { name: 'All', icon: <Globe />, value: '' },
    { name: 'AI/IT', icon: <Cpu />, value: 'AI/IT' },
    { name: 'Mechanical', icon: <Settings />, value: 'Mechanical' },
    { name: 'Product', icon: <Package />, value: 'Product' },
    { name: 'Global', icon: <Globe />, value: 'Global' },
    { name: 'News', icon: <Newspaper />, value: 'News' },
  ];

  const renderStars = (importance) => {
    return [...Array(5)].map((_, i) => (
      <Star key={i} size={12} fill={i < importance ? "#facc15" : "none"} color={i < importance ? "#facc15" : "#30363d"} />
    ));
  };

  return (
    <div className="app-container">
      <header>
        <h1>Nexus Intel <span>Catch-up System</span></h1>
        <div className="category-tabs">
          {categories.map((cat) => (
            <button
              key={cat.name}
              className={category === cat.value ? 'active' : ''}
              onClick={() => setCategory(cat.value)}
            >
              {cat.icon}
              {cat.name}
            </button>
          ))}
        </div>
      </header>

      <main>
        {loading ? (
          <div className="loading">Gathering intelligence...</div>
        ) : (
          <div className="grid">
            {intel.map((item) => (
              <div className={`card ${item.importance >= 4 ? 'highlight' : ''}`} key={item.id}>
                <div className="card-header">
                  <span className="source-tag">{item.source_name}</span>
                  <div className="importance-badge">
                    {renderStars(item.importance)}
                  </div>
                </div>
                <h3>{item.title}</h3>
                <p>{item.summary}...</p>
                <div className="card-footer">
                  <span className="date">{new Date(item.published_at).toLocaleDateString()}</span>
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink size={16} /> Read More
                  </a>
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
