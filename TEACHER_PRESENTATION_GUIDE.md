# PeerPath — Teacher Presentation & Viva Defense Guide

> **Project Title:** PeerPath – A Campus Peer Skill-Exchange Platform  
> **Student:** Inderpal Singh (Roll No: 25001011020)  
> **Degree & Branch:** B.Tech in Information Technology  
> **Supervisor:** Dr. Parul Tomar  
> **Department:** Department of Computer Science & Engineering, J.C. Bose UST, YMCA Faridabad  
> **Session:** JULY–DEC 2026  
> **Repository:** [https://github.com/harshitagrwl1608/capstone.git](https://github.com/harshitagrwl1608/capstone.git)

---

## 1. The 30-Second Elevator Pitch (What to Say First)

> *"Good morning / afternoon Ma'am / Sir.*  
>  
> *My Capstone project is **PeerPath**, a campus-focused peer skill-exchange platform. In college, students often struggle with isolated, unstructured online tutorials and drop out when they get stuck. Simultaneously, students have complementary skills—for example, one student knows Python and wants to learn React, while another knows React and wants to learn Python.*  
>  
> *PeerPath eliminates monetary barriers through a zero-cost **skill-barter model**. Students declare up to two skills they can teach and two they wish to learn. The platform automatically matches compatible peers, lets them book structured 1-hour sessions, provides in-app chat and free video meeting links via Jitsi Meet, and builds a verified 1-to-5 star rating profile.*  
>  
> *To maintain campus safety, the system includes an **Admin Verification Workflow** where new student self-registrations must be vetted and approved before accounts can log in, along with complete self-booking prevention and role-based route guarding."*

---

## 2. Architecture & Design Principles (How to Justify Your Tech Stack)

If the teacher asks: *"Why did you use Vanilla HTML/CSS/JavaScript instead of a heavy React/Node framework?"*

| Aspect | Engineering Decision | Teacher Justification |
|---|---|---|
| **Frontend** | HTML5 Semantic Markup, Vanilla CSS3, ES6 Vanilla JS | Lightweight, instant load time, zero build pipeline dependencies, runs natively in any browser. Aligns strictly with Chapter 1.2 and 2.4 of the approved project synopsis. |
| **Design Style** | Minimalist Academic UI (No neon/AI template clutter) | Designed to look authentic, clean, and institution-ready. High readability, accessible typography, subtle elevation cards, responsive grid, light/dark theme toggle. |
| **Data Storage** | Browser `localStorage` (Structured JSON Schema) | Client-side relational emulation (`users`, `sessions`, `registration_requests`). Eliminates hosting costs and network latency during campus viva evaluations. |
| **Video Calls** | Jitsi Meet Integration (`meet.jit.si`) | Dynamic room generator (`peerpath-session-<id>`). Provides free, encrypted, account-free WebRTC video conferencing without maintaining a dedicated media server. |
| **Future Scope** | Node.js + PostgreSQL Backend | Documented in Chapter 3.2 of the synopsis for multi-college federated scaling. |

---

## 3. Core Functional Modules Summary

| Module | What It Does | Why It Matters for the Capstone |
|---|---|---|
| **Campus Authentication** | Dedicated email/password credential validation with password verification. | Replaces arbitrary profile switching with real role guards. Non-admins cannot see or access the Admin Panel. |
| **Admin-Approved Registration** | Students submit a registration request; their account is queued in `pending` state until Admin reviews roll number, branch, and skills. | Prevents fake/unauthorized accounts from joining the campus network. |
| **Self-Booking Prevention Guard** | The discovery feed automatically filters out the logged-in student's own card, and the booking pipeline rejects any request where requester equals target. | Ensures students cannot request demo classes or trade skills with themselves. |
| **Skill-Barter Matching Algorithm** | Cross-compares teachable and wanted skill arrays between peers. | Detects mutual complementary skills and tags them with a **`Perfect Barter Match`** badge. |
| **Search & Category Filtering** | Live text filtering (name, branch, college, skills) + interactive skill category chips. | Enables instant discovery across engineering branches. |
| **3-State Session Lifecycle** | Transitions from `Pending` &rarr; `Confirmed` &rarr; `Completed`. | Provides formal mutual agreement before initiating a live video exchange. |
| **Jitsi Video Conferencing** | Generates a deterministic meeting room URL on confirmation. | Realizes 1-hour peer-to-peer mentoring directly inside the browser. |
| **In-Session Messaging** | Persistent chat modal tied to the unique session ID. | Allows mentors and learners to coordinate agendas, exchange links, and share doubts. |
| **Weighted 1–5 Star Rating Engine** | Applies incremental running average formula upon session completion. | Builds authentic peer reputation with visible ratings and verified reviews. |
| **Admin Oversight & Moderation** | Platform metrics dashboard, registration approval/rejection table, and student directory with remove action. | Empowers college staff to monitor safety and engagement without touching database tools. |

---

## 4. Step-by-Step Live Demo Script (Click-by-Click)

Follow this exact sequence during your live presentation to deliver a smooth, confident demo:

### Step 1: Open the Application
- Open `http://localhost:3000` (or open `index.html` directly in Chrome/Edge/Firefox).
- **What to say:**  
  *"Here is the PeerPath portal. It opens to a clean, authenticated Sign In page. Notice that arbitrary profile switching is completely eliminated—users must log in with their campus credentials."*

### Step 2: Show Student Self-Registration (Admin Approval Pipeline)
- Click the **"Request Registration"** tab on the login card.
- Highlight the fields: *Full Name, College Roll Number, College Email, Branch, Year, Skills to Teach (2), Skills to Learn (2), Availability, and Bio*.
- **What to say:**  
  *"When an unregistered campus student signs up, their account does not activate immediately. It is held in a verification queue so that the campus administrator can verify their student identity."*

### Step 3: Log In as Inderpal Singh (Student View)
- Switch back to **"Sign In"**. Click the quick demo chip: **`Inderpal Singh (Student)`** (or enter `inderpal.it@jcboseust.ac.in` / `peerpath123`).
- Click **Sign In to PeerPath**.
- **What to say:**  
  *"Now I am signed in as Inderpal Singh, 4th Year IT. In the navigation bar, I have access to Browse Peers, My Sessions, and My Profile. Notice that the Admin Panel tab is strictly hidden and inaccessible to regular students."*

### Step 4: Demonstrate Discovery Feed & Barter Matching (No Self-Booking)
- Point out the clean layout: no extraneous demo banners, clean university theme.
- Point to **Aarav Sharma's** card and highlight the **`Perfect Barter Match`** badge.
- **What to say:**  
  *"PeerPath automatically analyzes skill sets. I teach Python and want React. Aarav teaches React and wants Python. The platform identifies this two-way synergy and highlights him as a Perfect Barter Match.*  
  *Also note: my own profile card is completely excluded from this feed, ensuring I cannot request a demo session or trade with myself."*
- Demonstrate the **Skill Chips** (click "Python", "React.js", then "All") and type in the live search bar (*e.g., "Sharma"* or *"DTU"*).

### Step 5: Book a 1-Hour Skill Exchange Session
- On **Aarav Sharma's** card, click **"Request Session"**.
- The modal opens:
  - Skill to Learn: Select `React.js (Taught by Aarav Sharma)`.
  - Date & Time: Pre-filled for tomorrow at `17:00` (5:00 PM).
  - Note: *"Hi Aarav, I would love to connect for a 1-hour peer exchange session!"*
- Click **Send Session Request**.
- The app confirms the request with a toast notification and switches to **My Sessions &rarr; Pending Requests**.
- **What to say:**  
  *"The request is now in 'Pending' status. Inderpal is waiting for Aarav to review and accept the session."*

### Step 6: Log In as Aarav Sharma & Accept the Request
- Click **Logout** in the top navbar.
- On the login screen, click **`Aarav Sharma (Student)`** (`aarav.ce@jcboseust.ac.in` / `peerpath123`) and sign in.
- Notice the **yellow notification alert banner** below the navbar:  
  *"Incoming Session Request: Inderpal Singh requested a 1-hour exchange for React.js."*
- Navigate to **My Sessions &rarr; Pending**.
- Click **`✓ Accept Request`**.
- **What to say:**  
  *"Aarav receives the request and accepts it. The session moves from Pending to Confirmed & Ready."*

### Step 7: Show Jitsi Video Call & In-Session Chat
- On the confirmed session card:
  1. Click **`💬 Open Chat`**. Type: *"Hi Inderpal, excited for our session. I'll cover component state and props!"* and click **Send**.
  2. Point out the **`🎥 Join Video Call (Jitsi)`** button.
- **What to say:**  
  *"Once confirmed, PeerPath provisions a free, zero-login Jitsi Meet video room (`meet.jit.si`) specifically for this session ID, enabling instant face-to-face mentorship alongside persistent in-session chat."*

### Step 8: Mark Completed & Submit 1–5 Star Rating
- Click **`✓ Mark Completed`**.
- The **Rate Your Peer Exchange** modal appears.
- Select **5 Stars**, write a review (*"Excellent peer mentor, clarified React hooks quickly!"*), and click **Submit Verified Rating**.
- **What to say:**  
  *"Both participants submit a rating. The system recalculates the mentor's running weighted average score and updates their public reputation on campus."*

### Step 9: Log In as Admin Moderator & Approve Self-Registrations
- Click **Logout**. Click **`🛡️ Admin Moderator`** (`admin@peerpath.edu` / `admin123`) and sign in.
- The **Admin Panel** tab unlocks in the navbar!
- Highlight the three sections:
  1. **Platform Metrics:** Total Registered Students, Pending Registrations, Total Sessions, Confirmed Calls, Platform Average Rating.
  2. **Pending Campus Registration Requests:** Point out pending student submissions (e.g. *Vikram Malhotra* or *Ritu Sen*). Click **`✓ Approve`** to activate the account.
  3. **Campus Students Directory:** Show the full roster and point out the **`Remove`** button for moderating or banning problematic users.
- **What to say:**  
  *"The campus Administrator maintains complete governance: vetting registration requests, observing engagement metrics, and moderating accounts."*

### Step 10: Presentation Safety Reset (Footer Link)
- Point to the discrete link in the footer: `↺ Reset Demo State`.
- **What to say:**  
  *"If needed during testing or repeated evaluations, the platform includes a one-click reset to restore the sample campus dataset."*

---

## 5. Expected Viva Questions & Best Answers

### Q1: Why did you use Vanilla JavaScript instead of React, Angular, or Vue?
> **Answer:**  
> *"As outlined in Chapter 1.2 and 2.4 of our Capstone Synopsis, our objective for this phase was to build a dependency-free, high-performance web client that runs natively in any standard browser without `npm install`, Webpack bundling, or node version conflicts. This guarantees zero deployment overhead, maximum speed, and allows teachers to open the project simply by double-clicking `index.html`."*

### Q2: Where is user and session data stored? Why not a live SQL database?
> **Answer:**  
> *"Data is modeled and stored as structured JSON arrays in the browser's `localStorage` under distinct keys (`peerpath_users`, `peerpath_sessions`, `peerpath_reg_requests`). This simulates relational tables with foreign keys (`requesterId`, `targetId`, `sessionId`) without requiring expensive cloud database hosting or Wi-Fi dependencies during live evaluation. In Chapter 3.2 (Future Scope), we document the complete migration roadmap to a PostgreSQL/Node.js backend."*

### Q3: How do you prevent a student from requesting a class/session from themselves?
> **Answer:**  
> *"We implemented a two-tier guard:*  
> 1. *In `js/discovery.js`, the Browse Peers feed filters out the logged-in user's profile card based on matching `id`, `email`, and `name`. The student literally cannot see themselves in the peer list.*  
> 2. *In `js/sessions.js`, both `openRequestModal()` and `submitRequest()` check if `currentUser.id === peer.id` or if emails match. If someone attempts to trigger self-booking, the request is blocked and a warning toast is displayed."*

### Q4: How does the Barter Matching algorithm decide a "Perfect Match"?
> **Answer:**  
> *"In `js/discovery.js`, the `calculateMatchScore(me, peer)` function checks for a two-way skill intersection:*  
> - *Condition 1: Does the peer teach a skill that I want to learn?*  
> - *Condition 2: Do I teach a skill that the peer wants to learn?*  
> *If both conditions are true, it awards a score of 3 ('Perfect Barter Match'). If only one condition is true, it awards a score of 1 ('Complementary Skill'). The feed sorts higher scores to the top."*

### Q5: How is the running rating score calculated?
> **Answer:**  
> *"When a student completes a session and submits a rating, we use the incremental weighted average formula in `js/rating.js`:*  
> $$\text{New Rating} = \frac{(\text{Current Rating} \times \text{Current Count}) + \text{New Score}}{\text{Current Count} + 1}$$  
> *This ensures accurate weighting of all previous ratings without having to iterate through raw history logs."*

### Q6: How does the video calling feature work? Did you build a custom media server?
> **Answer:**  
> *"We integrated Jitsi Meet (`meet.jit.si`), an open-source WebRTC video service. PeerPath generates a unique, sanitized room name based on the confirmed session ID. When either student clicks 'Join Video Call', it launches Jitsi directly in the browser with full audio/video, screen sharing, and encryption—with zero API fees or user signup required."*

### Q7: How does the platform handle security and access control?
> **Answer:**  
> *"We implemented role-based route guards in `js/auth.js` and `js/app.js`:*  
> 1. *Unauthenticated users cannot view the main dashboard; they are restricted to the login/registration screen.*  
> 2. *Students can only view their own sessions and profile; the Admin Panel is rendered only when `user.isAdmin === true`.*  
> 3. *New registrations are set to `pending` and cannot authenticate until approved by the Admin."*

### Q8: What if two students want to exchange skills but their schedules don't match?
> **Answer:**  
> *"Each peer card clearly displays the student's declared campus availability (e.g., 'Mon, Wed, Fri 5:00 PM - 7:00 PM'). Additionally, the session booking modal allows the requester to propose a specific date, time, and custom agenda note, and the in-session chat allows them to reschedule if needed."*

### Q9: What happens if a student misbehaves or submits inappropriate reviews?
> **Answer:**  
> *"The campus Administrator has full moderation capability through the Admin Panel. They can view the student roster, inspect ratings, and immediately remove or deactivate any student profile."*

### Q10: How can the college deploy this for all students?
> **Answer:**  
> *"Because PeerPath is built with standards-compliant HTML5, CSS3, and JavaScript, it can be hosted for free in under two minutes using GitHub Pages, Vercel, or the university's internal web server by simply uploading the static directory."*

---

## 6. Demo Login Credentials Quick-Card

Keep this table handy during your presentation:

| Persona | Campus Email | Password | Primary Skills | Role |
|---|---|---|---|---|
| **Inderpal Singh** | `inderpal.it@jcboseust.ac.in` | `peerpath123` | Teaches: Python, ML<br>Learns: React.js, Video Editing | Student (4th Yr IT, YMCA) |
| **Aarav Sharma** | `aarav.ce@jcboseust.ac.in` | `peerpath123` | Teaches: React.js, Tailwind<br>Learns: Python, DSA | Student (3rd Yr CE, YMCA) |
| **Priya Patel** | `priya.dtu@gmail.com` | `peerpath123` | Teaches: UI/UX, Figma<br>Learns: Web Dev, Python | Student (2nd Yr ECE, DTU) |
| **Administrator** | `admin@peerpath.edu` | `admin123` | Campus Safety & Oversight | System Admin & Moderator |

> **Tip:** You can also use the one-click **Quick Demo Login chips** on the Sign In card to autofill and log in instantly without typing!

---

## 7. How to Run Locally

If the teacher asks you to start the project from scratch in front of them:

```bash
# 1. Clone the repository (if not already downloaded)
git clone https://github.com/harshitagrwl1608/capstone.git
cd capstone

# 2. Run with any local server (Option A: Python 3)
python3 -m http.server 3000

# 3. Or simply double-click index.html in any browser (Option B: Pure file)
# The application runs with 100% functionality in any modern browser!
```
