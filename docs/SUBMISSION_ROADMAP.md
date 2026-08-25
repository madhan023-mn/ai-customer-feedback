# 📋 Zidio Capstone Project Submission Master Guide
## Project LOOP — AI Customer-Feedback Intelligence Platform

Use this master guide to fill out your 5 submission deliverables on the Zidio Development portal.

---

## 🎯 Deliverable 1: Source Code / Figma (5 Marks)

### Submission Field Input:
```
https://github.com/madhan023-mn/ai-customer-feedback.git
```
*(Alternative web link: `https://github.com/madhan023-mn/ai-customer-feedback`)*

### Submission Notes / Description:
- **Repository Name:** `ai-customer-feedback` (Project LOOP)
- **Primary Stack:** MERN Stack (MongoDB, Express.js 5, React 18, Node.js 18+)
- **Architecture Highlights:** Multi-Tenant Isolation, RBAC (Admin, Analyst, Viewer), BullMQ + Redis Background Processing with Synchronous Fallback, Dense Vector Semantic Search (RAG), Automated Voice-of-Customer (VoC) PDF Generation, Recharts Data Visualization.
- **Repository Structure:**
  - `/client`: React 18 + Vite + Lucide Icons + Recharts + Context API
  - `/server`: Node.js + Express API + Mongoose ODM + PDFKit + BullMQ
  - `/docs`: Full Project Report, Demo Video Script, Feedback Video Script, and Architecture Diagrams.

---

## 🌐 Deliverable 2: Live Deployment (5 Marks)

### Submission Field Input:
```
https://ai-customer-feedback.vercel.app
```
*(If you hosted on Render/Railway/Netlify, replace with your active public deployment URL)*

### Evaluation Access & Demo Credentials:
The platform is pre-loaded with a multi-tenant demo workspace (**Acme Corp**) and 125+ classified customer feedback entries:

| Role | Email | Password | Allowed Capabilities |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@acme.com` | `password123` | Full access: Feedback CRUD, Bulk CSV Upload, Role Management, VoC Reports |
| **ANALYST** | `analyst@acme.com` | `password123` | Feedback Ingestion, AI Classification, Themes & Spike Trends, Ask LOOP RAG, VoC Generation |
| **VIEWER** | `viewer@acme.com` | `password123` | Read-only analytics dashboard, feedback inbox, themes, and executive reports |

---

## 🎥 Deliverable 3: Demo Video (4 Marks)

### Submission Field Input:
Upload your recorded video to **YouTube (Set visibility to "Unlisted")** or **Google Drive (Set sharing to "Anyone with the link can view")**, and paste your URL here:
```
https://youtu.be/YOUR_DEMO_VIDEO_ID
```
*(Or your Google Drive link)*

### Video Structure & Key Features Covered (6–8 Minutes):
1. **Introduction & System Architecture (0:00 - 0:45)**: Problem statement, MERN stack, multi-tenancy.
2. **Role-Based Authentication & Dashboard (0:45 - 2:00)**: Login as Admin, KPI metrics, sentiment donut chart, volume trends, top themes bar chart, negativity spike alert banner.
3. **Feedback Ingestion & Universal CSV Importer (2:00 - 3:15)**: Adding single feedback, uploading bulk CSV, simulated channel ingestion (App Store, Support Ticket, NPS Survey, Sales Call, Community).
4. **AI Auto-Classification & Intelligence Engine (3:15 - 4:15)**: Sentiment score (-1.0 to 1.0), feature area mapping, theme confidence tagging, rationale extraction.
5. **Theme Clustering & Period-over-Period Spike Detection (4:15 - 5:15)**: Theme explorer, growth rate calculation (+68% alert threshold 🔥), interactive drill-down.
6. **"Ask LOOP" Retrieval-Augmented Generation (RAG) (5:15 - 6:30)**: Semantic cosine vector search over embeddings, plain-English answers strictly grounded in customer evidence with citations.
7. **Voice-of-Customer (VoC) Executive Reports & PDF Export (6:30 - 7:30)**: One-click report synthesis, pre-computed non-hallucinated stats, executive summary, verbatim quotes, downloadable corporate PDF.
8. **RBAC Guard Enforcement & Conclusion (7:30 - 8:00)**: Logging in as Viewer/Analyst to demonstrate security guards.

*(A complete word-for-word script is available in `docs/DEMO_VIDEO_SCRIPT.md`)*

---

## 🎙️ Deliverable 4: Feedback Video (4 Marks)

### Submission Field Input:
Upload your reflection video to **YouTube (Unlisted)** or **Google Drive (Public Link)**:
```
https://youtu.be/YOUR_FEEDBACK_VIDEO_ID
```

### Video Content Summary (60–90 Seconds):
- **What I Learned:** Full-stack MERN architecture, multi-tenant database modeling, vector embeddings and RAG pipelines, asynchronous queue management with BullMQ and Redis, PDF document streaming, and modern React UX design.
- **Challenges Faced & Solutions:**
  - *Challenge 1:* Handling real-time AI classification at scale. *Solution:* Built BullMQ queue worker with automatic synchronous fallback when Redis is offline.
  - *Challenge 2:* Eliminating hallucinations in VoC executive reports. *Solution:* Hardcoded statistical aggregations in MongoDB and passed strictly structured metrics into the AI synthesizer.
- **Internship Experience:** Highlighting the hands-on engineering rigor, practical problem solving, and mentorship gained during the Zidio Development Internship.

*(A complete word-for-word script is available in `docs/FEEDBACK_VIDEO_SCRIPT.md`)*

---

## 📄 Deliverable 5: Project Report (2 Marks)

### Submission Field Input:
Upload `docs/PROJECT_REPORT.pdf` or paste a Google Drive / Notion link to your report:
```
Project Report: docs/PROJECT_REPORT.pdf (or link to uploaded PDF)
```

### Document Overview:
- **Title:** Comprehensive Capstone Project Report — Project LOOP (AI Customer-Feedback Intelligence Platform)
- **Length:** 10+ Pages / Comprehensive Technical Specification
- **Contents:**
  1. Executive Summary & Problem Formulation
  2. System Architecture & Tech Stack Matrix
  3. Database Schema & Entity Relationship Diagram (ERD)
  4. Core Feature Implementation & AI Intelligence Algorithms
  5. Security, Multi-Tenancy & RBAC Enforcement
  6. API Specification & Route Inventory
  7. Performance Optimizations & Fault Tolerance
  8. Testing, Verification & Validation
  9. Future Scope & Conclusion

*(Full report source available in `docs/PROJECT_REPORT.md` and compiled PDF in `docs/PROJECT_REPORT.pdf`)*
