# PeerPath — Complete Project Overview

> **Tagline:** Trade skills, not money. Learn from peers, not strangers.  
> **Capstone Project:** B.Tech in Information Technology (JULY–DEC 2026)  
> **Candidate:** Inderpal Singh (Roll No: 25001011020)  
> **Supervisor:** Dr. Parul Tomar  
> **Department:** Department of Computer Science & Engineering, Faculty of Informatics & Computing, J.C. Bose University of Science & Technology, YMCA, Faridabad – 121006  

---

## Table of Contents

1. [Executive Summary & Problem Statement](#1-executive-summary--problem-statement)
2. [Approved Technology Stack](#2-approved-technology-stack)
3. [System Architecture](#3-system-architecture)
4. [Client-Side Data Design (localStorage JSON)](#4-client-side-data-design-localstorage-json)
5. [Core Modules & Demonstration Workflow](#5-core-modules--demonstration-workflow)
6. [Single-Browser Peer Interaction Demonstration](#6-single-browser-peer-interaction-demonstration)
7. [Screens & User Experience](#7-screens--user-experience)
8. [Directory Structure](#8-directory-structure)
9. [Running & Deployment](#9-running--deployment)
10. [Future Scope & Archived Fullstack Reference](#10-future-scope--archived-fullstack-reference)

---

## 1. Executive Summary & Problem Statement

### 1.1 The Problems
College students across India face three fundamental hurdles in self-learning:
1. **Lack of Structured Peer Guidance:** Learners jump between disconnected YouTube videos, Udemy courses, and blogs with no accountability or feedback loops.
2. **High Dropout Rates:** When learners hit a blocker, they often quit entirely because there is no immediate peer to turn to for live guidance.
3. **Absence of Zero-Cost Knowledge-Exchange:** A student proficient in Python programming who wants to learn video editing or UI/UX design lacks a zero-cost mechanism to trade their knowledge with another peer without financial friction.

### 1.2 The Solution
**PeerPath** solves this through a campus **skill-barter model**:
- Every student declares **2 skills they can teach** and **2 skills they want to learn**, alongside their campus availability schedule.
- The discovery feed intelligently surfaces peers with complementary skill sets (e.g. Student A teaches Python and learns React, while Student B teaches React and learns Python &rarr; **Perfect Barter Match**).
- Either student initiates a **1-hour session request**.
- Upon acceptance, an automated **Jitsi Meet video conferencing link** and an **in-app chat window** are provisioned.
- After the session concludes, participants rate each other on a **1–5 star scale**, establishing a verified, merit-based campus reputation score.

---

## 2. Approved Technology Stack

As defined in **Chapter 1.2 of the Capstone Synopsis**:

| Layer | Approved Technology | Purpose & Rationale |
|---|---|---|
| **Frontend Structure** | **HTML5** | Semantic, accessible structure without heavy framework dependencies |
| **Styling & Layout** | **CSS3 (Vanilla)** | Custom CSS design system, dark/light themes, glassmorphism, responsive grid & micro-animations |
| **Client-Side Logic** | **Vanilla JavaScript (ES6)** | Modular, clean DOM manipulation, event handling, state management, and routing with zero build step |
| **Data Storage** | **Browser `localStorage`** | Stores `users` and `sessions` as JSON arrays locally, eliminating server/database hosting overhead for capstone demo |
| **Video Conferencing** | **Jitsi Meet (`meet.jit.si`)** | Free, zero-signup, encrypted browser-to-browser 1-hour video meetings linked per session |
| **Hosting** | **Static Hosting (GitHub Pages / Vercel)** | Simple static web files with no server maintenance or runtime deployment costs |

---

## 3. System Architecture

PeerPath is engineered as a **fully client-side static web application**. 

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PeerPath Web Application                        │
│                   (index.html + css/style.css)                         │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         ▼                           ▼                           ▼
┌──────────────────┐       ┌──────────────────┐        ┌──────────────────┐
│   Auth & User    │       │ Discovery Feed   │        │ Session Manager  │
│ Switcher Module  │       │ & Match Engine   │        │ & Jitsi Video    │
│  (js/auth.js)    │       │ (js/discovery.js)│        │ (js/sessions.js) │
└────────┬─────────┘       └────────┬─────────┘        └────────┬─────────┘
         │                          │                           │
         └──────────────────────────┼───────────────────────────┘
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     Client Data Layer (js/data.js)                     │
│                    Browser localStorage JSON Store                     │
│    Keys: `peerpath_users` | `peerpath_sessions` | `peerpath_theme`     │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
         ┌───────────────────────────┴───────────────────────────┐
         ▼                                                       ▼
┌──────────────────┐                                   ┌──────────────────┐
│  In-Session Chat │                                   │ Rating & Admin   │
│  (js/chat.js)    │                                   │ Moderation Views │
│                  │                                   │ (js/rating.js,   │
│                  │                                   │  js/admin.js)    │
└──────────────────┘                                   └──────────────────┘
```

### Key Architectural Strengths:
1. **Zero Setup & Instant Portability:** Can be launched by double-clicking `index.html` in any modern web browser or served via any static web host.
2. **Deterministic Demonstration:** Works reliably offline or online without database connection dropouts or backend latency during evaluation presentations.
3. **Separation of Concerns:** Modular JS scripts (`data.js`, `auth.js`, `discovery.js`, `sessions.js`, `chat.js`, `rating.js`, `admin.js`, `app.js`).

---

## 4. Client-Side Data Design (localStorage JSON)

Data is structured as JSON arrays under designated keys in `localStorage`:

### 4.1 Users Array (`peerpath_users`)
```json
[
  {
    "id": "user_inderpal",
    "name": "Inderpal Singh",
    "rollNumber": "25001011020",
    "college": "J.C. Bose UST, YMCA Faridabad",
    "year": "4th Year",
    "branch": "Information Technology",
    "email": "inderpal.it@jcboseust.ac.in",
    "skillsTeach": ["Python", "Machine Learning"],
    "skillsLearn": ["React.js", "Video Editing"],
    "availability": "Mon, Wed, Fri (5:00 PM - 7:00 PM)",
    "rating": 4.9,
    "totalRatings": 7,
    "bio": "Passionate about Python scripting, ML algorithms & data science...",
    "avatarColor": "#4f46e5"
  }
]
```

### 4.2 Sessions Array (`peerpath_sessions`)
```json
[
  {
    "id": "sess_101",
    "requesterId": "user_inderpal",
    "requesterName": "Inderpal Singh",
    "targetId": "user_aarav",
    "targetName": "Aarav Sharma",
    "skill": "React.js",
    "status": "confirmed",
    "scheduledDate": "2026-10-22",
    "scheduledTime": "18:00",
    "meetingUrl": "https://meet.jit.si/peerpath-inderpal-aarav-react",
    "note": "Hi Aarav, looking to learn React state & components!",
    "createdAt": "2026-10-18T10:15:00.000Z",
    "ratingByRequester": null,
    "ratingByTarget": null,
    "messages": [
      {
        "id": "msg_1",
        "senderId": "user_aarav",
        "senderName": "Aarav Sharma",
        "text": "Hey Inderpal! Super excited for our session...",
        "timestamp": "2026-10-18T11:00:00.000Z"
      }
    ]
  }
]
```

---

## 5. Core Modules & Demonstration Workflow

### 5.1 Authentication, Login & Role Security
Arbitrary switching has been replaced with authentic credential-based sessions:
- **Dedicated Login Page:** Every student and administrator must log in with their email and password.
- **Role-Based Protection:** The Admin Panel is strictly inaccessible to regular students.
- **Convenient Evaluation:** The Sign In screen includes one-click "Quick Demo Logins" for Inderpal Singh, Aarav Sharma, Priya Patel, and the Administrator.

### 5.2 Student Self-Registration with Admin Approval
- Prospective students can request campus membership via the **"Request Registration"** tab.
- Registration applications specify academic details, roll number, campus email, password, and up to 2 skills to teach and 2 to learn.
- The registration sits in a **`pending`** status in localStorage. The user cannot log in until approved.
- The Administrator receives a high-priority alert and can **Approve** or **Reject** registrations directly from the Admin Dashboard. Once approved, the student can immediately log in with their credentials.

### 5.3 Profile & Discovery Module (Synopsis 2.3)
- **Profile Form:** Students list 2 skills they can teach and 2 skills to learn, plus college details and availability.
- **Smart Discovery:** Renders cards for other campus peers.
- **Barter Matching:** Automatically evaluates if User A's desired skills match User B's teachable skills and vice versa, tagging compatible cards with a vibrant `🔄 Perfect Barter Match` badge.
- **Search & Filter:** Instant search by name, college, or skill, plus clickable skill chips.

### 5.4 Session Request Module (Synopsis 2.3)
- From a peer's card, click **Request Session**.
- Select skill, date, time, and intro note.
- Creates session in `pending` state.
- Recipient receives an incoming alert notification banner and badge.
- Recipient can **Accept** (status &rarr; `confirmed`) or **Decline**.

### 5.5 Video Conferencing Module (Synopsis 1.2 & 2.3)
- Once confirmed, clicking **"Join Video Call (Jitsi)"** opens a room at `https://meet.jit.si/peerpath-[sessionId]`.
- No signup, no installation, free high-definition video conferencing directly in the browser.

### 5.6 In-Session Chat Module (Synopsis 2.3)
- Real-time look & feel lightweight chat modal for confirmed sessions.
- Messages appended directly to `messages` array in localStorage.
- Auto-scrolls and shows distinct sender bubbles and timestamps.

### 5.7 Rating Module (Synopsis 2.3)
- When a session concludes, either student clicks **"Mark Completed"**.
- Triggers 1–5 star rating modal with feedback text.
- Calculates and updates the peer's running average rating on their campus profile:
  $$\text{New Rating} = \frac{(\text{Current Rating} \times \text{Count}) + \text{New Score}}{\text{Count} + 1}$$

### 5.8 Admin & Campus Moderation Module (Synopsis 2.3)
- Accessible **only** when authenticated as the **System Administrator** (`admin@peerpath.edu` / `admin123`).
- **Pending Registrations Table:** Displays applicant details with one-click **`Approve`** and **`Reject`** moderation controls.
- **Platform-Wide Metrics:** Registered Students, Pending Registrations, Total Sessions, Confirmed Calls, Completed Barters, Platform Average Rating, and Teachable Skills.
- **User Directory & Removal:** User management table with **Remove Profile** functionality to moderate problematic accounts without backend code.
- Demo reset button to restore default campus data at any point.

---

## 6. Single-Browser Peer Interaction Demonstration

To demonstrate the full end-to-end peer barter workflow to an evaluator:

1. **Step 1:** On the Sign In page, log in as **Inderpal Singh** (`inderpal.it@jcboseust.ac.in` / `peerpath123`).
2. **Step 2:** Navigate to **Browse Peers**. Find **Aarav Sharma** (highlighted with *Perfect Barter Match*).
3. **Step 3:** Click **Request Session**, pick "React.js", set date/time, and submit.
4. **Step 4:** Log out, then log in as **Aarav Sharma** (`aarav.ce@jcboseust.ac.in` / `peerpath123`).
5. **Step 5:** Notice the top alert banner: *"Incoming Session Request: Inderpal Singh wants to learn React.js"*. Click **Review Request** (or go to **My Sessions &rarr; Pending**) and click **Accept Request**.
6. **Step 6:** The session moves to **Confirmed & Ready**.
7. **Step 7:** Click **💬 Open Chat** and type a message from Aarav. Log out, log in as Inderpal, open chat, and see Aarav's message and reply!
8. **Step 8:** Click **🎥 Join Video Call (Jitsi)** to launch the live video room.
9. **Step 9:** Click **✓ Mark Completed**, rate 5 stars & submit review.
10. **Step 10:** Switch to **Admin Panel** to inspect platform-wide metrics and user list.

---

## 7. Directory Structure

```
AI-Project-2-PeerPath-/
├── index.html                  # Main static HTML5 application entry point
├── css/
│   └── style.css               # Vanilla CSS3 design system, themes, & animations
├── js/
│   ├── data.js                 # LocalStorage data store & seed campus roster
│   ├── auth.js                 # Active user state & Switch Active User switcher
│   ├── discovery.js            # Peer search, filter chips & barter matching
│   ├── sessions.js             # Booking, accept/decline, complete, Jitsi launcher
│   ├── chat.js                 # In-session messaging in localStorage
│   ├── rating.js               # 1-5 star rating modal & running score calculation
│   ├── admin.js                # Admin dashboard, analytics & user moderation
│   └── app.js                  # View router, toast notifications & theme toggle
├── package.json                # Static serving scripts
├── PROJECT_OVERVIEW.md         # Complete project documentation (this document)
├── README.md                   # Quick start & presentation instructions
├── PeerPath_Capstone_Synopsis_02-1.pdf # Official synopsis document
└── archive/
    └── legacy_fullstack/       # Archived React/Express/Postgres experiment (Future Scope)
```

---

## 8. Running & Deployment

### Run Locally (Zero Installation)
Simply open `index.html` in Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari:
```bash
# Option A: Open directly in default browser
xdg-open index.html   # On Linux
open index.html       # On macOS
start index.html      # On Windows
```

### Run Locally (Static Dev Server)
```bash
npm start
# or
npx serve . -l 3000
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Deploy to GitHub Pages or Vercel
- **GitHub Pages:** Go to repository settings &rarr; Pages &rarr; Branch: `main`, Folder: `/ (root)`.
- **Vercel:** Import Git repository with zero build commands; static files serve directly from root.

---

## 9. Future Scope & Archived Fullstack Reference

As outlined in **Chapter 3.2 of the Capstone Synopsis**:
- Expanding from single-campus pilot to a multi-college national network.
- Migrating from client-side `localStorage` to a centralized backend with a production database (e.g., Node.js/Express with PostgreSQL).
- For reference on the prospective database architecture, the prior prototype has been preserved in `archive/legacy_fullstack/`.
- Adding skill-verification assessments, endorsements, and gamification streaks.
