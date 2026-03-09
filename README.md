# Nexus Intel 🌐 | Serverless Global Intelligence Hub

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)](https://github.com/features/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**Nexus Intel** is a high-performance, zero-cost intelligence dashboard that aggregates global news, AI breakthroughs, and robotics trends. It features an automated translation engine and a stunning "Cyber-Glass Bento" UI.

🚀 **[Live Demo](https://WaRara-men.github.io/nexus-intel/)**

---

## ✨ Ultimate Features

- 🌐 **Global Aggregation**: Scrapes AI, Robotics, and World News from top-tier RSS feeds every hour.
- 🇯🇵 **Auto-Translation**: Automatically translates international titles into Japanese using `deep-translator`.
- 💎 **Cyber-Glass Bento UI**: A premium, responsive React dashboard designed for readability and visual excellence.
- ⚡ **Serverless & Zero Cost**: Runs entirely on GitHub Actions and GitHub Pages with $0 infrastructure overhead.
- 🔍 **Real-time Search & Filter**: Quickly find the intelligence that matters to you.
- 📑 **Bookmarks & Importance Scoring**: AI-driven importance scoring to highlight critical updates.

---

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS (Vanilla CSS Architecture), Lucide React.
- **Backend**: Python, BeautifulSoup4, Feedparser.
- **Database**: JSON-based flat-file database (`data/intel.json`).
- **DevOps**: GitHub Actions (Scheduled Scraper & Auto-Deploy).

---

## 🚀 Local Setup

### Prerequisites
- Node.js (v20+)
- Python (v3.12+)

### 1. Clone the repository
```bash
git clone https://github.com/WaRara-men/nexus-intel.git
cd nexus-intel
```

### 2. Backend Setup (Scraper)
```bash
# Install dependencies
pip install -r requirements.txt

# Run the scraper manually
python scrapers/collector.py
```

### 3. Frontend Setup (Dashboard)
```bash
cd frontend
npm install
npm run dev
```

---

## 🤖 How it Works (System Architecture)

1. **Scrape**: GitHub Actions triggers the Python scraper every 60 minutes.
2. **Translate & Score**: The scraper fetches RSS feeds, translates titles to Japanese, and assigns importance scores.
3. **Commit**: The updated `data/intel.json` is committed back to the repository.
4. **Deploy**: Vite builds the frontend, and the results are pushed to the `gh-pages` branch.

---

## 📝 License
Distributed under the MIT License. See `LICENSE` for more information.

---
Built with ❤️ by [WaRara-men](https://github.com/WaRara-men)
