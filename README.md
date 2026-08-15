# 🔄 LOOP — AI-Powered Customer Feedback Intelligence Platform

> **Zidio Development Capstone Project**  
> A full-stack multi-tenant AI customer feedback intelligence system built with the MERN stack (MongoDB, Express, React, Node.js), Redis + BullMQ background worker queues, and Gemini/OpenAI vector-grounded RAG retrieval.

---

## 🌟 Executive Summary & Overview

Modern product and customer success teams receive thousands of feedback data points daily across disparate channels—support tickets, app store reviews, NPS surveys, sales calls, and community forums. **LOOP** transforms unstructured raw customer text into structured analytics, automated theme clusters, period-over-period trend spikes, grounded Q&A, and executive Voice-of-Customer (VoC) reports.

---

## 🚀 Key Features

### 1. Multi-Tenant Workspace & Role-Based Access Control (RBAC)
- **Tenant Isolation**: Strict MongoDB workspace-level query scoping (`req.user.workspace`) ensures tenant data isolation.
- **Three Granular Roles**:
  - `ADMIN`: Full administrative control, CSV bulk ingestion, worker queue management, feedback mutation, and record deletion.
  - `ANALYST`: Access to analytics dashboards, AI theme clustering, Ask LOOP RAG, and VoC executive report generation.
  - `VIEWER`: Read-only access to dashboards, feedback inbox, themes, and reports.

### 2. Multi-Channel Feedback Ingestion
- **Single Manual Entry**: Real-time feedback submission with customer labeling and channel classification.
- **Bulk CSV Importer**: Automated header validation, row-by-row sanitization, and partial error handling with bulk background queue ingestion.
- **Simulated Channels**: Ingest simulated feedback from Support Tickets, App Store, NPS Surveys, Sales Calls, and Community forums.

### 3. Advanced Inbox Search & Multi-Param Filtering
- Full-text search across content, customer labels, feature areas, and rationale.
- Multi-select filters: Channel, Sentiment, Feature Area, AI Status, and **Date-Range (`fromDate` to `toDate`)**.
- Server-side pagination and sorting.

### 4. Real AI Theme Clustering & Month-Over-Month Spike Alerts
- Groups similar customer feedback into named, AI-generated themes (e.g., `["Login Issues", "Checkout Payment Failure"]`).
- Calculates period-over-period month-over-month volume comparisons (This Month vs Previous Month).
- Automatic **Spike Alert Warnings** (+68% threshold alerts) for rapidly expanding problem areas.

### 5. Vector-Grounded Ask LOOP (Retrieval-Augmented Generation / RAG)
- Computes dense vector embeddings for feedback content.
- Performs Cosine Similarity vector search to retrieve Top-K semantically relevant feedback items.
- Generates AI answers grounded strictly in retrieved context with clickable **Evidence & Source Cards**.

### 6. Executive Voice-of-Customer (VoC) Narrative Reports
- Generates period-based AI executive summaries, top customer themes, sentiment shifts, and actionable recommendations.
- Saves VoC reports to MongoDB with an interactive report browser and PDF/CSV export.

---

## 🛠️ Architecture & Tech Stack

```
           [ React + Vite Client ]
                     │  (REST API / JWT)
                     ▼
           [ Node.js / Express API Server ]
          ╱          │               ╲
         ▼           ▼                ▼
 [ MongoDB ]   [ BullMQ Queue ]   [ AI Service (Gemini / OpenAI) ]
 (Feedback,      (Async Jobs)     (Classification, Vector Embeddings,
  Insights,          │             Grounded RAG Q&A, VoC Reports)
  Reports)           ▼
             [ Redis Backend ]
```

- **Frontend**: React 18, Vite, Lucide Icons, Recharts, Vanilla CSS Design System
- **Backend**: Node.js, Express.js, Mongoose (MongoDB ORM), Zod Validation, JWT Auth, PDFKit
- **Background Queue**: BullMQ, ioredis, Redis Data Store
- **AI Engine**: Google Gemini API (`gemini-1.5-flash`), OpenAI API (`gpt-3.5-turbo`, `text-embedding-3-small`)

---

## 🔐 Demo Credentials

Use any of the following pre-seeded demo accounts to test the application:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@acme.com` | `password123` | Full Access (Feedback CRUD, CSV Import, Queue Management, VoC Reports) |
| **ANALYST** | `analyst@acme.com` | `password123` | Analytics, AI Theme Explorer, Ask LOOP RAG, VoC Reports |
| **VIEWER** | `viewer@acme.com` | `password123` | Read-only Dashboard, Feedback Inbox, Themes & Reports |

---

## 💻 Installation & Local Setup Guide

### Prerequisites
- Node.js (v18.x or higher)
- MongoDB Server running locally (`mongodb://127.0.0.1:27017/loop_db`) or MongoDB Atlas URI
- Redis Server running locally (`127.0.0.1:6379`) (Optional: App runs gracefully with direct fallback if Redis is offline)

### Step 1: Clone Repository
```bash
git clone https://github.com/madhav/LOOP-MERN.git
cd LOOP-MERN
```

### Step 2: Configure Environment Variables

Create `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/loop_db
JWT_SECRET=your_super_secret_jwt_key_12345
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# AI Provider API Keys (Optional - Heuristic fallback engine activates if omitted)
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-1.5-flash
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-3.5-turbo
```

Create `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 3: Install Dependencies
```bash
# Backend Dependencies
cd server
npm install

# Frontend Dependencies
cd ../client
npm install
```

### Step 4: Seed Database
Populate MongoDB with 125 realistic customer feedback records, AI themes, and demo accounts:
```bash
cd server
npm run seed
```

### Step 5: Start Development Servers
```bash
# Run Backend Server (from server directory)
npm run dev

# Run Frontend Client (from client directory in a second terminal)
npm run dev
```

Open `http://localhost:5173` in your browser and log in using `admin@acme.com` / `password123`.

---

## 📡 API Endpoint Reference

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user & workspace | Public |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT token | Public |
| `GET` | `/api/feedback` | Get feedback inbox with search, date range & filters | Required |
| `POST` | `/api/feedback` | Create single feedback item | Admin / Analyst |
| `POST` | `/api/import/csv` | Bulk upload feedback CSV | Admin / Analyst |
| `GET` | `/api/themes` | Get AI theme clusters & spike warnings | Required |
| `GET` | `/api/themes/trends` | Get month-over-month theme volume comparisons | Required |
| `POST` | `/api/ai/ask` | Vector-grounded semantic Ask LOOP Q&A | Required |
| `POST` | `/api/reports/voc` | Generate & save AI Voice-of-Customer report | Admin / Analyst |
| `GET` | `/api/reports/saved` | Fetch list of historical saved VoC reports | Required |
| `GET` | `/api/reports/export/pdf` | Download formatted PDF executive report | Admin / Analyst |

---

## 📄 License & Attribution
Developed as part of the Zidio Capstone Internship Project. All rights reserved.
