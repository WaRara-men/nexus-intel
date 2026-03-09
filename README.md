# Nexus Intel 🌐 | Serverless Global Intelligence Hub

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)](https://github.com/features/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

[English](#english) | [日本語](#日本語)

---

<a name="english"></a>
## 🌐 English: The Signal in the Noise

### 📖 What is Nexus Intel?
In an era of information overload, **Nexus Intel** serves as a specialized, serverless intelligence hub designed for engineers, researchers, and tech enthusiasts. It solves the "Too Much to Read" problem by automatically aggregating the most critical updates in AI, Robotics, and Global Trends into a single, visually prioritized dashboard.

### 💡 Why Nexus Intel?
- **Filtering the Noise**: Most news feeds are cluttered. Nexus Intel uses a custom scoring algorithm to highlight "Breakthroughs" and "Critical News" first.
- **Language is No Barrier**: We live in a globalized world, but international breakthroughs often go unnoticed due to language gaps. Nexus Intel bridges this by auto-translating global source titles into Japanese in real-time.
- **Sustainability (Zero Cost)**: This is a proof-of-concept that high-value intelligence platforms don't need expensive infrastructure. It runs entirely on the "Free Tier" of GitHub's ecosystem.

### ✨ Key Features in Detail
1.  🌐 **Global Intelligence Collection**:
    - Automatically scrapes dozens of top-tier RSS feeds including **Arxiv (AI/ML)**, **IEEE Spectrum**, **TechCrunch**, and **Product Hunt**.
    - Operates on a 60-minute cycle via GitHub Actions, ensuring you never miss a beat.
2.  🇯🇵 **Automated Japanese Translation**:
    - Every international headline is automatically translated into Japanese using the `deep-translator` library.
    - Allows for quick scanning and comprehension without leaving the dashboard.
3.  💎 **Cyber-Glass Bento Dashboard**:
    - A custom-built React dashboard using a "Glassmorphism" and "Bento Box" design layout.
    - Highly responsive: Look beautiful on desktop, tablet, and mobile.
4.  ⚡ **Smarter Interaction**:
    - **Importance Scoring**: Articles are assigned a 1-5 star rating based on keyword analysis (e.g., "Breakthrough", "GPT-5", "Crisis").
    - **Instant Filter & Search**: Search through hundreds of archived intelligence items in milliseconds.
    - **Category Browsing**: Dedicated tabs for AI/IT, Robotics, News, and more.

---

<a name="日本語"></a>
## 🇯🇵 日本語: 情報のノイズを切り裂く「Nexus Intel」

### 📖 Nexus Intel とは？
情報過多の時代において、**Nexus Intel**（ネクサス・インテル）は、エンジニア、研究者、そしてテック愛好家のために設計された、サーバーレスの次世代インテリジェンス・ハブです。「読むものが多すぎる」という問題を、AI、ロボティクス、世界のトレンドから最も重要な情報を自動抽出し、視覚的に優先順位をつけた一つのダッシュボードに集約することで解決します。

### 💡 なぜ Nexus Intel なのか？
- **ノイズの除去**: 一般的なニュースフィードは不要な情報で溢れています。Nexus Intel は独自のスコアリング・アルゴリズムを使用し、「画期的な進歩（Breakthrough）」や「緊急ニュース」を優先的にハイライトします。
- **言語の壁を破壊**: 世界は繋がっていますが、言語の壁によって海外の重大なニュースが見過ごされることが多々あります。Nexus Intel は、海外メディアのタイトルをリアルタイムで日本語に自動翻訳し、このギャップを埋めます。
- **究極の持続可能性 (運用コスト 0 円)**: 高価値な情報プラットフォームに高価なサーバーは不要であることを証明しました。GitHub のエコシステムのみを活用し、完全無料で 24 時間 365 日稼働します。

### ✨ 主要機能の詳細
1.  🌐 **グローバル・インテリジェンス収集**:
    - **Arxiv (AI/ML)**、**IEEE Spectrum**、**TechCrunch**、**Product Hunt** などの最高位 RSS フィードから自動収集。
    - GitHub Actions により 60 分おきに自動更新。常に最新の情報を手元に。
2.  🇯🇵 **全自動日本語翻訳**:
    - 収集された海外メディアの全見出しを `deep-translator` ライブラリで日本語化。
    - ダッシュボードを眺めるだけで、世界で何が起きているかを瞬時に把握できます。
3.  💎 **Cyber-Glass Bento ダッシュボード**:
    - 「グラスモーフィズム（透明感）」と「弁当箱レイアウト」を採用した独自の React デザイン。
    - デスクトップ、タブレット、モバイルのあらゆる端末でプレミアムな体験を提供。
4.  ⚡ **高度なインタラクション**:
    - **重要度スコアリング**: キーワード分析（例：「Breakthrough」「GPT-5」「危機」）により 1〜5 つ星で評価。
    - **高速フィルター機能**: 数百件のアーカイブからミリ秒単位で検索可能。
    - **カテゴリー別ブラウズ**: AI/IT、ロボティクス、ニュースなど、関心のある分野へ即座にアクセス。

---

## 🏗️ System Architecture / 技術アーキテクチャ

Nexus Intel は、洗練されたデータパイプラインによって構築されています。

1.  **Ingestion (Python)**: `feedparser` と `BeautifulSoup4` を使用し、分散したソースからデータを抽出し正規化。
2.  **Enrichment**: `deep-translator` による日本語化と、キーワードベースの重要度評価。
3.  **Storage**: データベースサーバーを排除し、`data/intel.json` として Git 上で管理（フラットファイル DB）。
4.  **UI (React/Vite)**: 高速な React フロントエンドが最新の JSON をフェッチし、動的な Bento UI を生成。
5.  **Automation**: すべての工程を GitHub Actions が統括し、自動ビルド・自動デプロイを実現。

---

## 🚀 Local Setup / ローカルセットアップ

### Prerequisites
- Node.js (v20+)
- Python (v3.12+)

### 1. インストール
```bash
git clone https://github.com/WaRara-men/nexus-intel.git
cd nexus-intel
```

### 2. バックエンド (スクレイパー) の設定
```bash
# 依存関係のインストール
pip install -r requirements.txt

# 手動でデータを収集してみる
python scrapers/collector.py
```

### 3. フロントエンド (ダッシュボード) の起動
```bash
cd frontend
npm install
npm run dev
```

---

## 🛠️ Tech Stack / 使用技術
- **Frontend**: React, Vite, Tailwind CSS (Vanilla CSS Architecture), Lucide React.
- **Backend**: Python, BeautifulSoup4, Feedparser.
- **Database**: JSON-based flat-file database.
- **Infrastructure**: GitHub Actions, GitHub Pages.

---

## 🛣️ Roadmap / 今後の展望
- [ ] **AI Summarization**: タイトルだけでなく、本文の 3 行要約機能を搭載。
- [ ] **Push Notifications**: 重大なニュースが検出された際、Discord/Slack への通知。
- [ ] **Advanced Analytics**: ソースごとの重要度トレンドの可視化。

---

## 📝 License
Distributed under the MIT License. See `LICENSE` for more information.

---
Built with ❤️ by [WaRara-men](https://github.com/WaRara-men)
