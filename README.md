# Nexus Intel 🌐 | Serverless Global Intelligence Hub

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)](https://github.com/features/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

[English](#english) | [日本語](#日本語)

---

<a name="english"></a>
## 🌐 English: Technical Excellence & Architecture

### 📖 Concept
**Nexus Intel** is a serverless intelligence pipeline that transforms raw global signals into a curated, localized dashboard. It is built on the principle of "Vibe Coding" — combining aesthetic excellence with lean, robust engineering.

### 🛠️ Deep Technical Stack

#### 1. Backend: Python Intelligence Engine
- **Data Ingestion**: Utilizes `feedparser` and `BeautifulSoup4` for multi-source RSS/Atom parsing and data normalization.
- **NLP & Translation**: Integrates `deep-translator` (Google's Engine) for high-fidelity English-to-Japanese headline translation.
- **Importance Scoring Algorithm**: Implements a keyword-based weightage system (`score_importance`). 
    - *Breakthrough/World First*: +3 score.
    - *AI/GPT/Robot/Crisis*: +2 score.
    - *Normalization*: Scores are clamped between 1 and 5 stars.
- **Data Persistence**: Uses a 2-stage storage approach:
    - **Primary**: SQLite (`nexus.db`) for deduplication and historical tracking.
    - **Deployment**: Exports to a minified `intel.json` for lightweight frontend consumption.

#### 2. Frontend: High-Performance React Dashboard
- **React 18 & Vite**: Lightning-fast build and runtime performance.
- **State & Optimization**: 
    - **useMemo**: Optimized filtering and multi-keyword search logic to ensure 60fps interaction even with large datasets.
    - **localStorage API**: Persistent bookmarks and language preferences stored client-side.
- **UI Architecture**:
    - **Glassmorphism**: Advanced CSS filters (`backdrop-filter: blur()`) and HSL-based neon palettes for a premium "Cyber" aesthetic.
    - **Bento Logic**: A modular grid system that dynamically prioritizes "Hero Cards" based on AI-assigned importance scores.

#### 3. DevOps: Fully Automated CI/CD
- **GitHub Actions Workflow**: Runs on an hourly cron schedule.
- **Environment**: Linux runner (Ubuntu-latest) executing dual-stack workloads (Python 3.12 + Node.js 20).
- **Atomic Deployment**: GitHub Actions merges the new `intel.json` data with the React build assets and pushes to the `gh-pages` branch for zero-downtime updates.

---

<a name="日本語"></a>
## 🇯🇵 日本語: 技術スタックとアーキテクチャの深掘り

### 📖 コンセプト
**Nexus Intel**（ネクサス・インテル）は、生のグローバル信号を、精緻にキュレーションされたローカライズ・ダッシュボードへと変換するサーバーレス・インテリジェンス・パイプラインです。美学的な卓越性と、軽量で堅牢なエンジニアリングを融合させる「Vibe Coding」の原則に基づいて構築されています。

### 🛠️ テクニカル・ディープダイブ

#### 1. バックエンド: Python インテリジェンス・エンジン
- **データ・インジェスチョン**: `feedparser` と `BeautifulSoup4` を活用し、RSS/Atom フィードのパースとデータの正規化を数秒で完了します。
- **NLP & 翻訳機能**: `deep-translator`（Google エンジン）を統合し、海外メディアのヘッドラインを非常に高い精度で日本語化。
- **重要度スコアリング・アルゴリズム**: 独自の見出し解析システム（`score_importance`）を搭載。
    - *Breakthrough（画期的）/ 世界初*: +3 スコア。
    - *AI / GPT / Robot / 危機*: +2 スコア。
    - *正規化*: 計算結果を 1〜5 つ星にマッピングし、情報の優先順位を可視化。
- **データ永続化**: 2 段階のストレージ・アプローチ。
    - **プライマリ**: SQLite (`nexus.db`) を使用し、重複の排除と履歴管理を実施。
    - **デプロイ用**: 軽量なフロントエンド連携のため、SQL から `intel.json` へフラットファイル出力。

#### 2. フロントエンド: 高性能 React ダッシュボード
- **React 18 & Vite**: 極めて高速なビルドとランタイム・パフォーマンス。
- **ステート管理 & 最適化**: 
    - **useMemo**: 複雑なフィルタリングと複数キーワード検索ロジックを最適化し、データ量が増えても 60fps の滑らかな操作感を維持。
    - **localStorage API**: ブックマークや言語設定をクライアント側で永続化。
- **UI アーキテクチャ**:
    - **グラスモーフィズム**: 高度な CSS フィルタ (`backdrop-filter: blur()`) と HSL ベースのネオンパレットを使用し、プレミアムな「サイバー」世界観を演出。
    - **Bento ロジック**: モジュール式のグリッドシステム。AI が判定した重要度スコアに基づき、「ヒーローカード」を動的に配置。

#### 3. DevOps: 完全自動化された CI/CD
- **GitHub Actions ワークフロー**: 1 時間ごとの cron スケジュールで稼働。
- **実行環境**: Ubuntu-latest 上で Python 3.12 と Node.js 20 のデュアルスタック・ワークロードを実行。
- **アトミック・デプロイ**: GitHub Actions が新しい `intel.json` データと React のビルド成果物を統合し、`gh-pages` ブランチへプッシュ。ダウンタイムなしの更新を実現。

---

## 🚀 Local Setup / ローカルセットアップ

### Scraper (Python)
```bash
pip install feedparser beautifulsoup4 requests deep-translator pandas
python scrapers/collector.py
```

### Dashboard (React)
```bash
npm install
npm run dev
```

---

## 📝 License
Distributed under the MIT License. See `LICENSE` for more information.

---
Built with ❤️ by [WaRara-men](https://github.com/WaRara-men)
