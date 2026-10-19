/**
 * PeerPath - Data & LocalStorage Management Module
 * Implements client-side JSON data store in browser localStorage
 * with authentication, passwords, and admin-approved self-registration.
 */

const STORAGE_KEYS = {
  USERS: 'peerpath_users',
  SESSIONS: 'peerpath_sessions',
  SESSION_USER: 'peerpath_logged_in_user',
  REGISTRATION_REQUESTS: 'peerpath_reg_requests',
  THEME: 'peerpath_theme'
};

// Designated Admin Credentials
const ADMIN_USER = {
  id: 'user_admin',
  name: 'System Administrator',
  email: 'admin@peerpath.edu',
  password: 'admin123',
  college: 'J.C. Bose UST, YMCA Faridabad',
  year: 'Faculty & Administration',
  branch: 'Platform Moderation',
  skillsTeach: ['Platform Moderation', 'Campus Operations'],
  skillsLearn: [],
  availability: '24/7 Platform Oversight',
  rating: 5.0,
  totalRatings: 100,
  bio: 'Designated moderation account for overseeing peer interactions, reviewing self-registration requests, and campus safety.',
  avatarColor: '#dc2626',
  isAdmin: true,
  status: 'active'
};

// Initial Seed Users (Campus-focused peer network) with demo passwords
const INITIAL_USERS = [
  {
    id: 'user_inderpal',
    name: 'Inderpal Singh',
    rollNumber: '25001011020',
    college: 'J.C. Bose UST, YMCA Faridabad',
    year: '4th Year',
    branch: 'Information Technology',
    email: 'inderpal.it@jcboseust.ac.in',
    password: 'peerpath123',
    skillsTeach: ['Python', 'Machine Learning'],
    skillsLearn: ['React.js', 'Video Editing'],
    availability: 'Mon, Wed, Fri (5:00 PM - 7:00 PM)',
    rating: 4.9,
    totalRatings: 7,
    bio: 'Passionate about Python programming, scikit-learn, and predictive modeling. Eager to master React & modern video editing for my campus tech projects!',
    avatarColor: '#4f46e5',
    joinedDate: '2026-08-15',
    status: 'active'
  },
  {
    id: 'user_aarav',
    name: 'Aarav Sharma',
    rollNumber: '25001011045',
    college: 'J.C. Bose UST, YMCA Faridabad',
    year: '3rd Year',
    branch: 'Computer Engineering',
    email: 'aarav.ce@jcboseust.ac.in',
    password: 'peerpath123',
    skillsTeach: ['React.js', 'Tailwind CSS'],
    skillsLearn: ['Python', 'DSA in C++'],
    availability: 'Tue, Thu, Sat (6:00 PM - 8:00 PM)',
    rating: 4.8,
    totalRatings: 11,
    bio: 'Frontend developer building fast web apps. Happy to teach React state, hooks and component architecture in exchange for Python basics and DSA guidance.',
    avatarColor: '#0ea5e9',
    joinedDate: '2026-08-20',
    status: 'active'
  },
  {
    id: 'user_priya',
    name: 'Priya Patel',
    rollNumber: '2023EC4012',
    college: 'Delhi Technological University (DTU)',
    year: '2nd Year',
    branch: 'Electronics & Communication',
    email: 'priya.dtu@gmail.com',
    password: 'peerpath123',
    skillsTeach: ['UI/UX Design', 'Figma'],
    skillsLearn: ['Web Development', 'Python'],
    availability: 'Weekends (11:00 AM - 3:00 PM)',
    rating: 4.95,
    totalRatings: 14,
    bio: 'Figma enthusiast! I love teaching wireframing, color theory, design systems, and clickable prototypes. Looking to grasp the basics of frontend coding.',
    avatarColor: '#ec4899',
    joinedDate: '2026-08-25',
    status: 'active'
  },
  {
    id: 'user_rohan',
    name: 'Rohan Verma',
    rollNumber: '2022IT8910',
    college: 'Netaji Subhas University of Technology (NSUT)',
    year: '4th Year',
    branch: 'Information Technology',
    email: 'rohan.it@nsut.ac.in',
    password: 'peerpath123',
    skillsTeach: ['DSA in C++', 'Competitive Coding'],
    skillsLearn: ['Public Speaking', 'System Design'],
    availability: 'Daily after 7:30 PM',
    rating: 4.7,
    totalRatings: 9,
    bio: 'Solved 650+ problems on LeetCode. Mentoring peers in trees, dynamic programming, and interview problem-solving techniques.',
    avatarColor: '#10b981',
    joinedDate: '2026-09-01',
    status: 'active'
  },
  {
    id: 'user_sneha',
    name: 'Sneha Reddy',
    rollNumber: '2024CSAI055',
    college: 'IIIT Delhi',
    year: '2nd Year',
    branch: 'Computer Science & AI',
    email: 'sneha.reddy@iiitd.ac.in',
    password: 'peerpath123',
    skillsTeach: ['Video Editing', 'Premiere Pro'],
    skillsLearn: ['Machine Learning', 'Python'],
    availability: 'Mon, Thu, Sun (4:00 PM - 6:00 PM)',
    rating: 5.0,
    totalRatings: 5,
    bio: 'Campus creator & video editor. Proficient in Premiere Pro, sound design, and storytelling. Really keen to understand ML classifiers and math.',
    avatarColor: '#8b5cf6',
    joinedDate: '2026-09-10',
    status: 'active'
  },
  {
    id: 'user_karan',
    name: 'Karan Malhotra',
    rollNumber: '2023ME2019',
    college: 'IIT Delhi',
    year: '3rd Year',
    branch: 'Mechanical Engineering',
    email: 'karan.m@iitd.ac.in',
    password: 'peerpath123',
    skillsTeach: ['Public Speaking', 'Debating'],
    skillsLearn: ['UI/UX Design', 'Product Management'],
    availability: 'Weekends (4:00 PM - 7:00 PM)',
    rating: 4.65,
    totalRatings: 6,
    bio: 'Debating society president. Offering tips on stage confidence, impromptu speech delivery, and presentation pitch decks.',
    avatarColor: '#f59e0b',
    joinedDate: '2026-09-15',
    status: 'active'
  },
  {
    id: 'user_ananya',
    name: 'Ananya Deshmukh',
    rollNumber: '25001011088',
    college: 'J.C. Bose UST, YMCA Faridabad',
    year: '3rd Year',
    branch: 'Computer Engineering',
    email: 'ananya.ce@jcboseust.ac.in',
    password: 'peerpath123',
    skillsTeach: ['Flutter', 'Mobile App Dev'],
    skillsLearn: ['DSA in C++', 'Machine Learning'],
    availability: 'Wed & Fri (3:00 PM - 5:00 PM)',
    rating: 4.85,
    totalRatings: 8,
    bio: 'Flutter developer with 2 published applications on Play Store. Can teach cross-platform widgets, state management & API integration.',
    avatarColor: '#06b6d4',
    joinedDate: '2026-09-22',
    status: 'active'
  }
];

// Seed Registration Requests (pending approval by Admin)
const INITIAL_REG_REQUESTS = [
  {
    id: 'reg_101',
    name: 'Vikram Malhotra',
    rollNumber: '25001011099',
    college: 'J.C. Bose UST, YMCA Faridabad',
    year: '2nd Year',
    branch: 'Mechanical Engineering',
    email: 'vikram.m@jcboseust.ac.in',
    password: 'peerpath123',
    skillsTeach: ['AutoCAD', 'SolidWorks 3D'],
    skillsLearn: ['Python', '3D Printing'],
    availability: 'Tue & Thu (4:00 PM - 6:00 PM)',
    bio: 'Mechanical engineering sophomore interested in robotics and 3D modeling. Excited to exchange CAD knowledge for Python basics.',
    status: 'pending',
    requestedAt: '2026-10-18T14:20:00.000Z'
  },
  {
    id: 'reg_102',
    name: 'Ritu Sen',
    rollNumber: '2024CS3301',
    college: 'Delhi Technological University (DTU)',
    year: '1st Year',
    branch: 'Computer Science',
    email: 'ritu.sen@dtu.ac.in',
    password: 'peerpath123',
    skillsTeach: ['Graphic Design', 'Canva Pro'],
    skillsLearn: ['C++ Basics', 'Web Development'],
    availability: 'Weekends (2:00 PM - 5:00 PM)',
    bio: 'First year CS fresher who loves creating visuals and brand assets. Want a peer to mentor me through basic C++ loops and pointers.',
    status: 'pending',
    requestedAt: '2026-10-19T06:45:00.000Z'
  }
];

// Initial Seed Sessions
const INITIAL_SESSIONS = [
  {
    id: 'sess_101',
    requesterId: 'user_inderpal',
    requesterName: 'Inderpal Singh',
    targetId: 'user_aarav',
    targetName: 'Aarav Sharma',
    skill: 'React.js',
    status: 'confirmed',
    scheduledDate: '2026-10-22',
    scheduledTime: '18:00',
    meetingUrl: 'https://meet.jit.si/peerpath-inderpal-aarav-react',
    note: 'Hi Aarav, looking to build an interactive frontend and learn React state & components!',
    createdAt: '2026-10-18T10:15:00.000Z',
    ratingByRequester: null,
    ratingByTarget: null,
    messages: [
      {
        id: 'msg_1',
        senderId: 'user_aarav',
        senderName: 'Aarav Sharma',
        text: 'Hey Inderpal! Super excited for our session. I have set up a quick 1-hour roadmap starting from JSX to React useState.',
        timestamp: '2026-10-18T11:00:00.000Z'
      },
      {
        id: 'msg_2',
        senderId: 'user_inderpal',
        senderName: 'Inderpal Singh',
        text: 'Sounds perfect Aarav! I have Node.js and VS Code set up. Looking forward to our call tomorrow at 6 PM.',
        timestamp: '2026-10-18T11:15:00.000Z'
      }
    ]
  },
  {
    id: 'sess_102',
    requesterId: 'user_sneha',
    requesterName: 'Sneha Reddy',
    targetId: 'user_inderpal',
    targetName: 'Inderpal Singh',
    skill: 'Machine Learning',
    status: 'pending',
    scheduledDate: '2026-10-24',
    scheduledTime: '16:30',
    meetingUrl: 'https://meet.jit.si/peerpath-sneha-inderpal-ml',
    note: 'Hello Inderpal! I saw you are skilled in Python & ML. I would love a session on scikit-learn basics. I can teach you Premiere Pro video editing in return!',
    createdAt: '2026-10-19T08:30:00.000Z',
    ratingByRequester: null,
    ratingByTarget: null,
    messages: [
      {
        id: 'msg_3',
        senderId: 'user_sneha',
        senderName: 'Sneha Reddy',
        text: 'Hi Inderpal! Sent you a session request for ML basics. Looking forward to connecting!',
        timestamp: '2026-10-19T08:32:00.000Z'
      }
    ]
  },
  {
    id: 'sess_103',
    requesterId: 'user_priya',
    requesterName: 'Priya Patel',
    targetId: 'user_inderpal',
    targetName: 'Inderpal Singh',
    skill: 'Python',
    status: 'completed',
    scheduledDate: '2026-10-15',
    scheduledTime: '14:00',
    meetingUrl: 'https://meet.jit.si/peerpath-priya-inderpal-python',
    note: 'Learning Python syntax and data handling.',
    createdAt: '2026-10-12T09:00:00.000Z',
    ratingByRequester: 5,
    ratingByTarget: 5,
    messages: [
      {
        id: 'msg_4',
        senderId: 'user_priya',
        senderName: 'Priya Patel',
        text: 'Thank you for explaining Python loops and functions so clearly Inderpal!',
        timestamp: '2026-10-15T15:05:00.000Z'
      },
      {
        id: 'msg_5',
        senderId: 'user_inderpal',
        senderName: 'Inderpal Singh',
        text: 'You are welcome Priya! Great job on writing your first script.',
        timestamp: '2026-10-15T15:10:00.000Z'
      }
    ]
  }
];

// Initialize Storage if empty
function initStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SESSIONS)) {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(INITIAL_SESSIONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.REGISTRATION_REQUESTS)) {
    localStorage.setItem(STORAGE_KEYS.REGISTRATION_REQUESTS, JSON.stringify(INITIAL_REG_REQUESTS));
  }
}

// User CRUD Helpers
function getUsers() {
  initStorage();
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
    const seenEmails = new Set();
    const seenIds = new Set();
    const deduped = [];
    for (const u of raw) {
      const emailKey = (u.email || '').toLowerCase().trim();
      const idKey = u.id;
      if (emailKey && seenEmails.has(emailKey)) continue;
      if (idKey && seenIds.has(idKey)) continue;
      if (emailKey) seenEmails.add(emailKey);
      if (idKey) seenIds.add(idKey);
      deduped.push(u);
    }
    if (deduped.length !== raw.length) {
      saveUsers(deduped);
    }
    return deduped;
  } catch (e) {
    console.error('Error parsing users from localStorage', e);
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

function getUserById(id) {
  if (id === 'user_admin' || id === 'admin') return ADMIN_USER;
  const users = getUsers();
  return users.find(u => u.id === id) || null;
}

function getUserByEmail(email) {
  if (!email) return null;
  const lower = email.toLowerCase().trim();
  if (lower === ADMIN_USER.email.toLowerCase()) return ADMIN_USER;
  const users = getUsers();
  return users.find(u => u.email.toLowerCase().trim() === lower) || null;
}

function updateUser(id, updatedFields) {
  const users = getUsers();
  const index = users.findIndex(u => u.id === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...updatedFields };
    saveUsers(users);
    
    // Also update logged-in session user if this is the active user
    const current = getLoggedInUser();
    if (current && current.id === id) {
      setLoggedInUser(users[index]);
    }
    return users[index];
  }
  return null;
}

function deleteUser(id) {
  let users = getUsers();
  users = users.filter(u => u.id !== id);
  saveUsers(users);

  // Also clean up associated sessions
  let sessions = getSessions();
  sessions = sessions.filter(s => s.requesterId !== id && s.targetId !== id);
  saveSessions(sessions);

  // If deleted user was active user, log them out
  const current = getLoggedInUser();
  if (current && current.id === id) {
    logoutUser();
  }
}

function addUser(userData) {
  const users = getUsers();
  const newUser = {
    id: 'user_' + Date.now(),
    name: userData.name || 'Anonymous Student',
    rollNumber: userData.rollNumber || 'N/A',
    college: userData.college || 'YMCA Faridabad',
    year: userData.year || '1st Year',
    branch: userData.branch || 'Information Technology',
    email: userData.email,
    password: userData.password || 'peerpath123',
    skillsTeach: userData.skillsTeach || [],
    skillsLearn: userData.skillsLearn || [],
    availability: userData.availability || 'Flexible',
    rating: 5.0,
    totalRatings: 1,
    bio: userData.bio || '',
    avatarColor: userData.avatarColor || '#6366f1',
    joinedDate: new Date().toISOString().split('T')[0],
    status: 'active'
  };
  users.push(newUser);
  saveUsers(users);
  return newUser;
}

// Registration Requests (Self-registration to admin)
function getRegistrationRequests() {
  initStorage();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.REGISTRATION_REQUESTS)) || [];
  } catch (e) {
    console.error('Error parsing registration requests from localStorage', e);
    return [];
  }
}

function saveRegistrationRequests(requests) {
  localStorage.setItem(STORAGE_KEYS.REGISTRATION_REQUESTS, JSON.stringify(requests));
}

function addRegistrationRequest(reqData) {
  const requests = getRegistrationRequests();
  const newRequest = {
    id: 'reg_' + Date.now(),
    name: reqData.name,
    rollNumber: reqData.rollNumber,
    college: reqData.college,
    year: reqData.year,
    branch: reqData.branch,
    email: reqData.email.toLowerCase().trim(),
    password: reqData.password,
    skillsTeach: reqData.skillsTeach || [],
    skillsLearn: reqData.skillsLearn || [],
    availability: reqData.availability || 'Flexible',
    bio: reqData.bio || '',
    status: 'pending',
    requestedAt: new Date().toISOString()
  };
  requests.unshift(newRequest);
  saveRegistrationRequests(requests);
  return newRequest;
}

function approveRegistrationRequest(requestId) {
  const requests = getRegistrationRequests();
  const req = requests.find(r => r.id === requestId);
  if (!req) return null;

  req.status = 'approved';
  saveRegistrationRequests(requests);

  // Pick an avatar color
  const colors = ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];
  const avatarColor = colors[Math.floor(Math.random() * colors.length)];

  // Create active user
  const newUser = addUser({
    name: req.name,
    rollNumber: req.rollNumber,
    college: req.college,
    year: req.year,
    branch: req.branch,
    email: req.email,
    password: req.password,
    skillsTeach: req.skillsTeach,
    skillsLearn: req.skillsLearn,
    availability: req.availability,
    bio: req.bio,
    avatarColor
  });

  return newUser;
}

function rejectRegistrationRequest(requestId, reason = 'Campus requirements not met') {
  const requests = getRegistrationRequests();
  const req = requests.find(r => r.id === requestId);
  if (!req) return null;

  req.status = 'rejected';
  req.rejectionReason = reason;
  saveRegistrationRequests(requests);
  return req;
}

// Authentication & Session Management
function authenticate(email, password) {
  initStorage();
  const lowerEmail = (email || '').toLowerCase().trim();
  const trimmedPassword = (password || '').trim();

  // 1. Admin login check
  if (lowerEmail === ADMIN_USER.email.toLowerCase()) {
    if (trimmedPassword === ADMIN_USER.password) {
      setLoggedInUser(ADMIN_USER);
      return { success: true, user: ADMIN_USER };
    } else {
      return { success: false, error: 'Invalid password for Administrator. (Default: admin123)' };
    }
  }

  // 2. Active Student login check
  const users = getUsers();
  const matchedUser = users.find(u => u.email.toLowerCase().trim() === lowerEmail);
  if (matchedUser) {
    const validPassword = matchedUser.password || 'peerpath123';
    if (trimmedPassword === validPassword) {
      setLoggedInUser(matchedUser);
      return { success: true, user: matchedUser };
    } else {
      return { success: false, error: 'Incorrect password. (Default for demo accounts: peerpath123)' };
    }
  }

  // 3. Check if there is a pending registration request for this email
  const requests = getRegistrationRequests();
  const pendingReq = requests.find(r => r.email.toLowerCase().trim() === lowerEmail && r.status === 'pending');
  if (pendingReq) {
    return { 
      success: false, 
      error: 'Your registration request is currently PENDING approval by the campus administrator. Please wait for the admin to approve your account.' 
    };
  }

  const rejectedReq = requests.find(r => r.email.toLowerCase().trim() === lowerEmail && r.status === 'rejected');
  if (rejectedReq) {
    return { 
      success: false, 
      error: `Your registration request was declined by the administrator. (${rejectedReq.rejectionReason || 'Declined'})` 
    };
  }

  return { success: false, error: 'No account found with this email. Please submit a registration request for admin approval.' };
}

function getLoggedInUser() {
  initStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSION_USER);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function setLoggedInUser(user) {
  if (!user) {
    localStorage.removeItem(STORAGE_KEYS.SESSION_USER);
  } else {
    localStorage.setItem(STORAGE_KEYS.SESSION_USER, JSON.stringify(user));
  }
  window.dispatchEvent(new CustomEvent('peerpath:userChanged', { detail: { user } }));
}

function logoutUser() {
  localStorage.removeItem(STORAGE_KEYS.SESSION_USER);
  window.dispatchEvent(new CustomEvent('peerpath:loggedOut'));
}

// Active User Compatibility (for existing modules)
function getActiveUserId() {
  const current = getLoggedInUser();
  return current ? current.id : null;
}

function getActiveUser() {
  return getLoggedInUser();
}

// Sessions CRUD Helpers
function getSessions() {
  initStorage();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSIONS)) || [];
  } catch (e) {
    console.error('Error parsing sessions from localStorage', e);
    return [];
  }
}

function saveSessions(sessions) {
  localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
}

function getSessionById(id) {
  const sessions = getSessions();
  return sessions.find(s => s.id === id) || null;
}

function addSession(sessionData) {
  const sessions = getSessions();
  const newSession = {
    id: 'sess_' + Date.now(),
    requesterId: sessionData.requesterId,
    requesterName: sessionData.requesterName,
    targetId: sessionData.targetId,
    targetName: sessionData.targetName,
    skill: sessionData.skill,
    status: 'pending',
    scheduledDate: sessionData.scheduledDate,
    scheduledTime: sessionData.scheduledTime,
    meetingUrl: `https://meet.jit.si/peerpath-${encodeURIComponent(sessionData.skill.toLowerCase().replace(/[^a-z0-9]/g, ''))}-${Date.now().toString().slice(-4)}`,
    note: sessionData.note || '',
    createdAt: new Date().toISOString(),
    ratingByRequester: null,
    ratingByTarget: null,
    messages: []
  };
  sessions.unshift(newSession);
  saveSessions(sessions);
  return newSession;
}

function updateSession(id, updatedFields) {
  const sessions = getSessions();
  const index = sessions.findIndex(s => s.id === id);
  if (index !== -1) {
    sessions[index] = { ...sessions[index], ...updatedFields };
    saveSessions(sessions);
    return sessions[index];
  }
  return null;
}

function deleteSession(id) {
  let sessions = getSessions();
  sessions = sessions.filter(s => s.id !== id);
  saveSessions(sessions);
}

function addMessageToSession(sessionId, message) {
  const sessions = getSessions();
  const index = sessions.findIndex(s => s.id === sessionId);
  if (index !== -1) {
    if (!sessions[index].messages) {
      sessions[index].messages = [];
    }
    const newMsg = {
      id: 'msg_' + Date.now(),
      senderId: message.senderId,
      senderName: message.senderName,
      text: message.text,
      timestamp: new Date().toISOString()
    };
    sessions[index].messages.push(newMsg);
    saveSessions(sessions);
    return newMsg;
  }
  return null;
}

// Reset data to defaults for demoing
function resetAllData() {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
  localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(INITIAL_SESSIONS));
  localStorage.setItem(STORAGE_KEYS.REGISTRATION_REQUESTS, JSON.stringify(INITIAL_REG_REQUESTS));
  localStorage.setItem(STORAGE_KEYS.SESSION_USER, JSON.stringify(INITIAL_USERS[0]));
  window.dispatchEvent(new CustomEvent('peerpath:dataReset'));
}

// Attach to window for global access
window.PeerPathData = {
  STORAGE_KEYS,
  ADMIN_USER,
  initStorage,
  getUsers,
  saveUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
  addUser,
  getRegistrationRequests,
  saveRegistrationRequests,
  addRegistrationRequest,
  approveRegistrationRequest,
  rejectRegistrationRequest,
  authenticate,
  getLoggedInUser,
  setLoggedInUser,
  logoutUser,
  getActiveUserId,
  getActiveUser,
  getSessions,
  saveSessions,
  getSessionById,
  addSession,
  updateSession,
  deleteSession,
  addMessageToSession,
  resetAllData
};

// Initialize immediately
initStorage();
