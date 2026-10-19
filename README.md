# PeerPath — Campus Peer Skill-Exchange Platform

[![B.Tech Capstone Project](https://img.shields.io/badge/Capstone_Project-Information_Technology-blue.svg)](PeerPath_Capstone_Synopsis_02-1.pdf)
[![Tech Stack](https://img.shields.io/badge/Tech_Stack-HTML5_%7C_CSS3_%7C_Vanilla_JS-success.svg)](PROJECT_OVERVIEW.md)
[![Storage](https://img.shields.io/badge/Storage-Browser_localStorage-orange.svg)](PROJECT_OVERVIEW.md)
[![Video](https://img.shields.io/badge/Video_Calls-Jitsi_Meet-purple.svg)](https://meet.jit.si)

> **Trade skills, not money. Learn from peers, not strangers.**  
> Official B.Tech Capstone Project Implementation (JULY–DEC 2026)  
> **Student:** Inderpal Singh (Roll No: 25001011020)  
> **Supervisor:** Dr. Parul Tomar  
> **Department:** Department of Computer Science & Engineering, J.C. Bose University of Science & Technology, YMCA, Faridabad  

---

## 🚀 Quick Start (Zero Installation Required)

Because PeerPath is built as a pure client-side static web application with **HTML5, CSS3, Vanilla ES6 JavaScript, and browser localStorage**, it requires **zero installation or backend server**.

### Option 1: Open Directly in Browser
Double-click `index.html` or run:
```bash
# On Linux:
xdg-open index.html

# On macOS:
open index.html

# On Windows:
start index.html
```

### Option 2: Run with Local Static Server
```bash
npm start
# or
npx serve . -l 3000
```
Then visit: `http://localhost:3000`

---

## 🔐 Credentials & Authentication

Arbitrary profile switching is disabled; each user has their own credentials, and the Admin Panel is strictly protected:

| Account Type | Email | Password | Role / Access |
|---|---|---|---|
| **Student (Inderpal Singh)** | `inderpal.it@jcboseust.ac.in` | `peerpath123` | Campus Student (Peer Discovery, Sessions, Reviews) |
| **Student (Aarav Sharma)** | `aarav.ce@jcboseust.ac.in` | `peerpath123` | Campus Student (Peer Discovery, Sessions, Reviews) |
| **Student (Priya Patel)** | `priya.dtu@gmail.com` | `peerpath123` | Campus Student (Peer Discovery, Sessions, Reviews) |
| **Administrator** | `admin@peerpath.edu` | `admin123` | **Full Admin Panel** (Approve registrations, moderate students) |

> **Note:** Convenient one-click "Quick Demo Login" chips are available on the Sign In page for evaluators.

---

## 🎯 Key Features

1. **Authentication & Role-Based Access:**
   - Dedicated login page enforcing passwords per student and admin.
   - Non-admin users are strictly blocked from viewing or entering the Admin Dashboard.
2. **Student Self-Registration with Admin Approval:**
   - Students can register by submitting their details (Name, Roll, College, Year, Branch, Skills to Teach/Learn).
   - Registrations sit in a `pending` state and cannot log in until the **Administrator reviews and approves** them.
   - Admin has a dedicated **"Pending Campus Registration Requests"** table with **`Approve`** and **`Reject`** actions.
3. **Skill-Barter Matching Engine (Synopsis 2.3):**
   - Every student declares 2 skills to teach and 2 to learn.
   - Intelligently surfaces complementary barter matches (`🔄 Perfect Barter Match`).
4. **Session Management (Synopsis 2.3):**
   - Book 1-hour sessions with preferred date & time.
   - Status pipeline: `Pending` → `Confirmed` → `Completed`.
5. **Jitsi Meet Video Conferencing (Synopsis 1.2):**
   - One-click `🎥 Join Video Call` launching free, account-less Jitsi video rooms.
6. **In-Session Real-Time Chat (Synopsis 2.3):**
   - Lightweight chat window with persistent message history in localStorage.
7. **1–5 Star Verified Rating (Synopsis 2.3):**
   - Both peers evaluate each other, calculating a running average score on user profiles.
8. **Admin Moderation View (Synopsis 2.3):**
   - Platform-wide metrics, registration review, user roster management, and profile removal.

---

## 📁 Project Architecture

```
AI-Project-2-PeerPath-/
├── index.html                  # Main application structure & views (Login + Main App)
├── css/
│   └── style.css               # Vanilla CSS3 styling, glassmorphism, themes
├── js/
│   ├── data.js                 # LocalStorage data store, auth validation & registration models
│   ├── auth.js                 # Login controller, self-registration handler & route guards
│   ├── discovery.js            # Peer search, category chips, barter matching
│   ├── sessions.js             # Session booking, accept/decline, Jitsi call
│   ├── chat.js                 # In-session messaging
│   ├── rating.js               # 1-5 star peer rating & average calculation
│   ├── admin.js                # Admin dashboard, registration approval & moderation
│   └── app.js                  # View navigation, toast system & theme toggle
├── PROJECT_OVERVIEW.md         # Comprehensive project documentation
├── package.json                # Static serving scripts
├── PeerPath_Capstone_Synopsis_02-1.pdf # Official University Capstone Synopsis
└── archive/
    └── legacy_fullstack/       # Preserved fullstack prototype (Future Scope)
```

For full system architecture, data schema, and workflow walkthrough, see [PROJECT_OVERVIEW.md](file:///home/harshitgarg/Downloads/AI-Project-2-PeerPath-/PROJECT_OVERVIEW.md).
