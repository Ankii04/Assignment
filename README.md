# 🚀 BeyondChats Full Stack Assignment

A complete full-stack web application for scraping, managing, and AI-enhancing blog articles using Node.js, React, MongoDB, and Google Gemini AI.

**Live Demo:** [Frontend URL](https://your-frontend.vercel.app) | [Backend API](https://your-backend.vercel.app)

---

## 📋 Table of Contents
- [Features](#features)
- [Architecture](#architecture)
- [Local Setup](#local-setup)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)

---

## ✨ Features

### Phase 1: Web Scraping & CRUD API
- ✅ Scrapes last 5 articles from BeyondChats blog
- ✅ Stores articles in MongoDB database
- ✅ RESTful CRUD APIs for article management
- ✅ Pagination and filtering support

### Phase 2: Google Search & AI Enhancement
- ✅ Searches Google for competitor articles
- ✅ Scrapes top 2 competitor blog content
- ✅ Uses Google Gemini AI to rewrite articles
- ✅ Publishes enhanced versions with references

### Phase 3: React Frontend
- ✅ Responsive, professional UI
- ✅ Displays original and AI-enhanced articles
- ✅ Search and filter functionality
- ✅ Mobile-responsive design

---

## 🏗️ Architecture & Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                   CLIENT (React Frontend)                    │
│                  http://localhost:5173                       │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/REST API
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              BACKEND API (Node.js + Express)                 │
│                http://localhost:5000/api                     │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  CRUD APIs                                           │   │
│  │  • GET    /articles     - Get all articles           │   │
│  │  • GET    /articles/:id - Get single article         │   │
│  │  • POST   /articles     - Create article             │   │
│  │  • PUT    /articles/:id - Update article             │   │
│  │  • DELETE /articles/:id - Delete article             │   │
│  │  • POST   /articles/scrape/trigger - Run scraper     │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  DATABASE (MongoDB Atlas)                    │
│                                                              │
│  Articles Collection:                                        │
│  • Original Articles (isUpdated: false) - 6 articles         │
│  • AI-Enhanced Articles (isUpdated: true) - 6 articles       │
└─────────────────────────────────────────────────────────────┘

External Services:
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ BeyondChats Blog │  │ Google Search API│  │  Google Gemini   │
│   (Scraping)     │  │  (Competitor     │  │   AI (Rewriting) │
└──────────────────┘  │   Discovery)     │  └──────────────────┘
                      └──────────────────┘
```

### Data Flow Process:

**1. Scraping (Phase 1):**
```
BeyondChats Blog → Puppeteer Scraper → MongoDB
```

**2. AI Enhancement (Phase 2):**
```
MongoDB (Original Articles)
    ↓
Google Search API (Find competitors)
    ↓
Content Scraper (Get competitor content)
    ↓
Google Gemini AI (Rewrite article)
    ↓
MongoDB (Save enhanced article with references)
```

**3. Frontend Display (Phase 3):**
```
React App → Backend API → MongoDB → Display Articles
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account (free tier)
- Google Gemini API key
- Google Custom Search API key

### 1. Clone Repository
```bash
git clone https://github.com/Ankii04/Assignment.git
cd Assignment
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in `backend` directory:
```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Server
PORT=5000
NODE_ENV=development

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Google Custom Search
GOOGLE_API_KEY=your_google_api_key
GOOGLE_CSE_ID=your_custom_search_engine_id

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Scraping Config
SCRAPE_URL=https://beyondchats.com/blogs/
ARTICLES_TO_SCRAPE=5
BATCH_SIZE=1
RETRY_ATTEMPTS=3
RATE_LIMIT_DELAY=5000
```

**How to get API keys:**
- **MongoDB**: Create free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Gemini AI**: Get key from [Google AI Studio](https://ai.google.dev)
- **Google Search**: 
  1. Create project at [Google Cloud Console](https://console.cloud.google.com)
  2. Enable "Custom Search API"
  3. Create API key
  4. Create Custom Search Engine at [Programmable Search](https://programmablesearchengine.google.com)

Start backend server:
```bash
npm run dev
```
Backend will run at `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file in `frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

Start frontend server:
```bash
npm run dev
```
Frontend will run at `http://localhost:5173`

### 4. Populate Database

**Option 1: Run scraper to fetch articles from BeyondChats**
```bash
cd backend
npm run scrape
```

**Option 2: Add manually created AI-enhanced articles**
```bash
cd backend
node src/scripts/addUpdatedArticles.js
```

**Option 3: Run full AI automation (requires Google APIs)**
```bash
cd backend
npm run automate
```

### 5. Access Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

---

## 📁 Project Structure

```
Assignment/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js              # MongoDB connection
│   │   ├── models/
│   │   │   └── Article.js               # Article schema
│   │   ├── controllers/
│   │   │   └── articleController.js     # CRUD logic
│   │   ├── routes/
│   │   │   └── articleRoutes.js         # API routes
│   │   ├── services/
│   │   │   ├── scraperService.js        # BeyondChats scraper
│   │   │   ├── googleSearchService.js   # Google Search integration
│   │   │   ├── contentScraperService.js # Competitor scraper
│   │   │   ├── llmService.js            # Gemini AI integration
│   │   │   ├── apiService.js            # Internal API calls
│   │   │   └── automationService.js     # Orchestrates Phase 2
│   │   ├── scripts/
│   │   │   ├── runScraper.js            # Standalone scraper
│   │   │   ├── runAutomation.js         # Standalone automation
│   │   │   └── addUpdatedArticles.js    # Add manual articles
│   │   ├── utils/
│   │   │   └── logger.js                # Winston logger
│   │   └── index.js                     # Express app entry
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── vercel.json                      # Vercel deployment config
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ArticleCard.jsx          # Article card component
│   │   │   ├── ArticleList.jsx          # Articles grid
│   │   │   ├── FilterBar.jsx            # Filter controls
│   │   │   ├── Footer.jsx               # Footer component
│   │   │   ├── Header.jsx               # Header/navbar
│   │   │   ├── LoadingSpinner.jsx       # Loading state
│   │   │   └── SearchBar.jsx            # Search input
│   │   ├── hooks/
│   │   │   └── useArticles.js           # Custom hook for fetching
│   │   ├── pages/
│   │   │   ├── ArticlePage.jsx          # Article detail page
│   │   │   └── HomePage.jsx             # Main page
│   │   ├── services/
│   │   │   └── api.js                   # Axios API client
│   │   ├── App.jsx                      # Main app component
│   │   ├── index.css                    # Tailwind styles
│   │   └── main.jsx                     # React entry point
│   ├── .env.example
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── vercel.json                      # Vercel deployment config
│
└── README.md                            # This file
```

---

## 🛠️ Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Puppeteer** - Web scraping
- **Cheerio** - HTML parsing
- **Mozilla Readability** - Content extraction
- **Google Gemini AI** - Article rewriting
- **Google Custom Search API** - Competitor discovery
- **Winston** - Logging
- **Axios** - HTTP client

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **Axios** - API calls
- **React Icons** - Icons

---

## 📡 API Endpoints

### Articles
- `GET /api/articles` - Get all articles (supports pagination & filtering)
- `GET /api/articles/:id` - Get single article by ID
- `POST /api/articles` - Create new article
- `PUT /api/articles/:id` - Update article
- `DELETE /api/articles/:id` - Delete article
- `POST /api/articles/scrape/trigger` - Trigger web scraping

### Health
- `GET /api/health` - API health check

### Query Parameters
```
GET /api/articles?limit=10&page=1&isUpdated=false
```
- `limit` - Articles per page (default: 10)
- `page` - Page number (default: 1)
- `isUpdated` - Filter by type (true/false)

---

## 🌐 Deployment to Vercel

### Backend Deployment
```bash
cd backend
vercel --prod
```

Add environment variables in Vercel dashboard:
- `MONGODB_URI`
- `GEMINI_API_KEY`
- `GOOGLE_API_KEY`
- `GOOGLE_CSE_ID`
- `FRONTEND_URL`

### Frontend Deployment
```bash
cd frontend
# Update .env with backend URL
vercel --prod
```

Add environment variable:
- `VITE_API_URL=https://your-backend.vercel.app/api`

---

## 👤 Author

**Ankit Kumar**
- GitHub: [@Ankii04](https://github.com/Ankii04)
- Repository: [BeyondChats Assignment](https://github.com/Ankii04/Assignment)

---

## 📄 License

MIT

---

**Built for BeyondChats Full Stack Web Developer Intern Assignment**
