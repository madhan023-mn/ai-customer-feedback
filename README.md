# 🔄 LOOP — AI Customer-Feedback Intelligence Platform

> **Zidio Development Internship Capstone Project Final Submission**  
> **Repository:** [https://github.com/madhan023-mn/ai-customer-feedback](https://github.com/madhan023-mn/ai-customer-feedback)  
> **Live URL:** [https://ai-customer-feedback.vercel.app](https://ai-customer-feedback.vercel.app)  
> **Product Slogan:** *"Close the loop on customer feedback."*  
> **Stack:** MERN Stack (MongoDB, Express.js 5, React 18 + Vite, Node.js 18+) + Vector Embeddings + BullMQ + PDFKit + Recharts  

---

## 📑 Table of Contents
1. [Project Overview](#1-project-overview)
2. [Problem Statement](#2-problem-statement)
3. [Key Features](#3-key-features)
4. [Tech Stack](#4-tech-stack)
5. [System Architecture](#5-system-architecture)
6. [Demo Credentials](#6-demo-credentials)
7. [Installation & Setup](#7-installation--setup)
8. [Environment Variables](#8-environment-variables)
9. [API Overview](#9-api-overview)
10. [Deployment](#10-deployment)
11. [Project Structure](#11-project-structure)
12. [Challenges & Solutions](#12-challenges--solutions)
13. [Future Enhancements](#13-future-enhancements)
14. [Conclusion](#14-conclusion)

---

## 1. Project Overview

**LOOP** is an enterprise-grade AI customer-feedback intelligence platform that unifies scattered customer signals into a ranked, evidence-backed product action plan. Modern companies receive feedback across Zendesk support tickets, App Store reviews, post-purchase NPS/CSAT surveys, sales discovery notes, and community channels. LOOP ingests, classifies, clusters, and analyzes this high-volume unstructured feedback in real-time.

By combining modern full-stack MERN engineering with dense vector embeddings and Large Language Models, LOOP empowers product managers, engineers, and executives to understand customer sentiment shifts instantly and make confident, data-driven roadmap decisions.

---

## 2. Problem Statement

Digital product teams face three critical bottlenecks when handling user feedback:
1. **Information Fragmentation:** Feedback is siloed across customer support, app stores, community forums, and sales notes without a single source of truth.
2. **Manual Triage Bottlenecks:** Human sentiment analysis and tagging cannot scale as user bases grow, resulting in delayed bug detection and missed churn signals.
3. **Subjective Prioritization:** Feature roadmaps are often influenced by the loudest anecdotal voices rather than quantifiable, evidence-backed customer pain points.

**LOOP** solves this by automating multi-channel ingestion, structured AI classification, automated spike detection, plain-English vector Q&A (**Ask LOOP**), and one-click **Voice-of-Customer (VoC)** executive reporting.

---

## 3. Key Features

### 📌 Core Platform Features (C1–C5)
- **C1: Authentication & Workspace Isolation:** Secure sign-up/login with bcrypt password hashing, stateless JWT session handling, and strict multi-tenant database isolation.
- **C2: 3-Tier Role-Based Access Control (RBAC):** Server-side route guarding and fine-grained permissions for `ADMIN`, `ANALYST`, and `VIEWER` roles.
- **C3: Flexible Ingestion Pipeline:** Single manual feedback logging, universal streaming CSV importer with automatic column mapping, and simulated live channel webhooks (App Store, Zendesk, NPS, Sales Calls, Community).
- **C4: Interactive Feedback Inbox:** Server-side pagination, full-text keyword search, multi-parameter filters (channel, sentiment, theme, status), saved view quick presets, and inline status workflow (`NEW` $\rightarrow$ `REVIEWED` $\rightarrow$ `ACTIONED`).
- **C5: Executive Analytics Dashboard:** Interactive Recharts data visualizations (30-day Volume Over Time area chart, Sentiment Breakdown donut chart, Top Themes ranking bar chart, Channel distribution), real-time KPI metrics, and a dynamic Negativity Spike Alert banner.

### 🤖 AI Intelligence Features (AI1–AI4)
- **AI1: Real-Time Structured Auto-Classification:** Extracts sentiment category (`POS`, `NEU`, `NEG`), granular float sentiment score ($-1.0 \dots 1.0$), product feature area, multi-theme confidence tags ($0.0 \dots 1.0$), and a one-sentence rationale.
- **AI2: Theme Clustering & Trend Spike Alerts:** Dynamic theme grouping with rolling 7-day period-over-period growth tracking and automatic **Spike Detection (🔥)** when negative complaints surge past the $+68\%$ alert threshold.
- **AI3: Ask LOOP (Retrieval-Augmented Generation / RAG):** Natural language Q&A powered by 64-dimensional dense vector embeddings and Cosine Similarity in MongoDB; answers are strictly grounded in retrieved feedback and include source citation cards.
- **AI4: Voice-of-Customer (VoC) Executive Digests & PDF Export:** One-click weekly/monthly summary generation; pre-computes hard statistical aggregations in code to eliminate hallucinations, generates executive narratives with notable verbatim quotes, and exports formatted PDF reports via `PDFKit`.

---

## 4. Tech Stack

| Layer | Technology | Version | Purpose & Architectural Role |
| :--- | :--- | :--- | :--- |
| **Frontend UI** | **React.js** | `18.3.1` | Declarative, component-based user interface |
| **Build System** | **Vite** | `8.2.1` | Ultra-fast HMR and optimized production bundling |
| **Styling** | **Vanilla CSS + Glassmorphism** | Modern CSS3 | Custom dark theme, CSS variables, responsive design |
| **Charts** | **Recharts** | `2.15.1` | Interactive Volume Over Time, Donut, and Bar charts |
| **Icons** | **Lucide React** | `1.16.0` | Clean SVG icon system |
| **Backend Runtime** | **Node.js** | `18+ LTS` | High-throughput asynchronous runtime |
| **API Framework** | **Express.js** | `5.2.1` | REST API routing, controllers, and security middleware |
| **Database** | **MongoDB Atlas / Mongoose** | `9.9.1` | Multi-tenant document database & vector storage |
| **Queue / Worker** | **BullMQ + ioredis** | `6.1.1` | Asynchronous task queue with automated synchronous fallback |
| **AI LLM API** | **Google Gemini / OpenAI** | Official SDKs | Sentiment analysis, feature mapping, and RAG synthesis |
| **Vector Engine** | **Cosine Similarity Engine** | Custom | Normalized dense float vector matching |
| **PDF Generation** | **PDFKit** | `0.19.1` | Server-side binary PDF generation for VoC reports |
| **CSV Engine** | **csv-parse / json2csv** | `7.0.2` | High-speed streaming CSV parsing |
| **Validation** | **Zod** | `4.4.3` | Request payload schema validation and sanitization |
| **Authentication** | **jsonwebtoken + bcryptjs** | `9.0.3` | Stateless JWT tokens and cryptographic password hashing |

---

## 5. System Architecture

```
                       ┌────────────────────────────────────────┐
                       │          React 18 + Vite Client        │
                       │  (Dashboard, Inbox, Themes, Ask, VoC)  │
                       └───────────────────┬────────────────────┘
                                           │ (REST API + JWT)
                                           ▼
                       ┌────────────────────────────────────────┐
                       │        Node.js / Express API Layer     │
                       │  (Auth, RBAC Guards, Tenant Isolation) │
                       └───────┬───────────┬────────────┬───────┘
                               │           │            │
              ┌────────────────┘           │            └────────────────┐
              ▼                            ▼                             ▼
    ┌───────────────────┐        ┌───────────────────┐        ┌─────────────────────┐
    │     MongoDB       │        │  Redis + BullMQ   │        │  AI Services & RAG  │
    │  (Multi-Tenant    │        │  (Async Queue &   │        │ (Gemini/OAI Models, │
    │  Collections &    │        │  Fault-Tolerant   │        │  Dense Embeddings & │
    │  Vector Storage)  │        │  Sync Fallback)   │        │  Grounded Answers)  │
    └───────────────────┘        └───────────────────┘        └─────────────────────┘
```

---

## 6. Demo Credentials

The platform includes a pre-seeded, isolated demo workspace (**Acme Corp**) with 125+ pre-classified feedback items for evaluator testing:

| Role | Demo Email | Demo Password | Capabilities & Access Level |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@acme.com` | `password123` | **Full Access:** Ingest feedback, bulk CSV import, user/role management, VoC reports |
| **ANALYST** | `analyst@acme.com` | `password123` | **Operational Access:** Ingest feedback, trigger AI classification, theme trends, Ask LOOP, VoC reports |
| **VIEWER** | `viewer@acme.com` | `password123` | **Read-Only:** View analytics dashboard, feedback inbox, themes, and report downloads |

> *Note: The above credentials are mock demo accounts populated strictly for evaluation purposes. No real passwords or sensitive customer identities are used.*

---

## 7. Installation & Setup

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **MongoDB**: Local MongoDB instance (`mongodb://127.0.0.1:27017/loop_db`) or a free MongoDB Atlas URI
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/madhan023-mn/ai-customer-feedback.git
cd ai-customer-feedback/LOOP-MERN
```

### 2. Configure Environment Files
Create `.env` files for both server and client using the provided `.env.example` templates:

```bash
# Server environment
cp server/.env.example server/.env

# Client environment
cp client/.env.example client/.env
```

### 3. Install Dependencies
```bash
# Install root & server dependencies
npm install
cd server && npm install

# Install client dependencies
cd ../client && npm install
cd ..
```

### 4. Seed the Database
Populates MongoDB with 1 workspace, 3 demo users (`ADMIN`, `ANALYST`, `VIEWER`), 10 explicit themes, 125 feedback verbatims, 125 confidence join records, and 125 dense vector embeddings:
```bash
npm run seed
```

### 5. Start Development Servers
```bash
# Runs backend on port 5000 and Vite frontend on port 5173 concurrently
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser and sign in using `admin@acme.com` / `password123`.

---

## 8. Environment Variables

All sensitive values are stored in untracked `.env` files. Safe configuration templates are provided in `server/.env.example` and `client/.env.example`.

### Backend (`server/.env`):
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/loop_db
JWT_SECRET=your_jwt_secret_key_here
CLIENT_URL=http://localhost:5173

# Optional: Background queue (fallback executes synchronously if Redis is offline)
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# Optional: AI Provider API Keys (heuristic & local vector fallback engine activates if omitted)
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

### Frontend (`client/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 9. API Overview

All API endpoints require JWT Bearer authentication except public registration and login. Every query is filtered by the authenticated user's `workspaceId`.

| Method | Endpoint | Allowed Roles | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user and provision tenant workspace |
| `POST` | `/api/auth/login` | Public | Authenticate user and return JWT bearer token |
| `GET` | `/api/auth/me` | Authenticated | Retrieve authenticated user profile and role |
| `GET` | `/api/feedback` | Authenticated | Paginated feedback inbox with search and multi-filtering |
| `POST` | `/api/feedback` | Admin, Analyst | Create a single feedback entry |
| `PATCH` | `/api/feedback/:id/status` | Admin, Analyst | Update workflow status (`NEW`, `REVIEWED`, `ACTIONED`) |
| `POST` | `/api/feedback/:id/analyze` | Admin, Analyst | Force real-time AI re-classification of feedback |
| `POST` | `/api/import/feedback` | Admin, Analyst | Stream and batch-import feedback from CSV file |
| `POST` | `/api/feedback/simulate` | Admin, Analyst | Ingest simulated feed from selected channels |
| `GET` | `/api/dashboard/metrics` | Authenticated | Fetch aggregated KPI cards and spike alerts |
| `GET` | `/api/dashboard/charts` | Authenticated | Fetch volume time series, donut, and bar chart data |
| `GET` | `/api/themes` | Authenticated | List all themes with feedback counts and confidence |
| `GET` | `/api/themes/trends` | Authenticated | Fetch period-over-period theme volume changes & spikes |
| `POST` | `/api/ai/ask` | Authenticated | Vector-grounded Ask LOOP RAG semantic Q&A |
| `POST` | `/api/reports/voc` | Admin, Analyst | Synthesize Voice-of-Customer executive digest |
| `GET` | `/api/reports` | Authenticated | List all generated VoC reports |
| `GET` | `/api/reports/export/pdf/:id` | Authenticated | Download binary PDF export of VoC report |
| `GET` | `/api/members` | Admin | List workspace team members |
| `POST` | `/api/members/invite` | Admin | Invite a new user to the workspace with assigned role |

---

## 10. Deployment

### Vercel (Frontend & Serverless API)
LOOP includes root `vercel.json` configuration for unified monorepo deployment:
- **Client Build:** `@vercel/static-build` with `distDir: "dist"`
- **Serverless API:** `@vercel/node` routing `/api/(.*)` to `api/index.js`

### Render / Railway (Dedicated Backend)
A `render.yaml` configuration is included to run the Express backend as a dedicated Node web service with MongoDB Atlas connections.

---

## 11. Project Structure

```
LOOP-MERN/
├── .github/                  # CI/CD Workflows
├── api/                      # Vercel Serverless entrypoint
│   └── index.js
├── client/                   # React 18 + Vite Frontend
│   ├── src/
│   │   ├── components/       # Reusable UI cards, tables, Navbar, ProtectedRoute
│   │   ├── context/          # AuthContext, ThemeContext, RoleGuards
│   │   ├── pages/            # Dashboard, Feedback, Themes, AskLoop, Reports, Members
│   │   ├── services/         # Axios API client with auth interceptors
│   │   ├── App.jsx           # React Router DOM configuration
│   │   ├── index.css         # Custom Glassmorphism design system
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── server/                   # Node.js + Express API Backend
│   ├── config/               # Database connection (Mongoose)
│   ├── middleware/           # authMiddleware, roleMiddleware, errorHandler
│   ├── models/               # Workspace, User, Feedback, Theme, Embedding, Report
│   ├── queues/               # BullMQ job producers & workers
│   ├── routes/               # Modular REST route handlers
│   ├── services/             # AI classification, RAG cosine engine, PDFKit export
│   ├── utils/                # CSV parser, spike trend calculator, JWT helper
│   ├── seed.js               # Database seeding script (125+ records)
│   ├── server.js             # Main Express application entrypoint
│   └── package.json
├── package.json              # Root package configuration
├── vercel.json               # Vercel deployment specification
├── render.yaml               # Render deployment specification
└── README.md                 # Master Project Documentation
```

---

## 12. Challenges & Solutions

### 1. Serverless Background Queue Fault Tolerance
- **Challenge:** Serverless cloud environments (like Vercel) cannot run long-lived Redis worker processes for BullMQ.
- **Solution:** Implemented an adaptive producer (`feedbackJobProducer.js`) that detects Redis availability and automatically falls back to an in-process synchronous AI processor without dropping data or delaying responses.

### 2. Eliminating Hallucinations in Executive VoC Reporting
- **Challenge:** LLMs often hallucinate or compute inaccurate percentages when summarizing large volumes of raw feedback.
- **Solution:** Hardcoded mathematical aggregations (counts, sentiment ratios, top theme percentages) in Node.js before prompting the LLM, passing verified figures into the model strictly for narrative synthesis.

### 3. In-Database Vector Search Without Expensive Third-Party Subscriptions
- **Challenge:** External vector databases (e.g., Pinecone) add architectural overhead and recurring costs.
- **Solution:** Stored normalized 64-dimensional dense float vector embeddings directly in MongoDB and implemented an in-memory vector Cosine Similarity engine for fast, grounded semantic search.

---

## 13. Future Enhancements

- **Direct Webhook Integrations:** Native bi-directional connectors for Zendesk, Jira, Slack, GitHub Issues, and Apple App Store Connect.
- **Real-Time WebSocket Alerts:** Instant browser and desktop notifications when a theme exceeds negativity spike thresholds.
- **Domain-Specific Fine-Tuning:** Custom fine-tuned sentiment models optimized for industry-specific terminology in FinTech, Healthcare, and Gaming.

---

## 14. Conclusion

**LOOP** bridges the gap between raw customer sentiment and engineering execution. By combining a modern, responsive MERN stack with dense vector embeddings, dynamic spike detection algorithms, and automated executive PDF reporting, the platform delivers an enterprise-grade solution that enables product teams to listen, prioritize, and close the loop on customer feedback with confidence.

---
*Built for the **Zidio Development Web Development Track Capstone Evaluation**.*

