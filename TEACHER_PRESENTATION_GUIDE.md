# PeerPath — Teacher Presentation & Viva Defense Guide

> **Project Title:** PeerPath – A Campus Peer Skill-Exchange Platform  
> **Student:** Inderpal Singh (Roll No: 25001011020)  
> **Degree & Branch:** B.Tech in Information Technology  
> **Supervisor:** Dr. Parul Tomar  
> **Department:** Department of Computer Science & Engineering, J.C. Bose UST, YMCA Faridabad  
> **Session:** JULY–DEC 2026  

---

## 1. The 30-Second Elevator Pitch (What to Say First)

> *"Good morning / afternoon Ma'am/Sir. My capstone project is **PeerPath**, a campus-focused peer skill-exchange platform. In college, students often struggle with isolated, unstructured online tutorials and drop out when they get stuck. Simultaneously, students have complementary skills—for example, one student knows Python and wants to learn React, while another knows React and wants to learn Python.*  
>  
> *PeerPath implements a zero-cost **skill-barter model**. Students declare two skills they can teach and two they wish to learn. The platform automatically matches compatible peers, lets them book 1-hour sessions, provides in-app chat and free video meeting links via Jitsi, and builds a verified 1-to-5 star rating profile. It also includes an administrator verification flow so only verified campus students can join."*

---

## 2. Complete Features Summary

| Feature | What It Does | Why It Matters for the Project |
|---|---|---|
| **Campus Authentication** | Dedicated email/password login for students and admin. | Secures accounts; non-admins are locked out of the Admin panel. |
| **Self-Registration with Admin Approval** | Students submit a sign-up form; their account is held in `pending` status until Admin reviews and approves it. | Ensures campus safety and prevents fake/spam accounts. |
| **Skill-Barter Matching Engine** | Compares skills taught vs skills wanted between students. | Highlights complementary pairs with a **`Perfect Barter Match`** tag. |
| **Search & Category Filtering** | Live text search + clickable skill chips (*Python*, *React*, *Figma*, *C++*, etc.). | Allows quick discovery of peer mentors across branches. |
| **Session Booking Pipeline** | 3-stage lifecycle: `Pending` &rarr; `Confirmed` &rarr; `Completed`. | Provides a structured workflow for booking, accepting, and tracking sessions. |
| **Jitsi Meet Video Conferencing** | One-click `Join Video Call` generates a free, account-less Jitsi video room. | Enables face-to-face 1-hour peer mentorship without building custom media servers. |
| **In-Session Messaging** | Lightweight real-time chat modal with persistent message history. | Allows peers to coordinate schedule details and share notes. |
| **1–5 Star Rating System** | Both participants rate each other after marking a session completed. | Automatically calculates and updates running average rating on user profiles. |
| **Admin Dashboard** | Platform metrics, pending registrations table (Approve/Reject), and student directory. | Gives department staff oversight and user moderation capability. |

---

## 3. Step-by-Step Live Demo Script (Click-by-Click)

Follow this exact sequence during your presentation:

### Step 1: Open the Application
- Open `http://localhost:3000` (or double-click `index.html`).
- **What to say:** *"Here is the PeerPath portal. It opens to a clean, authenticated Sign In page. Notice that arbitrary profile switching is completely disabled."*

### Step 2: Show Student Self-Registration (Admin Approval Flow)
- Click the **"Request Registration"** tab.
- Point out the form fields: *Full Name, College Roll Number, College Email, Branch, Year, Skills to Teach (2), Skills to Learn (2), Availability, and Bio*.
- **What to say:** *"When a new student registers, their profile doesn't immediately become active. It enters a pending verification queue for the Administrator to approve."*

### Step 3: Log In as Inderpal Singh (Student View)
- Switch back to **"Sign In"**. Click the quick demo chip: **`Inderpal Singh (Student)`** (or enter `inderpal.it@jcboseust.ac.in` / `peerpath123`).
- Click **Sign In**.
- **What to say:** *"Now I am logged in as Inderpal Singh, 4th Year IT. In the navbar, notice I have access to Browse Peers, My Sessions, and My Profile, but the Admin Panel is strictly hidden and inaccessible."*

### Step 4: Show the Discovery Feed & Skill Matching
- On the **Browse Peers** feed, point to **Aarav Sharma's** card.
- Show the **`Perfect Barter Match`** badge.
- **What to say:** *"PeerPath automatically calculates barter compatibility. I teach Python and want React. Aarav teaches React and wants Python. The system detects this two-way match and highlights his card."*
- Demonstrate the **Skill Chips** (e.g. click "Python", "React.js", then "All") and the live search bar.

### Step 5: Book a 1-Hour Session
- Click **"Request Session"** on Aarav Sharma's card.
- Select skill: `React.js`, set tomorrow's date at `18:00`, and click **Send Session Request**.
- The app automatically navigates to **My Sessions &rarr; Pending Requests**.
- **What to say:** *"The session request is now in pending status. I will now log out and log in as Aarav to accept it."*

### Step 6: Log In as Aarav Sharma & Accept Request
- Click **Logout** in the navbar.
- On the login screen, click **`Aarav Sharma (Student)`** (`aarav.ce@jcboseust.ac.in` / `peerpath123`) and sign in.
- Notice the **yellow notification banner** at the top: *"Incoming Session Request: Inderpal Singh wants to learn React.js"*.
- Go to **My Sessions &rarr; Pending**.
- Click **`✓ Accept Request`**.
- **What to say:** *"Aarav accepts the request. The session transitions from Pending to Confirmed & Ready."*

### Step 7: Demonstrate Video Call & In-Session Chat
- On the confirmed session card:
  1. Click **`💬 Open Chat`**. Type: *"Hi Inderpal, I'm ready for our React session!"* and click **Send**.
  2. Point to the **`🎥 Join Video Call (Jitsi)`** button.
- **What to say:** *"When confirmed, PeerPath provisions a free, zero-signup Jitsi Meet video room (`meet.jit.si`) tailored for this session, plus an in-app chat window to coordinate."*

### Step 8: Mark Completed & 1–5 Star Rating
- Click **`✓ Mark Completed`**.
- The **Rate Your Peer Exchange** modal pops up.
- Select **5 Stars**, type a quick note (*"Great mentor, explained React hooks clearly!"*), and click **Submit Verified Rating**.
- **What to say:** *"Both peers evaluate each other. The system recalculates the mentor's running average rating and updates their campus credibility score."*

### Step 9: Log In as Admin Moderator & Approve Registrations
- Log out. Click **`🛡️ Admin Moderator`** (`admin@peerpath.edu` / `admin123`) and sign in.
- The **Admin Panel** unlocks in the navigation bar!
- Point out:
  1. **Platform Metrics:** Registered Students, Pending Registrations, Total Sessions, Confirmed Calls, Platform Average Rating.
  2. **Pending Campus Registration Requests Table:** Point to applicants like *Vikram Malhotra* or *Ritu Sen*. Click **`✓ Approve`**.
  3. **Campus Students Directory:** Show the roster and point out the **`Remove`** button for moderating problematic accounts.
- **What to say:** *"The Administrator has full oversight: reviewing metrics, approving student self-registrations, and moderating inappropriate accounts without touching database scripts."*

---

## 4. Expected Viva Questions & Best Answers

### Q1: Why did you use HTML5, Vanilla CSS3, and Vanilla JavaScript instead of React or Angular?
> **Answer:** *"As specified in Chapter 1.2 and Chapter 2.4 of our Capstone Synopsis, using pure HTML5, CSS3, and Vanilla ES6 JavaScript ensures the project runs directly in any standard browser with zero build tooling or npm dependencies. It keeps the architecture lightweight, fast, and easy to deploy on any static host like GitHub Pages or Vercel, which fits the semester capstone timeline."*

### Q2: Where is the data stored? Why not use a server-side database like MySQL or MongoDB right now?
> **Answer:** *"Data is stored using the browser's `localStorage` as JSON arrays under designated keys (`peerpath_users`, `peerpath_sessions`, `peerpath_reg_requests`). This mirrors relational tables without the hosting cost or network latency during campus presentations. In Chapter 3.2 (Future Scope), we have documented the migration roadmap to a Node.js and PostgreSQL backend when scaling to a multi-college network."*

### Q3: How does the platform prevent random people from signing up?
> **Answer:** *"We built an Admin Approval workflow. When a student registers, their account is saved with status `pending`. They cannot log in until the campus Administrator reviews their roll number and branch in the Admin Panel and clicks 'Approve'."*

### Q4: How is the video call handled? Is it custom WebRTC or third-party?
> **Answer:** *"We integrated Jitsi Meet (`meet.jit.si`), an open-source, encrypted video conferencing service. PeerPath generates a unique meeting room URL per session ID. When a session is confirmed, students click 'Join Video Call' to meet face-to-face with zero signup friction."*

### Q5: How is the running rating score calculated?
> **Answer:** *"Whenever a session concludes and a review is submitted, we apply the weighted incremental average formula:*  
> $$\text{New Rating} = \frac{(\text{Current Rating} \times \text{Current Count}) + \text{New Score}}{\text{Current Count} + 1}$$  
> *This ensures past ratings are accurately weighted without recalculating the entire history from scratch."*

### Q6: What happens if a user is reported or misbehaves?
> **Answer:** *"The Admin Panel includes a moderation directory where the Administrator can inspect student profiles, review completed exchanges, and remove problematic profiles with one click."*

---

## 5. Demo Login Credentials Reference Card

Keep this next to you during the demo:

| Persona | Email | Password | Role |
|---|---|---|---|
| **Inderpal Singh** | `inderpal.it@jcboseust.ac.in` | `peerpath123` | Student (4th Yr IT, YMCA) |
| **Aarav Sharma** | `aarav.ce@jcboseust.ac.in` | `peerpath123` | Student (3rd Yr CE, YMCA) |
| **Priya Patel** | `priya.dtu@gmail.com` | `peerpath123` | Student (2nd Yr ECE, DTU) |
| **Administrator** | `admin@peerpath.edu` | `admin123` | Campus Admin & Moderator |
