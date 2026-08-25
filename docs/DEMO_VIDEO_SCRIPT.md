# 🎥 Demo Video Walkthrough Script (Deliverable 3 — 4 Marks)
## Project LOOP — AI Customer-Feedback Intelligence Platform

> **Recommended Duration:** 5 to 7 minutes  
> **Submission Platforms:** YouTube (Set to **Unlisted**) or Google Drive (**Anyone with the link can view**)

---

### ⏱️ Minute-by-Minute Recording Storyboard

```
0:00 - 0:45  │ 01. Introduction & Architecture Overview
0:45 - 2:00  │ 02. Role-Based Login (Admin) & Analytics Dashboard (KPIs, Charts, Spike Alert)
2:00 - 3:15  │ 03. Feedback Ingestion: Single Entry, Universal CSV Importer & Simulated Feeds
3:15 - 4:15  │ 04. Real-Time AI Auto-Classification (Sentiment, Scores, Themes, Rationales)
4:15 - 5:15  │ 05. Theme Explorer & Dynamic Period-over-Period Spike Detection (+68% Alert)
5:15 - 6:30  │ 06. "Ask LOOP" (Retrieval-Augmented Generation / RAG) with Evidence Citations
6:30 - 7:30  │ 07. Voice-of-Customer (VoC) Executive Reports & PDF Export
7:30 - 8:00  │ 08. RBAC Security Demonstration (Viewer / Analyst) & Closing
```

---

### 🎙️ Word-for-Word Spoken Script

#### **[0:00 – 0:45] Scene 1: Introduction & Problem Statement**
- **Visual:** Open browser to the Project LOOP landing page ([http://localhost:5173](http://localhost:5173) or live URL).
- **Spoken Audio:**
  > *"Hello everyone and mentors at Zidio Development. My name is Madhan, and today I am excited to present **Project LOOP** — an Enterprise AI Customer-Feedback Intelligence Platform.*
  >
  > *Every modern product team is overwhelmed by customer feedback scattered across App Store reviews, Zendesk support tickets, NPS surveys, and community channels. Project LOOP closes the loop by ingesting unstructured feedback, classifying it with AI in real-time, detecting sentiment spikes, answering questions via RAG vector search, and generating executive Voice-of-Customer reports."*

---

#### **[0:45 – 2:00] Scene 2: Role-Based Login & Analytics Dashboard**
- **Visual:** Log in using `admin@acme.com` / `password123`. The Analytics Dashboard loads with interactive Recharts.
- **Spoken Audio:**
  > *"Let’s log in with our pre-seeded Admin credentials. Here on the executive dashboard, we see real-time KPIs: Total Feedback Volume, Net Sentiment Index, Resolution Rate, and Active Spikes.*
  >
  > *Down here, we have interactive visualizations: Volume Over Time area chart, Sentiment Breakdown donut chart, Top Themes ranking bar chart, and Channel distributions.*
  >
  > *Notice this prominent **Negativity Spike Alert Banner** at the top — it automatically calculates period-over-period sentiment shifts and warns product teams when negative complaints surge beyond our threshold."*

---

#### **[2:00 – 3:15] Scene 3: Multi-Channel Ingestion & Universal CSV Importer**
- **Visual:** Navigate to **Add Feedback** / **Import Feedback** in the navigation bar.
- **Spoken Audio:**
  > *"To bring in feedback, Project LOOP provides three flexible ingestion channels:*
  > 1. *A single manual entry modal with channel and source tagging.*
  > 2. *Our **Universal CSV Importer**, which automatically validates headers and streams bulk feedback into the database.*
  > 3. *And simulated real-time channel feeds from App Store, Zendesk, NPS, and Sales Calls for instant demonstration."*

---

#### **[3:15 – 4:15] Scene 4: Real-Time AI Auto-Classification**
- **Visual:** Open **Feedback Inbox**. Click on a feedback item to show the details panel.
- **Spoken Audio:**
  > *"When feedback arrives, our AI engine automatically classifies it across four key dimensions:*
  > - *Sentiment Category: Positive, Neutral, or Negative.*
  > - *Normalized Sentiment Score from minus one point zero to plus one point zero.*
  > - *Product Feature Area mapping like Checkout, Performance, or Authentication.*
  > - *And multi-theme confidence tagging with an AI-generated rationale.*
  >
  > *Analysts can also transition items across our workflow: from **New** to **Reviewed** to **Actioned**."*

---

#### **[4:15 – 5:15] Scene 5: Theme Explorer & Period-over-Period Spike Alerts**
- **Visual:** Click on **Themes** page. Show the dynamic theme cards and drill into a spiking theme.
- **Spoken Audio:**
  > *"Here in the Theme Explorer, feedback is clustered into semantic categories. Our algorithm compares current 7-day volume against the previous 7 days.*
  >
  > *If a theme experiences a volume jump exceeding plus 68% with high negative sentiment, it triggers this **Spike Alert badge**. Clicking any theme immediately filters the underlying customer verbatims."*

---

#### **[5:15 – 6:30] Scene 6: "Ask LOOP" Semantic Vector RAG Q&A**
- **Visual:** Navigate to **Ask LOOP**. Type a natural question: *"What are users complaining about in the mobile checkout?"* and click Send.
- **Spoken Audio:**
  > *"Next is our flagship AI feature: **Ask LOOP**.*
  >
  > *Rather than relying on basic keyword search, Ask LOOP uses 64-dimensional dense vector embeddings and Cosine Similarity to find the most relevant feedback entries in MongoDB.*
  >
  > *It grounds its answer strictly in the retrieved evidence, providing a synthesized plain-English summary alongside clickable citation cards citing the exact customer feedback."*

---

#### **[6:30 – 7:30] Scene 7: Voice-of-Customer (VoC) Reports & PDF Export**
- **Visual:** Navigate to **Reports**. Click **Generate VoC Report**, then click **Download PDF**.
- **Spoken Audio:**
  > *"Finally, product leaders need executive summaries. Our **Voice-of-Customer Report generator** pre-computes statistical metrics in code to prevent AI hallucinations, generates an executive narrative with verbatim customer quotes, and allows one-click export to a downloadable, beautifully formatted PDF report powered by PDFKit."*

---

#### **[7:30 – 8:00] Scene 8: Security & Conclusion**
- **Visual:** Log out and log in as `viewer@acme.com`. Show that mutation buttons (like Add Feedback / Generate Report) are restricted.
- **Spoken Audio:**
  > *"Project LOOP also enforces strict Role-Based Access Control and multi-tenant database isolation.*
  >
  > *Thank you to Zidio Development and our mentors for the opportunity to build this enterprise AI platform. All source code, live deployment links, and documentation are available in the submission portal."*

---
